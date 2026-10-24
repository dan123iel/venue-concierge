import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, Navigation, Plus, Save, X } from "lucide-react";
import { Header, Page } from "@/components/rinco/shell";
import { Chip, EmptyState, Headline, IconButton, Img, Label, MapBlock, PrimaryButton, SecondaryButton } from "@/components/rinco/ui";
import { getPlace, type Place } from "@/lib/data";
import { fmtKm, km, mapsUrl } from "@/lib/format";
import { useT } from "@/lib/i18n";
import { newPlan, setState, showToast, updatePlan, useAppState } from "@/lib/store";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Your plan – RINCO®" },
      { name: "description", content: "Put places together into a day out, set the order and open the route." },
      { property: "og:title", content: "Your plan – RINCO®" },
      { property: "og:description", content: "Plan your next day out." },
    ],
  }),
  component: PlanPage,
});

function PlanPage() {
  const { t, lang } = useT();
  const nav = useNavigate();
  const plans = useAppState((s) => s.plans);
  const activeId = useAppState((s) => s.activePlanId);
  const plan = plans.find((p) => p.id === activeId);
  const stops = (plan?.placeIds.map(getPlace).filter(Boolean) ?? []) as Place[];

  if (!plan || stops.length === 0)
    return (
      <>
        <Header />
        <Page>
          <Headline>{t("plan.title")}</Headline>
          <EmptyState title={t("plan.empty")} text={t("plan.emptyText")}>
            <SecondaryButton onClick={() => nav({ to: "/discover" })}>
              {t("plan.discover")}
            </SecondaryButton>
            <SecondaryButton onClick={() => nav({ to: "/inspire" })}>
              {t("plan.guides")}
            </SecondaryButton>
          </EmptyState>
        </Page>
      </>
    );

  const move = (i: number, d: number) =>
    updatePlan(plan.id, (p) => {
      const ids = [...p.placeIds];
      const j = i + d;
      if (j < 0 || j >= ids.length) return p;
      [ids[i], ids[j]] = [ids[j]!, ids[i]!];
      return { ...p, placeIds: ids };
    });

  const totalKm = stops.slice(0, -1).reduce((sum, s, i) => {
    const next = stops[i + 1]!;
    return sum + km([s.lat, s.lng], [next.lat, next.lng]);
  }, 0);

  return (
    <>
      <Header />
      <Page>
        <div className="flex items-start justify-between gap-2">
          <Headline>{t("plan.title")}</Headline>
          {/* Plan selector */}
          <div className="mt-2 flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
            <span className="text-[13px] font-semibold text-foreground max-w-[100px] truncate">{plan.name}</span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </div>
        </div>

        {/* Plan tabs */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {plans.map((p) => (
            <Chip
              key={p.id}
              selected={p.id === plan.id}
              onClick={() => setState(() => ({ activePlanId: p.id }))}
              onDoubleClick={() => {
                const n = prompt(t("plan.rename"), p.name);
                if (n) updatePlan(p.id, (x) => ({ ...x, name: n }));
              }}
            >
              {p.name}
            </Chip>
          ))}
          <Chip onClick={() => newPlan(t("plan.defaultName", { n: plans.length + 1 }))}>
            <Plus className="size-4" aria-hidden /> {t("plan.new")}
          </Chip>
        </div>

        {/* Map */}
        <MapBlock places={stops} numbered height={180} />

        {/* Stats row */}
        <div className="flex items-center gap-4">
          <Label>{t("plan.stops", { n: stops.length })}</Label>
          {totalKm > 0 && (
            <span className="text-[12px] text-muted-foreground">
              ~{fmtKm(lang, totalKm)} {lang === "de" ? "gesamt" : lang === "es" ? "total" : "total"}
            </span>
          )}
        </div>

        {/* Stop list */}
        <ol className="flex flex-col gap-3">
          {stops.map((s, i) => {
            const next = stops[i + 1];
            return (
              <li
                key={s.id}
                className="flex items-center gap-2 rounded-[14px] border-[1.5px] border-border/60 bg-card p-2"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-[12px] font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <Img src={s.image} alt="" className="size-14 shrink-0 rounded-lg" />
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left"
                  onClick={() => nav({ to: "/place/$id", params: { id: s.id } })}
                >
                  <p className="truncate font-extrabold">{s.name}</p>
                  <p className="text-[12px] text-muted-foreground">{s.district} · {"€".repeat(s.price)}</p>
                  {next && (
                    <p className="text-[11px] text-muted-foreground">
                      {t("plan.toNext", { d: fmtKm(lang, km([s.lat, s.lng], [next.lat, next.lng])) })}
                    </p>
                  )}
                </button>
                <div className="flex flex-col">
                  <button
                    type="button"
                    aria-label={t("aria.up")}
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    className="p-1 disabled:opacity-30"
                  >
                    <ChevronUp className="size-5" />
                  </button>
                  <button
                    type="button"
                    aria-label={t("aria.down")}
                    disabled={i === stops.length - 1}
                    onClick={() => move(i, 1)}
                    className="p-1 disabled:opacity-30"
                  >
                    <ChevronDown className="size-5" />
                  </button>
                </div>
                <IconButton
                  label={t("aria.remove")}
                  onClick={() =>
                    updatePlan(plan.id, (p) => ({
                      ...p,
                      placeIds: p.placeIds.filter((x) => x !== s.id),
                    }))
                  }
                >
                  <X className="size-4" />
                </IconButton>
              </li>
            );
          })}
        </ol>

        {/* Add place */}
        <SecondaryButton onClick={() => nav({ to: "/discover" })}>
          <Plus className="size-4" aria-hidden /> {t("plan.addPlace")}
        </SecondaryButton>

        {/* Open in maps */}
        <PrimaryButton onClick={() => window.open(mapsUrl(stops), "_blank", "noopener")}>
          <Navigation className="size-4 mr-1" aria-hidden />
          {t("plan.openMaps")}
        </PrimaryButton>

        {/* Save plan */}
        <SecondaryButton onClick={() => showToast(t("toast.planSaved"))}>
          <Save className="size-4" aria-hidden />
          {t("plan.save")}
        </SecondaryButton>
      </Page>
    </>
  );
}
