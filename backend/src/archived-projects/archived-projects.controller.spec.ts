import { Test, TestingModule } from '@nestjs/testing';
import { ArchivedProjectsController } from './archived-projects.controller';
import { ArchivedProjectsService } from './archived-projects.service';

describe('ArchivedProjectsController', () => {
  let controller: ArchivedProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArchivedProjectsController],
      providers: [ArchivedProjectsService],
    }).compile();

    controller = module.get<ArchivedProjectsController>(ArchivedProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
