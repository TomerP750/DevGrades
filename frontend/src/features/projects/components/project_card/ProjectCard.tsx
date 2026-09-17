import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ArrowUpRightIcon,
    BookmarkIcon,
    StarIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../../../shared/ui/Badge";
import { Button } from "../../../../shared/ui/Button";
import { formatTimeAgo } from "../../../../shared/utils/formatTimeAgo";
import { useAuth } from "../../../authentication/contexts/AuthContext";
import archiveProjectService from "../../api/archiveProjectService";
import { useIsOwner } from "../../hooks/useIsOwner";
import { resetProjectsFeed } from "../../hooks/useProjectsFeed";
import type { ProjectDto } from "../../models/ProjectDto";
import { Status } from "../../models/Status";
import { ClosedProjectDialog } from "./ClosedProjectDialog";
import { ProjectMenu } from "./ProjectMenu";
import { Thumbnail } from "./Thumbnail";

interface ProjectCardProps {
    project: ProjectDto;
}

export function ProjectCard({ project }: ProjectCardProps) {

    const { user } = useAuth();

    const { status } = project;
    const isClosed = status === Status.CLOSED;

    const queryClient = useQueryClient();

    const { mutate: toggleArchive } = useMutation({
        mutationFn: archiveProjectService.toggleArchive,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["archived-projects", user?.id, project.id],
            });
            resetProjectsFeed(queryClient);
        },
    });

    function handleToggleArchive() {
        toggleArchive(project.id);
    }

    const { data: archived } = useQuery({
        queryKey: ["archived-projects", user?.id, project.id],
        queryFn: () => archiveProjectService.isArchived(project.id),
    });

    const isOwner = useIsOwner(project);

    const projectPath = `/projects/${project.id}`;

    return (
        <article
            className={`relative group flex h-full flex-col overflow-hidden rounded-sm border bg-card shadow-sm transition-all duration-300 ${
                isClosed
                    ? "border-border/70"
                    : "border-border/80 hover:border-primary/30 hover:shadow-xl hover:shadow-foreground/8"
            }`}
        >
            <div
                className={`flex h-full min-h-0 flex-1 flex-col ${isClosed ? "pointer-events-none select-none" : ""}`}
                inert={isClosed || undefined}
                aria-hidden={isClosed || undefined}
            >
                <Thumbnail thumbnailUrl={project.imageUrl} />

                <div className="flex min-h-80 flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <Badge user={project.user} size="lg" />
                            <div className="min-w-0">
                                <div className="flex min-w-0 items-center gap-2">
                                    <Link
                                        className="min-w-0"
                                        to={`/u/${project.user.id}`}>
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
                                        {formatTimeAgo(project.createdAt)}
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
                                onClick={handleToggleArchive}
                                aria-pressed={archived}
                                aria-label={`Archive ${project.name}`}
                                title="Archive project"
                                className="cursor-pointer hover:scale-110 transition-transform duration-200"
                                rightIcon={
                                    <BookmarkIcon
                                        className={`size-5 ${archived ? "fill-yellow-500 text-yellow-500" : ""}`}
                                    />
                                }
                            />
                            <ProjectMenu
                                project={project}
                                isOwner={isOwner}
                                isClosed={isClosed}
                            />
                        </div>
                    </div>

                    <div className="mt-4 space-y-2 min-w-0">
                        <div className="flex items-center gap-2">
                            <StarIcon className="size-4 text-yellow-500 fill-yellow-500" />
                            <p className="text-sm font-medium dark:text-white">
                                4.5 / 5
                            </p>
                        </div>
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

                    {!isOwner && <div className="mt-auto border-t border-border/70 pt-4">
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
                    </div>}
                </div>
            </div>

            {isClosed && (
                <ClosedProjectDialog project={project} isOwner={isOwner} />
            )}
        </article>
    );
}