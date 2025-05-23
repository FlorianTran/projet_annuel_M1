import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Abonnement } from '../../abonnement/entities/abonnement.entity';

export enum MethodePaiement {
  CB = 'CB',
  PayPal = 'PayPal',
  Stripe = 'Stripe',
}

@Entity()
export class Paiement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  datePaiement: Date;

  @Column('decimal')
  montant: number;

  @Column({
    type: 'enum',
    enum: MethodePaiement,
  })
  methode: MethodePaiement;

  @ManyToOne(() => Abonnement, (abonnement) => abonnement.paiements, {
    onDelete: 'CASCADE',
  })
  abonnement: Abonnement;
}
