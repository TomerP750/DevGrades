import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ms, { type StringValue } from 'ms';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './refresh-tokens.entity';

@Injectable()
export class RefreshTokenService {
    constructor(
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepository: Repository<RefreshToken>,
        private readonly configService: ConfigService,
    ) { }

    async createRefreshToken(userId: string): Promise<string> {

        const rawToken = this.generateRawRefreshToken();
        const hashedToken = this.hashRefreshToken(rawToken);
        const expiresAt = new Date(Date.now() + ms(
            this.configService.getOrThrow<StringValue>('REFRESH_TOKEN_EXPIRATION_TIME')
        ));
        const refreshToken = this.refreshTokenRepository.create({
            tokenHash: hashedToken,
            userId,
            expiresAt,
            revoked: false,
        });
        await this.refreshTokenRepository.save(refreshToken);
        return rawToken;

    }

    async getValidatedRefreshToken(rawToken: string): Promise<RefreshToken> {

        if (!rawToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const hashedToken = await this.hashRefreshToken(rawToken);
        const validatedRefreshToken = await this.refreshTokenRepository.findOneBy({
            tokenHash: hashedToken,
        });

        if (
            !validatedRefreshToken ||
            !this.isRefreshTokenValid(validatedRefreshToken)
        ) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        return validatedRefreshToken;

    }

    async rotate(rawToken: string): Promise<{ refreshToken: string; userId: string }> {
        
        if (!rawToken) {
            throw new UnauthorizedException('Missing refresh token');
        }

        const oldTokenHash = await this.hashRefreshToken(rawToken);
        const newRawToken = await this.generateRawRefreshToken();
        const newTokenHash = await this.hashRefreshToken(newRawToken);

        return this.refreshTokenRepository.manager.transaction(async manager => {
            const oldRefreshToken = await manager.findOne(RefreshToken, {
                where: { tokenHash: oldTokenHash },
                lock: { mode: 'pessimistic_write' },
            });

            if (
                !oldRefreshToken ||
                !this.isRefreshTokenValid(oldRefreshToken)
            ) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const rotationTimestamp = new Date();
            const refreshTokenExpiration = new Date(
                rotationTimestamp.getTime() +
                ms(this.configService.getOrThrow<StringValue>('JWT_REFRESH_TOKEN_EXPIRATION')),
            );

            oldRefreshToken.revoked = true;
            await manager.save(oldRefreshToken);

            const newRefreshToken = manager.create(RefreshToken, {
                tokenHash: newTokenHash,
                userId: oldRefreshToken.userId,
                expiresAt: refreshTokenExpiration,
                revoked: false,
            });

            await manager.save(newRefreshToken);
            return {
                refreshToken: newRawToken,
                userId: oldRefreshToken.userId,
            };
        });
    }

    async revokeRefreshToken(rawToken: string) {
        const hashedToken = await this.hashRefreshToken(rawToken);
        await this.refreshTokenRepository.update(
            { tokenHash: hashedToken },
            { revoked: true }
        );
    }

    async revokeAllForUser(userId: string) {
        await this.refreshTokenRepository.update({ userId }, { revoked: true });
    }

    private generateRawRefreshToken(): string {
        return randomBytes(32).toString('hex');
    }

    private hashRefreshToken(rawToken: string): string {
        return createHash('sha256').update(rawToken).digest('hex');
    }

    private isRefreshTokenValid(refreshToken: RefreshToken): boolean {
        return !refreshToken.revoked && refreshToken.expiresAt > new Date();
    }

}
