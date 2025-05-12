import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ChatRoom } from '../../chatroom/entities/chatroom.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  contenu: string;

  @CreateDateColumn()
  dateEnvoi: Date;

  @ManyToOne(() => User)
  expediteur: User;

  @ManyToOne(() => ChatRoom, chatRoom => chatRoom.messages)
  chatRoom: ChatRoom;
}
