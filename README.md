# Forked: Personal Decision Studio

A local-first personal decision simulator built with Vue 3 and TypeScript. It empowers users to compare alternative life or career crossroads, model financial and time trade-offs, stress-test assumptions reactively, maintain an evaluation journal, and generate shareable story summaries without external servers, tracking, or accounts.

---

## Key Features

- **Multi-Path Decision Comparison**: Compare multiple alternative paths side-by-side with configurable heuristic scoring weights (financial return, time freedom, growth trajectory, risk tolerance).
- **Smooth Page Transitions**: Flawless fade & blur page transitions across all primary views with hardware-accelerated motion smoothing.
- **Pure Reactive Simulation (What-If Sandbox)**: Dynamically stress-test income, expenses, and hours without modifying original saved assumptions.
- **Assumption & Evidence Tracking**: Track assumptions categorized by certainty level, validation status, and factual evidence.
- **Decision Journal & Review Workflow**: Record rationale at the moment of choosing, set future review dates, and capture actual outcomes with post-decision reflections.
- **Client-Side Story & Feed Generator**: Export 9:16 Story and 1:1 Feed graphic cards rendered on-device using HTML5 Canvas—ready to share or archive.
- **Smart Morphing Backup Interface**: Floating backup menu with fluid circle-button morphing, staggered spring entrances, and timed exit animations.
- **Privacy Policy & Terms of Use**: Dedicated transparent legal views emphasizing local-first data sovereignty, zero telemetry, and heuristic clarity, accompanied by custom SVG vector illustrations.
- **Local-First Security & Schema Validation**: 100% on-device data persistence via browser IndexedDB, rigorously validated with Zod schemas.
- **Adaptive Dark / Light Themes**: Theme switching with View Transitions API radial ripple reveal and full contrast accessibility.
- **Bilingual Interface**: Full localization in Indonesian (`id`) and English (`en`).
- **Progressive Web App (PWA)**: Installable on desktop and mobile devices with full offline operation.
- **Browser Compatibility Guard**: Automatic detection and helpful guidance for restricted in-app webviews (Instagram, TikTok, etc.).

---

## Technology Stack

- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Language**: TypeScript 5.7+ (strict mode enabled)
- **Styling**: Tailwind CSS v4 (CSS `@theme` variables and utility classes)
- **State Management**: Pinia 3
- **Schema Validation**: Zod 4
- **Local Persistence**: IndexedDB (sandboxed per origin via `forked-local`)
- **Icons**: Custom lightweight SVG icon library (`AppIcons.ts`)
- **Build System**: Vite 6

---

## Project Structure

```text
src/
├── components/          # Vue UI components
│   ├── common/          # Reusable widgets (BrandLogo, ThemeToggle, LanguageSwitcher, PolicyShieldIllustration, etc.)
│   ├── decision/        # Domain components (ScenarioCard, WhatIfSimulator, AssumptionManager)
│   ├── layout/          # Application shell (AppTopbar, AppSidebar)
│   ├── modals/          # Modal dialogs (CreateDecisionModal, WeightsModal, JournalModal, ShareStoryModal, etc.)
│   └── views/           # Primary views
│       ├── OverviewView.vue          # Dashboard summary and recent decision queue
│       ├── DecisionStudioView.vue    # Core decision matrix and scenario comparison
│       ├── JournalView.vue           # Chronological decision reflection log
│       ├── PrivacyPolicyView.vue     # Local-first privacy policy view
│       └── TermsOfUseView.vue        # Terms of use and heuristic usage guidelines
├── composables/         # Reusable composables (useDecisions, useToast, useConfirm, useTheme, usePwa, useBrowserSupport)
├── i18n/                # Internationalization dictionaries (id.ts, en.ts) and reactive loader
├── schemas/             # Single-source-of-truth Zod schemas for decision entities and backups
├── services/            # Pure domain services (scoring, simulation, storage, validation)
├── stores/              # Pinia state management stores
├── types/               # Type definitions and navigation contracts
├── App.vue              # Main application shell with Transition wrapper
├── main.ts              # Application bootstrap and PWA service worker registration
└── style.css            # Tailwind CSS v4 tokens, page transitions, and theme styles
```

---

## Running Locally

### Prerequisites
- Node.js 22.12 or newer
- npm 10 or newer

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Run automated test suite**:
   ```bash
   npm test
   ```

4. **Verify production build**:
   ```bash
   npm run build
   npm run preview
   ```

---

## Scoring Mechanics

The heuristic score produces a normalized index between 0 and 100 based on four weighted dimensions:

1. **Financial Return** (default: 35%): Normalized net monthly income (income minus expenses) against a regional baseline reference.
2. **Time Freedom** (default: 20%): Normalized available free time based on committed weekly hours (calculated against a 60-hour cap).
3. **Growth Potential** (default: 30%): Long-term personal or career growth rating (0 to 100).
4. **Risk Tolerance** (default: 15%): Inverted risk calculation where lower risk yields higher score points (`100 - risk`).

$$Score = (Money \times W_{money}) + (Time \times W_{time}) + (Growth \times W_{growth}) + ((100 - Risk) \times W_{risk})$$

Weights can be customized per decision and are normalized automatically. The computed score is a cognitive mirror for self-reflection and comparison, not an algorithmic decree.

---

## Data Sovereignty & Privacy

- **100% Stored Locally**: All decision data is kept exclusively in your device's browser IndexedDB (`forked-local`).
- **No Cloud Server & No Accounts**: No logins, email addresses, phone numbers, or passwords.
- **Zero Third-Party Telemetry**: No trackers, analytics scripts, or cookies.
- **Export Anytime**: Export complete decision histories to open `.json` files or copy data to clipboard at any moment.

---

## Deployment

The application compiles into lightweight static files (`dist/`) suitable for deployment on any static hosting platform (Cloudflare Pages, Vercel, Netlify, GitHub Pages, or AWS S3):

```bash
npm run build
```

Configure the publishing directory to `dist` and Node.js version to `>= 22.12.0`.
