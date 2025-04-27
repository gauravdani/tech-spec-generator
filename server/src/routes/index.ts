import express from 'express';
import { generateSpec } from '../controllers/specController';

const router = express.Router();

router.post('/generate-spec', generateSpec);

export default router; 