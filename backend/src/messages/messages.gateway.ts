import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { plainToInstance } from 'class-transformer';
import { UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { DeleteMessageDto } from './dto/delete-message.dto';
import { MessageDto } from './dto/message.dto';
import { MessageCreatedDto } from './dto/message-created.dto';
import { CurrentUserId } from '../authentication/decorators/current-user.decorator';
import { AuthGuard } from '../authentication/guards/auth.guard';
import { Serialize } from '../shared/interceptors/serialize.interceptor';
import { AuthenticatedSocket } from '../authentication/types/authenticated-socket';
import { AuthenticationService } from '../authentication/authentication.service';

@WebSocketGateway({
  namespace: 'messages',
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class MessagesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly messagesService: MessagesService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const payload = await this.authenticationService.verifyAccessToken(
        client.handshake.auth?.token,
      );
      await client.join(payload.sub);
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('createMessage')
  @UseGuards(AuthGuard)
  async createMessage(
    @CurrentUserId() userId: string,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    const message = await this.messagesService.createMessage(userId, createMessageDto);
    const payload = plainToInstance(
      MessageCreatedDto,
      {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        user: message.user,
        conversationId: message.conversation.id,
        recipientId: createMessageDto.recipientId,
      },
      { excludeExtraneousValues: true },
    );

    this.server
      .to(userId)
      .to(createMessageDto.recipientId)
      .emit('messageCreated', payload);

    return payload;
  }

  @SubscribeMessage('deleteMessage')
  @Serialize(MessageDto)
  @UseGuards(AuthGuard)
  async deleteMessage(
    @CurrentUserId() userId: string,
    @MessageBody() deleteMessageDto: DeleteMessageDto,
  ) {
    return this.messagesService.deleteMessage(userId, deleteMessageDto);
  }
}
