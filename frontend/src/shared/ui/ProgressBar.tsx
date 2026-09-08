export type ProgressBarSize = "sm" | "md" | "lg";

export interface ProgressBarProps {
  value: number;
  max?: number;
  /** Accessible name describing what the progress represents. */
  label: string;
  size?: ProgressBarSize;
  className?: string;
  indicatorClassName?: string;
}

const sizeStyles: Record<ProgressBarSize, string> = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

function getRankColor(percentage: number) {
  if (percentage >= 70) return "bg-success";
  if (percentage >= 40) return "bg-warning";
  return "bg-danger";
}

export function getScoreColor(value: number, max = 10) {
  const safeMax = max > 0 ? max : 10;
  const percentage = (Math.min(Math.max(value, 0), safeMax) / safeMax) * 100;

  if (percentage >= 70) return "text-success";
  if (percentage >= 40) return "text-warning";
  return "text-danger";
}

function joinClassNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ProgressBar({
  value,
  max = 10,
  label,
  size = "md",
  className,
  indicatorClassName,
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 10;
  const safeValue = Math.min(Math.max(value, 0), safeMax);
  const percentage = (safeValue / safeMax) * 100;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={safeValue}
      className={joinClassNames(
        "w-full overflow-hidden rounded-full bg-muted",
        sizeStyles[size],
        className,
      )}
    >
      <div
        className={joinClassNames(
          "h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none",
          getRankColor(percentage),
          indicatorClassName,
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
