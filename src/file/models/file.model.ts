import * as mongoose from 'mongoose';

export const FileSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  buffer: { type: Object, required: true },
  filename: { type: String, required: true },
});

export interface File {
  userId: string;
  buffer: object;
  filename: string;
}
