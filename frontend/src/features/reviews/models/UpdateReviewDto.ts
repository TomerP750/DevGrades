

export interface UpdateReviewDto {
    overallScore: number;
    codeQualityScore: number;
    optimizationScore: number;
    maintainabilityScore: number;
    scalabilityScore: number;
    uiuxScore: number;
    comment: string 
}