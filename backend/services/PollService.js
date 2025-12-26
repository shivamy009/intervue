import Poll from '../models/Poll.js';
import Vote from '../models/Vote.js';
import Student from '../models/Student.js';

class PollService {
  // Create a new poll
  async createPoll(question, options, timeLimit = 60) {
    try {
      const poll = new Poll({
        question,
        options: options.map((opt, index) => ({
          text: opt.text,
          isCorrect: opt.isCorrect || index === opt.correctIndex
        })),
        timeLimit,
        status: 'active',
        startedAt: new Date()
      });

      await poll.save();
      return poll;
    } catch (error) {
      throw new Error(`Failed to create poll: ${error.message}`);
    }
  }

  // Get active poll with remaining time
  async getActivePoll() {
    try {
      const poll = await Poll.findOne({ status: 'active' }).sort({ startedAt: -1 });
      
      if (!poll) {
        return null;
      }

      const elapsed = Math.floor((Date.now() - poll.startedAt.getTime()) / 1000);
      const remainingTime = Math.max(0, poll.timeLimit - elapsed);

      return {
        ...poll.toObject(),
        remainingTime,
        elapsed
      };
    } catch (error) {
      throw new Error(`Failed to get active poll: ${error.message}`);
    }
  }

  // Get all polls with results
  async getPollHistory() {
    try {
      const polls = await Poll.find().sort({ createdAt: -1 });
      
      const pollsWithResults = await Promise.all(
        polls.map(async (poll) => {
          const votes = await Vote.find({ pollId: poll._id });
          const totalVotes = votes.length;
          
          const results = poll.options.map((option, index) => {
            const optionVotes = votes.filter(v => v.selectedOption === index).length;
            return {
              text: option.text,
              votes: optionVotes,
              percentage: totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0
            };
          });

          return {
            ...poll.toObject(),
            totalVotes,
            results
          };
        })
      );

      return pollsWithResults;
    } catch (error) {
      throw new Error(`Failed to get poll history: ${error.message}`);
    }
  }

  // Submit a vote
  async submitVote(pollId, studentName, socketId, selectedOption) {
    try {
      // Check if poll exists and is active
      const poll = await Poll.findById(pollId);
      if (!poll) {
        throw new Error('Poll not found');
      }

      // Check if time limit exceeded
      const elapsed = Math.floor((Date.now() - poll.startedAt.getTime()) / 1000);
      if (elapsed > poll.timeLimit) {
        throw new Error('Time limit exceeded');
      }

      // Check if student already voted (race condition protection)
      const existingVote = await Vote.findOne({ pollId, socketId });
      if (existingVote) {
        throw new Error('Already voted');
      }

      const vote = new Vote({
        pollId,
        studentName,
        socketId,
        selectedOption
      });

      await vote.save();
      return vote;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Already voted');
      }
      throw error;
    }
  }

  // Get live poll results
  async getPollResults(pollId) {
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) {
        throw new Error('Poll not found');
      }

      const votes = await Vote.find({ pollId });
      const totalVotes = votes.length;

      const results = poll.options.map((option, index) => {
        const optionVotes = votes.filter(v => v.selectedOption === index).length;
        return {
          text: option.text,
          votes: optionVotes,
          percentage: totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0
        };
      });

      return {
        question: poll.question,
        totalVotes,
        results
      };
    } catch (error) {
      throw new Error(`Failed to get poll results: ${error.message}`);
    }
  }

  // Complete a poll
  async completePoll(pollId) {
    try {
      const poll = await Poll.findByIdAndUpdate(
        pollId,
        { status: 'completed', completedAt: new Date() },
        { new: true }
      );
      return poll;
    } catch (error) {
      throw new Error(`Failed to complete poll: ${error.message}`);
    }
  }

  // Check if all students have answered
  async checkAllStudentsAnswered(pollId) {
    try {
      const activeStudents = await Student.countDocuments({ isActive: true });
      const votes = await Vote.countDocuments({ pollId });
      
      return activeStudents > 0 && votes >= activeStudents;
    } catch (error) {
      throw new Error(`Failed to check students: ${error.message}`);
    }
  }
}

export default new PollService();
