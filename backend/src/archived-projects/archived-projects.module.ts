import { Module } from '@nestjs/common';
import { ArchivedProjectsService } from './archived-projects.service';
import { ArchivedProjectsController } from './archived-projects.controller';

@Module({
  controllers: [ArchivedProjectsController],
  providers: [ArchivedProjectsService],
})
export class ArchivedProjectsModule {}
