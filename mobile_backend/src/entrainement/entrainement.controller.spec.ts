import { Test, TestingModule } from '@nestjs/testing';
import { EntrainementController } from './entrainement.controller';
import { EntrainementService } from './entrainement.service';

describe('EntrainementController', () => {
  let controller: EntrainementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntrainementController],
      providers: [EntrainementService],
    }).compile();

    controller = module.get<EntrainementController>(EntrainementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
