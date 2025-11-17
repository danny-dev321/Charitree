import { useTreasuryStats } from '../hooks/useTreasuryStats';
import { formatMDev } from '../utils/format';

export default function TreasuryStats() {
  // Auto-refreshes every 5 seconds
  const { treasuryBalance, userTokenBalance, isLoading, error } = useTreasuryStats({
    pollingInterval: 5000,
    enablePolling: true,
  });

  if (error) {
    return (
      <div className="treasury-stats error">
        <p>Failed to load stats: {error}</p>
      </div>
    );
  }

  // Show loading state only on initial load, not during polling updates
  const isInitialLoad = isLoading && treasuryBalance === 0 && userTokenBalance === 0;

  if (isInitialLoad) {
    return (
      <div className="treasury-stats loading">
        <StatCard label="Treasury Balance" value="Loading..." />
        <StatCard label="Your CTT Tokens" value="Loading..." />
      </div>
    );
  }

  return (
    <div className="treasury-stats">
      <StatCard 
        label="Treasury Balance" 
        value={formatMDev(treasuryBalance)}
        icon="🏦"
        subtitle="Updates every 5s"
      />
      <StatCard 
        label="Your CTT Tokens" 
        value={formatMDev(userTokenBalance)}
        icon="🪙"
        subtitle="Updates every 5s"
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon?: string;
  subtitle?: string;
}

function StatCard({ label, value, icon, subtitle }: StatCardProps) {
  return (
    <div className="stat-card">
      {icon && <div className="stat-icon">{icon}</div>}
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
    </div>
  );
}
