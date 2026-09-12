import { Type } from 'class-transformer';
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CursorPaginationQueryDto {
    @IsString()
    @IsOptional()
    cursor!: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(10)
    @IsOptional()
    limit: number = 10;
}