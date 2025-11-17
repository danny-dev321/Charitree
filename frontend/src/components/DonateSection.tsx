import { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { donate } from '../services/treasuryService';
import { mdevToDev, formatMDev } from '../utils/format';
import { useTreasuryStats } from '../hooks/useTreasuryStats';
import TransactionModal from './TransactionModal';

export default function DonateSection() {
  const { signer, isConnected } = useWeb3();
  const { refresh: refreshStats } = useTreasuryStats();
  const [amount, setAmount] = useState<string>('100');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  const handleDonate = async () => {
    if (!signer || !amount) return;

    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const amountInWei = mdevToDev(parseFloat(amount));
      const tx = await donate(signer, amountInWei);
      
      const donatedAmount = formatMDev(parseFloat(amount));
      setTxHash(tx.hash);
      console.log('Donation transaction sent:', tx.hash);
      
      // Show processing modal
      setModalConfig({
        type: 'loading',
        title: 'Processing Transaction',
        message: `Donating ${donatedAmount}... Please wait for confirmation.`,
      });
      setShowModal(true);
      
      await tx.wait();
      console.log('Donation confirmed!');
      
      // Refresh treasury stats
      await refreshStats();
      
      // Show success modal
      setModalConfig({
        type: 'success',
        title: '🎉 Donation Successful!',
        message: `Thank you for donating ${donatedAmount}! You've received CTT tokens representing your contribution to tree planting initiatives.`,
      });
      
      // Reset form
      setAmount('100');
    } catch (err: any) {
      console.error('Donation failed:', err);
      const errorMessage = err.reason || err.message || 'Unknown error';
      
      // Show error modal
      setModalConfig({
        type: 'error',
        title: 'Donation Failed',
        message: errorMessage,
      });
      setShowModal(true);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="donate-section">
        <h2>Donate to Plant Trees</h2>
        <div className="connect-prompt">
          <p>Please connect your wallet to donate</p>
        </div>
      </div>
    );
  }

  return (
    <div className="donate-section">
      <h2>Donate to Plant Trees</h2>
      <p className="section-description">
        Your donation helps fund tree planting initiatives worldwide. 
        You'll receive CTT tokens representing your contribution.
      </p>

      <DonationForm
        amount={amount}
        onAmountChange={setAmount}
        onDonate={handleDonate}
        isLoading={isLoading}
      />

      {error && <ErrorMessage message={error} />}

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

// Donation form component
interface DonationFormProps {
  amount: string;
  onAmountChange: (value: string) => void;
  onDonate: () => void;
  isLoading: boolean;
}

function DonationForm({ amount, onAmountChange, onDonate, isLoading }: DonationFormProps) {
  const amountNum = parseFloat(amount) || 0;
  const devEquivalent = (amountNum / 1000).toFixed(3);

  return (
    <div className="donate-form">
      <div className="form-group">
        <label htmlFor="amount">Amount (mDEV)</label>
        <div className="input-with-buttons">
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="Enter amount in mDEV"
            min="0"
            step="1"
            disabled={isLoading}
            className="amount-input"
          />
          <div className="quick-amounts">
            <button 
              type="button"
              onClick={() => onAmountChange('100')} 
              className="btn-quick"
              disabled={isLoading}
            >
              100
            </button>
            <button 
              type="button"
              onClick={() => onAmountChange('500')} 
              className="btn-quick"
              disabled={isLoading}
            >
              500
            </button>
            <button 
              type="button"
              onClick={() => onAmountChange('1000')} 
              className="btn-quick"
              disabled={isLoading}
            >
              1000
            </button>
          </div>
        </div>
        <small className="help-text">
          {amount && `≈ ${devEquivalent} DEV`}
        </small>
      </div>

      <button
        onClick={onDonate}
        disabled={isLoading || !amount || amountNum <= 0}
        className="btn btn-primary btn-lg"
      >
        {isLoading ? 'Processing...' : `Donate ${formatMDev(amountNum)}`}
      </button>
    </div>
  );
}

// Error message component
function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="error-message">
      <strong>Error:</strong> {message}
    </div>
  );
}

