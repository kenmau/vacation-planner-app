/**
 * Date calculation helpers for the trip wizard and overview.
 * Uses plain Date math — no external libraries.
 * All date strings are ISO format (YYYY-MM-DD).
 */

/** Parse an ISO date string (YYYY-MM-DD) into a Date at midnight UTC */
function parseISO(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

/** Format a Date back to ISO date string (YYYY-MM-DD) */
function toISO(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Add days to an ISO date string, return ISO date string */
export function addDays(date: string, days: number): string {
  const d = parseISO(date);
  d.setUTCDate(d.getUTCDate() + days);
  return toISO(d);
}

/** Count days between two ISO date strings (inclusive of start, exclusive of end) */
export function daysBetween(start: string, end: string): number {
  const startMs = parseISO(start).getTime();
  const endMs = parseISO(end).getTime();
  return Math.round((endMs - startMs) / (1000 * 60 * 60 * 24));
}

/** Format a single date like "Jun 14, 2026" */
export function formatDate(date: string): string {
  const d = parseISO(date);
  const month = MONTH_SHORT[d.getUTCMonth()];
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}

/** Format a single date short like "Jun 14" (no year) */
export function formatDateShort(date: string): string {
  const d = parseISO(date);
  const month = MONTH_SHORT[d.getUTCMonth()];
  const day = d.getUTCDate();
  return `${month} ${day}`;
}

/** Format a date range like "Jun 14 - Jun 21, 2026" */
export function formatDateRange(start: string, end: string): string {
  const s = parseISO(start);
  const e = parseISO(end);

  const sMonth = MONTH_SHORT[s.getUTCMonth()];
  const sDay = s.getUTCDate();
  const eMonth = MONTH_SHORT[e.getUTCMonth()];
  const eDay = e.getUTCDate();
  const eYear = e.getUTCFullYear();

  return `${sMonth} ${sDay} - ${eMonth} ${eDay}, ${eYear}`;
}

/**
 * Given an array of segments with durations (in days) and a trip start date,
 * cascade dates so each segment starts on the previous segment's end date.
 * Returns a new array with startDate and endDate filled in.
 */
export function calculateSegmentDates(
  segments: Array<{ durationDays: number; [key: string]: unknown }>,
  tripStartDate: string
): Array<{ startDate: string; endDate: string; durationDays: number }> {
  let currentDate = tripStartDate;

  return segments.map((segment) => {
    const startDate = currentDate;
    const endDate = addDays(startDate, segment.durationDays);
    currentDate = endDate;
    return { startDate, endDate, durationDays: segment.durationDays };
  });
}
