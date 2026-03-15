'use client';

import { useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Trip, Segment, DayEvent } from '@/lib/types';

interface TripState {
  trips: Trip[];
  activeTrip: Trip | null;
  events: DayEvent[];
  viewHistory: string[];
}

interface TripActions {
  createTrip: (trip: Trip) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  setActiveTrip: (trip: Trip | null) => void;
  addSegment: (tripId: string, segment: Segment) => void;
  updateSegment: (tripId: string, segmentId: string, updates: Partial<Segment>) => void;
  removeSegment: (tripId: string, segmentId: string) => void;
  addEvent: (event: DayEvent) => void;
  updateEvent: (eventId: string, updates: Partial<DayEvent>) => void;
  removeEvent: (eventId: string) => void;
  pushView: (view: string) => void;
  popView: () => void;
}

/** Whether the persist middleware has finished hydrating from localStorage */
export const useTripStoreHydrated = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = useTripStore.persist.onFinishHydration(() => setHydrated(true));
    // If already hydrated (e.g. same session navigation), set immediately
    if (useTripStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);
  return hydrated;
};

export const useTripStore = create<TripState & TripActions>()(
  persist(
    (set) => ({
      // State
      trips: [],
      activeTrip: null,
      events: [],
      viewHistory: [],

      // Trip actions
      createTrip: (trip) =>
        set((state) => ({ trips: [...state.trips, trip] })),

      updateTrip: (id, updates) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
          activeTrip:
            state.activeTrip?.id === id
              ? { ...state.activeTrip, ...updates, updatedAt: new Date().toISOString() }
              : state.activeTrip,
        })),

      deleteTrip: (id) =>
        set((state) => ({
          trips: state.trips.filter((t) => t.id !== id),
          activeTrip: state.activeTrip?.id === id ? null : state.activeTrip,
          events: state.events.filter(
            (e) => !state.trips.find((t) => t.id === id)?.segments.some((s) => s.id === e.segmentId)
          ),
        })),

      setActiveTrip: (trip) => set({ activeTrip: trip }),

      // Segment actions
      addSegment: (tripId, segment) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id === tripId
              ? { ...t, segments: [...t.segments, segment], updatedAt: new Date().toISOString() }
              : t
          ),
          activeTrip:
            state.activeTrip?.id === tripId
              ? {
                  ...state.activeTrip,
                  segments: [...state.activeTrip.segments, segment],
                  updatedAt: new Date().toISOString(),
                }
              : state.activeTrip,
        })),

      updateSegment: (tripId, segmentId, updates) =>
        set((state) => {
          const updateSegments = (segments: Segment[]) =>
            segments.map((s) => (s.id === segmentId ? { ...s, ...updates } : s));
          return {
            trips: state.trips.map((t) =>
              t.id === tripId
                ? { ...t, segments: updateSegments(t.segments), updatedAt: new Date().toISOString() }
                : t
            ),
            activeTrip:
              state.activeTrip?.id === tripId
                ? {
                    ...state.activeTrip,
                    segments: updateSegments(state.activeTrip.segments),
                    updatedAt: new Date().toISOString(),
                  }
                : state.activeTrip,
          };
        }),

      removeSegment: (tripId, segmentId) =>
        set((state) => ({
          trips: state.trips.map((t) =>
            t.id === tripId
              ? {
                  ...t,
                  segments: t.segments.filter((s) => s.id !== segmentId),
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
          activeTrip:
            state.activeTrip?.id === tripId
              ? {
                  ...state.activeTrip,
                  segments: state.activeTrip.segments.filter((s) => s.id !== segmentId),
                  updatedAt: new Date().toISOString(),
                }
              : state.activeTrip,
          events: state.events.filter((e) => e.segmentId !== segmentId),
        })),

      // Event actions
      addEvent: (event) =>
        set((state) => ({ events: [...state.events, event] })),

      updateEvent: (eventId, updates) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId ? { ...e, ...updates } : e
          ),
        })),

      removeEvent: (eventId) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== eventId),
        })),

      // View history actions
      pushView: (view) =>
        set((state) => ({ viewHistory: [...state.viewHistory, view] })),

      popView: () =>
        set((state) => ({
          viewHistory: state.viewHistory.slice(0, -1),
        })),
    }),
    {
      name: 'vacation-planner-trips',
    }
  )
);
