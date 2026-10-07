function TeamRosterCard({ team, players = [] }) {
  if (!team) return null;

  const squad = players.filter((p) => p.team_id === team.id);
  const totalBudget = team.totalBudget ?? 500000;
  const remainingBudget = team.remainingBudget ?? 0;
  const spentBudget = Math.max(0, totalBudget - remainingBudget);
  const spentPercent = Math.min(100, Math.round((spentBudget / totalBudget) * 100));

  return (
    <div className="card team-roster-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Team Header */}
      <div className="flex-between" style={{ marginBottom: 12 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{team.name}</h3>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Squad: <strong>{squad.length}</strong> player{squad.length === 1 ? '' : 's'}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Purse Left
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--success)' }}>
            ₹{remainingBudget.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Purse Progress Bar */}
      <div style={{ marginBottom: 16 }}>
        <div className="flex-between" style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
          <span>Spent: ₹{spentBudget.toLocaleString()} ({spentPercent}%)</span>
          <span>Total: ₹{totalBudget.toLocaleString()}</span>
        </div>
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--card-border)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${spentPercent}%`,
              height: '100%',
              backgroundColor: spentPercent > 80 ? 'var(--danger)' : 'var(--primary)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Players List */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>
          Acquired Players
        </h4>

        {squad.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 12px',
              border: '1px dashed var(--card-border)',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              fontSize: 13,
            }}
          >
            No players purchased yet
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              maxHeight: '280px',
              overflowY: 'auto',
            }}
          >
            {squad.map((player) => {
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
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-color)',
                    border: '1px solid var(--card-border)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{player.name}</div>
                    <span
                      className={`badge ${skillClass}`}
                      style={{ fontSize: 11, padding: '2px 8px', marginTop: 2 }}
                    >
                      {player.skill}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Price</div>
                    <strong style={{ fontSize: 13, color: 'var(--success)' }}>
                      ₹{(player.sold_price ?? 0).toLocaleString()}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamRosterCard;
