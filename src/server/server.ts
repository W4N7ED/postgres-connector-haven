import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import promClient from 'prom-client';
import { Express } from 'express';

import { EXPRESS_CONFIG, SECURITY_CONFIG, MONITORING_CONFIG } from './config';
import connectionRoutes from './routes/connectionRoutes';
import authRoutes from './routes/authRoutes';
import { httpLogger } from './utils/logger';
import logger from './utils/logger';
import errorHandler from './middlewares/errorHandler';
import authService from './services/authService';
import connectionService from './services/connectionService';

// Créer l'application Express
const app: Express = express();

// Configuration de base
app.use(cors({
  origin: EXPRESS_CONFIG.corsOrigin,
  credentials: true
}));
app.use(express.json({ limit: EXPRESS_CONFIG.bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: EXPRESS_CONFIG.bodyLimit }));
app.use(compression());

// Sécurité
app.use(helmet());

// Limitation de débit
if (SECURITY_CONFIG.rateLimiting) {
  app.use(rateLimit({
    windowMs: SECURITY_CONFIG.rateLimiting.windowMs,
    max: SECURITY_CONFIG.rateLimiting.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: 'Too many requests, please try again later.',
      timestamp: new Date()
    }
  }));
  logger.info('Rate limiting enabled');
}

// Monitoring avec Prometheus
if (MONITORING_CONFIG.prometheusEnabled) {
  const collectDefaultMetrics = promClient.collectDefaultMetrics;
  collectDefaultMetrics();

  // Ajouter les métriques personnalisées
  const httpRequestDurationMicroseconds = new promClient.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 5, 15, 50, 100, 500, 1000, 5000]
  });

  // Middleware pour mesurer la durée des requêtes
  app.use((req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const path = req.route ? req.route.path : req.path;
      
      httpRequestDurationMicroseconds
        .labels(req.method, path, res.statusCode.toString())
        .observe(duration);
    });
    
    next();
  });

  // Endpoint pour les métriques Prometheus
  app.get(MONITORING_CONFIG.prometheusPath, async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    const metrics = await promClient.register.metrics();
    res.end(metrics);
  });
  
  logger.info(`Prometheus metrics enabled at ${MONITORING_CONFIG.prometheusPath}`);
}

// Logging
app.use(httpLogger);

// Routes de l'API
app.use('/api/connections', connectionRoutes);
app.use('/api/auth', authRoutes);

// Route de vérification de santé
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    timestamp: new Date(),
    service: 'postgres-manager',
    status: 'ok'
  });
});

// Middleware d'erreur
app.use(errorHandler);

// Démarrer le serveur
const port = EXPRESS_CONFIG.port;
const host = EXPRESS_CONFIG.host;
const server = app.listen(Number(port), host as string, () => {
  logger.info(`Server running on ${host}:${port}`);
  
  // Initialisation
  authService.initAdminUser();
});

// Gestion de l'arrêt propre
const gracefulShutdown = async () => {
  logger.info('Shutting down gracefully...');
  
  try {
    // Fermer tous les pools de connexions
    await connectionService.closeAllPools();
    
    // Fermer le serveur HTTP
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
    
    // Si le serveur ne se ferme pas dans les 10 secondes, forcer la fermeture
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } catch (error) {
    logger.error('Error during shutdown', { error });
    process.exit(1);
  }
};

// Capturer les signaux d'arrêt
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error });
  gracefulShutdown();
});

export default app;
