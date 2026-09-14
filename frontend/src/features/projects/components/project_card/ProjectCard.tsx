import {
    ArrowUpRightIcon,
    BookmarkIcon,
    CalendarDaysIcon
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../../../shared/ui/Badge";
import { Button } from "../../../../shared/ui/Button";
import { formatDate } from "../../../../shared/utils/formatDate";
// import { useAuth } from "../../../authentication/contexts/AuthContext";
import { ProjectMenu } from "./ProjectMenu";
import { Thumbnail } from "./Thumbnail";
import type { ProjectDto } from "../../models/ProjectDto";
import { useAuth } from "../../../authentication/contexts/AuthContext";

interface ProjectCardProps {
    project: ProjectDto;
}

export function ProjectCard({ project }: ProjectCardProps) {

    const { user } = useAuth();

    const [archived, setArchived] = useState(false);

    const projectPath = `/projects/${project.id}`;

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-border/80 bg-card shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-foreground/8">
            <Thumbnail thumbnailUrl={project.imageUrl} />

            <div className="flex min-h-80 flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <Badge user={project.user} size="lg" />
                        <div className="min-w-0">
                            <div className="flex min-w-0 items-center gap-2">
                                <Link
                                    className="min-w-0"
                                    to={`/users/${project.user.id}`}>
                                    <p className="truncate text-sm font-semibold text-card-foreground">
                                        {project.user.firstName} {project.user.lastName}
                                    </p>
                                </Link>
                                <span aria-hidden="true" className="shrink-0 text-xs text-muted-foreground">
                                    •
                                </span>
                                <time
                                    className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground"
                                    dateTime={new Date(project.createdAt).toISOString()}
                                >
                                    <CalendarDaysIcon aria-hidden="true" className="size-3.5" />
                                    {formatDate(project.createdAt)}
                                </time>
                            </div>
                            <p className="truncate text-xs text-muted-foreground">
                                @{project.user.username}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            variant="unstyled"
                            onClick={() => setArchived(prev => !prev)}
                            aria-pressed={archived}
                            aria-label={`Archive ${project.name}`}
                            title="Archive project"
                            className="cursor-pointer hover:scale-110 transition-transform duration-200"
                            icon={
                                <BookmarkIcon
                                className={`size-5 ${archived ? "fill-yellow-500 text-yellow-500" : ""}`}
                                />
                            }
                        />
                        <ProjectMenu project={project} />
                    </div>
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

                <div className="mt-auto border-t border-border/70 pt-4">
                    <Link
                        to={projectPath}
                        className="group/review inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-px"
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