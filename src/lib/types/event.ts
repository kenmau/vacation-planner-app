import type { Price } from "./common";

/** Event category for calendar day events */
export type EventCategory =
  | "port"
  | "dining"
  | "excursion"
  | "onboard"
  | "transit"
  | "other";

/** A scheduled event on a specific day */
export interface DayEvent {
  id: string;
  segmentId: string;
  date: string;       // ISO date
  time: string;       // HH:mm
  description: string;
  category: EventCategory;
  duration: number;   // minutes (15-min increments)
  cost: Price;        // amount=0 means free
}
