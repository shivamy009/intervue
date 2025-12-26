import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    default: false
  }
});

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [optionSchema],
  timeLimit: {
    type: Number,
    default: 60
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'draft'],
    default: 'active'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  createdBy: {
    type: String,
    default: 'teacher'
  }
}, {
  timestamps: true
});

const Poll = mongoose.model('Poll', pollSchema);

export default Poll;
