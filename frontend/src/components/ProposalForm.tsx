import { formatMDev } from '../utils/format';

interface ProposalFormProps {
  description: string;
  budget: string;
  onDescriptionChange: (value: string) => void;
  onBudgetChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function ProposalForm({
  description,
  budget,
  onDescriptionChange,
  onBudgetChange,
  onSubmit,
  isLoading,
}: ProposalFormProps) {
  const budgetNum = parseFloat(budget) || 0;
  const devEquivalent = (budgetNum / 1000).toFixed(3);

  return (
    <form onSubmit={onSubmit} className="proposal-form">
      <div className="form-group">
        <label htmlFor="description">Project Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe your tree planting project in detail..."
          rows={6}
          required
          disabled={isLoading}
          className="proposal-textarea"
        />
        <small className="help-text">
          Include location, number of trees, species, timeline, and expected impact
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="budget">Project Budget (mDEV)</label>
        <input
          id="budget"
          type="number"
          value={budget}
          onChange={(e) => onBudgetChange(e.target.value)}
          placeholder="Enter budget in mDEV"
          min="0"
          step="1"
          required
          disabled={isLoading}
          className="amount-input"
        />
        <small className="help-text">
          {budget && `≈ ${devEquivalent} DEV`}
        </small>
      </div>

      <button
        type="submit"
        disabled={isLoading || !description || !budget || budgetNum <= 0}
        className="btn btn-primary btn-lg"
      >
        {isLoading ? 'Creating Proposal...' : `Submit Proposal (${formatMDev(budgetNum)})`}
      </button>
    </form>
  );
}

