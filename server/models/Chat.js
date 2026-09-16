const mongoose = require('mongoose');

// Each message in a chat
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  // Sources from Wikipedia or web for citations
  sources: [{
    title: String,
    url: String,
    snippet: String
  }]
}, { timestamps: true });

// Chat session belonging to a user
const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Chat'
  },
  messages: [messageSchema]
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
