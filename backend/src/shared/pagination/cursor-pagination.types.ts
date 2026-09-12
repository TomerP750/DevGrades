

export type CursorPageInfo = {
    nextCursor: string | null;
    hasNextPage: boolean;
}
/**
 * Example of a cursor paginated result
 * {
  "data": [],
  "pageInfo": {
    "nextCursor": null,
    "hasNextPage": false
  }
}
 */
export interface CursorPaginatedResult<T> {
    data: T[];
    pageInfo: CursorPageInfo;
}