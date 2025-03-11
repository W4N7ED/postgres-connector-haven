
import { Router } from 'express';
import authController from '../controllers/authController';
import { authenticateUser, requireAdmin } from '../middlewares/auth';

const router = Router();

// Routes publiques
router.post('/login', (req, res) => {
  authController.login(req, res);
});

// Routes protégées
router.get('/me', authenticateUser, (req, res) => {
  authController.getUserInfo(req, res);
});

// Routes pour admin uniquement
router.post('/register', authenticateUser, requireAdmin, (req, res) => {
  authController.register(req, res);
});

export default router;
