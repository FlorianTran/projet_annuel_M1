import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { CreatePaiementDto } from './dto/create-paiement.dto';
import { UpdatePaiementDto } from './dto/update-paiement.dto';

@Controller('paiements')
export class PaiementController {
  constructor(private readonly paiementService: PaiementService) {}

  @Post()
  create(@Body() dto: CreatePaiementDto) {
    return this.paiementService.create(dto);
  }

  @Get()
  findAll() {
    return this.paiementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paiementService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePaiementDto) {
    return this.paiementService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paiementService.remove(id);
  }
}
