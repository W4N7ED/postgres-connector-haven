
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

// Configuration de sécurité
const SECURITY_CONFIG = {
  // Ces valeurs devraient être chargées depuis des variables d'environnement dans un environnement de production
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: '24h',
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
};

// Type pour représenter un utilisateur
interface User {
  id: string;
  username: string;
  password: string;
  email: string;
}

// Utilisateurs fictifs pour la démonstration
const users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: '$2b$10$AkPXa0.7J.1jZ1MxzCH.4OL9BJ5SSAXZCulI8pUO4X0wPjjZRTTIa', // "password"
    email: 'admin@example.com',
  },
];

/**
 * Hasher un mot de passe
 */
const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SECURITY_CONFIG.bcryptSaltRounds);
};

/**
 * Comparer un mot de passe avec un hash
 */
const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Générer un token JWT
 */
const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId }, 
    SECURITY_CONFIG.jwtSecret as string, 
    { expiresIn: SECURITY_CONFIG.jwtExpiresIn }
  );
};

/**
 * Vérifier un token JWT
 */
const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, SECURITY_CONFIG.jwtSecret as string);
  } catch (error) {
    logger.error('Erreur lors de la vérification du token JWT:', error);
    return null;
  }
};

/**
 * Authentifier un utilisateur avec username/password
 */
const authenticate = async (username: string, password: string): Promise<{ user: Omit<User, 'password'>, token: string } | null> => {
  const user = users.find((u) => u.username === username);
  
  if (!user) {
    return null;
  }
  
  const isPasswordValid = await comparePassword(password, user.password);
  
  if (!isPasswordValid) {
    return null;
  }
  
  const token = generateToken(user.id);
  
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword,
    token,
  };
};

/**
 * Création d'un nouvel utilisateur
 */
const createUser = async (username: string, password: string, email: string): Promise<Omit<User, 'password'>> => {
  const hashedPassword = await hashPassword(password);
  
  const newUser: User = {
    id: uuidv4(),
    username,
    password: hashedPassword,
    email,
  };
  
  users.push(newUser);
  
  const { password: _, ...userWithoutPassword } = newUser;
  
  return userWithoutPassword;
};

export default {
  authenticate,
  createUser,
  verifyToken,
  hashPassword,
  comparePassword,
};
