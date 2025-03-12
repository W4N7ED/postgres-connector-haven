
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECURITY_CONFIG, EXPRESS_CONFIG } from '../config';
import logger from '../utils/logger';

// Interface pour les utilisateurs
interface User {
  id: string;
  username: string;
  password: string;
  role: string;
}

// Simuler une BD utilisateurs pour le moment
// Dans une application réelle, cela serait stocké dans PostgreSQL
const users: Map<string, User> = new Map();

/**
 * Hasher un mot de passe
 */
const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SECURITY_CONFIG.bcryptSaltRounds);
};

/**
 * Créer un utilisateur
 */
const createUser = async (username: string, password: string, role: string = 'user'): Promise<User> => {
  // Vérifier si l'utilisateur existe déjà
  const existingUserIds = Array.from(users.values())
    .filter(u => u.username === username)
    .map(u => u.id);
  
  if (existingUserIds.length > 0) {
    throw new Error(`User with username ${username} already exists`);
  }

  // Créer le nouvel utilisateur
  const hashedPassword = await hashPassword(password);
  const userId = Date.now().toString(36) + Math.random().toString(36).substring(2);
  
  const newUser: User = {
    id: userId,
    username,
    password: hashedPassword,
    role
  };

  users.set(userId, newUser);
  logger.info(`User created: ${username}`, { userId });
  
  // Ne pas retourner le mot de passe
  const { password: _, ...userWithoutPassword } = newUser;
  return { ...userWithoutPassword, password: '[REDACTED]' };
};

/**
 * Authentifier un utilisateur
 */
const authenticate = async (username: string, password: string): Promise<string | null> => {
  // Trouver l'utilisateur par nom d'utilisateur
  const user = Array.from(users.values()).find(u => u.username === username);
  
  if (!user) {
    logger.warn(`Authentication failed: User ${username} not found`);
    return null;
  }

  // Vérifier le mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    logger.warn(`Authentication failed: Invalid password for user ${username}`);
    return null;
  }

  // Générer un token JWT
  const payload = { 
    id: user.id,
    username: user.username,
    role: user.role
  };
  
  // Conversion explicite du type secret pour JWT
  const jwtSecret = EXPRESS_CONFIG.jwtSecret as jwt.Secret;
  
  const token = jwt.sign(
    payload, 
    jwtSecret, 
    { expiresIn: EXPRESS_CONFIG.jwtExpiration }
  );

  logger.info(`User ${username} authenticated successfully`);
  return token;
};

/**
 * Vérifier un token JWT
 */
const verifyToken = (token: string): jwt.JwtPayload | null => {
  try {
    const jwtSecret = EXPRESS_CONFIG.jwtSecret as jwt.Secret;
    return jwt.verify(token, jwtSecret) as jwt.JwtPayload;
  } catch (error) {
    logger.error(`Token verification failed: ${(error as Error).message}`);
    return null;
  }
};

/**
 * Obtenir un utilisateur par son ID
 */
const getUserById = (userId: string): Omit<User, 'password'> | null => {
  const user = users.get(userId);
  
  if (!user) {
    return null;
  }

  // Ne pas retourner le mot de passe
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Créer un utilisateur administrateur par défaut pour le développement
const initAdminUser = async () => {
  try {
    // Vérifier si un administrateur existe déjà
    const adminExists = Array.from(users.values()).some(u => u.role === 'admin');
    
    if (!adminExists) {
      await createUser(
        process.env.ADMIN_USERNAME || 'admin',
        process.env.ADMIN_PASSWORD || 'admin123',
        'admin'
      );
      logger.info('Default admin user created');
    }
  } catch (error) {
    logger.error(`Failed to create admin user: ${(error as Error).message}`);
  }
};

export default {
  createUser,
  authenticate,
  verifyToken,
  getUserById,
  initAdminUser
};
