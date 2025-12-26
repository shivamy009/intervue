import { configureStore } from '@reduxjs/toolkit';
import pollReducer from './pollSlice';
import teacherReducer from './teacherSlice';
import studentReducer from './studentSlice';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    poll: pollReducer,
    teacher: teacherReducer,
    student: studentReducer,
    chat: chatReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;
