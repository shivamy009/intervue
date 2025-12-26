import Student from '../models/Student.js';

class StudentService {
  // Register a new student
  async registerStudent(name, socketId) {
    try {
      // Remove any existing student with this socket ID
      await Student.deleteMany({ socketId });

      const student = new Student({
        name,
        socketId,
        isActive: true
      });

      await student.save();
      return student;
    } catch (error) {
      throw new Error(`Failed to register student: ${error.message}`);
    }
  }

  // Get all active students
  async getActiveStudents() {
    try {
      const students = await Student.find({ isActive: true }).sort({ joinedAt: -1 });
      return students;
    } catch (error) {
      throw new Error(`Failed to get active students: ${error.message}`);
    }
  }

  // Kick out a student
  async kickStudent(socketId) {
    try {
      const student = await Student.findOneAndUpdate(
        { socketId },
        { isActive: false },
        { new: true }
      );
      return student;
    } catch (error) {
      throw new Error(`Failed to kick student: ${error.message}`);
    }
  }

  // Remove student on disconnect
  async removeStudent(socketId) {
    try {
      await Student.deleteOne({ socketId });
    } catch (error) {
      throw new Error(`Failed to remove student: ${error.message}`);
    }
  }

  // Get student by socket ID
  async getStudentBySocketId(socketId) {
    try {
      const student = await Student.findOne({ socketId });
      return student;
    } catch (error) {
      throw new Error(`Failed to get student: ${error.message}`);
    }
  }
}

export default new StudentService();
