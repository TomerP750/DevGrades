import { Navigate } from "react-router-dom";
import { useAuth } from "../../authentication/contexts/AuthContext";
import { ResultSection } from "../components/ResultSection";
import type { AiReviewProjectResponse } from "../models/AiReviewProjectResponse";
import { useState } from "react";
import { FormHeader } from "../components/FormHeader";
import { dummyAiReview } from "../api/dummyAiReview";
import { LoadingReview } from "../components/LoadingReview";

export default function AiReviewPage() {

    const { user } = useAuth();

    if (!user?.id) {
        return <Navigate to="/auth/sign-in" />;
    }

    const [dummyResult, setDummyResult] = useState<AiReviewProjectResponse | null>(null);
    const [isLoadingResult, setIsLoadingResult] = useState(false);

    return (
        <section className="relative isolate min-h-[calc(100dvh-4rem)]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/25 via-indigo-500/15 to-background" />
                <div className="absolute right-4 top-4 size-80 rounded-full bg-indigo-500/35 blur-3xl" />
                <div className="absolute left-4 bottom-4 size-72 rounded-full bg-violet-500/30 blur-3xl" />
                <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle,var(--primary)_1.2px,transparent_1.2px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
            </div>

            {
                isLoadingResult
                    ? <LoadingReview
                        isLoading={isLoadingResult}
                    />
                    : dummyResult
                        ? <ResultSection
                            result={dummyResult}
                        />
                        : <FormHeader
                            user={user}
                            isLoadingResult={isLoadingResult}
                            onSetDummyResult={() => setDummyResult(dummyAiReview)}
                            onSetIsLoadingResult={setIsLoadingResult}
                        />
            }

        </section>
    );
}