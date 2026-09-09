import {
    ArrowUpRightIcon,
    BookmarkIcon,
    CalendarDaysIcon,
    Code2Icon,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { ProjectDto } from "../../api/dummyData";
import { formatDate } from "../../../../shared/utils/formatDate";
import { Badge } from "../../../../shared/ui/Badge";
import { useState } from "react";


interface ProjectCardProps {
    project: ProjectDto;
}

export function ProjectCard({ project }: ProjectCardProps) {

    const [archived, setArchived] = useState(false);

    const projectPath = `/projects/${project.id}`;

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-foreground/8">
            <div className="relative aspect-[5/2] overflow-hidden bg-surface">
                {project.thumbnailUrl ? (
                    <img
                        src={project.thumbnailUrl}
                        alt={`${project.name} preview`}
                        className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div
                        aria-label={`${project.name} preview`}
                        className="relative grid size-full place-items-center overflow-hidden bg-gradient-to-br from-accent via-surface to-primary/10"
                        role="img"
                    >
                        <div className="absolute -right-10 -top-12 size-40 rounded-full bg-primary/20 blur-3xl" />
                        <div className="absolute -bottom-16 -left-8 size-44 rounded-full bg-primary/15 blur-3xl" />
                        <div className="relative w-[72%] translate-y-1 overflow-hidden rounded-xl border border-border/70 bg-card/95 shadow-2xl shadow-foreground/10 transition-transform duration-700 ease-out group-hover:-translate-y-1 group-hover:rotate-[-1deg]">
                            <div className="flex items-center justify-between border-b border-border/70 px-3 py-2.5">
                                <div className="flex items-center gap-1.5">
                                    <span className="size-1.5 rounded-full bg-danger/80" />
                                    <span className="size-1.5 rounded-full bg-warning/80" />
                                    <span className="size-1.5 rounded-full bg-success/80" />
                                </div>
                                <Code2Icon className="size-3.5 text-primary" />
                            </div>
                            <div className="grid grid-cols-[3rem_1fr] gap-3 p-3">
                                <div className="h-16 rounded-md bg-accent" />
                                <div className="space-y-2 pt-1">
                                    <div className="h-2 w-3/5 rounded-full bg-primary/70" />
                                    <div className="h-1.5 w-full rounded-full bg-muted" />
                                    <div className="h-1.5 w-4/5 rounded-full bg-muted" />
                                    <div className="h-1.5 w-2/3 rounded-full bg-muted" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent opacity-70" />
            </div>

            <div className="flex min-h-80 flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <Badge user={project.user} />
                        <div className="min-w-0">
                            <Link
                                to={`/users/${project.user.id}`}>
                                <p className="truncate text-sm font-semibold text-card-foreground">
                                    {project.user.firstName} {project.user.lastName}
                                </p>
                            </Link>
                            <p className="truncate text-xs text-muted-foreground">
                                @{project.user.username}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setArchived(prev => !prev)}
                        aria-pressed={archived}
                        aria-label={`Archive ${project.name}`}
                        title="Archive project"
                        className="cursor-pointer hover:scale-110 transition-transform duration-200"
                    >
                        <BookmarkIcon
                            aria-hidden="true"
                            className={`size-5 ${archived ? "fill-yellow-500 text-yellow-500" : ""}`}
                        />
                    </button>
                </div>

                <div className="mt-5 min-w-0">
                    <h2 className="min-w-0 text-xl font-bold leading-snug tracking-tight text-card-foreground">
                        <Link
                            to={projectPath}
                            className="rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {project.name}
                        </Link>
                    </h2>
                </div>

                <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-muted-foreground">
                    {project.description}
                </p>

                <div className="mt-auto flex items-center justify-between gap-4 border-t border-border/70 pt-4">
                    <time
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                        dateTime={new Date(project.createdAt).toISOString()}
                    >
                        <CalendarDaysIcon aria-hidden="true" className="size-3.5" />
                        {formatDate(project.createdAt)}
                    </time>

                    <Link
                        to={projectPath}
                        className="inline-flex items-center gap-3 rounded-sm px-3 py-1.5 text-sm font-bold text-card-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        Review project
                        <ArrowUpRightIcon
                            aria-hidden="true"
                            className="size-4 transition-transform duration-200 group-hover/review:translate-x-0.5 group-hover/review:-translate-y-0.5"
                        />
                    </Link>
                </div>
            </div>
        </article>
    );
}