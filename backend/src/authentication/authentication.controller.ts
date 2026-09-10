import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { ConfigService } from '@nestjs/config';
import { Public } from './decorators/public.decorator';
import { Serialize } from '../shared/interceptors/serialize.interceptor';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { SignInRequestDto } from './dtos/signin.dto';
import { SignUpRequestDto } from './dtos/signup.dto';
import type { Response, Request } from 'express';
import ms, { type StringValue } from 'ms';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly configService: ConfigService,
  ) {}

  
  @Post("/signup")
  @Public()
  @Serialize(AuthResponseDto)
  async signUp(@Body() dto: SignUpRequestDto, @Res({ passthrough: true }) response: Response): Promise<AuthResponseDto> {
      const { accessToken, refreshToken, user } =
          await this.authenticationService.signUp(dto);

      this.setRefreshTokenCookie(response, refreshToken);

      return new AuthResponseDto(accessToken, user);
  }

  @Post("/login")
  @Public()
  @Serialize(AuthResponseDto)
  async signIn(@Body() dto: SignInRequestDto, @Res({ passthrough: true }) response: Response): Promise<AuthResponseDto> {

      const { accessToken, refreshToken, user } =
          await this.authenticationService.signIn(dto);

      this.setRefreshTokenCookie(response, refreshToken);

      return new AuthResponseDto(accessToken, user);
  }

  @Post("/logout")
  @Public()
  async signOut(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<void> {
      const rawRefreshToken = request.cookies.refresh_token;

      if (rawRefreshToken) {
          await this.authenticationService.signOut(rawRefreshToken);
      }

      response.clearCookie('refresh_token', { path: '/api/auth' });

  }

  @Post("/refresh-token")
  @Public()
  @Serialize(AuthResponseDto)
  async rotate(
      @Req() request: Request,
      @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {

      const rawRefreshToken = request.cookies.refresh_token;
      const { accessToken, refreshToken, user } =
          await this.authenticationService.rotateRefreshToken(rawRefreshToken);

      this.setRefreshTokenCookie(response, refreshToken);

      return new AuthResponseDto(accessToken, user);
  }

  private setRefreshTokenCookie(response: Response, refreshToken: string): void {
      response.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure: this.configService.get('NODE_ENV') === 'production',
          sameSite: 'lax',
          maxAge: ms(
              this.configService.getOrThrow<StringValue>(
                  'REFRESH_TOKEN_EXPIRATION_TIME',
              ),
          ),
          path: '/api/auth',
      });
  }
  
}
