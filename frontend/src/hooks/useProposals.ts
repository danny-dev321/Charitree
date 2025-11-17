import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { getAllProposals } from '../services/daoService';
import { devToMDev } from '../utils/format';
import type { Proposal } from '../types/organization';

interface UseProposalsReturn {
  proposals: Proposal[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

interface UseProposalsOptions {
  pollingInterval?: number;
  enablePolling?: boolean;
}

/**
 * Hook to fetch and manage proposals
 * Auto-refreshes every 10 seconds by default
 */
export function useProposals(options: UseProposalsOptions = {}): UseProposalsReturn {
  const { pollingInterval = 10000, enablePolling = true } = options;
  const { provider } = useWeb3();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProposals = useCallback(async () => {
    if (!provider) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const rawProposals = await getAllProposals(provider);
      
      // Transform proposals with mDEV values
      const transformedProposals: Proposal[] = rawProposals.map((p) => ({
        ...p,
        budgetMDev: devToMDev(p.budget),
      }));

      // Sort by ID descending (newest first)
      transformedProposals.sort((a, b) => b.id - a.id);
      
      setProposals(transformedProposals);
    } catch (err: any) {
      console.error('Error loading proposals:', err);
      setError(err.message || 'Failed to load proposals');
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  // Load proposals when provider changes
  useEffect(() => {
    if (provider) {
      loadProposals();
    }
  }, [provider, loadProposals]);

  // Auto-refresh with polling interval
  useEffect(() => {
    if (!provider || !enablePolling) return;

    const intervalId = setInterval(() => {
      loadProposals();
    }, pollingInterval);

    return () => clearInterval(intervalId);
  }, [provider, enablePolling, pollingInterval, loadProposals]);

  return {
    proposals,
    isLoading,
    error,
    refresh: loadProposals,
  };
}

