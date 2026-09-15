import { Expose, Type } from "class-transformer";


export class CategoryStatsDto {
    @Expose()
    averageScore!: number;
}

export class ReviewStatsDto {

    @Expose()
    @Type(() => CategoryStatsDto)
    overall!: CategoryStatsDto;

    @Expose()
    @Type(() => CategoryStatsDto)
    codeQuality!: CategoryStatsDto;

    @Expose()
    @Type(() => CategoryStatsDto)
    optimization!: CategoryStatsDto;

    @Expose()
    @Type(() => CategoryStatsDto)
    maintainability!: CategoryStatsDto;

    @Expose()
    @Type(() => CategoryStatsDto)
    scalability!: CategoryStatsDto;

    @Expose()
    @Type(() => CategoryStatsDto)
    uiux!: CategoryStatsDto;
    
}