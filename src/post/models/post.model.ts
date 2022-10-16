import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: String, required: true },
  likedBy: { type: Array, required: true },
  dislikedBy: { type: Array, required: true },
  created: { type: Date, required: true },
  updated: { type: Date || null },
  comments: { type: Array, required: false },
});

export interface Post {
  title: string;
  content: string;
  authorId: string;
  likedBy: string[];
  dislikedBy: string[];
  created: Date;
  updated: Date | null;
  comments: string[] | null;
}
