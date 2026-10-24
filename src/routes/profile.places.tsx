import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import { Page } from "@/components/rinco/shell";
import { EmptyState, Headline, IconButton, Label, PlaceRow, SecondaryButton } from "@/components/rinco/ui";
import { places } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { showToast, toggleSaved, useAppState } from "@/lib/store";

export const Route = createFileRoute("/profile/places")({
  head: () => ({
    meta: [{ title: "Saved Places – RINCO®" }],
  }),
  component: ProfilePlacesPage,
});

function ProfilePlacesPage() {
  const { t } = useT();
  const router = useRouter();
  const nav = useNavigate();
  const collections = useAppState((s) => s.collections);
  const savedIds = collections.flatMap((c) => c.placeIds);
  const savedPlaces = places.filter((p) => savedIds.includes(p.id));

  function handleRemove(id: string, name: string) {
    toggleSaved(id);
    showToast(t("toast.unsaved"));
  }

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-4">
        <IconButton label={t("aria.back")} onClick={() => router.history.back()}>
          <ArrowLeft className="size-5" />
        </IconButton>
        <h1 className="font-extrabold text-foreground text-lg">{t("profile.places")}</h1>
      </div>
      <Page>
        {savedPlaces.length === 0 ? (
          <EmptyState title={t("profile.saved")} text="Places you save will appear here.">
            <SecondaryButton onClick={() => nav({ to: "/discover" })}>
              {t("plan.discover")}
            </SecondaryButton>
          </EmptyState>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <Label>
                {t("profile.placesCount", { n: savedPlaces.length })}
              </Label>
              <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <Heart className="size-3 fill-current text-primary" />
                <span>{t("profile.saved")}</span>
              </div>
            </div>
            <ul className="flex flex-col gap-3">
              {savedPlaces.map((p) => (
                <li key={p.id} className="relative">
                  <PlaceRow
                    place={p}
                    action={
                      <button
                        type="button"
                        aria-label={t("aria.remove")}
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(p.id, p.name);
                        }}
                        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-red-300 hover:text-red-500"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    }
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </Page>
    </>
  );
}
