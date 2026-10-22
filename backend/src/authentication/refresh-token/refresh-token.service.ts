import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'crypto';
import ms, { type StringValue } from 'ms';
import { RedisService } from '../../redis/redis.service';
import { REPLACE_REFRESH_TOKEN_SCRIPT } from './refresh-token.scripts';


interface RefreshTokenReplacement {
    userId: string;
    currentTokenHash: string;
    replacementTokenHash: string;
    ttlSeconds: number;
    replacementExpiresAt: number;
    rotationTimestamp: number;
}

@Injectable()
export class RefreshTokenService {

    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
    ) { }

    private readonly refreshTokenPrefix = 'auth:refresh:token:';
    private readonly userPrefix = 'auth:refresh:user:';

    async createRefreshToken(userId: string): Promise<string> {
        return this.createAtomicRefreshToken(userId);
    }

    /**
     * Creates a refresh token and stores its hash and user index entry in one
     * Redis transaction so other commands cannot interleave with creation.
     *
     * This method only guarantees atomic token creation. Calling it after a
     * separate read or deletion does not make the entire rotation atomic.
     */
    private async createAtomicRefreshToken(userId: string): Promise<string> {
        const rawToken = this.generateRawRefreshToken();
        const tokenHash = this.hashRefreshToken(rawToken);
        const ttlSeconds = this.getTtlSeconds();
        const expiresAt = Date.now() + ttlSeconds * 1000;

        const tokenKey = this.tokenKey(tokenHash);
        const userKey = this.userKey(userId);

        const results = await this.redisService.client
            .multi()
            .zremrangebyscore(userKey, 0, Date.now())
            .set(tokenKey, userId, 'EX', ttlSeconds)
            .zadd(userKey, expiresAt, tokenHash)
            .expire(userKey, ttlSeconds)
            .exec();

        if (!results) {
            throw new Error('Failed to create refresh token');
        }

        const failedCommand = results.find(([error]) => error !== null);

        if (failedCommand) {
            throw failedCommand[0];
        }

        return rawToken;
    }

    /**
     * Resolves the user associated with a valid refresh token.
     *
     * @throws UnauthorizedException when the token is missing, invalid,
     * revoked, or expired.
     */
    async getUserIdFromRefreshToken(rawToken: string): Promise<string> {
        if (!rawToken) {
            throw new UnauthorizedException('Refresh token is required');
        }

        const tokenHash = this.hashRefreshToken(rawToken);
        const userId = await this.redisService.client.get(
            this.tokenKey(tokenHash),
        );

        if (!userId) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        return userId;
    }

    async rotate(rawRefreshToken: string,): Promise<{ refreshToken: string; userId: string }> {
        if (!rawRefreshToken) {
            throw new UnauthorizedException('Refresh token is required');
        }

        const currentTokenHash = this.hashRefreshToken(rawRefreshToken);
        const currentTokenKey = this.tokenKey(currentTokenHash);
        const userId =
            await this.redisService.client.get(currentTokenKey);

        if (!userId) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const replacementRefreshToken = this.generateRawRefreshToken();
        const replacementTokenHash = this.hashRefreshToken(
            replacementRefreshToken,
        );
        const ttlSeconds = this.getTtlSeconds();
        const rotationTimestamp = Date.now();
        const replacementExpiresAt =
            rotationTimestamp + ttlSeconds * 1000;

        const tokenWasReplaced = await this.replaceRefreshTokenAtomically({
            userId,
            currentTokenHash,
            replacementTokenHash,
            ttlSeconds,
            replacementExpiresAt,
            rotationTimestamp,
        });

        if (!tokenWasReplaced) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        return {
            refreshToken: replacementRefreshToken,
            userId,
        };
    }

    async revokeRefreshToken(rawToken: string): Promise<void> {

        if (!rawToken) {
            return;
        }

        const tokenHash = this.hashRefreshToken(rawToken);
        const tokenKey = this.tokenKey(tokenHash);

        const userId = await this.redisService.client.get(tokenKey);

        if (!userId) {
            return;
        }

        await this.redisService.client.zrem(
            this.userKey(userId),
            tokenHash,
        )
    }

    async revokeAllForUser(userId: string): Promise<void> {

    }

    private tokenKey(tokenHash: string): string {
        return `${this.refreshTokenPrefix}${tokenHash}`;
    }

    private userKey(userId: string): string {
        return `${this.userPrefix}${userId}`;
    }

    /**
     * Consumes the current token and creates its replacement as one
     * non-interleavable Redis operation. A false result means another request
     * already consumed or revoked the current token.
     */
    private async replaceRefreshTokenAtomically(
        replacement: RefreshTokenReplacement,
    ): Promise<boolean> {
        const {
            userId,
            currentTokenHash,
            replacementTokenHash,
            ttlSeconds,
            replacementExpiresAt,
            rotationTimestamp,
        } = replacement;

        const result = await this.redisService.client.eval(
            REPLACE_REFRESH_TOKEN_SCRIPT,
            3,
            this.tokenKey(currentTokenHash),
            this.tokenKey(replacementTokenHash),
            this.userKey(userId),
            userId,
            currentTokenHash,
            replacementTokenHash,
            String(ttlSeconds),
            String(replacementExpiresAt),
            String(rotationTimestamp),
        );

        return Number(result) === 1;
    }

    private generateRawRefreshToken(): string {
        return randomBytes(32).toString('hex');
    }
    private hashRefreshToken(rawToken: string): string {
        return createHash('sha256').update(rawToken).digest('hex');
    }

    private getTtlSeconds(): number {
        const expirationMilliseconds = ms(
            this.configService.getOrThrow<StringValue>(
                'REFRESH_TOKEN_EXPIRATION_TIME',
            ),
        );
        return Math.ceil(expirationMilliseconds / 1000);
    }







}
