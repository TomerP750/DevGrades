import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArchivedProjectsService } from './archived-projects.service';
import { CreateArchivedProjectDto } from './dto/create-archived-project.dto';
import { UpdateArchivedProjectDto } from './dto/update-archived-project.dto';

@Controller('archived-projects')
export class ArchivedProjectsController {
  constructor(private readonly archivedProjectsService: ArchivedProjectsService) {}

  @Post()
  create(@Body() createArchivedProjectDto: CreateArchivedProjectDto) {
    return this.archivedProjectsService.create(createArchivedProjectDto);
  }

  @Get()
  findAll() {
    return this.archivedProjectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.archivedProjectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArchivedProjectDto: UpdateArchivedProjectDto) {
    return this.archivedProjectsService.update(+id, updateArchivedProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.archivedProjectsService.remove(+id);
  }
}
