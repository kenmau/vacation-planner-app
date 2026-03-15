/** Packing item category */
export type PackingCategory =
  | "clothing"
  | "gear"
  | "documents"
  | "toiletries"
  | "electronics"
  | "cruise-formal"
  | "other";

/** A single packing item */
export interface PackingItem {
  id: string;
  name: string;
  category: PackingCategory;
  quantity: number;
  packed: boolean;
  /** Which traveller this item belongs to */
  travellerId: string;
  /** Whether this was auto-recommended */
  isRecommendation: boolean;
  /** Source segment type that triggered the recommendation */
  recommendedBy?: string;
}

/** Per-traveller packing list */
export interface TravellerPackingList {
  travellerId: string;
  travellerName: string;
  items: PackingItem[];
}
