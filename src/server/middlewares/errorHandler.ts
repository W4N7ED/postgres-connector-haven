
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { ApiResponse } from '@/types/connection';

/**
 * Middleware pour gérer les erreurs
 */
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });

  const response: ApiResponse<null> = {
    success: false,
    error: err.message,
    timestamp: new Date()
  };

  res.status(statusCode).json(response);
};

export default errorHandler;
