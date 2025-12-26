import Message from '../models/Message.js';

class ChatService {
  // Save a chat message
  async saveMessage(senderName, senderRole, message) {
    try {
      const chatMessage = new Message({
        senderName,
        senderRole,
        message
      });

      await chatMessage.save();
      return chatMessage;
    } catch (error) {
      throw new Error(`Failed to save message: ${error.message}`);
    }
  }

  // Get all chat messages
  async getMessages(limit = 50) {
    try {
      const messages = await Message.find()
        .sort({ timestamp: -1 })
        .limit(limit);
      
      return messages.reverse();
    } catch (error) {
      throw new Error(`Failed to get messages: ${error.message}`);
    }
  }
}

export default new ChatService();
