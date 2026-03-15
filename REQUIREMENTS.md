# Vacation Planner — Product Requirements

> Living document. Updated as new decisions are made.
> See `REWRITE-WIREFRAME.md` for the Phase 0 (wireframe-only) change log.

## Wireframe Versions
| File | Description |
|------|-------------|
| `wireframe-v1.html` | Phase 0 complete (all 10 REWRITE-WIREFRAME changes applied) |
| `wireframe-v2.html` | Current — adds right slideout, event costs, segment event toggles |

---

## Core Principles

1. **Any trip, any destination** — Alaska 2026 is the demo dataset. The app is generic.
2. **Mobile-first** — Designed for 375px upward. Desktop is a single-column centered layout (max 900px), no sidebar.
3. **3-tier data confidence** — Every data record shows a badge: Mock (yellow) / Verified (blue) / Live (green). Users always know what's estimated vs real.
4. **All prices in CAD** — Using exchange rate service; never hardcode rates in components.
5. **Offline-tolerant** — Core planning works without network; API calls are enhancement only.

---

## Trip Structure

### Segments
- A trip is composed of 1–N sequential **segments**.
- Each segment has a `type`: Cruise, Land/Resort, Adventure, Beach, Cultural, Safari, Road Trip, Backpacking, Ski, River Cruise, Island Hopping, Wellness/Spa.
- Segment types are data-driven (not hardcoded enums). New types can be added via `src/lib/utils/constants.ts`.
- **Date overlap rule**: Every segment's start date must equal the previous segment's end date (departure day = arrival day of the next segment). This mirrors real-world travel where check-out and check-in happen on the same calendar day.
- Segments can have `±Y days` flex on duration for itinerary variants.

### Between-Segment Flights
- Between any two adjacent segments, users can optionally add a **connecting flight**.
- The Trip Overview shows a compact CTA connector between each pair of segment cards: "✈ Optional connecting flight — [+ Add Flight]".
- Tapping "+ Add Flight" navigates to the Travel view where the user can search or manually enter flight details.
- These inter-segment flights appear in the price breakdown and are included in the route map.

---

## Views / Pages

### Trip Overview (`/trip-overview`)
- Price header (sticky, shows total + breakdown by category).
- Calendar timeline (horizontal scroll, color-coded by segment type, clickable days open day-detail drawer).
- Route map (SVG transit-style illustration with flight arcs, cruise line, drive segments, labeled city dots).
- **Segment cards** — enhanced display:
  - Colored left border + segment type pill at top.
  - Dates displayed prominently (bold, large, with calendar icon).
  - Location: City + State/Country format.
  - For Cruise segments: ship name + cruise line, or "No ship selected — tap to search" (muted).
  - For Land/Adventure segments: accommodation row + transport row, each individually tappable.
  - Tapping a card in "empty" state → opens Search mode within the target view.
  - Tapping a card with selections → opens Detail/management mode.
  - **Events toggle**: each segment card has a "▸ View events / ▾ Hide events" toggle that expands/collapses the scheduled events for that segment's days. Shows date, time, description, category badge, and cost badge (if applicable).
- **Between-segment flight CTAs** between every pair of adjacent segment cards (see above).
- "Edit Trip Segments" button at bottom → wizard step 2.

### Accommodations (`/accommodations`)
- Toggle: Hotels / Airbnb / All.
- Browse grid of accommodation cards (photo, name, location, stars, price/night, amenity chips).
- **Custom accommodation entry** (collapsible `<details>` section at bottom, "Enter your own accommodation"):
  - Fields: Property Name, Location/Address, Check-in Date, Check-out Date, Price/Night (CAD), Confirmation #, Notes.
  - Save button adds it to the segment's accommodation list.

### Travel (`/travel`)
- Sections: Flights (search results), Car Rental (option grid).
- **Custom transport entry** (collapsible `<details>` section at bottom, "Enter your own transport details"):
  - Fields: Transport Type (select: Flight, Train, Bus/Coach, Ferry, Car Rental, Private Transfer, Other), Provider/Carrier, From, To, Departure datetime, Arrival datetime, Total Cost (CAD), Confirmation #, Notes.
  - Save button adds it to the segment's transport list.

### Cruise Browse (`/cruise-browse`)
- Filter bar: Cruise line, price range, duration.
- Grid of ship cards with compare checkbox.
- Compare float button (appears when 2+ ships selected) → Compare view.

### Cruise Detail (`/cruise-detail`)
- Tab system: Overview, Staterooms, Dining, Ports, Activities, Entertainment, Reviews.
- Overview tab: specs table (two-column, grouped by Ship Size / Capacity / Onboard), CSS tooltips on hover for technical terms.
- Trip context header (breadcrumb + price summary) at top of all segment-context views.

### Land Activities (`/land-activities`)
- Filter bar: activity type, physical level, duration, price.
- Activity cards with physical level badge.

### Packing List (`/packing`)
- Per-traveller tabs.
- Smart recommendations based on segment types + weather.
- Category grouping, checkbox progress bar.

### Settings (`/settings`)
- API usage gauges per domain (Exchange Rate, Flights, Hotels, Maps).
- Trip meta editing (name, dates, travellers, base currency).

### Wizard (`/wizard-1`, `/wizard-2`, `/wizard-3`)
- Step 1: Trip basics (name, destination, dates, travellers).
- Step 2: Segment builder (add/remove/reorder segments, set types + durations).
- Step 3: Review summary → confirm → go to Trip Overview.
- Connectivity warning shown when geographic gap exists between adjacent segments.

---

## Navigation

- **Mobile**: Bottom nav (5 tabs: Trip, Cruise, Activities, Pack, Settings) + top header with back button.
- **Desktop** (≥900px): Sticky top bar (trip title + settings gear). No sidebar. Single centered column. Desktop back button in content area above page title.
- View history stack (`viewHistory[]`) for back navigation.
- Back button hidden on root/dashboard view.

---

## Calendar Day Detail
- Every day cell in the calendar timeline is tappable.
- Opens a **right slide-out panel** (slides in from the right on all screen sizes; max-width 420px, full-width on small screens).
- Panel shows: day header ("Jun 17 — Juneau, Alaska"), vertical event timeline with times and descriptions.
- Each event has Edit (✏) and Delete (🗑) icon buttons.
- "+ Add Event" reveals inline form: time, description, category (Port, Dining, Excursion, Onboard, Transit), **duration (dropdown, 15-min increments from 15 min up to Full day)**, **cost (CAD, optional — 0 = free)**, Save/Cancel.
- **Auto-sort by time**: events in the panel are always displayed in chronological order by start time. Adding a new event re-sorts the list immediately.
- **Event costs**: when a cost > 0 is entered, the event displays a green cost badge and the cost is added to the trip overall total.
- Deleting a costed event removes its cost from the totals.
- Dark backdrop closes drawer on tap.

---

## Data Model Highlights

- `_meta` required on every data record (source, lastUpdated, updatedBy).
- Prices: `{ amount: number, currency: string }` — always display via `PriceDisplay` component.
- Segment connectivity validator checks geographic adjacency and surfaces transit suggestions.
- Exchange rate cached in localStorage; updated on demand.

---

## API Free Tier Limits

| Domain        | API                  | Monthly Limit | Notes                     |
|---------------|----------------------|---------------|---------------------------|
| Weather       | Open-Meteo           | Unlimited     | No key required           |
| Exchange Rate | ExchangeRate-API     | 1,500 req     | Tracked in localStorage   |
| Flights       | Amadeus Self-Service | 500 calls     | Tracked in localStorage   |
| Hotels        | Amadeus Hotel Search | 500 calls     | Tracked in localStorage   |
| Maps          | Google Maps Platform | $200 credit   | Track in Google Console   |
| Car Rentals   | None                 | Manual only   | —                         |
| Activities    | None                 | Manual only   | —                         |
| Cruises       | None                 | Manual only   | —                         |

---

## Open Questions / Future Scope

- [ ] Share trip with Lan: read-only link or co-edit mode?
- [ ] Offline PWA: service worker + cache strategy for data JSON.
- [ ] PDF export of full itinerary.
- [ ] Native drag-to-reorder for segment cards and day events.
- [ ] Weather integration on calendar cells (temperature + icon from Open-Meteo).
- [ ] Real flight search via Amadeus when within free tier.
- [ ] Segment connectivity: auto-suggest ferry/train when gap detected between segment end and start cities.
