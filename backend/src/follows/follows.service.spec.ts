import { Test, TestingModule } from '@nestjs/testing';
import { FollowsService } from './follows.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { Role } from '../authentication/types/role';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('FollowsService', () => {
  let service: FollowsService;

  const mockUsersService = {
    findOneUserById: jest.fn<UsersService['findOneUserById']>(),
  };

  const mockFollowRepository = {
    findOne: jest.fn<Repository<Follow>['findOne']>(),
    save: jest.fn<Repository<Follow>['save']>(),
    delete: jest.fn<Repository<Follow>['delete']>(),
    find: jest.fn<Repository<Follow>['find']>(),
    exists: jest.fn<Repository<Follow>['exists']>(),
  };

  let follower: User;
  let followed: User;
  let follow: Follow;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowsService,
        {
          provide: getRepositoryToken(Follow),
          useValue: mockFollowRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    follower = {
      id: '1',
      firstName: 'follower',
      lastName: 'user',
      username: 'followeruser',
      email: 'followeruser@example.com',
      role: Role.USER,
      password: 'password',
      version: 1,
    };

    followed = {
      id: '2',
      firstName: 'followed',
      lastName: 'user',
      username: 'followeduser',
      email: 'followeduser@example.com',
      role: Role.USER,
      password: 'password',
      version: 1,
    };

    follow = {
      id: 'follow-1',
      follower,
      followed,
      createdAt: new Date('2026-10-05T12:00:00.000Z'),
    };

    service = module.get<FollowsService>(FollowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('follow', () => {
    it('should reject following yourself', async () => {
      await expect(service.follow(follower.id, follower.id)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockUsersService.findOneUserById).not.toHaveBeenCalled();
      expect(mockFollowRepository.findOne).not.toHaveBeenCalled();
      expect(mockFollowRepository.save).not.toHaveBeenCalled();
    });

    it('should throw when the follower does not exist', async () => {
      mockUsersService.findOneUserById
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(followed);

      await expect(service.follow('missing-user', followed.id)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockUsersService.findOneUserById).toHaveBeenNthCalledWith(
        1,
        'missing-user',
      );
      expect(mockUsersService.findOneUserById).toHaveBeenNthCalledWith(
        2,
        followed.id,
      );
      expect(mockFollowRepository.findOne).not.toHaveBeenCalled();
      expect(mockFollowRepository.save).not.toHaveBeenCalled();
    });

    it('should throw when the followed user does not exist', async () => {
      mockUsersService.findOneUserById
        .mockResolvedValueOnce(follower)
        .mockResolvedValueOnce(null);

      await expect(service.follow(follower.id, 'missing-user')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockUsersService.findOneUserById).toHaveBeenNthCalledWith(
        1,
        follower.id,
      );
      expect(mockUsersService.findOneUserById).toHaveBeenNthCalledWith(
        2,
        'missing-user',
      );
      expect(mockFollowRepository.findOne).not.toHaveBeenCalled();
      expect(mockFollowRepository.save).not.toHaveBeenCalled();
    });

    it('should save a follow and return true', async () => {
      mockUsersService.findOneUserById
        .mockResolvedValueOnce(follower)
        .mockResolvedValueOnce(followed);
      mockFollowRepository.findOne.mockResolvedValue(null);
      mockFollowRepository.save.mockResolvedValue(follow);

      const result = await service.follow(follower.id, followed.id);

      expect(mockFollowRepository.findOne).toHaveBeenCalledWith({
        where: {
          follower: { id: follower.id },
          followed: { id: followed.id },
        },
      });
      expect(mockFollowRepository.save).toHaveBeenCalledWith({
        follower,
        followed,
      });
      expect(result).toBe(true);
    });
  });

  describe('unfollow', () => {
    it('should return false without deleting when no follow exists', async () => {
      mockFollowRepository.findOne.mockResolvedValue(null);

      const result = await service.unfollow(follower.id, followed.id);

      expect(mockFollowRepository.findOne).toHaveBeenCalledWith({
        where: {
          follower: { id: follower.id },
          followed: { id: followed.id },
        },
      });
      expect(mockFollowRepository.delete).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should delete an existing follow and return false', async () => {
      mockFollowRepository.findOne.mockResolvedValue(follow);
      mockFollowRepository.delete.mockResolvedValue({
        raw: [],
        affected: 1,
      });

      const result = await service.unfollow(follower.id, followed.id);

      expect(mockFollowRepository.delete).toHaveBeenCalledWith(follow.id);
      expect(result).toBe(false);
    });
  });

  describe('getFollowers', () => {
    it('should return followers ordered from newest to oldest', async () => {
      mockFollowRepository.find.mockResolvedValue([follow]);

      const result = await service.getFollowers(followed.id);

      expect(mockFollowRepository.find).toHaveBeenCalledWith({
        where: { followed: { id: followed.id } },
        relations: { follower: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([follow]);
    });
  });

  describe('getFollowings', () => {
    it('should return followed users ordered from newest to oldest', async () => {
      mockFollowRepository.find.mockResolvedValue([follow]);

      const result = await service.getFollowings(follower.id);

      expect(mockFollowRepository.find).toHaveBeenCalledWith({
        where: { follower: { id: follower.id } },
        relations: { followed: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([follow]);
    });
  });

  describe('isFollowing', () => {
    it.each([
      [true, true],
      [false, false],
    ])(
      'should return %s when the repository returns %s',
      async (repositoryResult, expected) => {
        mockFollowRepository.exists.mockResolvedValue(repositoryResult);

        const result = await service.isFollowing(follower.id, followed.id);

        expect(mockFollowRepository.exists).toHaveBeenCalledWith({
          where: {
            follower: { id: follower.id },
            followed: { id: followed.id },
          },
        });
        expect(result).toBe(expected);
      },
    );
  });
});
