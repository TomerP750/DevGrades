import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { SerializePage } from '../shared/interceptors/serialize.interceptor';
import { CursorPaginationQueryDto } from '../shared/pagination/cursor-pagination-query.dto';
import { CursorPaginatedResult } from '../shared/pagination/cursor-pagination.types';
import { ProjectDto } from './dto/project.dto';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { CurrentUserId } from '../authentication/decorators/current-user.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('/api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get("/all")
  @SerializePage(ProjectDto)
  async allProjects(@Query() query: CursorPaginationQueryDto): Promise<CursorPaginatedResult<Project>> {
    return this.projectsService.findAll(query);
  }

  @Post("/create")
  async createProject(@CurrentUserId() userId: string, @Body() createProjectDto: CreateProjectDto) {
    this.projectsService.create(userId, createProjectDto);
  }

  @Put(":projectId")
  async updateProject(@CurrentUserId() userId: string, @Param("projectId") projectId: string, @Body() updateProjectDto: UpdateProjectDto) {
    this.projectsService.update(userId, projectId, updateProjectDto);
  }

  @Delete(":projectId")
  async deleteProject(@CurrentUserId() userId: string, @Param("projectId") projectId: string): Promise<void> {
    this.projectsService.delete(userId, projectId);
  }

  
}
