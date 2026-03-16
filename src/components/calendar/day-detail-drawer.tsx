'use client';

import { useState, useMemo } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useTripStore } from '@/lib/stores/trip-store';
import { formatDateShort } from '@/lib/utils/date-utils';
import { EVENT_CATEGORIES } from '@/lib/utils/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PriceDisplay } from '@/components/shared/price-display';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { EventForm } from './event-form';
import type { DayEvent } from '@/lib/types/event';

interface DayDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  segmentTitle: string;
  segmentId: string;
}

const CATEGORY_BADGE_COLOR: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
  green: 'bg-green-100 text-green-700',
  purple: 'bg-purple-100 text-purple-700',
  gray: 'bg-gray-100 text-gray-700',
  slate: 'bg-slate-100 text-slate-700',
};

export function DayDetailDrawer({
  open,
  onOpenChange,
  date,
  segmentTitle,
  segmentId,
}: DayDetailDrawerProps) {
  const allEvents = useTripStore((s) => s.events);
  const removeEvent = useTripStore((s) => s.removeEvent);

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<DayEvent | undefined>();

  const dayEvents = useMemo(() => {
    return allEvents
      .filter((e) => e.date === date)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [allEvents, date]);

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

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setShowForm(false);
      setEditingEvent(undefined);
    }
    onOpenChange(nextOpen);
  }

  function getCategoryBadgeClass(categoryId: string): string {
    const cat = EVENT_CATEGORIES.find((c) => c.id === categoryId);
    return CATEGORY_BADGE_COLOR[cat?.color ?? 'slate'] ?? CATEGORY_BADGE_COLOR.slate;
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{formatDateShort(date)}</DrawerTitle>
          {segmentTitle && (
            <DrawerDescription>{segmentTitle}</DrawerDescription>
          )}
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {/* Event list */}
          {dayEvents.length === 0 && !showForm && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No events planned for this day.
            </p>
          )}

          {dayEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-2 rounded-lg border bg-background p-2.5 text-sm"
            >
              <span className="font-mono text-xs text-muted-foreground w-11 shrink-0 pt-0.5">
                {event.time}
              </span>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-medium leading-tight truncate">
                  {event.description}
                </p>
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] px-1.5 py-0 ${getCategoryBadgeClass(event.category)}`}
                  >
                    {EVENT_CATEGORIES.find((c) => c.id === event.category)?.name ?? event.category}
                  </Badge>
                  {event.cost.amount > 0 && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700">
                      <PriceDisplay price={event.cost} className="text-[10px]" />
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-0.5 shrink-0">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleEdit(event)}
                  aria-label={`Edit ${event.description}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(event.id)}
                  aria-label={`Delete ${event.description}`}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))}

          {/* Event form */}
          {showForm && (
            <EventForm
              segmentId={segmentId}
              date={date}
              existingEvent={editingEvent}
              onSave={handleFormSave}
              onCancel={handleFormCancel}
            />
          )}

          {/* Add event button */}
          {!showForm && segmentId && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setEditingEvent(undefined);
                setShowForm(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </Button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
