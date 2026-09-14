import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Serialize, SerializePage } from '../shared/interceptors/serialize.interceptor';
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

  @Get("/:projectId")
  @Serialize(ProjectDto)
  async oneProject(@Param("projectId") projectId: string): Promise<Project> {
    return this.projectsService.findOne(projectId);
  }

  @Get("/user/:userId")
  @Serialize(ProjectDto)
  async getProjectsByUserId(@Param("userId") userId: string): Promise<Project[]> {
    return this.projectsService.findAllByUserId(userId);
  }

  @Post("/create")
  async createProject(@CurrentUserId() userId: string, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(userId, createProjectDto);
  }

  @Put("/update/:projectId")
  async updateProject(@CurrentUserId() userId: string, @Param("projectId") projectId: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(userId, projectId, updateProjectDto);
  }

  @Delete("/delete/:projectId")
  async deleteProject(@CurrentUserId() userId: string, @Param("projectId") projectId: string): Promise<void> {
    this.projectsService.delete(userId, projectId);
  }

  
}
