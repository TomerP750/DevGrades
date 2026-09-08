import { useState } from "react";
import {
    Columns2,
    Grid3X3,
    Plus,
    SlidersHorizontal,
} from "lucide-react";
import { SearchInput } from "../../../../shared/ui/SearchInput";
import { CreateProjectModal } from "./CreateProjectModal";

interface ProjectFeedActionsProps {
    gridLayout: 2 | 3;
    onGridLayoutChange: (layout: 2 | 3) => void;
}

export function ProjectFeedActions({ gridLayout, onGridLayoutChange }: ProjectFeedActionsProps) {

    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

    const layoutButtonClass = (active: boolean) =>
        `grid size-9 cursor-pointer place-items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active
            ? "bg-primary text-background"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`;

    return (
        <div className="mb-6 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center">
            <button
                type="button"
                onClick={() => setIsCreateProjectOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={isCreateProjectOpen}
                className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <Plus aria-hidden="true" className="size-4" />
                Create project
            </button>

            <SearchInput
                onSearch={() => {}}
                placeholder="Search projects or creators"
                label="Search projects"
                className="flex-1"
            />

            <button
                type="button"
                className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 border border-input bg-card px-3.5 text-sm font-medium text-card-foreground transition-colors hover:border-foreground/30 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <SlidersHorizontal aria-hidden="true" className="size-4" />
                Filter
            </button>

            <div
                className="flex items-center justify-center border-l border-border"
                role="group"
                aria-label="Project grid layout"
            >
                <button
                    type="button"
                    onClick={() => onGridLayoutChange(2)}
                    aria-label="Two-column layout"
                    aria-pressed={gridLayout === 2}
                    title="Two columns"
                    className={layoutButtonClass(gridLayout === 2)}
                >
                    <Columns2 aria-hidden="true" className="size-4" />
                </button>
                <button
                    type="button"
                    onClick={() => onGridLayoutChange(3)}
                    aria-label="Three-column layout"
                    aria-pressed={gridLayout === 3}
                    title="Three columns"
                    className={layoutButtonClass(gridLayout === 3)}
                >
                    <Grid3X3 aria-hidden="true" className="size-4" />
                </button>

            </div>
            <CreateProjectModal open={isCreateProjectOpen} onClose={() => setIsCreateProjectOpen(false)} />
        </div>
    );
}
