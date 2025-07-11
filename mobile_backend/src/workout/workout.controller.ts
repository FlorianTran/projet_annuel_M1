import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { WorkoutService } from './workout.service';

@Controller('workouts')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post()
  create(@Body() dto: CreateWorkoutDto) {
    return this.workoutService.create(dto);
  }

  @Get()
  findAll() {
    return this.workoutService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workoutService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWorkoutDto) {
    return this.workoutService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workoutService.remove(id);
  }
} 