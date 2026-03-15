import type { Meta } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface MockBadgeProps {
  meta: Meta;
  className?: string;
}

/** Renders Mock (yellow) / Verified (blue) / Live (green) badges from _meta */
export function MockBadge({ meta, className }: MockBadgeProps) {
  switch (meta.source) {
    case "mock":
      return (
        <Badge variant="outline" className={`border-amber-400 bg-amber-50 text-amber-700 ${className ?? ""}`}>
          Mock
        </Badge>
      );
    case "manual":
      return (
        <Badge variant="outline" className={`border-blue-400 bg-blue-50 text-blue-700 ${className ?? ""}`}>
          Verified &middot; {meta.lastUpdated}
        </Badge>
      );
    case "live":
      return (
        <Badge variant="outline" className={`border-green-400 bg-green-50 text-green-700 ${className ?? ""}`}>
          Live
        </Badge>
      );
  }
}
