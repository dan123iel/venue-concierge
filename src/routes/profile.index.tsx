import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Globe, MapPin, Plus, Settings, Info } from "lucide-react";
import { Header, Page } from "@/components/rinco/shell";
import { Chip, Headline, Img, Label, PrimaryButton } from "@/components/rinco/ui";
import { places } from "@/lib/data";
import { LANGS, type Lang, useT } from "@/lib/i18n";
import { setState, useAppState } from "@/lib/store";

export const Route = createFileRoute("/profile/")({
  head: () => ({
    meta: [{ title: "Profile – RINCO®" }],
  }),
  component: ProfilePage,
});

const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  de: "Deutsch",
  es: "Español",
};

function ProfileRow({
  icon,
  label,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-border py-4 last:border-0 text-left"
    >
      <span className="text-primary">{icon}</span>
      <span className="flex-1 font-semibold text-foreground">{label}</span>
      {value && <span className="text-[14px] text-muted-foreground">{value}</span>}
      <ChevronRight className="size-4 text-muted-foreground" />
    </button>
  );
}

function ProfilePage() {
  const { t } = useT();
  const nav = useNavigate();
  const collections = useAppState((s) => s.collections);
  const lang = useAppState((s) => s.lang);
  const savedCount = collections.reduce((sum, c) => sum + c.placeIds.length, 0);

  const firstPreview = collections[0]?.placeIds
    .slice(0, 1)
    .map((id) => places.find((p) => p.id === id))
    .filter(Boolean)[0];

  return (
    <>
      <Header />
      <Page>
        <Headline>{t("profile.title")}</Headline>

        {/* My Places / Collections */}
        <button
          type="button"
          onClick={() => nav({ to: "/profile/places" })}
          className="flex items-center gap-4 rounded-[20px] border-[1.5px] border-border bg-card p-4 text-left w-full"
        >
          {firstPreview ? (
            <Img src={firstPreview.image} alt="" className="size-16 shrink-0 rounded-[12px]" />
          ) : (
            <div className="size-16 shrink-0 rounded-[12px] bg-muted flex items-center justify-center">
              <MapPin className="size-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-foreground">{t("profile.myPlaces")}</p>
            <p className="text-[13px] text-muted-foreground">
              {t("profile.collectionsCount", { n: collections.length })} · {savedCount} {savedCount === 1 ? "place" : "places"}
            </p>
          </div>
          <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
        </button>

        {/* Collections list */}
        {collections.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>{t("profile.collections")}</Label>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-full border border-border bg-card"
                onClick={() => {
                  const name = prompt(t("profile.collections"));
                  if (name) {
                    import("@/lib/store").then(({ createCollection }) => createCollection(name));
                  }
                }}
              >
                <Plus className="size-4" />
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              {collections.map((col) => {
                const preview = col.placeIds
                  .slice(0, 1)
                  .map((id) => places.find((p) => p.id === id))
                  .filter(Boolean)[0];
                return (
                  <li key={col.id}>
                    <button
                      type="button"
                      onClick={() => nav({ to: "/profile/places" })}
                      className="flex w-full items-center gap-3 rounded-[16px] border border-border bg-card p-3 text-left"
                    >
                      {preview ? (
                        <Img src={preview.image} alt="" className="size-12 shrink-0 rounded-[8px]" />
                      ) : (
                        <div className="size-12 shrink-0 rounded-[8px] bg-muted" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground truncate">
                          {col.name || t("profile.favorites")}
                        </p>
                        <p className="text-[12px] text-muted-foreground">
                          {t("profile.placesCount", { n: col.placeIds.length })}
                        </p>
                      </div>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Language */}
        <div>
          <Label className="mb-3">{t("profile.lang")}</Label>
          <div className="flex gap-2 flex-wrap">
            {LANGS.map((l) => (
              <Chip
                key={l}
                selected={l === lang}
                onClick={() => setState(() => ({ lang: l, langChosen: true }))}
              >
                {LANG_LABELS[l]}
              </Chip>
            ))}
          </div>
        </div>

        {/* Settings rows */}
        <div className="rounded-[16px] border border-border bg-card px-4">
          <ProfileRow
            icon={<Globe className="size-[18px]" />}
            label={t("profile.settings")}
            onClick={() => {}}
          />
          <ProfileRow
            icon={<Info className="size-[18px]" />}
            label={t("profile.about")}
            onClick={() => {}}
          />
        </div>

        {/* Account CTA */}
        <div className="rounded-[16px] border-[1.5px] border-border bg-card p-5 flex flex-col gap-3">
          <p className="font-bold text-foreground">{t("profile.account")}</p>
          <p className="text-[14px] text-muted-foreground">{t("profile.accountText")}</p>
          <PrimaryButton onClick={() => {}}>{t("profile.createAccount")}</PrimaryButton>
        </div>
      </Page>
    </>
  );
}
