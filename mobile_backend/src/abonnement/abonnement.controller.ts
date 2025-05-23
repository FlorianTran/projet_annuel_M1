import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AbonnementService } from './abonnement.service';
import { CreateAbonnementDto } from './dto/create-abonnement.dto';
import { UpdateAbonnementDto } from './dto/update-abonnement.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('abonnements')
@Controller('abonnements')
export class AbonnementController {
  constructor(private readonly abonnementService: AbonnementService) {}

  @Post()
  create(@Body() dto: CreateAbonnementDto) {
    return this.abonnementService.create(dto);
  }

  @Get()
  findAll() {
    return this.abonnementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.abonnementService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAbonnementDto,
  ) {
    return this.abonnementService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.abonnementService.remove(id);
  }
}
