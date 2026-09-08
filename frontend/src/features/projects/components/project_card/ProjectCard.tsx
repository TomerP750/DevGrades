import { BookmarkIcon, CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { ProjectDto } from "../../api/dummyData";
import { Badge } from "../../../../shared/ui/Badge";
import { formatDate } from "../../../../shared/utils/formatDate";
import { getInitials } from "../../../../shared/utils/getInitials";


interface ProjectCardProps {
    project: ProjectDto;
    onArchive?: (projectId: string) => void;
}

export function ProjectCard({ project, onArchive }: ProjectCardProps) {

    const userInitials = getInitials(project.user.firstName, project.user.lastName);

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-foreground/5">
            <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-surface">
                {project.thumbnailUrl ? (
                    <img
                        src={project.thumbnailUrl}
                        alt={`${project.name} preview`}
                        className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div
                        aria-label={`${project.name} preview`}
                        className="relative grid size-full place-items-center overflow-hidden bg-gradient-to-br from-primary/20 via-accent to-surface"
                        role="img"
                    >
                        <div className="absolute -right-8 -top-8 size-32 rounded-full bg-primary/15 blur-2xl" />
                        <div className="absolute -bottom-12 -left-6 size-36 rounded-full bg-primary/10 blur-2xl" />
                        <div className="relative w-3/4 overflow-hidden rounded-lg border border-border/80 bg-card/90 shadow-xl">
                            <div className="flex items-center gap-1.5 border-b border-border px-3 py-2">
                                <span className="size-1.5 rounded-full bg-danger" />
                                <span className="size-1.5 rounded-full bg-warning" />
                                <span className="size-1.5 rounded-full bg-success" />
                            </div>
                            <div className="space-y-2 p-3">
                                <div className="h-2 w-1/2 rounded-full bg-primary/70" />
                                <div className="h-1.5 w-full rounded-full bg-muted" />
                                <div className="h-1.5 w-4/5 rounded-full bg-muted" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2 className="truncate text-lg font-bold tracking-tight text-card-foreground">
                            {project.name}
                        </h2>
                        <time
                            className="mt-1 inline-flex gap-1 items-center block text-xs font-medium text-muted-foreground"
                            dateTime={new Date(project.createdAt).toISOString()}
                        >
                            <CalendarIcon size={20} />
                            {formatDate(project.createdAt)}
                        </time>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                        <button
                            type="button"
                            onClick={() => onArchive?.(project.id)}
                            aria-label={`Archive ${project.name}`}
                            title="Archive project"
                            className="grid size-9 cursor-pointer place-items-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <BookmarkIcon aria-hidden="true" className="size-5" />
                        </button>
                        
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-2.5">
                    <Badge variant="primary" size="md" className="size-8 px-0">
                        {userInitials}
                    </Badge>
                    <span className="truncate text-sm font-semibold text-card-foreground">
                        @{project.user.username}
                    </span>
                </div>

                <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-muted-foreground">
                    {project.description}
                </p>

                <Link
                    to={`/projects/${project.id}`}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                >
                    Learn More To Review
                </Link>
            </div>
        </article>
    );
}