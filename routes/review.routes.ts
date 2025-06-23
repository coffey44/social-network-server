import { Router, RequestHandler } from "express";
import { createReview, 
    getReviewsByMovieId, 
    getFeedReviews,
    getReviewsByUserId,
    deleteReview

        } from "../controllers/review.controller";

const router = Router();

router.post("/", createReview as RequestHandler);
router.get("/feed", getFeedReviews as RequestHandler);
router.get("/", getReviewsByUserId as RequestHandler);
router.get("/:movieId", getReviewsByMovieId as RequestHandler);
router.delete("/:id", deleteReview as RequestHandler);


export default router;