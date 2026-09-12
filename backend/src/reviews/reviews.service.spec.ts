import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { Role } from '../authentication/types/role';
import { Project } from '../projects/entities/project.entity';
import { Status } from '../projects/Status';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';

describe('ReviewsService', () => {
  let service: ReviewsService;
  const mockReviewsRepository = {
    save: jest.fn<Repository<Review>['save']>(),
    findOne: jest.fn<Repository<Review>['findOne']>(),
    update: jest.fn<Repository<Review>['update']>(),
    delete: jest.fn<Repository<Review>['delete']>(),
  };
  const mockProjectsService = {
    findOne: jest.fn<ProjectsService['findOne']>(),
  };
  const mockUsersService = {
    findOneUser: jest.fn<UsersService['findOneUser']>(),
  };

  let user: User;
  let projectOwner: User;
  let project: Project;
  let review: Review;

  beforeEach(async () => {
    jest.resetAllMocks();

    user = {
      id: '1',
      email: 'test@test.com',
      password: 'test',
      firstName: 'test',
      lastName: 'user',
      role: Role.USER,
      username: '',
      version: 0,
    };

    projectOwner = {
      ...user,
      id: '2',
      email: 'owner@test.com',
      username: 'project-owner',
    };

    project = {
      id: '1',
      name: 'test',
      description: 'test',
      githubUrl: '',
      demoUrl: '',
      status: Status.OPEN,
      user: projectOwner,
      imageUrl: '',
    };

    review = {
      id: '1',
      user,
      project,
      overallScore: 5,
      codeQualityScore: 5,
      optimizationScore: 5,
      maintainabilityScore: 5,
      scalabilityScore: 5,
      uiuxScore: 5,
      comment: 'test',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProjectsService.findOne.mockResolvedValue(project);
    mockUsersService.findOneUser.mockResolvedValue(user);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getRepositoryToken(Review),
          useValue: mockReviewsRepository,
        },
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneReview', () => {
      it('should return a review', async () => {
        mockReviewsRepository.findOne.mockResolvedValue(review);
        const result = await service.findOneReview('1');
        expect(result).toEqual(review);
      });

      it('should throw an error if the review is not found', async () => {
        mockReviewsRepository.findOne.mockResolvedValue(null);
        await expect(service.findOneReview('1')).rejects.toThrow(NotFoundException);
      });

  })


  describe('createReview', () => {

    const createReviewDto: CreateReviewDto = {
      overallScore: 5,
      codeQualityScore: 5,
      optimizationScore: 5,
      maintainabilityScore: 5,
      scalabilityScore: 5,
      uiuxScore: 5,
      comment: 'test'
    };

    
    it('should create a review', async () => {
      mockReviewsRepository.save.mockResolvedValue(review);
      const result = await service.createReview(user.id, project.id, createReviewDto);
      expect(result).toBeUndefined();

      expect(mockReviewsRepository.save).toHaveBeenCalledWith({
        user,
        project,
        ...createReviewDto,
      });
    });

    it('should throw an error if the project is owned by the user', async () => {
      mockProjectsService.findOne.mockResolvedValue({
        ...project,
        user,
      });

      await expect(
        service.createReview(user.id, project.id, createReviewDto),
      ).rejects.toThrow(ForbiddenException);
      expect(mockReviewsRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('updateReview', () => {
    const updateReviewDto: UpdateReviewDto = {
      overallScore: 4,
      codeQualityScore: 4,
      optimizationScore: 4,
      maintainabilityScore: 5,
      scalabilityScore: 4,
      uiuxScore: 4,
      comment: 'test updated'
    };

    it('should update a review if the user is the owner of the review', async () => {
      mockReviewsRepository.findOne.mockResolvedValue(review);
      await service.updateReview(user.id, review.id, updateReviewDto);
      expect(mockReviewsRepository.update).toHaveBeenCalledWith(review.id, updateReviewDto);
    });

    it('should throw an error if the user is not the owner of the review', async () => {
      mockReviewsRepository.findOne.mockResolvedValue({
        ...review,
        user: projectOwner,
      });

      await expect(
        service.updateReview(user.id, review.id, updateReviewDto),
      ).rejects.toThrow(ForbiddenException);
      expect(mockReviewsRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error if the review is not found', async () => {
      mockReviewsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateReview(user.id, review.id, updateReviewDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockReviewsRepository.update).not.toHaveBeenCalled();
    });

  });
    

  describe('deleteReview', () => {

    it('should delete a review if the user is the owner of the review', async () => {
      mockReviewsRepository.findOne.mockResolvedValue(review);

      await service.deleteReview(user.id, review.id);

      expect(mockReviewsRepository.delete).toHaveBeenCalledWith(review.id);
    });

    it('should throw an error if the user is not the owner of the review', async () => {
      mockReviewsRepository.findOne.mockResolvedValue({
        ...review,
        user: projectOwner,
      });

      await expect(
        service.deleteReview(user.id, review.id),
      ).rejects.toThrow(ForbiddenException);
      expect(mockReviewsRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw an error if the review is not found', async () => {
      mockReviewsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.deleteReview(user.id, review.id),
      ).rejects.toThrow(NotFoundException);
      expect(mockReviewsRepository.delete).not.toHaveBeenCalled();
    });

  });
});
