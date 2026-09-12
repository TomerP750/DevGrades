import { Injectable } from '@nestjs/common';
import { CreateArchivedProjectDto } from './dto/create-archived-project.dto';
import { UpdateArchivedProjectDto } from './dto/update-archived-project.dto';

@Injectable()
export class ArchivedProjectsService {
  create(createArchivedProjectDto: CreateArchivedProjectDto) {
    return 'This action adds a new archivedProject';
  }

  findAll() {
    return `This action returns all archivedProjects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} archivedProject`;
  }

  update(id: number, updateArchivedProjectDto: UpdateArchivedProjectDto) {
    return `This action updates a #${id} archivedProject`;
  }

  remove(id: number) {
    return `This action removes a #${id} archivedProject`;
  }
}
