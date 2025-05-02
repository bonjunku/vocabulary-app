export type Rating = 'again' | 'hard' | 'good' | 'easy';

export interface FSRSState {
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  lastReview: Date;
  nextReview: Date;
}

export interface FSRSResult {
  state: FSRSState;
  rating: Rating;
  reviewDate: Date;
}

export interface FSRSConfig {
  requestRetention: number; // 목표 기억률 (0-1)
  maximumInterval: number; // 최대 간격 (일)
  w: number[]; // 가중치 파라미터
} 