import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalleDeSport } from './entities/salle-de-sport.entity';
import { SalleDeSportService } from './salle-de-sport.service';
import { SalleDeSportController } from './salle-de-sport.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SalleDeSport])],
  controllers: [SalleDeSportController],
  providers: [SalleDeSportService],
  exports: [SalleDeSportService],
})
export class SalleDeSportModule {}
