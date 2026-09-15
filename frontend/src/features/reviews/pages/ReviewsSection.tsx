import { useQuery } from "@tanstack/react-query";
import reviewService from "../api/reviewService";
import { ReviewCard } from "../components/ReviewCard";
import type { ReviewDto } from "../models/ReviewDto";
import { toast } from "react-toastify";

export function ReviewsSection({ projectId }: { projectId: string }) {

    const { data: reviews, isLoading, isError } = useQuery({
        queryKey: ["reviews", projectId],
        queryFn: () => reviewService.allReviewsByProjectId(projectId),
    });

    if (isError) {
        return toast.error("Failed to load reviews");
    }

    if (!reviews || reviews.length === 0) {
        return (<div className="space-y-6 mt-5">
            <p className="text-sm text-muted-foreground">The project has no reviews yet</p>
        </div>);
    }

    return (
        <div className="space-y-6 mt-5">
            <h2 className="text-xl text-xs">
                <p className="uppercase tracking-widest font-bold text-sm text-muted-foreground">Reviews ({reviews?.length})</p>
            </h2>
            {reviews?.map((review: ReviewDto) => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </div>
    );
}