import axios from "axios";
import { baseApiUrl } from "../../../shared/utils/baseApi";
import type { CursorPageResponse } from "../../../shared/models/CursorPage";
import type { CreateProjectDto } from "../models/CreateProjectDto";
import type { ProjectDto } from "../models/ProjectDto";
import type { UpdateProjectDto } from "../models/UpdateProjectDto";

interface ProjectFeedParams {
    cursor?: string;
    limit?: number;
}

class ProjectService {

    async allProjects(params: ProjectFeedParams): Promise<CursorPageResponse<ProjectDto>> {
        return (await axios.get(`${baseApiUrl}/api/projects/all`, { params })).data;
    }

    async oneProject(projectId: string) {
        return (await axios.get(`${baseApiUrl}/api/projects/${projectId}`)).data;
    }

    async createProject(dto: CreateProjectDto) {
        return (await axios.post(`${baseApiUrl}/api/projects/create`, dto)).data;
    }

    async updateProject(projectId: string, dto: UpdateProjectDto) {
        return (await axios.put(`${baseApiUrl}/api/projects/update/${projectId}`, dto)).data;
    }

    async deleteProject(projectId: string) {
        return (await axios.delete(`${baseApiUrl}/api/projects/delete/${projectId}`)).data;
    }
}

const projectService = new ProjectService();
export default projectService;