import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntrainementService } from './entrainement.service';
import { EntrainementController } from './entrainement.controller';
import { Entrainement } from './entities/entrainement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entrainement])],  // ← C'est OBLIGATOIRE
  controllers: [EntrainementController],
  providers: [EntrainementService],
  exports: [EntrainementService],
})
export class EntrainementModule {}

