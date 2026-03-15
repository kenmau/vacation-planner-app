import type { Price } from "./common";

/** Segment type identifier — data-driven, not a hardcoded enum */
export type SegmentTypeId = string;

/** A single segment within a trip */
export interface Segment {
  id: string;
  tripId: string;
  type: SegmentTypeId;
  title: string;
  location: {
    city: string;
    stateOrCountry: string;
  };
  startDate: string; // ISO date
  endDate: string;   // ISO date
  flexDays: number;  // ± days flexibility
  /** Selected cruise ship ID (cruise segments only) */
  cruiseShipId?: string;
  /** Selected accommodation ID (land segments only) */
  accommodationId?: string;
  /** Selected transport IDs */
  transportIds: string[];
  /** Order within the trip */
  order: number;
}

/** Between-segment connecting flight */
export interface ConnectingFlight {
  id: string;
  tripId: string;
  fromSegmentId: string;
  toSegmentId: string;
  transportId?: string; // references a Transport record
}

/** Trip — the top-level entity */
export interface Trip {
  id: string;
  name: string;
  originCity: string;
  startDate: string;       // ISO date
  endDate: string;         // ISO date
  travellers: string[];    // names
  segments: Segment[];
  connectingFlights: ConnectingFlight[];
  baseCurrency: string;    // default "CAD"
  createdAt: string;
  updatedAt: string;
}

/** Price breakdown by category */
export interface PriceBreakdown {
  cruise: Price;
  accommodation: Price;
  transport: Price;
  activities: Price;
  events: Price;
  total: Price;
}
