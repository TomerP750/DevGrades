import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../authentication/types/role';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SignUpRequestDto } from '../authentication/dtos/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { compare, hash } from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const mockCompare = jest.mocked(compare);
const mockHash = jest.mocked(hash);

describe('UsersService', () => {
  let service: UsersService;
  const mockUsersRepository = {
    save: jest.fn<Repository<User>['save']>(),
    findOne: jest.fn<Repository<User>['findOne']>(),
    update: jest.fn<Repository<User>['update']>(),
    delete: jest.fn<Repository<User>['delete']>(),
  };

  let user: User;

  beforeEach(async () => {

    jest.resetAllMocks();
    mockCompare.mockResolvedValue(true);
    mockHash.mockResolvedValue('hashedPassword');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService, {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

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
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneUser', () => {

    it('should return a user', async () => {
      mockUsersRepository.findOne.mockResolvedValue(user);
      const result = await service.findOneUser('1');
      expect(result).toEqual(user);
    })

    it('should throw an error if the user is not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      await expect(service.findOneUser('1')).rejects.toThrow(NotFoundException);
    })

  })

  describe('findOneUserByEmail', () => {

    it('should return a user', async () => {
      mockUsersRepository.findOne.mockResolvedValue(user);
      const result = await service.findOneUserByEmail('test@user.com');
      expect(result).toEqual(user);
      expect(mockUsersRepository.findOne)
        .toHaveBeenCalledWith({ where: { email: 'test@user.com' } });
    })

    it('should throw an error if the user is not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      await expect(service.findOneUserByEmail('test@user.com')).rejects.toThrow(NotFoundException);
      expect(mockUsersRepository.findOne)
        .toHaveBeenCalledWith({ where: { email: 'test@user.com' } });
    })

  })

  describe('createUser', () => {
    const createUserDto: SignUpRequestDto = {
      email: 'test@user.com',
      password: 'test',
      username: 'test-user',
      confirmPassword: 'test',
      firstName: 'test',
      lastName: 'user',
    };

    it('should create a user', async () => {

    });

    it('should throw an error if password and confirm password do not match', async () => {
      const invalidCreateUserDto: SignUpRequestDto = {
        ...createUserDto,
        confirmPassword: 'differentPassword',
      };
      await expect(service.createUser(invalidCreateUserDto)).rejects.toThrow(BadRequestException);
      expect(mockUsersRepository.save).not.toHaveBeenCalled();
    });


  });

  describe('updateUser', () => {
    const updateUserDto: UpdateUserDto = {
      email: 'test@user.com',
      username: 'test-user',
      firstName: 'test',
      lastName: 'user',
    };

    it('should update a user', async () => {
      mockUsersRepository.findOne.mockResolvedValue(user);
      await service.updateUser('1', updateUserDto);
      expect(mockUsersRepository.update).toHaveBeenCalledWith('1', updateUserDto);
    });

    it('should throw an error if the user is not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      await expect(service.updateUser('1', updateUserDto)).rejects.toThrow(NotFoundException);
      expect(mockUsersRepository.update).not.toHaveBeenCalled();
    });

  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      mockUsersRepository.findOne.mockResolvedValue(user);
      await service.deleteUser('1');
      expect(mockUsersRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if the user is not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      await expect(service.deleteUser('1')).rejects.toThrow(NotFoundException);
      expect(mockUsersRepository.delete).not.toHaveBeenCalled();
    });

  });

  describe('changePassword', () => {
    const changePasswordDto: ChangePasswordDto = {
      oldPassword: 'test',
      newPassword: 'newTestPassword',
      confirmNewPassword: 'newTestPassword',
    };

    const invalidChangePasswordDto: ChangePasswordDto = {
      ...changePasswordDto,
      confirmNewPassword: 'differentPassword',
    };

    it('should change a user\'s password', async () => {
      mockUsersRepository.findOne.mockResolvedValue(user);
      await service.changePassword('1', changePasswordDto);
      expect(mockUsersRepository.update).toHaveBeenCalledWith('1',
        { password: 'hashedPassword' });
    });

    it('should throw an error if the user is not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      await expect(service.changePassword('1', changePasswordDto)).rejects.toThrow(NotFoundException);
      expect(mockUsersRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error if the old password is incorrect', async () => {
      mockUsersRepository.findOne.mockResolvedValue(user);
      mockCompare.mockResolvedValue(false);
      await expect(service.changePassword('1', {
        ...changePasswordDto,
        oldPassword: 'incorrectPassword',
      })).rejects.toThrow(BadRequestException);
      expect(mockUsersRepository.update).not.toHaveBeenCalled();
    });

    it('should throw an error if the new password and confirm new password do not match', async () => {
      mockUsersRepository.findOne.mockResolvedValue(user);
      await expect(service.changePassword('1', invalidChangePasswordDto))
        .rejects.toThrow(BadRequestException);
      expect(mockUsersRepository.update).not.toHaveBeenCalled();
    });
  });


});
