import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Workout } from './entities/workout.entity';
import { WorkoutController } from './workout.controller';
import { WorkoutService } from './workout.service';

@Module({
  imports: [TypeOrmModule.forFeature([Workout, User]), UserModule],
  providers: [WorkoutService],
  controllers: [WorkoutController],
  exports: [TypeOrmModule],
})
export class WorkoutModule {} 