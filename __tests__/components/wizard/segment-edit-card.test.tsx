import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { SegmentEditCard } from '@/components/wizard/segment-edit-card';

function makeSegment(overrides = {}) {
  return {
    type: 'land-resort',
    title: 'Test Segment',
    location: { city: 'Anchorage', stateOrCountry: 'Alaska' },
    durationDays: 3,
    flexDays: 0,
    order: 0,
    ...overrides,
  };
}

function renderCard(segmentOverrides = {}) {
  cleanup();
  const onUpdate = vi.fn();
  const result = render(
    <SegmentEditCard
      segment={makeSegment(segmentOverrides)}
      index={0}
      dayStart={1}
      dayEnd={3}
      totalSegments={2}
      onUpdate={onUpdate}
      onRemove={vi.fn()}
      onMoveUp={vi.fn()}
      onMoveDown={vi.fn()}
    />
  );
  return { onUpdate, ...result };
}

describe('SegmentEditCard — duration field', () => {
  it('should allow clearing the duration field via backspace (not snap to 1)', () => {
    const { onUpdate } = renderCard({ durationDays: 1 });

    const spinbuttons = screen.getAllByRole('spinbutton');
    const durationInput = spinbuttons[0];

    // Simulate clearing the field (user backspaces to empty)
    fireEvent.change(durationInput, { target: { value: '' } });
    expect(onUpdate).toHaveBeenCalledWith({ durationDays: 0 });
  });

  it('should accept valid numeric input in duration field', () => {
    const { onUpdate } = renderCard({ durationDays: 1 });

    const spinbuttons = screen.getAllByRole('spinbutton');
    const durationInput = spinbuttons[0];

    fireEvent.change(durationInput, { target: { value: '5' } });
    expect(onUpdate).toHaveBeenCalledWith({ durationDays: 5 });
  });

  it('should enforce minimum of 1 on blur when durationDays is 0', () => {
    const onUpdate = vi.fn();
    cleanup();
    render(
      <SegmentEditCard
        segment={makeSegment({ durationDays: 0 })}
        index={0}
        dayStart={1}
        dayEnd={1}
        totalSegments={2}
        onUpdate={onUpdate}
        onRemove={vi.fn()}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
      />
    );

    const spinbuttons = screen.getAllByRole('spinbutton');
    fireEvent.blur(spinbuttons[0]);
    expect(onUpdate).toHaveBeenCalledWith({ durationDays: 1 });
  });
});
