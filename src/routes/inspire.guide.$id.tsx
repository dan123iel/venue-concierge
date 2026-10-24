import { createFileRoute, notFound, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Search } from "lucide-react";
import { Page } from "@/components/rinco/shell";
import { AddButton, Chip, IconButton, Label, PlaceRow, PrimaryButton, SampleBadge } from "@/components/rinco/ui";
import { getGuide, getPlace, type Place } from "@/lib/data";
import { useT } from "@/lib/i18n";
import { addToPlan, showToast } from "@/lib/store";

export const Route = createFileRoute("/inspire/guide/$id")({
  loader: ({ params }) => {
    const g = getGuide(params.id);
    if (!g) throw notFound();
    return { title: g.title.en, intro: g.intro.en };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} – RINCO®` : "Guide – RINCO®" },
      { name: "description", content: loaderData?.intro ?? "A local guide by RINCO." },
      { property: "og:title", content: loaderData ? `${loaderData.title} – RINCO®` : "Guide – RINCO®" },
      { property: "og:description", content: loaderData?.intro ?? "A local guide by RINCO." },
    ],
  }),
  component: GuidePage,
});

function GuidePage() {
  const { id } = Route.useParams();
  const { t, p } = useT();
  const nav = useNavigate();
  const router = useRouter();
  const g = getGuide(id)!;
  const ps = g.placeIds.map(getPlace).filter(Boolean) as Place[];
  const name = (n: number) => t("plan.defaultName", { n });
  const add = (pid: string) => showToast(addToPlan(pid, name) ? t("toast.added") : t("toast.already"));
  return (
    <>
      <div className="relative h-64">
        <img src={g.image} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 bg-photo-overlay" />
        <div className="absolute inset-x-4 top-4 flex justify-between">
          <IconButton label={t("aria.back")} variant="photo" onClick={() => router.history.back()}>
            <ArrowLeft className="size-5" />
          </IconButton>
          <IconButton label={t("aria.search")} variant="photo" onClick={() => nav({ to: "/search" })}>
            <Search className="size-5" />
          </IconButton>
        </div>
      </div>
      <Page className="pt-4">
        <Label>{t("guide.label")}</Label>
        <h1 className="font-display text-[clamp(38px,11vw,52px)] text-foreground">{p(g.title)}</h1>
        <p className="text-[16px] text-muted-foreground">{p(g.intro)}</p>
        <div className="flex flex-wrap gap-2">
          <Chip>{t(`theme.${g.theme}`)}</Chip>
          {g.isSample && <SampleBadge />}
        </div>
        <Label>{t("guide.related")}</Label>
        <ul className="flex flex-col gap-3">
          {ps.map((pl) => (
            <li key={pl.id}>
              <PlaceRow place={pl} action={<AddButton onClick={() => add(pl.id)} />} />
            </li>
          ))}
        </ul>
        <div className="sticky bottom-20 pt-2">
          <PrimaryButton
            onClick={() => {
              const n = ps.filter((pl) => addToPlan(pl.id, name)).length;
              showToast(t("toast.allAdded", { n }));
            }}
          >
            {t("guide.addAll")}
          </PrimaryButton>
        </div>
      </Page>
    </>
  );
}
