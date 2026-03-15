import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SegmentCard } from '@/components/trip/segment-card';
import type { Segment } from '@/lib/types';

function makeSegment(overrides: Partial<Segment> = {}): Segment {
  return {
    id: 'seg-1',
    tripId: 'trip-1',
    type: 'land-resort',
    title: 'Anchorage Stay',
    location: { city: 'Anchorage', stateOrCountry: 'Alaska' },
    startDate: '2026-06-15',
    endDate: '2026-06-18',
    flexDays: 0,
    transportIds: [],
    order: 0,
    ...overrides,
  };
}

describe('SegmentCard', () => {
  it('should display the segment title heading', () => {
    render(<SegmentCard segment={makeSegment({ title: 'Denali Adventure' })} />);
    expect(screen.getByText('Denali Adventure')).toBeInTheDocument();
    expect(screen.getByText('Denali Adventure').tagName).toBe('H3');
  });

  it('should not render a title element when title is empty', () => {
    const { container } = render(<SegmentCard segment={makeSegment({ title: '' })} />);
    expect(container.querySelector('h3')).toBeNull();
  });

  it('should not show a trailing comma when stateOrCountry is empty', () => {
    render(
      <SegmentCard
        segment={makeSegment({ location: { city: 'Juneau', stateOrCountry: '' } })}
      />
    );
    // Should show just the city, no trailing comma
    expect(screen.getByText('Juneau')).toBeInTheDocument();
    expect(screen.queryByText('Juneau,')).not.toBeInTheDocument();
    expect(screen.queryByText('Juneau, ')).not.toBeInTheDocument();
  });

  it('should show city and stateOrCountry with comma when both present', () => {
    render(
      <SegmentCard
        segment={makeSegment({
          location: { city: 'Fairbanks', stateOrCountry: 'Alaska' },
        })}
      />
    );
    expect(screen.getByText('Fairbanks, Alaska')).toBeInTheDocument();
  });
});
