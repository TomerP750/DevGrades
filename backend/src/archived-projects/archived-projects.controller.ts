import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ArchivedProjectsService } from './archived-projects.service';
import { Serialize } from '../shared/interceptors/serialize.interceptor';
import { UserDto } from '../users/dto/user.dto';
import { CurrentUserId } from '../authentication/decorators/current-user.decorator';


@Controller('/api/archived-projects')
@Serialize(UserDto)
export class ArchivedProjectsController {
  constructor(private readonly archivedProjectsService: ArchivedProjectsService) {}

  @Get("/is-archived/:projectId")
  async isArchived(@CurrentUserId() userId: string, @Param("projectId") projectId: string) {
    return this.archivedProjectsService.isArchived(userId, projectId);
  }

  @Post("/toggle/:projectId")
  async toggleArchiveProject(@CurrentUserId() userId: string, @Param("projectId") projectId: string) {
    return this.archivedProjectsService.toggleArchiveProject(userId, projectId);
  }
}
