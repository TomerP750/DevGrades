import { Test, TestingModule } from '@nestjs/testing';
import { ArchivedProjectsService } from './archived-projects.service';

describe('ArchivedProjectsService', () => {
  let service: ArchivedProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArchivedProjectsService],
    }).compile();

    service = module.get<ArchivedProjectsService>(ArchivedProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
