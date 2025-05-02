import { Rating, FSRSState, FSRSResult, FSRSConfig } from './types';
export declare class FSRS {
    private config;
    constructor(config: FSRSConfig);
    private initState;
    private getRetrievability;
    private getNextInterval;
    private updateState;
    review(state: FSRSState | null, rating: Rating, reviewDate: Date): FSRSResult;
}
