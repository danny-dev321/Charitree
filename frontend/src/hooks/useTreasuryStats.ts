import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { getTreasuryBalance, getUserTokenBalance } from '../services/treasuryService';
import { devToMDev } from '../utils/format';

interface TreasuryStats {
  treasuryBalance: number; // in mDEV
  userTokenBalance: number; // in mDEV
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

interface UseTreasuryStatsOptions {
  pollingInterval?: number; // in milliseconds, default 5000 (5 seconds)
  enablePolling?: boolean; // default true
}

/**
 * Hook to fetch and manage treasury statistics
 * Auto-refreshes every 5 seconds by default
 */
export function useTreasuryStats(options: UseTreasuryStatsOptions = {}): TreasuryStats {
  const { pollingInterval = 5000, enablePolling = true } = options;
  const { provider, account } = useWeb3();
  const [treasuryBalance, setTreasuryBalance] = useState<number>(0);
  const [userTokenBalance, setUserTokenBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!provider) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get treasury balance
      const treasuryBalanceWei = await getTreasuryBalance(provider);
      setTreasuryBalance(devToMDev(treasuryBalanceWei));

      // Get user token balance (only if connected)
      if (account) {
        const userBalanceWei = await getUserTokenBalance(provider, account);
        setUserTokenBalance(devToMDev(userBalanceWei));
      } else {
        setUserTokenBalance(0);
      }
    } catch (err: any) {
      console.error('Error loading treasury stats:', err);
      setError(err.message || 'Failed to load stats');
    } finally {
      setIsLoading(false);
    }
  }, [provider, account]);

  // Load stats when provider or account changes
  useEffect(() => {
    if (provider) {
      loadStats();
    }
  }, [provider, account, loadStats]);

  // Auto-refresh with polling interval
  useEffect(() => {
    if (!provider || !enablePolling) return;

    const intervalId = setInterval(() => {
      loadStats();
    }, pollingInterval);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [provider, enablePolling, pollingInterval, loadStats]);

  return {
    treasuryBalance,
    userTokenBalance,
    isLoading,
    error,
    refresh: loadStats,
  };
}

