'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useWizardStore } from '@/lib/stores/wizard-store';
import { useTripStore } from '@/lib/stores/trip-store';
import { WizardStepIndicator } from '@/components/wizard/wizard-step-indicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Info, MapPin, Calendar, Users } from 'lucide-react';
import { formatDateRange, calculateSegmentDates } from '@/lib/utils/date-utils';
import {
  getSegmentType,
  SEGMENT_COLOR_MAP,
} from '@/lib/utils/constants';
import {
  calculateRunningDayCounter,
  validateSegmentConnectivity,
} from '@/lib/validators/segment-validator';
import type { Trip, Segment } from '@/lib/types';

export default function WizardStep3Page() {
  const router = useRouter();
  const store = useWizardStore();
  const tripStore = useTripStore();

  const segments = store.segments;

  // Compute dates, day counters, and connectivity warnings
  const segmentDates = useMemo(
    () =>
      calculateSegmentDates(
        segments.map((s) => ({ durationDays: s.durationDays })),
        store.startDate
      ),
    [segments, store.startDate]
  );

  const dayCounters = useMemo(
    () => calculateRunningDayCounter(segments),
    [segments]
  );

  const connectivityWarnings = useMemo(
    () => validateSegmentConnectivity(segments),
    [segments]
  );

  const totalDays = useMemo(() => {
    if (dayCounters.length === 0) return 0;
    return dayCounters[dayCounters.length - 1].dayEnd;
  }, [dayCounters]);

  // Compute trip end date from segments
  const tripEndDate = useMemo(() => {
    if (segmentDates.length > 0) {
      return segmentDates[segmentDates.length - 1].endDate;
    }
    return store.endDate;
  }, [segmentDates, store.endDate]);

  // Filtered travellers (non-empty)
  const travellers = useMemo(
    () => store.travellers.filter((t) => t.trim() !== ''),
    [store.travellers]
  );

  function handleConfirm() {
    const tripId = crypto.randomUUID();

    // Build segments with computed dates
    const fullSegments: Segment[] = segments.map((seg, i) => ({
      id: crypto.randomUUID(),
      tripId,
      type: seg.type,
      title: seg.title,
      location: { ...seg.location },
      endLocation: seg.endLocation ? { ...seg.endLocation } : undefined,
      startDate: segmentDates[i].startDate,
      endDate: segmentDates[i].endDate,
      flexDays: seg.flexDays,
      transportIds: [],
      order: i,
    }));

    const trip: Trip = {
      id: tripId,
      name: store.tripName,
      originCity: store.originCity,
      startDate: store.startDate,
      endDate: tripEndDate,
      travellers,
      segments: fullSegments,
      connectingFlights: [],
      baseCurrency: 'CAD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tripStore.createTrip(trip);
    tripStore.setActiveTrip(trip);
    store.reset();
    router.push('/trip-overview');
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <WizardStepIndicator currentStep={3} />

      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Review Your Trip</h2>
        <p className="text-sm text-muted-foreground">
          Confirm everything looks good before creating your trip.
        </p>
      </div>

      <Separator />

      {/* Trip Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{store.tripName || 'Untitled Trip'}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="size-4 text-muted-foreground" />
            <span>From {store.originCity}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="size-4 text-muted-foreground" />
            <span>
              {store.startDate && tripEndDate
                ? formatDateRange(store.startDate, tripEndDate)
                : 'Dates not set'}
            </span>
            <Badge variant="secondary" className="text-xs">
              {totalDays} days
            </Badge>
          </div>

          {travellers.length > 0 && (
            <div className="flex items-start gap-2 text-sm">
              <Users className="size-4 text-muted-foreground mt-0.5" />
              <span>{travellers.join(', ')}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Segment Summary List */}
      <div className="space-y-2">
        <h3 className="text-base font-semibold">Segments</h3>

        <div className="flex flex-col gap-3">
          {segments.map((seg, index) => {
            const segType = getSegmentType(seg.type);
            const color = segType?.color ?? 'gray';
            const colorClasses = SEGMENT_COLOR_MAP[color] ?? '';
            const borderColor = colorClasses.match(/border-\w+-500/)?.[0] ?? 'border-gray-300';
            const dc = dayCounters[index];

            return (
              <Card key={index} className={`border-l-4 ${borderColor}`}>
                <CardContent className="py-3 flex flex-col gap-2">
                  {/* Type pill + day range */}
                  <div className="flex items-center justify-between">
                    <Badge className={colorClasses}>
                      {segType?.name ?? seg.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Day {dc?.dayStart}
                      {dc && dc.dayEnd > dc.dayStart
                        ? `\u2013${dc.dayEnd}`
                        : ''}
                    </span>
                  </div>

                  {/* Title */}
                  <p className="font-medium">{seg.title}</p>

                  {/* Location */}
                  {(seg.location.city || seg.location.stateOrCountry) && (() => {
                    const isCruise = seg.type === 'cruise' || seg.type === 'river-cruise';
                    return isCruise && seg.endLocation?.city ? (
                      <div className="flex flex-col gap-0.5 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="size-3.5" />
                          <span>Departure: {[seg.location.city, seg.location.stateOrCountry].filter(Boolean).join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="size-3.5" />
                          <span>Arrival: {[seg.endLocation.city, seg.endLocation.stateOrCountry].filter(Boolean).join(', ')}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="size-3.5" />
                        <span>
                          {[seg.location.city, seg.location.stateOrCountry]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Duration */}
                  <p className="text-sm text-muted-foreground">
                    {seg.durationDays} day{seg.durationDays !== 1 ? 's' : ''}
                    {seg.flexDays > 0 && (
                      <span className="ml-1">
                        (&plusmn;{seg.flexDays} flex)
                      </span>
                    )}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Connectivity Warnings */}
      {connectivityWarnings.length > 0 && (
        <div className="space-y-2">
          {connectivityWarnings.map((w, i) => (
            <div
              key={i}
              className="bg-blue-50 border border-blue-200 text-blue-700 rounded-md px-3 py-2 text-sm flex items-center gap-2"
            >
              <Info className="size-4 shrink-0" />
              <span>{w.message}</span>
            </div>
          ))}
        </div>
      )}

      <Separator />

      {/* Footer navigation */}
      <div className="flex flex-col md:flex-row gap-3 md:justify-between">
        <Button variant="outline" onClick={() => router.push('/wizard-2')}>
          &larr; Back
        </Button>
        <Button className="w-full md:w-auto" onClick={handleConfirm}>
          Confirm &amp; Create Trip
        </Button>
      </div>
    </div>
  );
}
