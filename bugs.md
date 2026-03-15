# Bugs

## Phase 2

- [x] ~~In wizard-2, the coloured dots in the segment type dropdown are misaligned with the text. The dot should be vertically centered.~~ **Fixed** — wrapped dot + text in `flex items-center` container in `segment-type-picker.tsx`.
- [x] ~~In wizard-2, the duration field does not allow backspace to delete the default "1" value.~~ **Fixed** — allow clearing to empty (stores 0), enforce min=1 on blur in `segment-edit-card.tsx`.
- [x] ~~In trip-overview, segment cards are missing the heading name set by the user in the wizard.~~ **Fixed** — added `<h3>` rendering of `segment.title` in `segment-card.tsx`.
- [x] ~~In trip-overview segment cards, a trailing comma appears after the city name when no country is listed.~~ **Fixed** — conditionally render comma only when `stateOrCountry` is non-empty in `segment-card.tsx`.
