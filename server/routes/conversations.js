import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Create new conversation
router.post('/new', (req, res) => {
  const db = req.app.locals.db;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const conversationId = db.createConversation(title);
  res.json({ 
    id: conversationId, 
    title, 
    model: 'Zero 1',
    created_at: new Date(),
    messages: []
  });
});

// Get all conversations
router.get('/', (req, res) => {
  const db = req.app.locals.db;
  const conversations = db.getAllConversations();
  res.json(conversations);
});

// Get single conversation
router.get('/:id', (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const conversation = db.getConversationWithMessages(id);
  
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  
  res.json(conversation);
});

// Update conversation
router.put('/:id', (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { title, summary, tags } = req.body;
  
  db.updateConversation(id, { title, summary, tags });
  res.json({ success: true });
});

// Delete conversation
router.delete('/:id', (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  db.deleteConversation(id);
  res.json({ success: true });
});

// Add message
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

// Upload file to conversation
router.post('/:id/upload', upload.single('file'), (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const content = req.file.buffer.toString('utf-8');
  const fileType = req.file.mimetype.split('/')[0];
  const fileId = db.addFile(id, req.file.originalname, content, fileType, req.file.size);

  res.json({ 
    fileId, 
    filename: req.file.originalname,
    size: req.file.size,
    type: fileType
  });
});

// Get files in conversation
router.get('/:id/files', (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const files = db.getFiles(id);
  res.json(files);
});

// Search conversations
router.get('/search/:query', (req, res) => {
  const db = req.app.locals.db;
  const { query } = req.params;
  
  const allConvs = db.getAllConversations();
  const results = allConvs.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.summary?.toLowerCase().includes(query.toLowerCase())
  );
  
  res.json(results);
});

export default router;
