import { Test, TestingModule } from '@nestjs/testing';
import { ApiflightController } from './apiflight.controller';

describe('ApiflightController', () => {
  let controller: ApiflightController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiflightController],
    }).compile();

    controller = module.get<ApiflightController>(ApiflightController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
