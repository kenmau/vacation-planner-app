'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { useTripStore, useTripStoreHydrated } from '@/lib/stores/trip-store';
import { useWizardStore } from '@/lib/stores/wizard-store';
import { calculatePriceBreakdown } from '@/lib/utils/price-calculator';
import { daysBetween, getSegmentForDate } from '@/lib/utils/date-utils';
import { PriceHeader } from '@/components/trip/price-header';
import { SegmentCard } from '@/components/trip/segment-card';
import { FlightCTA } from '@/components/trip/flight-cta';
import { TimelineCalendar } from '@/components/shared/timeline-calendar';
import { DayDetailDrawer } from '@/components/calendar/day-detail-drawer';
import { Button } from '@/components/ui/button';

export default function TripOverviewPage() {
  const router = useRouter();
  const hydrated = useTripStoreHydrated();
  const activeTrip = useTripStore((s) => s.activeTrip);
  const events = useTripStore((s) => s.events);
  const loadFromTrip = useWizardStore((s) => s.loadFromTrip);

  const [drawerDate, setDrawerDate] = useState<string | null>(null);

  useEffect(() => {
    // Only redirect after hydration — otherwise we'd redirect before the store loads
    if (hydrated && !activeTrip) {
      router.push('/');
    }
  }, [hydrated, activeTrip, router]);

  const segments = useMemo(
    () => (activeTrip ? [...activeTrip.segments].sort((a, b) => a.order - b.order) : []),
    [activeTrip]
  );

  // Build timeline data from sorted segments
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

  // Resolve the segment for the selected drawer date
  const drawerSegment = useMemo(() => {
    if (!drawerDate || segments.length === 0) return null;
    const idx = getSegmentForDate(segments, drawerDate);
    return idx >= 0 ? segments[idx] : null;
  }, [drawerDate, segments]);

  if (!hydrated || !activeTrip) {
    return null;
  }

  const breakdown = calculatePriceBreakdown(activeTrip, events);

  if (segments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <MapPin className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">No segments yet</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Add segments to your trip to start planning your itinerary.
        </p>
        <Button
          onClick={() => {
            loadFromTrip(activeTrip);
            router.push('/wizard-2');
          }}
        >
          Add Segments
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <PriceHeader breakdown={breakdown} />

      {/* Calendar timeline */}
      <div className="px-4 pt-4">
        <TimelineCalendar
          startDate={activeTrip.startDate}
          totalDays={totalDays}
          segments={timelineSegments}
          onDayClick={(date) => setDrawerDate(date)}
          selectedDate={drawerDate ?? undefined}
        />
      </div>

      <div className="px-4 py-4 space-y-2">
        {segments.map((segment, index) => (
          <div key={segment.id}>
            <SegmentCard segment={segment} />
            {index < segments.length - 1 && (
              <FlightCTA
                fromSegment={segment}
                toSegment={segments[index + 1]}
              />
            )}
          </div>
        ))}

        {/* Edit Trip Segments button */}
        <div className="pt-4 pb-8">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              loadFromTrip(activeTrip);
              router.push('/wizard-2');
            }}
          >
            Edit Trip Segments
          </Button>
        </div>
      </div>

      {/* Day Detail Drawer */}
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
    </div>
  );
}
