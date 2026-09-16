import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Menu } from "../../../../../shared/ui/Menu";
import { Button } from "../../../../../shared/ui/Button";
import { useProjectFilters } from "../../../hooks/useProjectFilters";
import { ProjectSort } from "../../../models/ProjectSort";

const radioClassName =
    "size-4 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const SORT_OPTIONS: { value: ProjectSort; label: string }[] = [
    { value: ProjectSort.NAME, label: "Name" },
    { value: ProjectSort.NEWEST, label: "Newest - Oldest" },
    { value: ProjectSort.OLDEST, label: "Oldest - Newest" },
];

export function FilterMenu() {

    const [isOpen, setIsOpen] = useState(false);

    const { filters, setFilters, clearFilters } = useProjectFilters();
    const selectedSortBy = filters.sortBy ?? ProjectSort.NEWEST;

    return (
        <div className="relative">
            <Button
                type="button"
                variant="unstyled"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 border border-input bg-card px-3.5 text-sm font-medium text-card-foreground transition-colors hover:border-foreground/30 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
                leftIcon={<SlidersHorizontal className="size-4" />}
                rightIcon={
                    <ChevronDown
                        className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                }
            >
                Filter
            </Button>

            <Menu isOpen={isOpen} className="w-64 p-4">
                <fieldset>
                    <legend className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        Filters
                    </legend>
                    <label className="mt-3 flex cursor-pointer items-center justify-between gap-3 text-sm font-medium">
                        Archived
                        <input
                            type="checkbox"
                            checked={!!filters.archived}
                            onChange={(event) =>
                                setFilters({ archived: event.target.checked || undefined })
                            }
                            className={radioClassName}
                        />
                    </label>
                </fieldset>

                <div className="my-4 border-t border-border" />

                <fieldset>
                    <legend className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        Sort by
                    </legend>
                    <div className="mt-2 grid gap-1">
                        {SORT_OPTIONS.map((option) => (
                            <label
                                key={option.value}
                                className="flex cursor-pointer items-center gap-3 px-2 py-2 text-sm font-medium transition-colors hover:bg-muted"
                            >
                                <input
                                    type="radio"
                                    name="project-sort"
                                    value={option.value}
                                    checked={selectedSortBy === option.value}
                                    onChange={() => setFilters({ sortBy: option.value })}
                                    className={radioClassName}
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                </fieldset>

                <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={clearFilters}>
                    Clear filters
                </Button>
            </Menu>
        </div>
    );
}
