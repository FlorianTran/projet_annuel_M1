import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chatroom.entity';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, User])],
  controllers: [ChatroomController],
  providers: [ChatroomService],
  exports: [ChatroomService],
})
export class ChatroomModule {}
