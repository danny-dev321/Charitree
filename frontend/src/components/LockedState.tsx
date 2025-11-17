interface LockedStateProps {
  title?: string;
  message: string;
  helpText?: string;
}

export default function LockedState({ 
  title = 'Access Restricted', 
  message, 
  helpText 
}: LockedStateProps) {
  return (
    <div className="locked-state">
      <div className="locked-icon">🔒</div>
      <p className="locked-message">{message}</p>
      {helpText && <p className="locked-help">{helpText}</p>}
    </div>
  );
}

