import { Router } from 'express';
import {
  getAllWords,
  getWord,
  getRandomWord,
  createWord,
  updateWord,
  deleteWord
} from '../controllers/wordController';

const router = Router();

// Get all words
router.get('/', getAllWords);

// Get a specific word
router.get('/:id', getWord);

// Get a random word
router.get('/random', getRandomWord);

// Create a new word
router.post('/', createWord);

// Update a word
router.put('/:id', updateWord);

// Delete a word
router.delete('/:id', deleteWord);

export default router; 