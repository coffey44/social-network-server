// server/routes/review.routes.ts
import { Router } from "express";
import { createReview, 
    getReviewsByMovieId, 
    getFeedReviews,
    getReviewsByUserId,
    deleteReview

        } from "../controllers/review.controller";

const router = Router();

router.post("/", createReview);
router.get("/feed", getFeedReviews);
router.get("/", getReviewsByUserId);
router.get("/:movieId", getReviewsByMovieId);
router.delete("/:id", deleteReview);


export default router;
