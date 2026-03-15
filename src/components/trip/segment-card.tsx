'use client';

import { Calendar, MapPin, Ship, Building, CarFront } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EventsToggle } from '@/components/trip/events-toggle';
import { getSegmentType, SEGMENT_COLOR_MAP } from '@/lib/utils/constants';
import { formatDateRange } from '@/lib/utils/date-utils';
import type { Segment } from '@/lib/types';

interface SegmentCardProps {
  segment: Segment;
}

export function SegmentCard({ segment }: SegmentCardProps) {
  const segType = getSegmentType(segment.type);
  const colorKey = segType?.color ?? 'green';
  const colorClasses = SEGMENT_COLOR_MAP[colorKey] ?? SEGMENT_COLOR_MAP['green'];

  // Extract border color class for the left border
  const borderColor = colorClasses.split(' ').find((c) => c.startsWith('border-')) ?? 'border-green-500';

  const isCruise = segment.type === 'cruise' || segment.type === 'river-cruise';

  return (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardContent className="space-y-3">
        {/* Top row: type pill + dates */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Badge className={colorClasses}>
            {segType?.name ?? segment.type}
          </Badge>
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            {formatDateRange(segment.startDate, segment.endDate)}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {isCruise && segment.endLocation?.city
            ? `${segment.location.city} \u2192 ${segment.endLocation.city}`
            : `${segment.location.city}, ${segment.location.stateOrCountry}`}
        </div>

        {/* Conditional rows */}
        {isCruise ? (
          <div className="flex items-center gap-1.5 text-sm">
            <Ship className="h-3.5 w-3.5 text-muted-foreground" />
            {segment.cruiseShipId ? (
              <span>Ship: {segment.cruiseShipId}</span>
            ) : (
              <span className="text-muted-foreground italic">
                No ship selected &mdash; tap to search
              </span>
            )}
          </div>
        ) : (
          <>
            {/* Accommodation row */}
            <div className="flex items-center gap-1.5 text-sm">
              <Building className="h-3.5 w-3.5 text-muted-foreground" />
              {segment.accommodationId ? (
                <span>Accommodation: {segment.accommodationId}</span>
              ) : (
                <span className="text-muted-foreground italic">
                  No accommodation &mdash; tap to browse
                </span>
              )}
            </div>

            {/* Transport row */}
            <div className="flex items-center gap-1.5 text-sm">
              <CarFront className="h-3.5 w-3.5 text-muted-foreground" />
              {segment.transportIds.length > 0 ? (
                <span>Transport: {segment.transportIds.join(', ')}</span>
              ) : (
                <span className="text-muted-foreground italic">
                  No transport &mdash; tap to browse
                </span>
              )}
            </div>
          </>
        )}

        {/* Events toggle */}
        <EventsToggle segmentId={segment.id} />
      </CardContent>
    </Card>
  );
}
