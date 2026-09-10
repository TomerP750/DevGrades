import { Code2Icon } from "lucide-react";


interface ThumbnailProps {
    thumbnailUrl?: string;
}

export function Thumbnail({ thumbnailUrl }: ThumbnailProps) {
    return (
        <div className="relative aspect-[5/2] overflow-hidden bg-surface">
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={`Thumbnail preview`}
                        className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div
                        aria-label={`Thumbnail preview`}
                        className="relative grid size-full place-items-center overflow-hidden bg-gradient-to-br from-accent via-surface to-primary/10"
                        role="img"
                    >
                        <div className="absolute -right-10 -top-12 size-40 rounded-full bg-primary/20 blur-3xl" />
                        <div className="absolute -bottom-16 -left-8 size-44 rounded-full bg-primary/15 blur-3xl" />
                        <div className="relative w-[72%] translate-y-1 overflow-hidden rounded-xl border border-border/70 bg-card/95 shadow-2xl shadow-foreground/10 transition-transform duration-700 ease-out group-hover:-translate-y-1 group-hover:rotate-[-1deg]">
                            <div className="flex items-center justify-between border-b border-border/70 px-3 py-2.5">
                                <div className="flex items-center gap-1.5">
                                    <span className="size-1.5 rounded-full bg-danger/80" />
                                    <span className="size-1.5 rounded-full bg-warning/80" />
                                    <span className="size-1.5 rounded-full bg-success/80" />
                                </div>
                                <Code2Icon className="size-3.5 text-primary" />
                            </div>
                            <div className="grid grid-cols-[3rem_1fr] gap-3 p-3">
                                <div className="h-16 rounded-md bg-accent" />
                                <div className="space-y-2 pt-1">
                                    <div className="h-2 w-3/5 rounded-full bg-primary/70" />
                                    <div className="h-1.5 w-full rounded-full bg-muted" />
                                    <div className="h-1.5 w-4/5 rounded-full bg-muted" />
                                    <div className="h-1.5 w-2/3 rounded-full bg-muted" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent opacity-70" />
            </div>
    )
}