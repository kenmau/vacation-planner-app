'use client';

import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { SegmentTypePicker } from './segment-type-picker';
import { getSegmentType, SEGMENT_COLOR_MAP } from '@/lib/utils/constants';
import { cn } from '@/lib/utils';

interface SegmentData {
  type: string;
  title: string;
  location: { city: string; stateOrCountry: string };
  endLocation?: { city: string; stateOrCountry: string };
  durationDays: number;
  flexDays: number;
  order: number;
}

interface SegmentEditCardProps {
  segment: SegmentData;
  index: number;
  dayStart: number;
  dayEnd: number;
  totalSegments: number;
  onUpdate: (updates: Partial<SegmentData>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function getBorderClass(color: string): string {
  const classes = SEGMENT_COLOR_MAP[color] ?? '';
  const match = classes.match(/border-\w+-500/);
  return match ? match[0] : 'border-gray-300';
}

export function SegmentEditCard({
  segment,
  index,
  dayStart,
  dayEnd,
  totalSegments,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: SegmentEditCardProps) {
  const segmentType = getSegmentType(segment.type);
  const color = segmentType?.color ?? 'gray';
  const borderClass = getBorderClass(color);
  const colorClasses = SEGMENT_COLOR_MAP[color] ?? '';
  const isCruiseType = segment.type === 'cruise' || segment.type === 'river-cruise';

  return (
    <Card className={cn('border-l-4 relative', borderClass)}>
      <CardContent className="flex flex-col gap-3">
        {/* Day badge at top-right */}
        <div className="flex items-start justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Segment {index + 1}
          </span>
          <Badge variant="secondary" className={cn('text-xs', colorClasses)}>
            Day {dayStart}{dayEnd > dayStart ? `\u2013${dayEnd}` : ''}
          </Badge>
        </div>

        {/* Segment type picker */}
        <div className="flex flex-col gap-1.5">
          <Label>Type</Label>
          <SegmentTypePicker
            value={segment.type}
            onChange={(typeId) => onUpdate({ type: typeId })}
          />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <Label>Title</Label>
          <Input
            placeholder="Segment title"
            value={segment.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
          />
        </div>

        {/* Location: City + State/Country — cruise types show departure/arrival ports */}
        {isCruiseType ? (
          <>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Departure Port</Label>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <Label>City</Label>
                  <Input
                    placeholder="Departure city"
                    value={segment.location.city}
                    onChange={(e) =>
                      onUpdate({
                        location: { ...segment.location, city: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <Label>State / Country</Label>
                  <Input
                    placeholder="State or Country"
                    value={segment.location.stateOrCountry}
                    onChange={(e) =>
                      onUpdate({
                        location: {
                          ...segment.location,
                          stateOrCountry: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Arrival Port</Label>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <Label>City</Label>
                  <Input
                    placeholder="Arrival city"
                    value={segment.endLocation?.city ?? ''}
                    onChange={(e) =>
                      onUpdate({
                        endLocation: {
                          city: e.target.value,
                          stateOrCountry: segment.endLocation?.stateOrCountry ?? '',
                        },
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <Label>State / Country</Label>
                  <Input
                    placeholder="State or Country"
                    value={segment.endLocation?.stateOrCountry ?? ''}
                    onChange={(e) =>
                      onUpdate({
                        endLocation: {
                          city: segment.endLocation?.city ?? '',
                          stateOrCountry: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <Label>City</Label>
              <Input
                placeholder="City"
                value={segment.location.city}
                onChange={(e) =>
                  onUpdate({
                    location: { ...segment.location, city: e.target.value },
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <Label>State / Country</Label>
              <Input
                placeholder="State or Country"
                value={segment.location.stateOrCountry}
                onChange={(e) =>
                  onUpdate({
                    location: {
                      ...segment.location,
                      stateOrCountry: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        )}

        {/* Duration + Flex Days */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1.5 flex-1">
            <Label>Duration (days)</Label>
            <Input
              type="number"
              min={1}
              value={segment.durationDays || ''}
              onChange={(e) => {
                const raw = e.target.value;
                const parsed = parseInt(raw);
                onUpdate({ durationDays: raw === '' ? 0 : (isNaN(parsed) ? 1 : Math.max(0, parsed)) });
              }}
              onBlur={() => {
                if (segment.durationDays < 1) onUpdate({ durationDays: 1 });
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <Label>Flex (± days)</Label>
            <Input
              type="number"
              min={0}
              value={segment.flexDays}
              onChange={(e) => {
                const raw = e.target.value;
                const parsed = parseInt(raw);
                onUpdate({ flexDays: raw === '' ? 0 : (isNaN(parsed) ? 0 : Math.max(0, parsed)) });
              }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 pt-1 border-t">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onMoveUp}
            disabled={index === 0}
            aria-label="Move segment up"
          >
            <ArrowUp className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onMoveDown}
            disabled={index === totalSegments - 1}
            aria-label="Move segment down"
          >
            <ArrowDown className="size-4" />
          </Button>
          <div className="flex-1" />
          <Button
            variant="destructive"
            size="icon-sm"
            onClick={onRemove}
            disabled={totalSegments <= 1}
            aria-label="Remove segment"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
