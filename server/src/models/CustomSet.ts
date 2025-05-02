import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomSet extends Document {
  name: string;
  description?: string;
  words: mongoose.Types.ObjectId[];
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CustomSetSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  words: [{ type: Schema.Types.ObjectId, ref: 'Word' }],
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

export default mongoose.model<ICustomSet>('CustomSet', CustomSetSchema); 