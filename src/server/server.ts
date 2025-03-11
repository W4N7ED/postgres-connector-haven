
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import connectionRoutes from './routes/connectionRoutes';
import errorHandler from './middlewares/errorHandler';
import logger from './utils/logger';
import ipRestriction from './middlewares/ipRestriction';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de restriction IP (doit être avant les autres middlewares)
// Fix: Use the middleware properly as an Express middleware function
app.use(ipRestriction);

// Middlewares de base
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: process.env.BODY_LIMIT || '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/connections', connectionRoutes);

// Route de base
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API PostgreSQL Manager',
    timestamp: new Date()
  });
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Démarrer le serveur
app.listen(PORT, () => {
  logger.info(`Serveur démarré sur le port ${PORT}`);
  
  // Afficher les informations sur la restriction IP
  const ipWhitelist = process.env.IP_WHITELIST;
  if (ipWhitelist) {
    logger.info(`Restriction IP activée avec les adresses autorisées: ${ipWhitelist}`);
  } else {
    logger.info('Restriction IP désactivée. Toutes les adresses IP sont autorisées.');
  }
});

export default app;
