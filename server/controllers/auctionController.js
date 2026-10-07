// auctionController.js
// Handles: startAuction, placeBid, acceptBid, rejectRound, getAuctionState

import { readDB, writeDB } from '../utils/db.js';

const getAuctionState = (req, res) => {
    const db = readDB();
    const { currentPlayerId, status } = db.auction;
    let currentPlayer = null;
    let roundBids = [];
    let highestBid = null;
    if (currentPlayerId) {
        currentPlayer = db.players.find((p) => p.id === currentPlayerId) || null;
        roundBids = db.bids.filter((b) => b.playerId === currentPlayerId);
        if (roundBids.length > 0) {
            highestBid = roundBids[roundBids.length - 1];
        }
    }
    res.json({
        success: true,
        data: {
            status,
            currentPlayer,
            bids: roundBids,
            highestBid
        }
    });
};

const startAuction = (req, res) => {
    const db = readDB();
    if (db.auction.status === 'active' && db.auction.currentPlayerId) {
        return res.status(400).json({
            success: false,
            message: 'An auction round is already active. Accept or reject it first.'
        });
    }
    const { playerId } = req.body;
    let playerToAuction = null;
    if (playerId) {
        playerToAuction = db.players.find((p) => p.id === playerId && p.status === 'available');
    }
    else {
        playerToAuction = db.players.find((p) => p.status === 'available');
    }
    if (!playerToAuction) {
        return res.status(400).json({
            success: false,
            message: 'No available players left to auction.'
        });
    }
    playerToAuction.status = 'in_auction';
    db.auction = {
        currentPlayerId: playerToAuction.id,
        status: 'active'
    };
    writeDB(db);
    res.json({
        success: true,
        message: `Auction started for ${playerToAuction.name}`,
        data: {
            player: playerToAuction,
            auction: db.auction
        }
    });
};

const placeBid = (req, res) => {
    const { teamId, amount } = req.body;
    const bidAmount = Number(amount);
    //if some input required is missing
    if (!teamId || !bidAmount) {
        return res.status(400).json({
            success: false,
            message: 'teamId and amount are required.'
        });
    }
    const db = readDB();
    //if the auction status is not active
    if (db.auction.status !== 'active' || !db.auction.currentPlayerId) {
        return res.status(400).json({
            success: false,
            message: 'No active auction round currently.'
        });
    }
    const player = db.players.find((p) => p.id === db.auction.currentPlayerId);
    const team = db.teams.find((t) => t.id === teamId);
    //If the corresponding team is not there
    if (!team) {
        return res.status(404).json({
            success: false,
            message: 'Team not found.'
        });
    }
    const playerBids = db.bids.filter((b) => b.playerId === player.id);
    const highestBid = playerBids.length > 0 ? playerBids[playerBids.length - 1] : null;

    if (highestBid && highestBid.teamId === team.id) {
        return res.status(400).json({
            success: false,
            message: 'Your team already holds the highest bid.'
        });
    }

    const minBidRequired = highestBid ? highestBid.amount + 1000 : player.base_price;

    if (bidAmount < minBidRequired) {
        return res.status(400).json({
            success: false,
            message: `Bid must be at least ₹${minBidRequired.toLocaleString()}`
        });
    }

    if (team.remainingBudget < bidAmount) {
        return res.status(400).json({
            success: false,
            message: `${team.name} does not have enough budget. Remaining: ₹${team.remainingBudget.toLocaleString()}`
        });
    }
    //when all the cases pass
    const newBid = {
        id: `Bid-${Date.now()}`,
        playerId: player.id,
        teamId: team.id,
        teamName: team.name,
        amount: bidAmount,
        timestamp: new Date().toISOString()
    };
    db.bids.push(newBid);
    writeDB(db);
    res.json({
        success: true,
        message: `Bid of ₹${bidAmount.toLocaleString()} placed by ${team.name}`,
        data: newBid
    });
};

const acceptBid = (req, res) => {
    const db = readDB();
    if (db.auction.status !== 'active' || !db.auction.currentPlayerId) {
        return res.status(400).json({
            success: false,
            message: 'No active auction round to finalize.'
        });
    }
    const player = db.players.find((p) => p.id === db.auction.currentPlayerId);
    const playerBids = db.bids.filter((b) => b.playerId === player.id);
    if (playerBids.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'No bids were placed for this player. Use reject/pass instead.'
        });
    }

    const highestBid = playerBids[playerBids.length - 1];
    const team = db.teams.find((t) => t.id === highestBid.teamId);

    player.status = 'sold';
    player.sold_price = highestBid.amount;
    player.team_id = team.id;
    team.remainingBudget -= highestBid.amount;

    //after updating the player details just update the json file

    db.auction = {
        currentPlayerId: null,
        status: 'idle'
    };
    writeDB(db);

    res.json({
        success: true,
        message: `${player.name} sold to ${team.name} for ₹${highestBid.amount.toLocaleString()}`,
        data: {
            player,
            team
        }
    });
};

const rejectRound = (req, res) => {
    const db = readDB();
    if (db.auction.status !== 'active' || !db.auction.currentPlayerId) {
        return res.status(400).json({
            success: false,
            message: 'No active auction round to reject.'
        });
    }
    const player = db.players.find((p) => p.id === db.auction.currentPlayerId);
    player.status = 'available';
    db.auction = {
        currentPlayerId: null,
        status: 'idle'
    };
    writeDB(db);
    res.json({
        success: true,
        message: `${player.name} returned to available pool`,
        data: {
            player
        }
    });
};

export {
    getAuctionState,
    startAuction,
    placeBid,
    acceptBid,
    rejectRound
};
