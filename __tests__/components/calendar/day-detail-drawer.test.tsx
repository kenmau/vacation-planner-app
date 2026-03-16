import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { DayDetailDrawer } from '@/components/calendar/day-detail-drawer';
import { useTripStore } from '@/lib/stores/trip-store';
import type { DayEvent } from '@/lib/types/event';

const sampleEvents: DayEvent[] = [
  {
    id: 'evt-1', segmentId: 'seg-1', date: '2026-06-17',
    time: '14:00', description: 'Glacier viewing', category: 'excursion',
    duration: 120, cost: { amount: 100, currency: 'CAD' },
  },
  {
    id: 'evt-2', segmentId: 'seg-1', date: '2026-06-17',
    time: '09:00', description: 'Breakfast buffet', category: 'dining',
    duration: 60, cost: { amount: 0, currency: 'CAD' },
  },
  {
    id: 'evt-3', segmentId: 'seg-1', date: '2026-06-18',
    time: '10:00', description: 'Different day event', category: 'other',
    duration: 60, cost: { amount: 0, currency: 'CAD' },
  },
];

function makeProps(overrides = {}) {
  return {
    open: true,
    onOpenChange: vi.fn(),
    date: '2026-06-17',
    segmentTitle: 'Juneau, Alaska',
    segmentId: 'seg-1',
    ...overrides,
  };
}

/** Get the dialog element from the portal (scoped to avoid triple-rendered elements) */
function getDialog() {
  return screen.getByRole('dialog');
}

beforeEach(() => {
  useTripStore.setState({ events: [...sampleEvents] });
});

describe('DayDetailDrawer', () => {
  it('should render the date and segment title in the header', () => {
    render(<DayDetailDrawer {...makeProps()} />);
    const dialog = getDialog();
    expect(within(dialog).getByText('Jun 17')).toBeInTheDocument();
    expect(within(dialog).getByText('Juneau, Alaska')).toBeInTheDocument();
  });

  it('should list events sorted by time (09:00 before 14:00)', () => {
    render(<DayDetailDrawer {...makeProps()} />);
    const dialog = getDialog();
    const descriptions = within(dialog).getAllByText(/Glacier viewing|Breakfast buffet/);
    expect(descriptions[0].textContent).toBe('Breakfast buffet');
    expect(descriptions[1].textContent).toBe('Glacier viewing');
  });

  it('should only show events for the specified date', () => {
    render(<DayDetailDrawer {...makeProps()} />);
    const dialog = getDialog();
    expect(within(dialog).getAllByText('Glacier viewing')).toHaveLength(1);
    expect(within(dialog).getAllByText('Breakfast buffet')).toHaveLength(1);
    expect(within(dialog).queryByText('Different day event')).not.toBeInTheDocument();
  });

  it('should show cost badge only for events with cost > 0', () => {
    render(<DayDetailDrawer {...makeProps()} />);
    const dialog = getDialog();
    // Glacier viewing has $100 cost — look for the formatted cost
    expect(within(dialog).getByText('$100')).toBeInTheDocument();
  });

  it('should call removeEvent when delete button is clicked', () => {
    render(<DayDetailDrawer {...makeProps()} />);
    const dialog = getDialog();
    const deleteButtons = within(dialog).getAllByLabelText(/Delete/);
    fireEvent.click(deleteButtons[0]);

    const events = useTripStore.getState().events;
    const dayEvents = events.filter((e) => e.date === '2026-06-17');
    expect(dayEvents).toHaveLength(1);
  });

  it('should show "No events" message when there are no events', () => {
    useTripStore.setState({ events: [] });
    render(<DayDetailDrawer {...makeProps()} />);
    const dialog = getDialog();
    expect(within(dialog).getByText(/No events planned/)).toBeInTheDocument();
  });

  it('should show Add Event button', () => {
    render(<DayDetailDrawer {...makeProps()} />);
    const dialog = getDialog();
    expect(within(dialog).getByRole('button', { name: /Add Event/ })).toBeInTheDocument();
  });

  it('should show event form when Add Event is clicked', () => {
    render(<DayDetailDrawer {...makeProps()} />);
    const dialog = getDialog();
    fireEvent.click(within(dialog).getByRole('button', { name: /Add Event/ }));
    expect(document.getElementById('event-description')).toBeInTheDocument();
  });
});
