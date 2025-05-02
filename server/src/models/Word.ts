import mongoose, { Schema, Document } from 'mongoose';

export interface IWord extends Document {
  word: string;
  meaning: string;
  pronunciation?: string;
  partOfSpeech: string;
  level: string; // 단어 난이도 (beginner, intermediate, advanced)
  examples: mongoose.Types.ObjectId[]; // 예문 참조
  videos: mongoose.Types.ObjectId[]; // 동영상 참조
  createdAt: Date;
  updatedAt: Date;
}

const WordSchema: Schema = new Schema({
  word: { type: String, required: true, unique: true },
  meaning: { type: String, required: true },
  pronunciation: { type: String },
  partOfSpeech: { type: String, required: true },
  level: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  examples: [{ type: Schema.Types.ObjectId, ref: 'Example' }],
  videos: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
}, {
  timestamps: true
});

export default mongoose.model<IWord>('Word', WordSchema); 