import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUserId } from '../authentication/decorators/current-user.decorator';
import { Serialize } from '../shared/interceptors/serialize.interceptor';
import { ReviewDto } from './dto/review.dto';
import { ReviewsStatsService } from './reviews.stats.service';
import { ReviewStatsDto } from './dto/review-stats.dto';


@Controller('api/reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly reviewsStatsService: ReviewsStatsService,
  ) { }

  @Post('/create/:projectId')
  @Serialize(ReviewDto)
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUserId() userId: string,
    @Param('projectId') projectId: string
  ) {
    return this.reviewsService.createReview(userId, projectId, createReviewDto);
  }

  @Get('/all/:projectId')
  @Serialize(ReviewDto)
  async findAllByProjectId(@Param('projectId') projectId: string) {
    return this.reviewsService.allReviewsByProjectId(projectId);
  }

  @Put('/update/:reviewId')
  @Serialize(ReviewDto)
  async update(
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUserId() userId: string
  ) {
    return this.reviewsService.updateReview(userId, reviewId, updateReviewDto);
  }

  @Delete('/delete/:reviewId')
  @Serialize(ReviewDto)
  async remove(@Param('reviewId') reviewId: string, @CurrentUserId() userId: string) {
    return this.reviewsService.deleteReview(userId, reviewId);
  }

  @Get('/stats/:projectId')
  @Serialize(ReviewStatsDto)
  async getReviewStats(@Param('projectId') projectId: string) {
    return this.reviewsStatsService.getReviewStats(projectId);
  }

}
