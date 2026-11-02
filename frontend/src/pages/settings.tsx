import { Card, PageHeader } from "../ui/Primitives";

const SettingsPage = () => (
  <div className="page-stack">
    <PageHeader
      title="Settings"
      description="Application preferences and account access."
    />
    <Card className="feature-placeholder">
      <span className="feature-placeholder__icon" aria-hidden="true">
        ⚙
      </span>
      <h2>Settings will grow with Ledger</h2>
      <p className="muted">
        Authentication and personal preferences are planned for a later phase.
        This workspace currently uses the local API configuration.
      </p>
    </Card>
  </div>
);

export default SettingsPage;
