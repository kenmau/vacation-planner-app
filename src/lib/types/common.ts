/** Data source tier — drives badge rendering */
export type DataSource = "mock" | "manual" | "live";

/** Every data record must include _meta */
export interface Meta {
  source: DataSource;
  lastUpdated: string; // ISO date string
  updatedBy: "claude" | "manual" | "api";
}

/** Price with original currency */
export interface Price {
  amount: number;
  currency: string;
}

/** Star rating (0–5) */
export type Rating = number;

/** Physical activity level */
export type PhysicalLevel = "easy" | "moderate" | "challenging" | "extreme";

/** Image placeholder */
export interface ImageRef {
  url: string;
  alt: string;
}
