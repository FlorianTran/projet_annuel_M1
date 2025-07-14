import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsInt, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

export class SeanceExerciseDto {
  @ApiProperty()
  @IsUUID()
  exerciseId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsInt()
  sets: number;

  @ApiProperty()
  @IsInt()
  reps: number;

  @ApiProperty()
  @IsNumber()
  weight: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateSeanceDto {
  @ApiProperty()
  @IsDateString()
  date: Date;

  @ApiProperty()
  @IsInt()
  duree: number;

  @ApiProperty()
  @IsNumber()
  poidsSouleve: number;

  @ApiProperty()
  @IsInt()
  repetitions: number;

  @ApiProperty()
  @IsUUID()
  entrainementId: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  utilisateurId: string;

  @ApiProperty({ type: [SeanceExerciseDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeanceExerciseDto)
  @IsOptional()
  exercises?: SeanceExerciseDto[];
}
