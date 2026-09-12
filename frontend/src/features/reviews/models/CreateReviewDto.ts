

export interface CreateReviewDto {
    overallScore: number;
    codeQualityScore: number;
    optimizationScore: number;
    maintainabilityScore: number;
    scalabilityScore: number;
    uiuxScore: number;
    comment: string 
}