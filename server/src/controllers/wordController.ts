import { Request, Response } from 'express';
import Word from '../models/Word';
import Example from '../models/Example';
import Video from '../models/Video';

export const getWord = async (req: Request, res: Response) => {
  try {
    const word = await Word.findById(req.params.id)
      .populate('examples')
      .populate('videos');
    
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }
    
    res.json(word);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching word', error });
  }
};

export const getRandomWord = async (req: Request, res: Response) => {
  try {
    const count = await Word.countDocuments();
    const random = Math.floor(Math.random() * count);
    const word = await Word.findOne().skip(random)
      .populate('examples')
      .populate('videos');
    
    res.json(word);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching random word', error });
  }
};

export const createWord = async (req: Request, res: Response) => {
  try {
    const { word, meaning, pronunciation, partOfSpeech, level, examples, videos } = req.body;
    
    // Create examples
    const exampleDocs = await Example.create(examples);
    const exampleIds = Array.isArray(exampleDocs) 
      ? exampleDocs.map(doc => doc._id)
      : [exampleDocs._id];
    
    // Create videos
    const videoDocs = await Video.create(videos);
    const videoIds = Array.isArray(videoDocs)
      ? videoDocs.map(doc => doc._id)
      : [videoDocs._id];
    
    // Create word
    const newWord = await Word.create({
      word,
      meaning,
      pronunciation,
      partOfSpeech,
      level,
      examples: exampleIds,
      videos: videoIds
    });
    
    res.status(201).json(newWord);
  } catch (error) {
    res.status(500).json({ message: 'Error creating word', error });
  }
};

export const updateWord = async (req: Request, res: Response) => {
  try {
    const word = await Word.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('examples').populate('videos');
    
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }
    
    res.json(word);
  } catch (error) {
    res.status(500).json({ message: 'Error updating word', error });
  }
};

export const deleteWord = async (req: Request, res: Response) => {
  try {
    const word = await Word.findById(req.params.id);
    
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }
    
    // Delete associated examples and videos
    await Example.deleteMany({ _id: { $in: word.examples } });
    await Video.deleteMany({ _id: { $in: word.videos } });
    
    await word.deleteOne();
    
    res.json({ message: 'Word deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting word', error });
  }
};

export const getAllWords = async (req: Request, res: Response) => {
  try {
    const words = await Word.find()
      .populate('examples')
      .populate('videos');
    res.json(words);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching words', error });
  }
}; 