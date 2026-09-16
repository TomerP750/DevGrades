import { useSearchParams } from "react-router-dom";
import type { ProjectFeedParams } from "../models/ProjectFeedParams";
import { ProjectSort } from "../models/ProjectSort";

type ProjectFeedFilters = Omit<ProjectFeedParams, "cursor" | "limit">;

function isProjectSort(value: string | null): value is ProjectSort {
    return Object.values(ProjectSort).includes(value as ProjectSort);
}



export function useProjectFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    const filters: ProjectFeedFilters = {
        search: searchParams.get("search")?.trim() || undefined,
        sortBy: isProjectSort(searchParams.get("sortBy"))
            ? searchParams.get("sortBy") as ProjectSort
            : undefined,
        archived: searchParams.get("archived") === "true" || undefined,
    };

    function setFilters(next: Partial<ProjectFeedFilters>) {
        const merged = { ...filters, ...next };
        const params = new URLSearchParams();

        if (merged.search) {
            params.set("search", merged.search);
        }
        if (merged.sortBy && merged.sortBy !== ProjectSort.NEWEST) {
            params.set("sortBy", merged.sortBy);
        }
        if (merged.archived) {
            params.set("archived", "true");
        }

        setSearchParams(params);
    }

    function setSearch(search: string) {
        setFilters({ search: search.trim() || undefined });
    }

    function clearFilters() {
        setSearchParams(new URLSearchParams());
    }

    return { filters, setFilters, setSearch, clearFilters };
}
