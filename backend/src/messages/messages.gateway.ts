import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CurrentUserId } from '../authentication/decorators/current-user.decorator';
import { MessageDto } from './dto/message.dto';
import { Serialize } from '../shared/interceptors/serialize.interceptor';
import { DeleteMessageDto } from './dto/delete-message.dto';


@WebSocketGateway()
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService) { }

  @SubscribeMessage('createMessage')
  @Serialize(MessageDto)
  createMessage(
    @CurrentUserId() userId: string,
    @MessageBody() createMessageDto: CreateMessageDto) {
    return this.messagesService.createMessage(userId, createMessageDto);
  }

  @SubscribeMessage('deleteMessage')
  @Serialize(MessageDto)
  deleteMessage(
    @CurrentUserId() userId: string,
    @MessageBody() deleteMessageDto: DeleteMessageDto) {
    return this.messagesService.deleteMessage(userId, deleteMessageDto);
  }

}
