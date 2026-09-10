import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInRequestDto } from './dtos/signin.dto';
import { SignUpRequestDto } from './dtos/signup.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthenticationService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async signIn(signInRequestDto: SignInRequestDto) {
        const { email, password } = signInRequestDto;
        const user = await this.usersService.findOneUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }


}
