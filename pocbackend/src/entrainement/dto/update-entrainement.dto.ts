import { PartialType } from '@nestjs/swagger';
import { CreateEntrainementDto } from './create-entrainement.dto';

export class UpdateEntrainementDto extends PartialType(CreateEntrainementDto) {}
