
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
// Fix logger import
import logger from '../utils/logger';

// Configuration de sécurité
const SECURITY_CONFIG = {
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS) : 10,
  jwtSecret: process.env.JWT_SECRET || 'default_secret_key_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRATION || '24h'
};

// Simulation d'une base d'utilisateurs pour le développement
// En production, cela serait remplacé par une vraie base de données
let users = [
  // L'utilisateur administrateur est créé au démarrage du serveur
];

// Initialisation de l'utilisateur admin à partir des variables d'environnement
const initAdminUser = () => {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  // Vérifie si l'utilisateur admin existe déjà
  if (!users.find(user => user.username === adminUsername)) {
    const hashedPassword = bcrypt.hashSync(adminPassword, SECURITY_CONFIG.bcryptSaltRounds);
    users.push({
      id: uuidv4(),
      username: adminUsername,
      password: hashedPassword,
      isAdmin: true
    });
    logger.info(`Utilisateur admin "${adminUsername}" initialisé`);
  }
};

// Appel de l'initialisation au démarrage
initAdminUser();

/**
 * Générer un token JWT
 */
const generateToken = (userId: string): string => {
  // Fix JWT signing by properly typing the secret
  const secret = SECURITY_CONFIG.jwtSecret as jwt.Secret;
  return jwt.sign(
    { id: userId }, 
    secret,
    { expiresIn: SECURITY_CONFIG.jwtExpiresIn }
  );
};

/**
 * Vérifier un token JWT
 */
const verifyToken = (token: string): any => {
  try {
    // Fix JWT verification by properly typing the secret
    const secret = SECURITY_CONFIG.jwtSecret as jwt.Secret;
    return jwt.verify(token, secret);
  } catch (error) {
    logger.error('Erreur lors de la vérification du token JWT:', error);
    return null;
  }
};

/**
 * Authentifier un utilisateur
 */
const authenticateUser = async (username: string, password: string) => {
  const user = users.find(u => u.username === username);
  
  if (!user) {
    logger.warn(`Tentative de connexion avec un utilisateur inexistant: ${username}`);
    return null;
  }
  
  const passwordMatch = await bcrypt.compare(password, user.password);
  
  if (!passwordMatch) {
    logger.warn(`Échec d'authentification pour l'utilisateur: ${username}`);
    return null;
  }
  
  logger.info(`Utilisateur authentifié avec succès: ${username}`);
  return {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin,
    token: generateToken(user.id)
  };
};

// Export individual functions instead of default export
export {
  authenticateUser,
  verifyToken,
  SECURITY_CONFIG
};
