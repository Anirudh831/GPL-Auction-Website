// RolePicker.jsx
// First screen where user picks their role:
// 1. Auctioneer (controls hammer)
// 2. Team Manager (picks a team to bid with)
// 3. Viewer (watches live)

function RolePicker({ teams = [], onSelectRole, loading }) {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <h2>Connecting to Auction Server...</h2>
        <p style={{ color: 'var(--text-muted)' }}>Fetching teams and players</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}> GPL Mega Auction 2026</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
          Choose your role to enter the auction room
        </p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {/*Auctioneer */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}></div>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Auctioneer</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
              Control the auction stage. Start player bidding rounds, accept winning bids, or mark players unsold.
            </p>
          </div>
          <button
            className="btn-outline"
            onClick={() => onSelectRole('auctioneer')}
          >
            Enter as Auctioneer
          </button>
        </div>

        {/*Spectator */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}></div>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Spectator / Viewer</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
              Watch the live bidding arena in real time as teams compete for players without placing bids.
            </p>
          </div>
          <button
            className="btn-outline"
            onClick={() => onSelectRole('viewer')}
          >
            Enter as Viewer
          </button>
        </div>
      </div>

      {/*Team Manager */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}></div>
          <h2 style={{ fontSize: '20px' }}>Team Manager</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Select your franchise to manage your ₹5,00,000 purse and place live bids:
          </p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {teams.map((team) => (
            <div
              key={team.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--card-border)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center'
              }}
            >
              <h3 style={{ fontSize: '16px', marginBottom: '6px' }}>{team.name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--success)', marginBottom: '12px' }}>
                Purse: ₹{team.remainingBudget.toLocaleString()}
              </p>
              <button
                className="btn-outline"
                style={{ width: '100%', fontSize: '13px', padding: '8px 12px' }}
                onClick={() => onSelectRole('team_manager', team.id)}
              >
                Manage Team
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RolePicker;
