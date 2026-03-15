# Vacation Planner — Build Phases

> Tracks the phased build plan. Update status as work completes.
> **Validation rule**: At the end of every phase, pause and ask Ken to review before starting the next phase.

---

## Status Legend
| Symbol | Meaning |
|--------|---------|
| ✅ | Complete — validated by Ken |
| 🔄 | In progress |
| ⏳ | Not started |
| 🔁 | Awaiting Ken's validation |

---

## Phase 0 — Wireframe & Requirements ✅
**Goal**: Lock down UX patterns, component inventory, and data model before writing framework code.

- [x] Interactive HTML wireframe v1 — all 10 REWRITE-WIREFRAME changes applied
- [x] Interactive HTML wireframe v2 — right slide-out day panel, event costs, segment event toggles, auto-sort, duration picker
- [x] REQUIREMENTS.md — full product requirements documented
- [x] AGENTS.md — agent roles, file ownership, coding standards
- [x] README.md — project overview, tech stack, structure

**Validated by Ken**: ✅ 2026-03-15

---

## Phase 1 — Foundation ⏳
**Goal**: Next.js app runs locally with routing shell, types, mock data, and design system in place. No real features yet — just the skeleton everything else builds on.

### Checklist
- [ ] Next.js 15 (App Router) + TypeScript scaffold
- [ ] Tailwind CSS v4 + shadcn/ui configured
- [ ] Zustand store shells (`tripStore`, `priceStore`, `compareStore`)
- [ ] All TypeScript interfaces in `src/lib/types/` (Trip, Segment, CruiseLine, Ship, Activity, Accommodation, Flight, CarRental, PackingItem, Event)
- [ ] Mock JSON data files (`src/data/cruise-lines/`, `src/data/alaska/`, `src/data/flights/`) — all with `_meta`
- [ ] Route structure scaffolded (dashboard, wizard, trip overview, cruise, land, travel, packing, settings)
- [ ] Exchange rate service stub (reads from localStorage, falls back to hardcoded rate)
- [ ] `PriceDisplay` component (always renders in CAD)
- [ ] `MockBadge` component (renders Mock / Verified / Live badges from `_meta`)
- [ ] Layout shell: bottom nav (mobile: Trips, Pack, Settings), desktop top bar (title, Pack, settings gear), back button logic

**End-of-phase validation**: Ask Ken to confirm the app boots, routes work, and the design system looks correct before proceeding.

**Validated by Ken**: ⏳

---

## Phase 2 — Trip Structure ⏳
**Goal**: A user can create a trip through the wizard, see their segments on the Trip Overview, and navigate between views.

### Checklist
- [ ] Wizard step 1 — trip name, origin city, duration (exact / flexible)
- [ ] Wizard step 2 — segment builder: type picker, duration, location, running day counter, connectivity warning
- [ ] Wizard step 3 — review summary → confirm → go to Trip Overview
- [ ] Date overlap validation — every segment's start date = previous segment's end date
- [ ] Trip Overview — sticky price header (total + breakdown by category)
- [ ] Trip Overview — enhanced segment cards (colored border, type pill, dates, route, sub-rows)
- [ ] Trip Overview — between-segment flight CTAs
- [ ] Trip Overview — segment events toggle (show/hide events per card)
- [ ] "Edit Trip Segments" button → wizard step 2
- [ ] View history stack + back navigation working on all views
- [ ] Bottom nav (Trips, Pack, Settings) + desktop top bar active state synced to current view

**End-of-phase validation**: Ask Ken to walk through creating a trip and confirm the overview looks and feels right.

**Validated by Ken**: ⏳

---

## Phase 3 — Calendar & Day Detail ⏳
**Goal**: The calendar timeline is interactive and users can manage daily events with costs.

### Checklist
- [ ] Horizontal scrollable calendar timeline (color-coded by segment, weather icons, city names)
- [ ] Tapping a day opens right slide-out detail panel (max 420px, full-width mobile)
- [ ] Day detail — event list auto-sorted by start time
- [ ] Day detail — add event form: time, description, category, duration (15-min increments), cost (CAD)
- [ ] Day detail — edit and delete events
- [ ] Event cost rolls up into segment total and trip overall total
- [ ] Deleting a costed event subtracts from totals
- [ ] Dark backdrop closes drawer on tap
- [ ] Calendar track cloned into cruise-browse, land-activities views (with segment highlighting)

**End-of-phase validation**: Ask Ken to tap through calendar days, add/delete events with costs, and verify totals update correctly.

**Validated by Ken**: ⏳

---

## Phase 4 — Cruise Module ⏳
**Goal**: Users can browse, compare, and select a cruise ship with full detail.

### Checklist
- [ ] Cruise browse — filter bar (cruise line, price range, duration)
- [ ] Cruise browse — ship cards grid with compare checkbox
- [ ] Cruise compare — side-by-side table, "best" value highlighting
- [ ] Cruise compare — float button appears when 2+ ships selected
- [ ] Cruise detail — gallery placeholder
- [ ] Cruise detail — 7 tabs: Overview, Staterooms, Dining, Ports, Activities, Entertainment, Reviews
- [ ] Cruise detail — specs table with CSS tooltips on technical terms
- [ ] Cruise detail — stateroom selection (updates price)
- [ ] Cruise detail — "Select This Ship" updates segment card on Trip Overview
- [ ] Trip context header (breadcrumb + price summary) on all cruise views

**End-of-phase validation**: Ask Ken to browse ships, compare two, select a ship, and confirm the Trip Overview segment card updates.

**Validated by Ken**: ⏳

---

## Phase 5 — Land & Accommodations ⏳
**Goal**: Users can browse activities and accommodations, or enter their own.

### Checklist
- [ ] Land activities — filter bar (region, price, physical level, duration)
- [ ] Land activities — activity cards with level badge, packing recommendation CTA
- [ ] Accommodations — Hotels / Airbnb / All toggle
- [ ] Accommodations — browse grid (photo, name, stars, price/night, amenity chips)
- [ ] Accommodations — custom entry form (name, address, dates, price/night, confirmation #, notes)
- [ ] Saved accommodation appears on segment card in Trip Overview
- [ ] Trip context header on land/accommodation views

**End-of-phase validation**: Ask Ken to browse activities, add a custom accommodation, and confirm the segment card reflects it.

**Validated by Ken**: ⏳

---

## Phase 6 — Travel ⏳
**Goal**: Users can view flight options, select a car rental, or enter custom transport details.

### Checklist
- [ ] Flights — search results list (airline, route, stops, duration, price)
- [ ] Car rental — option grid (economy / SUV / truck, price/day)
- [ ] Custom transport entry form (type, provider, from/to, departure/arrival datetime, cost, confirmation #, notes)
- [ ] Saved transport appears on segment card in Trip Overview
- [ ] Between-segment flight CTA on Trip Overview links to Travel view

**End-of-phase validation**: Ask Ken to select a car rental and enter a custom flight, then confirm the segment card shows both.

**Validated by Ken**: ⏳

---

## Phase 7 — Packing List ⏳
**Goal**: Smart, per-traveller packing list driven by segment types and weather.

### Checklist
- [ ] Per-traveller tabs (add/remove travellers)
- [ ] Category grouping (Clothing, Gear, Documents, Toiletries, Electronics, Cruise Formal)
- [ ] Checkbox progress bar
- [ ] Add custom item
- [ ] Smart recommendations engine — based on active segment types
- [ ] Weather-based recommendations — based on destinations (Open-Meteo stub)
- [ ] "Add to packing list" CTAs on activity cards wire into the list

**End-of-phase validation**: Ask Ken to check off items, add a custom item, and verify smart recommendations match the trip segments.

**Validated by Ken**: ⏳

---

## Phase 8 — Route Map ⏳
**Goal**: Visual SVG/Google Maps route map synced to trip segments.

### Checklist
- [ ] SVG fallback map — flight arcs (dashed), cruise line (solid blue), drive segments (solid green)
- [ ] City dots with labels, legend
- [ ] Google Maps integration (`@vis.gl/react-google-maps`) when API key present
- [ ] Route polylines color-coded by segment type
- [ ] Map updates when segments are added/removed

**End-of-phase validation**: Ask Ken to confirm the map renders correctly for the Alaska demo trip and reflects any segment changes.

**Validated by Ken**: ⏳

---

## Phase 9 — Live Integrations ⏳
**Goal**: Real data flows in for exchange rates, weather, flights, and hotels within free tier limits.

### Checklist
- [ ] Exchange rate service — ExchangeRate-API (1,500 req/mo), cached in localStorage
- [ ] Weather overlay on calendar — Open-Meteo (unlimited, no key)
- [ ] Amadeus flights search — within 500 calls/mo free tier
- [ ] Amadeus hotel search — within 500 calls/mo free tier
- [ ] API usage tracking in localStorage (per domain)
- [ ] Warning banner at 80% of any free tier limit

**End-of-phase validation**: Ask Ken to verify live prices appear, weather shows on the calendar, and the Settings page shows accurate API usage counts.

**Validated by Ken**: ⏳

---

## Phase 10 — Polish & Testing ⏳
**Goal**: Production-ready quality. 80%+ test coverage on TDD modules, E2E flows passing, no rough edges.

### Checklist
- [ ] Unit tests (Vitest) — segment connectivity validator (TDD)
- [ ] Unit tests (Vitest) — price calculator (TDD)
- [ ] Unit tests (Vitest) — currency conversion utils (TDD)
- [ ] Unit tests (Vitest) — date/duration utils (TDD)
- [ ] Unit tests (Vitest) — packing rules engine (TDD)
- [ ] Integration tests — service layer (mock services return correct shapes)
- [ ] Integration tests — API route contracts
- [ ] Playwright E2E — create trip flow (375px mobile viewport)
- [ ] Playwright E2E — cruise browse → select ship flow
- [ ] Playwright E2E — add event with cost → verify total updates
- [ ] 80%+ coverage on TDD modules, 60%+ overall
- [ ] Accessibility pass (keyboard nav, ARIA labels on interactive elements)
- [ ] Performance pass (no layout shift on view transitions, calendar renders <16ms)

**End-of-phase validation**: Ask Ken to review the test report, do a final walkthrough of the full trip planning flow, and sign off on v1.0.

**Validated by Ken**: ⏳

---

## Summary Table

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Wireframe & Requirements | ✅ |
| 1 | Foundation | ⏳ |
| 2 | Trip Structure | ⏳ |
| 3 | Calendar & Day Detail | ⏳ |
| 4 | Cruise Module | ⏳ |
| 5 | Land & Accommodations | ⏳ |
| 6 | Travel | ⏳ |
| 7 | Packing List | ⏳ |
| 8 | Route Map | ⏳ |
| 9 | Live Integrations | ⏳ |
| 10 | Polish & Testing | ⏳ |
