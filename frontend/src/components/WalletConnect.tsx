import { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { formatAddress } from '../utils/format';
import WalletModal from './WalletModal';
import type { WalletType } from '../types/wallet';

export default function WalletConnect() {
  const {
    account,
    isConnected,
    isDAOMember,
    isConnecting,
    error,
    availableWallets,
    selectedWallet,
    connectWallet,
    disconnect,
  } = useWeb3();

  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleWalletSelect = async (walletType: WalletType) => {
    try {
      await connectWallet(walletType);
      setShowWalletModal(false);
    } catch (error) {
      console.error('Connection error:', error);
      // Error is already set in context
    }
  };

  if (!isConnected) {
    return (
      <div className="wallet-connect">
        <button
          onClick={() => setShowWalletModal(true)}
          disabled={isConnecting}
          className="btn btn-primary"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>

        <WalletModal
          isOpen={showWalletModal}
          onClose={() => setShowWalletModal(false)}
          availableWallets={availableWallets}
          onSelectWallet={handleWalletSelect}
          isConnecting={isConnecting}
          error={error}
        />
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      <ConnectedWalletInfo
        selectedWallet={selectedWallet}
        account={account}
        isDAOMember={isDAOMember}
        onDisconnect={disconnect}
      />
    </div>
  );
}

// Connected wallet display component
interface ConnectedWalletInfoProps {
  selectedWallet: string | null;
  account: string | null;
  isDAOMember: boolean;
  onDisconnect: () => void;
}

function ConnectedWalletInfo({
  selectedWallet,
  account,
  isDAOMember,
  onDisconnect,
}: ConnectedWalletInfoProps) {
  return (
    <div className="wallet-info">
      <div className="account-badge">
        <span className="wallet-type">{selectedWallet}</span>
        <span className="account-address">{formatAddress(account!)}</span>
        {isDAOMember && <span className="dao-badge">DAO Member</span>}
      </div>
      <button onClick={onDisconnect} className="btn btn-secondary btn-sm">
        Disconnect
      </button>
    </div>
  );
}
