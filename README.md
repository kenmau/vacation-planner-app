# Vacation Planner

A web application for planning multi-segment vacations — cruise, land, adventure, and more — all in one place.

Built for Ken and Lan, but fully reusable for any trip to any destination.

## Key Features

- **Multi-segment trip builder** — Compose trips from multiple segment types (Cruise, Land/Resort, Adventure, Beach, Cultural, Safari, Road Trip, Backpacking, Ski, River Cruise, Island Hopping, Wellness/Spa). Same type can repeat. Flexible durations with ±Y days support.
- **Cruise ship comparison** — Browse ships across 5 cruise lines, compare up to 4 side-by-side (specs, staterooms, dining, ports, activities, reviews).
- **Interactive Google Map** — Itinerary overlay with colored route polylines, markers, and segment highlighting synced with the calendar.
- **Color-coded calendar timeline** — Horizontal scrollable calendar with segments color-coded by type, weather icons, and port/city names. Tap any day to open a right slide-out detail panel.
- **Real-time weather** — Open-Meteo integration (free, no API key) for forecasts and historical averages.
- **Smart packing list** — Auto-recommends items based on segment types, activities, and weather. Inline "Add" CTAs throughout the app. Per-traveller lists with checkboxes and progress tracking.
- **Segment connectivity validator** — Catches geographic gaps between segments (e.g., Whittier → Anchorage) and suggests transit options.
- **All prices in CAD** — Persistent price header with real-time breakdown by category. User-added calendar events with costs roll up into segment and trip totals.
- **3-tier data sourcing** — Mock (yellow badge), Manual/Verified with fetch date (blue badge), Live API (green badge). You always know what's real vs estimated.
- **API usage tracking** — Settings page shows per-domain API call counts, free tier limits, and warnings at 80%.
- **Everything is editable** — Trip name, duration, segments, locations, and all selections can be modified after creation.
- **Trip-contextual navigation** — Cruise, Activities, Accommodations, and Travel views are accessed through a trip's segments, not via standalone nav. Global nav has only Trips, Pack, and Settings.
- **Mobile-first responsive** — Works on phone, tablet, and desktop.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State**: Zustand (client) + TanStack Query (server)
- **Persistence**: localStorage (database-ready data model)
- **Testing**: Vitest (unit/integration) + Playwright (E2E)
- **Maps**: Google Maps (`@vis.gl/react-google-maps`)
- **Weather**: Open-Meteo (free, no key required)

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
cd vacation-planner-app
npm install
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Test

```bash
npm test              # Unit/integration (Vitest)
npm run test:e2e      # End-to-end (Playwright)
```

## Project Structure

```
src/
├── app/                        # Next.js pages and API routes
│   ├── page.tsx                # Dashboard (trip list)
│   ├── settings/               # API usage tracking, preferences
│   ├── trip/new/               # Trip creation wizard
│   ├── trip/[tripId]/          # Trip overview, cruise, land, travel, compare, packing
│   └── api/                    # Service endpoints (cruises, flights, accommodations, etc.)
├── components/                 # React components
│   ├── layout/                 # PriceHeader, CalendarTimeline, TripMap, Navigation
│   ├── trip/                   # TripWizard, SegmentBuilder, DurationPicker
│   ├── cruise/                 # CruiseLineCard, ShipCard, CompareGrid
│   ├── land/                   # AccommodationCard, ActivityCard
│   ├── travel/                 # FlightCard, CarRentalCard
│   ├── packing/                # PackingList, PackingItem, PackingProgress
│   ├── weather/                # WeatherBadge, WeatherForecast
│   └── shared/                 # PriceDisplay, RatingStars, MockBadge
├── lib/
│   ├── types/                  # TypeScript interfaces
│   ├── services/               # Service layer (mock → API swappable)
│   ├── stores/                 # Zustand stores (trip, price, compare)
│   ├── hooks/                  # TanStack Query hooks
│   ├── validators/             # Segment connectivity validator
│   └── utils/                  # Currency, dates, packing rules
└── data/                       # Mock JSON data files
    ├── cruise-lines/           # 5 cruise lines, 4 ships each
    ├── alaska/                 # Land activities, accommodations, car rentals
    └── flights/                # YYZ routes
```

## Data Management

### 3-Tier Data Model

All data records include a `_meta` field:

```json
{ "_meta": { "source": "mock", "lastUpdated": "2026-03-14", "updatedBy": "claude" } }
```

| Source | Badge | Meaning |
|--------|-------|---------|
| `mock` | Yellow "Mock" | Placeholder/estimated data |
| `manual` | Blue "Verified · date" | Real data fetched by Claude, shows when it was last updated |
| `live` | Green "Live" | Real-time from API |

### Updating Mock Data with Real Data

Ask Claude to fetch real data for any item. Claude will:
1. Research the real information
2. Update the JSON file in `src/data/`
3. Change `_meta.source` to `"manual"` with today's date
4. The app reads JSON dynamically — just refresh to see updates

See [AGENTS.md](AGENTS.md) for detailed instructions.

## Free APIs

| Domain | API | Free Tier |
|--------|-----|-----------|
| Weather | Open-Meteo | Unlimited, no key |
| Exchange Rate | ExchangeRate-API | 1,500 req/mo |
| Flights | Amadeus Self-Service | 500 calls/mo |
| Hotels | Amadeus Hotel Search | 500 calls/mo |
| Maps | Google Maps Platform | $200/mo free credit |

Domains without free APIs (cruises, car rentals, activities) use mock data updated manually by Claude.

## Wireframe Versions

| File | Description |
|------|-------------|
| `wireframe-v1.html` | Phase 0 complete (all 10 REWRITE-WIREFRAME changes applied) |
| `wireframe-v2.html` | Current — right slide-out day panel, event costs, segment event toggles |

## Other Docs

- [PHASES.md](PHASES.md) — Phased build plan with completion status
- [AGENTS.md](AGENTS.md) — AI agent guardrails and data update instructions
- [REQUIREMENTS.md](REQUIREMENTS.md) — Full product requirements
- [PROGRESS.md](PROGRESS.md) — Build progress tracker
- [TESTING.md](TESTING.md) — Test plan and progress
