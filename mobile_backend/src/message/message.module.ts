import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message } from './entities/message.entity';
import { User } from '../user/entities/user.entity';
import { ChatRoom } from '../chatroom/entities/chatroom.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User, ChatRoom])
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
