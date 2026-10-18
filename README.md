# Forked: Personal Decision Studio

A local-first personal decision simulator built with Vue 3 and TypeScript. It allows users to compare alternative choices, model financial and time trade-offs, stress-test assumptions reactively, and maintain an evaluation journal without external servers or accounts.

## Core Features

- Multi-path decision comparison with configurable weights (financial return, time freedom, growth trajectory, risk tolerance).
- Pure reactive simulation engine (What-If stress test) that models revenue and cost shifts without mutating stored assumptions.
- Assumption and evidence tracking categorized by facts, estimates, and unverified assumptions.
- Decision journal for recording decision rationale, expected timelines, and post-outcome reviews.
- Local storage via browser IndexedDB with strict Zod schema validation.
- JSON backup export and import with duplicate check and size validation (10 MB limit).
- Smooth dark and light theme switching powered by the View Transitions API.
- Bilingual interface (Indonesian and English).

## Technology Stack

- Framework: Vue 3 (Composition API)
- Language: TypeScript 5.7+
- Styling: Tailwind CSS v4 (zero-config integration via `@tailwindcss/vite` and CSS `@theme` variables)
- State Management: Pinia 3
- Data Validation: Zod 4
- Local Database: IndexedDB (`idb` native wrapper)
- Icons: Lucide Vue Next
- Build Tool: Vite 6

## Project Structure

```text
src/
├── components/          # Vue presentation components
│   ├── common/          # Shared controls (ThemeToggle, LanguageSwitcher, ConfirmModal)
│   ├── decision/        # Decision domain widgets (ScenarioCard, WhatIfSimulator, AssumptionManager)
│   ├── layout/          # Application shell (AppTopbar, AppSidebar)
│   ├── modals/          # Modal dialogs (CreateDecisionModal, WeightsModal, JournalModal)
│   └── views/           # Primary page views (OverviewView, DecisionStudioView, JournalView)
├── composables/         # Reusable composition helpers (useDecisions, useToast, useConfirm, useTheme)
├── i18n/                # Internationalization dictionaries (id.ts, en.ts) and reactive loader
├── schemas/             # Single source of truth Zod schemas for decision entities and backups
├── services/            # Pure business logic and infrastructure services
│   ├── scoring.ts       # Deterministic score calculation and currency formatting
│   ├── simulation.ts    # Reactive scenario stress-testing engine
│   ├── storage.ts       # IndexedDB persistence adapter
│   └── validation.ts    # JSON backup parsing and schema safety checks
├── stores/              # Pinia state stores (decision.store.ts, theme.store.ts)
├── types/               # Type definitions derived from Zod schemas
├── App.vue              # Main application shell
├── main.ts              # Entry point and Pinia initialization
└── style.css            # Base Tailwind v4 entry and semantic color tokens
```

## Running Locally

Prerequisites: Node.js 22.12 or newer (required for Node.js built-in TypeScript type stripping in tests).

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Run automated tests:
```bash
npm test
```

4. Verify production build:
```bash
npm run build
npm run preview
```

## Scoring and Simulation Mechanics

The heuristic score produces a normalized index between 0 and 100 based on four weighted dimensions:

1. Financial Return (default weight: 35%): Normalized net monthly income (income minus expenses) against an Indonesian baseline reference.
2. Time Freedom (default weight: 20%): Normalized available time based on committed hours per week (calculated from a 60-hour baseline cap).
3. Growth Potential (default weight: 30%): Long-term career or personal upside assessment (0 to 100).
4. Risk Tolerance (default weight: 15%): Inverted risk score where lower risk yields higher points (100 minus risk value).

Formula:
```text
Score = (MoneyIndex * WeightMoney) + (TimeIndex * WeightTime) + (GrowthIndex * WeightGrowth) + ((100 - Risk) * WeightRisk)
```

Weights can be customized per decision and are automatically normalized so their sum equals 1.0. The score serves as an explicit relative guide for comparison, not an algorithmic prediction.

## Data Persistence and Privacy

All application data is stored in the user's browser using IndexedDB under the database name `forked-local`.
- No remote telemetry or tracking.
- No network requests for saving or reading user records.
- Clearing browser storage or using a private/incognito window will reset local records.
- Regular use of the Export Backup function is recommended for long-term data retention.

## Deployment

The application compiles to standard static assets (`dist/`) and can be hosted on any static provider (Cloudflare Pages, Vercel, Netlify, GitHub Pages, or AWS S3):

```bash
npm run build
```

Set the build output directory to `dist` and the Node.js version to `22.12.0` or higher.
