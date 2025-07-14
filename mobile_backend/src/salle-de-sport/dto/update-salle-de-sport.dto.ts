import { PartialType } from '@nestjs/mapped-types';
import { CreateSalleDeSportDto } from './create-salle-de-sport.dto';

export class UpdateSalleDeSportDto extends PartialType(CreateSalleDeSportDto) {}
