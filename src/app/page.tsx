'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useTripStore, useTripStoreHydrated } from '@/lib/stores/trip-store';
import { useWizardStore } from '@/lib/stores/wizard-store';
import { TripCard } from '@/components/trip/trip-card';
import type { Trip } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const hydrated = useTripStoreHydrated();
  const trips = useTripStore((s) => s.trips);
  const setActiveTrip = useTripStore((s) => s.setActiveTrip);
  const resetWizard = useWizardStore((s) => s.reset);

  function handleNewTrip() {
    resetWizard();
  }

  function handleSelectTrip(trip: Trip) {
    setActiveTrip(trip);
    router.push('/trip-overview');
  }

  return (
    <div className="space-y-6">
      {/* Header — always visible */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Trips</h2>
        <Link href="/wizard-1" onClick={handleNewTrip}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Trip
          </Button>
        </Link>
      </div>

      {/* Trip list or empty state — wait for store hydration */}
      {!hydrated ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Loading trips...
        </div>
      ) : trips.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">
              No trips yet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create your first trip to get started planning your vacation.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onSelect={handleSelectTrip}
            />
          ))}
        </div>
      )}
    </div>
  );
}
