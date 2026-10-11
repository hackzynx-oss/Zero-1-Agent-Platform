import express from 'express';

const router = express.Router();

router.post('/new', (req, res) => {
  const db = req.app.locals.db;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const conversationId = db.createConversation(title);
  res.json({ id: conversationId, title, created_at: new Date() });
});

router.get('/', (req, res) => {
  const db = req.app.locals.db;
  const conversations = db.getAllConversations();
  res.json(conversations);
});

router.get('/:id', (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const conversation = db.getConversationWithMessages(id);
  
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  
  res.json(conversation);
});

router.put('/:id', (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { title, summary } = req.body;
  
  db.updateConversation(id, { title, summary });
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  db.deleteConversation(id);
  res.json({ success: true });
});

router.post('/:id/message', (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { role, content, thinking } = req.body;

  if (!role || !content) {
    return res.status(400).json({ error: 'Role and content are required' });
  }

  const messageId = db.addMessage(id, role, content, thinking);
  res.json({ id: messageId, success: true });
});

export default router;
