# Resilient Live Polling System

A real-time polling system with Teacher and Student personas, built with resilient state recovery and synchronized timers.

## Features

### Core Features
- **Teacher Persona**: Create polls, view live results, manage students, view poll history
- **Student Persona**: Join sessions, submit answers, view results in real-time
- **Real-time Communication**: Socket.io for instant updates
- **State Recovery**: Resilient system that recovers state on page refresh
- **Timer Synchronization**: Students joining late get correct remaining time
- **Race Condition Protection**: Students can't vote multiple times
- **Chat Feature**: Real-time chat between teachers and students

### Technical Implementation
- **Frontend**: React.js with Redux Toolkit for state management
- **Backend**: Node.js with Express and Socket.io
- **Database**: MongoDB for persistence
- **Architecture**: Clean separation of concerns with Controller-Service pattern

## Tech Stack

- **Frontend**: React, Redux Toolkit, Socket.io Client, React Router
- **Backend**: Node.js, Express, Socket.io, Mongoose
- **Database**: MongoDB
- **Styling**: Custom CSS with responsive design

## Project Structure

```
intervue/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── Poll.js
│   │   ├── Vote.js
│   │   ├── Student.js
│   │   └── Message.js
│   ├── services/
│   │   ├── PollService.js
│   │   ├── StudentService.js
│   │   └── ChatService.js
│   ├── socket/
│   │   └── SocketHandler.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Button.jsx
    │   │   ├── Card.jsx
    │   │   ├── Badge.jsx
    │   │   ├── Timer.jsx
    │   │   └── ChatPopup.jsx
    │   ├── hooks/
    │   │   ├── useSocket.js
    │   │   └── usePollTimer.js
    │   ├── pages/
    │   │   ├── RoleSelection/
    │   │   ├── Teacher/
    │   │   └── Student/
    │   ├── store/
    │   │   ├── pollSlice.js
    │   │   ├── teacherSlice.js
    │   │   ├── studentSlice.js
    │   │   ├── chatSlice.js
    │   │   └── store.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB installed and running locally
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (already created):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/intervue-poll
NODE_ENV=development
```

4. Make sure MongoDB is running:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# Or start manually
mongod --dbpath /path/to/your/data/directory
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (already created):
```env
VITE_SOCKET_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

### For Teachers

1. Open the app in your browser: `http://localhost:5173`
2. Select "I'm a Teacher"
3. Create a poll with question and options
4. Set the time limit (30-120 seconds)
5. Mark the correct answer
6. Click "Ask Question" to start the poll
7. View live results as students submit answers
8. View participants and kick students if needed
9. View poll history to see past results

### For Students

1. Open the app in a different browser/tab: `http://localhost:5173`
2. Select "I'm a Student"
3. Enter your name
4. Wait for teacher to ask a question
5. Select your answer and submit within the time limit
6. View results after submission
7. Wait for the next question

### Chat Feature

- Click the chat button (💬) in the bottom right
- Send messages to communicate
- Works for both teachers and students

## Key Features Explained

### State Recovery
If you refresh the page during an active poll:
- **Teacher**: Will see the current poll state and live results
- **Student**: Will see the current question with correct remaining time

### Timer Synchronization
- If a student joins 20 seconds into a 60-second poll, they will see 40 seconds remaining
- Timer is synchronized with the server time, not client time
- Prevents time manipulation

### Race Condition Protection
- Database-level unique constraint prevents duplicate votes
- Even if a student tries to submit multiple times, only the first vote counts

### Resilience
- Application recovers from temporary disconnections
- State is persisted in MongoDB
- Server is the source of truth for all data

## API Events (Socket.io)

### Teacher Events
- `teacher:join` - Join as teacher
- `poll:create` - Create a new poll
- `student:kick` - Remove a student
- `poll:history` - Get poll history

### Student Events
- `student:join` - Join as student with name
- `vote:submit` - Submit vote for a poll

### Common Events
- `chat:message` - Send a chat message
- `chat:history` - Get chat history
- `poll:completed` - Emitted when poll completes
- `error` - Error notifications

## Architecture Highlights

### Backend
- **Service Layer**: Business logic separated from Socket handlers
- **Models**: Mongoose schemas for data persistence
- **Socket Handler**: Manages all real-time communication
- **Database**: MongoDB for persistent storage

### Frontend
- **Redux Toolkit**: Centralized state management
- **Custom Hooks**: `useSocket` for Socket.io, `usePollTimer` for synchronized timing
- **Component-based**: Reusable UI components
- **Responsive Design**: Works on desktop and mobile

## Development Notes

- The system uses **MongoDB** for persistence - make sure it's running
- Socket.io handles all real-time communication
- Redux Toolkit manages application state
- Custom hooks encapsulate complex logic
- Clean separation of concerns throughout

## Troubleshooting

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running: `brew services list`
   - Check the MONGODB_URI in `.env`

2. **Socket Connection Issues**:
   - Verify backend is running on port 5000
   - Check VITE_SOCKET_URL in frontend `.env`
   - Check browser console for connection errors

3. **Port Already in Use**:
   - Change PORT in backend `.env`
   - Update VITE_SOCKET_URL in frontend `.env`

## Future Enhancements

- User authentication
- Multiple rooms/sessions
- Export poll results
- Advanced analytics
- Mobile app
- Deployment guides

## License

ISC
