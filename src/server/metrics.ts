
import { Request, Response } from 'express';
import promClient from 'prom-client';

// Initialiser le collecteur de métriques
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

// Métriques HTTP personnalisées
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 5, 15, 50, 100, 500, 1000, 5000]
});

// Métriques pour PostgreSQL
const pgConnectionPoolSize = new promClient.Gauge({
  name: 'pg_connection_pool_size',
  help: 'Size of PostgreSQL connection pool',
  labelNames: ['pool_id']
});

const pgConnectionPoolActive = new promClient.Gauge({
  name: 'pg_connection_pool_active',
  help: 'Number of active connections in PostgreSQL pool',
  labelNames: ['pool_id']
});

const pgConnectionPoolIdle = new promClient.Gauge({
  name: 'pg_connection_pool_idle',
  help: 'Number of idle connections in PostgreSQL pool',
  labelNames: ['pool_id']
});

const pgQueryDuration = new promClient.Histogram({
  name: 'pg_query_duration_ms',
  help: 'Duration of PostgreSQL queries in ms',
  labelNames: ['connection_id', 'query_type'],
  buckets: [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000]
});

// Middleware pour mesurer la durée des requêtes HTTP
const measureRequestDuration = (req: Request, res: Response, next: Function) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const path = req.route ? req.route.path : req.path;
    
    httpRequestDurationMicroseconds
      .labels(req.method, path, res.statusCode.toString())
      .observe(duration);
  });
  
  next();
};

// Endpoint pour exposer les métriques
const getMetrics = async (req: Request, res: Response) => {
  res.set('Content-Type', promClient.register.contentType);
  const metrics = await promClient.register.metrics();
  res.end(metrics);
};

// Exporter les métriques et fonctions
export {
  httpRequestDurationMicroseconds,
  pgConnectionPoolSize,
  pgConnectionPoolActive,
  pgConnectionPoolIdle,
  pgQueryDuration,
  measureRequestDuration,
  getMetrics
};

export default {
  httpRequestDurationMicroseconds,
  pgConnectionPoolSize,
  pgConnectionPoolActive,
  pgConnectionPoolIdle,
  pgQueryDuration,
  measureRequestDuration,
  getMetrics
};
