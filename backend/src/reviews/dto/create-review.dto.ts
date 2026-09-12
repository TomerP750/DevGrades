import { IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  overallScore!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  codeQualityScore!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  optimizationScore!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  maintainabilityScore!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  scalabilityScore!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  uiuxScore!: number;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  comment!: string;
}
