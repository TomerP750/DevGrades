import { BadRequestException } from '@nestjs/common';
import { Project } from '../entities/project.entity';
import { ProjectSort, resolveProjectSort } from './project-sort';

export type DecodedProjectCursor = {
    sortValue: string | Date; // name or createdAt
    id: string; // tie-breaker when projects share the same sort value
};

type ProjectCursorPayload = {
    version: 1;
    sortBy: ProjectSort;
    value: string;
    id: string;
    filters: {
        search: string;
        archivedOnly: boolean;
    };
};


function snapshotCursorFilters(search?: string, archivedOnly?: boolean) {
    return {
        search: search ?? '',
        archivedOnly: archivedOnly === true,
    };
}


export function encodeProjectCursor(
    project: Project,
    sortBy: ProjectSort = ProjectSort.NEWEST,
    search?: string,
    archivedOnly?: boolean,
): string {
    const payload: ProjectCursorPayload = {
        version: 1,
        sortBy,
        value: extractCursorValue(project, sortBy),
        id: project.id,
        filters: snapshotCursorFilters(search, archivedOnly),
    };

    return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}


export function decodeProjectCursor(
    cursor: string,
    sortBy: ProjectSort = ProjectSort.NEWEST,
    search?: string,
    archivedOnly?: boolean,
): DecodedProjectCursor {
    let payload: unknown;
    try {
        payload = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
    } catch {
        throw new BadRequestException('Invalid pagination cursor');
    }

    const {
        version,
        sortBy: cursorSortBy,
        value: cursorSortValue,
        id,
        filters,
    } = (payload ?? {}) as Record<string, unknown>;

    const cursorFilters = filters && typeof filters === 'object' && !Array.isArray(filters)
        ? filters as Record<string, unknown>
        : undefined;
    const requestFilters = snapshotCursorFilters(search, archivedOnly);

    if (
        version !== 1 ||
        cursorSortBy !== sortBy ||
        typeof cursorSortValue !== 'string' ||
        typeof id !== 'string' ||
        cursorFilters?.search !== requestFilters.search ||
        cursorFilters?.archivedOnly !== requestFilters.archivedOnly
    ) {
        throw new BadRequestException('Invalid pagination cursor');
    }

    const { valueType } = resolveProjectSort(sortBy);
    
    if (valueType === 'date') {
        const parsedCreatedAt = new Date(cursorSortValue);
        if (Number.isNaN(parsedCreatedAt.getTime())) {
            throw new BadRequestException('Invalid pagination cursor');
        }
        return { sortValue: parsedCreatedAt, id };
    }
    return { sortValue: cursorSortValue, id };
}


function extractCursorValue(project: Project, sortBy: ProjectSort): string {
    const { valueType } = resolveProjectSort(sortBy);
    if (valueType === 'string') {
        return project.name;
    }
    const createdAt = project.createdAt instanceof Date
        ? project.createdAt
        : new Date(project.createdAt);
    return createdAt.toISOString();
}