
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
// Fix logger import
import logger from '../utils/logger';

// Security configuration
const SECURITY_CONFIG = {
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS) : 10,
  jwtSecret: process.env.JWT_SECRET || 'default_secret_key_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRATION || '24h'
};

// User store simulation for development
// In production, this would be replaced with a real database
let users = [
  // Admin user is created at server startup
];

// Initialize admin user from environment variables
const initAdminUser = () => {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  // Check if admin user already exists
  if (!users.find(user => user.username === adminUsername)) {
    const hashedPassword = bcrypt.hashSync(adminPassword, SECURITY_CONFIG.bcryptSaltRounds);
    users.push({
      id: uuidv4(),
      username: adminUsername,
      password: hashedPassword,
      isAdmin: true
    });
    logger.info(`Admin user "${adminUsername}" initialized`);
  }
};

// Call initialization at startup
initAdminUser();

/**
 * Generate a JWT token
 */
const generateToken = (userId: string): string => {
  // Cast the secret to the proper type expected by jwt.sign
  const secret: jwt.Secret = SECURITY_CONFIG.jwtSecret;
  
  return jwt.sign(
    { id: userId }, 
    secret,
    { expiresIn: SECURITY_CONFIG.jwtExpiresIn }
  );
};

/**
 * Verify a JWT token
 */
const verifyToken = (token: string): any => {
  try {
    // Cast the secret to the proper type expected by jwt.verify
    const secret: jwt.Secret = SECURITY_CONFIG.jwtSecret;
    return jwt.verify(token, secret);
  } catch (error) {
    logger.error('Error verifying JWT token:', error);
    return null;
  }
};

/**
 * Authenticate a user
 */
const authenticateUser = async (username: string, password: string) => {
  const user = users.find(u => u.username === username);
  
  if (!user) {
    logger.warn(`Login attempt with non-existent user: ${username}`);
    return null;
  }
  
  const passwordMatch = await bcrypt.compare(password, user.password);
  
  if (!passwordMatch) {
    logger.warn(`Authentication failed for user: ${username}`);
    return null;
  }
  
  logger.info(`User authenticated successfully: ${username}`);
  return {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin,
    token: generateToken(user.id)
  };
};

// Export individual functions
export {
  authenticateUser,
  verifyToken,
  SECURITY_CONFIG
};
