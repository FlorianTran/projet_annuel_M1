import {
    IsEnum,
    IsDate,
    IsNumber,
    IsNotEmpty,
    IsUUID,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty } from '@nestjs/swagger';
  import { TypeAbonnement } from '../entities/abonnement.entity';
  
  export class CreateAbonnementDto {
    @ApiProperty({ enum: TypeAbonnement, example: TypeAbonnement.MENSUEL })
    @IsEnum(TypeAbonnement)
    type: TypeAbonnement;
  
    @ApiProperty({ example: '2025-05-01' })
    @IsDate()
    @Type(() => Date)
    dateDebut: Date;
  
    @ApiProperty({ example: '2025-06-01' })
    @IsDate()
    @Type(() => Date)
    dateFin: Date;
  
    @ApiProperty({ example: 49.99 })
    @IsNumber()
    prix: number;
  
    @ApiProperty({ description: "ID de l'utilisateur", example: 'uuid-user' })
    @IsUUID()
    utilisateurId: string;
  }
  