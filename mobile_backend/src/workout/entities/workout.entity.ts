import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exercise } from '../../exercise/entities/exercise.entity';
import { User } from '../../user/entities/user.entity';

export enum WorkoutLevel {
  DEBUTANT = 'débutant',
  INTERMEDIAIRE = 'intermédiaire',
  AVANCE = 'avancé',
}

export class WorkoutExercise {
  @Column()
  exerciseId: string;

  @Column()
  targetSets: number;

  @Column()
  targetReps: number;

  @Column({ nullable: true })
  notes?: string;
}

@Entity()
export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: WorkoutLevel })
  level: WorkoutLevel;

  @Column('jsonb')
  exercises: WorkoutExercise[];

  @Column({ nullable: true })
  entrainementId?: string;

  @ManyToOne(() => User, { nullable: false })
  createdBy: User;

  @ManyToMany(() => User)
  @JoinTable()
  assignedTo: User[];
} 