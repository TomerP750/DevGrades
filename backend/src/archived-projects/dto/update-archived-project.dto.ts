import { PartialType } from '@nestjs/mapped-types';
import { CreateArchivedProjectDto } from './create-archived-project.dto';

export class UpdateArchivedProjectDto extends PartialType(CreateArchivedProjectDto) {}
