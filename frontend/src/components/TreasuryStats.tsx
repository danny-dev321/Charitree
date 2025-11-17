// TODO: Task 7 - Create dashboard showing treasury balance and user stats
// This component should:
// - Display treasury balance in mDEV
// - Display user's CTT token balance in mDEV
// - Auto-refresh when wallet connects

export default function TreasuryStats() {
  return (
    <div className="treasury-stats">
      <div className="stat-card">
        <div className="stat-label">Treasury Balance</div>
        <div className="stat-value">--- mDEV</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Your CTT Tokens</div>
        <div className="stat-value">--- mDEV</div>
      </div>
      {/* TODO: Fetch treasury balance from contract */}
      {/* TODO: Fetch user CTT balance from contract */}
    </div>
  );
}
