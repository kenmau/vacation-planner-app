"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Map,
  Backpack,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Trips", icon: Map },
  { href: "/packing", label: "Pack", icon: Backpack },
  { href: "/settings", label: "Settings", icon: Settings },
];

/** Determine which tab href should be active for a given pathname. */
function getActiveTab(pathname: string): string {
  if (pathname.startsWith("/packing")) return "/packing";
  if (pathname.startsWith("/settings")) return "/settings";

  // Everything else is trip-contextual and maps to the "Trips" tab
  // This covers: /, /dashboard, /trip-overview, /wizard-*, /cruise-*, /land-activities, /accommodations, /travel
  return "/";
}

export function BottomNav() {
  const pathname = usePathname();
  const activeTab = getActiveTab(pathname);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background lg:hidden">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === activeTab;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors ${
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
