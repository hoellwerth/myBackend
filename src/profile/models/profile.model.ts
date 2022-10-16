import * as mongoose from 'mongoose';

export const ProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  status: { type: String, required: false },
  bio: { type: String, required: false },
  buffer: { type: Object, required: true },
  filename: { type: String, required: true },
});

export interface Profile {
  buffer: object;
  filename: string;
  userId: string;
  status: string | null;
  bio: string | null;
}
