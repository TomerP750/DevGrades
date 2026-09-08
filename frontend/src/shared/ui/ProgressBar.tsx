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

function joinClassNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ProgressBar({
  value,
  max = 100,
  label,
  size = "md",
  className,
  indicatorClassName,
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 100;
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
          "h-full rounded-full bg-primary transition-[width] duration-500 motion-reduce:transition-none",
          indicatorClassName,
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
