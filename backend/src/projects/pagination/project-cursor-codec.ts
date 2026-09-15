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
};

export function encodeProjectCursor(
    project: Project,
    sortBy: ProjectSort = ProjectSort.CREATED_AT,
): string {
    const payload: ProjectCursorPayload = {
        sortBy,
        value: sortValue(project, sortBy),
        id: project.id,
    };

    return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

export function decodeProjectCursor(
    cursor: string,
    sortBy: ProjectSort = ProjectSort.CREATED_AT,
): DecodedProjectCursor {
    let payload: unknown;
    try {
        payload = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
    } catch {
        throw new BadRequestException('Invalid pagination cursor');
    }

    const { sortBy: cursorSortBy, value, id } = (payload ?? {}) as Record<string, unknown>;

    if (
        cursorSortBy !== sortBy ||
        typeof value !== 'string' ||
        typeof id !== 'string'
    ) {
        throw new BadRequestException('Invalid pagination cursor');
    }

    if (sortBy === ProjectSort.CREATED_AT) {
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
    return project.createdAt.toISOString();
}