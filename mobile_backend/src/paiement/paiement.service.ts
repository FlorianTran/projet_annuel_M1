import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paiement } from './entities/paiement.entity';
import { CreatePaiementDto } from './dto/create-paiement.dto';
import { UpdatePaiementDto } from './dto/update-paiement.dto';
import { Abonnement } from '../abonnement/entities/abonnement.entity';

@Injectable()
export class PaiementService {
  constructor(
    @InjectRepository(Paiement)
    private paiementRepository: Repository<Paiement>,

    @InjectRepository(Abonnement)
    private abonnementRepository: Repository<Abonnement>,
  ) {}

  async create(dto: CreatePaiementDto): Promise<Paiement> {
    const abonnement = await this.abonnementRepository.findOneByOrFail({
      id: dto.abonnementId,
    });

    const paiement = this.paiementRepository.create({
      ...dto,
      abonnement,
    });

    return this.paiementRepository.save(paiement);
  }

  findAll() {
    return this.paiementRepository.find({ relations: ['abonnement'] });
  }

  findOne(id: string) {
    return this.paiementRepository.findOne({
      where: { id },
      relations: ['abonnement'],
    });
  }

  async update(id: string, dto: UpdatePaiementDto) {
    const paiement = await this.paiementRepository.findOneByOrFail({ id });

    if (dto.abonnementId) {
      paiement.abonnement = await this.abonnementRepository.findOneByOrFail({
        id: dto.abonnementId,
      });
    }

    Object.assign(paiement, dto);
    return this.paiementRepository.save(paiement);
  }

  remove(id: string) {
    return this.paiementRepository.delete(id);
  }
}
