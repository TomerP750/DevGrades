import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInRequestDto } from './dtos/signin.dto';
import { SignUpRequestDto } from './dtos/signup.dto';
import { UsersService } from '../users/users.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { User } from '../users/users.entity';
import { InternalAuthResponseDto } from './dtos/internal-auth-response.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthenticationService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly refreshTokenService: RefreshTokenService,
    ) { }

    async signIn(signInRequestDto: SignInRequestDto): Promise<InternalAuthResponseDto> {
        const { email, password } = signInRequestDto;
        const user = await this.usersService.findOneUserByEmailWithPassword(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordsMatch = await compare(password, user.password);
        if (!isPasswordsMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return new InternalAuthResponseDto(
            this.generateAccessToken(user),
            await this.refreshTokenService.createRefreshToken(user.id),
            user,
        );
    }

    async signUp(dto: SignUpRequestDto): Promise<InternalAuthResponseDto> {
        const existingUser =
            await this.usersService.findOneUserByEmail(dto.email);

        if (existingUser) {
            throw new BadRequestException('User already exists');
        }
        if (dto.password !== dto.confirmPassword) {
            throw new BadRequestException('Password and confirm password do not match');
        }

        const user = await this.usersService.createUser(dto);
        return new InternalAuthResponseDto(
            this.generateAccessToken(user),
            await this.refreshTokenService.createRefreshToken(user.id),
            user,
        );
    }

    async signOut(rawRefreshToken: string) {
        await this.refreshTokenService.revokeRefreshToken(rawRefreshToken);
    }

    async signOutAll(userId: string) {
        await this.refreshTokenService.revokeAllForUser(userId);
    }

    async rotateRefreshToken(rawRefreshToken: string): Promise<InternalAuthResponseDto> {
        const { refreshToken, userId } = await this.refreshTokenService.rotate(rawRefreshToken);

        const user = await this.usersService.findOneUser(userId);

        return new InternalAuthResponseDto(
            this.generateAccessToken(user),
            refreshToken,
            user,
        );

    }

    private generateAccessToken(user: User) {
        return this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role,
        })
    }


}
