
import winston, { format } from 'winston';
import { MONITORING_CONFIG } from '../config';

// Définition des niveaux de log
const levels = {
  error: 0, 
  warn: 1, 
  info: 2, 
  http: 3,
  debug: 4,
};

// Format du log
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

// Création du logger
const logger = winston.createLogger({
  level: MONITORING_CONFIG.loggingLevel,
  levels,
  format: logFormat,
  defaultMeta: { service: 'postgres-manager' },
  transports: [
    // Écrire tous les logs dans console.log
    new winston.transports.Console({
      format: format.combine(
        format.colorize({ all: true }),
        format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message} ${info.stack || ''} ${
            info.meta ? JSON.stringify(info.meta) : ''
          }`
        )
      ),
    }),
    // Stocker les logs dans des fichiers
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
  ],
});

// Middleware pour Express qui enregistre les requêtes HTTP
const httpLogger = (req: any, res: any, next: any) => {
  const startHrTime = process.hrtime();
  
  // Réponse terminée
  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1000000;
    
    logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} ${elapsedTimeInMs.toFixed(3)}ms`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: elapsedTimeInMs,
      userAgent: req.get('User-Agent') || '',
      ip: req.ip,
    });
  });
  
  next();
};

export { httpLogger };
export default logger;
