import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSalleDeSportDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  ville: string;

  @IsString()
  @IsNotEmpty()
  codePostal: string;
}