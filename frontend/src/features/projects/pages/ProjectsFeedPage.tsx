import { useState } from "react";
import { ProjectFeedActions } from "../components/feed_actions/ProjectFeedActions";
import { ProjectCard } from "../components/project_card/ProjectCard";
import { useProjectsFeed } from "../hooks/useProjectsFeed";
import { Button } from "../../../shared/ui/Button";

const GRID_LAYOUT_KEY = "grid-layout";

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
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => refetch()}
                        className="mt-4 h-10"
                    >
                        Try again
                    </Button>
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
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => fetchNextPage()}
                        isLoading={isFetchingNextPage}
                        className="h-10 px-6"
                    >
                        {isFetchingNextPage ? "Loading..." : "Load more"}
                    </Button>
                </div>
            )}

        </>
    );
}
