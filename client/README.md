# City Vet client

React and TypeScript portal built with Vite and Tailwind CSS. Pet profiles and appointment requests use sample data held in memory; refreshing resets them.

## Development

```sh
npm ci
npm run dev
npm run typecheck
npm run build
npm run lint
```

## Source structure

- `src/assets/`: logo, hero image, and pet photos. Photo sources are documented in `src/assets/pets/README.md`.
- `src/components/layout/`: sidebar, header, and mobile bottom navigation.
- `src/components/ui/`: shared buttons, cards, badges, inputs, and page helpers.
- `src/data/`: mock pets, mock appointments, and dashboard sample content.
- `src/pages/`: Home, Pets, Appointments, Care, Assistant, and the existing account, settings, community, and fallback pages.
- `src/layouts/OwnerLayout.tsx`: owner portal shell.
- `src/hooks/`: shared React hooks.
- `src/lib/`: portal context and state provider.
- `src/types/`: shared TypeScript models.
- `src/services/`: reserved for future API integration.

The Assistant page provides navigation shortcuts. A conversational assistant is not connected.

`index.html`, TypeScript declarations, configuration files, and the dependency lockfile support the application even though the reference tree omits them. `node_modules/` and `dist/` are generated; do not commit them.
