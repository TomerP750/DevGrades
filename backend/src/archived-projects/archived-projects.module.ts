import { Module } from '@nestjs/common';
import { ArchivedProjectsService } from './archived-projects.service';
import { ArchivedProjectsController } from './archived-projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchivedProject } from './entities/archived-project.entity';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [TypeOrmModule.forFeature([ArchivedProject]), UsersModule, ProjectsModule],
  controllers: [ArchivedProjectsController],
  providers: [ArchivedProjectsService],
})
export class ArchivedProjectsModule {}
