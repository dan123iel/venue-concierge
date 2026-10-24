import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { Page } from "@/components/rinco/shell";
import { Chip, GuideCard, Headline, IconButton, Label, PlaceRow } from "@/components/rinco/ui";
import { MOODS } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { filterPlaces, searchGuides } from "@/lib/search";
import { emptyResults, setResults, useAppState } from "@/lib/store";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search – RINCO®" },
      { name: "description", content: "Search places and guides by mood, food or neighborhood." },
      { property: "og:title", content: "Search – RINCO®" },
      { property: "og:description", content: "Search places and guides by mood." },
    ],
  }),
  component: SearchPage,
});

type Scope = "all" | "places" | "guides";

function SearchPage() {
  const { t } = useT();
  const nav = useNavigate();
  const router = useRouter();
  const cityId = useAppState((s) => s.cityId);
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<Scope>("all");
  const places = q ? filterPlaces(cityId, { ...emptyResults, query: q }) : [];
  const guides = q ? searchGuides(cityId, q) : [];
  const submit = () => {
    if (!q.trim()) return;
    setResults(() => ({ ...emptyResults, query: q.trim() }));
    nav({ to: "/discover/results" });
  };
  return (
    <>
      <div className="flex justify-end px-4 pt-4">
        <IconButton label={t("aria.close")} onClick={() => router.history.back()}>
          <X className="size-5" />
        </IconButton>
      </div>
      <Page>
        <Headline className="text-[clamp(36px,11vw,52px)]">{t("search.title")}</Headline>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex items-end gap-2 rounded-[26px] border-[1.5px] border-magenta bg-card p-2 pl-4"
        >
          <textarea
            autoFocus
            rows={2}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search.placeholder")}
            aria-label={t("search.placeholder")}
            className="min-h-12 flex-1 resize-none bg-transparent py-2 text-[16px] outline-none placeholder:text-muted-foreground"
          />
          <IconButton type="submit" label={t("search.send")} variant="primary">
            <ArrowRight className="size-5" />
          </IconButton>
        </form>
        <div className="flex flex-wrap gap-2">
          {(["all", "places", "guides"] as Scope[]).map((s) => (
            <Chip key={s} selected={scope === s} onClick={() => setScope(s)}>
              {t(`search.scope.${s}`)}
            </Chip>
          ))}
        </div>
        {!q && (
          <>
            <Label>{t("search.suggestions")}</Label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <Chip key={m} onClick={() => setQ(t(`mood.${m}` as Parameters<typeof t>[0]))}>
                  {t(`mood.${m}` as Parameters<typeof t>[0])}
                </Chip>
              ))}
            </div>
          </>
        )}
        {q && places.length + guides.length === 0 && <p className="text-muted-foreground">{t("search.noResults")}</p>}
        {scope !== "guides" && places.length > 0 && (
          <section className="flex flex-col gap-3">
            <Label>{t("search.scope.places")}</Label>
            {places.map((p) => <PlaceRow key={p.id} place={p} />)}
          </section>
        )}
        {scope !== "places" && guides.length > 0 && (
          <section className="flex flex-col gap-3">
            <Label>{t("search.scope.guides")}</Label>
            {guides.map((g) => <GuideCard key={g.id} guide={g} />)}
          </section>
        )}
      </Page>
    </>
  );
}
