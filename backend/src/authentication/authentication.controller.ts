import { Controller } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  
}
