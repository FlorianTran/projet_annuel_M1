import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ChatRoom } from '../chatroom/entities/chatroom.entity';
import { User } from '../user/entities/user.entity';

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

    return this.messageRepository.save(message);
  }

  findAll(): Promise<Message[]> {
    return this.messageRepository.find({
      relations: ['user', 'chatRoom'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Message> {
    const msg = await this.messageRepository.findOne({
      where: { id },
      relations: ['user', 'chatRoom'],
    });
    if (!msg) throw new NotFoundException(`Message ${id} non trouvé`);
    return msg;
  }

  async update(id: string, dto: UpdateMessageDto): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['user', 'chatRoom'],
    });

    if (!message) throw new NotFoundException(`Message ${id} introuvable`);

    message.content = dto.content ?? message.content;

    return this.messageRepository.save(message);
  }

  async remove(id: string): Promise<void> {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) throw new NotFoundException(`Message ${id} introuvable`);

    await this.messageRepository.remove(message);
  }
}
