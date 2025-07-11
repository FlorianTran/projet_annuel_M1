import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { Workout } from './entities/workout.entity';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutRepository: Repository<Workout>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateWorkoutDto): Promise<Workout> {
    console.log('=== WORKOUT CREATION DEBUG ===');
    console.log('Received DTO:', JSON.stringify(dto, null, 2));
    console.log('entrainementId from DTO:', dto.entrainementId);
    
    const createdBy = await this.userRepository.findOneBy({ id: dto.createdById });
    if (!createdBy) throw new Error('User not found for createdById');
    
    const assignedTo = dto.assignedToIds && dto.assignedToIds.length > 0
      ? await this.userRepository.findBy({ id: In(dto.assignedToIds) })
      : [];
      
    const workout = this.workoutRepository.create({
      ...dto,
      createdBy,
      assignedTo,
      entrainementId: dto.entrainementId,
    });
    
    console.log('Created workout entity:', JSON.stringify(workout, null, 2));
    const savedWorkout = await this.workoutRepository.save(workout);
    console.log('Saved workout:', JSON.stringify(savedWorkout, null, 2));
    
    return savedWorkout;
  }

  findAll(): Promise<Workout[]> {
    console.log('=== WORKOUT FIND ALL DEBUG ===');
    const workouts = this.workoutRepository.find({ relations: ['createdBy', 'assignedTo'] });
    console.log('Found workouts:', JSON.stringify(workouts, null, 2));
    return workouts;
  }

  findOne(id: string): Promise<Workout | null> {
    return this.workoutRepository.findOne({ where: { id }, relations: ['createdBy', 'assignedTo'] });
  }

  async update(id: string, dto: UpdateWorkoutDto): Promise<Workout | null> {
    if (dto.assignedToIds && dto.assignedToIds.length > 0) {
      const assignedTo = await this.userRepository.findBy({ id: In(dto.assignedToIds) });
      await this.workoutRepository.update(id, { ...dto, assignedTo });
    } else {
      await this.workoutRepository.update(id, dto);
    }
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.workoutRepository.delete(id);
  }
} 