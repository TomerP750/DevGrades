

export interface CursorPaginationInfo {
    hasNextPage: boolean;
    nextCursor: string | null;
}

export interface CursorPageResponse<T> {
    data: T[];
    pageInfo: CursorPaginationInfo;
}