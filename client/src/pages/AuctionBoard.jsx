import { useState } from 'react';
import PlayerCard from '../components/PlayerCard.jsx';
import BidHistory from '../components/BidHistory.jsx';
import AvailablePlayersList from '../components/AvailablePlayersList.jsx';
import AuctioneerPanel from '../components/AuctioneerPanel.jsx';
import BidBox from '../components/BidBox.jsx';
import SpectatorPanel from '../components/SpectatorPanel.jsx';

function AuctionBoard({
  role,
  players = [],
  teams = [],
  selectedTeamId = null,
  auctionState,
  onRefresh,
}) {
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

  const isAuctioneer = role === 'auctioneer';
  const isTeamManager = role === 'team_manager';
  const isViewer = role === 'viewer';
  const isActive = auctionState?.status === 'active' && !!auctionState?.currentPlayer;
  const currentPlayer = auctionState?.currentPlayer;
  const bids = auctionState?.bids ?? [];
  const highestBid = auctionState?.highestBid ?? null;

  const myTeam = teams.find((t) => t.id === selectedTeamId) || null;

  const handleSelectPlayer = (playerId) => {
    setSelectedPlayerId(playerId);
  };

  const handleActionDone = async () => {
    setSelectedPlayerId(null);
    if (onRefresh) await onRefresh();
  };

  return (
    <div className="auction-board">
      <div className="auction-board__main grid">
        {/* Spotlight: Current Player on Auction */}
        <div className="card">
          <h2 style={{ marginBottom: 16 }}>Current auction</h2>
          {currentPlayer ? (
            <div>
              <PlayerCard player={currentPlayer} teams={teams} />
              <div className="flex" style={{ marginTop: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                  Base price: ₹{(currentPlayer.base_price ?? 0).toLocaleString()}
                </span>
                {highestBid && (
                  <span style={{ fontSize: 14, fontWeight: 700 }}>
                    Highest: ₹{(highestBid.amount ?? 0).toLocaleString()}
                    {highestBid.teamName ? ` — ${highestBid.teamName}` : ''}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>
              No player is up for auction right now.
              {isAuctioneer
                ? ' Pick an available player below and start a round.'
                : ' Waiting for the auctioneer to start a round.'}
            </p>
          )}
        </div>

        {/* Role-Specific Control Panel */}
        {isAuctioneer && (
          <AuctioneerPanel
            auctionState={auctionState}
            selectedPlayerId={selectedPlayerId}
            onActionDone={handleActionDone}
          />
        )}

        {isTeamManager && (
          <BidBox
            team={myTeam}
            auctionState={auctionState}
            players={players}
            onActionDone={handleActionDone}
          />
        )}

        {isViewer && (
          <SpectatorPanel
            auctionState={auctionState}
            teams={teams}
            players={players}
          />
        )}

        {/* Live Bid History */}
        <BidHistory bids={bids} highestBid={highestBid} />
      </div>

      {/* Available Players Pool */}
      <div style={{ marginTop: 20 }}>
        <AvailablePlayersList
          players={players}
          isAuctioneer={isAuctioneer}
          auctionActive={isActive}
          selectedPlayerId={selectedPlayerId}
          onSelectPlayer={handleSelectPlayer}
        />
      </div>

      {/* Sold Players Pool */}
      {players.some((p) => p.status === 'sold') && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 16 }}>
            Sold Players ({players.filter((p) => p.status === 'sold').length})
          </h3>
          <div className="grid available-players-grid">
            {players
              .filter((p) => p.status === 'sold')
              .map((player) => (
                <PlayerCard key={player.id} player={player} teams={teams} compact />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AuctionBoard;
