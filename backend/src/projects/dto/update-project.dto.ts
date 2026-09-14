import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateProjectDto } from './create-project.dto';
import { Status } from '../Status';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @IsEnum(Status)
    @IsOptional()
    status?: Status;
}
