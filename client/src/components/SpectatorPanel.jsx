function SpectatorPanel({ auctionState, teams = [], players = [] }) {
  const isActive = auctionState?.status === 'active' && !!auctionState?.currentPlayer;
  const currentPlayer = auctionState?.currentPlayer;
  const highestBid = auctionState?.highestBid ?? null;
  const bids = auctionState?.bids ?? [];

  // Filter all sold players
  const soldPlayers = players.filter((p) => p.status === 'sold');

  return (
    <div className="card spectator-panel">
      {/* Title */}
      <div className="flex-between" style={{ marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--card-border)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {isActive ? 'Live Auction Broadcast' : 'Auction on Standby'}
        </h3>
        <span className="badge badge-available" style={{ fontSize: 11 }}>
          Spectator Mode
        </span>
      </div>

      {/* Live Round Highlights */}
      {isActive ? (
        <div style={{ marginBottom: 16 }}>
          {highestBid ? (
            <div
              style={{
                backgroundColor: 'var(--bg-color)',
                border: '1px solid var(--card-border)',
                borderRadius: 8,
                padding: '12px 14px',
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Leading Franchise
              </div>
              <div className="flex-between" style={{ marginTop: 2 }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{highestBid.teamName}</span>
                <span style={{ fontSize: 18, fontWeight: 800 }}>
                  ₹{(highestBid.amount ?? 0).toLocaleString()}
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                Total bids this round: <strong>{bids.length}</strong>
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'var(--bg-color)',
                border: '1px solid var(--card-border)',
                borderRadius: 8,
                padding: '12px 14px',
                marginBottom: 12,
                fontSize: 14,
              }}
            >
              Waiting for teams to open bidding at <strong>₹{(currentPlayer.base_price ?? 0).toLocaleString()}</strong>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding: '12px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, marginBottom: 12 }}>
          Waiting for the auctioneer to place the next player on the podium...
        </div>
      )}

      {/* Franchise Quick Purse & Squad Standings */}
      <div style={{ marginTop: 12, marginBottom: 16 }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
          Franchise Purse Tracker
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {teams.map((t) => {
            const count = players.filter((p) => p.team_id === t.id).length;
            const isLeading = highestBid && highestBid.teamId === t.id;

            return (
              <div
                key={t.id}
                className="flex-between"
                style={{
                  padding: '7px 10px',
                  borderRadius: 6,
                  backgroundColor: 'var(--bg-color)',
                  border: isLeading ? '1px solid var(--text-main)' : '1px solid var(--card-border)',
                  fontSize: 13,
                }}
              >
                <div className="flex" style={{ gap: 6 }}>
                  <span style={{ fontWeight: 600 }}>{t.name}</span>
                  {isLeading && (
                    <span className="badge badge-sold" style={{ fontSize: 10, padding: '1px 6px' }}>
                      Leading
                    </span>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 700, marginRight: 8 }}>
                    ₹{(t.remainingBudget ?? 0).toLocaleString()}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    ({count} bought)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Which Player Sold to Which Team Feed */}
      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--card-border)' }}>
        <div className="flex-between" style={{ marginBottom: 10 }}>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Sold Players ({soldPlayers.length})
          </h4>
        </div>

        {soldPlayers.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            No players have been sold yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '200px', overflowY: 'auto' }}>
            {soldPlayers.map((player) => {
              const team = teams.find((t) => t.id === player.team_id);
              const teamName = team ? team.name : player.team_id || 'Unknown Team';
              const skillClass =
                player.skill === 'batting'
                  ? 'badge-batting'
                  : player.skill === 'bowling'
                    ? 'badge-bowling'
                    : 'badge-both';

              return (
                <div
                  key={player.id}
                  className="flex-between"
                  style={{
                    padding: '8px 10px',
                    borderRadius: 6,
                    backgroundColor: 'var(--bg-color)',
                    border: '1px solid var(--card-border)',
                    fontSize: 13,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{player.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      Sold to: <strong style={{ color: 'var(--text-main)' }}>{teamName}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700 }}>
                      ₹{(player.sold_price ?? 0).toLocaleString()}
                    </div>
                    <span className={`badge ${skillClass}`} style={{ fontSize: 10, padding: '1px 6px', marginTop: 2 }}>
                      {player.skill}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Read-Only Notice */}
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 14, textAlign: 'center' }}>
        You are viewing in read-only mode. Use <strong>Switch Role</strong> to place bids as a Franchise Manager.
      </p>
    </div>
  );
}

export default SpectatorPanel;
