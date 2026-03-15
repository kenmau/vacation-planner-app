'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { PriceBreakdown } from '@/lib/types';
import { PriceDisplay } from '@/components/shared/price-display';

interface PriceHeaderProps {
  breakdown: PriceBreakdown;
}

const CATEGORY_LABELS: { key: keyof Omit<PriceBreakdown, 'total'>; label: string }[] = [
  { key: 'cruise', label: 'Cruise' },
  { key: 'accommodation', label: 'Accommodation' },
  { key: 'transport', label: 'Transport' },
  { key: 'activities', label: 'Activities' },
  { key: 'events', label: 'Events' },
];

export function PriceHeader({ breakdown }: PriceHeaderProps) {
  const [expanded, setExpanded] = useState(false);

  const nonZeroCategories = CATEGORY_LABELS.filter(
    (cat) => breakdown[cat.key].amount > 0
  );
  const hasAnyCost = nonZeroCategories.length > 0;

  return (
    <div className="sticky top-14 z-30 bg-background/95 backdrop-blur border-b border-border">
      <div className="px-4 py-3">
        {/* Total row */}
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="flex w-full items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Trip Total</span>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <PriceDisplay
            price={breakdown.total}
            className="text-xl font-bold"
          />
        </button>

        {/* Collapsible breakdown */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-border">
            {hasAnyCost ? (
              <div className="grid grid-cols-1 md:grid-rows-1 md:grid-cols-5 gap-2">
                {nonZeroCategories.map((cat) => (
                  <div
                    key={cat.key}
                    className="flex items-center justify-between md:flex-col md:items-start gap-1"
                  >
                    <span className="text-xs text-muted-foreground">
                      {cat.label}
                    </span>
                    <PriceDisplay
                      price={breakdown[cat.key]}
                      className="text-sm font-medium"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No costs yet
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
