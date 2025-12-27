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

Need Node 16+ and MongoDB.

**Backend:**

`.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/intervue-poll
```

```bash
cd backend
npm install
npm run dev
```

**Frontend:**

`.env`:
```
VITE_SOCKET_URL=http://localhost:5000
```

```bash
cd frontend
npm install
npm run dev
```

Open `localhost:5173`
