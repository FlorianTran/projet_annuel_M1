import { Test, TestingModule } from '@nestjs/testing';
import { SalleDeSportController } from './salle-de-sport.controller';
import { SalleDeSportService } from './salle-de-sport.service';

describe('SalleDeSportController', () => {
  let controller: SalleDeSportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalleDeSportController],
      providers: [SalleDeSportService],
    }).compile();

    controller = module.get<SalleDeSportController>(SalleDeSportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
