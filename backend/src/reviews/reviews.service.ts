import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewDto } from './dto/review.dto';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';


@Injectable()
export class ReviewsService {

  constructor(
    @InjectRepository(Review) 
    private readonly reviewsRepository: Repository<Review>,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService
  ) {}


  async createReview(userId: string, projectId: string, createReviewDto: CreateReviewDto): Promise<void> {
    
    const [user, project] = await Promise.all([
      this.usersService.findOneUserById(userId),
      this.projectsService.findOne(projectId)
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (project.user.id === userId) {
      throw new ForbiddenException('You are not allowed to create a review for your own project');
    }

    const review = {
      ...createReviewDto,
      user: user,
      project: project,
    }

    await this.reviewsRepository.save(review);
  }

  async allReviewsByProjectId(projectId: string): Promise<ReviewDto[]> {
    return await this.reviewsRepository.find({
      where: { project: { id: projectId } },
      relations: {
        user: true,
      }
    });
  }

  async updateReview(userId: string, reviewId: string, updateReviewDto: UpdateReviewDto): Promise<void> {
    const isAllowed = await this.isReviewOwner(userId, reviewId);
    if (!isAllowed) {
      throw new ForbiddenException('You are not allowed to operate on this review');
    }
    await this.reviewsRepository.update(reviewId, updateReviewDto);
  }

  async deleteReview(userId: string, reviewId: string): Promise<void> {

    const isReviewOwner = await this.isReviewOwner(userId, reviewId);
    if (!isReviewOwner) {
      throw new ForbiddenException('You are not allowed to operate on this review');
    }
    await this.reviewsRepository.delete(reviewId);
  }

  async findOneReview(reviewId: string): Promise<Review> {
    const review = await this.reviewsRepository.findOne({ 
      where: { id: reviewId },
      relations: {
        user: true,
      }
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  private async isReviewOwner(userId: string, reviewId: string): Promise<boolean> {
    const review = await this.findOneReview(reviewId);
    if (review.user.id !== userId) {
      return false;
    }
    return true;
  }

  
}




