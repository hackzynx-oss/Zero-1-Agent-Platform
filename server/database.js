import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class DatabaseManager {
  constructor() {
    this.dbPath = path.join(__dirname, '..', 'database.db');
    this.db = null;
  }

  init() {
    try {
      this.db = new Database(this.dbPath);
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('foreign_keys = ON');
      this.createTables();
      this.initializeAgent();
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database error:', error.message);
    }
  }

  createTables() {
    const conversations = `
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        model TEXT DEFAULT 'Zero 1',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        summary TEXT,
        tags TEXT
      )
    `;

    const messages = `
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        thinking TEXT,
        tokens_used INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
      )
    `;

    const agents = `
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL DEFAULT 'Zero 1',
        personality TEXT DEFAULT 'black_hat_logical',
        thinking_mode BOOLEAN DEFAULT 1,
        focus_level INTEGER DEFAULT 100,
        api_key TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const files = `
      CREATE TABLE IF NOT EXISTS files (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        filename TEXT NOT NULL,
        content TEXT,
        file_type TEXT,
        size INTEGER,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
      )
    `;

    const analysis_cache = `
      CREATE TABLE IF NOT EXISTS analysis_cache (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        input_hash TEXT UNIQUE,
        analysis_result TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
      )
    `;

    this.db.exec(conversations);
    this.db.exec(messages);
    this.db.exec(agents);
    this.db.exec(files);
    this.db.exec(analysis_cache);
  }

  // Conversation CRUD
  createConversation(title, model = 'Zero 1') {
    const id = uuidv4();
    const stmt = this.db.prepare(`
      INSERT INTO conversations (id, title, model) 
      VALUES (?, ?, ?)
    `);
    stmt.run(id, title, model);
    return id;
  }

  getConversation(id) {
    const stmt = this.db.prepare(`
      SELECT * FROM conversations WHERE id = ?
    `);
    return stmt.get(id);
  }

  getAllConversations() {
    const stmt = this.db.prepare(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id) as message_count,
        (SELECT SUM(tokens_used) FROM messages WHERE conversation_id = c.id) as total_tokens,
        (SELECT MAX(timestamp) FROM messages WHERE conversation_id = c.id) as last_message_time
      FROM conversations c
      ORDER BY c.updated_at DESC
    `);
    return stmt.all();
  }

  updateConversation(id, updates) {
    const { title, summary, tags } = updates;
    const stmt = this.db.prepare(`
      UPDATE conversations 
      SET title = COALESCE(?, title),
          summary = COALESCE(?, summary),
          tags = COALESCE(?, tags),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(title || null, summary || null, tags || null, id);
  }

  deleteConversation(id) {
    const stmt = this.db.prepare('DELETE FROM conversations WHERE id = ?');
    stmt.run(id);
  }

  // Message methods
  addMessage(conversationId, role, content, thinking = null, tokensUsed = 0) {
    const id = uuidv4();
    const stmt = this.db.prepare(`
      INSERT INTO messages (id, conversation_id, role, content, thinking, tokens_used)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, conversationId, role, content, thinking, tokensUsed);
    
    this.db.prepare('UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(conversationId);
    return id;
  }

  getMessages(conversationId) {
    const stmt = this.db.prepare(`
      SELECT * FROM messages 
      WHERE conversation_id = ?
      ORDER BY timestamp ASC
    `);
    return stmt.all(conversationId);
  }

  getConversationWithMessages(id) {
    const conversation = this.getConversation(id);
    if (!conversation) return null;
    
    const messages = this.getMessages(id);
    return { ...conversation, messages };
  }

  // File storage
  addFile(conversationId, filename, content, fileType, size) {
    const id = uuidv4();
    const stmt = this.db.prepare(`
      INSERT INTO files (id, conversation_id, filename, content, file_type, size)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, conversationId, filename, content, fileType, size);
    return id;
  }

  getFiles(conversationId) {
    const stmt = this.db.prepare(`
      SELECT id, filename, file_type, size, uploaded_at FROM files
      WHERE conversation_id = ?
      ORDER BY uploaded_at DESC
    `);
    return stmt.all(conversationId);
  }

  getFile(fileId) {
    const stmt = this.db.prepare(`SELECT * FROM files WHERE id = ?`);
    return stmt.get(fileId);
  }

  // Agent methods
  initializeAgent() {
    const agentId = 'zero-1-main';
    const existingAgent = this.db.prepare('SELECT * FROM agents WHERE id = ?').get(agentId);
    
    if (!existingAgent) {
      const stmt = this.db.prepare(`
        INSERT INTO agents (id, name, personality, thinking_mode, focus_level, api_key)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run(agentId, 'Zero 1', 'black_hat_logical', 1, 100, process.env.API_KEY || '');
    }
  }

  getAgent() {
    const stmt = this.db.prepare('SELECT * FROM agents WHERE id = ?');
    return stmt.get('zero-1-main');
  }

  updateAgentPersonality(thinking = true, focusLevel = 100) {
    const stmt = this.db.prepare(`
      UPDATE agents 
      SET thinking_mode = ?, focus_level = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(thinking ? 1 : 0, focusLevel, 'zero-1-main');
  }

  // Cache methods
  getCachedAnalysis(inputHash) {
    const stmt = this.db.prepare('SELECT analysis_result FROM analysis_cache WHERE input_hash = ?');
    return stmt.get(inputHash)?.analysis_result;
  }

  setCachedAnalysis(conversationId, inputHash, result) {
    const id = uuidv4();
    const stmt = this.db.prepare(`
      INSERT OR IGNORE INTO analysis_cache (id, conversation_id, input_hash, analysis_result)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(id, conversationId, inputHash, result);
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

export default DatabaseManager;
