import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  learningRecords: mongoose.Types.ObjectId[]; // 학습 기록 참조
  customSets: mongoose.Types.ObjectId[]; // 커스텀 단어 세트 참조
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  learningRecords: [{ type: Schema.Types.ObjectId, ref: 'LearningRecord' }],
  customSets: [{ type: Schema.Types.ObjectId, ref: 'CustomSet' }],
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema); 