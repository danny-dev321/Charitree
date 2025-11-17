import { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import DonateSection from './DonateSection';
import TreasuryStats from './TreasuryStats';
import CreateProposal from './CreateProposal';
import ProposalList from './ProposalList';

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
        {activeTab === 'proposals' && <ProposalList />}
        {activeTab === 'create' && <CreateProposal />}
      </div>
    </div>
  );
}

// Empty state when wallet not connected
function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">🌳</div>
      <h2>Welcome to ChariTree</h2>
      <p>Connect your wallet to start planting trees and making a difference</p>

    </div>
  );
}
