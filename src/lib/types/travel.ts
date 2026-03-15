import type { Meta, Price } from "./common";

/** Transport type */
export type TransportType =
  | "flight"
  | "train"
  | "bus"
  | "ferry"
  | "car-rental"
  | "private-transfer"
  | "other";

/** Flight search result */
export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string; // ISO datetime
  arrivalTime: string;   // ISO datetime
  duration: string;      // e.g. "5h 30m"
  stops: number;
  stopCities?: string[];
  price: Price;
  _meta: Meta;
}

/** Car rental option */
export interface CarRental {
  id: string;
  provider: string;
  vehicleType: string; // e.g. "Economy", "SUV", "Truck"
  vehicleName: string;
  pricePerDay: Price;
  pickupLocation: string;
  dropoffLocation: string;
  features: string[];
  image?: { url: string; alt: string };
  _meta: Meta;
}

/** Generic transport record (user-entered or selected) */
export interface Transport {
  id: string;
  type: TransportType;
  provider: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  price: Price;
  confirmationNumber?: string;
  notes?: string;
  _meta: Meta;
}
