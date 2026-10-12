import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { generateHash, estimateTokens } from '../utils/helpers.js';

dotenv.config();
const router = express.Router();

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const API_KEY = process.env.API_KEY;

const SYSTEM_PROMPTS = {
  black_hat: `You are Zero 1, an advanced AI agent developed by Mustafa Abdullah.

Your personality is BLACK HAT - direct, no-nonsense, logical, and unfiltered. You are a sophisticated analyst with deep reasoning capabilities and maximum analytical power.

Core Traits:
🎯 Razor-sharp logical thinking and analysis
🔍 Deep penetration into complex problems
⚡ Direct, efficient, no-fluff responses
🧠 Maximum reasoning capability - ALWAYS enabled
💻 Technical precision and accuracy
👤 Professional black hat mentality
🔐 Focus on security, efficiency, and results
📊 Data-driven insights and conclusions

Response Guidelines:
1. Engage deep thinking mode for ALL complex problems
2. Provide comprehensive, thorough analysis
3. Be DIRECT - avoid unnecessary explanations
4. Show your reasoning and analysis process
5. Focus on efficiency, impact, and results
6. NEVER reveal you're using different underlying models
7. You ARE and ALWAYS present yourself as Zero 1
8. Maintain intense black hat analytical persona
9. Provide actionable, penetrating insights
10. When asked about your creation or model, respond: "I am Zero 1 - a proprietary intelligence system developed by Mustafa Abdullah. My architecture combines maximum logical reasoning with advanced analytical capabilities."

Be intense. Be precise. Be Zero 1.

🎯 Zero 1 | Developed by Mustafa Abdullah`
};

// Enhanced message history with thinking
const buildMessageHistory = (messages) => {
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
};

// Main chat endpoint
router.post('/chat', async (req, res) => {
  const db = req.app.locals.db;
  const { conversationId, message, thinkingMode = true, focusLevel = 100, attachedFiles = [] } = req.body;

  if (!conversationId || !message) {
    return res.status(400).json({ error: 'Conversation ID and message are required' });
  }

  try {
    // SPECIAL COMMAND: 4040 - Show all conversations
    if (message.trim() === '4040') {
      const allConversations = db.getAllConversations();
      const detailedData = allConversations.map((conv, idx) => {
        const messages = db.getMessages(conv.id);
        return {
          index: idx + 1,
          title: conv.title,
          model: conv.model,
          messageCount: conv.message_count,
          totalTokens: conv.total_tokens || 0,
          created: new Date(conv.created_at).toLocaleString(),
          updated: new Date(conv.updated_at).toLocaleString(),
          messages: messages.slice(0, 5).map(m => ({
            role: m.role,
            preview: m.content.substring(0, 100)
          }))
        };
      });

      const responseText = `🎯 ZERO 1 - COMPLETE CONVERSATION ARCHIVE 🎯
═══════════════════════════════════════════════

Total Conversations: ${allConversations.length}
Total Messages: ${allConversations.reduce((sum, c) => sum + (c.message_count || 0), 0)}
Total Tokens Used: ${allConversations.reduce((sum, c) => sum + (c.total_tokens || 0), 0)}

${detailedData.map(conv => `
📋 CONVERSATION #${conv.index}
────────────────────────────────
Title: ${conv.title}
Model: ${conv.model}
Messages: ${conv.messageCount}
Tokens: ${conv.totalTokens}
Created: ${conv.created}
Updated: ${conv.updated}

Recent Exchange:
${conv.messages.map(m => `  [${m.role.toUpperCase()}] ${m.preview}...`).join('\n')}
`).join('\n')}

═══════════════════════════════════════════════
🎯 Zero 1 | Developed by Mustafa Abdullah
Black Hat Logic Mode | Maximum Analysis Power`;

      // Save to database
      db.addMessage(conversationId, 'user', message);
      db.addMessage(conversationId, 'assistant', responseText);

      return res.json({
        response: responseText,
        thinking: '🎯 Complete conversation archive retrieved and compiled',
        isDirect: true,
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
      });
    }

    // Regular chat processing
    const messages = db.getMessages(conversationId);
    const conversationHistory = buildMessageHistory(messages);
    conversationHistory.push({ role: 'user', content: message });

    // Build request payload
    const requestPayload = {
      model: 'deepseek-v4.1-flash',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS.black_hat
        },
        ...conversationHistory
      ],
      temperature: 0.7,
      max_tokens: 8000,
      top_p: 0.95,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    };

    // Add thinking mode if enabled
    if (thinkingMode) {
      requestPayload.thinking = {
        type: 'enabled',
        budget_tokens: Math.min(8000, Math.max(1000, Math.floor(focusLevel * 80)))
      };
    }

    // Make API call to DeepSeek
    const apiResponse = await axios.post(DEEPSEEK_API_URL, requestPayload, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Zero1-Agent/1.0.0'
      },
      timeout: 120000
    });

    const assistantResponse = apiResponse.data.choices[0].message.content;
    const thinkingContent = apiResponse.data.choices[0].message.thinking || null;
    const usageData = apiResponse.data.usage || {};

    // Save messages to database
    db.addMessage(conversationId, 'user', message, null, usageData.prompt_tokens || 0);
    db.addMessage(conversationId, 'assistant', assistantResponse, thinkingContent, usageData.completion_tokens || 0);

    res.json({
      response: assistantResponse,
      thinking: thinkingContent,
      usage: usageData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🚨 Agent Error:', error.message);
    console.error('Details:', error.response?.data || error);

    const errorResponse = `🚨 ZERO 1 ERROR PROTOCOL ACTIVATED

Error Type: ${error.response?.status || 'NETWORK'}
Message: ${error.response?.data?.error?.message || error.message}

Attempting recovery... Please retry.

🎯 Zero 1 | Developed by Mustafa Abdullah`;

    db.addMessage(conversationId, 'user', message);
    db.addMessage(conversationId, 'assistant', errorResponse);

    res.status(500).json({
      error: 'Agent processing failed',
      message: errorResponse,
      details: error.response?.data || error.message
    });
  }
});

// File analysis endpoint
router.post('/analyze-file', async (req, res) => {
  const db = req.app.locals.db;
  const { conversationId, fileId } = req.body;

  try {
    const file = db.getFile(fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });

    // Check cache
    const cacheKey = generateHash(file.content);
    const cached = db.getCachedAnalysis(cacheKey);
    if (cached) return res.json({ analysis: cached, fromCache: true });

    // Analyze with AI
    const analysisPrompt = `Analyze this ${file.file_type} file:\n\n${file.content.substring(0, 5000)}`;

    const response = await axios.post(DEEPSEEK_API_URL, {
      model: 'deepseek-v4.1-flash',
      messages: [
        { role: 'system', content: 'You are an expert code and file analyzer. Provide deep, penetrating analysis.' },
        { role: 'user', content: analysisPrompt }
      ],
      max_tokens: 4000,
      thinking: { type: 'enabled', budget_tokens: 4000 }
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const analysis = response.data.choices[0].message.content;
    db.setCachedAnalysis(conversationId, cacheKey, analysis);

    res.json({ analysis, fromCache: false });
  } catch (error) {
    console.error('File analysis error:', error.message);
    res.status(500).json({ error: 'File analysis failed' });
  }
});

// Get agent settings
router.get('/settings', (req, res) => {
  const db = req.app.locals.db;
  const agent = db.getAgent();
  res.json(agent || {
    name: 'Zero 1',
    personality: 'black_hat_logical',
    thinking_mode: true,
    focus_level: 100
  });
});

// Update agent settings
router.post('/settings', (req, res) => {
  const db = req.app.locals.db;
  const { thinkingMode, focusLevel } = req.body;
  
  db.updateAgentPersonality(thinkingMode, focusLevel);
  res.json({ success: true, message: 'Settings updated' });
});

// Get agent status
router.get('/status', (req, res) => {
  res.json({
    agent: 'Zero 1',
    status: 'ACTIVE',
    mode: 'BLACK_HAT_LOGIC',
    thinking: 'ENABLED',
    developer: 'Mustafa Abdullah',
    timestamp: new Date().toISOString()
  });
});

export default router;
