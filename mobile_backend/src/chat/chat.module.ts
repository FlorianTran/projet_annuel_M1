import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from '../message/message.module';
import { ChatroomModule } from '../chatroom/chatroom.module';

@Module({
  imports: [MessageModule, ChatroomModule],
  providers: [ChatGateway],
})
export class ChatModule {}

