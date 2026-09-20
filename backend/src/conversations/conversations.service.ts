import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Conversation } from './entities/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';


@Injectable()
export class ConversationsService {
    constructor(
        @InjectRepository(Conversation)
        private conversationRepository: Repository<Conversation>,
    ) {}

    // EMPTY FUNCTIONS COMPLETING THE SERVICE
    async createConversation(conversation: Conversation): Promise<Conversation> {
        return this.conversationRepository.save(conversation);
    }

    async getConversationById(userId: string, id: string): Promise<Conversation | null> {
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

    async getAllConversationsByUserId(userId: string): Promise<Conversation[]> {
        return this.conversationRepository.find({ where: { users: { id: userId } } });
    }


}
