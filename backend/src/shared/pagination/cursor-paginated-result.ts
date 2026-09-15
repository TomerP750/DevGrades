
export interface CursorPaginationInfo {
    hasNextPage: boolean;
    nextCursor: string | null;
}

export interface CursorPaginatedResult<T> {
    data: T[];
    pageInfo: CursorPaginationInfo;
}
