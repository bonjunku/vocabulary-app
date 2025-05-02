import { Request, Response } from 'express';
import CustomSet from '../models/CustomSet';

export const getCustomSets = async (req: Request, res: Response) => {
  try {
    const customSets = await CustomSet.find({ user: req.params.userId })
      .populate('words');
    res.json(customSets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching custom sets', error });
  }
};

export const createCustomSet = async (req: Request, res: Response) => {
  try {
    const { name, description, words, user } = req.body;
    const customSet = await CustomSet.create({
      name,
      description,
      words,
      user
    });
    res.status(201).json(customSet);
  } catch (error) {
    res.status(500).json({ message: 'Error creating custom set', error });
  }
};

export const updateCustomSet = async (req: Request, res: Response) => {
  try {
    const customSet = await CustomSet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('words');
    
    if (!customSet) {
      return res.status(404).json({ message: 'Custom set not found' });
    }
    
    res.json(customSet);
  } catch (error) {
    res.status(500).json({ message: 'Error updating custom set', error });
  }
};

export const deleteCustomSet = async (req: Request, res: Response) => {
  try {
    const customSet = await CustomSet.findById(req.params.id);
    
    if (!customSet) {
      return res.status(404).json({ message: 'Custom set not found' });
    }
    
    await customSet.deleteOne();
    res.json({ message: 'Custom set deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting custom set', error });
  }
}; 