import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import Word from './models/Word';
import Example from './models/Example';
import Video from './models/Video';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Add test data
const addTestData = async () => {
  try {
    // Create examples
    const examples = await Example.create([
      {
        text: 'the ephemeral nature of fashion',
        translation: '패션의 일시적인 특성'
      },
      {
        text: 'ephemeral spring flowers',
        translation: '잠시 동안만 피는 봄꽃들'
      }
    ]);

    // Create video
    const video = await Video.create({
      url: 'https://example.com/video1.mp4',
      title: 'Understanding Ephemeral',
      duration: 120
    });

    // Create word
    const word = await Word.create({
      word: 'ephemeral',
      meaning: 'lasting for a very short time',
      pronunciation: 'ɪˈfem(ə)rəl',
      partOfSpeech: 'adjective',
      level: 'advanced',
      examples: examples.map(ex => ex._id),
      videos: [video._id]
    });

    console.log('Test data added successfully:', word);
  } catch (error) {
    console.error('Error adding test data:', error);
  }
};

// Routes
import wordRoutes from './routes/wordRoutes';
import learningRecordRoutes from './routes/learningRecordRoutes';
import customSetRoutes from './routes/customSetRoutes';

app.use('/api/words', wordRoutes);
app.use('/api/learning-records', learningRecordRoutes);
app.use('/api/custom-sets', customSetRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Vocabulary App API' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  addTestData();
}); 