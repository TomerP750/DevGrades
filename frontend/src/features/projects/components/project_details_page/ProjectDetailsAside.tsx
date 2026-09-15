import {
    ArrowUpRightIcon,
    CalendarDaysIcon,
    GitForkIcon,
    GlobeIcon,
    UserRoundIcon,
} from "lucide-react";

import {
    getScoreColor,
    ProgressBar,
} from "../../../../shared/ui/ProgressBar";
import { Button } from "../../../../shared/ui/Button";
import { formatDate } from "../../../../shared/utils/formatDate";
import type { ProjectDto } from "../../models/ProjectDto";
import { useQuery } from "@tanstack/react-query";
import reviewService from "../../../reviews/api/reviewService";
import type { ReviewStatsDto } from "../../models/ReviewStatsDto";
import { useState } from "react";
import { CreateReviewModal } from "../../../reviews/components/CreateReviewModal";

interface ProjectDetailsAsideProps {
    project: ProjectDto;
    isOwner: boolean;
}


export function ProjectDetailsAside({ project, isOwner }: ProjectDetailsAsideProps) {
    
    // const quertClient = useQueryClient();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    
    const { githubUrl, demoUrl, user, createdAt } = project;

    const { data: reviewStats } = useQuery<ReviewStatsDto>({
        queryKey: ["review-stats", project.id],
        queryFn: () => reviewService.getReviewStats(project.id),
    });

    const reviewScores = [
        { label: "Overall", value: reviewStats?.overall.averageScore ?? 0 },
        { label: "Code Quality", value: reviewStats?.codeQuality.averageScore ?? 0 },
        { label: "Optimization", value: reviewStats?.optimization.averageScore ?? 0 },
        { label: "Maintainability", value: reviewStats?.maintainability.averageScore ?? 0 },
        { label: "Scalability", value: reviewStats?.scalability.averageScore ?? 0 },
        { label: "UI/UX", value: reviewStats?.uiux.averageScore ?? 0 },
    ];

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

                <ul className="mt-6 space-y-5">
                    {reviewScores.map((score) => (
                        <li key={score.label}>
                            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                                <span className="font-medium text-foreground">
                                    {score.label}
                                </span>
                                <span
                                    className={`tabular-nums font-bold ${getScoreColor(score.value)}`}
                                >
                                    {score.value.toFixed(1)}
                                </span>
                            </div>
                            <ProgressBar
                                value={score.value}
                                label={`${score.label} score: ${score.value} out of 5`}
                                size="sm"
                            />
                        </li>
                    ))}
                    {!isOwner && <Button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        size="md"
                        rightIcon={<ArrowUpRightIcon className="size-4" />}
                    >
                        Write a review
                    </Button>}
                </ul>
            </section>
            <CreateReviewModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                projectId={project.id}
            />
        </aside>
    );
}
