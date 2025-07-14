import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from './entities/exercise.entity';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
  ) {}

  create(dto: CreateExerciseDto): Promise<Exercise> {
    const exercise = this.exerciseRepository.create(dto);
    return this.exerciseRepository.save(exercise);
  }

  findAll(): Promise<Exercise[]> {
    return this.exerciseRepository.find();
  }

  findOne(id: string): Promise<Exercise | null> {
    return this.exerciseRepository.findOneBy({ id });
  }

  async update(id: string, dto: UpdateExerciseDto): Promise<Exercise | null> {
    await this.exerciseRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.exerciseRepository.delete(id);
  }
} 