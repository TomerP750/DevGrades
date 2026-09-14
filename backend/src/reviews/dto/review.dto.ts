import { Expose, Type } from "class-transformer";
import { UserDto } from "../../users/dto/user.dto";


export class ReviewDto {
    @Expose()
    id!: string;
    @Expose()
    comment!: string;
    @Expose()
    overallScore!: number;
    @Expose()
    codeQualityScore!: number;
    @Expose()
    optimizationScore!: number;
    @Expose()
    maintainabilityScore!: number;
    @Expose()
    scalabilityScore!: number;
    @Expose()
    uiuxScore!: number;
    @Expose()
    createdAt!: Date;
    @Expose()
    @Type(() => UserDto)
    user!: UserDto;
}