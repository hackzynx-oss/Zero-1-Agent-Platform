import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Database from './server/database.js';
import conversationRoutes from './server/routes/conversations.js';
import agentRoutes from './server/routes/agent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Database
const db = new Database();
db.init();

// Make DB available to routes
app.locals.db = db;

// Routes
app.use('/api/conversations', conversationRoutes);
app.use('/api/agent', agentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Zero 1 Agent Platform is running' });
});

// Serve static files from React build
const clientBuildPath = join(__dirname, 'client', 'dist');
app.use(express.static(clientBuildPath));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Zero 1 Agent Platform running on http://localhost:${PORT}`);
  console.log(`💾 Database initialized`);
  console.log(`🤖 Ready to think...
`);
});
