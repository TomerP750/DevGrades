import { StarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../../shared/ui/Badge";
import { ProgressBar, getScoreColor } from "../../../shared/ui/ProgressBar";
import { formatTimeAgo } from "../../../shared/utils/formatTimeAgo";
import type { ReviewDto } from "../models/ReviewDto";
import { ReviewCardMenu } from "./ReviewCardMenu";
import { useAuth } from "../../authentication/contexts/AuthContext";

interface ReviewCardProps {
    review: ReviewDto;
}

const scoreBreakdown: Array<{
    key: keyof Pick<
        ReviewDto,
        | "codeQualityScore"
        | "optimizationScore"
        | "maintainabilityScore"
        | "scalabilityScore"
        | "uiuxScore"
    >;
    label: string;
}> = [
        { key: "codeQualityScore", label: "Code quality" },
        { key: "optimizationScore", label: "Optimization" },
        { key: "maintainabilityScore", label: "Maintainability" },
        { key: "scalabilityScore", label: "Scalability" },
        { key: "uiuxScore", label: "UI/UX" },
    ];

export function ReviewCard({ review }: ReviewCardProps) {

    const { user: loggedInUser } = useAuth();

    const {
        user: reviewUser,
        comment,
        overallScore,
        createdAt,
    } = review;

    const { firstName, lastName, username } = reviewUser;

    const isOwner = loggedInUser?.id === reviewUser.id;

    return (
        <article className="flex flex-col overflow-hidden rounded-sm border border-border/80 bg-card p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <Badge user={reviewUser} size="lg" />
                    <div className="min-w-0">
                        <div className="flex min-w-0 items-center gap-2">
                            <Link className="min-w-0" to={`/u/${reviewUser.id}`}>
                                <p className="truncate text-sm font-semibold text-card-foreground">
                                    {firstName} {lastName}
                                </p>
                            </Link>
                            <span aria-hidden="true" className="shrink-0 text-xs text-muted-foreground">
                                •
                            </span>
                            <time
                                className="inline-flex shrink-0 text-xs font-medium text-muted-foreground"
                                dateTime={new Date(createdAt).toISOString()}
                            >
                                {formatTimeAgo(createdAt)}
                            </time>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                            @{username}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex shrink-0 items-center gap-1.5">
                        <StarIcon className="size-4 fill-yellow-500 text-yellow-500" />
                        <p className={`text-sm font-bold ${getScoreColor(overallScore)}`}>
                            {overallScore}
                            <span className="font-medium text-muted-foreground"> / 5</span>
                        </p>
                    </div>
                    <ReviewCardMenu review={review} isOwner={isOwner} />
                </div>
            </div>

            <p className="mt-4 mb-2 text-sm leading-6 text-card-foreground">
                {comment}
            </p>

            <dl className="mt-5 grid gap-3 sm:grid-cols-3">
                {scoreBreakdown.map(({ key, label }) => (
                    <div key={key} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                            <dt className="text-xs font-medium dark:text-white">
                                {label}
                            </dt>
                            <dd className={`text-xs font-semibold ${getScoreColor(review[key])}`}>
                                {review[key]}/5
                            </dd>
                        </div>
                        <ProgressBar value={review[key]} max={5} label={label} size="sm" />
                    </div>
                ))}
            </dl>
        </article>
    );
}