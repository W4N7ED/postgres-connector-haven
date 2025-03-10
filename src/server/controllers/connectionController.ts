
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { 
  PostgresConnection, 
  PostgresConnectionRequest,
  ApiResponse 
} from '@/types/connection';
import connectionService from '../services/connectionService';
import logger from '../utils/logger';

// Simuler une base de données pour stocker les connexions
// Dans une véritable application, celles-ci seraient stockées dans une base de données
let connections: PostgresConnection[] = [];

/**
 * Récupérer toutes les connexions
 */
const getAllConnections = async (req: Request, res: Response) => {
  try {
    // Masquer les mots de passe dans la réponse
    const sanitizedConnections = connections.map(conn => ({
      ...conn,
      password: '********'
    }));

    const response: ApiResponse<PostgresConnection[]> = {
      success: true,
      data: sanitizedConnections,
      timestamp: new Date()
    };

    res.json(response);
  } catch (error: any) {
    logger.error(`Failed to get connections: ${error.message}`, { error });
    
    const response: ApiResponse<null> = {
      success: false,
      error: error.message,
      timestamp: new Date()
    };
    
    res.status(500).json(response);
  }
};

/**
 * Récupérer une connexion par ID
 */
const getConnectionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = connections.find(conn => conn.id === id);
    
    if (!connection) {
      const response: ApiResponse<null> = {
        success: false,
        error: `Connection with ID ${id} not found`,
        timestamp: new Date()
      };
      
      return res.status(404).json(response);
    }

    // Masquer le mot de passe
    const sanitizedConnection = {
      ...connection,
      password: '********'
    };

    const response: ApiResponse<PostgresConnection> = {
      success: true,
      data: sanitizedConnection,
      timestamp: new Date()
    };
    
    res.json(response);
  } catch (error: any) {
    logger.error(`Failed to get connection: ${error.message}`, { error, connectionId: req.params.id });
    
    const response: ApiResponse<null> = {
      success: false,
      error: error.message,
      timestamp: new Date()
    };
    
    res.status(500).json(response);
  }
};

/**
 * Créer une nouvelle connexion
 */
const createConnection = async (req: Request, res: Response) => {
  try {
    const connectionData: PostgresConnectionRequest = req.body;
    
    // Validation des données de base
    if (!connectionData.name || !connectionData.host || !connectionData.database || !connectionData.username) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Missing required fields: name, host, database, username',
        timestamp: new Date()
      };
      
      return res.status(400).json(response);
    }

    // Créer l'objet de connexion
    const newConnection: PostgresConnection = {
      id: uuidv4(),
      name: connectionData.name,
      host: connectionData.host,
      port: connectionData.port || 5432,
      database: connectionData.database,
      username: connectionData.username,
      password: connectionData.password,
      ssl: connectionData.ssl || false,
      status: 'unknown',
      maxConnections: connectionData.maxConnections,
      idleTimeout: connectionData.idleTimeout,
      connectionTimeout: connectionData.connectionTimeout,
      allowExplicitMax: connectionData.allowExplicitMax,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Ajouter à notre "base de données"
    connections.push(newConnection);
    logger.info(`Connection created: ${newConnection.name}`, { connectionId: newConnection.id });

    // Masquer le mot de passe dans la réponse
    const sanitizedConnection = {
      ...newConnection,
      password: '********'
    };

    const response: ApiResponse<PostgresConnection> = {
      success: true,
      data: sanitizedConnection,
      timestamp: new Date()
    };

    res.status(201).json(response);
  } catch (error: any) {
    logger.error(`Failed to create connection: ${error.message}`, { error });
    
    const response: ApiResponse<null> = {
      success: false,
      error: error.message,
      timestamp: new Date()
    };
    
    res.status(500).json(response);
  }
};

/**
 * Mettre à jour une connexion existante
 */
const updateConnection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connectionData: Partial<PostgresConnection> = req.body;
    
    // Trouver la connexion existante
    const connectionIndex = connections.findIndex(conn => conn.id === id);
    if (connectionIndex === -1) {
      const response: ApiResponse<null> = {
        success: false,
        error: `Connection with ID ${id} not found`,
        timestamp: new Date()
      };
      
      return res.status(404).json(response);
    }

    // Mettre à jour la connexion
    const updatedConnection = {
      ...connections[connectionIndex],
      ...connectionData,
      updatedAt: new Date()
    };

    connections[connectionIndex] = updatedConnection;
    logger.info(`Connection updated: ${updatedConnection.name}`, { connectionId: id });

    // Si le pool existe, le fermer pour qu'il soit recréé avec les nouveaux paramètres
    await connectionService.closeConnectionPool(id);

    // Masquer le mot de passe dans la réponse
    const sanitizedConnection = {
      ...updatedConnection,
      password: '********'
    };

    const response: ApiResponse<PostgresConnection> = {
      success: true,
      data: sanitizedConnection,
      timestamp: new Date()
    };

    res.json(response);
  } catch (error: any) {
    logger.error(`Failed to update connection: ${error.message}`, { error, connectionId: req.params.id });
    
    const response: ApiResponse<null> = {
      success: false,
      error: error.message,
      timestamp: new Date()
    };
    
    res.status(500).json(response);
  }
};

/**
 * Supprimer une connexion
 */
const deleteConnection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Vérifier si la connexion existe
    const connectionExists = connections.some(conn => conn.id === id);
    if (!connectionExists) {
      const response: ApiResponse<null> = {
        success: false,
        error: `Connection with ID ${id} not found`,
        timestamp: new Date()
      };
      
      return res.status(404).json(response);
    }

    // Fermer le pool de connexions s'il existe
    await connectionService.closeConnectionPool(id);

    // Supprimer la connexion
    connections = connections.filter(conn => conn.id !== id);
    logger.info(`Connection deleted`, { connectionId: id });

    const response: ApiResponse<{ id: string }> = {
      success: true,
      data: { id },
      timestamp: new Date()
    };

    res.json(response);
  } catch (error: any) {
    logger.error(`Failed to delete connection: ${error.message}`, { error, connectionId: req.params.id });
    
    const response: ApiResponse<null> = {
      success: false,
      error: error.message,
      timestamp: new Date()
    };
    
    res.status(500).json(response);
  }
};

/**
 * Tester une connexion
 */
const testConnection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Trouver la connexion
    const connection = connections.find(conn => conn.id === id);
    if (!connection) {
      const response: ApiResponse<null> = {
        success: false,
        error: `Connection with ID ${id} not found`,
        timestamp: new Date()
      };
      
      return res.status(404).json(response);
    }

    // Tester la connexion
    const testResult = await connectionService.testConnection(connection);

    // Mettre à jour le statut de la connexion
    const connectionIndex = connections.findIndex(conn => conn.id === id);
    connections[connectionIndex] = {
      ...connection,
      status: testResult.success ? 'connected' : 'error',
      lastConnected: testResult.success ? new Date() : connection.lastConnected,
      updatedAt: new Date()
    };

    const response: ApiResponse<typeof testResult> = {
      success: true,
      data: testResult,
      timestamp: new Date()
    };

    res.json(response);
  } catch (error: any) {
    logger.error(`Failed to test connection: ${error.message}`, { error, connectionId: req.params.id });
    
    const response: ApiResponse<null> = {
      success: false,
      error: error.message,
      timestamp: new Date()
    };
    
    res.status(500).json(response);
  }
};

/**
 * Exécuter une requête SQL
 */
const executeQuery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { query, params } = req.body;
    
    if (!query) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Query is required',
        timestamp: new Date()
      };
      
      return res.status(400).json(response);
    }

    // Trouver la connexion
    const connection = connections.find(conn => conn.id === id);
    if (!connection) {
      const response: ApiResponse<null> = {
        success: false,
        error: `Connection with ID ${id} not found`,
        timestamp: new Date()
      };
      
      return res.status(404).json(response);
    }

    // Créer un pool de connexions si nécessaire
    connectionService.createConnectionPool(connection);

    // Exécuter la requête
    const result = await connectionService.executeQuery(id, query, params);

    // Mise à jour du statut de connexion
    const connectionIndex = connections.findIndex(conn => conn.id === id);
    connections[connectionIndex] = {
      ...connection,
      status: 'connected',
      lastConnected: new Date(),
      updatedAt: new Date()
    };

    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
      timestamp: new Date()
    };

    res.json(response);
  } catch (error: any) {
    logger.error(`Failed to execute query: ${error.message}`, { error, connectionId: req.params.id });
    
    // Mise à jour du statut de connexion en cas d'erreur
    const { id } = req.params;
    const connectionIndex = connections.findIndex(conn => conn.id === id);
    if (connectionIndex !== -1) {
      connections[connectionIndex] = {
        ...connections[connectionIndex],
        status: 'error',
        updatedAt: new Date()
      };
    }

    const response: ApiResponse<null> = {
      success: false,
      error: error.message,
      timestamp: new Date()
    };
    
    res.status(500).json(response);
  }
};

/**
 * Obtenir les statistiques d'une connexion
 */
const getConnectionStats = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Trouver la connexion
    const connection = connections.find(conn => conn.id === id);
    if (!connection) {
      const response: ApiResponse<null> = {
        success: false,
        error: `Connection with ID ${id} not found`,
        timestamp: new Date()
      };
      
      return res.status(404).json(response);
    }

    // Créer un pool de connexions si nécessaire
    connectionService.createConnectionPool(connection);

    // Obtenir les statistiques
    const stats = await connectionService.getConnectionStats(id);

    const response: ApiResponse<typeof stats> = {
      success: true,
      data: stats,
      timestamp: new Date()
    };

    res.json(response);
  } catch (error: any) {
    logger.error(`Failed to get connection stats: ${error.message}`, { error, connectionId: req.params.id });
    
    const response: ApiResponse<null> = {
      success: false,
      error: error.message,
      timestamp: new Date()
    };
    
    res.status(500).json(response);
  }
};

export default {
  getAllConnections,
  getConnectionById,
  createConnection,
  updateConnection,
  deleteConnection,
  testConnection,
  executeQuery,
  getConnectionStats
};
