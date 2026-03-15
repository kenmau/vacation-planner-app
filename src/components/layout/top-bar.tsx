"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Backpack, Settings } from "lucide-react";

/** Page title mapping */
function getPageTitle(pathname: string): string {
  if (pathname === "/" || pathname === "/dashboard") return "Vacation Planner";
  if (pathname.startsWith("/trip-overview")) return "Trip Overview";
  if (pathname.startsWith("/cruise-browse")) return "Cruise Browse";
  if (pathname.startsWith("/cruise-detail")) return "Cruise Detail";
  if (pathname.startsWith("/cruise-compare")) return "Compare Ships";
  if (pathname.startsWith("/land-activities")) return "Activities";
  if (pathname.startsWith("/accommodations")) return "Accommodations";
  if (pathname.startsWith("/travel")) return "Travel";
  if (pathname.startsWith("/packing")) return "Packing List";
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/wizard")) return "New Trip";
  return "Vacation Planner";
}

/** Whether to show the back button on mobile */
function shouldShowBack(pathname: string): boolean {
  return pathname !== "/" && pathname !== "/dashboard";
}

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const title = getPageTitle(pathname);
  const showBack = shouldShowBack(pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-[900px] items-center gap-3 px-4">
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
