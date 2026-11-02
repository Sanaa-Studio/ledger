# Frontend decisions

- **One dark theme, one token source.** Colors, spacing, radii, borders, and shadows live in `src/index.css`; shared labels and navigation live in `src/ui/config.ts`.
- **Small UI layer.** `src/ui/` owns the app shell, common controls, status states, and formatting helpers. Feature forms and pages stay in their own folders.
- **Validate at the API boundary.** `src/api/client.ts` parses requests and responses with the existing `@ledger/contracts` Zod schemas. The frontend does not redefine API DTOs.
- **Edit all supported account fields.** Account edits include name, type, and opening balance because the repository already supports all three.
- **Use the backend as the source of truth.** Pages load and refresh real API data. Seed records remain in the database package; the frontend has no demo-data fallback.
- **Match the current contract.** Transactions have signed amounts and optional destination accounts, but no category field. The UI labels records as income, expense, or transfer instead of inventing categories.
- **Confirm destructive actions.** Account deletion warns that its related transactions are removed by the existing API behavior.
- **Keep later work out of this pass.** Authentication, ownership, budgets, and category analytics remain outside Phase 7.
