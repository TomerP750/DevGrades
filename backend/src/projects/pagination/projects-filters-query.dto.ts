import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { CursorPaginationQueryDto } from "../../shared/pagination/cursor-pagination.dto";
import { ProjectSort } from "./project-sort";
import { SortOrder } from "../../shared/pagination/sort-order";
import { Transform } from "class-transformer";

export class ProjectsFiltersQueryDto extends CursorPaginationQueryDto {

    @IsOptional()
    @IsString()
    search?: string

    @IsOptional()
    @IsEnum(ProjectSort)
    sortBy?: ProjectSort;

    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder;

    @IsBoolean()
    @Transform(({ value }) => {
        if (value === undefined || value === null || value === '') return undefined;
        if (value === true || value === 'true') return true;
        if (value === false || value === 'false') return false;
        return value;
      })
    @IsOptional()
    archived?: boolean;

    

}