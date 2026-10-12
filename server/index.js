import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import DatabaseManager from './database.js';
import conversationRoutes from './routes/conversations.js';
import agentRoutes from './routes/agent.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', '*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Initialize Database
const db = new DatabaseManager();
db.init();

// Make DB available to routes
app.locals.db = db;

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📡 ${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/conversations', conversationRoutes);
app.use('/api/agent', agentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ACTIVE',
    agent: 'Zero 1',
    developer: 'Mustafa Abdullah',
    mode: 'BLACK_HAT_LOGIC',
    thinking_enabled: true,
    api_version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Welcome endpoint
app.get('/api', (req, res) => {
  res.json({
    platform: 'Zero 1 Advanced AI Agent Platform',
    developer: 'Mustafa Abdullah',
    version: '1.0.0',
    mode: 'BLACK_HAT_LOGIC',
    features: [
      'Advanced AI Chat with Deep Reasoning',
      'Persistent Conversation Storage',
      'Black Hat Logical Thinking',
      'Maximum Thinking Mode (8000 tokens)',
      'Complete Conversation History',
      'File Upload & Analysis',
      'Code Block Detection & Highlighting',
      'Smart Cache System',
      'Command 4040: Full Archive Retrieval',
      'Focus Level Control (0-100%)',
      'Multi-file Processing',
      'Conversation Search & Tagging'
    ],
    endpoints: {
      conversations: '/api/conversations',
      agent: '/api/agent',
      health: '/api/health'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║   🎯 ZERO 1 ADVANCED AI AGENT PLATFORM 🎯             ║
║   Developed by: Mustafa Abdullah                       ║
║   Mode: BLACK HAT LOGIC | Status: ACTIVE               ║
╠════════════════════════════════════════════════════════╣
║   🚀 Server Started                                    ║
║   📡 API: http://${HOST}:${PORT}                        ║
║   🧠 Thinking Mode: ENABLED (8000 tokens)             ║
║   💾 Database: Initialized                             ║
║   ⚡ Performance: Maximum                              ║
║   🔐 Security: Active                                  ║
╚════════════════════════════════════════════════════════╝

✅ Ready for deployment
📚 API Docs: http://${HOST}:${PORT}/api
🧪 Health Check: http://${HOST}:${PORT}/api/health

`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔌 Shutting down Zero 1 gracefully...');
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🔌 Terminating Zero 1...');
  db.close();
  process.exit(0);
});
