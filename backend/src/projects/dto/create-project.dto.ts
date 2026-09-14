import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { Status } from '../Status';

export class CreateProjectDto {

    @IsString()
    name!: string;

    @IsString()
    description!: string;
    
    @IsUrl()
    @IsOptional()
    githubUrl?: string;

    @IsUrl()
    @IsOptional()
    demoUrl?: string;

    @IsString()
    @IsOptional()
    imageUrl?: string;
}
