// teamsController.js
// Handles: getTeams with roster and remaining budget

import { readDB } from '../utils/db.js';

// GET /api/teams
// Returns all 4 teams, each with their bought players attached
const getTeams = (req, res) => {
    const db = readDB();

    // For each team, find the players that belong to it
    const teamsWithRoster = db.teams.map((team) => {
        const roster = db.players.filter((p) => p.team_id === team.id);
        return { ...team, roster };
    });

    res.json({ success: true, data: teamsWithRoster });
};

export { getTeams };