import type { Meta, Price, Rating, PhysicalLevel, ImageRef } from "./common";

/** Land-based activity */
export interface Activity {
  id: string;
  name: string;
  description: string;
  location: {
    city: string;
    stateOrCountry: string;
    region?: string;
  };
  type: string; // e.g. "Hiking", "Wildlife", "Glacier Tour"
  physicalLevel: PhysicalLevel;
  duration: string; // e.g. "3 hours", "Full day"
  price: Price;
  rating: Rating;
  reviewCount: number;
  seasonalAvailability: string[]; // months
  image: ImageRef;
  packingRecommendations: string[];
  _meta: Meta;
}

/** Accommodation (hotel or Airbnb) */
export interface Accommodation {
  id: string;
  name: string;
  type: "hotel" | "airbnb" | "resort" | "cabin" | "other";
  description: string;
  location: {
    city: string;
    stateOrCountry: string;
    address?: string;
  };
  pricePerNight: Price;
  rating: Rating;
  reviewCount: number;
  amenities: string[];
  image: ImageRef;
  checkInTime: string;
  checkOutTime: string;
  /** User-entered fields for custom accommodations */
  confirmationNumber?: string;
  notes?: string;
  _meta: Meta;
}
