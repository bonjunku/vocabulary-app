import { Request, Response } from 'express';
import LearningRecord from '../models/LearningRecord';
import { FSRS, DEFAULT_CONFIG, Rating } from '../../../shared/dist';

const fsrs = new FSRS(DEFAULT_CONFIG);

export const getLearningRecord = async (req: Request, res: Response) => {
  try {
    const record = await LearningRecord.findOne({
      user: req.params.userId,
      word: req.params.wordId
    });
    
    if (!record) {
      return res.status(404).json({ message: 'Learning record not found' });
    }
    
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching learning record', error });
  }
};

export const updateLearningRecord = async (req: Request, res: Response) => {
  try {
    const { rating } = req.body;
    const reviewDate = new Date();
    
    // Get current learning record
    let record = await LearningRecord.findOne({
      user: req.params.userId,
      word: req.params.wordId
    });
    
    // Convert to FSRS state if record exists
    const currentState = record ? {
      stability: record.ease,
      difficulty: 0, // Not stored in our model
      elapsedDays: Math.floor((reviewDate.getTime() - record.lastReviewDate.getTime()) / (1000 * 60 * 60 * 24)),
      scheduledDays: record.interval,
      reps: record.repetitions,
      lapses: 0, // Not stored in our model
      lastReview: record.lastReviewDate,
      nextReview: record.nextReviewDate
    } : null;
    
    // Update with FSRS
    const result = fsrs.review(currentState, rating as Rating, reviewDate);
    
    // Update or create learning record
    record = await LearningRecord.findOneAndUpdate(
      {
        user: req.params.userId,
        word: req.params.wordId
      },
      {
        ease: result.state.stability,
        interval: result.state.scheduledDays,
        repetitions: result.state.reps,
        lastReviewDate: result.state.lastReview,
        nextReviewDate: result.state.nextReview
      },
      { upsert: true, new: true }
    );
    
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error updating learning record', error });
  }
};

export const getDueWords = async (req: Request, res: Response) => {
  try {
    const records = await LearningRecord.find({
      user: req.params.userId,
      nextReviewDate: { $lte: new Date() }
    }).populate('word');
    
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching due words', error });
  }
};

// Get all learning records
export const getAllLearningRecords = async (req: Request, res: Response) => {
  try {
    const records = await LearningRecord.find()
      .populate('wordId')
      .populate('userId');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching learning records', error });
  }
}; 