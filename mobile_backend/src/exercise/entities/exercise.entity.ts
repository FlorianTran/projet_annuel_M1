import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('simple-array')
  muscleGroups: string[];

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  icon?: string;

  @ManyToOne(() => User, { nullable: true })
  createdBy?: User;
} 