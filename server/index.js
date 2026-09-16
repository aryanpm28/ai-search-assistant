require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

const app = express();

// Middlewares
app.use(cors()); // allow frontend to talk to us
app.use(express.json()); // parse JSON body

// Simple health check
app.get('/', (req, res) => {
  res.json({ message: 'AI Chatbot Search Platform API is running 🚀' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-chatbot')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
