
import { useInfiniteQuery } from "@tanstack/react-query";
import projectService from "../api/projectService";

const PAGE_SIZE = 6;

export const PROJECTS_FEED_QUERY_KEY = ["projects", "feed"];

export function useProjectsFeed() {
    return useInfiniteQuery({
        queryKey: PROJECTS_FEED_QUERY_KEY,
        queryFn: ({ pageParam }) =>
            projectService.allProjects({ cursor: pageParam, limit: PAGE_SIZE }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.pageInfo.nextCursor ?? undefined,
        staleTime: 60_000,
    });
}