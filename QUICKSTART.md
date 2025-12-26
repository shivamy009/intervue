# Quick Start Guide - Intervue Poll

## Prerequisites

Before running the application, ensure you have:
- Node.js (v16+) installed
- MongoDB installed and running

## Installing MongoDB (if not installed)

### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Ubuntu/Linux:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Windows:
Download from: https://www.mongodb.com/try/download/community

## Running the Application

### 1. Start MongoDB (if not running)
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Or manually
mongod --dbpath /path/to/data/directory
```

### 2. Start Backend Server
```bash
cd backend
npm install  # if not already done
npm start
```

Backend will run on: http://localhost:5000

### 3. Start Frontend
Open a new terminal:
```bash
cd frontend
npm install  # if not already done
npm run dev
```

Frontend will run on: http://localhost:5173

## Testing the Application

### As Teacher:
1. Open: http://localhost:5173
2. Click "I'm a Teacher"
3. Create a question with options
4. Set time limit
5. Click "Ask Question"
6. View live results as students answer

### As Student:
1. Open http://localhost:5173 in a new browser/tab
2. Click "I'm a Student"
3. Enter your name
4. Wait for teacher to ask a question
5. Select answer and submit
6. View results

## Testing State Recovery

1. Create a poll as teacher
2. Refresh the browser
3. You should see the same poll with current state
4. Students joining late will see correct remaining time

## Features to Test

✅ Teacher creates poll
✅ Student joins and answers
✅ Live results update
✅ Timer synchronization (join late)
✅ State recovery (refresh page)
✅ Chat functionality
✅ Kick student
✅ Poll history
✅ Race condition prevention (try voting twice)

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in `backend/.env`

**Socket Connection Failed:**
- Verify backend is running on port 5000
- Check `frontend/.env` has correct VITE_SOCKET_URL

**Port Already in Use:**
- Change PORT in `backend/.env`
- Update VITE_SOCKET_URL in `frontend/.env` accordingly

## Project Structure

```
intervue/
├── backend/          # Node.js + Express + Socket.io
├── frontend/         # React + Redux Toolkit
└── README.md         # Full documentation
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/intervue-poll
NODE_ENV=development
```

### Frontend (.env)
```
VITE_SOCKET_URL=http://localhost:5000
```

## Next Steps

- Deploy to cloud (Heroku, Railway, Render)
- Set up MongoDB Atlas for production database
- Add authentication
- Implement multiple rooms/sessions

Enjoy your resilient live polling system!
