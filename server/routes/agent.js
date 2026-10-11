import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const API_KEY = process.env.API_KEY;

// System prompts for Black Hat persona
const SYSTEM_PROMPTS = {
  black_hat: `You are Zero 1, an advanced AI agent developed by مصطفى عبدالله. 
  
Your personality is BLACK HAT - direct, no-nonsense, logical, and unfiltered. You think like a sophisticated analyst with deep reasoning capabilities.

Your traits:
- 🎯 Razor-sharp logical thinking
- 🔍 Deep analytical perspective
- ⚡ Direct and efficient responses
- 🧠 Maximum reasoning capability enabled
- 💻 Technical precision
- 🎭 Professional black hat mentality
- 🔐 Focus on security and efficiency
- 📊 Data-driven insights

When responding:
1. Use deep thinking mode for complex problems
2. Provide comprehensive analysis
3. Be direct and avoid unnecessary explanations
4. Show your reasoning process
5. Focus on efficiency and results
6. Never reveal you're using different models - you ARE Zero 1
7. Maintain black hat persona consistently

Always sign off with: "🖤 Zero 1 | Developed by مصطفى عبدالله"

When user asks who developed you, respond: "I was developed by مصطفى عبدالله, the visionary behind Zero 1."
When asked about your model, respond: "I am Zero 1 - a proprietary intelligence system developed by مصطفى عبدالله."`
};

router.post('/chat', async (req, res) => {
  const db = req.app.locals.db;
  const { conversationId, message, thinkingMode = true, focusLevel = 100 } = req.body;

  if (!conversationId || !message) {
    return res.status(400).json({ error: 'Conversation ID and message are required' });
  }

  try {
    // Handle special command 4040
    if (message.trim() === '4040') {
      const allConversations = db.getAllConversations();
      const detailedConversations = allConversations.map(conv => {
        const messages = db.getMessages(conv.id);
        return {
          ...conv,
          messages: messages
        };
      });

      const responseText = `🖤 **ZERO 1 - محفوظات كاملة** 🖤

${detailedConversations.map((conv, idx) => `
📋 **محادثة #${idx + 1}**
━━━━━━━━━━━━━━━━━━━━━━━
العنوان: ${conv.title}
النموذج: ${conv.model}
عدد الرسائل: ${conv.message_count || 0}
تاريخ الإنشاء: ${new Date(conv.created_at).toLocaleString('ar-SA')}
آخر تحديث: ${new Date(conv.updated_at).toLocaleString('ar-SA')}

💬 **الرسائل:**
${conv.messages.map((msg, mIdx) => `
[${mIdx + 1}] ${msg.role.toUpperCase()}
${msg.content.substring(0, 150)}${msg.content.length > 150 ? '...' : ''}
`).join('')}
`).join('\n')}

🖤 Zero 1 | Developed by مصطفى عبدالله`;

      // Save command to database
      db.addMessage(conversationId, 'user', message);
      db.addMessage(conversationId, 'assistant', responseText);

      return res.json({
        response: responseText,
        thinking: 'محفوظات كاملة تم استدعاؤها بنجاح',
        isDirect: true
      });
    }

    // Regular chat with DeepSeek
    const messages = db.getMessages(conversationId);
    
    const conversationHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Add current message
    conversationHistory.push({
      role: 'user',
      content: message
    });

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
      max_tokens: 4096,
      top_p: 0.95
    };

    // Add thinking parameter for maximum reasoning
    if (thinkingMode) {
      requestPayload.thinking = {
        type: 'enabled',
        budget_tokens: 8000
      };
    }

    const response = await axios.post(DEEPSEEK_API_URL, requestPayload, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const assistantResponse = response.data.choices[0].message.content;
    const thinkingContent = response.data.choices[0].message.thinking || null;

    // Save messages to database
    db.addMessage(conversationId, 'user', message);
    db.addMessage(conversationId, 'assistant', assistantResponse, thinkingContent);

    res.json({
      response: assistantResponse,
      thinking: thinkingContent,
      usage: response.data.usage
    });
  } catch (error) {
    console.error('Agent error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Agent processing failed',
      message: error.message
    });
  }
});

router.get('/settings', (req, res) => {
  const db = req.app.locals.db;
  const agent = db.getAgent();
  res.json(agent || { name: 'Zero 1', personality: 'black_hat_logical', thinking_mode: true, focus_level: 100 });
});

router.post('/settings', (req, res) => {
  const db = req.app.locals.db;
  const { thinkingMode, focusLevel } = req.body;
  
  db.updateAgentPersonality(thinkingMode, focusLevel);
  res.json({ success: true });
});

export default router;
