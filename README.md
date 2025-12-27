# Live Polling System

A simple real-time polling app for classrooms. Teachers create polls, students answer them, everyone sees results live.

Built this to handle the annoying edge cases - like what happens when someone refreshes mid-poll, or joins late, or tries to vote twice. It actually works.

## What it does

**Teachers can:**
- Create timed polls (30-120 sec)
- See votes come in live
- Kick troublemakers
- Check poll history
- Chat with everyone

**Students can:**
- Join with just a name
- Answer before time runs out
- See results after voting
- Chat

The cool part: if you refresh during a poll, you don't lose anything. Students who join late see the correct time remaining (synced with server, not their clock). And the database prevents double-voting even if someone mashes the submit button.

## Stack

- React + Redux Toolkit (frontend)
- Node/Express + Socket.io (backend)
- MongoDB (persistence)

## Running it locally

You'll need Node 16+ and MongoDB running.

**Backend:**
```bash
cd backend
npm install
```

Create `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/intervue-poll
NODE_ENV=development
```

Start MongoDB if it's not running:
```bash
brew services start mongodb-community
```

Then:
```bash
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
```

Create `.env`:
```
VITE_SOCKET_URL=http://localhost:5000
```

Then:
```bash
npm run dev
```

Backend runs on `localhost:5000`, frontend on `localhost:5173`.

## How to use

**As a teacher:**
1. Go to `localhost:5173`
2. Pick "I'm a Teacher"
3. Create a poll - add question, options, set time, pick correct answer
4. Hit "Ask Question"
5. Watch the votes roll in

**As a student:**
1. Open in another tab/browser
2. Pick "I'm a Student"
3. Enter your name
4. Wait for a question, answer it, see results

Chat button is in the bottom right corner (💬).

## Project layout

```
backend/
  server.js          - entry point
  config/database.js - mongo connection
  models/            - Poll, Vote, Student, Message schemas
  services/          - business logic
  socket/            - socket.io handlers

frontend/
  src/
    components/      - Button, Card, Timer, ChatPopup, etc
    hooks/           - useSocket, usePollTimer
    pages/           - Teacher/, Student/, RoleSelection/
    store/           - redux slices
```

## Socket events (if you're curious)

Teacher stuff: `teacher:join`, `poll:create`, `student:kick`, `poll:history`

Student stuff: `student:join`, `vote:submit`

Both: `chat:message`, `chat:history`, `poll:completed`, `error`

## Common issues

**Can't connect to MongoDB?**
- Check if it's running: `brew services list`
- Double check your MONGODB_URI

**Socket won't connect?**
- Is the backend actually running on 5000?
- Check VITE_SOCKET_URL in frontend .env
- Look at browser console

**Port in use?**
- Change PORT in backend .env
- Update VITE_SOCKET_URL to match

## Maybe later

- Actual auth
- Multiple classrooms
- Export results to CSV or something
- Better analytics
- Mobile app?

---

ISC License
