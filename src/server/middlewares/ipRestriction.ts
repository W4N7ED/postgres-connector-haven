
import { Request, Response, NextFunction } from 'express';
import { EXPRESS_CONFIG } from '../config';
import logger from '../utils/logger';

/**
 * Middleware pour restreindre l'accès à l'API à certaines adresses IP
 */
const ipRestriction = (req: Request, res: Response, next: NextFunction) => {
  // Si la liste blanche est vide ou contient *, autoriser toutes les IP
  if (!EXPRESS_CONFIG.ipWhitelist || EXPRESS_CONFIG.ipWhitelist === '*') {
    return next();
  }

  // Récupérer l'IP du client
  const clientIp = req.ip || req.connection.remoteAddress || '';
  
  // Convertir la liste blanche en tableau
  const whitelistedIps = EXPRESS_CONFIG.ipWhitelist.split(',').map(ip => ip.trim());
  
  // Vérifier si l'IP est dans la liste blanche
  if (whitelistedIps.includes(clientIp) || whitelistedIps.includes('*')) {
    return next();
  }
  
  // Journaliser la tentative d'accès non autorisée
  logger.warn(`Accès refusé depuis l'IP ${clientIp}`);
  
  // Renvoyer une erreur 403 si l'IP n'est pas autorisée
  return res.status(403).json({
    success: false,
    error: 'Accès refusé: votre adresse IP n\'est pas autorisée',
    timestamp: new Date()
  });
};

export default ipRestriction;
