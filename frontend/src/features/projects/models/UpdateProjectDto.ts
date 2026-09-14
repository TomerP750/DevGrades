import type { Status } from "./Status";

export interface UpdateProjectDto {
    name?: string;
    description?: string;
    githubUrl?: string;
    demoUrl?: string;
    thumbnailUrl?: string;
    status?: Status;
}