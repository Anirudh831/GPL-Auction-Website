import TeamRosterCard from '../components/TeamRosterCard.jsx';

function Rosters({ teams = [], players = [] }) {
  const soldPlayers = players.filter((p) => p.status === 'sold');
  const availablePlayers = players.filter((p) => p.status === 'available');
  const unsoldPlayers = players.filter((p) => p.status === 'unsold');

  const totalPurse = teams.reduce((acc, t) => acc + (t.totalBudget ?? 500000), 0);
  const remainingPurse = teams.reduce((acc, t) => acc + (t.remainingBudget ?? 0), 0);
  const totalSpent = Math.max(0, totalPurse - remainingPurse);

  return (
    <div className="rosters-page">
      {/* Overview Stats Bar */}
      <div
        className="card"
        style={{
          marginBottom: 20,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          textAlign: 'center',
        }}
      >
        <div style={{ padding: '8px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
            Players Sold
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>
            {soldPlayers.length}{' '}
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)' }}>
              / {players.length}
            </span>
          </div>
        </div>

        <div style={{ padding: '8px', borderLeft: '1px solid var(--card-border)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
            Total Spent
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--danger)' }}>
            ₹{totalSpent.toLocaleString()}
          </div>
        </div>

        <div style={{ padding: '8px', borderLeft: '1px solid var(--card-border)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
            Remaining Purse
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--success)' }}>
            ₹{remainingPurse.toLocaleString()}
          </div>
        </div>

        <div style={{ padding: '8px', borderLeft: '1px solid var(--card-border)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
            Pool Status
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>
            <span className="badge badge-available" style={{ marginRight: 6 }}>
              {availablePlayers.length} Available
            </span>
            <span className="badge badge-unsold">
              {unsoldPlayers.length} Unsold
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Team Roster Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        {teams.map((team) => (
          <TeamRosterCard key={team.id} team={team} players={players} />
        ))}
      </div>
    </div>
  );
}

export default Rosters;
