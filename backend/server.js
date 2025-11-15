import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import publicRouter from './routes/publicRoutes.js';
import aiRouter from './routes/aiRoutes.js';
import geminiService from './services/geminiService.js';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;

connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  'https://code-crux-ten.vercel.app',
  'http://codecrux.aashutosh585.me',
  'https://gdg-sprint.onrender.com',
];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

// Initialize Socket.io with CORS
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST']
  }
});

app.use(session({
  secret: process.env.JWT_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

//  API EndPoints
app.get('/', (req, res) => { res.send('API Working'); });
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/public', publicRouter);
app.use('/api/ai', aiRouter);

// Socket.io for live chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room (e.g., user-specific chat room)
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handle chat messages
  socket.on('chat-message', async (data) => {
    try {
      const { message, history, roomId } = data;
      
      // Send user message to room
      io.to(roomId).emit('user-message', {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      });

      // Stream AI response
      let fullResponse = '';
      
      await geminiService.streamChat(
        message,
        history || [],
        (chunk) => {
          fullResponse += chunk;
          // Send chunk to the specific room
          io.to(roomId).emit('ai-message-chunk', {
            chunk,
            done: false
          });
        }
      );

      // Send final message
      io.to(roomId).emit('ai-message-chunk', {
        chunk: '',
        done: true,
        fullResponse,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Socket chat error:', error);
      socket.emit('chat-error', {
        error: error.message || 'Failed to process message'
      });
    }
  });

  // Handle code analysis requests
  socket.on('analyze-code', async (data) => {
    try {
      const { code, language, analysisType, roomId } = data;
      
      let result;
      switch (analysisType) {
        case 'review':
          result = await geminiService.reviewCode(code, language);
          break;
        case 'bugs':
          result = await geminiService.detectBugs(code, language);
          break;
        case 'security':
          result = await geminiService.scanSecurity(code, language);
          break;
        case 'performance':
          result = await geminiService.optimizePerformance(code, language);
          break;
        default:
          result = await geminiService.explainCode(code, language);
      }

      io.to(roomId).emit('analysis-result', {
        analysisType,
        result,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Socket analysis error:', error);
      socket.emit('analysis-error', {
        error: error.message || 'Failed to analyze code'
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log('Socket.io server ready for live chat');
});