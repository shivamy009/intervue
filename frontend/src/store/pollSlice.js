import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activePoll: null,
  pollHistory: [],
  results: null,
  loading: false,
  error: null
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setPoll: (state, action) => {
      state.activePoll = action.payload;
      state.error = null;
    },
    updatePollTimer: (state, action) => {
      if (state.activePoll) {
        state.activePoll.remainingTime = action.payload;
      }
    },
    setPollResults: (state, action) => {
      state.results = action.payload;
    },
    setPollHistory: (state, action) => {
      state.pollHistory = action.payload;
    },
    completePoll: (state, action) => {
      state.results = action.payload;
      if (state.activePoll) {
        state.activePoll.status = 'completed';
      }
    },
    clearPoll: (state) => {
      state.activePoll = null;
      state.results = null;
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
  setPoll,
  updatePollTimer,
  setPollResults,
  setPollHistory,
  completePoll,
  clearPoll,
  setLoading,
  setError
} = pollSlice.actions;

export default pollSlice.reducer;
