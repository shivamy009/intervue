import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  isRegistered: false,
  hasVoted: false,
  isKicked: false,
  selectedOption: null,
  loading: false,
  error: null
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudentName: (state, action) => {
      state.name = action.payload;
    },
    setRegistered: (state, action) => {
      state.isRegistered = action.payload;
    },
    setVoted: (state, action) => {
      state.hasVoted = action.payload;
    },
    setKicked: (state, action) => {
      state.isKicked = action.payload;
    },
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
    },
    resetStudent: (state) => {
      state.hasVoted = false;
      state.selectedOption = null;
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
  setStudentName,
  setRegistered,
  setVoted,
  setKicked,
  setSelectedOption,
  resetStudent,
  setLoading,
  setError
} = studentSlice.actions;

export default studentSlice.reducer;
