'use client';

import { Info } from 'lucide-react';

interface ConnectivityInfoProps {
  fromCity: string;
  toCity: string;
}

export function ConnectivityInfo({
  fromCity,
  toCity,
}: ConnectivityInfoProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-md px-3 py-2 text-sm flex items-center gap-2">
      <Info className="size-4 shrink-0" />
      <span>
        Geographic gap between <strong>{fromCity}</strong> and{' '}
        <strong>{toCity}</strong> — You can add a connecting mode of transport later.
      </span>
    </div>
  );
}
