import { useState } from 'react';
import { formatMDev } from '../utils/format';
import { getOrganizationByAddress } from '../data/mockOrganizations';
import type { Proposal } from '../types/organization';

interface ProposalCardProps {
  proposal: Proposal;
  isDAOMember: boolean;
  onVote: (proposalId: number) => Promise<void>;
  onExecute: (proposalId: number) => Promise<void>;
}

export default function ProposalCard({ 
  proposal, 
  isDAOMember, 
  onVote, 
  onExecute 
}: ProposalCardProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const organization = getOrganizationByAddress(proposal.beneficiary);

  const handleVote = async () => {
    setIsVoting(true);
    try {
      await onVote(proposal.id);
    } finally {
      setIsVoting(false);
    }
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      await onExecute(proposal.id);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className={`proposal-card ${proposal.executed ? 'executed' : ''}`}>
      <ProposalHeader proposal={proposal} />
      <ProposalBody proposal={proposal} organization={organization} />
      
      {isDAOMember && !proposal.executed && (
        <ProposalActions
          onVote={handleVote}
          onExecute={handleExecute}
          isVoting={isVoting}
          isExecuting={isExecuting}
        />
      )}
    </div>
  );
}

// Proposal header component
function ProposalHeader({ proposal }: { proposal: Proposal }) {
  return (
    <div className="proposal-header">
      <h3>Proposal #{proposal.id}</h3>
      <span className={`proposal-status ${proposal.executed ? 'executed' : 'pending'}`}>
        {proposal.executed ? '✓ Executed' : '⏳ Pending'}
      </span>
    </div>
  );
}

// Proposal body component
interface ProposalBodyProps {
  proposal: Proposal;
  organization: ReturnType<typeof getOrganizationByAddress>;
}

function ProposalBody({ proposal, organization }: ProposalBodyProps) {
  return (
    <div className="proposal-body">
      <p className="proposal-description">{proposal.description}</p>
      
      {organization && (
        <div className="proposal-organization">
          <span className="org-badge">{organization.name}</span>
          {organization.verified && <span className="verified-mini">✓</span>}
        </div>
      )}
      
      <div className="proposal-details">
        <ProposalDetail label="Budget" value={formatMDev(proposal.budgetMDev)} />
        <ProposalDetail label="Votes" value={proposal.votes.toString()} />
        <ProposalDetail label="Beneficiary" value={proposal.beneficiary} mono />
      </div>
    </div>
  );
}

// Proposal detail row
interface ProposalDetailProps {
  label: string;
  value: string;
  mono?: boolean;
}

function ProposalDetail({ label, value, mono = false }: ProposalDetailProps) {
  return (
    <div className="proposal-detail">
      <span className="detail-label">{label}:</span>
      <span className={`detail-value ${mono ? 'mono' : ''}`}>{value}</span>
    </div>
  );
}

// Proposal actions component
interface ProposalActionsProps {
  onVote: () => void;
  onExecute: () => void;
  isVoting: boolean;
  isExecuting: boolean;
}

function ProposalActions({ onVote, onExecute, isVoting, isExecuting }: ProposalActionsProps) {
  return (
    <div className="proposal-actions">
      <button
        onClick={onVote}
        disabled={isVoting || isExecuting}
        className="btn btn-primary"
      >
        {isVoting ? 'Voting...' : '👍 Vote'}
      </button>
      <button
        onClick={onExecute}
        disabled={isVoting || isExecuting}
        className="btn btn-secondary"
      >
        {isExecuting ? 'Executing...' : '✅ Execute'}
      </button>
    </div>
  );
}

