import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  translation: {
    type: String,
    required: true
  }
});

const Example = mongoose.model('Example', exampleSchema);

export default Example; 