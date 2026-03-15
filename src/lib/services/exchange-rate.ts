import { FALLBACK_USD_TO_CAD } from '@/lib/utils/constants';

const STORAGE_KEY = 'vacation-planner-exchange-rates';

/** Fallback rates: currency → CAD */
const FALLBACK_RATES: Record<string, number> = {
  CAD: 1.0,
  USD: FALLBACK_USD_TO_CAD,
  EUR: 1.50,
  GBP: 1.73,
};

interface CachedRates {
  rates: Record<string, number>;
  timestamp: string;
}

/**
 * Get exchange rates, reading from localStorage cache first,
 * falling back to hardcoded rates.
 */
export async function getExchangeRates(): Promise<Record<string, number>> {
  if (typeof window === 'undefined') {
    return { ...FALLBACK_RATES };
  }

  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed: CachedRates = JSON.parse(cached);
      if (parsed.rates && Object.keys(parsed.rates).length > 0) {
        return { ...FALLBACK_RATES, ...parsed.rates };
      }
    }
  } catch {
    // localStorage unavailable or corrupt — fall through
  }

  return { ...FALLBACK_RATES };
}

/**
 * Convert an amount from the given currency to CAD using cached rates.
 */
export function convertToCAD(amount: number, currency: string): number {
  if (currency === 'CAD') return amount;

  // Synchronous read from localStorage for immediate conversion
  let rates = { ...FALLBACK_RATES };
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed: CachedRates = JSON.parse(cached);
        if (parsed.rates) {
          rates = { ...FALLBACK_RATES, ...parsed.rates };
        }
      }
    } catch {
      // use fallback rates
    }
  }

  const rate = rates[currency];
  if (rate == null) {
    console.warn(`No exchange rate found for ${currency}, returning original amount`);
    return amount;
  }

  return Math.round(amount * rate * 100) / 100;
}
