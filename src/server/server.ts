
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

// Fix imports to use default imports
import authRoutes from './routes/authRoutes';
import connectionRoutes from './routes/connectionRoutes';
import errorHandler from './middlewares/errorHandler';
import { ipRestriction } from './middlewares/ipRestriction';
import logger from './utils/logger';

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de base
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de restriction IP - fix the application of middleware
app.use(ipRestriction);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/connections', connectionRoutes);

// Métriques Prometheus - removed reference to missing metrics module
// if (process.env.PROMETHEUS_ENABLED === 'true') {
//   setupMetrics(app);
// }

// Middleware de gestion des erreurs (doit être après les routes)
app.use(errorHandler);

// Route par défaut
app.get('/', (req, res) => {
  res.json({ message: 'API PostgreSQL Manager', version: '1.0.0' });
});

// Démarrage du serveur
const server = app.listen(PORT, () => {
  logger.info(`Serveur démarré sur le port ${PORT}`);
});

// Gestion propre de la fermeture
process.on('SIGTERM', () => {
  logger.info('SIGTERM reçu, arrêt gracieux du serveur...');
  server.close(() => {
    logger.info('Serveur arrêté');
    process.exit(0);
  });
});

export { app };
