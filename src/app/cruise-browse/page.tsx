'use client';

import { useState, useMemo } from 'react';
import { useTripStore, useTripStoreHydrated } from '@/lib/stores/trip-store';
import { daysBetween, getSegmentForDate } from '@/lib/utils/date-utils';
import { TimelineCalendar } from '@/components/shared/timeline-calendar';
import { DayDetailDrawer } from '@/components/calendar/day-detail-drawer';

export default function CruiseBrowsePage() {
  const hydrated = useTripStoreHydrated();
  const activeTrip = useTripStore((s) => s.activeTrip);
  const [drawerDate, setDrawerDate] = useState<string | null>(null);

  const segments = useMemo(
    () => (activeTrip ? [...activeTrip.segments].sort((a, b) => a.order - b.order) : []),
    [activeTrip]
  );

  const timelineSegments = useMemo(
    () =>
      segments.map((s) => ({
        type: s.type,
        title: s.title,
        durationDays: daysBetween(s.startDate, s.endDate),
        location: `${s.location.city}, ${s.location.stateOrCountry}`,
      })),
    [segments]
  );

  const totalDays = useMemo(
    () => (activeTrip ? daysBetween(activeTrip.startDate, activeTrip.endDate) : 0),
    [activeTrip]
  );

  const drawerSegment = useMemo(() => {
    if (!drawerDate || segments.length === 0) return null;
    const idx = getSegmentForDate(segments, drawerDate);
    return idx >= 0 ? segments[idx] : null;
  }, [drawerDate, segments]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Browse Cruises</h2>
      <p className="text-muted-foreground">
        Browse and compare cruise ships across multiple cruise lines.
      </p>

      {/* Calendar timeline with cruise segments highlighted */}
      {hydrated && activeTrip && segments.length > 0 && (
        <>
          <TimelineCalendar
            startDate={activeTrip.startDate}
            totalDays={totalDays}
            segments={timelineSegments}
            onDayClick={(date) => setDrawerDate(date)}
            selectedDate={drawerDate ?? undefined}
            highlightSegmentTypes={['cruise', 'river-cruise']}
          />

          <DayDetailDrawer
            open={drawerDate !== null}
            onOpenChange={(open) => {
              if (!open) setDrawerDate(null);
            }}
            date={drawerDate ?? ''}
            segmentTitle={
              drawerSegment
                ? `${drawerSegment.location.city}, ${drawerSegment.location.stateOrCountry}`
                : ''
            }
            segmentId={drawerSegment?.id ?? ''}
          />
        </>
      )}
    </div>
  );
}
