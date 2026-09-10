import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CurrentUserId } from '../authentication/decorators/current-user.decorator';
import { ProjectDto } from './dto/project.dto';
import { Serialize } from '../shared/interceptors/serialize.interceptor';

@Controller('projects')
@Serialize(ProjectDto)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  
}
