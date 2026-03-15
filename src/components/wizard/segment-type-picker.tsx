'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { SEGMENT_TYPES } from '@/lib/utils/constants';

/** Static dot color map — Tailwind JIT needs full class strings to generate CSS */
const DOT_COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  cyan: 'bg-cyan-500',
  purple: 'bg-purple-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  lime: 'bg-lime-500',
  sky: 'bg-sky-500',
  indigo: 'bg-indigo-500',
  teal: 'bg-teal-500',
  pink: 'bg-pink-500',
};

interface SegmentTypePickerProps {
  value: string;
  onChange: (typeId: string) => void;
}

export function SegmentTypePicker({ value, onChange }: SegmentTypePickerProps) {
  const selected = SEGMENT_TYPES.find((t) => t.id === value);

  return (
    <Select value={value} onValueChange={(val) => { if (val) onChange(val); }}>
      <SelectTrigger className="w-full">
        {selected ? (
          <span className="flex items-center gap-1.5">
            <span className={`inline-block size-2.5 rounded-full shrink-0 ${DOT_COLOR_MAP[selected.color] ?? 'bg-gray-500'}`} />
            <span>{selected.name}</span>
          </span>
        ) : (
          <span className="text-muted-foreground">Select segment type</span>
        )}
      </SelectTrigger>
      <SelectContent>
        {SEGMENT_TYPES.map((type) => (
          <SelectItem key={type.id} value={type.id}>
            <span className="flex items-center gap-1.5">
              <span
                className={`inline-block size-2.5 rounded-full shrink-0 ${DOT_COLOR_MAP[type.color] ?? 'bg-gray-500'}`}
              />
              <span>{type.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
