import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { CityChip } from "@/components/rinco/city-chip";
import { Header, Page } from "@/components/rinco/shell";
import { Chip, Headline, Img, Label, PrimaryButton, SampleBadge, SecondaryButton } from "@/components/rinco/ui";
import { DIETARY, getCity, guides, MOODS, VIBES } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { emptyResults, setResults, useAppState } from "@/lib/store";

export const Route = createFileRoute("/discover/")({
  head: () => ({
    meta: [
      { title: "Discover – RINCO®" },
      { name: "description", content: "Curated recommendations for food, drinks, culture and local spots in your city." },
      { property: "og:title", content: "Discover – RINCO®" },
      { property: "og:description", content: "Curated recommendations for food, drinks, culture and local spots." },
    ],
  }),
  component: Discover,
});

const PRICE_LEVELS = [1, 2, 3, 4];
const EXTRAS_KEYS = ["filter.outdoorSeating", "filter.reservations", "filter.groups", "filter.wheelchair"] as const;

function FilterSheet({ onClose }: { onClose: () => void }) {
  const { t } = useT();
  const results = useAppState((s) => s.results);

  const [dietary, setDietary] = useState<string[]>(results.attrs.filter((a) => DIETARY.includes(a)));
  const [vibes, setVibes] = useState<string[]>(results.vibes);
  const [prices, setPrices] = useState<number[]>(results.prices);
  const [extras, setExtras] = useState<string[]>(results.attrs.filter((a) => !DIETARY.includes(a)));

  function toggle<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
  }

  function handleApply() {
    setResults(() => ({ attrs: [...dietary, ...extras], vibes, prices }));
    onClose();
  }

  function handleReset() {
    setDietary([]);
    setVibes([]);
    setPrices([]);
    setExtras([]);
  }

  const activeCount = dietary.length + vibes.length + prices.length + extras.length;

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5">
        <h2 className="font-display text-[32px] text-foreground">{t("filter.title")}</h2>
        <button
          type="button"
          aria-label={t("aria.close")}
          onClick={onClose}
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-5">
        {/* Dietary */}
        <div>
          <Label className="mb-3">{t("filter.dietary")}</Label>
          <div className="flex flex-wrap gap-2">
            {DIETARY.map((d) => (
              <Chip
                key={d}
                selected={dietary.includes(d)}
                onClick={() => setDietary(toggle(dietary, d))}
              >
                {t(`dietary.${d}` as Parameters<typeof t>[0])}
              </Chip>
            ))}
          </div>
        </div>

        {/* Atmosphere */}
        <div>
          <Label className="mb-3">{t("filter.atmosphere")}</Label>
          <div className="flex flex-wrap gap-2">
            {VIBES.map((v) => (
              <Chip
                key={v}
                selected={vibes.includes(v)}
                onClick={() => setVibes(toggle(vibes, v))}
              >
                {t(`vibe.${v}` as Parameters<typeof t>[0])}
              </Chip>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <Label className="mb-3">{t("filter.price")}</Label>
          <div className="flex gap-2">
            {PRICE_LEVELS.map((p) => (
              <Chip
                key={p}
                selected={prices.includes(p)}
                onClick={() => setPrices(toggle(prices, p))}
              >
                {"€".repeat(p)}
              </Chip>
            ))}
          </div>
        </div>

        {/* Additional / Extras */}
        <div>
          <Label className="mb-1">{t("filter.additional")}</Label>
          <div className="flex flex-col">
            {EXTRAS_KEYS.map((key) => {
              const val = t(key);
              const on = extras.includes(val);
              return (
                <div key={key} className="flex items-center justify-between border-b border-border py-3.5 last:border-0">
                  <span className="text-[15px] text-foreground">{val}</span>
                  <button
                    type="button"
                    aria-label={val}
                    onClick={() => setExtras(toggle(extras, val))}
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
                      on ? "bg-gradient-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute left-1 size-5 rounded-full bg-white shadow transition-transform ${
                        on ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-4 pb-6 pt-3 flex flex-col gap-3 border-t border-border bg-background">
        <PrimaryButton onClick={handleApply}>{t("filter.apply")}</PrimaryButton>
        <button
          type="button"
          onClick={handleReset}
          className="text-[14px] font-semibold underline text-foreground"
        >
          {t("filter.reset")}
        </button>
      </div>
    </div>
  );
}

function Discover() {
  const { t, p } = useT();
  const nav = useNavigate();
  const cityId = useAppState((s) => s.cityId);
  const results = useAppState((s) => s.results);
  const city = getCity(cityId);
  const cityGuides = guides.filter((g) => g.cityId === cityId).slice(0, 3);
  const [filterOpen, setFilterOpen] = useState(false);

  const activeFilterCount =
    results.attrs.length + results.vibes.length + results.prices.length;

  return (
    <>
      {filterOpen && <FilterSheet onClose={() => setFilterOpen(false)} />}
      <div aria-hidden className="bg-blob pointer-events-none absolute -top-24 -right-24 size-72 rounded-full opacity-35 blur-2xl" />
      <Header />
      <Page>
        <CityChip />
        <Headline>{t("discover.title")}</Headline>
        <p className="text-[16px] text-muted-foreground">{t("discover.intro")}</p>
        <p className="text-[12px] text-muted-foreground">{t("pilot.areas", { areas: city.pilotAreas.join(", ") })}</p>

        {/* Search bar */}
        <button
          type="button"
          onClick={() => nav({ to: "/search" })}
          className="flex min-h-14 items-center gap-3 rounded-[26px] border-[1.5px] border-magenta bg-card px-5 text-left text-[16px] text-muted-foreground"
        >
          <Search className="size-5 text-magenta" aria-hidden />
          {t("search.placeholder")}
        </button>

        {/* Category + Filter row */}
        <div className="flex items-center gap-2 flex-wrap">
          <Chip
            selected={results.category === "all"}
            onClick={() => {
              setResults(() => ({ ...emptyResults, category: "all" }));
              nav({ to: "/discover/results" });
            }}
          >
            All
          </Chip>
          <Chip
            selected={results.category === "food"}
            onClick={() => {
              setResults((r) => ({ ...emptyResults, category: "food" }));
              nav({ to: "/discover/results" });
            }}
          >
            {t("theme.food")}
          </Chip>
          <Chip
            selected={results.category === "culture"}
            onClick={() => {
              setResults((r) => ({ ...emptyResults, category: "culture" }));
              nav({ to: "/discover/results" });
            }}
          >
            {t("theme.culture")}
          </Chip>
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-[13px] font-semibold transition-colors ${
              activeFilterCount > 0
                ? "border-transparent bg-gradient-primary text-white"
                : "border-border bg-card text-foreground"
            }`}
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            {activeFilterCount > 0
              ? t("filter.active", { n: activeFilterCount })
              : t("results.filter")}
          </button>
        </div>

        <Label>{t("section.popularGuides")}</Label>
        <div className="grid grid-cols-3 gap-2">
          {cityGuides.map((g) => (
            <Link key={g.id} to="/inspire/guide/$id" params={{ id: g.id }} className="flex flex-col gap-1.5">
              <Img src={g.image} alt="" className="aspect-[4/3.3] w-full rounded-[12px]" />
              <span className="text-[13px] leading-tight font-bold">{p(g.title)}</span>
            </Link>
          ))}
        </div>

        <Label>{t("section.moods")}</Label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <Chip
              key={m}
              onClick={() => {
                setResults(() => ({ ...emptyResults, mood: m }));
                nav({ to: "/discover/results" });
              }}
            >
              {t(`mood.${m}` as Parameters<typeof t>[0])}
            </Chip>
          ))}
        </div>
        <SampleBadge className="w-fit" />
      </Page>
    </>
  );
}
