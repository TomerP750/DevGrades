import { useQuery } from "@tanstack/react-query";
import reviewService from "../api/reviewService";
import { ReviewCard } from "../components/ReviewCard";
import type { ReviewDto } from "../models/ReviewDto";

export function ReviewsSection({ projectId }: { projectId: string }) {

    const { data: reviews, isLoading } = useQuery({
        queryKey: ["reviews", projectId],
        queryFn: () => reviewService.allReviewsByProjectId(projectId),
    });

    return (
        <div className="space-y-6 mt-5">
            {reviews?.map((review: ReviewDto) => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </div>
    );
}