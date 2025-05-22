// src/chat/chat.service.ts (corrigé et complété)
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Message } from '../message/entities/message.entity';
import { User } from '../user/entities/user.entity';
import { ChatRoom } from '../chatroom/entities/chatroom.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(ChatRoom)
    private readonly chatroomRepo: Repository<ChatRoom>,
  ) {}

  async findMessagesByRoom(roomId: string): Promise<Message[]> {
    const chatroom = await this.chatroomRepo.findOne({ where: { id: roomId } });
    if (!chatroom) throw new NotFoundException('Chatroom introuvable');

    return this.messageRepo.find({
      where: { chatRoom: { id: roomId } },
      relations: ['user', 'chatRoom'],
      order: { createdAt: 'ASC' },
    });
  }

  async sendMessage(content: string, userId: string, chatroomId: string): Promise<Message> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const chatroom = await this.chatroomRepo.findOne({ where: { id: chatroomId } });
    if (!chatroom) throw new NotFoundException('Chatroom introuvable');

    const message = this.messageRepo.create({ content, user, chatRoom: chatroom });
    return this.messageRepo.save(message);
  }

  async findOrCreatePrivateRoom(userAId: string, userBId: string): Promise<ChatRoom> {
    let room = await this.chatroomRepo.findOne({
      where: {
        estPrivee: true,
        utilisateurs: In([userAId, userBId]),
      },
      relations: ['utilisateurs'],
    });

    if (!room) {
      const users = await this.userRepo.find({ where: { id: In([userAId, userBId]) } });
      room = this.chatroomRepo.create({ nom: 'Privé', estPrivee: true, utilisateurs: users });
      room = await this.chatroomRepo.save(room);
    }

    return room;
  }

  async createGroupRoom(nom: string, userIds: string[]): Promise<ChatRoom> {
    const users = await this.userRepo.find({ where: { id: In(userIds) } });
    const room = this.chatroomRepo.create({ nom, estPrivee: false, utilisateurs: users });
    return this.chatroomRepo.save(room);
  }

  async addUserToRoom(roomId: string, userId: string): Promise<ChatRoom> {
    const room = await this.chatroomRepo.findOne({ where: { id: roomId }, relations: ['utilisateurs'] });
    if (!room) throw new NotFoundException('Chatroom introuvable');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    room.utilisateurs.push(user);
    return this.chatroomRepo.save(room);
  }

  async getUserRooms(userId: string): Promise<ChatRoom[]> {
    return this.chatroomRepo.find({
      where: {},
      relations: ['utilisateurs'],
    }).then((rooms) => rooms.filter((r) => r.utilisateurs.some((u) => u.id === userId)));
  }

  async getRoomMessages(roomId: string): Promise<Message[]> {
    return this.findMessagesByRoom(roomId);
  }
}
