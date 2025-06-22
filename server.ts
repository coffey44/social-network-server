import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import reviewRoutes from "./routes/review.routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true               
  })
);


app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, 
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/socialnetwork")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/reviews", reviewRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
