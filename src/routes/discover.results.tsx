import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header, Page } from "@/components/rinco/shell";
import { Chip, EmptyState, Headline, Label, PlaceRow, SecondaryButton } from "@/components/rinco/ui";
import { guides, MOODS, places } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { filterPlaces } from "@/lib/search";
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
  const filtered = filterPlaces(cityId, results);

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
        {filtered.length === 0 ? (
          <EmptyState title={t("results.noResults")} text={t("results.noResultsText")}>
            <SecondaryButton onClick={() => nav({ to: "/discover" })}>
              {t("nf.back")}
            </SecondaryButton>
          </EmptyState>
        ) : (
          <ul className="flex flex-col gap-3">
            {filtered.map((p) => (
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
