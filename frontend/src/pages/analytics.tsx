import { Card, PageHeader } from "../ui/Primitives";

const AnalyticsPage = () => (
  <div className="page-stack">
    <PageHeader
      title="Analytics"
      description="A closer look at your spending patterns."
    />
    <Card className="feature-placeholder">
      <span className="feature-placeholder__icon" aria-hidden="true">
        ⌁
      </span>
      <h2>Spending analytics are coming later</h2>
      <p className="muted">
        For now, review your income and spending summary on the dashboard.
        Category-level reports will follow when transaction categories are part
        of the data model.
      </p>
    </Card>
  </div>
);

export default AnalyticsPage;
