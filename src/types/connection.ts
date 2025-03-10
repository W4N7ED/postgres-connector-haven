
export interface PostgresConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  status?: ConnectionStatus;
  lastConnected?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Ajout de nouveaux champs pour la configuration du pool
  maxConnections?: number;
  idleTimeout?: number;
  connectionTimeout?: number;
  allowExplicitMax?: boolean;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'unknown';

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  timestamp: Date;
  details?: {
    latency?: number;
    serverVersion?: string;
    error?: string;
  };
}

// Nouveaux types pour l'API
export interface ConnectionStats {
  activeConnections: number;
  idleConnections: number;
  waitingClients: number;
  maxClients: number;
  queryExecutionTime: number;
  uptime: number;
}

export interface ConnectionPoolConfig {
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
  allowExplicitMax?: boolean;
}

export interface DatabaseCredentials {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean | { rejectUnauthorized: boolean };
}

export interface PostgresConnectionRequest {
  name: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  maxConnections?: number;
  idleTimeout?: number;
  connectionTimeout?: number;
  allowExplicitMax?: boolean;
}

export interface PostgresQueryResult {
  rows: any[];
  fields: any[];
  rowCount: number;
  command: string;
  executionTime: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}
