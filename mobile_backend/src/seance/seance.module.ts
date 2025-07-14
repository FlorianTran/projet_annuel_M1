import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeanceService } from './seance.service';
import { SeanceController } from './seance.controller';
import { Seance } from './entities/seance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seance])],
  controllers: [SeanceController],
  providers: [SeanceService],
  exports: [SeanceService],
})
export class SeanceModule {}

