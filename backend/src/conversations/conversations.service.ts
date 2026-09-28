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

    private async createConversation(conversation: CreateConversationDto): Promise<Conversation> {
        
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

    async findAllByUserId(userId: string) {
        const conversations = await this.conversationRepository
            .createQueryBuilder('conversation')
            .innerJoin('conversation.users', 'member')
            .leftJoinAndSelect('conversation.users', 'participants')
            .leftJoinAndSelect(
                'conversation.messages',
                'lastMessage',
                `lastMessage.id = (
                    SELECT latest.id FROM messages latest
                    WHERE latest.conversationId = conversation.id
                    ORDER BY latest.createdAt DESC
                    LIMIT 1
                )`,
            )
            .leftJoinAndSelect('lastMessage.user', 'messageAuthor')
            .where('member.id = :userId', { userId })
            .orderBy('conversation.updatedAt', 'DESC')
            .getMany();

        return conversations.map((conversation) => ({
            id: conversation.id,
            createdAt: conversation.createdAt,
            users: conversation.users,
            messages: [] as Conversation['messages'],
            lastMessage: conversation.messages?.[0] ?? null,
        }));
    }

    async findByUserIdAndRecipientId(userId: string, recipientId: string): Promise<Conversation | null> {

        if (userId === recipientId) {
            return null;
        }

        return this.conversationRepository
            .createQueryBuilder('conversation')
            .innerJoin('conversation.users', 'user1', 'user1.id = :userId', { userId })
            .innerJoin('conversation.users', 'user2', 'user2.id = :recipientId', { recipientId })
            .leftJoinAndSelect('conversation.users', 'participants')
            .leftJoinAndSelect('conversation.messages', 'messages')
            .leftJoinAndSelect('messages.user', 'messageUser')
            .orderBy('messages.createdAt', 'ASC')
            .getOne();
    }

    async updateConversation(conversationId: string) {
        await this.conversationRepository.update(conversationId, {
            updatedAt: new Date()
        });
    }

}
