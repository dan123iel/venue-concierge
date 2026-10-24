import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Outlet,
  Scripts,
  useNavigate,
  createRootRouteWithContext,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import { AppFrame, Header, Page } from "@/components/rinco/shell";
import { EmptyState, SecondaryButton } from "@/components/rinco/ui";
import { useT } from "@/lib/i18n";

function NotFoundComponent() {
  const { t } = useT();
  const nav = useNavigate();
  return (
    <>
      <Header />
      <Page>
        <EmptyState title={t("nf.title")} text={t("nf.text")}>
          <SecondaryButton onClick={() => nav({ to: "/discover" })}>
            {t("nf.back")}
          </SecondaryButton>
        </EmptyState>
      </Page>
    </>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  useEffect(() => {
    reportLovableError(error, { boundary: "root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => reset()}
            className="rounded-full bg-gradient-primary px-5 py-2 text-sm font-bold text-white"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-border bg-card px-5 py-2 text-sm font-bold text-foreground"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#F5EFE6" },
      { title: "RINCO® – Your personal city guide" },
      { name: "description", content: "Curated places for food, drinks and culture. Discover, get inspired, plan your day out." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,900&family=Inter:ital,opsz,wght@0,14..32,400..800;1,14..32,400..800&display=swap",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <AppFrame>
            <Outlet />
          </AppFrame>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
