"use client";

import { TopBar } from "./top-bar";
import { BottomNav } from "./bottom-nav";

interface AppShellProps {
  children: React.ReactNode;
}

/** App shell with top bar, content area, and mobile bottom nav */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <main className="flex-1 mx-auto w-full max-w-[900px] px-4 pb-20 lg:pb-6 pt-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
