import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  authority: { type: Number, required: true },
  permissions: { type: Array, required: true },
  role: { type: String || Object, required: true },
  token: { type: String, required: false },
  bio: { type: String, required: false },
  status: { type: String, required: false },
});

export interface User {
  username: string;
  email: string;
  password: string;
  authority: number;
  permissions: string[];
  role: string;
  token: string | null;
  bio: string | null;
  status: string | null;
}
