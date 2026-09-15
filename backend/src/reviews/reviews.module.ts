import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';
import { ReviewsStatsService } from './reviews.stats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), UsersModule, ProjectsModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsStatsService],
})
export class ReviewsModule {}
