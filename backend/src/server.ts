import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.routes';
import personaRoutes from './routes/persona.routes';
import reflectionRoutes from './routes/reflection.routes';
import { chatLogger } from './utils/chat-logger';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/reflections', reflectionRoutes);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'GhostSkill API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Welcome to GhostSkill API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            chat: '/api/chat',
            personas: '/api/personas',
            reflections: '/api/reflections'
        }
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 GhostSkill API server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    
    // Initialize chat logger
    await chatLogger.init();
});

export default app;
