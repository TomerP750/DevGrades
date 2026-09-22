import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Conversation } from './entities/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UsersService } from '../users/users.service';


@Injectable()
export class ConversationsService {

    constructor(
        @InjectRepository(Conversation)
        private conversationRepository: Repository<Conversation>,
        private usersService: UsersService,
    ) { }

    async createConversation(conversation: CreateConversationDto): Promise<Conversation> {
        if (conversation.userId === conversation.recipientId) {
            throw new BadRequestException('You cannot create a conversation with yourself');
        }
    
        const [user, recipient] = await Promise.all([
            this.usersService.findOneUserById(conversation.userId),
            this.usersService.findOneUserById(conversation.recipientId),
        ]);
    
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (!recipient) {
            throw new NotFoundException('Recipient not found');
        }
    
        const newConversation = this.conversationRepository.create({
            users: [user, recipient],
            messages: [],
        });
        return this.conversationRepository.save(newConversation);
    }

    async getOrCreateConversation(userId: string, recipientId: string): Promise<Conversation> {
        
        if (!userId || !recipientId) {
            throw new BadRequestException('User ID and recipient ID are required');
        }

        if (userId === recipientId) {
            throw new BadRequestException('You cannot create a conversation with yourself');
        }
    
        const existing = await this.findByUserIdAndRecipientId(userId, recipientId);
        if (existing) {
            return existing;
        }
    
        return this.createConversation({ userId, recipientId });
    }

    async findOneById(userId: string, id: string): Promise<Conversation | null> {
        const conversation = await this.conversationRepository.findOne({
            where: { id },
            relations: {
                users: true,
                messages: true
            }
        });

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        if (!conversation.users.some((participant) => participant.id === userId)) {
            throw new ForbiddenException('You are not allowed to access this conversation');
        }

        return conversation;
    }

    async findAllByUserId(userId: string): Promise<Conversation[]> {
        return this.conversationRepository
            .createQueryBuilder('conversation')
            .innerJoin('conversation.users', 'member')
            .leftJoinAndSelect('conversation.users', 'participants')
            .leftJoinAndSelect('conversation.messages', 'messages')
            .where('member.id = :userId', { userId })
            .orderBy('conversation.updatedAt', 'DESC')
            .getMany();
    }

    async findByUserIdAndRecipientId(userId: string, recipientId: string): Promise<Conversation | null> {
        
        if (userId === recipientId) {
            return null;
        }

        return this.conversationRepository
            .createQueryBuilder('conversation')
            .innerJoin('conversation.users', 'sender')
            .innerJoin('conversation.users', 'recipient')
            .leftJoinAndSelect('conversation.users', 'participants')
            .leftJoinAndSelect('conversation.messages', 'messages')
            .where('sender.id = :userId', { userId })
            .andWhere('recipient.id = :recipientId', { recipientId })
            .getOne();
    }

    async updateConversation(conversationId: string) {
        await this.conversationRepository.update(conversationId, { 
            updatedAt: new Date() 
        });
    }

}
