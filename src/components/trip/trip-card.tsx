'use client';

import type { Trip } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateRange } from '@/lib/utils/date-utils';
import { getSegmentType, SEGMENT_BADGE_MAP } from '@/lib/utils/constants';

interface TripCardProps {
  trip: Trip;
  onSelect: (trip: Trip) => void;
}

export function TripCard({ trip, onSelect }: TripCardProps) {
  // Collect unique segment types
  const uniqueSegmentTypes = Array.from(
    new Set(trip.segments.map((s) => s.type))
  );

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => onSelect(trip)}
    >
      <CardContent className="p-4 space-y-2">
        {/* Trip name */}
        <h3 className="text-lg font-bold truncate">{trip.name}</h3>

        {/* Date range */}
        <p className="text-sm text-muted-foreground">
          {formatDateRange(trip.startDate, trip.endDate)}
        </p>

        {/* Origin city */}
        <p className="text-sm text-muted-foreground">
          From {trip.originCity}
        </p>

        {/* Segments + travellers count */}
        <p className="text-sm text-muted-foreground">
          {trip.segments.length} segment{trip.segments.length !== 1 ? 's' : ''} &middot;{' '}
          {trip.travellers.length} traveller{trip.travellers.length !== 1 ? 's' : ''}
        </p>

        {/* Segment type pills */}
        {uniqueSegmentTypes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {uniqueSegmentTypes.map((typeId) => {
              const segType = getSegmentType(typeId);
              const badgeClass = segType
                ? SEGMENT_BADGE_MAP[segType.color] ?? ''
                : '';
              return (
                <Badge
                  key={typeId}
                  variant="outline"
                  className={badgeClass}
                >
                  {segType?.name ?? typeId}
                </Badge>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
