import { Rating, FSRSState, FSRSResult, FSRSConfig } from './types';

export class FSRS {
  private config: FSRSConfig;

  constructor(config: FSRSConfig) {
    this.config = config;
  }

  private initState(): FSRSState {
    return {
      stability: 0,
      difficulty: 0,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 0,
      lapses: 0,
      lastReview: new Date(),
      nextReview: new Date(),
    };
  }

  private getRetrievability(state: FSRSState): number {
    return Math.exp(Math.log(0.9) * state.elapsedDays / state.stability);
  }

  private getNextInterval(state: FSRSState): number {
    const retrievability = this.getRetrievability(state);
    const nextInterval = state.stability * Math.log(this.config.requestRetention) / Math.log(retrievability);
    return Math.min(Math.max(Math.round(nextInterval), 1), this.config.maximumInterval);
  }

  private updateState(state: FSRSState, rating: Rating): FSRSState {
    const w = this.config.w;
    const newState = { ...state };

    switch (rating) {
      case 'again':
        newState.lapses += 1;
        newState.reps = 0;
        newState.stability = w[0];
        newState.difficulty = Math.min(Math.max(state.difficulty + w[1], 1), 10);
        break;
      case 'hard':
        newState.reps += 1;
        newState.stability = state.stability * w[2];
        newState.difficulty = Math.min(Math.max(state.difficulty + w[3], 1), 10);
        break;
      case 'good':
        newState.reps += 1;
        newState.stability = state.stability * w[4];
        newState.difficulty = Math.min(Math.max(state.difficulty + w[5], 1), 10);
        break;
      case 'easy':
        newState.reps += 1;
        newState.stability = state.stability * w[6];
        newState.difficulty = Math.min(Math.max(state.difficulty + w[7], 1), 10);
        break;
    }

    return newState;
  }

  public review(state: FSRSState | null, rating: Rating, reviewDate: Date): FSRSResult {
    const currentState = state || this.initState();
    const newState = this.updateState(currentState, rating);
    
    newState.lastReview = reviewDate;
    newState.elapsedDays = Math.max(0, Math.floor((reviewDate.getTime() - currentState.lastReview.getTime()) / (1000 * 60 * 60 * 24)));
    newState.scheduledDays = this.getNextInterval(newState);
    
    const nextReview = new Date(reviewDate);
    nextReview.setDate(nextReview.getDate() + newState.scheduledDays);
    newState.nextReview = nextReview;

    return {
      state: newState,
      rating,
      reviewDate,
    };
  }
} 