import { useState, useEffect } from 'react';
import { getPlayers } from './services/playersService.js';
import { getTeams } from './services/teamsService.js';
import { getAuctionState } from './services/auctionService.js';
import RolePicker from './pages/RolePicker.jsx';
import AuctionBoard from './pages/AuctionBoard.jsx';
import Rosters from './pages/Rosters.jsx';

function App() {
  // Actual state at a certain point of time.
  const [role, setRole] = useState(null); // 'auctioneer' | 'team_manager' | 'viewer'
  const [selectedTeamId, setSelectedTeamId] = useState(null); // 'Team-1', etc.
  const [activeTab, setActiveTab] = useState('auction'); // 'auction' | 'rosters'

  // states we take from backend
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [auctionState, setAuctionState] = useState(null);
  const [loading, setLoading] = useState(true);

  // refresh part is handles here
  const refresh = async () => {
    try {
      const [p, t, a] = await Promise.all([
        getPlayers(),
        getTeams(),
        getAuctionState()
      ]);
      setPlayers(p);
      setTeams(t);
      setAuctionState(a);
    } catch (err) {
      console.error('Error fetching auction data:', err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }, []);

  // 5. Role Selection Handler
  const handleSelectRole = (newRole, teamId = null) => {
    setRole(newRole);
    setSelectedTeamId(teamId);
  };

  // 6. Reset Role (Switch Role)
  const handleSwitchRole = () => {
    setRole(null);
    setSelectedTeamId(null);
  };


  const myTeam = teams.find((t) => t.id === selectedTeamId);

  return (
    <div className="container">
      {/* If role is not selected yet, show RolePicker */}
      {!role ? (
        <RolePicker
          teams={teams}
          onSelectRole={handleSelectRole}
          loading={loading}
        />
      ) : (
        <div>
          {/* Top Bar / Header */}
          <header className="flex-between card" style={{ marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>GPL Mega Auction</h1>
              <div className="flex" style={{ marginTop: '4px' }}>
                <span className="badge badge-available">
                  Role: {role === 'auctioneer' ? 'Auctioneer' : role === 'viewer' ? 'Viewer' : `${myTeam?.name || 'Manager'}`}
                </span>
                {myTeam && (
                  <span className="badge badge-sold">
                    Budget Left: ₹{(myTeam.remainingBudget ?? 0).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <div className="flex">
              <button
                className={`btn-outline ${activeTab === 'auction' ? 'btn-primary' : ''}`}
                onClick={() => setActiveTab('auction')}
              >
                Auction Arena
              </button>
              <button
                className={`btn-outline ${activeTab === 'rosters' ? 'btn-primary' : ''}`}
                onClick={() => setActiveTab('rosters')}
              >
                Team Rosters
              </button>
              <button
                className="btn-outline"
                style={{ color: '#ef4444' }}
                onClick={handleSwitchRole}
              >
                Switch Role
              </button>
            </div>
          </header>

          <main>
            {activeTab === 'auction' ? (
              <AuctionBoard
                role={role}
                players={players}
                teams={teams}
                selectedTeamId={selectedTeamId}
                auctionState={auctionState}
                onRefresh={refresh}
              />
            ) : (
              <Rosters teams={teams} players={players} />
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
