import type { ProjectDto } from "../../models/ProjectDto";
import { Badge } from "../../../../shared/ui/Badge";

interface ProjectDetailsHeaderProps {
    project: ProjectDto;
}

export function ProjectDetailsHeader({ project }: ProjectDetailsHeaderProps) {
    
    const { name, user } = project;
    const { firstName, lastName, username } = user;

    return (
        <header className="grid gap-8 border-b border-border pb-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
            <div className="max-w-3xl">
                <h1 className="mt-4 text-4xl font-bold tracking-[-0.035em] text-foreground sm:text-5xl lg:text-6xl">
                    {name}
                </h1>
            </div>

            <div className="flex items-center gap-3 lg:justify-end">
                <Badge size="lg" user={user} />
                <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">
                        {firstName} {lastName}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                        @{username}
                    </p>
                </div>
            </div>
        </header>
    );
}
