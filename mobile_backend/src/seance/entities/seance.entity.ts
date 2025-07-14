import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column('jsonb', { nullable: true })
  exercises: {
    exerciseId: string;
    name: string;
    sets: number;
    reps: number;
    weight: number;
    notes?: string;
  }[];

  @ManyToOne(() => Entrainement, entrainement => entrainement.seances, { nullable: false })
  entrainement: Entrainement;

  @ManyToOne(() => User, user => user.seances, { nullable: true })
  utilisateur: User;
}

