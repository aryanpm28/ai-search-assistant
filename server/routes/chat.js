const express = require('express');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');
const { generateAnswer } = require('../utils/ai');

const router = express.Router();

// All chat routes need login
router.use(auth);

// GET /api/chats  - list all chats of the user
router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch chats' });
  }
});

// POST /api/chats  - create a new empty chat
router.post('/', async (req, res) => {
  try {
    const chat = await Chat.create({
      user: req.user._id,
      title: 'New Chat',
      messages: []
    });
    res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create chat' });
  }
});

// GET /api/chats/:id  - get one chat with messages
router.get('/:id', async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch chat' });
  }
});

// POST /api/chats/:id/message  - send a message & get AI reply
router.post('/:id/message', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Add user message
    chat.messages.push({ role: 'user', content: content.trim() });

    // Generate AI answer using previous messages as history
    const history = chat.messages.slice(0, -1); // everything before this new message
    const { answer, sources } = await generateAnswer(content.trim(), history);

    // Add assistant message with sources
    chat.messages.push({
      role: 'assistant',
      content: answer,
      sources
    });

    // Auto-set title from first user message if still "New Chat"
    if (chat.title === 'New Chat' && chat.messages.length <= 2) {
      chat.title = content.trim().slice(0, 40) + (content.length > 40 ? '...' : '');
    }

    await chat.save();

    // Return the latest assistant message
    const latest = chat.messages[chat.messages.length - 1];
    res.json({ message: latest, chatId: chat._id, title: chat.title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get AI response. Check your API key.' });
  }
});

// PATCH /api/chats/:id  - rename a chat
router.patch('/:id', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title: title.trim().slice(0, 80) },
      { new: true }
    );

    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json({ title: chat.title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to rename chat' });
  }
});

// DELETE /api/chats/:id/messages  - clear all messages in a chat
router.delete('/:id/messages', async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    chat.messages = [];
    await chat.save();

    res.json({ message: 'Chat cleared', chat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to clear chat' });
  }
});

// DELETE /api/chats/:id  - delete entire chat
router.delete('/:id', async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json({ message: 'Chat deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete chat' });
  }
});

module.exports = router;
