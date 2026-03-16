# Bugs & Enhancements

## Phase 2

- [x] ~~In wizard-2, the coloured dots in the segment type dropdown are misaligned with the text. The dot should be vertically centered.~~ **Fixed** — wrapped dot + text in `flex items-center` container in `segment-type-picker.tsx`.
- [x] ~~In wizard-2, the duration field does not allow backspace to delete the default "1" value.~~ **Fixed** — allow clearing to empty (stores 0), enforce min=1 on blur in `segment-edit-card.tsx`.
- [x] ~~In trip-overview, segment cards are missing the heading name set by the user in the wizard.~~ **Fixed** — added `<h3>` rendering of `segment.title` in `segment-card.tsx`.
- [x] ~~In trip-overview segment cards, a trailing comma appears after the city name when no country is listed.~~ **Fixed** — conditionally render comma only when `stateOrCountry` is non-empty in `segment-card.tsx`.

## Phase 3

### Enhancements

- [x] ~~In the trip-overview, add the date beside each event in the event list~~ **Done** — date headers shown when date changes between events in `events-toggle.tsx`.
- [x] ~~Add an ability to create a new event directly from the trip overview page~~ **Done** — "+ Add Event" button in the events toggle opens inline `EventForm`.
- [x] ~~Add an ability to edit an event directly from the trip overview page~~ **Done** — pencil icon on each event row opens `EventForm` in edit mode.
- [x] ~~Add an ability to delete an event directly from the trip overview page~~ **Done** — trash icon on each event row calls `removeEvent`.
- [x] ~~In the trip overview, for each event, add the end-time beside the start time, and show the duration of the event in parentheses (e.g., "2h 30m")~~ **Done** — shows "09:00-11:00 (2h)" format in `events-toggle.tsx`.
- [x] ~~Adding an event should prompt the user to select a date, and the event should then be added to the correct date section in the events list.~~ **Done** — date picker added to `EventForm` via `showDateField` prop; events sort into correct date section automatically.
- [x] ~~When editing an event, the form should be pre-populated with the existing event details, and the user should be able to change the date of the event. If the date is changed, the event should be moved to the correct date section in the events list.~~ **Done** — edit mode includes date field, `updateEvent` now updates the date, and the sorted list re-groups automatically.
- [x] ~~Allow clicking the event within the segment to open the edit form for that event (currently, you can only click the pencil icon to open the edit form).~~ **Done** — entire event row is now clickable (with hover state), pencil icon removed in favor of row click. Delete button still has `stopPropagation`.