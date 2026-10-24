import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header, Page } from "@/components/rinco/shell";
import { Chip, Headline, Label, PrimaryButton } from "@/components/rinco/ui";
import { cities } from "@/lib/data";
import { LANGS, useT, type Lang } from "@/lib/i18n";
import { setState, useAppState } from "@/lib/store";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome – RINCO®" },
      { name: "description", content: "Choose your language and city to start with RINCO." },
      { property: "og:title", content: "Welcome – RINCO®" },
      { property: "og:description", content: "Choose your language and city to start with RINCO." },
    ],
  }),
  component: Welcome,
});

const LANG_NAMES: Record<Lang, string> = { en: "English", de: "Deutsch", es: "Español" };

function Welcome() {
  const { t, p, lang } = useT();
  const cityId = useAppState((s) => s.cityId);
  const nav = useNavigate();
  const finish = () => {
    setState(() => ({ onboarded: true, langChosen: true }));
    nav({ to: "/discover" });
  };
  return (
    <>
      <Header />
      <Page className="gap-6">
        <Headline>{t("welcome.title")}</Headline>
        <section className="flex flex-col gap-3">
          <Label>{t("welcome.lang")}</Label>
          <div className="flex flex-wrap gap-2">
            {LANGS.map((l) => (
              <Chip key={l} selected={lang === l} onClick={() => setState(() => ({ lang: l, langChosen: true }))}>
                {LANG_NAMES[l]}
              </Chip>
            ))}
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <Label>{t("welcome.city")}</Label>
          <div className="flex flex-wrap gap-2">
            {cities.map((c) => (
              <Chip key={c.id} selected={cityId === c.id} onClick={() => setState(() => ({ cityId: c.id }))}>
                {p(c.name)}
              </Chip>
            ))}
          </div>
        </section>
        <div className="mt-auto flex flex-col items-center gap-3">
          <PrimaryButton onClick={finish}>{t("welcome.go")}</PrimaryButton>
          <button type="button" onClick={finish} className="min-h-11 text-[14px] font-semibold text-muted-foreground underline">
            {t("welcome.skip")}
          </button>
        </div>
      </Page>
    </>
  );
}
