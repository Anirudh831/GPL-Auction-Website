import express from 'express';
import { getPlayers } from '../controllers/playersController.js';

const router = express.Router();

// GET /api/players
router.get('/', getPlayers);

export default router;
