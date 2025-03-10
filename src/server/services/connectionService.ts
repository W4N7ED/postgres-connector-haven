
import { Pool, PoolClient } from 'pg';
import { 
  PostgresConnection, 
  ConnectionTestResult, 
  ConnectionStats,
  ConnectionPoolConfig,
  DatabaseCredentials,
  PostgresQueryResult
} from '@/types/connection';
import { DEFAULT_PG_POOL_CONFIG } from '../config';
import logger from '../utils/logger';

// Map des pools de connexions actifs
const connectionPools: Map<string, Pool> = new Map();

/**
 * Convertit les informations de connexion en configuration de connexion pour pg
 */
const createConnectionConfig = (connection: PostgresConnection): DatabaseCredentials => {
  return {
    host: connection.host,
    port: connection.port,
    database: connection.database,
    user: connection.username,
    password: connection.password,
    ssl: connection.ssl ? { rejectUnauthorized: false } : false
  };
};

/**
 * Crée un pool de connexions pour une configuration donnée
 */
const createConnectionPool = (
  connection: PostgresConnection,
  poolConfig?: Partial<ConnectionPoolConfig>
): Pool => {
  // Si un pool existe déjà pour cette connexion, le retourner
  if (connectionPools.has(connection.id)) {
    return connectionPools.get(connection.id)!;
  }

  // Fusion de la configuration par défaut avec la configuration spécifique
  const finalPoolConfig: ConnectionPoolConfig = {
    ...DEFAULT_PG_POOL_CONFIG,
    ...(poolConfig || {}),
    max: connection.maxConnections || DEFAULT_PG_POOL_CONFIG.max,
    idleTimeoutMillis: connection.idleTimeout || DEFAULT_PG_POOL_CONFIG.idleTimeoutMillis,
    connectionTimeoutMillis: connection.connectionTimeout || DEFAULT_PG_POOL_CONFIG.connectionTimeoutMillis,
    allowExplicitMax: connection.allowExplicitMax !== undefined ? connection.allowExplicitMax : DEFAULT_PG_POOL_CONFIG.allowExplicitMax
  };

  // Créer le pool de connexions
  const pool = new Pool({
    ...createConnectionConfig(connection),
    ...finalPoolConfig
  });

  // Gestion des événements du pool
  pool.on('error', (err) => {
    logger.error(`Pool error on connection ${connection.id}: ${err.message}`, { connectionId: connection.id, error: err });
  });

  pool.on('connect', () => {
    logger.debug(`New client connected to pool ${connection.id}`, { connectionId: connection.id });
  });

  // Stocker le pool pour une utilisation ultérieure
  connectionPools.set(connection.id, pool);
  return pool;
};

/**
 * Obtenir un client à partir du pool pour exécuter des requêtes
 */
const getClient = async (connectionId: string): Promise<PoolClient> => {
  const pool = connectionPools.get(connectionId);
  if (!pool) {
    throw new Error(`No connection pool found for ID: ${connectionId}`);
  }
  return pool.connect();
};

/**
 * Tester une connexion à PostgreSQL
 */
const testConnection = async (connection: PostgresConnection): Promise<ConnectionTestResult> => {
  const startTime = Date.now();
  let client;
  let pool;

  try {
    // Créer une nouvelle instance de Pool pour le test uniquement
    pool = new Pool({
      ...createConnectionConfig(connection),
      max: 1, // Une seule connexion pour le test
      idleTimeoutMillis: 5000, // Timeout plus court pour le test
      connectionTimeoutMillis: 5000,
    });

    // Acquérir un client
    client = await pool.connect();
    
    // Tester la connexion avec une requête simple
    const result = await client.query('SELECT version()');
    const serverVersion = result.rows[0]?.version || 'Unknown';
    const latency = Date.now() - startTime;

    return {
      success: true,
      message: 'Connexion établie avec succès',
      timestamp: new Date(),
      details: {
        latency,
        serverVersion,
      }
    };
  } catch (error: any) {
    logger.error(`Connection test failed: ${error.message}`, { error });
    
    return {
      success: false,
      message: 'Échec de la connexion',
      timestamp: new Date(),
      details: {
        error: error.message,
        latency: Date.now() - startTime
      }
    };
  } finally {
    // Libérer les ressources
    if (client) client.release();
    if (pool) await pool.end();
  }
};

/**
 * Exécuter une requête SQL
 */
const executeQuery = async (
  connectionId: string, 
  query: string, 
  params: any[] = []
): Promise<PostgresQueryResult> => {
  const startTime = Date.now();
  const client = await getClient(connectionId);
  
  try {
    const result = await client.query(query, params);
    const executionTime = Date.now() - startTime;
    
    return {
      rows: result.rows,
      fields: result.fields,
      rowCount: result.rowCount,
      command: result.command,
      executionTime
    };
  } finally {
    client.release();
  }
};

/**
 * Récupérer les statistiques du pool de connexions
 */
const getConnectionStats = async (connectionId: string): Promise<ConnectionStats> => {
  const pool = connectionPools.get(connectionId);
  if (!pool) {
    throw new Error(`No connection pool found for ID: ${connectionId}`);
  }

  // Pour pg, nous ne pouvons pas facilement obtenir ces statistiques
  // Dans une implémentation réelle, nous pourrions utiliser des requêtes SQL
  // comme SELECT * FROM pg_stat_activity
  const poolStats = {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  };

  // Exécuter une requête pour obtenir le temps d'exécution
  const client = await pool.connect();
  let queryExecutionTime = 0;
  let uptimeSeconds = 0;
  
  try {
    const startTime = Date.now();
    await client.query('SELECT 1');
    queryExecutionTime = Date.now() - startTime;

    // Récupérer le temps de disponibilité du serveur
    const uptimeResult = await client.query('SELECT extract(epoch from now() - pg_postmaster_start_time()) as uptime');
    uptimeSeconds = parseFloat(uptimeResult.rows[0]?.uptime || '0');
  } finally {
    client.release();
  }

  return {
    activeConnections: poolStats.totalCount - poolStats.idleCount,
    idleConnections: poolStats.idleCount,
    waitingClients: poolStats.waitingCount,
    maxClients: pool.options.max,
    queryExecutionTime,
    uptime: uptimeSeconds
  };
};

/**
 * Fermer un pool de connexions spécifique
 */
const closeConnectionPool = async (connectionId: string): Promise<void> => {
  const pool = connectionPools.get(connectionId);
  if (pool) {
    await pool.end();
    connectionPools.delete(connectionId);
    logger.info(`Connection pool ${connectionId} closed`, { connectionId });
  }
};

/**
 * Fermer tous les pools de connexions
 */
const closeAllPools = async (): Promise<void> => {
  const closePromises = Array.from(connectionPools.entries()).map(
    async ([id, pool]) => {
      await pool.end();
      logger.info(`Connection pool ${id} closed`, { connectionId: id });
    }
  );
  
  await Promise.all(closePromises);
  connectionPools.clear();
  logger.info('All connection pools closed');
};

export default {
  createConnectionPool,
  getClient,
  testConnection,
  executeQuery,
  getConnectionStats,
  closeConnectionPool,
  closeAllPools
};
