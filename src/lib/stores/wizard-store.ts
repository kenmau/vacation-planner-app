'use client';

import { create } from 'zustand';
import type { Trip } from '@/lib/types';

/** A draft segment — like Segment but without id/tripId (assigned on finalize) */
export interface DraftSegment {
  type: string;
  title: string;
  location: {
    city: string;
    stateOrCountry: string;
  };
  endLocation?: {
    city: string;
    stateOrCountry: string;
  };
  durationDays: number;
  flexDays: number;
  order: number;
}

interface WizardState {
  // Step 1 fields
  tripName: string;
  originCity: string;
  startDate: string;
  endDate: string;
  isFlexible: boolean;
  travellers: string[];

  // Step 2 fields
  segments: DraftSegment[];

  // Meta
  isEditing: boolean;
  existingTripId: string | null;
}

interface WizardActions {
  // Step 1
  setTripName: (name: string) => void;
  setOriginCity: (city: string) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setIsFlexible: (flexible: boolean) => void;
  setTravellers: (travellers: string[]) => void;

  // Step 2 — segment management
  addSegment: () => void;
  updateSegment: (index: number, updates: Partial<DraftSegment>) => void;
  removeSegment: (index: number) => void;
  moveSegmentUp: (index: number) => void;
  moveSegmentDown: (index: number) => void;

  // Edit mode
  loadFromTrip: (trip: Trip) => void;

  // Reset
  reset: () => void;
}

const initialState: WizardState = {
  tripName: '',
  originCity: '',
  startDate: '',
  endDate: '',
  isFlexible: false,
  travellers: [],
  segments: [],
  isEditing: false,
  existingTripId: null,
};

export const useWizardStore = create<WizardState & WizardActions>()(
  (set) => ({
    ...initialState,

    // Step 1 setters
    setTripName: (name) => set({ tripName: name }),
    setOriginCity: (city) => set({ originCity: city }),
    setStartDate: (date) => set({ startDate: date }),
    setEndDate: (date) => set({ endDate: date }),
    setIsFlexible: (flexible) => set({ isFlexible: flexible }),
    setTravellers: (travellers) => set({ travellers }),

    // Step 2 — segment management
    addSegment: () =>
      set((state) => ({
        segments: [
          ...state.segments,
          {
            type: 'land-resort',
            title: 'New Segment',
            location: { city: '', stateOrCountry: '' },
            durationDays: 3,
            flexDays: 0,
            order: state.segments.length,
          },
        ],
      })),

    updateSegment: (index, updates) =>
      set((state) => ({
        segments: state.segments.map((seg, i) =>
          i === index ? { ...seg, ...updates } : seg
        ),
      })),

    removeSegment: (index) =>
      set((state) => ({
        segments: state.segments
          .filter((_, i) => i !== index)
          .map((seg, i) => ({ ...seg, order: i })),
      })),

    moveSegmentUp: (index) =>
      set((state) => {
        if (index <= 0) return state;
        const segments = [...state.segments];
        const temp = segments[index];
        segments[index] = segments[index - 1];
        segments[index - 1] = temp;
        return {
          segments: segments.map((seg, i) => ({ ...seg, order: i })),
        };
      }),

    moveSegmentDown: (index) =>
      set((state) => {
        if (index >= state.segments.length - 1) return state;
        const segments = [...state.segments];
        const temp = segments[index];
        segments[index] = segments[index + 1];
        segments[index + 1] = temp;
        return {
          segments: segments.map((seg, i) => ({ ...seg, order: i })),
        };
      }),

    // Edit mode — hydrate draft from existing trip
    loadFromTrip: (trip) =>
      set({
        tripName: trip.name,
        originCity: trip.originCity,
        startDate: trip.startDate,
        endDate: trip.endDate,
        isFlexible: false,
        travellers: [...trip.travellers],
        segments: trip.segments.map((seg, i) => ({
          type: seg.type,
          title: seg.title,
          location: { ...seg.location },
          endLocation: seg.endLocation ? { ...seg.endLocation } : undefined,
          durationDays: Math.round(
            (new Date(seg.endDate).getTime() - new Date(seg.startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          ),
          flexDays: seg.flexDays,
          order: i,
        })),
        isEditing: true,
        existingTripId: trip.id,
      }),

    // Reset
    reset: () => set(initialState),
  })
);
