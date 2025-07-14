import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeanceService } from './seance.service';
import { CreateSeanceDto } from './dto/create-seance.dto';
import { UpdateSeanceDto } from './dto/update-seance.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('seances')
@Controller('seances')
export class SeanceController {
  constructor(private readonly seanceService: SeanceService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle séance' })
  @ApiResponse({ status: 201, description: 'Séance créée.' })
  create(@Body() createSeanceDto: CreateSeanceDto) {
    return this.seanceService.create(createSeanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister toutes les séances' })
  findAll() {
    return this.seanceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Trouver une séance par ID' })
  findOne(@Param('id') id: string) {
    return this.seanceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une séance' })
  update(@Param('id') id: string, @Body() updateSeanceDto: UpdateSeanceDto) {
    return this.seanceService.update(id, updateSeanceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une séance' })
  remove(@Param('id') id: string) {
    return this.seanceService.remove(id);
  }
}

