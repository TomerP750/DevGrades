import type { ProjectDto } from "../../projects/models/ProjectDto";
import { ProjectCard } from "../../projects/components/project_card/ProjectCard";

interface ProfileProjectsProps {
    projects: ProjectDto[];
}

export function ProfileProjects({ projects }: ProfileProjectsProps) {
    return (
        <section aria-labelledby="profile-projects-heading">
            <div className="mb-5">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
                    Portfolio
                </p>
                <h2
                    id="profile-projects-heading"
                    className="mt-1 text-2xl font-bold tracking-tight text-foreground"
                >
                    Projects
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 [&>article]:rounded-none md:grid-cols-2 xl:grid-cols-3">
                {projects.slice(0, 3).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </section>
    );
}
