import { IsEmail, IsNotEmpty, IsString, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: "Nom de famille de l'utilisateur",
    example: "Dupont",
  })
  @IsNotEmpty()
  @IsString()
  nom: string;

  @ApiProperty({
    description: "Prénom de l'utilisateur",
    example: "Jean",
  })
  @IsNotEmpty()
  @IsString()
  prenom: string;

  @ApiProperty({
    description: "Adresse e-mail de l'utilisateur",
    example: "jean.dupont@example.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur (doit être sécurisé)",
    example: "MotDePasse123!",
  })
  @IsNotEmpty()
  @IsString()
  motDePasse: string;

  @ApiProperty({
    description: "Date de naissance de l'utilisateur",
    example: "1990-05-20",
    type: String, // Swagger lira ça comme une string, `class-transformer` gère le cast en Date
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dateNaissance: Date;

  @ApiProperty({
    description: "Sexe de l'utilisateur",
    example: "Homme",
    default: "Non spécifié"
  })
  @IsNotEmpty()
  @IsString()
  sexe: string;

  @ApiProperty({
    description: "Poids de l'utilisateur en kilogrammes",
    example: 75.5,
  })
  @IsNotEmpty()
  @IsNumber()
  poids: number;

  @ApiProperty({
    description: "Taille de l'utilisateur en centimètres",
    example: 180,
  })
  @IsNotEmpty()
  @IsNumber()
  taille: number;
}

