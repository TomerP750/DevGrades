import type { UserDto } from "../../../shared/models/UserDto";
import type { Status } from "./Status";


export interface ProjectDto {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    githubUrl: string;
    status: Status;
    demoUrl: string;
    createdAt: string;
    user: UserDto;
}