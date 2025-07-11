import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseService } from './exercise.service';

@Controller('exercises')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  create(@Body() dto: CreateExerciseDto) {
    return this.exerciseService.create(dto);
  }

  @Get()
  findAll() {
    return this.exerciseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exerciseService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateExerciseDto) {
    return this.exerciseService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exerciseService.remove(id);
  }
} 