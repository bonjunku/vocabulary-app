import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningRecord extends Document {
  user: mongoose.Types.ObjectId;
  word: mongoose.Types.ObjectId;
  ease: number; // FSRS ease factor
  interval: number; // 다음 복습까지의 간격 (일)
  repetitions: number; // 복습 횟수
  lastReviewDate: Date;
  nextReviewDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LearningRecordSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  word: { type: Schema.Types.ObjectId, ref: 'Word', required: true },
  ease: { type: Number, required: true, default: 2.5 },
  interval: { type: Number, required: true, default: 0 },
  repetitions: { type: Number, required: true, default: 0 },
  lastReviewDate: { type: Date },
  nextReviewDate: { type: Date, required: true },
}, {
  timestamps: true
});

// 복합 인덱스 생성
LearningRecordSchema.index({ user: 1, word: 1 }, { unique: true });

export default mongoose.model<ILearningRecord>('LearningRecord', LearningRecordSchema); 