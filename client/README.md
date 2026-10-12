# City Vet client

React and TypeScript portal built with Vite and Tailwind CSS. Pet profiles and appointment requests use sample data held in memory; refreshing resets them.

## Development

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
npm run lint
```

## Source structure

- `src/assets/`: logo, hero image, and pet photos. Photo sources are documented in `src/assets/pets/README.md`.
- `src/components/layout/`: sidebar, header, and mobile bottom navigation.
- `src/components/ui/`: shared buttons, cards, badges, inputs, and page helpers.
- `src/components/pets/`: pet preview helpers, record editor, passport, document vault, and care interfaces.
- `src/data/`: mock pets, mock appointments, and dashboard sample content.
- `src/pages/`: Home, Pets, Appointments, Care, Assistant, and the existing account, settings, community, and fallback pages.
- `src/layouts/OwnerLayout.tsx`: owner portal shell.
- `src/hooks/`: shared React hooks.
- `src/lib/`: portal context and state provider.
- `src/types/`: shared TypeScript models.
- `src/services/`: reserved for future API integration.

The Assistant page provides navigation shortcuts. A conversational assistant is not connected.

## Pet workspace preview

`/my-pets` includes search, selection, overview totals, and recent activities. Each pet has profile, passport, documents, timeline, care, editing, and analytics routes. Recharts loads only when analytics is opened. Pet records share the portal's in-memory state so frontend edits update the other views.

Registration supports drafts, review, printing, and mock submission. The ₱100 fee is described as paid face-to-face; no payment or official approval is simulated. Only mock Registered pets can create a new preview service request. Private owner health notes are excluded from the printable registration form and summary export. Staff privacy enforcement is reserved for the backend.

Documents keep mock metadata only; selected photos are shown in memory. The connection/sync indicators are explicitly simulated, and all pet edits reset on refresh. There is no backend, database, file storage, PWA, or AI inference integration.

`npm test` checks analytics totals, date boundaries, latest weight, vaccination prompts, and approved appointment counting using Node's built-in test runner (Node 22.6+ with TypeScript stripping).

`index.html`, TypeScript declarations, configuration files, and the dependency lockfile support the application even though the reference tree omits them. `node_modules/` and `dist/` are generated; do not commit them.
