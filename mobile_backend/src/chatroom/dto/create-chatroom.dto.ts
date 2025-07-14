import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class CreateChatroomDto {
  @ApiProperty({ example: 'Général' })
  @IsString()
  nom: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  estPrivee?: boolean;

  @ApiProperty({ example: ['uuid-user-1', 'uuid-user-2'], required: false, description: 'Liste des IDs utilisateur' })
  @IsArray()
  @IsOptional()
  utilisateurs?: string[];
}
