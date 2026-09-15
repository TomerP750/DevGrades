import {
    CalendarDaysIcon,
    GitForkIcon,
    GlobeIcon,
    UserRoundIcon
} from "lucide-react";
import { useState } from "react";
import { formatDate } from "../../../../shared/utils/formatDate";
import type { ProjectDto } from "../../models/ProjectDto";
import { ReviewScores } from "./ReviewScores";

interface ProjectDetailsAsideProps {
    project: ProjectDto;
    isOwner: boolean;
}


export function ProjectDetailsAside({ project, isOwner }: ProjectDetailsAsideProps) {
    
    // const quertClient = useQueryClient();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    
    const { githubUrl, demoUrl, user, createdAt } = project;


    return (
        <aside className="h-fit border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <dl className="space-y-6">
                <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        Live demo
                    </dt>
                    <dd className="mt-2 flex items-center gap-2 text-sm font-semibold">
                        <GlobeIcon className="size-4 shrink-0 text-primary" />
                        {demoUrl ? (
                            <a
                                href={demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                Visit project
                            </a>
                        ) : (
                            <span className="font-normal text-muted-foreground">
                                Not provided
                            </span>
                        )}
                    </dd>
                </div>

                <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        Source code
                    </dt>
                    <dd className="mt-2 flex items-center gap-2 text-sm font-semibold">
                        <GitForkIcon className="size-4 shrink-0 text-primary" />
                        {githubUrl ? (
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                View repository
                            </a>
                        ) : (
                            <span className="font-normal text-muted-foreground">
                                Not provided
                            </span>
                        )}
                    </dd>
                </div>

                <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        Created by
                    </dt>
                    <dd className="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                        <UserRoundIcon className="size-4 text-primary" />
                        {user.firstName} {user.lastName}
                    </dd>
                </div>

                <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        Published
                    </dt>
                    <dd className="mt-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                        <CalendarDaysIcon className="size-4 text-primary" />
                        <time dateTime={new Date(createdAt).toISOString()}>
                            {formatDate(createdAt)}
                        </time>
                    </dd>
                </div>
            </dl>

            <section
                aria-labelledby="review-scores"
                className="mt-8 border-t border-border pt-7"
            >
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                            Community rating
                        </p>
                        <h2
                            id="review-scores"
                            className="mt-1 text-lg font-bold text-foreground"
                        >
                            Review scores
                        </h2>
                    </div>
                </div>

                <ReviewScores isOwner={isOwner} projectId={project.id} />

            </section>
            
        </aside>
    );
}
