import axios from "axios";
import { baseApiUrl } from "../../../shared/utils/baseApi";
import type { CreateReviewDto } from "../models/CreateReviewDto";
import type { UpdateReviewDto } from "../models/UpdateReviewDto";


class ReviewService {

    async createReview(projectId: string, review: CreateReviewDto) {
        return (await axios.post(`${baseApiUrl}/api/reviews/create/${projectId}`, review)).data;
    }

    async updateReview(review: UpdateReviewDto) {
        return (await axios.put(`${baseApiUrl}/api/reviews/update`, review)).data;
    }

    async deleteReview(reviewId: string) {
        return (await axios.delete(`${baseApiUrl}/api/reviews/delete/${reviewId}`)).data;
    }

    async allReviewsByProjectId(projectId: string) {
        return (await axios.get(`${baseApiUrl}/api/reviews/all/${projectId}`)).data;
    }

}

const reviewService = new ReviewService();
export default reviewService;