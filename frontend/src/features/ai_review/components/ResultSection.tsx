import {
    Code2,
    Gauge,
    Layers,
    Palette,
    WandSparkles,
    Wrench,
    type LucideIcon,
} from "lucide-react";
import { ProgressBar } from "../../../shared/ui/ProgressBar";
import { getScoreColor } from "../../../shared/utils/getScoreColor";
import type { AiReviewProjectResponse } from "../models/AiReviewProjectResponse";

interface ResultSectionProps {
    result: AiReviewProjectResponse | null;
}

const categories: Array<{
    label: string;
    icon: LucideIcon;
    key: keyof Pick<
        AiReviewProjectResponse,
        | "codeQualityScore"
        | "optimizationScore"
        | "maintainabilityScore"
        | "scalabilityScore"
        | "uiuxScore"
    >;
}> = [
    { label: "Code Quality", key: "codeQualityScore", icon: Code2 },
    { label: "Optimization", key: "optimizationScore", icon: Gauge },
    { label: "Maintainability", key: "maintainabilityScore", icon: Wrench },
    { label: "Scalability", key: "scalabilityScore", icon: Layers },
    { label: "UI/UX", key: "uiuxScore", icon: Palette },
];

function ringFill(score: number) {
    const percent = (Math.min(Math.max(score, 0), 5) / 5) * 100;
    if (percent >= 80) return "var(--success)";
    if (percent >= 40) return "var(--warning)";
    return "var(--danger)";
}

export function ResultSection({ result }: ResultSectionProps) {
    if (!result) return null;

    const overallPercent = (result.overallScore / 5) * 100;

    return (
        <section
            aria-labelledby="ai-review-result-heading"
            className="mx-auto w-full max-w-6xl px-4 py-20"
        >
            <article className="relative overflow-hidden rounded-2xl border border-primary/25 bg-card/80 shadow-2xl shadow-indigo-500/20 backdrop-blur-sm">
                <div
                    aria-hidden="true"
                    className="h-1 bg-linear-to-r from-primary via-indigo-500 to-violet-500"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-indigo-500/25 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-10 bottom-0 size-40 rounded-full bg-violet-500/20 blur-3xl"
                />

                <div className="relative grid items-start gap-10 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_20rem] md:gap-12">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="grid size-11 place-items-center rounded-xl bg-linear-to-br from-primary via-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/40">
                                <WandSparkles aria-hidden="true" className="size-5" />
                            </span>
                            <h2
                                id="ai-review-result-heading"
                                className="bg-linear-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text text-2xl font-bold uppercase tracking-[0.14em] text-transparent"
                            >
                                AI evaluation result
                            </h2>
                        </div>

                        <blockquote className="mt-8 border-l-2 border-primary/40 pl-4 text-base leading-7 text-card-foreground sm:text-lg">
                            {result.summary}
                        </blockquote>
                    </div>

                    <div>
                        <div className="mb-8 flex flex-col items-center">
                            <div
                                className="relative grid size-32 place-items-center rounded-full"
                                style={{
                                    background: `conic-gradient(${ringFill(result.overallScore)} ${overallPercent}%, var(--muted) 0)`,
                                }}
                                aria-hidden="true"
                            >
                                <div className="absolute inset-[7px] grid place-items-center rounded-full bg-card">
                                    <p
                                        className={`text-4xl font-bold tabular-nums tracking-tight ${getScoreColor(
                                            result.overallScore,
                                        )}`}
                                    >
                                        {result.overallScore}
                                    </p>
                                </div>
                            </div>
                            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Overall
                                <span className="font-medium"> / 5</span>
                            </p>
                        </div>

                        <ul className="space-y-4">
                            {categories.map(({ label, key, icon: Icon }) => {
                                const score = result[key];

                                return (
                                    <li key={key}>
                                        <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                                            <span className="flex items-center gap-2 font-medium text-foreground">
                                                <Icon
                                                    aria-hidden="true"
                                                    className="size-4 text-primary"
                                                />
                                                {label}
                                            </span>
                                            <span
                                                className={`tabular-nums font-bold ${getScoreColor(score)}`}
                                            >
                                                {score}
                                                <span className="font-medium text-muted-foreground">
                                                    {" "}
                                                    / 5
                                                </span>
                                            </span>
                                        </div>
                                        <ProgressBar
                                            value={score}
                                            max={5}
                                            size="md"
                                            label={`${label} score: ${score} out of 5`}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </article>
        </section>
    );
}