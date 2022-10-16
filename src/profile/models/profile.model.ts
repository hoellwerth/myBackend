import * as mongoose from 'mongoose';

export const ProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  status: { type: String, required: false },
  bio: { type: String, required: false },
});

export interface Profile {
  userId: string;
  status: string | null;
  bio: string | null;
}
