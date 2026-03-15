'use client';

import { Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Segment } from '@/lib/types';

interface FlightCTAProps {
  fromSegment: Segment;
  toSegment: Segment;
}

export function FlightCTA({ fromSegment, toSegment }: FlightCTAProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-2 my-1 border-t border-b border-dashed border-border">
      <Plane className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">
        {fromSegment.location.city} → {toSegment.location.city}
      </span>
      <Button variant="outline" size="sm" className="text-xs h-7" disabled={false}>
        + Add Flight
      </Button>
    </div>
  );
}
