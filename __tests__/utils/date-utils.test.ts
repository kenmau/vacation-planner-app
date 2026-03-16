import { describe, it, expect } from 'vitest';
import {
  getSegmentForDate,
  addDays,
  daysBetween,
  formatDateShort,
} from '@/lib/utils/date-utils';

describe('getSegmentForDate', () => {
  const segments = [
    { startDate: '2026-06-14', endDate: '2026-06-17' }, // 3 days
    { startDate: '2026-06-17', endDate: '2026-06-21' }, // 4 days
    { startDate: '2026-06-21', endDate: '2026-06-24' }, // 3 days
  ];

  it('should return 0 for a date in the first segment', () => {
    expect(getSegmentForDate(segments, '2026-06-14')).toBe(0);
    expect(getSegmentForDate(segments, '2026-06-16')).toBe(0);
  });

  it('should return 1 for a date in the second segment', () => {
    expect(getSegmentForDate(segments, '2026-06-17')).toBe(1);
    expect(getSegmentForDate(segments, '2026-06-20')).toBe(1);
  });

  it('should return 2 for a date in the third segment', () => {
    expect(getSegmentForDate(segments, '2026-06-21')).toBe(2);
    expect(getSegmentForDate(segments, '2026-06-23')).toBe(2);
  });

  it('should return -1 for a date before all segments', () => {
    expect(getSegmentForDate(segments, '2026-06-13')).toBe(-1);
  });

  it('should return -1 for a date after all segments (endDate is exclusive)', () => {
    expect(getSegmentForDate(segments, '2026-06-24')).toBe(-1);
  });

  it('should return -1 for an empty segments array', () => {
    expect(getSegmentForDate([], '2026-06-14')).toBe(-1);
  });

  it('should handle the boundary between two adjacent segments correctly', () => {
    // 2026-06-17 is the endDate of segment 0 (exclusive) and startDate of segment 1 (inclusive)
    expect(getSegmentForDate(segments, '2026-06-17')).toBe(1);
  });
});

describe('addDays', () => {
  it('should add days to a date', () => {
    expect(addDays('2026-06-14', 3)).toBe('2026-06-17');
  });

  it('should handle month boundaries', () => {
    expect(addDays('2026-06-29', 3)).toBe('2026-07-02');
  });
});

describe('daysBetween', () => {
  it('should count days between two dates', () => {
    expect(daysBetween('2026-06-14', '2026-06-17')).toBe(3);
  });

  it('should return 0 for same date', () => {
    expect(daysBetween('2026-06-14', '2026-06-14')).toBe(0);
  });
});

describe('formatDateShort', () => {
  it('should format a date as "Jun 14"', () => {
    expect(formatDateShort('2026-06-14')).toBe('Jun 14');
  });
});
