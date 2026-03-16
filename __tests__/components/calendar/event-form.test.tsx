import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { EventForm } from '@/components/calendar/event-form';
import { useTripStore } from '@/lib/stores/trip-store';
import type { DayEvent } from '@/lib/types/event';

beforeEach(() => {
  cleanup();
  useTripStore.setState({ events: [] });
});

function makeProps(overrides = {}) {
  return {
    segmentId: 'seg-1',
    date: '2026-06-15',
    onSave: vi.fn(),
    onCancel: vi.fn(),
    ...overrides,
  };
}

function getInput(id: string): HTMLInputElement {
  return document.body.querySelector(`#${id}`) as HTMLInputElement;
}

function getForm(): HTMLFormElement {
  return document.body.querySelector('form') as HTMLFormElement;
}

describe('EventForm', () => {
  it('should render all form fields', () => {
    render(<EventForm {...makeProps()} />);
    expect(getInput('event-time')).toBeTruthy();
    expect(getInput('event-description')).toBeTruthy();
    expect(getInput('event-cost')).toBeTruthy();
  });

  it('should show "Add Event" heading in create mode', () => {
    render(<EventForm {...makeProps()} />);
    expect(getForm().textContent).toContain('Add Event');
  });

  it('should show "Edit Event" heading and Update button in edit mode', () => {
    const existingEvent: DayEvent = {
      id: 'evt-1', segmentId: 'seg-1', date: '2026-06-15',
      time: '10:00', description: 'Whale watching', category: 'excursion',
      duration: 120, cost: { amount: 150, currency: 'CAD' },
    };
    render(<EventForm {...makeProps({ existingEvent })} />);
    expect(getForm().textContent).toContain('Edit Event');
    expect(getForm().querySelector('button[type="submit"]')?.textContent).toBe('Update');
  });

  it('should pre-fill fields in edit mode', () => {
    const existingEvent: DayEvent = {
      id: 'evt-1', segmentId: 'seg-1', date: '2026-06-15',
      time: '14:30', description: 'Glacier tour', category: 'excursion',
      duration: 180, cost: { amount: 200, currency: 'CAD' },
    };
    render(<EventForm {...makeProps({ existingEvent })} />);
    expect(getInput('event-time').value).toBe('14:30');
    expect(getInput('event-description').value).toBe('Glacier tour');
    expect(getInput('event-cost').value).toBe('200');
  });

  it('should disable Save when description is empty', () => {
    render(<EventForm {...makeProps()} />);
    expect(getForm().querySelector('button[type="submit"]')).toBeDisabled();
  });

  it('should call onCancel when cancel is clicked', () => {
    const props = makeProps();
    render(<EventForm {...props} />);
    const buttons = getForm().querySelectorAll('button[type="button"]');
    const cancelBtn = Array.from(buttons).find((b) => b.textContent?.trim() === 'Cancel')!;
    fireEvent.click(cancelBtn);
    expect(props.onCancel).toHaveBeenCalled();
  });

  it('should call addEvent and onSave on form submit in create mode', () => {
    const props = makeProps();
    render(<EventForm {...props} />);

    fireEvent.change(getInput('event-description'), { target: { value: 'Dinner at the pier' } });
    fireEvent.click(getForm().querySelector('button[type="submit"]')!);

    expect(props.onSave).toHaveBeenCalled();
    const events = useTripStore.getState().events;
    expect(events).toHaveLength(1);
    expect(events[0].description).toBe('Dinner at the pier');
    expect(events[0].segmentId).toBe('seg-1');
    expect(events[0].date).toBe('2026-06-15');
  });

  it('should default cost to 0 when left empty', () => {
    const props = makeProps();
    render(<EventForm {...props} />);

    fireEvent.change(getInput('event-description'), { target: { value: 'Free event' } });
    fireEvent.click(getForm().querySelector('button[type="submit"]')!);

    const events = useTripStore.getState().events;
    expect(events[0].cost.amount).toBe(0);
    expect(events[0].cost.currency).toBe('CAD');
  });

  it('should call updateEvent in edit mode', () => {
    const existingEvent: DayEvent = {
      id: 'evt-1', segmentId: 'seg-1', date: '2026-06-15',
      time: '10:00', description: 'Old description', category: 'other',
      duration: 60, cost: { amount: 0, currency: 'CAD' },
    };
    useTripStore.setState({ events: [existingEvent] });

    const props = makeProps({ existingEvent });
    render(<EventForm {...props} />);

    fireEvent.change(getInput('event-description'), { target: { value: 'Updated description' } });
    fireEvent.click(getForm().querySelector('button[type="submit"]')!);

    expect(props.onSave).toHaveBeenCalled();
    const events = useTripStore.getState().events;
    expect(events[0].description).toBe('Updated description');
  });
});
