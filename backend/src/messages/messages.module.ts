import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { ConversationsModule } from '../conversations/conversations.module';
import { UsersModule } from '../users/users.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  providers: [MessagesGateway, MessagesService],
  imports: [
    TypeOrmModule.forFeature([Message]),
    ConversationsModule,
    UsersModule,
    AuthenticationModule
  ],
})
export class MessagesModule { }
