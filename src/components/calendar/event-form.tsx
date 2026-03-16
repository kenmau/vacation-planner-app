'use client';

import { useState } from 'react';
import { useTripStore } from '@/lib/stores/trip-store';
import { EVENT_CATEGORIES, DURATION_OPTIONS } from '@/lib/utils/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DayEvent, EventCategory } from '@/lib/types/event';

interface EventFormProps {
  segmentId: string;
  date: string;
  existingEvent?: DayEvent;
  /** When true, show a date picker so the user can choose/change the event date */
  showDateField?: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export function EventForm({
  segmentId,
  date,
  existingEvent,
  showDateField = false,
  onSave,
  onCancel,
}: EventFormProps) {
  const addEvent = useTripStore((s) => s.addEvent);
  const updateEvent = useTripStore((s) => s.updateEvent);

  const [eventDate, setEventDate] = useState(existingEvent?.date ?? date);
  const [time, setTime] = useState(existingEvent?.time ?? '09:00');
  const [description, setDescription] = useState(existingEvent?.description ?? '');
  const [category, setCategory] = useState<EventCategory>(
    existingEvent?.category ?? 'other'
  );
  const [duration, setDuration] = useState(
    String(existingEvent?.duration ?? 60)
  );
  const [costAmount, setCostAmount] = useState(
    existingEvent?.cost.amount ? String(existingEvent.cost.amount) : ''
  );

  const isEdit = !!existingEvent;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!description.trim()) return;

    const cost = { amount: Number(costAmount) || 0, currency: 'CAD' };

    if (isEdit) {
      updateEvent(existingEvent.id, {
        date: eventDate,
        time,
        description: description.trim(),
        category,
        duration: Number(duration),
        cost,
      });
    } else {
      const event: DayEvent = {
        id: crypto.randomUUID(),
        segmentId,
        date: eventDate,
        time,
        description: description.trim(),
        category,
        duration: Number(duration),
        cost,
      };
      addEvent(event);
    }

    onSave();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border bg-muted/30 p-3">
      <div className="text-sm font-medium">
        {isEdit ? 'Edit Event' : 'Add Event'}
      </div>

      <div className={`grid gap-3 ${showDateField ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {showDateField && (
          <div className="space-y-1">
            <Label htmlFor="event-date" className="text-xs">Date</Label>
            <Input
              id="event-date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>
        )}
        <div className="space-y-1">
          <Label htmlFor="event-time" className="text-xs">Time</Label>
          <Input
            id="event-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="event-category" className="text-xs">Category</Label>
          <Select value={category} onValueChange={(v) => { if (v) setCategory(v as EventCategory); }}>
            <SelectTrigger id="event-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EVENT_CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="event-description" className="text-xs">Description</Label>
        <Input
          id="event-description"
          type="text"
          placeholder="What's happening?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="event-duration" className="text-xs">Duration</Label>
          <Select value={duration} onValueChange={(v) => { if (v) setDuration(v); }}>
            <SelectTrigger id="event-duration">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="event-cost" className="text-xs">Cost (CAD)</Label>
          <Input
            id="event-cost"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            value={costAmount}
            onChange={(e) => setCostAmount(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" disabled={!description.trim()}>
          {isEdit ? 'Update' : 'Save'}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
