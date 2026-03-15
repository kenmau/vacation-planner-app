'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useWizardStore } from '@/lib/stores/wizard-store';
import { useTripStore } from '@/lib/stores/trip-store';
import { WizardStepIndicator } from '@/components/wizard/wizard-step-indicator';
import { SegmentEditCard } from '@/components/wizard/segment-edit-card';
import { ConnectivityInfo } from '@/components/wizard/connectivity-warning';
import { TimelineCalendar } from '@/components/shared/timeline-calendar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { getSegmentType } from '@/lib/utils/constants';
import { calculateRunningDayCounter, validateSegmentConnectivity } from '@/lib/validators/segment-validator';
import { calculateSegmentDates, daysBetween } from '@/lib/utils/date-utils';
import type { Segment } from '@/lib/types';

export default function WizardStep2Page() {
  const router = useRouter();
  const store = useWizardStore();
  const tripStore = useTripStore();

  const segments = store.segments;

  // Auto-add a default segment if empty on mount
  useEffect(() => {
    if (segments.length === 0) {
      store.addSegment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate day counters and connectivity warnings
  const dayCounters = useMemo(
    () => calculateRunningDayCounter(segments),
    [segments]
  );

  const connectivityWarnings = useMemo(
    () => validateSegmentConnectivity(segments),
    [segments]
  );

  // Build a set of segment indices that have a connectivity warning after them
  const warningAfterIndex = useMemo(() => {
    const set = new Set<number>();
    for (const w of connectivityWarnings) {
      set.add(w.segmentIndex);
    }
    return set;
  }, [connectivityWarnings]);

  function handleTypeChange(index: number, typeId: string) {
    const seg = segments[index];
    const oldType = getSegmentType(seg.type);
    const newType = getSegmentType(typeId);
    // Only auto-fill title if user hasn't customized it
    const isDefaultTitle =
      seg.title === 'New Segment' ||
      seg.title === '' ||
      seg.title === oldType?.name;

    const isCruiseType = typeId === 'cruise' || typeId === 'river-cruise';
    const wasCruiseType = seg.type === 'cruise' || seg.type === 'river-cruise';

    const updates: Partial<typeof seg> = {
      type: typeId,
      ...(isDefaultTitle ? { title: newType?.name ?? 'New Segment' } : {}),
    };

    if (isCruiseType && !wasCruiseType) {
      updates.endLocation = { city: '', stateOrCountry: '' };
    } else if (!isCruiseType && wasCruiseType) {
      updates.endLocation = undefined;
    }

    store.updateSegment(index, updates);
  }

  function getValidationErrors(): string[] {
    const errors: string[] = [];
    if (segments.length === 0) {
      errors.push('Add at least one segment');
    }
    const emptyCities = segments
      .map((seg, i) => {
        const isCruise = seg.type === 'cruise' || seg.type === 'river-cruise';
        if (seg.location.city.trim() === '') return i + 1;
        if (isCruise && seg.endLocation && seg.endLocation.city.trim() === '') return i + 1;
        return null;
      })
      .filter((v): v is number => v !== null);
    if (emptyCities.length > 0) {
      errors.push(
        `Enter a city/port for segment${emptyCities.length > 1 ? 's' : ''} ${emptyCities.join(', ')}`
      );
    }
    return errors;
  }

  const validationErrors = getValidationErrors();
  const isValid = validationErrors.length === 0;

  function handleNext() {
    if (!isValid) return;
    router.push('/wizard-3');
  }

  function handleSaveChanges() {
    if (!isValid) return;
    if (!store.existingTripId) return;

    // Compute segment dates
    const dated = calculateSegmentDates(
      segments.map((s) => ({ durationDays: s.durationDays })),
      store.startDate
    );

    // Build full Segment objects
    const fullSegments: Segment[] = segments.map((seg, i) => ({
      id: crypto.randomUUID(),
      tripId: store.existingTripId!,
      type: seg.type,
      title: seg.title,
      location: { ...seg.location },
      endLocation: seg.endLocation ? { ...seg.endLocation } : undefined,
      startDate: dated[i].startDate,
      endDate: dated[i].endDate,
      flexDays: seg.flexDays,
      transportIds: [],
      order: i,
    }));

    // Compute trip endDate from last segment
    const tripEndDate =
      fullSegments.length > 0
        ? fullSegments[fullSegments.length - 1].endDate
        : store.endDate;

    tripStore.updateTrip(store.existingTripId, {
      name: store.tripName,
      originCity: store.originCity,
      startDate: store.startDate,
      endDate: tripEndDate,
      travellers: store.travellers,
      segments: fullSegments,
    });

    // Also update active trip
    const updatedTrip = tripStore.trips.find(
      (t) => t.id === store.existingTripId
    );
    if (updatedTrip) {
      tripStore.setActiveTrip(updatedTrip);
    }

    store.reset();
    router.push('/trip-overview');
  }

  // Calculate total trip days for the timeline calendar
  const totalTripDays = useMemo(() => {
    if (store.startDate && store.endDate) {
      return daysBetween(store.startDate, store.endDate);
    }
    return segments.reduce((sum, s) => sum + s.durationDays, 0);
  }, [store.startDate, store.endDate, segments]);

  // Build timeline segments from draft segments
  const timelineSegments = useMemo(
    () =>
      segments.map((seg) => ({
        type: seg.type,
        title: seg.title,
        durationDays: seg.durationDays,
      })),
    [segments]
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <WizardStepIndicator currentStep={2} />

      {/* Timeline calendar — sticky below top bar */}
      {store.startDate && timelineSegments.length > 0 && (
        <div className="sticky top-14 z-20 bg-background py-2 -mx-4 px-4">
          <TimelineCalendar
            startDate={store.startDate}
            totalDays={totalTripDays}
            segments={timelineSegments}
          />
        </div>
      )}

      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Build Your Segments</h2>
        <p className="text-sm text-muted-foreground">
          Add the places you want to visit. Reorder and adjust durations as
          needed.
        </p>
      </div>

      <Separator />

      {/* Segment list */}
      <div className="flex flex-col gap-4">
        {segments.map((seg, index) => {
          const dc = dayCounters[index];
          return (
            <div key={index} className="flex flex-col gap-3">
              <SegmentEditCard
                segment={seg}
                index={index}
                dayStart={dc?.dayStart ?? 1}
                dayEnd={dc?.dayEnd ?? 1}
                totalSegments={segments.length}
                onUpdate={(updates) => {
                  // Intercept type changes to auto-set title
                  if (updates.type && updates.type !== seg.type) {
                    handleTypeChange(index, updates.type);
                  } else {
                    store.updateSegment(index, updates);
                  }
                }}
                onRemove={() => store.removeSegment(index)}
                onMoveUp={() => store.moveSegmentUp(index)}
                onMoveDown={() => store.moveSegmentDown(index)}
              />

              {/* Connectivity warning between this segment and the next */}
              {warningAfterIndex.has(index) && index < segments.length - 1 && (
                <ConnectivityInfo
                  fromCity={seg.endLocation?.city || seg.location.city}
                  toCity={segments[index + 1].location.city}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Add Segment button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => store.addSegment()}
      >
        <Plus className="size-4 mr-2" />
        Add Segment
      </Button>

      <Separator />

      {/* Validation feedback */}
      {!isValid && validationErrors.length > 0 && (
        <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          {validationErrors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}

      {/* Footer navigation */}
      <div className="flex flex-col md:flex-row gap-3 md:justify-between">
        <Button
          variant="outline"
          onClick={() => router.push('/wizard-1')}
        >
          &larr; Back
        </Button>

        {store.isEditing ? (
          <div className="relative group">
            <Button
              onClick={handleSaveChanges}
              disabled={!isValid}
            >
              Save Changes
            </Button>
            {!isValid && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-popover border border-border rounded-md px-3 py-2 text-xs text-muted-foreground shadow-md whitespace-nowrap z-50">
                {validationErrors.join(' · ')}
              </div>
            )}
          </div>
        ) : (
          <div className="relative group w-full md:w-auto">
            <Button
              className="w-full md:w-auto"
              onClick={handleNext}
              disabled={!isValid}
            >
              Next: Review &rarr;
            </Button>
            {!isValid && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-popover border border-border rounded-md px-3 py-2 text-xs text-muted-foreground shadow-md whitespace-nowrap z-50">
                {validationErrors.join(' · ')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
