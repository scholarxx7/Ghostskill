# GhostSkill Backend API

Express.js + TypeScript backend for the GhostSkill platform.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Build for Production
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Health Check
- **GET** `/api/health` - Server health status

### Personas
- **GET** `/api/personas` - Get all available personas
- **GET** `/api/personas/:id` - Get specific persona by ID

### Chat
- **POST** `/api/chat/message` - Send a message and get AI responses
  ```json
  {
    "message": "Your question here",
    "personaIds": ["chanakya", "aurelius"],
    "conversationId": "optional-uuid"
  }
  ```
- **GET** `/api/chat/conversation/:conversationId` - Get conversation history

### Reflections
- **POST** `/api/reflections` - Create a new reflection
  ```json
  {
    "mistake": "What you realized you were doing wrong",
    "newRule": "Your new principle or rule",
    "nextAction": "Specific action in next 24 hours",
    "personasUsed": ["chanakya", "aurelius"]
  }
  ```
- **GET** `/api/reflections` - Get all reflections
- **GET** `/api/reflections/:id` - Get specific reflection
- **DELETE** `/api/reflections/:id` - Delete a reflection

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Language**: TypeScript 5.9
- **Dev Tools**: ts-node, nodemon

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── routes/           # API route definitions
│   ├── models/           # Data models
│   ├── types/            # TypeScript interfaces
│   ├── utils/            # Utility functions (AI service)
│   └── server.ts         # Main server file
├── dist/                 # Compiled JavaScript (gitignored)
├── .env                  # Environment variables (gitignored)
├── .env.example          # Env variable template
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## 🔧 Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

For future AI integration, add:
```env
OPENAI_API_KEY=your_key_here
```

## 🧪 Current Features

✅ RESTful API with TypeScript
✅ CORS enabled for frontend
✅ Mock AI responses for all personas
✅ In-memory storage for reflections
✅ Error handling and validation
✅ Persona data model with 4 historical figures

## 🚧 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Real AI API integration (OpenAI/Anthropic)
- [ ] User authentication & authorization
- [ ] Session persistence
- [ ] Rate limiting
- [ ] WebSocket for real-time chat
- [ ] Logging system
- [ ] Unit tests

## 📝 AI Integration

The current implementation uses mock responses. To integrate with OpenAI:

1. Install OpenAI SDK: `npm install openai`
2. Add your API key to `.env`
3. Uncomment the OpenAI integration code in `src/utils/ai.service.ts`

## 🐛 Debugging

The server logs all requests and errors to the console. Set `NODE_ENV=development` for detailed error messages.

## 📄 License

ISC © 2025
