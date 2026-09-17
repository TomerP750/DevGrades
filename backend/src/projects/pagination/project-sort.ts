export enum ProjectSort {
    NAME = 'name',
    NEWEST = 'newest',
    OLDEST = 'oldest',
}

export type ProjectSortSpec = {
    column: 'project.name' | 'project.createdAt';
    direction: 'ASC' | 'DESC';
    valueType: 'string' | 'date';
};

const PROJECT_SORT_MAP: Record<ProjectSort, ProjectSortSpec> = {
    [ProjectSort.NAME]: {
        column: 'project.name',
        direction: 'ASC',
        valueType: 'string',
    },
    [ProjectSort.NEWEST]: {
        column: 'project.createdAt',
        direction: 'DESC',
        valueType: 'date',
    },
    [ProjectSort.OLDEST]: {
        column: 'project.createdAt',
        direction: 'ASC',
        valueType: 'date',
    },
};

export function resolveProjectSort(sortBy: ProjectSort = ProjectSort.NEWEST) {
    return PROJECT_SORT_MAP[sortBy];
}