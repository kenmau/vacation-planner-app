Rewrite `/Users/ken/Projects/vacation-planner-app/wireframe.html` as a complete, self-contained HTML file incorporating ALL of these changes. Do not skip any. Write the full file using the Write tool.

## Context: Current file structure
The file is a single-page HTML wireframe (~1445 lines) with:
- CSS variables, layout styles, card/button components
- 13 views rendered as `<section class="view" id="view-{name}">` shown/hidden via JS
- Bottom nav (mobile) + sidebar (desktop)
- JS for navigation, tabs, packing list, calendar, segment builder, compare

## Required Changes

### 1. Back Button
- Already partially implemented in top-header. Verify it works on all non-root views.
- On DESKTOP: the sidebar is the nav, so add a visible back button INSIDE the main content area at the top-left of the page header (above the page title), not in the sidebar. Hide on dashboard.

### 2. Background Contrast
- Change `--bg` from `#f8fafc` to `#e8edf5` (soft blue-slate)
- Change `--surface` stays `#fff`
- Add `--surface-2: #f1f5f9` for nested card backgrounds
- Sidebar stays `--primary-dark` (#3730a3)
- Cards should have `box-shadow: 0 2px 8px rgba(0,0,0,.12)` (more elevated)
- Ensure all text meets WCAG AA (text on --bg must have ratio ≥4.5:1)

### 3. Cruise Detail — Specs Tabular + Tooltips
In view `cruise-detail`, tab panel `cd-overview`, replace the 2-col card grid of specs with a proper two-column table:
```
| Spec Name ⓘ  | Value      |
|--------------|------------|
| Gross Tonnage ⓘ | 130,818 GT |
| Passenger Capacity ⓘ | 2,918 |
| Crew ⓘ | 1,320 |
| Length ⓘ | 306 m |
| Decks ⓘ | 16 |
| Year Built | 2018 |
| Space Ratio ⓘ | 44.8 |
| Refurbished | 2022 |
```
- Each row with ⓘ shows a CSS tooltip on hover (not native title attr). Use a `<span class="tooltip-wrap">` with `<span class="tooltip-tip">` that appears on hover.
- Table styled: dense, no card padding, left col ~55% width, alternating row bg
- Group into sections with a small gray header row: "Ship Size", "Capacity", "Onboard"

Tooltip definitions:
- Gross Tonnage: "Total interior volume of the ship. Higher = larger ship. Not a weight measurement."
- Passenger Capacity: "Maximum number of guests at double occupancy."
- Crew: "Total crew members. Higher crew-to-guest ratio = better service."
- Length: "Ship length in metres. Longer ships tend to be more stable in open water."
- Decks: "Number of passenger decks."
- Space Ratio: "Gross tonnage ÷ passenger capacity. Higher = more space per person. 40+ is considered spacious."

### 4. Calendar Day Detail View
In view `trip-overview`, the calendar timeline:
- Each `.cal-day` cell should be clickable: `onclick="openDayDetail(day)"`
- When clicked, a drawer panel slides up from the bottom (or in from the right on desktop) overlaying the view
- The panel shows:
  - Header: "Jun 17 — Juneau, Alaska" with a close button (×)
  - A vertical timeline of events for that day, e.g.:
    - 7:00 AM — Arrive at port
    - 9:00 AM — Whale watching excursion
    - 12:00 PM — Lunch on board
    - 6:00 PM — Dinner at Normandie
  - Each event has: Edit (pencil) and Delete (trash) icon buttons
  - An "Add Event" button at the bottom of the timeline that shows an inline form: time input + description input + category select (Port, Dining, Excursion, Onboard, Transit) + Save/Cancel
  - Reorder note: "(Drag to reorder)" hint text under the timeline
- The drawer uses CSS: `position:fixed; bottom:0; left:0; right:0; max-height:80vh; overflow-y:auto; background:#fff; border-radius:20px 20px 0 0; z-index:200; transform:translateY(100%); transition:transform .35s ease`
- When open: `transform:translateY(0)`
- Also add a semi-transparent dark backdrop `div#dayBackdrop` behind the drawer, clicking it closes the drawer
- Pre-populate each day with 2-3 sample events based on the itinerary data already in the file

### 5. Map — Static Route Illustration
In view `trip-overview`, replace the simple `.map-placeholder` div with a proper SVG illustration showing:
- A stylized map background (light gray landmass silhouette, light blue ocean, no real geo)
- Route segments with different line styles per transport type:
  - ✈ Flight (Toronto→Anchorage): dashed orange arc
  - 🚢 Cruise (Whittier→Seward via ports): solid blue wavy line
  - 🚗 Drive (Seward→Denali): solid green line
  - ✈ Return flight: dashed orange arc
- Labeled dots at each location: Toronto, Anchorage, Whittier, Juneau, Skagway, Glacier Bay, Seward, Denali
- A legend in the corner: ✈ Flight | 🚢 Cruise | 🚗 Drive
- Size: 100% width, height 220px, viewBox="0 0 800 300"
- Keep it schematic/diagrammatic, not realistic. Think transit map style.

### 6. Overview — Segment Cards Improvements
In view `trip-overview` segment cards:
- Make start/end dates MUCH more prominent: display them in a larger, bolder style with a calendar icon prefix
- Location should show city AND country: e.g. "Whittier, Alaska, USA → Seward, Alaska, USA"
- Each segment card should have a colored left border AND a segment type pill/badge at the top
- For CRUISE segments: show ship name + cruise line if selected, or "No ship selected — tap to search" in muted text
- For LAND/ADVENTURE segments: show two additional rows:
  - 🏨 Accommodation: "Denali Princess Lodge" or "No accommodation — tap to add" (muted)
  - 🚗 Transportation: "SUV rental — $95/day" or "No transport — tap to add" (muted)
- Each of these rows is clickable and navigates to the relevant view

### 7. Remove Cruise/Land Tabs from Overview
Remove the `<div class="tabs" id="overviewTabs">` from the overview. Instead, navigation to cruise/land/travel happens by tapping the segment cards themselves (already handled in #6 above).

### 8. Trip Header Persists in Segment Context
When user taps a segment and is taken to cruise-browse, land-activities, accommodations, or cruise-detail — keep the trip price header and calendar at the top of those views too. Accomplish this by:
- Moving the price header and calendar timeline HTML into a reusable `<template id="tripHeaderTpl">` OR just duplicating it at the top of each of those views with a CSS class `trip-context-header`
- The calendar in those views should highlight (stronger border + scale) the dates belonging to that segment. Add a `data-highlight-seg` attribute on those views.
- Add a breadcrumb just below the header: "Alaska 2026 › Cruise Segment" or "Alaska 2026 › Land Segment"

### 9. Segment Selection: First-Time vs Edit Mode
In the segment cards in trip-overview:
- If segment is "empty" (no ship / no activities selected), tapping it shows a SEARCH mode within that view context:
  - For cruise segment: Show a search bar "Search cruise ships..." + filters (cruise line, price, duration) and the browse-card grid
  - For land segment: Show a search bar "Search land activities..." + the activity cards
  - The trip header + calendar still visible above
- If segment already has selections, tapping shows DETAIL mode (existing cruise-detail or activity detail)
- Implement this with a simple `data-segment-mode="search|detail"` toggle in JS

### 10. Remove Left Sidebar Nav
The left sidebar `<nav class="sidebar">` should be removed entirely. On desktop, the layout should be a single-column max-width:900px centered layout (no sidebar). The bottom nav stays for mobile. On desktop, add a small top bar with the trip title and a settings gear.

**Important**: The current sidebar uses desktop media query. Remove sidebar CSS and HTML. Update `@media(min-width:900px)` to just give `.main` more padding, not a sidebar layout.

---

## Preserve Everything Else
- All existing views (wizard, compare, accommodations, travel, packing, settings)
- Stateroom selection
- Compare float button logic  
- Packing list with progress
- Tab system in cruise-detail (Staterooms, Dining, Ports, Activities, Entertainment, Reviews)
- All segment types and colors
- Connectivity warning in wizard

## Code Style
- Single HTML file, all CSS in `<style>`, all JS in `<script>` at bottom
- No external dependencies (no CDN, no frameworks)
- Mobile-first responsive
- Smooth animations for day-detail drawer

Write the complete file to `/Users/ken/Projects/vacation-planner-app/wireframe.html`
