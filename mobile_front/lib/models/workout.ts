import { User } from './user';

export interface WorkoutExercise {
  exerciseId: string;
  targetSets: number;
  targetReps: number;
  notes?: string;
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  level: 'débutant' | 'intermédiaire' | 'avancé';
  exercises: WorkoutExercise[];
  createdBy: User;
  assignedTo: User[];
  entrainementId?: string;
} 