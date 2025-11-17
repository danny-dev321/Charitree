import type { TreePlanterOrganization } from '../types/organization';

interface OrganizationCardProps {
  organization: TreePlanterOrganization;
}

export default function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <div className="organization-card">
      <div className="org-header">
        <h3>{organization.name}</h3>
        {organization.verified && <span className="verified-badge">✓ Verified</span>}
      </div>
      <p className="org-description">{organization.description}</p>
      <div className="org-details">
        <OrganizationDetail label="Location" value={organization.location} />
        <OrganizationDetail label="Projects Completed" value={organization.projectsCompleted.toString()} />
        <OrganizationDetail 
          label="Wallet" 
          value={`${organization.walletAddress.slice(0, 10)}...`} 
          mono 
        />
      </div>
      <div className="org-note">
        ⚠️ <strong>POC Note:</strong> This organization is hardcoded for demonstration. 
        Production will include proper registration and verification.
      </div>
    </div>
  );
}

interface OrganizationDetailProps {
  label: string;
  value: string;
  mono?: boolean;
}

function OrganizationDetail({ label, value, mono = false }: OrganizationDetailProps) {
  return (
    <div className="org-detail">
      <span className="detail-label">{label}:</span>
      <span className={`detail-value ${mono ? 'mono' : ''}`}>{value}</span>
    </div>
  );
}

