import { useState } from "react";
import {
    Columns2,
    Grid3X3,
    Plus,
} from "lucide-react";
import { Button } from "../../../../shared/ui/Button";
import { SearchInput } from "../../../../shared/ui/SearchInput";
import { CreateProjectModal } from "./CreateProjectModal";
import { FilterMenu } from "./filters/FilterMenu";

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
            <Button
                type="button"
                size="sm"
                onClick={() => setIsCreateProjectOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={isCreateProjectOpen}
                className="h-10 shrink-0"
                icon={<Plus className="size-4" />}
            >
                Create project
            </Button>

            <SearchInput
                onSearch={() => {}}
                placeholder="Search projects or creators"
                label="Search projects"
                className="flex-1"
            />

            <FilterMenu />

            <div
                className="flex items-center justify-center border-l border-border"
                role="group"
                aria-label="Project grid layout"
            >
                <Button
                    type="button"
                    variant="unstyled"
                    onClick={() => onGridLayoutChange(2)}
                    aria-label="Two-column layout"
                    aria-pressed={gridLayout === 2}
                    title="Two columns"
                    className={layoutButtonClass(gridLayout === 2)}
                    icon={<Columns2 className="size-4" />}
                />
                <Button
                    type="button"
                    variant="unstyled"
                    onClick={() => onGridLayoutChange(3)}
                    aria-label="Three-column layout"
                    aria-pressed={gridLayout === 3}
                    title="Three columns"
                    className={layoutButtonClass(gridLayout === 3)}
                    icon={<Grid3X3 className="size-4" />}
                />

            </div>
            <CreateProjectModal open={isCreateProjectOpen} onClose={() => setIsCreateProjectOpen(false)} />
        </div>
    );
}
