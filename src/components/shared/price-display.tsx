"use client";

import type { Price } from "@/lib/types";
import { usePriceStore } from "@/lib/stores/price-store";

interface PriceDisplayProps {
  price: Price;
  className?: string;
  showOriginal?: boolean;
}

/** Displays a price converted to CAD. Never hardcode exchange rates — uses the price store. */
export function PriceDisplay({ price, className, showOriginal }: PriceDisplayProps) {
  const convertToCAD = usePriceStore((s) => s.convertToCAD);

  const cadAmount = price.currency === "CAD"
    ? price.amount
    : convertToCAD(price.amount, price.currency);

  const formatted = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cadAmount);

  return (
    <span className={className}>
      {formatted}
      {showOriginal && price.currency !== "CAD" && (
        <span className="ml-1 text-xs text-muted-foreground">
          ({new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: price.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(price.amount)} {price.currency})
        </span>
      )}
    </span>
  );
}
