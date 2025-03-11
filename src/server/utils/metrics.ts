
import { Express } from 'express';
import { register, collectDefaultMetrics } from 'prom-client';
import logger from './logger';

// Initialize default metrics
collectDefaultMetrics({ register });

/**
 * Setup Prometheus metrics
 */
export const setupMetrics = (app: Express) => {
  const metricsPath = process.env.PROMETHEUS_PATH || '/metrics';
  
  // Expose metrics endpoint
  app.get(metricsPath, async (req, res) => {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (error) {
      logger.error('Error generating metrics:', error);
      res.status(500).send('Error generating metrics');
    }
  });
  
  logger.info(`Prometheus metrics enabled at ${metricsPath}`);
};
