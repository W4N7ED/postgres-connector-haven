
import dotenv from 'dotenv';
import { ConnectionPoolConfig } from '@/types/connection';

// Charger les variables d'environnement
dotenv.config();

// Configuration Express
export const EXPRESS_CONFIG = {
  port: process.env.PORT || 3001,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  bodyLimit: '1mb',
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_change_this_in_production',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
};

// Configuration par défaut du pool de connexions PostgreSQL
export const DEFAULT_PG_POOL_CONFIG: ConnectionPoolConfig = {
  max: parseInt(process.env.PG_MAX_CONNECTIONS || '10'),
  idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT || '30000'),
  connectionTimeoutMillis: parseInt(process.env.PG_CONNECTION_TIMEOUT || '5000'),
  allowExplicitMax: process.env.PG_ALLOW_EXPLICIT_MAX === 'true',
};

// Configuration Redis (optionnel)
export const REDIS_CONFIG = {
  enabled: process.env.REDIS_ENABLED === 'true',
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  ttl: parseInt(process.env.REDIS_TTL || '3600'),
};

// Configuration de sécurité
export const SECURITY_CONFIG = {
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'),
  csrfProtection: process.env.CSRF_PROTECTION === 'true',
  rateLimiting: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // limite par IP
  },
  helmet: {
    contentSecurityPolicy: process.env.CONTENT_SECURITY_POLICY === 'true',
  },
};

// Configuration monitoring
export const MONITORING_CONFIG = {
  prometheusEnabled: process.env.PROMETHEUS_ENABLED === 'true',
  prometheusPath: process.env.PROMETHEUS_PATH || '/metrics',
  loggingLevel: process.env.LOGGING_LEVEL || 'info',
};

// Configuration de base de données
export const getPostgresConfig = (connectionString?: string) => {
  if (connectionString) {
    return { connectionString };
  }
  
  return {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DB || 'postgres',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    ssl: process.env.POSTGRES_SSL === 'true' ? {
      rejectUnauthorized: process.env.POSTGRES_REJECT_UNAUTHORIZED !== 'false'
    } : false,
  };
};
