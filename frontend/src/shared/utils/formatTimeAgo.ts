const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
});

const timeUnits = [
    { unit: "year", seconds: 60 * 60 * 24 * 365 },
    { unit: "month", seconds: 60 * 60 * 24 * 30 },
    { unit: "week", seconds: 60 * 60 * 24 * 7 },
    { unit: "day", seconds: 60 * 60 * 24 },
    { unit: "hour", seconds: 60 * 60 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
] as const;

export function formatTimeAgo(date: string | number | Date): string {
    const elapsedSeconds = (new Date(date).getTime() - Date.now()) / 1000;
    const unit = timeUnits.find(({ seconds }) => Math.abs(elapsedSeconds) >= seconds)
        ?? timeUnits[timeUnits.length - 1];

    return relativeTimeFormatter.format(
        Math.round(elapsedSeconds / unit.seconds),
        unit.unit,
    );
}

export function formatMessageTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}