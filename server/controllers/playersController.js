// Handles: getPlayers (available, in-auction, sold)


import { readDB } from '../utils/db.js';

// Returns all 12 players with their current status


const getPlayers = (req, res) => {
    const Players = readDB();
    res.json({ success: true, data: Players.players });
};

export { getPlayers };