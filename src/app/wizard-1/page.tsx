'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWizardStore } from '@/lib/stores/wizard-store';
import { WizardStepIndicator } from '@/components/wizard/wizard-step-indicator';
import { TravellerList } from '@/components/wizard/traveller-list';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { addDays } from '@/lib/utils/date-utils';

export default function WizardStep1Page() {
  const router = useRouter();
  const store = useWizardStore();

  // Local form state seeded from wizard store
  const [tripName, setTripName] = useState(store.tripName);
  const [originCity, setOriginCity] = useState(store.originCity);
  const [startDate, setStartDate] = useState(store.startDate);
  const [endDate, setEndDate] = useState(store.endDate);
  const [isFlexible, setIsFlexible] = useState(store.isFlexible);
  const [durationDays, setDurationDays] = useState(() => {
    if (store.startDate && store.endDate && !store.isFlexible) {
      const diff = Math.round(
        (new Date(store.endDate).getTime() - new Date(store.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      return diff > 0 ? diff : 14;
    }
    return 14;
  });
  const [flexDays, setFlexDays] = useState(0);
  const [travellers, setTravellers] = useState<string[]>(
    store.travellers.length > 0 ? store.travellers : ['']
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Compute endDate when in flexible mode
  useEffect(() => {
    if (isFlexible && startDate && durationDays > 0) {
      setEndDate(addDays(startDate, durationDays));
    }
  }, [isFlexible, startDate, durationDays]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!tripName.trim()) {
      newErrors.tripName = 'Trip name is required';
    }
    if (!originCity.trim()) {
      newErrors.originCity = 'Origin city is required';
    }
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!isFlexible && !endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (isFlexible && durationDays <= 0) {
      newErrors.durationDays = 'Duration must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (!validate()) return;

    // Commit to wizard store
    store.setTripName(tripName.trim());
    store.setOriginCity(originCity.trim());
    store.setStartDate(startDate);
    store.setEndDate(isFlexible ? addDays(startDate, durationDays) : endDate);
    store.setIsFlexible(isFlexible);
    store.setTravellers(travellers.filter((t) => t.trim() !== ''));

    router.push('/wizard-2');
  }

  const dateInputClasses =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <WizardStepIndicator currentStep={1} />

      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Trip Basics</h2>
        <p className="text-sm text-muted-foreground">
          Name your trip, set the dates, and add travellers.
        </p>
      </div>

      <Separator />

      {/* Trip Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tripName">Trip Name *</Label>
        <Input
          id="tripName"
          placeholder="e.g., Alaska 2026"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        />
        {errors.tripName && (
          <p className="text-sm text-destructive">{errors.tripName}</p>
        )}
      </div>

      {/* Origin City */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="originCity">Origin City *</Label>
        <Input
          id="originCity"
          placeholder="e.g., Toronto, ON"
          value={originCity}
          onChange={(e) => setOriginCity(e.target.value)}
        />
        {errors.originCity && (
          <p className="text-sm text-destructive">{errors.originCity}</p>
        )}
      </div>

      {/* Start Date */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="startDate">Start Date *</Label>
        <input
          id="startDate"
          type="date"
          className={dateInputClasses}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        {errors.startDate && (
          <p className="text-sm text-destructive">{errors.startDate}</p>
        )}
      </div>

      {/* Duration Mode Toggle */}
      <div className="flex flex-col gap-3">
        <Label>Duration Mode</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={!isFlexible ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsFlexible(false)}
          >
            Exact Dates
          </Button>
          <Button
            type="button"
            variant={isFlexible ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsFlexible(true)}
          >
            Flexible
          </Button>
        </div>
      </div>

      {/* Exact mode: End Date */}
      {!isFlexible && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="endDate">End Date *</Label>
          <input
            id="endDate"
            type="date"
            className={dateInputClasses}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          {errors.endDate && (
            <p className="text-sm text-destructive">{errors.endDate}</p>
          )}
        </div>
      )}

      {/* Flexible mode: Duration + Flex Days */}
      {isFlexible && (
        <div className="flex gap-3">
          <div className="flex flex-col gap-1.5 flex-1">
            <Label htmlFor="durationDays">Duration (days)</Label>
            <Input
              id="durationDays"
              type="number"
              min={1}
              value={durationDays}
              onChange={(e) =>
                setDurationDays(Math.max(1, parseInt(e.target.value) || 1))
              }
            />
            {errors.durationDays && (
              <p className="text-sm text-destructive">{errors.durationDays}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <Label htmlFor="flexDays">Flex Days (+/-)</Label>
            <Input
              id="flexDays"
              type="number"
              min={0}
              value={flexDays}
              onChange={(e) =>
                setFlexDays(Math.max(0, parseInt(e.target.value) || 0))
              }
            />
          </div>
        </div>
      )}

      <Separator />

      {/* Travellers */}
      <TravellerList travellers={travellers} onChange={setTravellers} />

      <Separator />

      {/* Next Button */}
      <Button className="w-full md:w-auto" onClick={handleNext}>
        Next: Add Segments &rarr;
      </Button>
    </div>
  );
}
