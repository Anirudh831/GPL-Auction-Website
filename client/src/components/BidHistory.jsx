function BidHistory({ bids = [], highestBid = null }) {
  if (!bids.length) {
    return (
      <div className="card">
        <h3 style={{ marginBottom: 8 }}>Bids so far</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No bids yet this round.</p>
      </div>
    );
  }

  const highestId = highestBid?.id;

  return (
    <div className="card">
      <h3 style={{ marginBottom: 12 }}>Bids so far</h3>
      <ul className="bid-list">
        {[...bids].reverse().map((bid) => {
          const isHighest = bid.id === highestId;
          return (
            <li
              key={bid.id}
              className={`bid-row${isHighest ? ' bid-row--highest' : ''}`}
            >
              <div>
                <strong>{bid.teamName || bid.teamId}</strong>
                {isHighest && (
                  <span className="badge badge-sold" style={{ marginLeft: 8 }}>
                    Highest
                  </span>
                )}
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {bid.timestamp
                    ? new Date(bid.timestamp).toLocaleTimeString()
                    : ''}
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>
                ₹{(bid.amount ?? 0).toLocaleString()}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default BidHistory;
