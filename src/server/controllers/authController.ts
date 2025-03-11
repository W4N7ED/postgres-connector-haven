
import { Request, Response } from 'express';
import authService from '../services/authService';
import logger from '../utils/logger';
import { ApiResponse } from '@/types/connection';

/**
 * Inscription d'un nouvel utilisateur
 */
const register = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;
    
    if (!username || !password) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Username and password are required',
        timestamp: new Date()
      };
      
      return res.status(400).json(response);
    }

    // Dans un environnement de production, le rôle devrait être restreint
    // Seul un admin devrait pouvoir créer d'autres admins
    const userRole = role === 'admin' 
      ? (req.user?.role === 'admin' ? 'admin' : 'user') 
      : (role || 'user');

    const user = await authService.createUser(username, password, userRole);

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
      timestamp: new Date()
    };

    res.status(201).json(response);
  } catch (error: any) {
    logger.error(`Registration failed: ${error.message}`, { error });
    
    const response: ApiResponse<null> = {
      success: false,
      error: error.message,
      timestamp: new Date()
    };
    
    res.status(500).json(response);
  }
};

/**
 * Connexion d'un utilisateur
 */
const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Username and password are required',
        timestamp: new Date()
      };
      
      return res.status(400).json(response);
    }

    const token = await authService.authenticate(username, password);
    
    if (!token) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid credentials',
        timestamp: new Date()
      };
      
      return res.status(401).json(response);
    }

    const response: ApiResponse<{ token: string }> = {
      success: true,
      data: { token },
      timestamp: new Date()
    };

    res.json(response);
  } catch (error: any) {
    logger.error(`Login failed: ${error.message}`, { error });
    
    const response: ApiResponse<null> = {
      success: false,
      error: error.message,
      timestamp: new Date()
    };
    
    res.status(500).json(response);
  }
};

/**
 * Informations sur l'utilisateur connecté
 */
const getUserInfo = async (req: Request, res: Response) => {
  try {
    // L'utilisateur sera ajouté à la requête par le middleware d'authentification
    const user = req.user;
    
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User not authenticated',
        timestamp: new Date()
      };
      
      return res.status(401).json(response);
    }

    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
      timestamp: new Date()
    };

    res.json(response);
  } catch (error: any) {
    logger.error(`Get user info failed: ${error.message}`, { error });
    
    const response: ApiResponse<null> = {
      success: false,
      error: error.message,
      timestamp: new Date()
    };
    
    res.status(500).json(response);
  }
};

export default {
  register,
  login,
  getUserInfo
};
