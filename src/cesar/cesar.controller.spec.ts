import { Test, TestingModule } from '@nestjs/testing';
import { CesarController } from './cesar.controller';

describe('CesarController', () => {
  let controller: CesarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CesarController],
    }).compile();

    controller = module.get<CesarController>(CesarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
