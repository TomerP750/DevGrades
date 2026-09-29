import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Repository } from 'typeorm';
import { Status } from './Status';
import { User } from '../users/users.entity';
import { Role } from '../authentication/types/role';
import { UsersService } from '../users/users.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';

describe('ProjectsService', () => {
  let service: ProjectsService;

  const mockProjectsRepository = {
    save: jest.fn<Repository<Project>['save']>(),
    findOne: jest.fn<Repository<Project>['findOne']>(),
    find: jest.fn<Repository<Project>['find']>(),
    update: jest.fn<Repository<Project>['update']>(),
    delete: jest.fn<Repository<Project>['delete']>(),
    create: jest.fn<Repository<Project>['create']>(),
  }

  const mockUsersService = {
    findOneUserById: jest.fn<UsersService['findOneUserById']>(),
  }

  let project: Project;
  let user: User;
  let unauthorizedUser: User;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService, {
        provide: getRepositoryToken(Project),
        useValue: mockProjectsRepository,
      },
      UsersService,
      {
        provide: UsersService,
        useValue: mockUsersService,
      },
    ],
    }).compile();

    user = {
      id: '1',
      email: 'test@user.com',
      password: 'test',
      firstName: 'test',
      lastName: 'user',
      username: 'userTest',
      role: Role.USER,
      version: 0,
    }

    unauthorizedUser = {
      id: '2',
      email: 'test2@user.com',
      password: 'test2',
      firstName: 'test2',
      lastName: 'user2',
      username: 'userTest2',
      role: Role.USER,
      version: 0,
    }

    project = {
      id: '1',
      name: 'Test Project',
      description: 'Test Description',
      demoUrl: '',
      githubUrl: '',
      imageUrl: '',
      status: Status.OPEN,
      user: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneProject', () => {
    it('should find a project', async () => {
      mockProjectsRepository.findOne.mockResolvedValue(project);
      const result = await service.findOne(project.id);
      expect(result).toEqual(project);
      expect(mockProjectsRepository.findOne).toHaveBeenCalledWith({ 
        where: { id: project.id },
        relations: { user: true },
      });
    });

    it('should throw an error if the project is not found', async () => {
      mockProjectsRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(project.id)).rejects.toThrow(NotFoundException);
      expect(mockProjectsRepository.findOne).not.toHaveBeenCalled();
    });
  });

  describe('createProject', () => {

    const createProjectDto: CreateProjectDto = {
      name: 'Test Project',
      description: 'Test Description',
    };

    it('should create a project', async () => {
      mockUsersService.findOneUserById.mockResolvedValue(user);
      mockProjectsRepository.create.mockReturnValue(project);
      mockProjectsRepository.save.mockResolvedValue(project);
      const result = await service.create(user.id, createProjectDto);
      expect(mockProjectsRepository.create).toHaveBeenCalledWith({
        ...createProjectDto,
        status: Status.OPEN,
        user,
      });
      expect(mockProjectsRepository.save).toHaveBeenCalledWith(project);
      expect(result).toEqual(project);
    });

    it('should throw an error if the user is not found', async () => {
      mockUsersService.findOneUserById.mockResolvedValue(null);
      await expect(service.create(user.id, project)).rejects.toThrow(NotFoundException);
      expect(mockProjectsRepository.save).not.toHaveBeenCalled();
    });

  });

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      mockProjectsRepository.findOne.mockResolvedValue(project);
      mockProjectsRepository.delete.mockResolvedValue({ raw: [], affected: 1 });
  
      await service.delete(user.id, project.id);
  
      expect(mockProjectsRepository.delete).toHaveBeenCalledWith(project.id);
    });
  
    it('should throw an error if user is not permitted to delete the project', async () => {
      mockProjectsRepository.findOne.mockResolvedValue(project);
  
      await expect(service.delete(unauthorizedUser.id, project.id)).rejects.toThrow(ForbiddenException);
      expect(mockProjectsRepository.delete).not.toHaveBeenCalled();
    });
  
    it('should throw an error if the project is not found', async () => {
      mockProjectsRepository.findOne.mockResolvedValue(null);
  
      await expect(service.delete(user.id, project.id)).rejects.toThrow(NotFoundException);
      expect(mockProjectsRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('closeProject', () => {
    it('should close a project', async () => {

    });

    it('should throw an error if user is not permitted to close the project', async () => {

    });
  });

  describe('updateProject', () => {

    it('should update a project', async () => {

    });

    it('should throw an error if user is not permitted to update the project', async () => {

    });

  });

});
