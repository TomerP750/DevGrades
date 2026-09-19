import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Conversation } from './entities/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';


@Injectable()
export class ConversationsService {
    constructor(
        @InjectRepository(Conversation)
        private conversationRepository: Repository<Conversation>,
        private usersService: UsersService,
    ) {}

    // EMPTY FUNCTIONS COMPLETING THE SERVICE
    async createConversation(conversation: Conversation): Promise<Conversation> {
        return this.conversationRepository.save(conversation);
    }

    async getConversationById(userId: string, id: string): Promise<Conversation | null> {
        const conversation = await this.conversationRepository.findOne({ where: { id } });

        if (conversation?.user.id !== userId) {
            throw new ForbiddenException('You are not allowed to access this conversation');
        }

        if (!conversation) {
            return null;
        }
        return conversation;
    }

    async getAllConversationsByUserId(userId: string): Promise<Conversation[]> {
        return this.conversationRepository.find({ where: { user: { id: userId } } });
    }


}
