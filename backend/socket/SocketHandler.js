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
          
          // Only send active poll if it's actually active
          if (activePoll && activePoll.status === 'active') {
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
          
          // Check if this is a request to show create form (empty object)
          if (!question) {
            // Check if we can create a new poll
            const activePoll = await PollService.getActivePoll();
            
            if (activePoll) {
              // Check if all students have answered
              const allAnswered = await PollService.checkAllStudentsAnswered(activePoll._id);
              
              if (!allAnswered) {
                socket.emit('error', { message: 'Cannot create new poll: Current poll is still active and not all students have answered' });
                return;
              }
              
              // Complete the current poll first
              await this.completePoll(activePoll._id);
            }
            
            // Tell teacher to clear and show create form
            this.io.to('teacher').emit('poll:cleared');
            // Also tell students to clear and wait
            this.io.to('students').emit('poll:cleared');
            return;
          }
          
          // Validate that no active poll exists
          const existingPoll = await PollService.getActivePoll();
          if (existingPoll) {
            const allAnswered = await PollService.checkAllStudentsAnswered(existingPoll._id);
            if (!allAnswered) {
              socket.emit('error', { message: 'Cannot create new poll: Current poll is still active and not all students have answered' });
              return;
            }
            // Complete existing poll first
            await this.completePoll(existingPoll._id);
          }
          
          // Create poll in database
          const poll = await PollService.createPoll(question, options, timeLimit);
          const pollObj = poll.toObject();
          
          console.log('Broadcasting new poll to students:', pollObj._id);
          
          // First clear any previous poll state
          this.io.to('teacher').emit('poll:cleared');
          this.io.to('students').emit('poll:cleared');
          
          // Then broadcast new poll to all students
          this.io.to('students').emit('poll:question', {
            poll: pollObj,
            remainingTime: timeLimit
          });

          console.log('Sending poll confirmation to teacher');
          
          // Send confirmation to teacher with full poll object
          this.io.to('teacher').emit('poll:created', { poll: pollObj });

          // Start timer
          this.startPollTimer(poll._id, timeLimit);

          console.log('Poll created and broadcast successfully:', poll._id);
        } catch (error) {
          console.error('Poll creation error:', error);
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
      console.log('Completing poll:', pollId);
      
      // Complete the poll
      await PollService.completePoll(pollId);

      // Get final results
      const results = await PollService.getPollResults(pollId);

      // Broadcast results to everyone
      this.io.emit('poll:completed', results);

      // Clear the active poll state for everyone after a delay to show results
      setTimeout(() => {
        console.log('Clearing completed poll from client state');
        this.io.emit('poll:cleared');
      }, 2000);

      // Clear timer
      if (this.pollTimers.has(pollId.toString())) {
        clearTimeout(this.pollTimers.get(pollId.toString()));
        this.pollTimers.delete(pollId.toString());
      }

      console.log('Poll completed successfully:', pollId);
    } catch (error) {
      console.error('Error completing poll:', error);
    }
  }
}

export default SocketHandler;
