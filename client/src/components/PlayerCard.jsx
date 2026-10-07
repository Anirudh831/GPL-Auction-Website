function PlayerCard({
  player,
  teams = [],
  teamName,
  onClick,
  selected = false,
  compact = false,
}) {
  if (!player) return null;

  const resolvedTeamName =
    teamName ||
    (teams.length && player.team_id
      ? teams.find((t) => t.id === player.team_id)?.name
      : null);

  const skillClass =
    player.skill === 'batting'
      ? 'badge-batting'
      : player.skill === 'bowling'
      ? 'badge-bowling'
      : 'badge-both';

  const statusClass =
    player.status === 'sold'
      ? 'badge-sold'
      : player.status === 'in_auction' || player.status === 'in auction'
      ? 'badge-available'
      : player.status === 'unsold'
      ? 'badge-unsold'
      : 'badge-available';

  return (
    <div
      className={`card player-card${selected ? ' player-card--selected' : ''}${onClick ? ' player-card--clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className="flex-between" style={{ marginBottom: compact ? 8 : 12, gap: 8 }}>
        <h3 style={{ fontSize: compact ? 15 : 18, fontWeight: 700 }}>{player.name}</h3>
        <span className={`badge ${statusClass}`}>{player.status}</span>
      </div>

      <div className="flex" style={{ flexWrap: 'wrap', gap: 8 }}>
        <span className={`badge ${skillClass}`}>{player.skill}</span>
        {player.status === 'sold' && player.sold_price ? (
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--success)' }}>
            Sold: ₹{Number(player.sold_price).toLocaleString()}
          </span>
        ) : (
          <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Base: ₹{(player.base_price ?? 0).toLocaleString()}
          </span>
        )}
      </div>

      {player.status === 'sold' && (resolvedTeamName || player.team_id) && (
        <div style={{ marginTop: 6, fontSize: 13, color: 'var(--text-muted)' }}>
          Sold to: <strong style={{ color: 'var(--text-main)' }}>{resolvedTeamName || player.team_id}</strong>
        </div>
      )}
    </div>
  );
}

export default PlayerCard;
