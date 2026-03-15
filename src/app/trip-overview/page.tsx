'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { useTripStore, useTripStoreHydrated } from '@/lib/stores/trip-store';
import { useWizardStore } from '@/lib/stores/wizard-store';
import { calculatePriceBreakdown } from '@/lib/utils/price-calculator';
import { PriceHeader } from '@/components/trip/price-header';
import { SegmentCard } from '@/components/trip/segment-card';
import { FlightCTA } from '@/components/trip/flight-cta';
import { Button } from '@/components/ui/button';

export default function TripOverviewPage() {
  const router = useRouter();
  const hydrated = useTripStoreHydrated();
  const activeTrip = useTripStore((s) => s.activeTrip);
  const events = useTripStore((s) => s.events);
  const loadFromTrip = useWizardStore((s) => s.loadFromTrip);

  useEffect(() => {
    // Only redirect after hydration — otherwise we'd redirect before the store loads
    if (hydrated && !activeTrip) {
      router.push('/');
    }
  }, [hydrated, activeTrip, router]);

  if (!hydrated || !activeTrip) {
    return null;
  }

  const breakdown = calculatePriceBreakdown(activeTrip, events);
  const segments = [...activeTrip.segments].sort((a, b) => a.order - b.order);

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
    </div>
  );
}
