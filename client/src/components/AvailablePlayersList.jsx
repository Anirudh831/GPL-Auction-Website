import PlayerCard from './PlayerCard.jsx';

function AvailablePlayersList({
  players = [],
  isAuctioneer = false,
  auctionActive = false,
  selectedPlayerId = null,
  onSelectPlayer,
}) {
  const available = players.filter((p) => p.status === 'available');

  return (
    <div className="card">
      <div className="flex-between" style={{ marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <h3>Available players ({available.length})</h3>
        {isAuctioneer && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {auctionActive
              ? 'Finish or reject the current round before starting another.'
              : 'Click a player to put them up for auction.'}
          </p>
        )}
      </div>

      {available.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No players left to auction.</p>
      ) : (
        <div className="grid available-players-grid">
          {available.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              compact
              selected={selectedPlayerId === player.id}
              onClick={
                isAuctioneer && !auctionActive && onSelectPlayer
                  ? () => onSelectPlayer(player.id)
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AvailablePlayersList;
