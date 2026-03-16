'use client';

import { useState, useMemo } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { useTripStore } from '@/lib/stores/trip-store';
import { formatDateShort } from '@/lib/utils/date-utils';
import { EVENT_CATEGORIES } from '@/lib/utils/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PriceDisplay } from '@/components/shared/price-display';
import { EventForm } from '@/components/calendar/event-form';
import type { DayEvent } from '@/lib/types/event';

interface EventsToggleProps {
  segmentId: string;
}

/** Compute end time (HH:mm) from start time + duration in minutes */
function computeEndTime(startTime: string, durationMinutes: number): string {
  const [h, m] = startTime.split(':').map(Number);
  const totalMinutes = h * 60 + m + durationMinutes;
  const endH = Math.floor(totalMinutes / 60) % 24;
  const endM = totalMinutes % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

/** Format duration in minutes to human-readable (e.g. "2h 30m") */
function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function EventsToggle({ segmentId }: EventsToggleProps) {
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<DayEvent | undefined>();

  const allEvents = useTripStore((s) => s.events);
  const removeEvent = useTripStore((s) => s.removeEvent);

  const events = useMemo(
    () => allEvents.filter((e) => e.segmentId === segmentId),
    [allEvents, segmentId]
  );

  const sorted = useMemo(
    () =>
      [...events].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      }),
    [events]
  );

  function handleEdit(event: DayEvent) {
    setEditingEvent(event);
    setShowForm(true);
  }

  function handleDelete(eventId: string) {
    removeEvent(eventId);
  }

  function handleFormSave() {
    setShowForm(false);
    setEditingEvent(undefined);
  }

  function handleFormCancel() {
    setShowForm(false);
    setEditingEvent(undefined);
  }

  // Track the last seen date to show date headers when the date changes
  let lastDate = '';

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
          {sorted.map((event) => {
            const showDateHeader = event.date !== lastDate;
            lastDate = event.date;
            const endTime = computeEndTime(event.time, event.duration);
            const catLabel = EVENT_CATEGORIES.find((c) => c.id === event.category)?.name ?? event.category;

            return (
              <div key={event.id}>
                {showDateHeader && (
                  <div className="text-[10px] font-semibold text-muted-foreground mt-2 first:mt-0">
                    {formatDateShort(event.date)}
                  </div>
                )}
                <div
                  className="flex items-center gap-2 text-xs rounded-md px-1 -mx-1 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleEdit(event)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleEdit(event); }}
                  aria-label={`Edit ${event.description}`}
                >
                  <span className="font-mono text-muted-foreground shrink-0">
                    {event.time}-{endTime}
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    ({formatDuration(event.duration)})
                  </span>
                  <span className="flex-1 truncate">{event.description}</span>
                  <Badge variant="secondary" className="text-[10px] shrink-0">
                    {catLabel}
                  </Badge>
                  {event.cost.amount > 0 && (
                    <PriceDisplay
                      price={event.cost}
                      className="text-xs font-medium shrink-0"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-5 w-5 shrink-0"
                    onClick={(e) => { e.stopPropagation(); handleDelete(event.id); }}
                    aria-label={`Delete ${event.description}`}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </div>
            );
          })}

          {/* Inline event form */}
          {showForm && (
            <EventForm
              segmentId={segmentId}
              date={editingEvent?.date ?? sorted[sorted.length - 1]?.date ?? ''}
              existingEvent={editingEvent}
              showDateField
              onSave={handleFormSave}
              onCancel={handleFormCancel}
            />
          )}

          {/* Add event button */}
          {!showForm && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-1"
              onClick={() => {
                setEditingEvent(undefined);
                setShowForm(true);
              }}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Event
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
