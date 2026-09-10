import { IsEnum, IsString, IsUrl } from 'class-validator';
import { Status } from '../Status';

export class CreateProjectDto {

    @IsString()
    name!: string;

    @IsString()
    description!: string;
    
    @IsUrl()
    githubUrl!: string;

    @IsUrl()
    demoUrl!: string;

    @IsEnum(Status)
    status!: Status;

    @IsString()
    imageUrl!: string;
}
