
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

// Import routes and middlewares
import authRoutes from './routes/authRoutes';
import connectionRoutes from './routes/connectionRoutes';
import errorHandler from './middlewares/errorHandler';
import { ipRestriction } from './middlewares/ipRestriction';
import logger from './utils/logger';

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3001;

// Basic middlewares
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// IP restriction middleware - fixed application
app.use((req, res, next) => ipRestriction(req, res, next));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/connections', connectionRoutes);

// Prometheus metrics - commented out since metrics module is missing
// if (process.env.PROMETHEUS_ENABLED === 'true') {
//   setupMetrics(app);
// }

// Error handling middleware (must be after routes)
app.use(errorHandler);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'API PostgreSQL Manager', version: '1.0.0' });
});

// Start the server
const server = app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, gracefully shutting down server...');
  server.close(() => {
    logger.info('Server stopped');
    process.exit(0);
  });
});

export { app };
