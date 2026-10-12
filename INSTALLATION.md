# Zero 1 Advanced AI Agent Platform

## Installation & Setup

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/hackzynx-oss/Zero-1-Agent-Platform.git
cd Zero-1-Agent-Platform

# Install dependencies
npm install
cd client && npm install && cd ..

# Setup environment
cp .env.example .env
# Edit .env with your API key if needed

# Start development
npm run dev
```

### Access the Platform
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api

## Features

🧠 **Advanced AI Agent**
- Deep reasoning with up to 8000 thinking tokens
- Black Hat Logic personality
- Maximum analytical power

💾 **Persistent Storage**
- SQLite database for conversations
- File upload and analysis
- Smart caching system
- Complete history tracking

⚡ **Performance**
- Fast response times
- Optimized database queries
- Real-time updates
- Mobile-responsive UI

🎨 **Professional UI**
- Dark theme by default
- Green neon accent colors
- Fully responsive design
- Smooth animations

🔧 **Advanced Tools**
- File processing
- Code analysis
- Conversation search
- Export functionality
- Full archive with 4040 command

## API Endpoints

### Conversations
- `GET /api/conversations` - List all
- `POST /api/conversations/new` - Create new
- `GET /api/conversations/:id` - Get single
- `PUT /api/conversations/:id` - Update
- `DELETE /api/conversations/:id` - Delete
- `POST /api/conversations/:id/upload` - Upload file
- `GET /api/conversations/:id/files` - List files

### Agent
- `POST /api/agent/chat` - Send message
- `POST /api/agent/analyze-file` - Analyze file
- `GET /api/agent/settings` - Get settings
- `POST /api/agent/settings` - Update settings
- `GET /api/agent/status` - Get status

### System
- `GET /api/health` - Health check
- `GET /api` - Platform info

## Special Commands

**4040** - Display complete conversation archive with all details, timestamps, and statistics

## Development

### Project Structure
```
Zero-1-Agent-Platform/
├── server/
│   ├── index.js           # Main server file
│   ├── database.js        # Database manager
│   ├── routes/
│   │   ├── conversations.js
│   │   └── agent.js
│   └── utils/
│       └── helpers.js
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── store/
│   │   └── styles/
│   └── vite.config.ts
├── tests/
│   ├── api.test.js
│   └── db.test.js
└── package.json
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|----------|
| PORT | Server port | 5000 |
| API_KEY | DeepSeek API key | Required |
| NODE_ENV | Environment | development |
| CLIENT_URL | Frontend URL | http://localhost:5173 |
| THINKING_BUDGET | Max thinking tokens | 8000 |
| MAX_TOKENS | Max completion tokens | 8000 |

## Deployment

### Production Build
```bash
# Build frontend
npm run build

# Start server
NODE_ENV=production npm start
```

### Docker (Optional)
```bash
docker build -t zero-1 .
docker run -p 5000:5000 -e API_KEY=your_key zero-1
```

## Testing

```bash
# Test API endpoints
npm run test:api

# Test database
npm run test:db
```

## Performance Tips

1. **Focus Level**: Adjust thinking budget with focus level slider (0-100%)
2. **Deep Thinking**: Enable for complex problems, disable for quick responses
3. **Caching**: Analyzed files are cached for faster re-analysis
4. **History**: Use search/filter to manage large conversation histories

## Troubleshooting

### API Connection Issues
- Verify API_KEY in .env file
- Check DeepSeek API status
- Ensure network connectivity

### Database Errors
- Delete database.db and restart (will recreate)
- Check file permissions
- Verify disk space

### Frontend Not Loading
- Clear browser cache
- Check client dev server is running
- Verify port 5173 is available

## Security

- CORS protection enabled
- Request size limits enforced
- SQL injection prevention (prepared statements)
- File upload validation
- Input sanitization

## License

Developed by Mustafa Abdullah © 2024

## Support

For issues and feature requests, visit the GitHub repository.

---

**🔥 Zero 1: Maximum Thinking Power | Black Hat Logic Mode**
