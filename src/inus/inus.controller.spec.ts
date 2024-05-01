import { Test, TestingModule } from '@nestjs/testing';
import { InusController } from './inus.controller';

describe('InusController', () => {
  let controller: InusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InusController],
    }).compile();

    controller = module.get<InusController>(InusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
