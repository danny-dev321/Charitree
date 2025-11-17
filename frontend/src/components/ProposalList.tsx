import { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { useProposals } from '../hooks/useProposals';
import { voteOnProposal, executeProposal } from '../services/daoService';
import ProposalCard from './ProposalCard';
import LockedState from './LockedState';
import TransactionModal from './TransactionModal';

export default function ProposalList() {
  const { signer, isDAOMember } = useWeb3();
  const { proposals, isLoading, error, refresh } = useProposals({
    pollingInterval: 10000,
    enablePolling: true,
  });

  const [txHash, setTxHash] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: 'success' | 'error' | 'loading';
    title: string;
    message: string;
  }>({
    type: 'success',
    title: '',
    message: '',
  });

  const handleVote = async (proposalId: number) => {
    if (!signer) return;

    try {
      setModalConfig({
        type: 'loading',
        title: 'Casting Vote',
        message: `Voting on Proposal #${proposalId}... Please wait for confirmation.`,
      });
      setShowModal(true);

      const tx = await voteOnProposal(signer, proposalId);
      setTxHash(tx.hash);
      console.log('Vote transaction sent:', tx.hash);

      await tx.wait();
      console.log('Vote confirmed!');

      // Refresh proposals
      await refresh();

      setModalConfig({
        type: 'success',
        title: '🎉 Vote Cast!',
        message: `Your vote on Proposal #${proposalId} has been recorded successfully.`,
      });
    } catch (err: any) {
      console.error('Voting failed:', err);
      setModalConfig({
        type: 'error',
        title: 'Voting Failed',
        message: err.reason || err.message || 'Unknown error',
      });
      setShowModal(true);
    }
  };

  const handleExecute = async (proposalId: number) => {
    if (!signer) return;

    try {
      setModalConfig({
        type: 'loading',
        title: 'Executing Proposal',
        message: `Executing Proposal #${proposalId}... Creating project contract.`,
      });
      setShowModal(true);

      const tx = await executeProposal(signer, proposalId);
      setTxHash(tx.hash);
      console.log('Execute transaction sent:', tx.hash);

      await tx.wait();
      console.log('Proposal executed!');

      // Refresh proposals
      await refresh();

      setModalConfig({
        type: 'success',
        title: '🎉 Proposal Executed!',
        message: `Proposal #${proposalId} has been executed. A new project has been created and funds have been allocated.`,
      });
    } catch (err: any) {
      console.error('Execution failed:', err);
      setModalConfig({
        type: 'error',
        title: 'Execution Failed',
        message: err.reason || err.message || 'Unknown error',
      });
      setShowModal(true);
    }
  };

  if (error) {
    return (
      <div className="proposal-list">
        <h2>Proposals</h2>
        <div className="error-state">
          <p>Failed to load proposals: {error}</p>
        </div>
      </div>
    );
  }

  if (isLoading && proposals.length === 0) {
    return (
      <div className="proposal-list">
        <h2>Proposals</h2>
        <div className="loading-state">
          <p>Loading proposals...</p>
        </div>
      </div>
    );
  }

  if (!isDAOMember) {
    return (
      <div className="proposal-list">
        <h2>Proposals</h2>
        <p className="section-description">
          View tree planting proposals submitted by organizations.
        </p>
        <ProposalGrid proposals={proposals} isDAOMember={false} />
        <LockedState
          message="Only DAO members can vote and execute proposals"
          helpText="DAO membership is for verified organizations, NGOs, and approved partners."
        />
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="proposal-list">
        <h2>Proposals</h2>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="proposal-list">
      <ProposalListHeader proposalCount={proposals.length} />
      
      <ProposalGrid 
        proposals={proposals} 
        isDAOMember={isDAOMember}
        onVote={handleVote}
        onExecute={handleExecute}
      />

      <TransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        txHash={txHash || undefined}
      />
    </div>
  );
}

// Proposal list header
function ProposalListHeader({ proposalCount }: { proposalCount: number }) {
  return (
    <>
      <h2>Tree Planting Proposals</h2>
      <p className="section-description">
        Vote on proposals from verified organizations. {proposalCount} {proposalCount === 1 ? 'proposal' : 'proposals'} available.
        <span className="auto-refresh-note"> (Auto-refreshes every 10s)</span>
      </p>
    </>
  );
}

// Proposal grid
interface ProposalGridProps {
  proposals: any[];
  isDAOMember: boolean;
  onVote?: (id: number) => Promise<void>;
  onExecute?: (id: number) => Promise<void>;
}

function ProposalGrid({ proposals, isDAOMember, onVote, onExecute }: ProposalGridProps) {
  return (
    <div className="proposals-grid">
      {proposals.map((proposal) => (
        <ProposalCard
          key={proposal.id}
          proposal={proposal}
          isDAOMember={isDAOMember}
          onVote={onVote || (async () => {})}
          onExecute={onExecute || (async () => {})}
        />
      ))}
    </div>
  );
}

// Empty state
function EmptyState() {
  return (
    <div className="empty-proposals">
      <div className="empty-icon">📋</div>
      <p>No proposals yet</p>
      <p className="empty-help">Be the first to create a tree planting proposal!</p>
    </div>
  );
}
