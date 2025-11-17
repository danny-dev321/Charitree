interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'loading';
  title: string;
  message: string;
  txHash?: string;
}

export default function TransactionModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  txHash,
}: TransactionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal transaction-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-icon ${type}`}>
          {type === 'success' && '✅'}
          {type === 'error' && '❌'}
          {type === 'loading' && '⏳'}
        </div>

        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>

        {txHash && (
          <a
            href={`https://moonbase.moonscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link-modal"
          >
            View on Moonscan →
          </a>
        )}

        <button onClick={onClose} className="btn btn-primary modal-button">
          Close
        </button>
      </div>
    </div>
  );
}

