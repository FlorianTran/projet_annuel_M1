// src/message/message.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { User } from '../user/entities/user.entity';
import { ChatRoom } from '../chatroom/entities/chatroom.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(ChatRoom)
    private readonly chatroomRepository: Repository<ChatRoom>,
  ) {}

  async create(dto: CreateMessageDto): Promise<Message> {
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException(`Utilisateur ${dto.userId} introuvable`);

    const chatroom = await this.chatroomRepository.findOne({ where: { id: dto.chatroomId } });
    if (!chatroom) throw new NotFoundException(`Chatroom ${dto.chatroomId} introuvable`);

    const message = this.messageRepository.create({
      content: dto.content,
      user,
      chatRoom: chatroom,
    });

    const saved = await this.messageRepository.save(message);

    const fullMessage = await this.messageRepository.findOne({
      where: { id: saved.id },
      relations: ['user', 'chatRoom'],
    });
    if (!fullMessage) {
      throw new NotFoundException(`Message ${saved.id} introuvable`);
    }
    return fullMessage;
  }

  async findAll(): Promise<Message[]> {
    return this.messageRepository.find({
      relations: ['user', 'chatRoom'],
      order: { createdAt: 'ASC' },
    });
  }

  async findByChatRoom(roomId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { chatRoom: { id: roomId } },
      relations: ['user', 'chatRoom'],
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException(`Message ${id} introuvable`);
    }
    return message;
  }

  async update(id: string, dto: UpdateMessageDto): Promise<Message> {
    await this.messageRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.messageRepository.delete(id);
  }
}
