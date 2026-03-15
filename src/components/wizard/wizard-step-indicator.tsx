'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WizardStepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

const STEPS = ['Trip Basics', 'Segments', 'Review'] as const;

export function WizardStepIndicator({ currentStep }: WizardStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full px-4 py-3">
      {STEPS.map((label, i) => {
        const step = (i + 1) as 1 | 2 | 3;
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;
        const isFuture = step > currentStep;

        return (
          <div key={label} className="flex items-center">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex items-center justify-center size-8 rounded-full text-sm font-medium transition-colors',
                  isCompleted && 'bg-primary text-primary-foreground',
                  isActive && 'bg-primary text-primary-foreground',
                  isFuture && 'border-2 border-muted-foreground/40 text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <Check className="size-4" />
                ) : (
                  <span>{step}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium whitespace-nowrap',
                  isActive && 'text-foreground',
                  isCompleted && 'text-foreground',
                  isFuture && 'text-muted-foreground'
                )}
              >
                {label}
              </span>
            </div>

            {/* Connecting line (not after last step) */}
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-12 md:w-20 mx-2 mb-5 rounded-full',
                  step < currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
