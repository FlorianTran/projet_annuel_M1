import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './entities/exercise.entity';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise])],
  providers: [ExerciseService],
  controllers: [ExerciseController],
  exports: [TypeOrmModule],
})
export class ExerciseModule {} 