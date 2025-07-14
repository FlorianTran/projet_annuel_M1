import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EntrainementService } from './entrainement.service';
import { CreateEntrainementDto } from './dto/create-entrainement.dto';
import { UpdateEntrainementDto } from './dto/update-entrainement.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('entrainements')
@Controller('entrainements')
export class EntrainementController {
  constructor(private readonly entrainementService: EntrainementService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel entrainement' })
  @ApiResponse({ status: 201, description: 'Entrainement créé.' })
  create(@Body() createEntrainementDto: CreateEntrainementDto) {
    return this.entrainementService.create(createEntrainementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les entrainements' })
  findAll() {
    return this.entrainementService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Trouver un entrainement par ID' })
  findOne(@Param('id') id: string) {
    return this.entrainementService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un entrainement' })
  update(@Param('id') id: string, @Body() updateEntrainementDto: UpdateEntrainementDto) {
    return this.entrainementService.update(id, updateEntrainementDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un entrainement' })
  remove(@Param('id') id: string) {
    return this.entrainementService.remove(id);
  }

}
