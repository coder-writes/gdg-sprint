# 🚀 Quick Setup Guide - AI Features

This guide will help you set up all the AI-powered features for the Gemini Hackathon.

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB running (local or Atlas)
- Google Gemini API key

## 🔑 Step 1: Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated API key
5. Keep it safe - you'll need it in the next step

## ⚙️ Step 2: Configure Backend Environment

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Open `.env` and add your configuration:
```env
# Server Configuration
PORT=4000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/codecrux
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codecrux

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# 🤖 CRITICAL: Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

## 🎨 Step 3: Configure Frontend Environment

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Update the configuration:
```env
VITE_BACKEND_URL=http://localhost:4000
VITE_APP_NAME=CodeCrux
```

## 📦 Step 4: Install Dependencies

### Backend Dependencies
```bash
cd backend
npm install
```

This installs:
- `@google/generative-ai` - Google Gemini AI SDK
- `socket.io` - Real-time WebSocket communication
- `express` - Web framework
- `mongoose` - MongoDB ODM
- Other required packages

### Frontend Dependencies
```bash
cd frontend
npm install
```

This installs:
- `socket.io-client` - WebSocket client
- `react-syntax-highlighter` - Code syntax highlighting
- `react-markdown` - Markdown rendering
- `prismjs` - Code highlighting themes
- Other required packages

## 🚀 Step 5: Start the Application

### Start Backend Server
```bash
cd backend
npm run dev
```

Server will start on: `http://localhost:4000`

You should see:
```
✅ Listening on port 4000
✅ MongoDB connected
✅ Socket.io server ready for live chat
```

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```

Frontend will start on: `http://localhost:5173`

## ✅ Step 6: Verify Installation

1. Open your browser and go to `http://localhost:5173`
2. Create an account or login
3. Navigate to **AI Tools** section
4. Try the **Live Chat** feature:
   - Type: "Hello, can you help me with JavaScript?"
   - You should see real-time AI responses

## 🎯 Available AI Features

Once setup is complete, you can access:

### 📍 Route: `/ai-tools`

1. **Live Chat Assistant** - Real-time AI coding help
2. **Code Review Tool** - Analyze code quality
3. **Code Snippet Generator** - Generate code from descriptions
4. **SQL Query Generator** - Natural language to SQL
5. **Regex Pattern Builder** - Build regex patterns
6. **Bug Detector** - Find and fix bugs
7. **Security Scanner** - Scan for vulnerabilities
8. **Performance Optimizer** - Optimize code performance
9. **Tech Stack Advisor** - Get tech recommendations
10. **API Documentation Generator** - Generate API docs

## 🐛 Troubleshooting

### Issue: "GEMINI_API_KEY not found"
**Solution**: Make sure you added the API key to `backend/.env`

### Issue: Socket.io connection failed
**Solution**: 
1. Check if backend is running on port 4000
2. Verify CORS settings in `backend/server.js`
3. Check browser console for errors

### Issue: MongoDB connection failed
**Solution**:
1. Ensure MongoDB is running
2. Check `MONGODB_URI` in `.env`
3. For MongoDB Atlas, whitelist your IP address

### Issue: AI features not working
**Solution**:
1. Verify API key is correct
2. Check browser console for errors
3. Ensure you're logged in
4. Check backend logs for error messages

## 📊 Testing the Features

### Test Code Review:
```javascript
// Paste this in Code Review Tool
function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum = sum + arr[i];
  }
  return sum;
}
```

### Test SQL Generator:
**Description**: "Get all users who registered in the last 30 days and have made at least one purchase"

### Test Regex Generator:
**Description**: "Match valid email addresses"
**Examples**: 
- user@example.com
- john.doe@company.co.uk

### Test Live Chat:
**Questions to try**:
- "Explain closures in JavaScript"
- "How do I optimize a binary search?"
- "What are the differences between REST and GraphQL?"

## 🔒 Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Keep API keys secure** - Don't share them publicly
3. **Use environment variables** - Never hardcode secrets
4. **Rotate API keys** - If exposed, generate new ones immediately

## 📚 API Endpoints Reference

All AI endpoints require authentication (JWT token in cookie).

**Base URL**: `http://localhost:4000/api/ai`

### Code Analysis
- `POST /code/review` - Code review
- `POST /code/bugs` - Bug detection
- `POST /code/explain` - Code explanation
- `POST /code/refactor` - Code refactoring
- `POST /code/tests` - Test generation

### Developer Tools
- `POST /sql/generate` - SQL query generation
- `POST /regex/generate` - Regex pattern generation
- `POST /snippet/generate` - Code snippet generation
- `POST /api/documentation` - API documentation

### Optimization & Security
- `POST /performance/optimize` - Performance optimization
- `POST /security/scan` - Security scanning
- `POST /architecture/suggest` - Architecture advice
- `POST /techstack/advise` - Tech stack recommendations

### Chat
- `POST /chat` - Regular chat
- `POST /chat/stream` - Streaming chat (SSE)

## 🎓 Next Steps

1. Explore all AI tools in the `/ai-tools` page
2. Try different programming languages
3. Test with your own code
4. Experiment with live chat features
5. Export and save your results

## 💡 Tips for Best Results

1. **Be specific** in your descriptions
2. **Provide context** when asking questions
3. **Use proper formatting** for code
4. **Include error messages** when debugging
5. **Experiment** with different parameters

## 📞 Need Help?

- Check `AI_FEATURES.md` for detailed feature documentation
- Review backend logs for error messages
- Ensure all dependencies are installed
- Verify environment variables are set correctly

## 🎉 Success!

If you've reached this point and everything is working, congratulations! You now have a fully functional AI-powered developer platform.

**Happy Coding! 🚀**

---

**Built for the Gemini Hackathon** 🏆
