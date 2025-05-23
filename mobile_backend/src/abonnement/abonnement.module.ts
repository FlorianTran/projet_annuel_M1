import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Abonnement } from './entities/abonnement.entity';
import { AbonnementService } from './abonnement.service';
import { AbonnementController } from './abonnement.controller';
import { User } from 'src/user/entities/user.entity';
import { Paiement } from 'src/paiement/entities/paiement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Abonnement, User, Paiement])],
  providers: [AbonnementService],
  controllers: [AbonnementController],
})
export class AbonnementModule {}
