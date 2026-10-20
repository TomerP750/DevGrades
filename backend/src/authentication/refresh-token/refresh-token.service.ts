import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'crypto';
import ms, { type StringValue } from 'ms';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class RefreshTokenService {
    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
    ) { }

    private readonly refreshTokenPrefix = 'refresh_token:';
    private readonly userPrefix = 'refresh:user:';

    async createRefreshToken(userId: string): Promise<string> {

    }

    async getValidatedRefreshToken(token: string): Promise<string> {

    }

    async rotate() {

    }

    async revokeRefreshToken(token: string): Promise<void> {

    }

    async revokeAllForUser(userId: string): Promise<void> {
        
    }



    private tokenKey(tokenHash: string): string {
        return `${this.refreshTokenPrefix}${tokenHash}`;
    }

    private userKey(userId: string): string {
        return `${this.userPrefix}${userId}`;
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
