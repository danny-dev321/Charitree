import { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import DonateSection from './DonateSection';
import TreasuryStats from './TreasuryStats';

type TabType = 'donate' | 'proposals' | 'create';

export default function Dashboard() {
  const { isConnected, isDAOMember } = useWeb3();
  const [activeTab, setActiveTab] = useState<TabType>('donate');

  if (!isConnected) {
    return (
      <div className="dashboard-empty">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <TreasuryStats />
      
      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'donate' ? 'active' : ''}`}
          onClick={() => setActiveTab('donate')}
        >
          💰 Donate
        </button>
        <button
          className={`tab ${activeTab === 'proposals' ? 'active' : ''}`}
          onClick={() => setActiveTab('proposals')}
        >
          🗳️ Proposals
        </button>
        {isDAOMember && (
          <button
            className={`tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            ➕ Create Proposal
          </button>
        )}
      </div>

      <div className="dashboard-content">
        {activeTab === 'donate' && <DonateSection />}
        {activeTab === 'proposals' && <ProposalsPlaceholder />}
        {activeTab === 'create' && <CreateProposalPlaceholder />}
      </div>
    </div>
  );
}

// Empty state when wallet not connected
function EmptyState() {
  return (
    <div className="empty-state">
      <h2>Welcome to ChariTree</h2>
      <p>Connect your wallet to start making a difference</p>
      <div className="features">
        <Feature
          icon="💰"
          title="Donate"
          description="Contribute DEV tokens to support tree planting initiatives"
        />
        <Feature
          icon="🗳️"
          title="Vote"
          description="DAO members can vote on charity proposals"
        />
        <Feature
          icon="🌱"
          title="Impact"
          description="Track your contribution and see the difference you make"
        />
      </div>
    </div>
  );
}

interface FeatureProps {
  icon: string;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="feature">
      <span className="feature-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

// Placeholders for future tasks
function ProposalsPlaceholder() {
  return (
    <div className="placeholder">
      <h2>Proposals</h2>
      <p>TODO: Task 5 - Implement proposal list and voting</p>
    </div>
  );
}

function CreateProposalPlaceholder() {
  return (
    <div className="placeholder">
      <h2>Create Proposal</h2>
      <p>TODO: Task 4 - Implement proposal creation form</p>
    </div>
  );
}
