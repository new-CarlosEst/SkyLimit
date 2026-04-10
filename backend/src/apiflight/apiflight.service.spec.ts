import { Test, TestingModule } from '@nestjs/testing';
import { ApiflightService } from './apiflight.service';

describe('ApiflightService', () => {
  let service: ApiflightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiflightService],
    }).compile();

    service = module.get<ApiflightService>(ApiflightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
