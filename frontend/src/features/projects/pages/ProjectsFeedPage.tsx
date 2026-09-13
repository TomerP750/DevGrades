import { useState } from "react";
import { ProjectFeedActions } from "../components/feed_actions/ProjectFeedActions";
import { ProjectCard } from "../components/project_card/ProjectCard";
import projectService from "../api/projectService";
import { useQuery } from "@tanstack/react-query";
import type { ProjectDto } from "../models/ProjectDto";

export default function ProjectsFeedPage() {

    const [gridLayout, setGridLayout] = useState<2 | 3>(2);

    // TODO: Change to cursor pagination
    // const { data: projects } = useQuery<ProjectDto[]>({
    //     queryKey: ["projects"],
    //     queryFn: () => projectService.allProjects(),
    // });

    const projects: ProjectDto[] = [
       
    ];

    return (
        <>

            <ProjectFeedActions
                gridLayout={gridLayout}
                onGridLayoutChange={setGridLayout}
            />

            <section
                aria-label="Projects"
                className={
                    gridLayout === 3
                        ? "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
                        : "grid grid-cols-1 gap-6 md:grid-cols-2"
                }
            >
                {projects?.map((project: ProjectDto) => (
                    <ProjectCard key={project.id} project={project} />
                ))}

            </section>

        </>
    );
}