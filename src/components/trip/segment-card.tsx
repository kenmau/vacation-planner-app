'use client';

import { Calendar, MapPin, Ship, Building, CarFront } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EventsToggle } from '@/components/trip/events-toggle';
import { getSegmentType, SEGMENT_BORDER_MAP, SEGMENT_BADGE_MAP } from '@/lib/utils/constants';
import { formatDateRange } from '@/lib/utils/date-utils';
import type { Segment } from '@/lib/types';

interface SegmentCardProps {
  segment: Segment;
}

export function SegmentCard({ segment }: SegmentCardProps) {
  const segType = getSegmentType(segment.type);
  const colorKey = segType?.color ?? 'green';
  const borderClass = SEGMENT_BORDER_MAP[colorKey] ?? SEGMENT_BORDER_MAP['green'];
  const badgeClass = SEGMENT_BADGE_MAP[colorKey] ?? SEGMENT_BADGE_MAP['green'];

  const isCruise = segment.type === 'cruise' || segment.type === 'river-cruise';

  return (
    <Card className={`border-l-4 ${borderClass}`}>
      <CardContent className="space-y-3">
        {/* Top row: type pill + dates */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Badge className={badgeClass}>
            {segType?.name ?? segment.type}
          </Badge>
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            {formatDateRange(segment.startDate, segment.endDate)}
          </div>
        </div>

        {/* Segment title */}
        {segment.title && (
          <h3 className="text-base font-semibold leading-tight">{segment.title}</h3>
        )}

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {isCruise && segment.endLocation?.city
            ? `${segment.location.city} \u2192 ${segment.endLocation.city}`
            : segment.location.stateOrCountry
              ? `${segment.location.city}, ${segment.location.stateOrCountry}`
              : segment.location.city}
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
