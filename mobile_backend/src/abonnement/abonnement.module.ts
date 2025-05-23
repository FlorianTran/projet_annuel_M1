import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Abonnement } from './entities/abonnement.entity';
import { AbonnementService } from './abonnement.service';
import { AbonnementController } from './abonnement.controller';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Abonnement, User])],
  providers: [AbonnementService],
  controllers: [AbonnementController],
})
export class AbonnementModule {}
