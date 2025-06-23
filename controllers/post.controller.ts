import { Request, Response } from "express";
import Post from "../models/post.model";
import User from "../models/user.model";

export const createPost = async (req: Request, res: Response) => {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).json({ message: "Not logged in" });
    return;
  }

  const { movieId, content } = req.body;
  if (!movieId || !content) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const post = new Post({ movieId, content, author: userId });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post", error: err });
  }
};

export const getPostsByMovieId = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({ movieId: req.params.movieId })
      .populate("author", "username role")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts", error: err });
  }
};

export const getFeedPosts = async (req: Request, res: Response) => {
  const userId = req.session.userId;
  if (!userId) {
    res.status(401).json({ message: "Not logged in" });
    return;
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const authorIds = [userId.toString(), ...user.following.map(id => id.toString())];

    const posts = await Post.find({ author: { $in: authorIds } })
      .sort({ createdAt: -1 })
      .populate("author", "username role");

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to load feed", error: err });
  }
};

export const getPublicPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("author", "username role");
    res.json(posts);
  } catch (err) {
    console.error("Failed to fetch public posts:", err);
    res.status(500).json({ message: "Error fetching posts" });
  }
};
