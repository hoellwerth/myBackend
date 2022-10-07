import * as mongoose from 'mongoose';

export const SaltSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  salt: { type: String, required: true },
});

export interface Salt {
  userId: string;
  salt: string;
}
