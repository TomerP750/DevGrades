import { BadRequestException } from '@nestjs/common';
import { Project } from '../entities/project.entity';
import { ProjectSort } from './project-sort';

export type DecodedProjectCursor = {
    sortValue: string | Date; // name or createdAt
    id: string; // tie braker when projects share the same sort value
};

type ProjectCursorPayload = {
    sortBy: ProjectSort;
    sortValue: string;
    id: string;
    search: string;
    archived: boolean;
};

/**
 * 
 * @param search The search to use
 * @param archived The archived to use
 * @returns The cursor filters
 */
function snapshotCursorFilters(search?: string, archived?: boolean) {
    return {
        search: search ?? '',
        archived: archived === true,
    };
}

/**
 * 
 * @param project The project to encode
 * @param sortBy The sort by to use
 * @param search The search to use
 * @param archived The archived to use
 * @returns The encoded cursor
 */
export function encodeProjectCursor(
    project: Project,
    sortBy: ProjectSort = ProjectSort.NEWEST,
    search?: string,
    archived?: boolean,
): string {
    const payload: ProjectCursorPayload = {
        sortBy,
        sortValue: extractCursorValue(project, sortBy),
        id: project.id,
        ...snapshotCursorFilters(search, archived),
    };

    return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

/**
 * 
 * @param cursor The cursor to decode
 * @param sortBy The sort by to use
 * @param search The search to use
 * @param archived The archived to use
 * @returns The decoded cursor
 */
export function decodeProjectCursor(
    cursor: string,
    sortBy: ProjectSort = ProjectSort.NEWEST,
    search?: string,
    archived?: boolean,
): DecodedProjectCursor {
    let payload: unknown;
    try {
        payload = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
    } catch {
        throw new BadRequestException('Invalid pagination cursor');
    }

    const {
        sortBy: cursorSortBy,
        sortValue: cursorSortValue,
        id,
        search: cursorSearch,
        archived: cursorArchived,
    } = (payload ?? {}) as Record<string, unknown>;

    const requestFilters = snapshotCursorFilters(search, archived);

    if (
        cursorSortBy !== sortBy ||
        typeof cursorSortValue !== 'string' ||
        typeof id !== 'string' ||
        cursorSearch !== requestFilters.search ||
        cursorArchived !== requestFilters.archived
    ) {
        throw new BadRequestException('Invalid pagination cursor');
    }

    if (sortBy !== ProjectSort.NAME) {
        const parsedCreatedAt = new Date(cursorSortValue);
        if (Number.isNaN(parsedCreatedAt.getTime())) {
            throw new BadRequestException('Invalid pagination cursor');
        }
        return { sortValue: parsedCreatedAt, id };
    }

    return { sortValue: cursorSortValue, id };
}

/**
 * 
 * @param project Extract the cursor value
 * @param sortBy 
 * @returns 
 */
function extractCursorValue(project: Project, sortBy: ProjectSort): string {
    if (sortBy === ProjectSort.NAME) {
        return project.name;
    }
    const createdAt = project.createdAt instanceof Date
        ? project.createdAt
        : new Date(project.createdAt);
    return createdAt.toISOString();
}