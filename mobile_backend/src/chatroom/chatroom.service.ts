import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { ChatRoom } from './entities/chatroom.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatroomRepository: Repository<ChatRoom>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateChatroomDto): Promise<ChatRoom> {
    const chatroom = this.chatroomRepository.create({
      nom: dto.nom,
      estPrivee: dto.estPrivee ?? false,
    });

    if (dto.utilisateurs?.length) {
      const users = await this.userRepository.find({
        where: { id: In(dto.utilisateurs) },
      });
      chatroom.utilisateurs = users;
    }

    return this.chatroomRepository.save(chatroom);
  }

  async findAll(): Promise<ChatRoom[]> {
    return this.chatroomRepository.find({
      relations: ['utilisateurs', 'messages'],
    });
  }

  async findOne(id: string): Promise<ChatRoom> {
    const chatroom = await this.chatroomRepository.findOne({
      where: { id },
      relations: ['utilisateurs', 'messages'],
    });
    if (!chatroom) {
      throw new NotFoundException(`ChatRoom avec ID ${id} non trouvé`);
    }
    return chatroom;
  }

  async update(id: string, dto: UpdateChatroomDto): Promise<ChatRoom> {
    const chatroom = await this.chatroomRepository.findOne({ where: { id } });
    if (!chatroom) throw new NotFoundException(`ChatRoom ${id} introuvable`);

    if (dto.nom !== undefined) chatroom.nom = dto.nom;
    if (dto.estPrivee !== undefined) chatroom.estPrivee = dto.estPrivee;

    if (dto.utilisateurs?.length) {
      const users = await this.userRepository.find({
        where: { id: In(dto.utilisateurs) },
      });
      chatroom.utilisateurs = users;
    }

    return this.chatroomRepository.save(chatroom);
  }

  async remove(id: string): Promise<void> {
    const chatroom = await this.chatroomRepository.findOne({ where: { id } });
    if (!chatroom) throw new NotFoundException(`ChatRoom ${id} introuvable`);
    await this.chatroomRepository.remove(chatroom);
  }
}
