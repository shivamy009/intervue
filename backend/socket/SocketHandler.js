import PollService from '../services/PollService.js';
import StudentService from '../services/StudentService.js';
import ChatService from '../services/ChatService.js';

class SocketHandler {
  constructor(io) {
    this.io = io;
    this.teacherSocket = null;
    this.pollTimers = new Map();
  }

  initialize() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Teacher joins
      socket.on('teacher:join', async () => {
        try {
          this.teacherSocket = socket;
          socket.join('teacher');
          
          // Send current state
          const activePoll = await PollService.getActivePoll();
          const students = await StudentService.getActiveStudents();
          
          socket.emit('teacher:state', {
            activePoll,
            students
          });

          console.log('Teacher joined');
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      // Student joins
      socket.on('student:join', async (data) => {
        try {
          const { name } = data;
          
          // Register student
          const student = await StudentService.registerStudent(name, socket.id);
          socket.join('students');
          
          // Send current state
          const activePoll = await PollService.getActivePoll();
          
          socket.emit('student:registered', { student });
          
          if (activePoll) {
            socket.emit('poll:question', {
              poll: activePoll,
              remainingTime: activePoll.remainingTime
            });
          }

          // Notify teacher about new student
          const students = await StudentService.getActiveStudents();
          this.io.to('teacher').emit('students:updated', students);

          console.log('Student joined:', name);
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      // Teacher creates a poll
      socket.on('poll:create', async (data) => {
        try {
          const { question, options, timeLimit } = data;
          
          // Check if this is a request to create new poll (empty object)
          if (!question) {
            // Clear active poll to show create form
            socket.emit('poll:created', { poll: null });
            return;
          }
          
          // Create poll in database
          const poll = await PollService.createPoll(question, options, timeLimit);
          
          // Broadcast to all students
          this.io.to('students').emit('poll:question', {
            poll: poll.toObject(),
            remainingTime: timeLimit
          });

          // Send confirmation to teacher
          socket.emit('poll:created', { poll: poll.toObject() });

          // Start timer
          this.startPollTimer(poll._id, timeLimit);

          console.log('Poll created:', poll._id);
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      // Student submits vote
      socket.on('vote:submit', async (data) => {
        try {
          const { pollId, selectedOption } = data;
          const student = await StudentService.getStudentBySocketId(socket.id);
          
          if (!student) {
            throw new Error('Student not found');
          }

          // Submit vote
          await PollService.submitVote(pollId, student.name, socket.id, selectedOption);

          // Get updated results
          const results = await PollService.getPollResults(pollId);

          // Send results to student
          socket.emit('vote:submitted', { results });

          // Broadcast live results to teacher
          this.io.to('teacher').emit('poll:results', results);

          // Check if all students answered
          const allAnswered = await PollService.checkAllStudentsAnswered(pollId);
          if (allAnswered) {
            this.completePoll(pollId);
          }

          console.log('Vote submitted:', student.name, selectedOption);
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      // Teacher kicks a student
      socket.on('student:kick', async (data) => {
        try {
          const { socketId } = data;
          
          await StudentService.kickStudent(socketId);
          
          // Notify the kicked student
          this.io.to(socketId).emit('student:kicked');
          
          // Update students list for teacher
          const students = await StudentService.getActiveStudents();
          this.io.to('teacher').emit('students:updated', students);

          console.log('Student kicked:', socketId);
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      // Chat message
      socket.on('chat:message', async (data) => {
        try {
          const { senderName, senderRole, message } = data;
          
          // Save message to database
          const chatMessage = await ChatService.saveMessage(senderName, senderRole, message);
          
          // Broadcast to all clients
          this.io.emit('chat:message', chatMessage);

          console.log('Chat message:', senderName, message);
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      // Get chat history
      socket.on('chat:history', async () => {
        try {
          const messages = await ChatService.getMessages();
          socket.emit('chat:history', messages);
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      // Get poll history
      socket.on('poll:history', async () => {
        try {
          const polls = await PollService.getPollHistory();
          socket.emit('poll:history', polls);
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      // Disconnect
      socket.on('disconnect', async () => {
        try {
          // Remove student if it was a student
          await StudentService.removeStudent(socket.id);
          
          // Update students list for teacher
          const students = await StudentService.getActiveStudents();
          this.io.to('teacher').emit('students:updated', students);

          console.log('Client disconnected:', socket.id);
        } catch (error) {
          console.error('Error on disconnect:', error);
        }
      });
    });
  }

  startPollTimer(pollId, timeLimit) {
    // Clear existing timer if any
    if (this.pollTimers.has(pollId.toString())) {
      clearTimeout(this.pollTimers.get(pollId.toString()));
    }

    // Set new timer
    const timer = setTimeout(async () => {
      await this.completePoll(pollId);
    }, timeLimit * 1000);

    this.pollTimers.set(pollId.toString(), timer);
  }

  async completePoll(pollId) {
    try {
      // Complete the poll
      await PollService.completePoll(pollId);

      // Get final results
      const results = await PollService.getPollResults(pollId);

      // Broadcast results to everyone
      this.io.emit('poll:completed', results);

      // Clear timer
      if (this.pollTimers.has(pollId.toString())) {
        clearTimeout(this.pollTimers.get(pollId.toString()));
        this.pollTimers.delete(pollId.toString());
      }

      console.log('Poll completed:', pollId);
    } catch (error) {
      console.error('Error completing poll:', error);
    }
  }
}

export default SocketHandler;
