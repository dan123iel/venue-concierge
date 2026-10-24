import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header, Page } from "@/components/rinco/shell";
import { Chip, GuideCard, Headline, Label } from "@/components/rinco/ui";
import { guides } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { useAppState } from "@/lib/store";

const THEMES = ["food", "culture", "nightlife", "local"] as const;

export const Route = createFileRoute("/inspire/")({
  head: () => ({
    meta: [
      { title: "Inspire – RINCO®" },
      { name: "description", content: "Curated guides for your city. Real places, local perspectives." },
    ],
  }),
  component: InspirePage,
});

function InspirePage() {
  const { t } = useT();
  const cityId = useAppState((s) => s.cityId);
  const [theme, setTheme] = useState<string | null>(null);
  const cityGuides = guides.filter(
    (g) => g.cityId === cityId && (!theme || g.theme === theme),
  );

  return (
    <>
      <Header />
      <Page>
        <Headline>{t("inspire.title")}</Headline>
        <p className="text-[15px] text-muted-foreground">{t("inspire.intro")}</p>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((th) => (
            <Chip
              key={th}
              selected={theme === th}
              onClick={() => setTheme(theme === th ? null : th)}
            >
              {t(`theme.${th}` as any)}
            </Chip>
          ))}
        </div>
        <Label>
          {cityGuides.length} guide{cityGuides.length !== 1 ? "s" : ""}
        </Label>
        <ul className="flex flex-col gap-3">
          {cityGuides.map((g) => (
            <li key={g.id}>
              <GuideCard guide={g} />
            </li>
          ))}
        </ul>
      </Page>
    </>
  );
}
