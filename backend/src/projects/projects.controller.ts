import { Controller, Get, Query } from '@nestjs/common';
import { SerializePage } from '../shared/interceptors/serialize.interceptor';
import { CursorPaginationQueryDto } from '../shared/pagination/cursor-pagination-query.dto';
import { CursorPaginatedResult } from '../shared/pagination/cursor-pagination.types';
import { ProjectDto } from './dto/project.dto';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';

@Controller('/api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get("/all")
  @SerializePage(ProjectDto)
  async allProjects(@Query() query: CursorPaginationQueryDto): Promise<CursorPaginatedResult<Project>> {
    return this.projectsService.findAll(query);
  }

  
}
