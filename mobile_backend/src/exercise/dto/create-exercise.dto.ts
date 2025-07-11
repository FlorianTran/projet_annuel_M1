import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  muscleGroups: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  createdById?: string;
} 