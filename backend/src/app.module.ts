import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './authentication/refresh-token/refresh-tokens.entity';
import { User } from './users/users.entity';
import { ProjectsModule } from './projects/projects.module';
import { ReviewsModule } from './reviews/reviews.module';
import { Project } from './projects/entities/project.entity';
import { Review } from './reviews/entities/review.entity';
import { ArchivedProjectsModule } from './archived-projects/archived-projects.module';
import { ArchivedProject } from './archived-projects/entities/archived-project.entity';

@Module({
  imports: [
    UsersModule,
    AuthenticationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development', // add cross env 
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, RefreshToken, Project, Review, ArchivedProject],
        synchronize: true, 
      }),
      inject: [ConfigService],
    }),
    ProjectsModule,
    ReviewsModule,
    ArchivedProjectsModule
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_PIPE,
    useValue: new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  }],
})
export class AppModule { }
