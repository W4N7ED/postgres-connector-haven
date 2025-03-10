
import { Router } from 'express';
import authController from '../controllers/authController';
import { authenticateUser, requireAdmin } from '../middlewares/auth';

const router = Router();

// Routes publiques
router.post('/login', authController.login);

// Routes protégées
router.get('/me', authenticateUser, authController.getUserInfo);

// Routes pour admin uniquement
router.post('/register', authenticateUser, requireAdmin, authController.register);

export default router;
