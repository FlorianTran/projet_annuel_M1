// 1. chatroom.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Message } from '../../message/entities/message.entity';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column({ default: false })
  estPrivee: boolean;

  @ManyToMany(() => User, user => user.chatRooms)
  @JoinTable()
  utilisateurs: User[];

  @OneToMany(() => Message, message => message.chatRoom)
  messages: Message[];
}
