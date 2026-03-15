'use client';

import { useMemo } from 'react';
import { addDays, formatDateShort } from '@/lib/utils/date-utils';
import { getSegmentType } from '@/lib/utils/constants';

// Static color maps — never construct Tailwind classes dynamically
const BG_COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-100 border-blue-400',
  green: 'bg-green-100 border-green-400',
  orange: 'bg-orange-100 border-orange-400',
  cyan: 'bg-cyan-100 border-cyan-400',
  purple: 'bg-purple-100 border-purple-400',
  amber: 'bg-amber-100 border-amber-400',
  red: 'bg-red-100 border-red-400',
  lime: 'bg-lime-100 border-lime-400',
  sky: 'bg-sky-100 border-sky-400',
  indigo: 'bg-indigo-100 border-indigo-400',
  teal: 'bg-teal-100 border-teal-400',
  pink: 'bg-pink-100 border-pink-400',
};

const TEXT_COLOR_MAP: Record<string, string> = {
  blue: 'text-blue-700',
  green: 'text-green-700',
  orange: 'text-orange-700',
  cyan: 'text-cyan-700',
  purple: 'text-purple-700',
  amber: 'text-amber-700',
  red: 'text-red-700',
  lime: 'text-lime-700',
  sky: 'text-sky-700',
  indigo: 'text-indigo-700',
  teal: 'text-teal-700',
  pink: 'text-pink-700',
};

export interface TimelineCalendarProps {
  startDate: string;
  totalDays: number;
  segments: Array<{
    type: string;
    title: string;
    durationDays: number;
  }>;
}

interface SegmentBlock {
  type: string;
  title: string;
  color: string;
  gridStart: number; // 1-based grid column start
  span: number;
}

export function TimelineCalendar({
  startDate,
  totalDays,
  segments,
}: TimelineCalendarProps) {
  // Ensure at least 1 day
  const days = Math.max(totalDays, 1);

  // Build day headers
  const dayHeaders = useMemo(() => {
    const headers: Array<{ dayNumber: number; dateLabel: string }> = [];
    for (let i = 0; i < days; i++) {
      const dateStr = addDays(startDate, i);
      headers.push({
        dayNumber: i + 1,
        dateLabel: formatDateShort(dateStr),
      });
    }
    return headers;
  }, [startDate, days]);

  // Build segment blocks with grid positions
  const segmentBlocks = useMemo(() => {
    const blocks: SegmentBlock[] = [];
    let currentCol = 1; // 1-based for CSS grid

    for (const seg of segments) {
      const segType = getSegmentType(seg.type);
      const color = segType?.color ?? 'blue';
      blocks.push({
        type: seg.type,
        title: seg.title,
        color,
        gridStart: currentCol,
        span: seg.durationDays,
      });
      currentCol += seg.durationDays;
    }

    return blocks;
  }, [segments]);

  // Calculate total segment days to know if there's a gap at the end
  const totalSegmentDays = segments.reduce((sum, s) => sum + s.durationDays, 0);
  const gapDays = days - totalSegmentDays;

  return (
    <div className="rounded-lg border border-border bg-background shadow-sm">
      <div className="overflow-x-auto">
        <div
          className="min-w-fit"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${days}, 48px)`,
            gridTemplateRows: 'auto auto',
          }}
        >
          {/* Row 1: Day headers */}
          {dayHeaders.map((header) => (
            <div
              key={header.dayNumber}
              className="flex flex-col items-center justify-center border-r border-border px-0.5 py-1.5 last:border-r-0"
              style={{ gridRow: 1 }}
            >
              <span className="text-[10px] font-semibold text-foreground leading-tight">
                {header.dayNumber}
              </span>
              <span className="text-[9px] text-muted-foreground leading-tight">
                {header.dateLabel}
              </span>
            </div>
          ))}

          {/* Row 2: Segment blocks */}
          {segmentBlocks.map((block, i) => {
            const bgClasses = BG_COLOR_MAP[block.color] ?? BG_COLOR_MAP.blue;
            const textClass = TEXT_COLOR_MAP[block.color] ?? TEXT_COLOR_MAP.blue;

            return (
              <div
                key={i}
                className={`flex items-center border-t-2 rounded-sm px-1.5 py-1 ${bgClasses} ${textClass}`}
                style={{
                  gridRow: 2,
                  gridColumn: `${block.gridStart} / span ${block.span}`,
                  minHeight: '32px',
                }}
              >
                <span className="text-xs font-medium truncate w-full">
                  {block.title}
                </span>
              </div>
            );
          })}

          {/* Gap cells at the end if segments don't fill the timeline */}
          {gapDays > 0 && (
            <div
              className="flex items-center justify-center bg-muted/50 border border-dashed border-muted-foreground/20 rounded-sm px-1.5 py-1"
              style={{
                gridRow: 2,
                gridColumn: `${totalSegmentDays + 1} / span ${gapDays}`,
                minHeight: '32px',
              }}
            >
              <span className="text-[10px] text-muted-foreground">
                {gapDays === 1 ? '1 day' : `${gapDays} days`} unplanned
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
