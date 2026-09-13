import type { UserDto } from "../../../shared/models/UserDto";


export interface ProjectDto {
    id: string;
    name: string;
    description: string;
    thumbnailUrl: string;
    githubUrl: string;
    demoUrl: string;
    createdAt: string;
    updatedAt: string;
    user: UserDto;
}