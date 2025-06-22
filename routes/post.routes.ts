import { Router } from "express";
import { createPost, getPostsByMovieId, getFeedPosts, getPublicPosts } from "../controllers/post.controller";

const router = Router();

router.post("/", createPost);
router.get("/feed", getFeedPosts);
router.get("/:movieId", getPostsByMovieId);
router.get("/public", getPublicPosts);

export default router;
