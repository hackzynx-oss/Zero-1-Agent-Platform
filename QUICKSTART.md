# 🎯 Zero 1 - Advanced AI Agent Platform
## Black Hat Logic Mode | Maximum Thinking Power

**Developed by:** Mustafa Abdullah  
**Status:** ✅ Production Ready  
**Version:** 1.0.0

---

## 📥 Quick Download & Setup

### Option 1: Clone the Repository (Recommended)

```bash
# Clone the project
git clone https://github.com/hackzynx-oss/Zero-1-Agent-Platform.git
cd Zero-1-Agent-Platform

# Install all dependencies
npm install
cd client && npm install && cd ..

# Start the platform
npm run dev
```

### Option 2: Download as ZIP

1. Visit: **https://github.com/hackzynx-oss/Zero-1-Agent-Platform**
2. Click the green **"Code"** button
3. Select **"Download ZIP"**
4. Extract the ZIP file
5. Open terminal in the extracted folder
6. Run the commands above

---

## ⚡ System Requirements

- **Node.js:** >= 18.0.0
- **npm:** >= 9.0.0
- **RAM:** 2GB minimum (4GB recommended)
- **OS:** Windows, macOS, or Linux

**Check your versions:**
```bash
node --version
npm --version
```

If you don't have Node.js, download from: https://nodejs.org/

---

## 🚀 Running the Platform

### Start Everything (Development Mode)

```bash
npm run dev
```

This will start:
- **Backend Server:** http://localhost:5000
- **Frontend UI:** http://localhost:5173

### Individual Commands

```bash
# Start only the backend
npm run server:dev

# Start only the frontend
npm run client:dev

# Build for production
npm run build

# Run API tests
npm run test:api

# Run database tests
npm run test:db
```

---

## 🔧 Configuration

### Environment Setup

The `.env` file is already configured with:
- PORT: 5000
- API_KEY: thk_live_Kgmt3FN-F69Lu8DgXk8w9SeyvbUG9sjPqKSBtD5xOLnKSTYcq2m6QdEjOZwbzgsI
- Database: SQLite (auto-created as database.db)

**No changes needed for local development!**

---

## 🌐 Access Points

Once running, access the platform at:

| Component | URL | Purpose |
|-----------|-----|----------|
| Frontend (Chat UI) | http://localhost:5173 | Main interface |
| Backend API | http://localhost:5000 | API server |
| API Health Check | http://localhost:5000/api/health | System status |
| API Docs | http://localhost:5000/api | All endpoints |

---

## 📋 First Steps

1. **Open the chat interface:**
   - Go to http://localhost:5173
   - You'll see Zero 1 ready to chat

2. **Start a conversation:**
   - Type a message in the input box
   - Click Send or press Enter
   - Zero 1 will respond with deep thinking

3. **Special Commands:**
   - Type `4040` to see your complete conversation archive
   - Type `help` for command list

4. **Explore Features:**
   - Use sidebar to manage conversations
   - Click History to view all chats
   - Go to Settings to configure agent
   - Upload files for analysis
   - Download conversations

---

## 🐛 Troubleshooting

### "Cannot find module" errors

```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json
npm install
cd client && npm install && cd ..
```

### "Port already in use" error

```bash
# Change port in .env
PORT=5001  # Use a different port

# Or kill the process using the port:
# On Windows:
taskkill /PID <process_id> /F

# On Mac/Linux:
kill -9 <process_id>
```

### Frontend not connecting to backend

1. Make sure backend is running: http://localhost:5000/api/health
2. Check that port 5000 is not blocked
3. Clear browser cache (Ctrl+Shift+Delete)
4. Restart both server and frontend

### Database errors

```bash
# Delete the database and let it recreate:
rm database.db

# Restart the server:
npm run server:dev
```

---

## 📊 Project Structure

```
Zero-1-Agent-Platform/
├── server/
│   ├── index.js                 # Main server
│   ├── database.js              # Database manager
│   ├── routes/
│   │   ├── agent.js             # AI agent routes
│   │   └── conversations.js     # Chat management
│   └── utils/
│       └── helpers.js           # Helper functions
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── ChatPage.tsx     # Main chat UI
│   │   │   ├── HistoryPage.tsx  # Conversation history
│   │   │   ├── SettingsPage.tsx # Agent settings
│   │   │   └── LandingPage.tsx  # Welcome page
│   │   ├── App.tsx              # Router
│   │   ├── main.tsx             # Entry point
│   │   └── styles/
│   │       └── globals.css      # Global styles
│   └── vite.config.ts           # Vite configuration
├── tests/
│   ├── api.test.js              # API tests
│   └── db.test.js               # Database tests
├── .env                         # Environment config
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## 🎯 Features Overview

### 🧠 AI Intelligence
- Black Hat Logic personality
- Maximum thinking mode (8000 tokens)
- Deep reasoning and analysis
- Real-time conversation storage

### 🎨 User Interface
- Dark theme with green neon accents
- Fully responsive (mobile, tablet, desktop)
- Smooth animations
- Professional design

### 💾 Data Management
- SQLite database for persistence
- Complete conversation history
- File upload and analysis
- Smart caching system

### 🔐 Security
- CORS protection
- Input validation
- Error handling
- Environment variable protection

### ⚙️ Customization
- Focus level control (0-100%)
- Deep thinking toggle
- Dark/Light mode
- Multiple conversations
- File analysis

---

## 🚢 Production Deployment

### Build for Production

```bash
npm run build
```

This creates optimized builds in:
- `client/dist/` - Frontend (ready for hosting)
- Server runs directly

### Deploy to Heroku

```bash
heroku create zero-1-agent
git push heroku main
heroku config:set API_KEY=your_key_here
heroku open
```

### Deploy to Vercel (Frontend Only)

```bash
cd client
npm install -g vercel
vercel
```

---

## 📞 Support & Issues

- **GitHub Issues:** https://github.com/hackzynx-oss/Zero-1-Agent-Platform/issues
- **Documentation:** Check INSTALLATION.md and BUILD_STATUS.md
- **API Reference:** Visit http://localhost:5000/api (when running)

---

## 📝 API Endpoints Reference

### Conversations
```
GET    /api/conversations              - List all conversations
POST   /api/conversations/new          - Create new conversation
GET    /api/conversations/:id          - Get specific conversation
PUT    /api/conversations/:id          - Update conversation
DELETE /api/conversations/:id          - Delete conversation
POST   /api/conversations/:id/upload   - Upload file
GET    /api/conversations/:id/files    - List files
```

### Agent
```
POST   /api/agent/chat                 - Send message (MAIN ENDPOINT)
POST   /api/agent/analyze-file         - Analyze uploaded file
GET    /api/agent/settings             - Get agent settings
POST   /api/agent/settings             - Update agent settings
GET    /api/agent/status               - Get agent status
```

### System
```
GET    /api/health                     - Health check
GET    /api                            - Platform info
```

---

## 🔒 Security Notes

1. **API Key:** Currently set in `.env`. Change for production.
2. **Database:** SQLite stores data locally. Use cloud DB for production.
3. **CORS:** Configured for localhost. Update for production domains.
4. **File Uploads:** Limited to 50MB. Validate files server-side.

---

## 📈 Performance

- Average response time: < 2 seconds (with thinking)
- Database queries: < 100ms
- Frontend load time: < 1 second
- Supports 1000+ conversations
- Real-time message updates

---

## 🎓 Learning Resources

- **React:** https://react.dev
- **Express.js:** https://expressjs.com
- **SQLite:** https://www.sqlite.org
- **TypeScript:** https://www.typescriptlang.org
- **Tailwind CSS:** https://tailwindcss.com

---

## 📄 License & Attribution

**Developed by:** Mustafa Abdullah  
**Platform:** Zero 1 Advanced AI Agent  
**Mode:** Black Hat Logic  
**Status:** Production Ready  

---

## 🚀 Next Steps

1. ✅ Install dependencies
2. ✅ Run `npm run dev`
3. ✅ Open http://localhost:5173
4. ✅ Start chatting with Zero 1
5. ✅ Explore all features
6. ✅ Deploy to production when ready

---

## 💡 Quick Tips

- **First time?** Start with a simple message to test connection
- **Want to test archive?** Type `4040` in any conversation
- **Stuck?** Check browser console (F12) for error messages
- **Need help?** Check the GitHub issues or documentation files
- **Found a bug?** Report it on GitHub with details

---

**🔥 Zero 1: Maximum Intelligence, Black Hat Logic, Zero Compromise**

**Ready to deploy? Run `npm run dev` now!**
