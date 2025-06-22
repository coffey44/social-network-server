import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  author: mongoose.Types.ObjectId;
  movieId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  author:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  movieId:   { type: String, required: true },
  rating:    { type: Number, required: true },
  comment:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IReview>("Review", ReviewSchema);
