import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArchivedProject } from '../archived-projects/entities/archived-project.entity';
import { buildCursorPage } from '../shared/pagination/build-cursor-page';
import { CursorPaginatedResult } from '../shared/pagination/cursor-paginated-result';
import { UsersService } from '../users/users.service';
import { Status } from './Status';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { decodeProjectCursor, encodeProjectCursor } from './pagination/project-cursor-codec';
import { resolveProjectSort } from './pagination/project-sort';
import { ProjectsFiltersQueryDto } from './pagination/projects-filters-query.dto';


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
    const newProject = {
      ...createProjectDto,
      status: Status.OPEN,
      user,
    }
    const project = this.projectsRepository.create(newProject);
    return await this.projectsRepository.save(project);
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

  async findAll(userId: string, query: ProjectsFiltersQueryDto): Promise<CursorPaginatedResult<Project>> {

    const { cursor, limit, search, sortBy, archived } = query;

    const pageSize = limit ?? 6;
    const { column, direction } = resolveProjectSort(sortBy);
    const operator = direction === 'ASC' ? '>' : '<';

    const queryBuilder = this.projectsRepository
      .createQueryBuilder('project')
      .innerJoinAndSelect('project.user', 'user')
      .orderBy(column, direction)
      .addOrderBy('project.id', direction)
      .limit(pageSize + 1);

    if (cursor) {
      const decodedCursor = decodeProjectCursor(cursor, sortBy, search, archived);
      queryBuilder.andWhere(
        `(${column} ${operator} :cursorValue OR (${column} = :cursorValue AND project.id ${operator} :cursorId))`,
        { cursorValue: decodedCursor.sortValue, cursorId: decodedCursor.id },
      );
    }

    if (archived) {
      queryBuilder.innerJoin(
        ArchivedProject,
        'archived',
        'archived.projectId = project.id AND archived.userId = :userId',
        { userId },
      );
    }

    if (search) {
      queryBuilder.andWhere('INSTR(project.name, :search) > 0', { search });
    }

    const projects = await queryBuilder.getMany();

    return buildCursorPage(projects, pageSize, (project) =>
      encodeProjectCursor(project, sortBy, search, archived),
    );
  }

  async findAllByUserId(userId: string) {
    const projects = await this.projectsRepository.find({
      where: { user: { id: userId } },
      relations: { user: true },
    });
    return projects;
  }

  async update(userId: string, projectId: string, updateProjectDto: UpdateProjectDto) {
    const permitted = await this.isPermittedToOperateProject(userId, projectId);
    if (!permitted) {
      throw new ForbiddenException('You are not allowed to update this project');
    }
    await this.projectsRepository.update(projectId, updateProjectDto);
    return await this.findOne(projectId);
  }

  async delete(userId: string, projectId: string) {
    if (!await this.isPermittedToOperateProject(userId, projectId)) {
      throw new ForbiddenException('You are not allowed to delete this project');
    }
    await this.projectsRepository.delete(projectId);
  }

  async closeProject(userId: string, projectId: string) {
    if (!await this.isPermittedToOperateProject(userId, projectId)) {
      throw new ForbiddenException('You are not allowed to close this project');
    }
    await this.projectsRepository.update(projectId, { status: Status.CLOSED });
  }

  private async isPermittedToOperateProject(userId: string, projectId: string) {
    const project = await this.findOne(projectId);
    return project?.user.id === userId;
  }
}
