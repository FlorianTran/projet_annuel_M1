import { Test, TestingModule } from '@nestjs/testing';
import { SalleDeSportService } from './salle-de-sport.service';

describe('SalleDeSportService', () => {
  let service: SalleDeSportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalleDeSportService],
    }).compile();

    service = module.get<SalleDeSportService>(SalleDeSportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
