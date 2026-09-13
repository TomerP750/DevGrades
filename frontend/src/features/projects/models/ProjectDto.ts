import type { UserDto } from "../../../shared/models/UserDto";


export interface ProjectDto {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    githubUrl: string;
    demoUrl: string;
    createdAt: string;
    user: UserDto;
}