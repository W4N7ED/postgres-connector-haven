
// Ce fichier est un placeholder pour les métriques Prometheus
// Sera implémenté complètement ultérieurement

import promClient from 'prom-client';

// Exporter le registre Prometheus pour utilisation dans d'autres fichiers
export const register = promClient.register;

// Collecter les métriques par défaut
export const collectDefaultMetrics = () => {
  promClient.collectDefaultMetrics();
};

// Métriques personnalisées
export const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 5, 15, 50, 100, 500, 1000, 5000]
});

export const connectionPoolMetrics = {
  activeConnections: new promClient.Gauge({
    name: 'postgres_pool_active_connections',
    help: 'Number of active connections in the pool',
    labelNames: ['poolId']
  }),
  
  idleConnections: new promClient.Gauge({
    name: 'postgres_pool_idle_connections',
    help: 'Number of idle connections in the pool',
    labelNames: ['poolId']
  }),
  
  waitingClients: new promClient.Gauge({
    name: 'postgres_pool_waiting_clients',
    help: 'Number of waiting clients in the pool',
    labelNames: ['poolId']
  }),
  
  queryExecutionTime: new promClient.Histogram({
    name: 'postgres_query_execution_time',
    help: 'Query execution time in ms',
    labelNames: ['poolId', 'queryType'],
    buckets: [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000]
  })
};

export default {
  register,
  collectDefaultMetrics,
  httpRequestDurationMicroseconds,
  connectionPoolMetrics
};
