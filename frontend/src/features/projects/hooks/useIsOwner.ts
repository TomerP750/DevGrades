import { useAuth } from "../../authentication/contexts/AuthContext";
import type { ProjectDto } from "../models/ProjectDto";


export function useIsOwner(project?: ProjectDto) {
    const { user } = useAuth();
    return user?.id === project?.user.id;
}