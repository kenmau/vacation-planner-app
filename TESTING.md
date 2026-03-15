# Vacation Planner — Test Plan & Progress

## Strategy
- **TDD (test-first)**: Validators, calculators, rules engines, pure utility functions
- **Test-after**: Service layer, API routes, E2E flows
- **Not tested**: Individual UI component rendering (shadcn upstream), styling

## Tools
- **Vitest**: Unit and integration tests
- **Playwright**: End-to-end tests
- **Coverage target**: 80%+ for TDD modules, 60%+ overall

---

## TDD Modules (write tests BEFORE implementation)

### Segment Connectivity Validator
- [ ] Test: adjacent segments at same location → no warning
- [ ] Test: adjacent segments at different locations → warning with transit suggestion
- [ ] Test: transit map lookup returns correct mode/duration
- [ ] Test: reordering segments re-validates
- [ ] Test: adding segment between two others re-validates

### Price Calculator
- [ ] Test: single segment price calculation
- [ ] Test: multi-segment total
- [ ] Test: per-person vs total toggle
- [ ] Test: currency conversion USD → CAD
- [ ] Test: price updates when selections change

### Packing Rules Engine
- [ ] Test: cruise segment → formal wear recommendation
- [ ] Test: hiking activity → boots, layers recommendation
- [ ] Test: rain forecast → rain jacket recommendation
- [ ] Test: duration → clothing quantity scaling
- [ ] Test: no duplicate recommendations across segments

### Currency Conversion Utils
- [ ] Test: USD to CAD conversion
- [ ] Test: format CAD display string
- [ ] Test: handle missing exchange rate (fallback)

### Date/Duration Utils
- [ ] Test: exact duration calculation
- [ ] Test: flexible duration (±Y days) range
- [ ] Test: segment date assignment from trip start
- [ ] Test: total allocated vs remaining days

---

## Integration Tests (write after implementation)

### Service Layer
- [ ] Mock cruise service returns valid CruiseLine[]
- [ ] Mock flight service returns valid Flight[]
- [ ] Mock accommodation service returns valid Accommodation[]
- [ ] Mock activity service returns valid Activity[]
- [ ] Weather service returns forecast for valid coordinates
- [ ] Exchange rate service returns valid rate

### API Routes
- [ ] GET /api/cruises returns JSON with correct shape
- [ ] GET /api/flights returns filtered results
- [ ] GET /api/accommodations returns filtered results
- [ ] GET /api/activities returns filtered results
- [ ] GET /api/weather returns forecast data
- [ ] GET /api/exchange-rate returns rate

---

## E2E Tests (Playwright)

- [ ] Create new trip with segments → verify calendar renders
- [ ] Browse cruises → select ship → verify price updates
- [ ] Compare 3 ships side-by-side
- [ ] Full trip flow: create → cruise → land → travel → packing
- [ ] Edit existing trip (change duration, reorder segments)
- [ ] Packing list: add items, check items, verify progress bar
- [ ] Mobile responsive: run same flows at 375px width
- [ ] Settings page: verify API usage display

---

## Progress Log
- [2026-03-14] Test plan created.
