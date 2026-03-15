/**
 * Price breakdown computation for trips.
 * Phase 2: cruise/accommodation/transport/activities are $0 CAD.
 * Events sum up all event costs already denominated in CAD.
 */

import type { Trip, PriceBreakdown, DayEvent, Price } from "@/lib/types";

/** Returns a Price of $0 CAD */
function zeroCad(): Price {
  return { amount: 0, currency: "CAD" };
}

/**
 * Calculate price breakdown for a trip.
 *
 * For Phase 2, cruise/accommodation/transport/activities are all $0 CAD.
 * Events sum up all event costs for events belonging to the trip's segments.
 * Total = sum of all categories.
 */
export function calculatePriceBreakdown(
  trip: Trip,
  events: DayEvent[]
): PriceBreakdown {
  const segmentIds = new Set(trip.segments.map((s) => s.id));

  const tripEvents = events.filter((e) => segmentIds.has(e.segmentId));

  const eventsTotal = tripEvents.reduce(
    (sum, event) => sum + event.cost.amount,
    0
  );

  const cruise = zeroCad();
  const accommodation = zeroCad();
  const transport = zeroCad();
  const activities = zeroCad();
  const eventsPrice: Price = { amount: eventsTotal, currency: "CAD" };

  const total: Price = {
    amount:
      cruise.amount +
      accommodation.amount +
      transport.amount +
      activities.amount +
      eventsPrice.amount,
    currency: "CAD",
  };

  return {
    cruise,
    accommodation,
    transport,
    activities,
    events: eventsPrice,
    total,
  };
}
