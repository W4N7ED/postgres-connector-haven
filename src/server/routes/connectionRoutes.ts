
import { Router } from 'express';
import connectionController from '../controllers/connectionController';
import { authenticateUser, requireAdmin } from '../middlewares/auth';

const router = Router();

// Routes publiques - aucune
// Toutes les routes nécessitent une authentification

// Routes nécessitant uniquement une authentification
router.get('/', authenticateUser, connectionController.getAllConnections);
router.get('/:id', authenticateUser, connectionController.getConnectionById);
router.post('/:id/test', authenticateUser, connectionController.testConnection);
router.get('/:id/stats', authenticateUser, connectionController.getConnectionStats);
router.post('/:id/query', authenticateUser, connectionController.executeQuery);

// Routes nécessitant des privilèges d'administrateur
router.post('/', authenticateUser, requireAdmin, connectionController.createConnection);
router.put('/:id', authenticateUser, requireAdmin, connectionController.updateConnection);
router.delete('/:id', authenticateUser, requireAdmin, connectionController.deleteConnection);

export default router;
