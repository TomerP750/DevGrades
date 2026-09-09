import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from '../users/users.module';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AdminGuard } from './guards/admin.guard';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: { 
          expiresIn: configService.getOrThrow<StringValue>('JWT_ACCESS_TOKEN_EXPIRATION') 
        },
      }),
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }, 
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    }
  ],
})
export class AuthenticationModule { }
