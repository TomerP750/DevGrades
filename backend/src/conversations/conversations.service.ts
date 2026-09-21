import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Conversation } from './entities/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateConversationDto } from './dto/create-conversation.dto';


@Injectable()
export class ConversationsService {
    constructor(
        @InjectRepository(Conversation)
        private conversationRepository: Repository<Conversation>,
    ) { }

    // EMPTY FUNCTIONS COMPLETING THE SERVICE
    async createConversation(conversation: CreateConversationDto): Promise<Conversation> {
        const newConversation = this.conversationRepository.create({
            users: [
                { id: conversation.userId },
                { id: conversation.recipientId }
            ],
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return this.conversationRepository.save(newConversation);
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
            return null;
        }

        if (!conversation?.users.some((participant) => participant.id === userId)) {
            throw new ForbiddenException('You are not allowed to access this conversation');
        }

        return conversation;
    }

    async findAllByUserId(userId: string): Promise<Conversation[]> {
        return this.conversationRepository.find({ where: { users: { id: userId } } });
    }

    async findByUserIdAndRecipientId(userId: string, recipientId: string): Promise<Conversation | null> {
        return this.conversationRepository.findOne({
            where: {
                users: [{ id: userId }, { id: recipientId }]
            },
            relations: {
                users: true,
                messages: true
            }
        });
    }


}
