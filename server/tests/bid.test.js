// server/tests/bid.test.js
import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Helper logic representing bid validation rules
function validateBid({ team, player, highestBid, bidAmount }) {
  if (!team) return { valid: false, error: 'Team not found.' };
  if (!player || player.status !== 'in_auction') return { valid: false, error: 'Player not currently in auction.' };
  
  if (highestBid && highestBid.teamId === team.id) {
    return { valid: false, error: 'Your team already holds the highest bid.' };
  }

  const minBidRequired = highestBid ? highestBid.amount + 1000 : player.base_price;
  if (bidAmount < minBidRequired) {
    return { valid: false, error: `Bid must be at least ₹${minBidRequired}` };
  }

  if (team.remainingBudget < bidAmount) {
    return { valid: false, error: 'Insufficient budget.' };
  }

  return { valid: true };
}

describe('Bid Validation Rules', () => {
  const sampleTeam = { id: 'Team-1', name: 'Mumbai Indians', remainingBudget: 500000 };
  const samplePlayer = { id: 'Player-1', name: 'Virat Kohli', base_price: 20000, status: 'in_auction' };

  it('rejects bids lower than base price for initial bid', () => {
    const res = validateBid({
      team: sampleTeam,
      player: samplePlayer,
      highestBid: null,
      bidAmount: 15000,
    });
    assert.equal(res.valid, false);
    assert.match(res.error, /Bid must be at least/);
  });

  it('accepts bids equal to or higher than base price', () => {
    const res = validateBid({
      team: sampleTeam,
      player: samplePlayer,
      highestBid: null,
      bidAmount: 20000,
    });
    assert.equal(res.valid, true);
  });

  it('rejects bid if team already holds the highest bid', () => {
    const highestBid = { teamId: 'Team-1', amount: 20000 };
    const res = validateBid({
      team: sampleTeam,
      player: samplePlayer,
      highestBid,
      bidAmount: 25000,
    });
    assert.equal(res.valid, false);
    assert.equal(res.error, 'Your team already holds the highest bid.');
  });

  it('rejects bids that do not meet the minimum increment (+1000)', () => {
    const highestBid = { teamId: 'Team-2', amount: 20000 };
    const res = validateBid({
      team: sampleTeam,
      player: samplePlayer,
      highestBid,
      bidAmount: 20500,
    });
    assert.equal(res.valid, false);
    assert.match(res.error, /Bid must be at least/);
  });

  it('rejects bids exceeding the team remaining budget', () => {
    const poorTeam = { id: 'Team-3', name: 'Low Budget', remainingBudget: 10000 };
    const res = validateBid({
      team: poorTeam,
      player: samplePlayer,
      highestBid: null,
      bidAmount: 20000,
    });
    assert.equal(res.valid, false);
    assert.equal(res.error, 'Insufficient budget.');
  });
});
