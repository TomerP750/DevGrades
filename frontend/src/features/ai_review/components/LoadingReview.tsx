import { LoaderCircle } from "lucide-react";

interface LoadingReviewProps {
    isLoading: boolean;
}

export function LoadingReview({ isLoading }: LoadingReviewProps) {
    if (!isLoading) return null;

    return (
        <div
            role="status"
            aria-label="Reviewing project"
            className="flex min-h-[calc(100dvh-4rem)] items-center justify-center"
        >
            <LoaderCircle
                aria-hidden="true"
                className="size-20 animate-spin text-primary motion-reduce:animate-none"
            />
            <span className="sr-only">Reviewing project</span>
        </div>
    );
}