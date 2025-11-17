import { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { createProposal } from '../services/daoService';
import { mdevToDev, formatMDev } from '../utils/format';
import { DEFAULT_ORGANIZATION } from '../data/mockOrganizations';
import TransactionModal from './TransactionModal';
import OrganizationCard from './OrganizationCard';
import ProposalForm from './ProposalForm';
import LockedState from './LockedState';
import type { CreateProposalParams } from '../types/organization';

export default function CreateProposal() {
  const { signer, account, isDAOMember } = useWeb3();
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('1000');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signer || !account || !isDAOMember) return;

    setIsLoading(true);
    setTxHash(null);

    try {
      const budgetInWei = mdevToDev(parseFloat(budget));
      const budgetFormatted = formatMDev(parseFloat(budget));

      const params: CreateProposalParams = {
        description,
        budget: budgetInWei,
        beneficiary: DEFAULT_ORGANIZATION.walletAddress,
        approver: account, // Current user is the approver
      };

      const tx = await createProposal(signer, params);
      setTxHash(tx.hash);
      console.log('Proposal creation transaction sent:', tx.hash);

      // Show loading modal
      setModalConfig({
        type: 'loading',
        title: 'Creating Proposal',
        message: `Submitting proposal with budget ${budgetFormatted}... Please wait for confirmation.`,
      });
      setShowModal(true);

      await tx.wait();
      console.log('Proposal created!');

      // Show success modal
      setModalConfig({
        type: 'success',
        title: '🎉 Proposal Created!',
        message: `Your tree planting proposal has been submitted successfully. DAO members can now vote on it.`,
      });

      // Reset form
      setDescription('');
      setBudget('1000');
    } catch (err: any) {
      console.error('Proposal creation failed:', err);
      const errorMessage = err.reason || err.message || 'Unknown error';

      // Show error modal
      setModalConfig({
        type: 'error',
        title: 'Proposal Creation Failed',
        message: errorMessage,
      });
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isDAOMember) {
    return (
      <div className="create-proposal">
        <h2>Create Tree Planting Proposal</h2>
        <LockedState
          message="Only DAO members can create proposals"
          helpText="DAO membership is for verified tree planting organizations, NGOs, and approved partners."
        />
      </div>
    );
  }

  return (
    <div className="create-proposal">
      <h2>Create Tree Planting Proposal</h2>
      <p className="section-description">
        Submit a tree planting project proposal for DAO members to vote on.
      </p>

      <OrganizationCard organization={DEFAULT_ORGANIZATION} />

      <ProposalForm
        description={description}
        budget={budget}
        onDescriptionChange={setDescription}
        onBudgetChange={setBudget}
        onSubmit={handleSubmit}
        isLoading={isLoading}
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
