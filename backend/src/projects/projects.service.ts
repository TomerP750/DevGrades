import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArchivedProject } from '../archived-projects/entities/archived-project.entity';
import { Review } from '../reviews/entities/review.entity';
import { buildCursorPage } from '../shared/pagination/build-cursor-page';
import { CursorPaginatedResult } from '../shared/pagination/cursor-paginated-result';
import { UsersService } from '../users/users.service';
import { Status } from './Status';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { decodeProjectCursor, encodeProjectCursor } from './pagination/project-cursor-codec';
import { ProjectSort, resolveProjectSort } from './pagination/project-sort';
import { ProjectsFiltersQueryDto } from './pagination/projects-filters-query.dto';

type ProjectFeedItem = Project & {
  overallAverageRating?: number;
  isArchived: boolean;
};

interface ProjectFeedRaw {
  overallAverageRating: string | number | null;
  isArchived: string | number | boolean;
}

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

  async findAll(
    userId: string,
    query: ProjectsFiltersQueryDto,
  ): Promise<CursorPaginatedResult<ProjectFeedItem>> {

    const options = {
      limit: query.limit ?? 6,
      sortBy: query.sortBy ?? ProjectSort.NEWEST,
      search: query.search?.trim() || undefined,
      archivedOnly: query.archived ?? false,
    };
    const { limit: pageSize, sortBy, search, archivedOnly } = options;
    const { column, direction } = resolveProjectSort(sortBy);
    const operator = direction === 'ASC' ? '>' : '<';
    const cursor = query.cursor;

    const queryBuilder = this.projectsRepository
      .createQueryBuilder('project')
      .innerJoinAndSelect('project.user', 'user')
      .leftJoin(
        ArchivedProject,
        'archived',
        'archived.projectId = project.id AND archived.userId = :userId',
        { userId },
      )
      .addSelect(
        'CASE WHEN archived.id IS NULL THEN 0 ELSE 1 END',
        'isArchived',
      )
      .addSelect(
        (subQuery) =>
          subQuery
            .select('AVG(review.overallScore)')
            .from(Review, 'review')
            .where('review.projectId = project.id'),
        'overallAverageRating',
      )
      .orderBy(column, direction)
      .addOrderBy('project.id', direction)
      .limit(pageSize + 1);

    if (cursor) {
      const decodedCursor = decodeProjectCursor(cursor, sortBy, search, archivedOnly);
      queryBuilder.andWhere(
        `(${column} ${operator} :cursorValue OR (${column} = :cursorValue AND project.id ${operator} :cursorId))`,
        { 
          cursorValue: decodedCursor.sortValue, 
          cursorId: decodedCursor.id 
        },
      );
    }

    if (archivedOnly) {
      queryBuilder.andWhere('archived.id IS NOT NULL');
    }

    if (search) {
      queryBuilder.andWhere('INSTR(project.name, :search) > 0', { search });
    }

    const { entities, raw } =
      await queryBuilder.getRawAndEntities<ProjectFeedRaw>();

    const projects = entities.map((project, index) => {
      const averageRating = raw[index]?.overallAverageRating;
      const isArchived = raw[index]?.isArchived;

      return Object.assign(project, {
        overallAverageRating:
          averageRating == null ? undefined : Number(averageRating),
        isArchived: Boolean(Number(isArchived)),
      });
    });

    return buildCursorPage(projects, pageSize, (project) =>
      encodeProjectCursor(project, sortBy, search, archivedOnly),
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
    const permitted = await this.isPermittedToOperateProject(userId, projectId);
    if (!permitted) {
      throw new ForbiddenException('You are not allowed to delete this project');
    }
    await this.projectsRepository.delete(projectId);
  }

  async closeProject(userId: string, projectId: string) {
    const permitted = await this.isPermittedToOperateProject(userId, projectId);
    if (!permitted) {
      throw new ForbiddenException('You are not allowed to close this project');
    }
    await this.projectsRepository.update(projectId, { status: Status.CLOSED });
  }

  private async isPermittedToOperateProject(userId: string, projectId: string) {
    const project = await this.findOne(projectId);
    return project?.user.id === userId;
  }
}
