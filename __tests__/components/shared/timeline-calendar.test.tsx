import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimelineCalendar } from '@/components/shared/timeline-calendar';

const defaultProps = {
  startDate: '2026-06-14',
  totalDays: 7,
  segments: [
    { type: 'cruise', title: 'Alaska Cruise', durationDays: 4 },
    { type: 'land-resort', title: 'Denali Stay', durationDays: 3 },
  ],
};

describe('TimelineCalendar', () => {
  it('should render day numbers', () => {
    render(<TimelineCalendar {...defaultProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('should render segment titles', () => {
    render(<TimelineCalendar {...defaultProps} />);
    expect(screen.getAllByText('Alaska Cruise').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Denali Stay').length).toBeGreaterThanOrEqual(1);
  });

  it('should not render buttons when onDayClick is not provided', () => {
    render(<TimelineCalendar {...defaultProps} />);
    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });

  it('should render buttons when onDayClick is provided', () => {
    const onDayClick = vi.fn();
    render(<TimelineCalendar {...defaultProps} onDayClick={onDayClick} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(7);
  });

  it('should call onDayClick with correct ISO date when a day is clicked', () => {
    const onDayClick = vi.fn();
    const { container } = render(
      <TimelineCalendar {...defaultProps} onDayClick={onDayClick} />
    );

    // Click day 1 (June 14) using container query to get actual DOM buttons
    const buttons = container.querySelectorAll('button[type="button"]');
    expect(buttons.length).toBe(7);

    fireEvent.click(buttons[0]);
    expect(onDayClick).toHaveBeenCalledWith('2026-06-14');

    // Click day 3 (June 16)
    fireEvent.click(buttons[2]);
    expect(onDayClick).toHaveBeenCalledWith('2026-06-16');
  });

  it('should dim non-matching segments when highlightSegmentTypes is set', () => {
    const { container } = render(
      <TimelineCalendar
        {...defaultProps}
        highlightSegmentTypes={['cruise']}
      />
    );
    // The second segment (land-resort) should have opacity-30
    const segmentBlocks = container.querySelectorAll('[style*="grid-row: 2"]');
    // There are 2 segment blocks — first (cruise) should NOT have opacity-30, second (land-resort) should
    const blockStyles = Array.from(segmentBlocks).map((el) => el.className);
    expect(blockStyles[0]).not.toContain('opacity-30');
    expect(blockStyles[1]).toContain('opacity-30');
  });
});
