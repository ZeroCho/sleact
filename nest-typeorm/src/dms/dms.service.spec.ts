import { Test, TestingModule } from '@nestjs/testing';
import { DMsService } from './dms.service';

describe('DmsService', () => {
  let service: DMsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DMsService],
    }).compile();

    service = module.get<DMsService>(DMsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
