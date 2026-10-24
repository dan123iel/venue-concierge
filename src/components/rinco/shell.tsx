import { Link, useLocation } from "@tanstack/react-router";
import { Search, User } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAppState } from "@/lib/store";
import { useT } from "@/lib/i18n";
import "@/styles.css";

export function Logo() {
  return (
    <Link to="/discover" className="text-xl font-extrabold tracking-tight text-foreground">
      RINCO<sup className="text-xs">®</sup>
    </Link>
  );
}

export function Header() {
  const { t } = useT();
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <Logo />
      <div className="flex gap-2">
        <Link
          to="/search"
          aria-label={t("aria.search")}
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card"
        >
          <Search className="size-[18px] text-foreground" />
        </Link>
        <Link
          to="/profile"
          aria-label={t("profile.title")}
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card"
        >
          <User className="size-[18px] text-foreground" />
        </Link>
      </div>
    </div>
  );
}

const TABS = [
  { to: "/discover" as const, labelKey: "tab.discover" as const },
  { to: "/inspire" as const, labelKey: "tab.inspire" as const },
  { to: "/plan" as const, labelKey: "tab.plan" as const },
];

export function TabBar() {
  const { t } = useT();
  const location = useLocation();
  if (location.pathname === "/welcome") return null;

  return (
    <nav className="pb-safe shrink-0 border-t-2 border-border bg-background">
      <div className="flex">
        {TABS.map(({ to, labelKey }) => {
          const active = location.pathname.startsWith(to) || (to === "/discover" && location.pathname === "/");
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors",
                active ? "text-foreground" : "text-foreground/60",
              )}
            >
              {active && (
                <span className="h-0.5 w-6 rounded-full bg-gradient-primary" />
              )}
              {t(labelKey)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Toast() {
  const toast = useAppState((s) => s.toast);
  if (!toast) return null;
  return (
    <div
      key={toast.id}
      className="pointer-events-none absolute inset-x-4 bottom-24 z-50 flex items-center justify-center"
    >
      <div className="rounded-full bg-foreground px-5 py-2.5 text-[13px] font-semibold text-background shadow-lg">
        {toast.text}
      </div>
    </div>
  );
}

export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="h-dvh bg-muted md:flex md:items-center md:justify-center md:py-6">
      <div className="relative mx-auto flex h-full w-full max-w-[480px] flex-col overflow-hidden bg-background md:h-[calc(100dvh-3rem)] md:rounded-[28px] md:shadow-frame">
        <div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
        <TabBar />
        <Toast />
      </div>
    </div>
  );
}

export function Page({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={cn("flex flex-1 flex-col gap-4 px-4 pb-8", className)}>
      {children}
    </main>
  );
}
