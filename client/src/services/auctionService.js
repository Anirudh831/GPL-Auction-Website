// auctionService.js
import api from './api.js';

export const getAuctionState = async () => {
    const res = await api.get('/auction');
    return res.data;
};

export const startAuction = async (playerId = null) => {
    const body = playerId ? { playerId } : {};
    const res = await api.post('/auction/start', body);
    return res;
};

export const placeBid = async (teamId, amount) => {
    const res = await api.post('/auction/bid', { teamId, amount });
    return res;
};

export const acceptBid = async () => {
    const res = await api.post('/auction/accept');
    return res;
};

export const rejectRound = async () => {
    const res = await api.post('/auction/reject');
    return res;
};

export default {
    getAuctionState,
    startAuction,
    placeBid,
    acceptBid,
    rejectRound
};
