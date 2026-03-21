"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Backpack, Map, Settings } from "lucide-react";
import { useTripStore } from "@/lib/stores/trip-store";
import { useWizardStore } from "@/lib/stores/wizard-store";

/** Page title mapping */
function getPageTitle(
  pathname: string,
  activeTripName: string | null,
  isEditing: boolean
): string {
  if (pathname === "/" || pathname === "/dashboard") return "Vacation Planner";
  if (pathname.startsWith("/trip-overview")) {
    return activeTripName ?? "Trip Overview";
  }
  if (pathname.startsWith("/wizard")) {
    return isEditing ? "Edit Trip" : "New Trip";
  }
  if (pathname.startsWith("/cruise-browse")) return "Cruise Browse";
  if (pathname.startsWith("/cruise-detail")) return "Cruise Detail";
  if (pathname.startsWith("/cruise-compare")) return "Compare Ships";
  if (pathname.startsWith("/land-activities")) return "Activities";
  if (pathname.startsWith("/accommodations")) return "Accommodations";
  if (pathname.startsWith("/travel")) return "Travel";
  if (pathname.startsWith("/packing")) return "Packing List";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Vacation Planner";
}

/** Whether to show the back button */
function shouldShowBack(pathname: string): boolean {
  return pathname !== "/" && pathname !== "/dashboard";
}

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const activeTripName = useTripStore((s) => s.activeTrip?.name ?? null);
  const isEditing = useWizardStore((s) => s.isEditing);
  const title = getPageTitle(pathname, activeTripName, isEditing);
  const showBack = shouldShowBack(pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-[900px] items-center gap-3 px-4">
        {/* Desktop back button — hidden on mobile */}
        {showBack && (
          <button
            onClick={() => router.back()}
            className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        )}

        {/* Mobile back button */}
        {showBack && (
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        {/* Title */}
        <h1 className="flex-1 text-lg font-semibold truncate">{title}</h1>

        {/* Desktop Trips link */}
        <Link
          href="/"
          className={`hidden lg:flex items-center gap-1.5 text-sm transition-colors ${
            pathname === "/" || pathname === "/dashboard" || pathname.startsWith("/trip-overview") || pathname.startsWith("/wizard") || pathname.startsWith("/cruise") || pathname.startsWith("/land-activities") || pathname.startsWith("/accommodations") || pathname.startsWith("/travel")
              ? "text-foreground font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Map className="h-4 w-4" />
          Trips
        </Link>

        {/* Desktop Pack link */}
        <Link
          href="/packing"
          className={`hidden lg:flex items-center gap-1.5 text-sm transition-colors ${
            pathname.startsWith("/packing")
              ? "text-foreground font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Backpack className="h-4 w-4" />
          Pack
        </Link>

        {/* Settings gear */}
        <Link
          href="/settings"
          className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}
