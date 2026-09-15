import { useParams } from "react-router-dom";
import NotFoundPage from "../../../shared/pages/NotFoundPage";
import { ProjectDetailsAside } from "../components/project_details_page/ProjectDetailsAside";
import { ProjectDetailsContent } from "../components/project_details_page/ProjectDetailsContent";
import { ProjectDetailsHeader } from "../components/project_details_page/ProjectDetailsHeader";
import { useQuery } from "@tanstack/react-query";
import projectService from "../api/projectService";
import { useIsOwner } from "../hooks/useIsOwner";

export default function ProjectDetailsPage() {

    const { projectId } = useParams();

    const { data: project } = useQuery({
        queryKey: ["project", projectId],
        queryFn: () => projectService.oneProject(projectId!),
        enabled: Boolean(projectId),
    });

    const isOwner = useIsOwner(project);

    if (!projectId || !project) {
        return <NotFoundPage />;
    }

    return (
        <article className="mt-4">
            <ProjectDetailsHeader project={project} />

            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16">
                <ProjectDetailsContent project={project} isOwner={isOwner} />
                <ProjectDetailsAside project={project} isOwner={isOwner} />
            </div>
        </article>
    );
}