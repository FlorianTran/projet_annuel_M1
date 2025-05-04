import { IsDateString, IsInt, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsUUID()
  utilisateurId: string;
}

