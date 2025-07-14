// src/salle-de-sport/salle-de-sport.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSalleDeSportDto } from './dto/create-salle-de-sport.dto';
import { UpdateSalleDeSportDto } from './dto/update-salle-de-sport.dto';
import { SalleDeSport } from './entities/salle-de-sport.entity';

@Injectable()
export class SalleDeSportService {
  constructor(
    @InjectRepository(SalleDeSport)
    private readonly salleRepo: Repository<SalleDeSport>,
  ) {}

  create(dto: CreateSalleDeSportDto) {
    const salle = this.salleRepo.create(dto);
    return this.salleRepo.save(salle);
  }

  findAll() {
    return this.salleRepo.find({ relations: ['users'] });
  }

  findOne(id: string) {
    return this.salleRepo.findOne({ where: { id }, relations: ['users'] });
  }

  async update(id: string, dto: UpdateSalleDeSportDto) {
    const salle = await this.salleRepo.preload({ id, ...dto });
    if (!salle) {
      throw new NotFoundException(`Salle de sport ${id} non trouvée`);
    }
    return this.salleRepo.save(salle);
  }

  async remove(id: string) {
    const salle = await this.salleRepo.findOneBy({ id });
    if (!salle) {
      throw new NotFoundException(`Salle de sport ${id} non trouvée`);
    }
    return this.salleRepo.remove(salle);
  }
}
