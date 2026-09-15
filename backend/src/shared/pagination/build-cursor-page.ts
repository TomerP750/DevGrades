import { CursorPaginatedResult } from './cursor-paginated-result';

/**
 * Expects `rows` to contain up to `limit + 1` items so the extra row
 * can signal a next page without an additional COUNT query.
 */
export function buildCursorPage<T>(
    rows: T[],
    limit: number,
    toCursor: (row: T) => string,
): CursorPaginatedResult<T> {
    const hasNextPage = rows.length > limit;
    const data = hasNextPage ? rows.slice(0, limit) : rows;
    const lastRow = data.at(-1);

    return {
        data,
        pageInfo: {
            hasNextPage,
            nextCursor: hasNextPage && lastRow ? toCursor(lastRow) : null,
        },
    };
}