import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from '../chatroom/entities/chatroom.entity';
import { Message } from '../message/entities/message.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom) private chatRoomRepo: Repository<ChatRoom>,
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  async findOrCreatePrivateRoom(userAId: string, userBId: string): Promise<ChatRoom> {
    const users = await this.userRepo.findByIds([userAId, userBId]);

    const existing = await this.chatRoomRepo
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.utilisateurs', 'user')
      .where('room.estPrivee = true')
      .getMany();

    for (const room of existing) {
      const ids = room.utilisateurs.map(u => u.id).sort();
      if (ids.includes(userAId) && ids.includes(userBId) && ids.length === 2) return room;
    }

    const newRoom = this.chatRoomRepo.create({
      nom: `Privé`,
      utilisateurs: users,
      estPrivee: true,
    });

    return this.chatRoomRepo.save(newRoom);
  }

  async createGroupRoom(nom: string, userIds: string[]): Promise<ChatRoom> {
    const utilisateurs = await this.userRepo.findByIds(userIds);
    const room = this.chatRoomRepo.create({ nom, utilisateurs, estPrivee: false });
    return this.chatRoomRepo.save(room);
  }

  async addUserToRoom(roomId: string, userId: string): Promise<ChatRoom> {
    const room = await this.chatRoomRepo.findOne({ where: { id: roomId }, relations: ['utilisateurs'] });
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!room || !user) throw new Error('Room or user not found');

    room.utilisateurs.push(user);
    return this.chatRoomRepo.save(room);
  }

  async getUserRooms(userId: string): Promise<ChatRoom[]> {
    return this.chatRoomRepo
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.utilisateurs', 'user')
      .where('user.id = :userId', { userId })
      .leftJoinAndSelect('room.messages', 'message')
      .getMany();
  }

  async getRoomMessages(roomId: string): Promise<Message[]> {
    return this.messageRepo.find({
      where: { chatRoom: { id: roomId } },
      relations: ['expediteur'],
      order: { dateEnvoi: 'ASC' },
    });
  }

  async saveMessage(roomId: string, userId: string, contenu: string): Promise<Message> {
    const room = await this.chatRoomRepo.findOne({ where: { id: roomId }, relations: ['utilisateurs'] });
    if (!room) throw new Error('Room not found');

    const isMember = room.utilisateurs.some(u => u.id === userId);
    if (!isMember) throw new Error('User not authorized in this room');

    const message = this.messageRepo.create({
      contenu,
      chatRoom: { id: roomId },
      expediteur: { id: userId },
    });
    return this.messageRepo.save(message);
  }
}
