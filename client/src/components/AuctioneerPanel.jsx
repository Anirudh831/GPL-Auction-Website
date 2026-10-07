import { useState } from 'react';
import { startAuction, acceptBid, rejectRound } from '../services/auctionService.js';

function AuctioneerPanel({
  auctionState,
  selectedPlayerId,
  onActionDone,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const isActive = auctionState?.status === 'active' && auctionState?.currentPlayer;
  const hasBids = (auctionState?.bids?.length ?? 0) > 0;
  const highest = auctionState?.highestBid;

  const run = async (fn) => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await fn();
      setMessage(result?.message || 'Done.');
      if (onActionDone) await onActionDone();
    } catch (err) {
      setError(err.message || 'Action failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleStart = () =>
    run(() => startAuction(selectedPlayerId || null));

  const handleAccept = () => run(() => acceptBid());
  const handleReject = () => run(() => rejectRound());

  return (
    <div className="card auctioneer-panel">
      <h3 style={{ marginBottom: 12 }}>Auctioneer controls</h3>

      {!isActive ? (
        <div>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 12 }}>
            {selectedPlayerId
              ? 'Selected player ready. Start the round when you are set.'
              : 'Select a player from the list below, or start with the next available player.'}
          </p>
          <button
            className="btn-primary"
            disabled={busy}
            onClick={handleStart}
            style={{ width: '100%' }}
          >
            {selectedPlayerId ? 'Start auction for selected player' : 'Start next available player'}
          </button>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: 14, marginBottom: 12 }}>
            Round live for <strong>{auctionState.currentPlayer.name}</strong>
            {highest ? (
              <>
                {' '}
                — highest ₹{(highest.amount ?? 0).toLocaleString()}
                {highest.teamName ? ` (${highest.teamName})` : ''}
              </>
            ) : (
              ' — waiting for bids'
            )}
          </p>
          <div className="flex" style={{ flexWrap: 'wrap' }}>
            <button
              className="btn-success"
              disabled={busy || !hasBids}
              onClick={handleAccept}
            >
              Accept highest bid
            </button>
            <button
              className="btn-danger"
              disabled={busy}
              onClick={handleReject}
            >
              Reject round
            </button>
          </div>
          {!hasBids && (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
              Accept is disabled until at least one bid is placed.
            </p>
          )}
        </div>
      )}

      {error && (
        <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>
      )}
      {message && !error && (
        <p style={{ color: 'var(--success)', marginTop: 12, fontSize: 14 }}>{message}</p>
      )}
    </div>
  );
}

export default AuctioneerPanel;
