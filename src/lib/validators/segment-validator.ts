export interface ValidationWarning {
  type: 'connectivity' | 'date-gap';
  segmentIndex: number;
  message: string;
}

export interface DayCounterEntry {
  segmentIndex: number;
  dayStart: number;
  dayEnd: number;
}

/**
 * Check if adjacent segments have different cities.
 * Returns warnings (not errors) for geographic gaps.
 */
export function validateSegmentConnectivity(
  segments: Array<{
    location: { city: string; stateOrCountry: string };
    endLocation?: { city: string; stateOrCountry: string };
  }>
): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  for (let i = 0; i < segments.length - 1; i++) {
    // Use endLocation (arrival port) if available, otherwise use location
    const currentCity = (segments[i].endLocation?.city || segments[i].location.city).trim().toLowerCase();
    const nextCity = segments[i + 1].location.city.trim().toLowerCase();

    if (currentCity && nextCity && currentCity !== nextCity) {
      warnings.push({
        type: 'connectivity',
        segmentIndex: i,
        message: `Geographic gap between ${segments[i].endLocation?.city || segments[i].location.city} and ${segments[i + 1].location.city} — You can add a connecting mode of transport later.`,
      });
    }
  }

  return warnings;
}

/**
 * Calculate running day counter for each segment.
 * First segment starts at Day 1. Each subsequent segment starts at previous end + 1.
 * A segment with durationDays=7 that starts on Day 1 ends on Day 7.
 */
export function calculateRunningDayCounter(
  segments: Array<{ durationDays: number }>
): DayCounterEntry[] {
  const entries: DayCounterEntry[] = [];
  let currentDay = 1;

  for (let i = 0; i < segments.length; i++) {
    const duration = segments[i].durationDays;
    entries.push({
      segmentIndex: i,
      dayStart: currentDay,
      dayEnd: currentDay + duration - 1,
    });
    currentDay += duration;
  }

  return entries;
}
