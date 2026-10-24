import { createFileRoute, notFound, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Clock, Heart, MapPin } from "lucide-react";
import { Header, Page } from "@/components/rinco/shell";
import {
  AddButton,
  Chip,
  Headline,
  IconButton,
  Img,
  Label,
  PrimaryButton,
  SampleBadge,
  SecondaryButton,
  TrustRow,
} from "@/components/rinco/ui";
import { getCity, getPlace } from "@/lib/data";
import { priceLabel, todayHours, isOpenNow } from "@/lib/format";
import { useT } from "@/lib/i18n";
import { addToPlan, showToast, toggleSaved, isSaved, getState, useAppState } from "@/lib/store";

export const Route = createFileRoute("/place/$id")({
  loader: ({ params }) => {
    const p = getPlace(params.id);
    if (!p) throw notFound();
    return { name: p.name, description: p.description.en };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} – RINCO®` : "Place – RINCO®" },
      { name: "description", content: loaderData?.description ?? "A curated place by RINCO." },
    ],
  }),
  component: PlacePage,
});

function PlacePage() {
  const { id } = Route.useParams();
  const { t, p, lang } = useT();
  const router = useRouter();
  const nav = useNavigate();
  const place = getPlace(id)!;
  const saved = useAppState((s) => isSaved(s, id));
  const city = getCity(place.cityId);
  const open = isOpenNow(place, city.tz);
  const hoursToday = todayHours(place, city.tz);

  const handleAddToPlan = () => {
    const added = addToPlan(id, (n) => t("plan.defaultName", { n }));
    showToast(added ? t("toast.added") : t("toast.already"));
  };

  const handleSave = () => {
    const nowSaved = toggleSaved(id);
    showToast(nowSaved ? t("toast.saved") : t("toast.unsaved"));
  };

  return (
    <>
      <div className="relative h-64">
        <Img src={place.image} alt={place.name} className="size-full" />
        <div className="absolute inset-0 bg-photo-overlay" />
        <div className="absolute inset-x-4 top-4 flex justify-between">
          <IconButton
            label={t("aria.back")}
            variant="photo"
            onClick={() => router.history.back()}
          >
            <ArrowLeft className="size-5" />
          </IconButton>
          <IconButton
            label={saved ? t("toast.unsaved") : t("place.save")}
            variant="photo"
            onClick={handleSave}
          >
            <Heart className={`size-5 ${saved ? "fill-white" : ""}`} />
          </IconButton>
        </div>
        {place.badge && (
          <span className="absolute bottom-4 left-4 rounded-full bg-gradient-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            {place.badge}
          </span>
        )}
      </div>

      <Page className="pt-4">
        <div>
          <p className="label-caps text-primary mb-1">
            {place.district} · {place.type.toUpperCase()}
          </p>
          <Headline className="text-[clamp(32px,9vw,44px)]">{place.name}</Headline>
        </div>

        <p className="text-[15px] text-muted-foreground">{p(place.description)}</p>

        <div className="flex flex-wrap gap-2">
          {place.tags.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
          {place.isSample && <SampleBadge />}
        </div>

        <Label>{t("place.whyTitle")}</Label>
        <p className="text-[15px] text-foreground">{p(place.whyWeRecommend)}</p>

        <Label>{t("place.goodToKnow")}</Label>
        <div className="flex flex-col gap-3">
          <TrustRow icon={<MapPin className="size-4" />}>
            {place.address}
          </TrustRow>
          <TrustRow icon={<Clock className="size-4" />}>
            {hoursToday ?? "—"} ·{" "}
            <span className={open ? "text-green-600" : "text-red-500"}>
              {open ? t("place.open") : t("place.closed")}
            </span>
          </TrustRow>
          <TrustRow icon={<span className="text-[13px] font-bold">{"€".repeat(place.price)}</span>}>
            {priceLabel(city, place.price)} · {place.distanceKm} km
          </TrustRow>
        </div>

        <div className="flex gap-3">
          <SecondaryButton onClick={handleSave} className="flex-1">
            {saved ? "♥ Saved" : t("place.save")}
          </SecondaryButton>
          <SecondaryButton
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`, "_blank", "noopener")}
            className="flex-1"
          >
            {t("place.route")}
          </SecondaryButton>
        </div>

        <PrimaryButton onClick={handleAddToPlan}>{t("place.addToPlan")}</PrimaryButton>

        <p className="text-center text-[12px] text-muted-foreground">
          {t("place.source")} ·{" "}
          <button type="button" className="underline" onClick={() => showToast("Danke für dein Feedback!")}>
            {t("place.report")}
          </button>
        </p>
      </Page>
    </>
  );
}
