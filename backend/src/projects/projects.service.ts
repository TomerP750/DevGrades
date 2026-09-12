import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProjectsService {

  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private usersService: UsersService,
  ) {}

  async create(userId: string, createProjectDto: CreateProjectDto) {
    const user = await this.usersService.findOneUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const project = this.projectsRepository.create(createProjectDto);
    project.user = user;
    return this.projectsRepository.save(project);
  }


  async findOne(projectId: string) {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
      relations: { user: true },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async findAll() {

  }

  async update(userId: string, projectId: string, updateProjectDto: UpdateProjectDto) {
    const permitted = await this.isPermittedToOperateProject(userId, projectId);
    if (!permitted) {
      throw new ForbiddenException('You are not allowed to update this project');
    }
    await this.projectsRepository.update(projectId, updateProjectDto);
  }

  async delete(userId: string, projectId: string) {
    if (!await this.isPermittedToOperateProject(userId, projectId)) {
      throw new ForbiddenException('You are not allowed to delete this project');
    }
    await this.projectsRepository.delete(projectId);
  }

  private async isPermittedToOperateProject(userId: string, projectId: string) {
    const project = await this.findOne(projectId);
    return project?.user.id === userId;
  }
}
