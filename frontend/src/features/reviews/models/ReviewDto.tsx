import type { UserDto } from "../../../shared/models/UserDto";


export interface ReviewDto {
    overallScore: number;
    codeQualityScore: number;
    optimizationScore: number;
    maintainabilityScore: number;
    scalabilityScore: number;
    uiuxScore: number;
    comment: string 
    createdAt: Date;
    userDto: UserDto;
}