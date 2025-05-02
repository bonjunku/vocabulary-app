import { Router } from 'express';
import {
  getCustomSets,
  createCustomSet,
  updateCustomSet,
  deleteCustomSet
} from '../controllers/customSetController';

const router = Router();

// Get all custom sets for a user
router.get('/:userId', getCustomSets);

// Create a new custom set
router.post('/', createCustomSet);

// Update a custom set
router.put('/:id', updateCustomSet);

// Delete a custom set
router.delete('/:id', deleteCustomSet);

export default router; 