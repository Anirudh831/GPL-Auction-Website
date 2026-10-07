// server/tests/accept.test.js
import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

function processAcceptRound({ player, team, highestBid }) {
  if (!highestBid) {
    return { success: false, error: 'No bids placed.' };
  }
  const updatedPlayer = {
    ...player,
    status: 'sold',
    sold_price: highestBid.amount,
    team_id: team.id,
  };
  const updatedTeam = {
    ...team,
    remainingBudget: team.remainingBudget - highestBid.amount,
  };
  return { success: true, player: updatedPlayer, team: updatedTeam };
}

function processRejectRound({ player }) {
  return {
    success: true,
    player: {
      ...player,
      status: 'available',
      sold_price: null,
      team_id: null,
    },
  };
}

describe('Auctioneer Accept & Reject Rules', () => {
  const initialPlayer = { id: 'Player-1', name: 'Jasprit Bumrah', status: 'in_auction', base_price: 30000 };
  const initialTeam = { id: 'Team-1', name: 'Mumbai Indians', remainingBudget: 500000 };

  it('correctly updates player to sold and assigns to team on accept', () => {
    const highestBid = { teamId: 'Team-1', amount: 45000 };
    const res = processAcceptRound({ player: initialPlayer, team: initialTeam, highestBid });

    assert.equal(res.success, true);
    assert.equal(res.player.status, 'sold');
    assert.equal(res.player.sold_price, 45000);
    assert.equal(res.player.team_id, 'Team-1');
  });

  it('deducts the accepted bid amount from team remaining budget', () => {
    const highestBid = { teamId: 'Team-1', amount: 45000 };
    const res = processAcceptRound({ player: initialPlayer, team: initialTeam, highestBid });

    assert.equal(res.team.remainingBudget, 455000);
  });

  it('rejects accept action if no bids were placed', () => {
    const res = processAcceptRound({ player: initialPlayer, team: initialTeam, highestBid: null });
    assert.equal(res.success, false);
    assert.equal(res.error, 'No bids placed.');
  });

  it('returns player status to available when round is rejected', () => {
    const res = processRejectRound({ player: initialPlayer });
    assert.equal(res.success, true);
    assert.equal(res.player.status, 'available');
    assert.equal(res.player.team_id, null);
  });
});
