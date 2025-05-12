import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { ChatRoom } from './entities/chatroom.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, User])],
  controllers: [ChatroomController],
  providers: [ChatroomService],
  exports: [ChatroomService],
})
export class ChatroomModule {}
