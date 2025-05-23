import { Module } from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { PaiementController } from './paiement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paiement } from './entities/paiement.entity';
import { Abonnement } from '../abonnement/entities/abonnement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paiement, Abonnement])],
  controllers: [PaiementController],
  providers: [PaiementService],
})
export class PaiementModule {}
