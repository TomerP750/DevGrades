import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { describe, expect, beforeEach, it, jest } from '@jest/globals';
import { Repository } from 'typeorm';
import { Role } from '../authentication/types/role';
import { User } from '../users/users.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProfilesService', () => {
  let service: ProfilesService;
  const mockProfilesRepository = {
    findOne: jest.fn<Repository<Profile>['findOne']>(),
    save: jest.fn<Repository<Profile>['save']>(),
    create: jest.fn<Repository<Profile>['create']>(),
  };

  let profile: Profile;
  let user: User;


  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfilesService, {
        provide: getRepositoryToken(Profile),
        useValue: mockProfilesRepository,
      }],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);

    user = {
      id: '1',
      email: 'test@user.com',
      password: 'test',
      firstName: 'test',
      lastName: 'user',
      role: Role.USER,
      username: '',
      version: 0,
    };

    profile = {
      id: '1',
      user: user,
      bannerUrl: 'test',
      aboutBio: 'test',
    };

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('findOneProfileByUserId', () => {

    it('should return a profile', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(profile);
      const result = await service.findOneProfileByUserId('1');
      expect(result).toEqual(profile);
      expect(mockProfilesRepository.findOne)
        .toHaveBeenCalledWith({
          where: { user: { id: '1' } },
          relations: { user: true }
        });
    });

    it('should throw an error if the profile is not found', async () => {
      mockProfilesRepository.findOne.mockResolvedValue(null);
      await expect(service.findOneProfileByUserId('1')).rejects.toThrow(NotFoundException);
      expect(mockProfilesRepository.findOne)
      .toHaveBeenCalledWith({ 
        where: { user: { id: '1' } }, 
        relations: { user: true } 
      });
    });
  });

  describe('createProfile', () => {

    it('should create a profile', async () => {
      mockProfilesRepository.save.mockResolvedValue(profile);
      const result = await service.createProfile(user);
      expect(result).toEqual(profile);
      expect(mockProfilesRepository.save)
      .toHaveBeenCalledWith(profile);
    });

  })

});
