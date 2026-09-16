export enum ProjectSort {
    NAME = 'name',
    NEWEST = 'newest',
    OLDEST = 'oldest',
}

export function resolveProjectSort(sortBy: ProjectSort = ProjectSort.NEWEST) {
    if (sortBy === ProjectSort.NAME) {
        return { column: 'project.name' as const, direction: 'ASC' as const };
    }
    if (sortBy === ProjectSort.OLDEST) {
        return { column: 'project.createdAt' as const, direction: 'ASC' as const };
    }
    return { column: 'project.createdAt' as const, direction: 'DESC' as const };
}
