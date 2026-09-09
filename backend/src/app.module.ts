import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UsersModule, AuthenticationModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env.development', // add cross env 
  })],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_PIPE,
    useValue: new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  }],
})
export class AppModule {}
