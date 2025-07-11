import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSeanceDto } from './dto/create-seance.dto';
import { UpdateSeanceDto } from './dto/update-seance.dto';
import { Seance } from './entities/seance.entity';

@Injectable()
export class SeanceService {
  constructor(
    @InjectRepository(Seance)
    private seanceRepository: Repository<Seance>,
  ) {}

  async create(createSeanceDto: CreateSeanceDto) {
    console.log('=== SEANCE CREATION DEBUG ===');
    console.log('Received DTO:', JSON.stringify(createSeanceDto, null, 2));
    console.log('entrainementId:', createSeanceDto.entrainementId);
    console.log('entrainementId type:', typeof createSeanceDto.entrainementId);
    console.log('entrainementId is null:', createSeanceDto.entrainementId === null);
    console.log('entrainementId is undefined:', createSeanceDto.entrainementId === undefined);
    
    if (!createSeanceDto.entrainementId) {
      console.error('❌ entrainementId is missing or null!');
      throw new Error('entrainementId is required');
    }

    const seance = this.seanceRepository.create({
      ...createSeanceDto,
      entrainement: { id: createSeanceDto.entrainementId },
      utilisateur: { id: createSeanceDto.utilisateurId },
      exercises: createSeanceDto.exercises ?? [],
    });
    
    console.log('Created seance entity:', JSON.stringify(seance, null, 2));
    
    return this.seanceRepository.save(seance);
  }

  async findAll() {
    return this.seanceRepository.find({ relations: ['entrainement', 'utilisateur'] });
  }

  async findOne(id: string) {
    return this.seanceRepository.findOne({ where: { id }, relations: ['entrainement', 'utilisateur'] });
  }

  async update(id: string, updateSeanceDto: UpdateSeanceDto) {
    const { entrainementId, utilisateurId, ...seanceData } = updateSeanceDto as any;

    const updatedFields: any = {
      ...seanceData,
    };

    if (entrainementId) {
      updatedFields.entrainement = { id: entrainementId };
    }

    if (utilisateurId) {
      updatedFields.utilisateur = { id: utilisateurId };
    }

    await this.seanceRepository.update(id, updatedFields);
    return this.findOne(id);
  }
  
  async remove(id: string) {
    await this.seanceRepository.delete(id);
    return { message: `Séance ${id} supprimée.` };
}


}
