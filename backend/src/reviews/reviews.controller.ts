import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUserId } from '../authentication/decorators/current-user.decorator';
import { Serialize } from '../shared/interceptors/serialize.interceptor';
import { ReviewDto } from './dto/review.dto';


@Controller('api/reviews')
@Serialize(ReviewDto)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post('/create/:projectId')
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUserId() userId: string,
    @Param('projectId') projectId: string
  ) {
    return this.reviewsService.createReview(userId, projectId, createReviewDto);
  }

  @Get('/all/:projectId')
  async findAll(@Param('projectId') projectId: string) {
    return this.reviewsService.allReviewsByProjectId(projectId);
  }

  @Put('/update/:reviewId')
  async update(
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUserId() userId: string
  ) {
    return this.reviewsService.updateReview(userId, reviewId, updateReviewDto);
  }

  @Delete('/delete/:reviewId')
  async remove(@Param('reviewId') reviewId: string, @CurrentUserId() userId: string) {
    return this.reviewsService.deleteReview(userId, reviewId);
  }

}
