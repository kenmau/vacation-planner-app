'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FALLBACK_USD_TO_CAD } from '@/lib/utils/constants';

/** Fallback rates: currency → CAD */
const FALLBACK_RATES: Record<string, number> = {
  CAD: 1.0,
  USD: FALLBACK_USD_TO_CAD,
  EUR: 1.50,
  GBP: 1.73,
};

interface PriceState {
  exchangeRates: Record<string, number>;
  lastRateUpdate: string | null;
}

interface PriceActions {
  setRates: (rates: Record<string, number>) => void;
  convertToCAD: (amount: number, currency: string) => number;
}

export const usePriceStore = create<PriceState & PriceActions>()(
  persist(
    (set, get) => ({
      // State — initialize with fallback rates
      exchangeRates: { ...FALLBACK_RATES },
      lastRateUpdate: null,

      // Actions
      setRates: (rates) =>
        set({
          exchangeRates: { ...FALLBACK_RATES, ...rates },
          lastRateUpdate: new Date().toISOString(),
        }),

      convertToCAD: (amount, currency) => {
        const { exchangeRates } = get();
        if (currency === 'CAD') return amount;
        const rate = exchangeRates[currency];
        if (rate == null) {
          console.warn(`No exchange rate found for ${currency}, returning original amount`);
          return amount;
        }
        return Math.round(amount * rate * 100) / 100;
      },
    }),
    {
      name: 'vacation-planner-prices',
    }
  )
);
