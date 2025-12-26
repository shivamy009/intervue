import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: true
  },
  senderRole: {
    type: String,
    enum: ['teacher', 'student'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
