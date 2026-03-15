'use client';

import { create } from 'zustand';

const MAX_COMPARE_SHIPS = 4;

interface CompareState {
  selectedShipIds: string[];
}

interface CompareActions {
  toggleShip: (id: string) => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
}

export const useCompareStore = create<CompareState & CompareActions>()(
  (set, get) => ({
    // State
    selectedShipIds: [],

    // Actions
    toggleShip: (id) =>
      set((state) => {
        if (state.selectedShipIds.includes(id)) {
          return { selectedShipIds: state.selectedShipIds.filter((sid) => sid !== id) };
        }
        if (state.selectedShipIds.length >= MAX_COMPARE_SHIPS) {
          return state; // silently ignore if at max
        }
        return { selectedShipIds: [...state.selectedShipIds, id] };
      }),

    clearSelection: () => set({ selectedShipIds: [] }),

    isSelected: (id) => get().selectedShipIds.includes(id),
  })
);
