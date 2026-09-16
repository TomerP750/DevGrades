import { BadRequestException } from '@nestjs/common';
import { Project } from '../entities/project.entity';
import { ProjectSort } from './project-sort';

export type DecodedProjectCursor = {
    value: string | Date;
    id: string;
};

type ProjectCursorPayload = {
    sortBy: ProjectSort;
    value: string;
    id: string;
    search: string;
    archived: boolean;
};

function cursorFilters(search?: string, archived?: boolean) {
    return {
        search: search ?? '',
        archived: archived === true,
    };
}

export function encodeProjectCursor(
    project: Project,
    sortBy: ProjectSort = ProjectSort.NEWEST,
    search?: string,
    archived?: boolean,
): string {
    const payload: ProjectCursorPayload = {
        sortBy,
        value: sortValue(project, sortBy),
        id: project.id,
        ...cursorFilters(search, archived),
    };

    return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

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
        value,
        id,
        search: cursorSearch,
        archived: cursorArchived,
    } = (payload ?? {}) as Record<string, unknown>;

    const expected = cursorFilters(search, archived);

    if (
        cursorSortBy !== sortBy ||
        typeof value !== 'string' ||
        typeof id !== 'string' ||
        cursorSearch !== expected.search ||
        cursorArchived !== expected.archived
    ) {
        throw new BadRequestException('Invalid pagination cursor');
    }

    if (sortBy !== ProjectSort.NAME) {
        const createdAt = new Date(value);
        if (Number.isNaN(createdAt.getTime())) {
            throw new BadRequestException('Invalid pagination cursor');
        }
        return { value: createdAt, id };
    }

    return { value, id };
}

function sortValue(project: Project, sortBy: ProjectSort): string {
    if (sortBy === ProjectSort.NAME) {
        return project.name;
    }
    const createdAt = project.createdAt instanceof Date
        ? project.createdAt
        : new Date(project.createdAt);
    return createdAt.toISOString();
}