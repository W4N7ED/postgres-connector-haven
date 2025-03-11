
import { Request, Response, NextFunction } from 'express';
import { EXPRESS_CONFIG } from '../config';
import logger from '../utils/logger';

/**
 * Middleware to restrict access based on IP whitelist
 */
const ipRestriction = (req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.ip || req.socket.remoteAddress || '';
  
  // If no whitelist is configured, allow all
  if (!EXPRESS_CONFIG.ipWhitelist || EXPRESS_CONFIG.ipWhitelist.length === 0) {
    return next();
  }

  // Check if client IP is in whitelist
  const isWhitelisted = EXPRESS_CONFIG.ipWhitelist.some(ip => {
    return clientIp === ip || clientIp.includes(ip);
  });

  if (isWhitelisted) {
    return next();
  }

  logger.warn(`Access denied from non-whitelisted IP: ${clientIp}`);
  return res.status(403).json({
    success: false,
    error: 'Access denied. Your IP is not whitelisted.',
    timestamp: new Date()
  });
};

export default ipRestriction;
