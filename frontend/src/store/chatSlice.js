import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  isOpen: false,
  unreadCount: 0
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      if (!state.isOpen) {
        state.unreadCount += 1;
      }
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
      if (state.isOpen) {
        state.unreadCount = 0;
      }
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    clearUnread: (state) => {
      state.unreadCount = 0;
    }
  }
});

export const {
  addMessage,
  setMessages,
  toggleChat,
  closeChat,
  clearUnread
} = chatSlice.actions;

export default chatSlice.reducer;
