# AI Chatbot Search Platform

A simple MERN-style AI chatbot that answers questions using OpenAI and cites Wikipedia sources.

## Features

### 🔐 Login & Sign Up
- JWT authentication
- Password hashing with bcrypt
- Protected routes (frontend + backend)

### 💬 AI Search
- Ask any question
- AI generates helpful responses (OpenAI)
- Displays Wikipedia source links / citations
- Markdown rendering

### ➕ New Chat
- Start a fresh conversation
- Auto-generates chat title from the first message
- Users can rename chats anytime

### 📜 Chat History
- View all previous chats in the sidebar
- Open old conversations
- Rename chats (inline edit)
- Delete chats

### 🗑️ Clear Chat
- Clear all messages in the current chat
- Confirmation modal before clearing

### 👤 User Profile
- View basic profile info (name, email, joined date)
- Logout

### Extra
- Dark / Light mode toggle
- Search suggestion chips
- Responsive clean UI

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: Express.js + Node.js
- **Database**: MongoDB (Mongoose)
- **AI**: OpenAI API (`gpt-4o-mini`)
- **Sources**: Wikipedia API (free, no key needed)

## Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)
- An OpenAI API key

### 2. Backend
```bash
cd server
cp .env.example .env
# Edit .env → add MONGODB_URI and OPENAI_API_KEY
npm install
npm run dev
```
Server → http://localhost:5000

### 3. Frontend
```bash
cd client
npm install
npm run dev
```
Frontend → http://localhost:3000

### 4. Use it
1. Open http://localhost:3000
2. Register a new account
3. Start chatting!

## Project Structure
```
ai-chatbot-search/
├── server/
│   ├── models/         # User & Chat schemas
│   ├── routes/         # auth + chat routes
│   ├── middleware/     # JWT auth
│   ├── utils/          # Wikipedia + AI helpers
│   └── index.js
└── client/
    └── src/
        ├── components/ # Sidebar, messages, modals...
        ├── pages/      # Login, Register, ChatPage
        ├── context/    # AuthContext
        └── utils/      # axios instance
```

## Notes
- Keep it simple – only essential libraries.
- Change the OpenAI model in `server/utils/ai.js` if you want.
- Dark mode preference is saved in localStorage.

Happy coding! 🚀
