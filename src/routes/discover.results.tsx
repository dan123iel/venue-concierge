import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header, Page } from "@/components/rinco/shell";
import { Chip, EmptyState, Headline, PlaceRow, SecondaryButton } from "@/components/rinco/ui";
import { useT } from "@/lib/i18n";
import { fetchPlaces } from "@/lib/supabase";
import { useAppState } from "@/lib/store";

export const Route = createFileRoute("/discover/results")({
  head: () => ({
    meta: [{ title: "Results – RINCO®" }],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const { t } = useT();
  const nav = useNavigate();
  const cityId = useAppState((s) => s.cityId);
  const results = useAppState((s) => s.results);

  const { data: places = [], isLoading, isError } = useQuery({
    queryKey: ["places", cityId, results.mood, results.category, results.prices, results.attrs, results.query],
    queryFn: () =>
      fetchPlaces({
        mood: results.mood ?? undefined,
        category: results.category,
        prices: results.prices,
        vegan: results.attrs.includes("Vegan"),
        query: results.query ?? undefined,
        limit: 40,
      }),
    staleTime: 60_000,
  });

  return (
    <>
      <Header />
      <Page>
        <Headline className="text-[clamp(36px,10vw,48px)]">{t("results.title")}</Headline>
        {results.mood && (
          <div className="flex flex-wrap gap-2">
            <Chip selected>{t(`mood.${results.mood}` as any)}</Chip>
          </div>
        )}
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-[16px] bg-muted" />
            ))}
          </div>
        ) : isError ? (
          <EmptyState title={t("results.noResults")} text={t("results.noResultsText")}>
            <SecondaryButton onClick={() => nav({ to: "/discover" })}>
              {t("nf.back")}
            </SecondaryButton>
          </EmptyState>
        ) : places.length === 0 ? (
          <EmptyState title={t("results.noResults")} text={t("results.noResultsText")}>
            <SecondaryButton onClick={() => nav({ to: "/discover" })}>
              {t("nf.back")}
            </SecondaryButton>
          </EmptyState>
        ) : (
          <ul className="flex flex-col gap-3">
            {places.map((p) => (
              <li key={p.id}>
                <PlaceRow place={p} />
              </li>
            ))}
          </ul>
        )}
      </Page>
    </>
  );
}
