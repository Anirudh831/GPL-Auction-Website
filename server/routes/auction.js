import express from 'express';
import {
    getAuctionState,
    startAuction,
    placeBid,
    acceptBid,
    rejectRound
} from '../controllers/auctionController.js';

const router = express.Router();

// GET /api/auction - Get current active auction state
router.get('/', getAuctionState);

// POST /api/auction/start - Start round for a player
router.post('/start', startAuction);

// POST /api/auction/bid - Place a bid
router.post('/bid', placeBid);

// POST /api/auction/accept - Sell player to highest bidder
router.post('/accept', acceptBid);

// POST /api/auction/reject - Mark player unsold
router.post('/reject', rejectRound);

export default router;
