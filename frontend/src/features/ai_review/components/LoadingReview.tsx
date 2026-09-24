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
            className="flex flex-col min-h-[calc(100dvh-4rem)] items-center justify-center"
        >
            <LoaderCircle
                aria-hidden="true"
                className="size-20 animate-spin text-primary motion-reduce:animate-none"
            />
            <span className="bg-clip-text text-transparent 
            bg-gradient-to-r from-primary to-violet-500 
            text-2xl font-medium animate-pulse">
                Reviewing project
            </span>
        </div>
    );
}