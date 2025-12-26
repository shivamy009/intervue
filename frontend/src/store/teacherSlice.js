import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  students: [],
  loading: false,
  error: null
};

const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    addStudent: (state, action) => {
      const exists = state.students.find(s => s.socketId === action.payload.socketId);
      if (!exists) {
        state.students.push(action.payload);
      }
    },
    removeStudent: (state, action) => {
      state.students = state.students.filter(s => s.socketId !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  setStudents,
  addStudent,
  removeStudent,
  setLoading,
  setError
} = teacherSlice.actions;

export default teacherSlice.reducer;
