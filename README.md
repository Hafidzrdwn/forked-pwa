# Forked — Personal Decision Studio

A local-first decision simulator that helps you compare paths, make assumptions explicit, stress-test scenarios, and learn from outcomes.

## Features

- Create and manage personal decisions
- Compare multiple paths using a transparent heuristic score
- Edit monthly income, costs, hours, growth potential, and risk
- Stress-test income assumptions with a what-if slider
- Keep assumptions and confidence levels for a selected path
- Record reasoning, expected outcomes, actual outcomes, and reflections
- Store data in IndexedDB in the current browser
- Export and import a JSON backup
- Responsive light-minimal interface
- Editable decision title/context and scenario descriptions
- Keyboard Escape support for closing active dialogs
- Backup schema validation, duplicate-ID checks, and 10 MB import limit
- Income stress test correctly adjusts income while keeping costs fixed
- PWA manifest and service-worker shell caching

## Tech stack

- Vue 3 + TypeScript + Vite
- IndexedDB for local persistence
- Lucide Vue icons
- Plain CSS for the design system (no Tailwind build step required)

## Run locally

Requires Node.js 22.12+ (the built-in test runner uses Node.js TypeScript type stripping).

```bash
npm install
npm run dev
```

Run the built-in scoring and backup-validation tests:

```bash
npm test
```

To create a production build:

```bash
npm run build
npm run preview
```

## Deploy for free

### Cloudflare Pages

1. Push this folder to a GitHub repository.
2. In Cloudflare Pages, create a project and connect the repository.
3. Set the Node.js version to `22.12.0` (via the `NODE_VERSION` environment variable if the dashboard requires it).
4. Set build command to `npm run build`.
5. Set output directory to `dist`.
6. Deploy.

This is a static frontend; there is no API server or paid database requirement.

A GitHub Actions workflow runs the tests and production build on pushes and pull requests.

Alternative: deploy the `dist` folder to any static host that supports Vite output.

## Important local-data note

IndexedDB data belongs to the browser profile and origin where it was created. Clearing site data, using another browser/device, or changing the deployed origin may make it unavailable. Use **Export backup** regularly and keep the JSON file somewhere safe. Import replaces the current local data after confirmation.

## Scoring model

The score is intentionally a transparent heuristic, not a prediction or an objective truth:
- Money: 35%
- Time: 20%
- Growth potential: 30%
- Risk tolerance (lower risk scores higher): 15%

The current money normalization assumes a rough net-monthly range of -Rp2,000,000 to Rp5,000,000. Treat this as a rough comparison scale, not financial advice. Users should choose weights based on what matters to them rather than treating the score as a verdict.

## MVP limitations / next steps

- Add browser-level end-to-end tests for IndexedDB persistence and backup/restore
- Run an accessibility audit and test with real screen readers and keyboard-only navigation
- Run the production build in CI and verify deployment on the target static host
- Consider scenario-specific journal history and optional encrypted backup in a later release
