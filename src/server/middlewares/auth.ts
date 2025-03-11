
import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';
import logger from '../utils/logger';
import { ApiResponse } from '@/types/connection';

// Étendre l'interface Request pour inclure l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware pour vérifier si l'utilisateur est authentifié
 */
const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Récupérer le token d'authentification
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Authentication required',
        timestamp: new Date()
      };
      
      res.status(401).json(response);
      return;
    }

    // Extraire et vérifier le token
    const token = authHeader.split(' ')[1];
    const decoded = authService.verifyToken(token);
    
    if (!decoded) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid or expired token',
        timestamp: new Date()
      };
      
      res.status(401).json(response);
      return;
    }

    // Ajouter l'utilisateur à la requête
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    };

    next();
  } catch (error: any) {
    logger.error(`Authentication middleware error: ${error.message}`, { error });
    
    const response: ApiResponse<null> = {
      success: false,
      error: 'Authentication failed',
      timestamp: new Date()
    };
    
    res.status(500).json(response);
  }
};

/**
 * Middleware pour vérifier si l'utilisateur a le rôle admin
 */
const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Admin privileges required',
      timestamp: new Date()
    };
    
    res.status(403).json(response);
    return;
  }
  
  next();
};

export { authenticateUser, requireAdmin };
