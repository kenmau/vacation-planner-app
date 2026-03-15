import type { Meta, Price, Rating, ImageRef } from "./common";

/** Stateroom category */
export interface StateroomCategory {
  id: string;
  name: string; // e.g. "Interior", "Ocean View", "Balcony", "Suite"
  description: string;
  pricePerPerson: Price;
  squareFeet: number;
  maxOccupancy: number;
  amenities: string[];
}

/** Port of call */
export interface PortOfCall {
  name: string;
  country: string;
  arrivalTime: string;
  departureTime: string;
  dayNumber: number;
  highlights: string[];
}

/** Ship within a cruise line */
export interface Ship {
  id: string;
  cruiseLineId: string;
  name: string;
  image: ImageRef;
  yearBuilt: number;
  yearRefurbished?: number;
  grossTonnage: number;
  length: number; // feet
  passengerCapacity: number;
  crewSize: number;
  numberOfDecks: number;
  staterooms: StateroomCategory[];
  dining: string[];
  entertainment: string[];
  activities: string[];
  ports: PortOfCall[];
  duration: number; // nights
  departurePort: string;
  route: string; // e.g. "Alaska Inside Passage"
  rating: Rating;
  reviewCount: number;
  reviewSummary: string;
  _meta: Meta;
}

/** Cruise line with its ships */
export interface CruiseLine {
  id: string;
  name: string;
  logo: ImageRef;
  description: string;
  ships: Ship[];
  _meta: Meta;
}
