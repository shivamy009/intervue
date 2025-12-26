import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  socketId: {
    type: String,
    required: true
  },
  selectedOption: {
    type: Number,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure a student can vote only once per poll
voteSchema.index({ pollId: 1, socketId: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;
