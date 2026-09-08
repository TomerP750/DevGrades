const dateFormatter = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
});

export function formatDate(date: string | number | Date): string {
    return dateFormatter.format(new Date(date));
}
