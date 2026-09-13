import { useState } from "react";
import { ProjectFeedActions } from "../components/feed_actions/ProjectFeedActions";
import { ProjectCard } from "../components/project_card/ProjectCard";
import { useProjectsFeed } from "../hooks/useProjectsFeed";

export default function ProjectsFeedPage() {

    const [gridLayout, setGridLayout] = useState<2 | 3>(2);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        isError,
        refetch,
    } = useProjectsFeed();

    // `data` holds one page per fetch, so flatten before rendering.
    const projects = data?.pages.flatMap((page) => page.data) ?? [];

    const gridClassName = gridLayout === 3
        ? "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
        : "grid grid-cols-1 gap-6 md:grid-cols-2";

    return (
        <>

            <ProjectFeedActions
                gridLayout={gridLayout}
                onGridLayoutChange={setGridLayout}
            />

            {isPending && (
                <p className="py-16 text-center text-sm text-muted-foreground">
                    Loading projects...
                </p>
            )}

            {isError && (
                <div
                    role="alert"
                    className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center"
                >
                    <h2 className="font-bold text-card-foreground">
                        Could not load projects
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Something went wrong while fetching the feed.
                    </p>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        Try again
                    </button>
                </div>
            )}

            {!isPending && !isError && projects.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                    <h2 className="font-bold text-card-foreground">
                        No projects found
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Try another project name or creator.
                    </p>
                </div>
            )}

            {projects.length > 0 && (
                <section aria-label="Projects" className={gridClassName}>
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </section>
            )}

            {hasNextPage && (
                <div className="mt-8 flex justify-center">
                    <button
                        type="button"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="inline-flex h-10 cursor-pointer items-center justify-center bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isFetchingNextPage ? "Loading..." : "Load more"}
                    </button>
                </div>
            )}

        </>
    );
}
