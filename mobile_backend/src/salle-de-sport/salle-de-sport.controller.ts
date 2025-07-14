// src/salle-de-sport/salle-de-sport.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { SalleDeSportService } from './salle-de-sport.service';
import { CreateSalleDeSportDto } from './dto/create-salle-de-sport.dto';
import { UpdateSalleDeSportDto } from './dto/update-salle-de-sport.dto';

@Controller('salle-de-sport')
export class SalleDeSportController {
  constructor(private readonly salleService: SalleDeSportService) {}

  @Post()
  create(@Body() dto: CreateSalleDeSportDto) {
    return this.salleService.create(dto);
  }

  @Get()
  findAll() {
    return this.salleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSalleDeSportDto) {
    return this.salleService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salleService.remove(id);
  }
}
