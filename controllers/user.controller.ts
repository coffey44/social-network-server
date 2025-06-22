import { Request, Response } from "express";
import User from "../models/user.model";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const getUserById = async (req: Request, res: Response) => {
  try {
    const targetId = req.params.id;
    const user = await User.findById(targetId)
      .select("username email role bookmarks following")
      .populate("following", "username");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.session.userId;
  const { username, email, password } = req.body;

  if (!userId) return res.status(401).json({ message: "Not logged in" });

  try {
    const updates: any = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updated = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("username email role bookmarks following");

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Profile updated", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err });
  }
};


export const addBookmark = async (req: Request, res: Response) => {
  const userId = req.session.userId;
  const { imdbID } = req.body;

  if (!userId) return res.status(401).json({ message: "Not logged in" });
  if (!imdbID) return res.status(400).json({ message: "Missing imdbID" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.bookmarks.includes(imdbID)) {
      user.bookmarks.push(imdbID);
      await user.save();
    }

    res.status(200).json({ message: "Bookmarked!" });
  } catch (err) {
    res.status(500).json({ message: "Bookmarking failed", error: err });
  }
};

export const removeBookmark = async (req: Request, res: Response) => {
  const userId = req.session.userId;
  const { imdbID } = req.body;

  if (!userId) return res.status(401).json({ message: "Not logged in" });
  if (!imdbID) return res.status(400).json({ message: "Missing imdbID" });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.bookmarks = user.bookmarks.filter(id => id !== imdbID);
    await user.save();

    res.status(200).json({ message: "Bookmark removed!" });
  } catch (err) {
    res.status(500).json({ message: "Removing bookmark failed", error: err });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const userId = req.session.userId;

  if (!userId) return res.status(401).json({ message: "Not logged in" });

  try {
    const user = await User.findById(userId).select("username role bookmarks");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().limit(10); 
    res.json(users); 
  } catch (err) {
    console.error("Error in getAllUsers:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const followUser = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.session.userId;
    const targetUserId = req.params.id;

    if (!currentUserId || currentUserId === targetUserId) {
      return res.status(400).json({ message: "Invalid follow request." });
    }

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) return res.status(404).json({ message: "Current user not found" });

    const targetObjectId = new mongoose.Types.ObjectId(targetUserId);
    if (!currentUser.following.includes(targetObjectId)) {
      currentUser.following.push(targetObjectId);
      await currentUser.save();
    }

    res.status(200).json({ message: "Followed successfully", following: currentUser.following });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Follow failed" });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.session.userId;
    const targetUserId = req.params.id;

    if (!currentUserId || currentUserId === targetUserId) {
      return res.status(400).json({ message: "Invalid unfollow request." });
    }

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) return res.status(404).json({ message: "Current user not found" });

    currentUser.following = currentUser.following.filter(
      (id: any) => id.toString() !== targetUserId
    );
    await currentUser.save();

    res.status(200).json({ message: "Unfollowed successfully", following: currentUser.following });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unfollow failed" });
  }
};

export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const { username, email, password } = req.body;

    const updates: any = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user." });
  }
};



