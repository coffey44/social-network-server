// server/models/post.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  author: mongoose.Types.ObjectId;
  movieId: string;
  content: string;
  createdAt: Date;
}

const PostSchema = new Schema<IPost>({
  author:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  movieId:   { type: String, required: true },
  content:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPost>("Post", PostSchema);
