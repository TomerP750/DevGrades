import type { CursorPaginationQuery } from "../../../shared/models/CursorPaginationQuery";
import type { ProjectSort } from "./ProjectSort";

export interface ProjectFeedParams extends CursorPaginationQuery {
    search?: string;
    sortBy?: ProjectSort;
    archived?: boolean;
}
