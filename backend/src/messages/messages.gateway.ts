import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CurrentUserId } from '../authentication/decorators/current-user.decorator';
import { MessageDto } from './dto/message.dto';
import { Serialize } from '../shared/interceptors/serialize.interceptor';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../authentication/guards/auth.guard';


@WebSocketGateway({
  namespace: 'messages',
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  }
})
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService) { }

  @SubscribeMessage('createMessage')
  @Serialize(MessageDto)
  @UseGuards(AuthGuard)
  async createMessage(
    @CurrentUserId() userId: string,
    @MessageBody() createMessageDto: CreateMessageDto) {
    return this.messagesService.createMessage(userId, createMessageDto);
  }

  @SubscribeMessage('deleteMessage')
  @Serialize(MessageDto)
  @UseGuards(AuthGuard)
  async deleteMessage(
    @CurrentUserId() userId: string,
    @MessageBody() deleteMessageDto: DeleteMessageDto) {
    return this.messagesService.deleteMessage(userId, deleteMessageDto);
  }

}
