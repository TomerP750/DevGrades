import { QueryClient, useInfiniteQuery } from "@tanstack/react-query";
import projectService from "../api/projectService";
import { useProjectFilters } from "./useProjectFilters";

const PAGE_SIZE = 6;

export const PROJECTS_FEED_QUERY_KEY = ["projects", "feed"];

export function resetProjectsFeed(queryClient: QueryClient) {
    return queryClient.resetQueries({ queryKey: PROJECTS_FEED_QUERY_KEY });
}

export function useProjectsFeed() {
    const { filters } = useProjectFilters();

    return useInfiniteQuery({
        queryKey: [...PROJECTS_FEED_QUERY_KEY, filters],
        queryFn: ({ pageParam }) =>
            projectService.allProjects({
                ...filters,
                cursor: pageParam,
                limit: PAGE_SIZE,
            }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.pageInfo.nextCursor ?? undefined,
        staleTime: 60_000,
    });
}
