import * as mongoose from 'mongoose';

export const ProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  status: { type: String, required: false },
  bio: { type: String, required: false },
  followers: { type: Array, required: false },
  following: { type: Array, required: false },
  buffer: { type: Object, required: false },
  filename: { type: String, required: false },
});

export interface Profile {
  userId: string;
  status: string | null;
  bio: string | null;
  followers: string[];
  following: string[];
  buffer: object;
  filename: string;
}
