import { Injectable, NotFoundException } from "@nestjs/common";
import { Review } from "./entities/review.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ProjectsService } from "../projects/projects.service";
import { CategoryStatsDto, ReviewStatsDto } from "./dto/review-stats.dto";

@Injectable()
export class ReviewsStatsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewsRepository: Repository<Review>,
        private readonly projectsService: ProjectsService,
    ) {}

    async getReviewStats(projectId: string): Promise<ReviewStatsDto> {

        const project = await this.projectsService.findOne(projectId);

        if (!project) {
            throw new NotFoundException("Project not found");
        }

        const stats = await this.reviewsRepository
            .createQueryBuilder("review")
            .select("AVG(review.overallScore)", "overallAverage")
            .addSelect("AVG(review.codeQualityScore)", "codeQualityAverage")
            .addSelect("AVG(review.optimizationScore)", "optimizationAverage")
            .addSelect("AVG(review.maintainabilityScore)", "maintainabilityAverage")
            .addSelect("AVG(review.scalabilityScore)", "scalabilityAverage")
            .addSelect("AVG(review.uiuxScore)", "uiuxAverage")
            .where("review.projectId = :projectId", { projectId })
            .getRawOne();

        return {
            overall: this.toCategoryStats(stats?.overallAverage),
            codeQuality: this.toCategoryStats(stats?.codeQualityAverage),
            optimization: this.toCategoryStats(stats?.optimizationAverage),
            maintainability: this.toCategoryStats(stats?.maintainabilityAverage),
            scalability: this.toCategoryStats(stats?.scalabilityAverage),
            uiux: this.toCategoryStats(stats?.uiuxAverage),
        };
    }

    private toCategoryStats(value: string | number | null | undefined): CategoryStatsDto {
        if (value == null) {
            return { averageScore: 0 };
        }

        return {
            averageScore: Math.round(Number(value) * 10) / 10,
        };
    }
}