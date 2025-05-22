import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEntrainementDto } from './dto/create-entrainement.dto';
import { UpdateEntrainementDto } from './dto/update-entrainement.dto';
import { Entrainement } from './entities/entrainement.entity';

@Injectable()
export class EntrainementService {
  constructor(
    @InjectRepository(Entrainement)
    private entrainementRepository: Repository<Entrainement>,
  ) {}

  async create(createEntrainementDto: CreateEntrainementDto) {
    const entrainement = this.entrainementRepository.create(createEntrainementDto);
    return this.entrainementRepository.save(entrainement);
  }

  async findAll() {
    return this.entrainementRepository.find({ relations: ['seances'] });
  }

  async findOne(id: string) {
    return this.entrainementRepository.findOne({ where: { id }, relations: ['seances'] });
  }

  async update(id: string, updateEntrainementDto: UpdateEntrainementDto) {
    await this.entrainementRepository.update(id, updateEntrainementDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.entrainementRepository.delete(id);
    return { message: `Entrainement ${id} supprimé.` };
  }
}

