/** Segment types — data-driven, not hardcoded enums.
 *  New types can be added here without code changes. */
export interface SegmentType {
  id: string;
  name: string;
  icon: string;
  color: string; // Tailwind color class suffix
}

export const SEGMENT_TYPES: SegmentType[] = [
  { id: "cruise", name: "Cruise", icon: "Ship", color: "blue" },
  { id: "land-resort", name: "Land/Resort", icon: "Hotel", color: "green" },
  { id: "adventure", name: "Adventure", icon: "Mountain", color: "orange" },
  { id: "beach", name: "Beach", icon: "Umbrella", color: "cyan" },
  { id: "cultural", name: "Cultural", icon: "Landmark", color: "purple" },
  { id: "safari", name: "Safari", icon: "Binoculars", color: "amber" },
  { id: "road-trip", name: "Road Trip", icon: "Car", color: "red" },
  { id: "backpacking", name: "Backpacking", icon: "Backpack", color: "lime" },
  { id: "ski", name: "Ski", icon: "Snowflake", color: "sky" },
  { id: "river-cruise", name: "River Cruise", icon: "Sailboat", color: "indigo" },
  { id: "island-hopping", name: "Island Hopping", icon: "Palmtree", color: "teal" },
  { id: "wellness-spa", name: "Wellness/Spa", icon: "Heart", color: "pink" },
];

/** Get a segment type by ID */
export function getSegmentType(id: string): SegmentType | undefined {
  return SEGMENT_TYPES.find((t) => t.id === id);
}

/** Segment type color map for borders, pills, and calendar */
export const SEGMENT_COLOR_MAP: Record<string, string> = {
  blue: "border-blue-500 bg-blue-50 text-blue-700",
  green: "border-green-500 bg-green-50 text-green-700",
  orange: "border-orange-500 bg-orange-50 text-orange-700",
  cyan: "border-cyan-500 bg-cyan-50 text-cyan-700",
  purple: "border-purple-500 bg-purple-50 text-purple-700",
  amber: "border-amber-500 bg-amber-50 text-amber-700",
  red: "border-red-500 bg-red-50 text-red-700",
  lime: "border-lime-500 bg-lime-50 text-lime-700",
  sky: "border-sky-500 bg-sky-50 text-sky-700",
  indigo: "border-indigo-500 bg-indigo-50 text-indigo-700",
  teal: "border-teal-500 bg-teal-50 text-teal-700",
  pink: "border-pink-500 bg-pink-50 text-pink-700",
};

/** Event categories for calendar day events */
export const EVENT_CATEGORIES = [
  { id: "port", name: "Port", color: "blue" },
  { id: "dining", name: "Dining", color: "orange" },
  { id: "excursion", name: "Excursion", color: "green" },
  { id: "onboard", name: "Onboard", color: "purple" },
  { id: "transit", name: "Transit", color: "gray" },
  { id: "other", name: "Other", color: "slate" },
] as const;

/** Duration options in 15-minute increments for event picker */
export const DURATION_OPTIONS = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
  { value: 150, label: "2.5 hours" },
  { value: 180, label: "3 hours" },
  { value: 240, label: "4 hours" },
  { value: 300, label: "5 hours" },
  { value: 360, label: "6 hours" },
  { value: 480, label: "8 hours" },
  { value: 720, label: "12 hours" },
  { value: 1440, label: "Full day" },
];

/** Default currency */
export const DEFAULT_CURRENCY = "CAD";

/** Fallback exchange rate (USD → CAD) when API unavailable */
export const FALLBACK_USD_TO_CAD = 1.36;
