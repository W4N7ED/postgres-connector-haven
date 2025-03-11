
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
// Fix: We need to use app.use with a path pattern to correctly apply the middleware
app.use('/', ipRestriction);

// Middlewares de base
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/connections', connectionRoutes);

// Route de base pour vérifier que le serveur fonctionne
app.get('/', (req: Request, res: Response) => {
  res.send('API PostgreSQL Manager - Serveur en ligne');
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Démarrer le serveur
app.listen(PORT, () => {
  logger.info(`Serveur démarré sur le port ${PORT}`);
});

export default app;
