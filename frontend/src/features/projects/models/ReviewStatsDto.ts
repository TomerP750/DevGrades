export interface CategoryStatsDto {
    averageScore: number;
}

export interface ReviewStatsDto {
    overall: CategoryStatsDto;
    codeQuality: CategoryStatsDto;
    optimization: CategoryStatsDto;
    maintainability: CategoryStatsDto;
    scalability: CategoryStatsDto;
    uiux: CategoryStatsDto;
}