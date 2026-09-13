import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { UsersService } from '../users/users.service';
import { buildCursorPage } from '../shared/pagination/build-cursor-page';
import { decodeCursor, encodeCursor } from '../shared/pagination/cursor-codec';
import { CursorPaginationQueryDto } from '../shared/pagination/cursor-pagination-query.dto';
import { CursorPaginatedResult } from '../shared/pagination/cursor-pagination.types';


@Injectable()
export class ProjectsService {

  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    private usersService: UsersService,
  ) { }

  async create(userId: string, createProjectDto: CreateProjectDto) {
    const user = await this.usersService.findOneUserById(userId);
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

  async findAll({ cursor, limit }: CursorPaginationQueryDto): Promise<CursorPaginatedResult<Project>> {
    const queryBuilder = this.projectsRepository
      .createQueryBuilder('project')
      .innerJoinAndSelect('project.user', 'user')
      .orderBy('project.createdAt', 'DESC')
      .addOrderBy('project.id', 'DESC')
      .limit(limit + 1);

    if (cursor) {
      const { createdAt, id } = decodeCursor(cursor);
      queryBuilder.where(
        '(project.createdAt < :createdAt OR (project.createdAt = :createdAt AND project.id < :id))',
        { createdAt, id },
      );
    }

    const projects = await queryBuilder.getMany();

    return buildCursorPage(projects, limit, (project) =>
      encodeCursor({ createdAt: project.createdAt, id: project.id }),
    );
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
