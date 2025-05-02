import { Router } from 'express';
import {
  getLearningRecord,
  updateLearningRecord,
  getDueWords,
  getAllLearningRecords
} from '../controllers/learningRecordController';

const router = Router();

// Get all learning records
router.get('/', getAllLearningRecords);

// Get learning record for a specific word and user
router.get('/:userId/:wordId', getLearningRecord);

// Update learning record
router.post('/:userId/:wordId', updateLearningRecord);

// Get due words for a user
router.get('/:userId/due', getDueWords);

export default router; 