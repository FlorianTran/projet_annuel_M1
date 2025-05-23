import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Abonnement } from './entities/abonnement.entity';
import { CreateAbonnementDto } from './dto/create-abonnement.dto';
import { UpdateAbonnementDto } from './dto/update-abonnement.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AbonnementService {
  constructor(
    @InjectRepository(Abonnement)
    private readonly repo: Repository<Abonnement>,
  ) {}

  create(dto: CreateAbonnementDto) {
    const abonnement = this.repo.create({
      ...dto,
      user: { id: dto.utilisateurId } as User,
    });
    return this.repo.save(abonnement);
  }

  findAll() {
    return this.repo.find({ relations: ['user'] });
  }

  async findOne(id: string) {
    const ab = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!ab) throw new NotFoundException('Abonnement non trouvé');
    return ab;
  }

  async update(id: string, dto: UpdateAbonnementDto) {
    await this.repo.update(id, {
      ...dto,
      user: dto.utilisateurId
        ? ({ id: dto.utilisateurId } as User)
        : undefined,
    });
    const updated = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!updated) throw new NotFoundException();
    return updated;
  }

  async remove(id: string) {
    const ab = await this.findOne(id);
    return this.repo.remove(ab);
  }
}
