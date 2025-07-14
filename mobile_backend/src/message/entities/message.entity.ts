import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ChatRoom } from '../../chatroom/entities/chatroom.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => ChatRoom, chatRoom => chatRoom.messages, { eager: false })  
  chatRoom: ChatRoom;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.messages, { eager: false })  
  user: User;

  @OneToMany(() => Message, message => message.user)
  messages: Message[];


}
