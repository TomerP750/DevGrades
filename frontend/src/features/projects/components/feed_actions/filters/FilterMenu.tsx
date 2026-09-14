import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Menu } from "../../../../../shared/ui/Menu";
import { Button } from "../../../../../shared/ui/Button";

export function FilterMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <Button
                type="button"
                variant="unstyled"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 border border-input bg-card px-3.5 text-sm font-medium text-card-foreground transition-colors hover:border-foreground/30 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
                icon={
                    <>
                        <SlidersHorizontal className="size-4" />
                        <ChevronDown
                            className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                    </>
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
                            className="size-4 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        />
                    </label>
                </fieldset>

                <div className="my-4 border-t border-border" />

                <fieldset>
                    <legend className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        Sort by
                    </legend>
                    <div className="mt-2 grid gap-1">
                        <label className="flex cursor-pointer items-center gap-3 px-2 py-2 text-sm font-medium transition-colors hover:bg-muted">
                            <input
                                type="radio"
                                name="project-sort"
                                value="name"
                                className="size-4 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                            />
                            Name
                        </label>
                        <label className="flex cursor-pointer items-center gap-3 px-2 py-2 text-sm font-medium transition-colors hover:bg-muted">
                            <input
                                type="radio"
                                name="project-sort"
                                value="newestToOldest"
                                defaultChecked
                                className="size-4 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                            />
                            Newest - Oldest
                        </label>
                        <label className="flex cursor-pointer items-center gap-3 px-2 py-2 text-sm font-medium transition-colors hover:bg-muted">
                            <input
                                type="radio"
                                name="project-sort"
                                value="oldestToNewest"
                                className="size-4 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                            />
                            Oldest - Newest
                        </label>
                    </div>
                </fieldset>

                <div className="mt-4 flex gap-2 border-t border-border pt-4">
                    <Button type="reset" variant="outline" size="sm" fullWidth>
                        Reset
                    </Button>
                    <Button type="submit" size="sm" fullWidth>
                        Apply
                    </Button>
                </div>

            </Menu>
        </div>
    );
}