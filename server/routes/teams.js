import express from 'express';
import { getTeams } from '../controllers/teamsController.js';

const router = express.Router();

// GET /api/teams
router.get('/', getTeams);

export default router;
