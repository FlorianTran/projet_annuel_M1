import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Entrainement } from '../../entrainement/entities/entrainement.entity';
import { User } from '../../user/entities/user.entity'; // corrige le chemin selon ton projet

@Entity()
export class Seance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column('int')
  duree: number; // minutes

  @Column('float')
  poidsSouleve: number;

  @Column('int')
  repetitions: number;

  @ManyToOne(() => Entrainement, entrainement => entrainement.seances, { nullable: false })
  entrainement: Entrainement;

  @ManyToOne(() => User, user => user.seances, { nullable: false })
  utilisateur: User;
}

