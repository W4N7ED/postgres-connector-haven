
import { Router } from 'express';
import connectionController from '../controllers/connectionController';
import { authenticateUser, requireAdmin } from '../middlewares/auth';

const router = Router();

// Routes publiques - aucune
// Toutes les routes nécessitent une authentification

// Routes nécessitant uniquement une authentification
router.get('/', authenticateUser, (req, res) => {
  return connectionController.getAllConnections(req, res);
});

router.get('/:id', authenticateUser, (req, res) => {
  return connectionController.getConnectionById(req, res);
});

router.post('/:id/test', authenticateUser, (req, res) => {
  return connectionController.testConnection(req, res);
});

router.get('/:id/stats', authenticateUser, (req, res) => {
  return connectionController.getConnectionStats(req, res);
});

router.post('/:id/query', authenticateUser, (req, res) => {
  return connectionController.executeQuery(req, res);
});

// Routes nécessitant des privilèges d'administrateur
router.post('/', authenticateUser, requireAdmin, (req, res) => {
  return connectionController.createConnection(req, res);
});

router.put('/:id', authenticateUser, requireAdmin, (req, res) => {
  return connectionController.updateConnection(req, res);
});

router.delete('/:id', authenticateUser, requireAdmin, (req, res) => {
  return connectionController.deleteConnection(req, res);
});

export default router;
