import { useState, useEffect } from 'react';
import { placeBid } from '../services/auctionService.js';

function BidBox({
  team,
  auctionState,
  players = [],
  onActionDone,
}) {
  const [bidAmount, setBidAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isActive = auctionState?.status === 'active' && !!auctionState?.currentPlayer;
  const currentPlayer = auctionState?.currentPlayer;
  const highestBid = auctionState?.highestBid ?? null;

  // Calculate minimum valid bid
  const minBidRequired = highestBid
    ? Number(highestBid.amount) + 1000
    : Number(currentPlayer?.base_price ?? 0);

  // Is this team already the highest bidder?
  const isHighestBidder = !!(team && highestBid && highestBid.teamId === team.id);

  // Count players already bought by this team
  const squadCount = players.filter((p) => p.team_id === team?.id).length;

  // Whenever the active player or highest bid changes, default the input to minBidRequired
  useEffect(() => {
    if (isActive && minBidRequired > 0) {
      setBidAmount(minBidRequired);
      setError('');
      setSuccessMsg('');
    }
  }, [currentPlayer?.id, highestBid?.amount, isActive, minBidRequired]);

  if (!team) {
    return (
      <div className="card">
        <h3 style={{ marginBottom: 8 }}>Team Manager</h3>
        <p style={{ color: 'var(--text-muted)' }}>
          No team selected. Please switch roles and pick a team.
        </p>
      </div>
    );
  }

  const remainingBudget = team.remainingBudget ?? 0;
  const parsedBid = Number(bidAmount);
  const canAfford = remainingBudget >= minBidRequired;
  const isBidValid =
    isActive &&
    parsedBid >= minBidRequired &&
    parsedBid <= remainingBudget &&
    !busy;

  const handleResetToMin = () => {
    setError('');
    setSuccessMsg('');
    setBidAmount(minBidRequired);
  };

  const handleSubmitBid = async (e) => {
    if (e) e.preventDefault();
    if (!isBidValid) return;

    setBusy(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await placeBid(team.id, parsedBid);
      setSuccessMsg(res?.message || `Bid of ₹${parsedBid.toLocaleString()} placed successfully!`);
      if (onActionDone) await onActionDone();
    } catch (err) {
      setError(err.message || 'Failed to place bid.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card bid-box-panel">
      {/* Team Info Header */}
      <div className="flex-between" style={{ marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid var(--card-border)' }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{team.name}</h3>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Squad: <strong>{squadCount}</strong> players
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Budget Left
          </div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>
            ₹{remainingBudget.toLocaleString()}
          </div>
        </div>
      </div>

      {!isActive ? (
        <div style={{ padding: '16px 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            ⏳ No active auction round right now.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Waiting for the auctioneer to bring up the next player...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmitBid}>
          {/* Highest bidder banner */}
          {isHighestBidder ? (
            <div
              style={{
                background: 'var(--bg-color)',
                border: '1px solid var(--card-border)',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 14,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Your team holds the highest bid of ₹{(highestBid?.amount ?? 0).toLocaleString()}!
            </div>
          ) : highestBid ? (
            <div
              style={{
                background: 'var(--bg-color)',
                border: '1px solid var(--card-border)',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 14,
                fontSize: 14,
              }}
            >
              Current Highest: <strong>₹{(highestBid.amount ?? 0).toLocaleString()}</strong> by{' '}
              <span style={{ fontWeight: 600 }}>{highestBid.teamName}</span>
            </div>
          ) : (
            <div
              style={{
                background: 'var(--bg-color)',
                border: '1px solid var(--card-border)',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 14,
                fontSize: 14,
              }}
            >
              Opening bid round — Base price is <strong>₹{(currentPlayer.base_price ?? 0).toLocaleString()}</strong>
            </div>
          )}

          {/* Min bid required indicator */}
          <div className="flex-between" style={{ marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-muted)' }}>Minimum next bid:</span>
            <span style={{ fontWeight: 700 }}>₹{minBidRequired.toLocaleString()}</span>
          </div>

          {/* Budget Alert if cannot afford */}
          {!canAfford && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--danger)',
                color: 'var(--danger)',
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 13,
                marginBottom: 12,
              }}
            >
              Insufficient budget to place the minimum bid of ₹{minBidRequired.toLocaleString()}.
            </div>
          )}

          {/* Bid Input Box */}
          <div style={{ marginBottom: 12 }}>
            <label
              htmlFor="bid-amount-input"
              style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}
            >
              Your Bid Amount (₹)
            </label>
            <div className="flex bid-input-row" style={{ gap: 8 }}>
              <input
                id="bid-amount-input"
                type="number"
                className="input-bid"
                min={minBidRequired}
                step="1000"
                value={bidAmount}
                disabled={busy || !canAfford}
                onChange={(e) => {
                  setError('');
                  setSuccessMsg('');
                  setBidAmount(e.target.value);
                }}
                placeholder={`Min ₹${minBidRequired.toLocaleString()}`}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid var(--card-border)',
                  fontSize: 16,
                  fontWeight: 600,
                  outline: 'none',
                }}
              />
              <button
                type="button"
                className="btn-outline"
                style={{ fontSize: 13, padding: '10px 12px' }}
                onClick={handleResetToMin}
                disabled={busy || !canAfford || parsedBid === minBidRequired}
                title="Reset to minimum required bid"
              >
                Reset Min
              </button>
            </div>
          </div>



          {/* Submit Bid Button */}
          <button
            type="submit"
            className="btn-primary"
            disabled={!isBidValid || isHighestBidder}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            {busy
              ? 'Placing Bid...'
              : isHighestBidder
                ? 'You have highest bid'
                : !canAfford
                  ? 'Insufficient Budget'
                  : parsedBid < minBidRequired
                    ? `Min bid is ₹${minBidRequired.toLocaleString()}`
                    : `Place Bid: ₹${parsedBid > 0 ? parsedBid.toLocaleString() : minBidRequired.toLocaleString()}`}
          </button>
        </form>
      )}

      {/* Error message */}
      {error && (
        <div
          style={{
            color: 'var(--danger)',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            padding: '8px 12px',
            borderRadius: 6,
            marginTop: 12,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {/* Success message */}
      {successMsg && !error && (
        <div
          style={{
            color: 'var(--success)',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            padding: '8px 12px',
            borderRadius: 6,
            marginTop: 12,
            fontSize: 13,
          }}
        >
          {successMsg}
        </div>
      )}
    </div>
  );
}

export default BidBox;
