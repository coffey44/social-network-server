import { Router, RequestHandler } from "express";
import { createPost, getPostsByMovieId, getFeedPosts, getPublicPosts } from "../controllers/post.controller";

const router = Router();

router.post("/", createPost as RequestHandler);
router.get("/feed", getFeedPosts as RequestHandler);
router.get("/:movieId", getPostsByMovieId as RequestHandler);
router.get("/public", getPublicPosts as RequestHandler);

export default router;