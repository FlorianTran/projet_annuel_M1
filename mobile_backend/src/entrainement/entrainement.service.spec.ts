import { Test, TestingModule } from '@nestjs/testing';
import { EntrainementService } from './entrainement.service';

describe('EntrainementService', () => {
  let service: EntrainementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntrainementService],
    }).compile();

    service = module.get<EntrainementService>(EntrainementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
