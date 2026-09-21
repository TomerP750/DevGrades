import type { AiReviewProjectResponse } from "../models/AiReviewProjectResponse";
import { getScoreColor } from "../../../shared/utils/getScoreColor";

interface ResultSectionProps {
    result: AiReviewProjectResponse | null;
}

export function ResultSection({ result }: ResultSectionProps) {
    
    if (!result) {
        return null;
    }

    return (
        <section className="mx-auto mt-10 w-full max-w-2xl px-4 pb-20">
            <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <p className="mb-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                        Project Evaluation
                    </p>
    
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Result
                    </h1>
    
                    <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                        {result.summary}
                    </p>
                </div>
    
                {/* Overall Score */}
                <div className="mb-8 flex flex-col items-center rounded-xl border bg-muted/30 p-6">
                    <span className="text-sm font-medium text-muted-foreground">
                        Overall Score
                    </span>
    
                    <div
                        className={`mt-2 text-5xl font-bold tracking-tight ${getScoreColor(
                            result.overallScore
                        )}`}
                    >
                        {result.overallScore}
                        <span className="text-lg font-medium text-muted-foreground">
                            {" "}
                            / 5
                        </span>
                    </div>
                </div>
    
                {/* Category Scores */}
                <div>
                    <h2 className="mb-4 text-sm font-semibold">
                        Evaluation Breakdown
                    </h2>
    
                    <div className="grid gap-3 sm:grid-cols-2">
                        {[
                            {
                                label: "Code Quality",
                                score: result.codeQualityScore,
                            },
                            {
                                label: "Optimization",
                                score: result.optimizationScore,
                            },
                            {
                                label: "Maintainability",
                                score: result.maintainabilityScore,
                            },
                            {
                                label: "Scalability",
                                score: result.scalabilityScore,
                            },
                            {
                                label: "UI/UX",
                                score: result.uiuxScore,
                            },
                        ].map(({ label, score }) => (
                            <div
                                key={label}
                                className="flex items-center justify-between rounded-xl border px-4 py-3"
                            >
                                <span className="text-sm font-medium">
                                    {label}
                                </span>
    
                                <span
                                    className={`text-sm font-bold ${getScoreColor(
                                        score
                                    )}`}
                                >
                                    {score}
                                    <span className="font-medium text-muted-foreground">
                                        {" "}
                                        / 5
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}