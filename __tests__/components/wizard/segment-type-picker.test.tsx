import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SegmentTypePicker } from '@/components/wizard/segment-type-picker';

describe('SegmentTypePicker — dot alignment', () => {
  it('should wrap dropdown item dot and text in a flex items-center container', () => {
    const { container } = render(
      <SegmentTypePicker value="cruise" onChange={() => {}} />
    );

    // The trigger shows the selected value with a dot + text
    const trigger = container.querySelector('[data-slot="select-trigger"]');
    expect(trigger).toBeTruthy();

    // Find the flex wrapper span inside the trigger
    const flexWrapper = trigger?.querySelector('span.flex.items-center');
    expect(flexWrapper).toBeTruthy();

    // The dot should be inside this flex container
    const dot = flexWrapper?.querySelector('span.rounded-full');
    expect(dot).toBeTruthy();
  });
});
