import { Controller, Get, Param } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CurrentUserId } from '../authentication/decorators/current-user.decorator';
import { Serialize } from '../shared/interceptors/serialize.interceptor';
import { ConversationDto } from './dto/conversation.dto';

@Controller('/api/conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get("/:id")
  @Serialize(ConversationDto)
  async getConversationById(@CurrentUserId() userId: string, @Param("id") id: string) {
    return this.conversationsService.getConversationById(userId, id);
  }

  @Get("/all")
  @Serialize(ConversationDto)
  async getAllConversations(@CurrentUserId() userId: string): Promise<ConversationDto[]> {
    return this.conversationsService.getAllConversationsByUserId(userId);
  }

}
