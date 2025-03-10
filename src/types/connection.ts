
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
