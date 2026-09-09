import { useState } from "react";
import { dummyData } from "../api/dummyData";
import { ProjectFeedActions } from "../components/feed_actions/ProjectFeedActions";
import { ProjectCard } from "../components/project_card/ProjectCard";

export default function ProjectsFeedPage() {

    const [gridLayout, setGridLayout] = useState<2 | 3>(2);

    return (
        <>
          
            <ProjectFeedActions
                gridLayout={gridLayout}
                onGridLayoutChange={setGridLayout}
            />

            {dummyData.length > 0 ? (
                <section
                    aria-label="Projects"
                    className={
                        gridLayout === 3
                            ? "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
                            : "grid grid-cols-1 gap-6 md:grid-cols-2"
                    }
                >
                    {dummyData.map((project) => (
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
        </>
    );
}