"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FSRS = void 0;
class FSRS {
    constructor(config) {
        this.config = config;
    }
    initState() {
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
    getRetrievability(state) {
        return Math.exp(Math.log(0.9) * state.elapsedDays / state.stability);
    }
    getNextInterval(state) {
        const retrievability = this.getRetrievability(state);
        const nextInterval = state.stability * Math.log(this.config.requestRetention) / Math.log(retrievability);
        return Math.min(Math.max(Math.round(nextInterval), 1), this.config.maximumInterval);
    }
    updateState(state, rating) {
        const w = this.config.w;
        const newState = Object.assign({}, state);
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
    review(state, rating, reviewDate) {
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
exports.FSRS = FSRS;
