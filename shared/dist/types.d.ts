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
    requestRetention: number;
    maximumInterval: number;
    w: number[];
}
