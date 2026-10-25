import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes, randomUUID } from 'crypto';
import ms, { type StringValue } from 'ms';
import {
    RefreshTokenFamily,
    RefreshTokenRotation,
    RefreshTokenRotationResult,
    RotatedRefreshToken,
    StoredRefreshToken,
} from './refresh-token.types';
import { RedisService } from '../../redis/redis.service';
import { ROTATE_REFRESH_TOKEN_SCRIPT } from './refresh-token.scripts';



@Injectable()
export class RefreshTokenService {

    private readonly logger = new Logger(RefreshTokenService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
    ) { }

    private readonly refreshTokenPrefix = 'auth:refresh:token:';
    private readonly usedTokenPrefix = 'auth:refresh:used:';
    private readonly familyPrefix = 'auth:refresh:family:';
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
        const familyId = randomUUID();
        const rawToken = this.generateRawRefreshToken();
        const tokenHash = this.hashRefreshToken(rawToken);

        const familyTtlSeconds = this.getFamilyTtlSeconds();
        const tokenTtlSeconds = Math.min(
            this.getTtlSeconds(),
            familyTtlSeconds,
        );

        const now = Date.now();
        const tokenExpiresAt = now + tokenTtlSeconds * 1000;
        const familyExpiresAt = now + familyTtlSeconds * 1000;

        const storedToken: StoredRefreshToken = {
            userId,
            familyId,
        };

        const tokenFamily: RefreshTokenFamily = {
            userId,
            currentTokenHash: tokenHash,
            expiresAt: familyExpiresAt,
        };

        const tokenKey = this.tokenKey(tokenHash);
        const familyKey = this.familyKey(familyId);
        const userKey = this.userKey(userId);

        const results = await this.redisService.client
            .multi()
            .zremrangebyscore(userKey, 0, now)
            .set(
                tokenKey,
                JSON.stringify(storedToken),
                'EX',
                tokenTtlSeconds,
            )
            .set(
                familyKey,
                JSON.stringify(tokenFamily),
                'EX',
                familyTtlSeconds,
            )
            .zadd(userKey, tokenExpiresAt, tokenHash)
            .expire(userKey, tokenTtlSeconds)
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

    async getUserIdFromRefreshToken(rawToken: string): Promise<string> {
        if (!rawToken) {
            throw new UnauthorizedException('Refresh token is required');
        }

        const tokenHash = this.hashRefreshToken(rawToken);
        const serializedToken = await this.redisService.client.get(
            this.tokenKey(tokenHash),
        );
        const storedToken = this.parseStoredRefreshToken(serializedToken);

        if (!storedToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        return storedToken.userId;
    }

    async rotate(rawRefreshToken: string): Promise<RotatedRefreshToken> {
        if (!rawRefreshToken) {
            throw new UnauthorizedException('Refresh token is required');
        }

        const currentTokenHash = this.hashRefreshToken(rawRefreshToken);
        const replacementRefreshToken = this.generateRawRefreshToken();
        const replacementTokenHash = this.hashRefreshToken(replacementRefreshToken);

        const rotation = await this.rotateTokenFamily(
            currentTokenHash,
            replacementTokenHash,
        );
        const userId = this.getRotatedUserId(rotation);

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
        const serializedToken = await this.redisService.client.getdel(
            this.tokenKey(tokenHash),
        );
        const storedToken = this.parseStoredRefreshToken(serializedToken);
        const familyId = storedToken?.familyId
            ?? await this.redisService.client.get(this.usedTokenKey(tokenHash));

        if (!familyId) {
            return;
        }

        await this.removeRefreshTokenFamily(familyId);
    }

    async revokeAllForUser(userId: string): Promise<void> {
        const userKey = this.userKey(userId);
        const tokenHashes = await this.redisService.client.zrange(userKey, 0, -1);

        for (const tokenHash of tokenHashes) {
            const serializedToken = await this.redisService.client.get(
                this.tokenKey(tokenHash),
            );
            const storedToken = this.parseStoredRefreshToken(serializedToken);

            if (storedToken) {
                await this.removeRefreshTokenFamily(storedToken.familyId);
            }

            await this.redisService.client.zrem(userKey, tokenHash);
        }
    }

    private tokenKey(tokenHash: string): string {
        return `${this.refreshTokenPrefix}${tokenHash}`;
    }

    private userKey(userId: string): string {
        return `${this.userPrefix}${userId}`;
    }

    private usedTokenKey(tokenHash: string): string {
        return `${this.usedTokenPrefix}${tokenHash}`;
    }

    private familyKey(familyId: string): string {
        return `${this.familyPrefix}${familyId}`;
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

    private getFamilyTtlSeconds(): number {
        const expirationMilliseconds = ms(
            this.configService.getOrThrow<StringValue>(
                'REFRESH_TOKEN_FAMILY_EXPIRATION_TIME',
            ),
        );

        return Math.ceil(expirationMilliseconds / 1000);
    }

    /**
     * 
     * @param serializedToken  - serialized refresh token
     * @example { "userId": "123", "familyId": "456" }
     * @returns StoredRefreshToken | null
     */
    private parseStoredRefreshToken(serializedToken: string | null,): StoredRefreshToken | null {
        if (!serializedToken) {
            return null;
        }

        try {
            const storedToken = JSON.parse(serializedToken) as StoredRefreshToken;

            if (!storedToken.userId || !storedToken.familyId) {
                return null;
            }

            return storedToken;
        } catch {
            return null;
        }
    }

    private parseRefreshTokenFamily(
        serializedFamily: string | null,
    ): RefreshTokenFamily | null {
        if (!serializedFamily) {
            return null;
        }

        try {
            const tokenFamily = JSON.parse(serializedFamily) as RefreshTokenFamily;

            if (!tokenFamily.userId || !tokenFamily.currentTokenHash) {
                return null;
            }

            return tokenFamily;
        } catch {
            return null;
        }
    }

    /**
     * Removes a token family, its current refresh token, and that token's user-index entry.
     */
    private async removeRefreshTokenFamily(familyId: string): Promise<void> {
        const serializedFamily = await this.redisService.client.getdel(
            this.familyKey(familyId),
        );
        const tokenFamily = this.parseRefreshTokenFamily(serializedFamily);

        if (!tokenFamily) {
            return;
        }

        await this.redisService.client
            .multi()
            .del(this.tokenKey(tokenFamily.currentTokenHash))
            .zrem(
                this.userKey(tokenFamily.userId),
                tokenFamily.currentTokenHash,
            )
            .exec();
    }

    /**
 * Atomically rotates a token family.
 * A reused token revokes that family instead of creating a replacement.
 */
    private async rotateTokenFamily(
        currentTokenHash: string,
        replacementTokenHash: string,
    ): Promise<RefreshTokenRotation> {
        const redisResult = await this.redisService.client.eval(
            ROTATE_REFRESH_TOKEN_SCRIPT,
            3,
            this.tokenKey(currentTokenHash),
            this.tokenKey(replacementTokenHash),
            this.usedTokenKey(currentTokenHash),
            currentTokenHash,
            replacementTokenHash,
            String(this.getTtlSeconds()),
            String(Date.now()),
            this.familyPrefix,
            this.refreshTokenPrefix,
            this.userPrefix,
        );

        return this.parseRotationResult(redisResult);
    }

    private parseRotationResult(redisResult: unknown): RefreshTokenRotation {
        if (!Array.isArray(redisResult)) {
            throw new Error('Unexpected refresh token rotation result');
        }

        const [result, userId] = redisResult;

        return {
            result: Number(result) as RefreshTokenRotationResult,
            userId: typeof userId === 'string' ? userId : undefined,
        };
    }

    private getRotatedUserId(rotation: RefreshTokenRotation): string {
        if (rotation.result === RefreshTokenRotationResult.ReuseDetected) {
            this.logger.warn('Refresh token reuse detected');
        }

        if (rotation.result !== RefreshTokenRotationResult.Rotated || !rotation.userId) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        return rotation.userId;
    }







}
