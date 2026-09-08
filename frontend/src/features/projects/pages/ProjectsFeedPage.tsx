
import { useState } from "react";
import { dummyData } from "../api/dummyData";
import { ProjectFeedActions } from "../components/feed_actions/ProjectFeedActions";
import { ProjectCard } from "../components/project_card/ProjectCard";

export default function ProjectsFeedPage() {
    const [search, setSearch] = useState("");
    const [gridLayout, setGridLayout] = useState<2 | 3>(3);

    const normalizedSearch = search.trim().toLowerCase();
    const filteredProjects = dummyData.filter((project) =>
        [project.name, project.description, project.user.username].some((value) =>
            value.toLowerCase().includes(normalizedSearch),
        ),
    );

    return (
        <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <header className="mb-8">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
                    Community work
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Projects feed
                </h1>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                    Discover projects from other developers and leave useful,
                    actionable feedback.
                </p>
            </header>

            <ProjectFeedActions
                search={search}
                onSearchChange={setSearch}
                gridLayout={gridLayout}
                onGridLayoutChange={setGridLayout}
            />

            {filteredProjects.length > 0 ? (
                <section
                    aria-label="Projects"
                    className={
                        gridLayout === 3
                            ? "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
                            : "grid grid-cols-1 gap-6 md:grid-cols-2"
                    }
                >
                    {filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </section>
            ) : (
                <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                    <h2 className="font-bold text-card-foreground">
                        No projects found
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Try another project name or creator.
                    </p>
                </div>
            )}
        </main>
    );
}