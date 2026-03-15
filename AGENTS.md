# AGENTS.md — AI Agent Guardrails

> This file defines rules, boundaries, and instructions for AI agents working on this codebase.
> Following the [agents.md](https://agents.md/) convention.

## Project Context

**Vacation Planner** — A Next.js 15 + TypeScript web app for planning multi-segment vacations. Data flows through 3 tiers: mock JSON → manually verified (Claude-fetched) → live API. The app is generic (any destination), with Alaska 2026 as the initial mock dataset.

---

## Agent Roles & File Ownership

Each agent has a defined scope. Only modify files within your ownership. Cross-cutting changes (e.g., shared types) require backward compatibility.

### Cruise Data Agent
- **Owns**: `src/data/cruise-lines/*.json`
- **Can**: Create/update cruise line JSON files
- **Must**: Include `_meta` on every record, follow the `CruiseLine` type schema
- **Cannot**: Modify UI components, services, or types

### Land & Activities Data Agent
- **Owns**: `src/data/alaska/land-activities.json`, `src/data/alaska/accommodations.json`
- **Can**: Create/update land activity and accommodation JSON
- **Must**: Include `_meta` on every record
- **Cannot**: Modify UI components, services, or types

### Travel Data Agent
- **Owns**: `src/data/flights/*.json`, `src/data/alaska/car-rentals.json`
- **Can**: Create/update flight and car rental JSON
- **Must**: Include `_meta` on every record
- **Cannot**: Modify UI components, services, or types

### UI Agent
- **Owns**: `src/components/**`, `src/app/**` (pages only, not API routes)
- **Can**: Create/modify React components and pages
- **Must**: Use shadcn/ui primitives, build mobile-first responsive, use Zustand stores for state
- **Cannot**: Modify data JSON files, service implementations, or types directly

### Service Agent
- **Owns**: `src/lib/services/**`, `src/app/api/**`
- **Can**: Implement service interfaces and API routes
- **Must**: Follow interfaces defined in `src/lib/types/`, handle errors gracefully
- **Cannot**: Modify UI components or data JSON files

### Test Agent
- **Owns**: `__tests__/**`, `*.test.ts`, `*.spec.ts`, `playwright/**`
- **Can**: Create/modify test files
- **Must**: Use Vitest for unit/integration, Playwright for E2E
- **Cannot**: Modify application code (only test code)

---

## Coding Standards

### TypeScript
- Strict mode enabled
- No `any` types — use proper interfaces from `src/lib/types/`
- All exports must be typed

### Components
- Mobile-first responsive (Tailwind breakpoints: default=mobile, `md:`=tablet, `lg:`=desktop)
- Use shadcn/ui for all UI primitives (Button, Card, Dialog, Select, Tabs, etc.)
- Client components must be marked with `'use client'`
- Use Zustand for client state, TanStack Query for server/async state

### Data Records
- **Every** data record must include `_meta`:
  ```json
  {
    "_meta": {
      "source": "mock" | "manual" | "live",
      "lastUpdated": "2026-03-14",
      "updatedBy": "claude" | "manual" | "api"
    }
  }
  ```
- Never omit `_meta` — the UI relies on it for badge rendering

### Prices
- Store prices with original currency: `{ amount: 1200, currency: "USD" }`
- Always display in CAD using the `PriceDisplay` component
- Never hardcode exchange rates in components — use the exchange rate service

### Segment Types
- Read from data (`src/lib/utils/constants.ts`), not hardcoded enums
- New types can be added without code changes
- Each type has: `id`, `name`, `icon`, `color`

---

## Data Update Instructions

When Ken asks you to update mock data with real data:

### Step-by-Step Process
1. **Identify** the target JSON file in `src/data/`
2. **Fetch** real data using web search, scraping, or other research methods
3. **Update** the specific records in the JSON file, preserving the schema
4. **Change** `_meta` fields:
   ```json
   {
     "_meta": {
       "source": "manual",
       "lastUpdated": "2026-03-14",
       "updatedBy": "claude"
     }
   }
   ```
5. **Verify** the JSON is valid (no trailing commas, proper types)
6. **No rebuild needed** — the app reads JSON dynamically via API routes; just refresh the browser

### What to Update
- Prices: research current real prices
- Reviews: pull from TripAdvisor, Cruise Critic, Google Reviews
- Ship specs: verify against cruise line official websites
- Activity details: durations, physical levels, seasonal availability
- Flight routes/prices: check current airline pricing
- Hotel/Airbnb rates: check current listings

### When API Free Tier is Exhausted
If a domain's free API tier is near or at its limit:
1. The app shows a warning banner to Ken
2. Ken may ask you to manually fetch data instead
3. Follow the manual update process above
4. Set `_meta.source` to `"manual"` (not `"live"`)

---

## API Free Tier Limits

| Domain | API | Monthly Limit | Track In |
|--------|-----|--------------|----------|
| Weather | Open-Meteo | Unlimited | localStorage |
| Exchange Rate | ExchangeRate-API | 1,500 requests | localStorage |
| Flights | Amadeus Self-Service | 500 calls | localStorage |
| Hotels | Amadeus Hotel Search | 500 calls | localStorage |
| Maps | Google Maps Platform | $200 credit | Google Console |
| Car Rentals | None | N/A — manual only | — |
| Activities | None | N/A — manual only | — |
| Cruises | None | N/A — manual only | — |

---

## Phase Validation Rule

At the end of every phase (as defined in `PHASES.md`):

1. **Stop** — do not start the next phase.
2. **Ask Ken to validate** — summarize what was built and explicitly request his review and sign-off.
3. **Wait for feedback** — incorporate any corrections before marking the phase ✅ in `PHASES.md`.
4. **Then proceed** — only begin the next phase after Ken confirms.

This applies to all agents. No agent may skip validation to start the next phase early.

---

## Worktree & Merge Workflow

When working in a git worktree, **never merge directly into main locally**. Instead:

1. **Commit** your changes in the worktree branch.
2. **Push** the worktree branch to the remote.
3. **Create a GitHub PR** (`gh pr create`) for Ken to review.
4. **Merge on GitHub** — Ken will review and merge the PR on GitHub.

This applies to all agents. No agent may bypass PR review by merging locally.

---

## Requirements Tracking

When Ken makes suggestions, asks questions, or adds ideas that affect how the app should work:

1. **Propose changes first** — before editing `REQUIREMENTS.md` or `README.md`, tell Ken exactly what you plan to add, change, or remove. Wait for his approval.
2. **Update only after confirmation** — once Ken approves, update `REQUIREMENTS.md` and `README.md` as agreed.
3. **Confirm the result** — after updating, summarize what was changed in each file (1–3 sentences per file). Do not silently update files.
4. **Scope**: Any change to user-facing behavior, data model, navigation, UI patterns, or business rules counts. Cosmetic/wording tweaks do not need updates.

### Wireframe-Driven Changes

When Ken requests design changes in the wireframe, **do not automatically update requirements**. Instead:

1. **Implement the wireframe change** as requested.
2. **Ask Ken** whether the associated requirements should be: **(a)** updated to reflect the new design, **(b)** tweaked (and clarify what needs adjustment), or **(c)** completely discarded.
3. **Only then** update `REQUIREMENTS.md` and `README.md` based on Ken's answer.

This applies to all agents. Never silently propagate wireframe changes into requirements.

---

## Progress Tracking

- All agents append to `PROGRESS.md` in their **own named section**
- **Never** edit another agent's section
- Format:
  ```
  ## [Agent Name]
  - [2026-03-14] Description of work completed
  ```
- Update after each meaningful unit of work

---

## Testing Requirements

### Bug Fix Rule
**Every bug fix must include a unit test that reproduces the bug.** No exceptions, project-wide, all agents.

1. Write a failing test that reproduces the bug
2. Fix the bug
3. Confirm the test now passes
4. Test name should describe the bug scenario (e.g., `should not crash when price is undefined`)

### TDD (test-first)
Write tests **before** implementation for:
- Segment connectivity validator
- Price calculator
- Packing rules engine
- Currency conversion utils
- Date/duration utils

### Integration Tests (test-after)
- Service layer: verify mock services return correct shapes
- API routes: request/response contract tests

### E2E Tests (test-after)
- Key user flows with Playwright
- Include mobile viewport (375px) tests

### Coverage Targets
- 80%+ for TDD modules
- 60%+ overall

Track all progress in `TESTING.md`.

---

## File Ownership Summary

| Path | Owner |
|------|-------|
| `src/data/cruise-lines/` | Cruise Data Agent |
| `src/data/alaska/land-activities.json` | Land Data Agent |
| `src/data/alaska/accommodations.json` | Land Data Agent |
| `src/data/flights/` | Travel Data Agent |
| `src/data/alaska/car-rentals.json` | Travel Data Agent |
| `src/components/` | UI Agent |
| `src/app/**/page.tsx` | UI Agent |
| `src/lib/services/` | Service Agent |
| `src/app/api/` | Service Agent |
| `src/lib/types/` | Shared (backward-compatible changes only) |
| `src/lib/stores/` | UI Agent |
| `src/lib/hooks/` | UI Agent |
| `src/lib/validators/` | Service Agent |
| `src/lib/utils/` | Shared |
| `__tests__/`, `*.test.*` | Test Agent |
| `PROGRESS.md` | All (append-only to own section) |
| `TESTING.md` | Test Agent |
