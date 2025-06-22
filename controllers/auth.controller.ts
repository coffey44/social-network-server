import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({  
      username,
      email,
      password: hashed,
      role
    });

    req.session.userId = newUser._id.toString();
    res.status(201).json({
      message: "Registered successfully",
      user: { _id: newUser._id, username, email, role }
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.userId = user._id.toString();
    res.status(200).json({
      message: "Logged in",
      user: { _id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out" });
  });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Not logged in" });

    const user = await User.findById(userId).select("username role");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ id: user._id, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err });
  }
};
