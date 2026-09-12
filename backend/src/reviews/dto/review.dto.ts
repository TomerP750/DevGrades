import { UserDto } from "../../users/dto/user.dto";


export class ReviewDto {
    id!: string;
    comment!: string;
    overallScore!: number;
    codeQualityScore!: number;
    optimizationScore!: number;
    maintainabilityScore!: number;
    scalabilityScore!: number;
    uiuxScore!: number;
    createdAt!: Date;
    user!: UserDto;
}