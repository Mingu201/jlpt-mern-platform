import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: [ENV.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Request Logger
if (ENV.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parser & Cookie Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/v1', routes);

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to JLPT N5-N3 Japanese Learning Platform API',
    docs: '/api/v1/health'
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
