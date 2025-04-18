import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import speechRouter from './routes/speech';
import authRouter from './routes/auth';
import notesRouter from './routes/notes';
import { authenticateUser } from './middleware/auth';
import WebSocketService from './services/websocket';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);

// Initialize WebSocket service
const wss = new WebSocketService(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public routes
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/speech', authenticateUser, speechRouter);
app.use('/api/notes', authenticateUser, notesRouter);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to NoteAssist API' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 