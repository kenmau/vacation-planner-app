'use client';

import { Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface TravellerListProps {
  travellers: string[];
  onChange: (travellers: string[]) => void;
}

export function TravellerList({ travellers, onChange }: TravellerListProps) {
  const handleNameChange = (index: number, name: string) => {
    const updated = [...travellers];
    updated[index] = name;
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...travellers, '']);
  };

  const handleRemove = (index: number) => {
    const updated = travellers.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-3">
      <Label>Travellers</Label>
      <div className="flex flex-col gap-2">
        {travellers.map((name, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              placeholder={`Traveller ${index + 1}`}
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleRemove(index)}
              disabled={travellers.length <= 1}
              aria-label={`Remove traveller ${index + 1}`}
            >
              <X className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="w-fit"
      >
        <Plus className="size-4" data-icon="inline-start" />
        Add Traveller
      </Button>
    </div>
  );
}
