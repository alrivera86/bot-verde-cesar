import { Test, TestingModule } from '@nestjs/testing';
import { CesarService } from './cesar.service';

describe('CesarService', () => {
  let service: CesarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CesarService],
    }).compile();

    service = module.get<CesarService>(CesarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
