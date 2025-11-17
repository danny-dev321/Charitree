import type { WalletProvider, WalletType } from '../types/wallet';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableWallets: WalletProvider[];
  onSelectWallet: (walletType: WalletType) => Promise<void>;
  isConnecting: boolean;
  error: string | null;
}

export default function WalletModal({
  isOpen,
  onClose,
  availableWallets,
  onSelectWallet,
  isConnecting,
  error,
}: WalletModalProps) {
  if (!isOpen) return null;

  const handleWalletClick = async (wallet: WalletProvider) => {
    const walletType: WalletType =
      wallet.name === 'MetaMask'
        ? 'metamask'
        : wallet.name === 'Talisman'
        ? 'talisman'
        : 'injected';

    await onSelectWallet(walletType);
  };

  return (
    <div className="wallet-modal-overlay" onClick={onClose}>
      <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
        <div className="wallet-modal-header">
          <h3>Connect Wallet</h3>
          <button className="wallet-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="wallet-modal-body">
          {availableWallets.length === 0 ? (
            <NoWalletsMessage />
          ) : (
            <WalletList
              wallets={availableWallets}
              onSelect={handleWalletClick}
              isConnecting={isConnecting}
            />
          )}

          {error && <ErrorMessage message={error} />}
        </div>
      </div>
    </div>
  );
}

// Sub-components for better organization

function NoWalletsMessage() {
  return (
    <div className="no-wallets">
      <p>No wallets detected</p>
      <p className="help-text">
        Please install{' '}
        <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">
          MetaMask
        </a>{' '}
        or{' '}
        <a href="https://talisman.xyz" target="_blank" rel="noopener noreferrer">
          Talisman
        </a>
      </p>
    </div>
  );
}

interface WalletListProps {
  wallets: WalletProvider[];
  onSelect: (wallet: WalletProvider) => void;
  isConnecting: boolean;
}

function WalletList({ wallets, onSelect, isConnecting }: WalletListProps) {
  return (
    <div className="wallet-list">
      {wallets.map((wallet) => (
        <button
          key={wallet.name}
          className="wallet-option"
          onClick={() => onSelect(wallet)}
          disabled={isConnecting}
        >
          <span className="wallet-icon">{wallet.icon}</span>
          <span className="wallet-name">{wallet.name}</span>
          {wallet.installed && <span className="wallet-status">Installed</span>}
        </button>
      ))}
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="wallet-error">
      <p>{message}</p>
    </div>
  );
}

