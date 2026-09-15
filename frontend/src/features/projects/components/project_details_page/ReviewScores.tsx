import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "../../../../shared/ui/Button";
import { getScoreColor, ProgressBar } from "../../../../shared/ui/ProgressBar";
import { useState } from "react";
import type { ReviewStatsDto } from "../../models/ReviewStatsDto";
import { useQuery } from "@tanstack/react-query";
import reviewService from "../../../reviews/api/reviewService";
import { CreateReviewModal } from "../../../reviews/components/CreateReviewModal";

interface ReviewScoresProps {
    isOwner: boolean;
    projectId: string;
}

export function ReviewScores({ isOwner, projectId }: ReviewScoresProps) {

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    const { data: reviewStats } = useQuery<ReviewStatsDto>({
        queryKey: ["review-stats", projectId],
        queryFn: () => reviewService.getReviewStats(projectId),
    });

    const reviewScores = [
        { label: "Overall", value: reviewStats?.overall.averageScore ?? 0 },
        { label: "Code Quality", value: reviewStats?.codeQuality.averageScore ?? 0 },
        { label: "Optimization", value: reviewStats?.optimization.averageScore ?? 0 },
        { label: "Maintainability", value: reviewStats?.maintainability.averageScore ?? 0 },
        { label: "Scalability", value: reviewStats?.scalability.averageScore ?? 0 },
        { label: "UI/UX", value: reviewStats?.uiux.averageScore ?? 0 },
    ];

    if (reviewStats?.overall.averageScore === 0) {
        return (
            <div className="mt-6 space-y-5">
                <p className="text-sm text-muted-foreground">
                    No reviews yet
                </p>
            </div>
        );
    }

    return (
        <>
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
            <CreateReviewModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                projectId={projectId}
            />
        </>
    );
}