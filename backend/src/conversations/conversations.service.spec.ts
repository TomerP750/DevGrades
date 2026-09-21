import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsService } from './conversations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { UserDto } from '../users/dto/user.dto';
import { User } from '../users/users.entity';
import { Conversation } from './entities/conversation.entity';
import { Role } from '../authentication/types/role';
import { Repository } from 'typeorm';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ForbiddenException } from '@nestjs/common';

describe('ConversationsService', () => {
  let service: ConversationsService;

  const mockConversationRepository = {
    findOne: jest.fn<Repository<Conversation>['findOne']>(),
    save: jest.fn<Repository<Conversation>['save']>(),
  };

  let user: User;
  let recipient: User;
  let conversation: Conversation;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationsService, {
        provide: getRepositoryToken(Conversation),
        useValue: mockConversationRepository,
      }],
    }).compile();

    service = module.get<ConversationsService>(ConversationsService);

    user = {
      id: 'user1',
      email: 'test@test.com',
      password: 'test',
      firstName: 'Test',
      username: 'testUsername',
      avatarUrl: '',
      lastName: 'Test',
      role: Role.USER,
      version: 1,
    };

    recipient = {
      id: 'user2',
      email: 'test2@test.com',
      password: 'test2',
      firstName: 'Test2',
      username: 'testUsername2',
      avatarUrl: '',
      lastName: 'Test2',
      role: Role.USER,
      version: 1,
    };

    conversation = {
      id: 'conversation1',
      createdAt: new Date(),
      updatedAt: new Date(),
      users: [user, recipient],
      messages: [],
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('createConversation', () => {

    const createConversationDto: CreateConversationDto = {
      userId: 'user1',
      recipientId: 'user2',
    };

    it('should create a conversation', async () => {
      const result = await service.createConversation(createConversationDto);
      expect(result).toEqual(conversation);
      expect(mockConversationRepository.save).toHaveBeenCalledWith(result);
    });

  });

  describe('findOneById', () => {

    it('should return a conversation', async () => {
      mockConversationRepository.findOne.mockResolvedValue(conversation);
      const result = await service.findOneById('user1', 'conversation1');
      expect(result).toEqual(conversation);
      expect(mockConversationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'conversation1' },
        relations: {
          users: true,
          messages: true,
        },
      });
    });

    it('should throw forbidden exception if the user is not allowed to access the conversation', async () => {
      const unauthorizedUser = {
        id: 'user3',
        email: 'test3@test.com',
        password: 'test3',
        firstName: 'Test3',
        username: 'testUsername3',
        avatarUrl: '',
        lastName: 'Test3',
        role: Role.USER,
        version: 1,
      };
      mockConversationRepository.findOne.mockResolvedValue({
        ...conversation,
        users: [user, unauthorizedUser],
      });
      await expect(service.findOneById('user3', 'conversation1')).rejects.toThrow(ForbiddenException);
      expect(mockConversationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'conversation1' },
        relations: {
          users: true,
          messages: true,
        },
      });
    });

  })
  
  
      
});
