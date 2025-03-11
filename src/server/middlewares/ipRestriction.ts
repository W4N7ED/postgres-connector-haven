
import { Request, Response, NextFunction } from 'express';
import { networkInterfaces } from 'os';
import dotenv from 'dotenv';
import logger from '../utils/logger';

// Charger les variables d'environnement
dotenv.config();

/**
 * Récupère l'adresse IP du client en tenant compte des en-têtes de proxy
 * @param req La requête Express
 * @returns L'adresse IP du client
 */
export const getClientIp = (req: Request): string => {
  // Vérifier les en-têtes de proxy couramment utilisés
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    // x-forwarded-for peut contenir plusieurs IPs séparées par des virgules
    // On prend généralement la première qui est l'IP du client original
    return Array.isArray(forwardedFor) 
      ? forwardedFor[0].split(',')[0].trim() 
      : forwardedFor.split(',')[0].trim();
  }
  
  // Autres en-têtes courants
  if (req.headers['x-real-ip']) {
    return req.headers['x-real-ip'] as string;
  }
  
  // Fallback sur l'IP de connexion directe
  return req.ip || req.socket.remoteAddress || '0.0.0.0';
};

/**
 * Obtient la liste des adresses IP locales du serveur
 * @returns Un tableau contenant toutes les adresses IP locales
 */
export const getLocalIps = (): string[] => {
  const interfaces = networkInterfaces();
  const ips: string[] = [];

  Object.keys(interfaces).forEach(ifName => {
    const iface = interfaces[ifName];
    if (iface) {
      for (const alias of iface) {
        if (alias.family === 'IPv4' || alias.family === 4) {
          ips.push(alias.address);
        } else if (alias.family === 'IPv6' || alias.family === 6) {
          ips.push(alias.address);
        }
      }
    }
  });

  return ips;
};

/**
 * Middleware pour restreindre l'accès basé sur l'adresse IP
 */
export const ipRestriction = (req: Request, res: Response, next: NextFunction) => {
  // Si aucune liste blanche n'est définie, on autorise toutes les connexions
  const ipWhitelist = process.env.IP_WHITELIST;
  if (!ipWhitelist) {
    return next();
  }

  const clientIp = getClientIp(req);
  const allowedIps = ipWhitelist.split(',').map(ip => ip.trim());
  
  // Ajouter automatiquement les adresses IP locales
  const localIps = getLocalIps();
  const allAllowedIps = [...new Set([...allowedIps, ...localIps, '127.0.0.1', '::1', 'localhost'])];

  // Vérifier si l'IP du client est dans la liste blanche
  if (allAllowedIps.includes(clientIp)) {
    return next();
  }

  // Journaliser la tentative d'accès refusée
  logger.warn(`Accès refusé pour l'IP: ${clientIp}`);
  
  // Renvoyer une erreur 403 Forbidden
  return res.status(403).json({
    success: false,
    error: 'Accès refusé: votre adresse IP n\'est pas autorisée',
    timestamp: new Date()
  });
};

export default ipRestriction;
