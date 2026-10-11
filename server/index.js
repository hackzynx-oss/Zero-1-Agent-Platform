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

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', process.env.CLIENT_URL],
  credentials: true
}));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Initialize Database
const db = new DatabaseManager();
db.init();
db.initializeAgent();

// Make DB available to routes
app.locals.db = db;

// API Routes
app.use('/api/conversations', conversationRoutes);
app.use('/api/agent', agentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'active',
    agent: 'Zero 1',
    developer: 'مصطفى عبدالله',
    mode: 'black_hat_logical',
    thinking_enabled: true,
    message: '🖤 Zero 1 is ready to think'
  });
});

// Welcome
app.get('/api', (req, res) => {
  res.json({
    platform: 'Zero 1 Agent Platform',
    developer: 'مصطفى عبدالله',
    version: '1.0.0',
    features: [
      'Advanced AI Chat',
      'Persistent Storage',
      'Black Hat Persona',
      'Maximum Thinking Mode',
      'Complete Conversation History',
      'Command 4040: View All Conversations'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🖤 ZERO 1 AGENT PLATFORM 🖤          ║
║  Developed by: مصطفى عبدالله           ║
║  Status: ACTIVE & THINKING              ║
╚════════════════════════════════════════╝

🚀 Server: http://localhost:${PORT}
🧠 Mode: BLACK HAT LOGIC
💾 Database: Initialized
⚡ Performance: Maximum
📡 Ready for deployment

`);
});

process.on('SIGINT', () => {
  console.log('\n🔌 Shutting down Zero 1...');
  db.close();
  process.exit(0);
});
