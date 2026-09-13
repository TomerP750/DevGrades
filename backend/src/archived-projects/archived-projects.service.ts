import { Injectable, NotFoundException } from '@nestjs/common';
import { ArchivedProject } from './entities/archived-project.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class ArchivedProjectsService {

  constructor(
    @InjectRepository(ArchivedProject)
    private readonly archivedProjectsRepository: Repository<ArchivedProject>,
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  async toggleArchiveProject(userId: string, projectId: string) {

    const user = await this.usersService.findOneUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const project = await this.projectsService.findOne(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const archivedProject = await this.findArchivedProject(userId, projectId);
    if (!archivedProject) {
      await this.archivedProjectsRepository.save({
        user,
        project,
      });
      return true;
    }
    await this.archivedProjectsRepository.delete(archivedProject.id);
    return false;
  }

  async getArchivedProjects(userId: string) {

  }

  private async findArchivedProject(userId: string, projectId: string) {
    return await this.archivedProjectsRepository.findOne({
      where: { user: { id: userId }, project: { id: projectId } },
    });
  }




}
