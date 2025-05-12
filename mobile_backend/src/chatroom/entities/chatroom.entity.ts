import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
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

  @ManyToMany(() => User, (user) => user.chatRooms, { eager: false })
  @JoinTable()
  utilisateurs: User[];

  @OneToMany(() => Message, (message) => message.chatRoom, { cascade: true })
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;
}
