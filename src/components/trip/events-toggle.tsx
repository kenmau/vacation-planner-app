'use client';

import { useState, useMemo } from 'react';
import { useTripStore } from '@/lib/stores/trip-store';
import { Badge } from '@/components/ui/badge';
import { PriceDisplay } from '@/components/shared/price-display';

interface EventsToggleProps {
  segmentId: string;
}

export function EventsToggle({ segmentId }: EventsToggleProps) {
  const [expanded, setExpanded] = useState(false);

  const allEvents = useTripStore((s) => s.events);
  const events = useMemo(
    () => allEvents.filter((e) => e.segmentId === segmentId),
    [allEvents, segmentId]
  );

  if (events.length === 0) return null;

  const sorted = [...events].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="pt-2 border-t border-border">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? '\u25BE' : '\u25B8'} {expanded ? 'Hide' : 'View'}{' '}
        {events.length} event{events.length !== 1 ? 's' : ''}
      </button>

      {expanded && (
        <div className="mt-2 space-y-1.5">
          {sorted.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-2 text-xs"
            >
              <span className="font-mono text-muted-foreground w-12 shrink-0">
                {event.time}
              </span>
              <span className="flex-1 truncate">{event.description}</span>
              <Badge variant="secondary" className="text-[10px] shrink-0">
                {event.category}
              </Badge>
              {event.cost.amount > 0 && (
                <PriceDisplay
                  price={event.cost}
                  className="text-xs font-medium shrink-0"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
