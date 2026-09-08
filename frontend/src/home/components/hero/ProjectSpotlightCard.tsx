import { Check, Star } from "lucide-react";
import {
  getScoreColor,
  ProgressBar,
} from "../../../shared/ui/ProgressBar";

const ratings = [
  { label: "UI / UX", value: 9.8 },
  { label: "Performance", value: 9.4 },
  { label: "Accessibility", value: 9.6 },
];

function RatingMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium text-card-foreground">{label}</span>
        <span className={`font-bold ${getScoreColor(value)}`}>
          {value.toFixed(1)}
        </span>
      </div>
      <ProgressBar
        value={value}
        label={`${label} score: ${value} out of 10`}
      />
    </div>
  );
}

function ReviewerQuote() {
  return (
    <div className="mt-8 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
          DN
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-semibold text-surface-foreground">
              Developer Name
            </span>
            <span className="text-xs text-muted-foreground">
              Frontend developer
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            “The visual hierarchy is excellent. I&apos;d make the mobile chart
            controls easier to reach.”
          </p>
        </div>
      </div>
    </div>
  );
}

function ReviewNotification() {
  return (
    <div className="absolute -bottom-6 -left-4 hidden items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-xl sm:flex">
      <div className="grid size-9 place-items-center rounded-full bg-accent text-accent-foreground">
        <Check aria-hidden="true" className="size-5" strokeWidth={2.25} />
      </div>
      <div>
        <p className="text-sm font-bold text-card-foreground">Review received</p>
        <p className="text-xs text-muted-foreground">
          Actionable feedback, not likes
        </p>
      </div>
    </div>
  );
}

export function ProjectSpotlightCard() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div
        aria-hidden="true"
        className="absolute -inset-4 -z-10 rotate-2 rounded-[2rem] bg-primary/10"
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-foreground/10">
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-danger" />
            <span className="size-2.5 rounded-full bg-warning" />
            <span className="size-2.5 rounded-full bg-success" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Project spotlight
          </span>
        </div>

        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-emerald-400 text-xl font-bold text-primary-foreground shadow-md shadow-primary/20">
                P
              </div>
              <div>
                <h2 className="text-lg font-bold text-card-foreground">
                  Pulse Analytics
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Dashboard · Web app
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-accent px-3 py-2 text-center">
              <div className="flex items-center gap-1 text-lg font-bold text-accent-foreground">
                <Star aria-hidden="true" className="size-4 fill-current" />
                4.8
              </div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-accent-foreground/70">
                Overall
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {ratings.map((rating) => (
              <RatingMetric key={rating.label} {...rating} />
            ))}
          </div>

          <ReviewerQuote />
        </div>
      </div>

      <ReviewNotification />
    </div>
  );
}
