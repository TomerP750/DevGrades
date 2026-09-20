import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationsService } from '../conversations/conversations.service';
import { UsersService } from '../users/users.service';
import { DeleteMessageDto } from './dto/delete-message.dto';

@Injectable()
export class MessagesService {

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private conversationsService: ConversationsService,
    private usersService: UsersService,
  ) {}

  async createMessage(userId: string, createMessageDto: CreateMessageDto) {
    
    const user = await this.usersService.findOneUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { conversationId } = createMessageDto;

    const conversation = await this.conversationsService
    .getConversationById(userId, conversationId);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    if (!conversation.users.some(user => user.id === userId)) {
      throw new ForbiddenException('You are not allowed to send messages to this conversation');
    }

    const newMessage = {
      ...createMessageDto,
      conversation,
      user,
    };
    const message = this.messageRepository.create(newMessage);
    return await this.messageRepository.save(message);
    
  }

  async deleteMessage(userId: string, deleteMessageDto: DeleteMessageDto) {
    
    const user = await this.usersService.findOneUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { messageId, conversationId } = deleteMessageDto;

    const conversation = await this.conversationsService
    .getConversationById(userId, conversationId);
    
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const message = await this.findOneMessageById(messageId);
    if (!message || message.conversation.id !== conversationId) {
      throw new NotFoundException('Message not found');
    }
    if (message.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to delete this message');
    }

    return await this.messageRepository.remove(message);

  }

  async findOneMessageById(messageId: string): Promise<Message | null> {
    return await this.messageRepository.findOne({ 
      where: { id: messageId },
      relations: {
        user: true,
        conversation: true
      }
    });
  }

}
