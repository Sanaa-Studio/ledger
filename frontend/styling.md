# Phase 10: dark workspace

The application homepage (`/`) redirects to `/dashboard`. There is no separate
marketing page. Phase 7 supplied the layouts and most styling; Phase 10 completes
the shared control polish, small-screen safeguards, page metadata, and favicon.
Login and session screens belong to Phase 8.

## Layout references

| View                 | Structure                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| Homepage / dashboard | Sidebar, overview heading, balance/income/spending cards, account tiles, six-month chart and recent activity |
| Accounts             | Heading and add action, account cards, pagination; create/edit and deletion dialogs                          |
| Account details      | Back link, heading and actions, balance and account information, related activity                            |
| Transactions         | Heading and add action, horizontally scrollable table, pagination; create/edit and deletion dialogs          |
| Transaction details  | Back link, heading and actions, amount summary and transaction information                                   |

## Shared styling

`src/index.css` defines the dark palette, Roboto font, spacing, radii, focus color,
and base styles. `src/App.css` defines the shell, cards, buttons, badges, forms,
dialogs, tables, loading indicators, notices, and empty states. Pages reuse
`src/ui/Primitives.tsx` rather than maintaining their own visual controls.

The sidebar narrows at 1120px. At 760px navigation becomes a horizontally scrolling
row and detail columns stack. At 540px cards and form fields become single column
and dialogs become bottom sheets. Wide tables scroll inside their card. Long
detail values, notices, and large balances wrap rather than widening the page.
Dialogs contain keyboard focus, close with Escape, restore the trigger's focus,
and prevent background scrolling. A keyboard skip link reaches the main content.
Reduced motion preferences disable continuous spinner animation and transitions.

## Manual visual review

At 320px, 390px, 768px, and 1440px, review each layout above using local API data.
Check long account names, large positive and negative balances, empty lists,
loading, API failures with retry, form validation, and deletion confirmations.
Confirm that only the table and mobile navigation scroll horizontally, actions
remain reachable, and mobile dialogs scroll when the keyboard is open.

Automated checks cover frontend interactions, keyboard dialog behavior, lint,
types, and production build. They do not replace browser visual review.
