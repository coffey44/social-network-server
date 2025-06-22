// server/controllers/review.controller.ts
import { Request, Response } from "express";
import Review from "../models/review.model";
import User from "../models/user.model";

export const createReview = async (req: Request, res: Response) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ message: "Not logged in" });

  const { movieId, rating, comment } = req.body;
  if (!movieId || !rating || !comment)
    return res.status(400).json({ message: "Missing required fields" });

  try {
    const existing = await Review.findOne({ movieId, author: userId });
    if (existing)
      return res.status(400).json({ message: "You've already reviewed this!" });

    const newReview = new Review({
      movieId,
      rating,
      comment,
      author: userId,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: "Failed to create review", error: err });
  }
};

export const getReviewsByMovieId = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId })
      .populate("author", "username role")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews", error: err });
  }
};

export const getFeedReviews = async (req: Request, res: Response) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ message: "Not logged in" });

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const authorIds = [userId.toString(), ...user.following.map(id => id.toString())];

    const reviews = await Review.find({ author: { $in: authorIds } })
      .sort({ createdAt: -1 })
      .populate("author", "username role");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews", error: err });
  }
};

export const getReviewsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "Missing userId" });
    const reviews = await Review.find({ author: userId })
      .populate("author", "username role")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews", error: err });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.id;
    const userId = req.session.userId;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found." });

    if (review.author.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this review." });
    }

    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ message: "Review deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error deleting review." });
  }
};

