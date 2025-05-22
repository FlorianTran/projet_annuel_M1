import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Niveau, Methodologie } from '../entities/entrainement.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEntrainementDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  titre: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: Niveau })
  @IsEnum(Niveau)
  niveau: Niveau;

  @ApiProperty({ enum: Methodologie })
  @IsEnum(Methodologie)
  methodologie: Methodologie;
}

