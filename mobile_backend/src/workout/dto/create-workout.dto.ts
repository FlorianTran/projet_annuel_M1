import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { WorkoutLevel } from '../entities/workout.entity';

class WorkoutExerciseDto {
  @IsString()
  exerciseId: string;

  @IsNotEmpty()
  targetSets: number;

  @IsNotEmpty()
  targetReps: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateWorkoutDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(WorkoutLevel)
  level: WorkoutLevel;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  exercises: WorkoutExerciseDto[];

  @IsString()
  createdById: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  assignedToIds?: string[];

  @IsOptional()
  @IsString()
  entrainementId?: string;
} 