import { IsUUID, IsDateString, IsEnum, IsNumber } from 'class-validator';
import { MethodePaiement } from '../entities/paiement.entity';

export class CreatePaiementDto {
  @IsDateString()
  datePaiement: Date;

  @IsNumber()
  montant: number;

  @IsEnum(MethodePaiement)
  methode: MethodePaiement;

  @IsUUID()
  abonnementId: string;
}
