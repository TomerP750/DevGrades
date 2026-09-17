import { ArrowUpRightIcon, MessageSquareTextIcon } from "lucide-react";
import type { ProjectDto } from "../../models/ProjectDto";
import { useState } from "react";
import { Button } from "../../../../shared/ui/Button";
import { CreateReviewModal } from "../../../reviews/components/CreateReviewModal";
import { ReviewsSection } from "../../../reviews/pages/ReviewsSection";
import { Hr } from "../../../../shared/ui/Hr";

interface ProjectDetailsContentProps {
    project: ProjectDto;
    isOwner: boolean;
    isClosed: boolean;
}

export function ProjectDetailsContent({ project, isOwner, isClosed }: ProjectDetailsContentProps) {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const allowedToWriteReview = !isOwner && !isClosed;

    return (
        <div>
            <section aria-labelledby="about-project">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    Overview
                </p>
                <h2
                    id="about-project"
                    className="mt-2 text-2xl font-bold tracking-tight text-foreground"
                >
                    About this project
                </h2>
                <p className="mt-5 max-w-3xl whitespace-pre-line text-base leading-8 text-muted-foreground">
                    {project.description}
                </p>
            </section>

            {allowedToWriteReview && <section
                aria-labelledby="review-project"
                className="mt-12 border-l-4 border-primary bg-card px-6 py-7 shadow-sm sm:px-8"
            >
                <MessageSquareTextIcon className="size-6 text-primary" />
                <h2
                    id="review-project"
                    className="mt-4 text-xl font-bold text-card-foreground"
                >
                    Share useful feedback
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                    Review the project and help its creator improve with clear,
                    actionable suggestions.
                </p>
                <Button
                    type="button"
                    size="md"
                    className="mt-6"
                    onClick={() => setIsReviewModalOpen(true)}
                    rightIcon={<ArrowUpRightIcon className="size-4" />}
                >
                    Write a review
                </Button>
                
            </section>}

            <Hr className="my-8" />

            <ReviewsSection projectId={project.id} />

            <CreateReviewModal
                open={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                projectId={project.id}
                isClosed={isClosed}
            />
        </div>
    );
}
