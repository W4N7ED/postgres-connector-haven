
import { Request, Response, NextFunction } from 'express';
import { EXPRESS_CONFIG } from '../config';
import logger from '../utils/logger';

/**
 * Middleware pour restreindre l'accès par IP
 */
const ipRestriction = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Récupérer l'IP du client
    const clientIp = req.ip || req.connection.remoteAddress || '';
    
    // Liste blanche d'IPs depuis la configuration
    const whitelistStr = process.env.IP_WHITELIST || '127.0.0.1,::1,localhost';
    const whitelist = whitelistStr.split(',').map(ip => ip.trim());
    
    // Vérifier si l'IP est dans la liste blanche
    const isAllowed = whitelist.some(allowedIp => {
      // Correspondance exacte ou localhost
      return clientIp === allowedIp || 
             allowedIp === 'localhost' && (clientIp === '127.0.0.1' || clientIp === '::1') ||
             clientIp.includes(allowedIp); // Support partiel pour les sous-réseaux
    });
    
    if (isAllowed) {
      return next();
    }
    
    // IP non autorisée
    logger.warn(`Accès refusé pour l'IP: ${clientIp}`);
    return res.status(403).json({
      success: false,
      error: 'Forbidden: IP address not allowed',
      timestamp: new Date()
    });
  } catch (error) {
    logger.error(`Erreur dans la vérification d'IP: ${(error as Error).message}`);
    next();
  }
};

export default ipRestriction;
