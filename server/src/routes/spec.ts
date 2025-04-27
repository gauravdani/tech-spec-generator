import express from 'express';
import { specController } from '../controllers/specController';

const router = express.Router();

router.post('/generate', specController.generate);
router.get('/', specController.getAll);
router.get('/:id', specController.getById);

export default router; 