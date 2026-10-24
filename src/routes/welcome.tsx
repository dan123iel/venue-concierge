import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { setState } from "@/lib/store";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "RINCO® – Find Your Favorite Place" },
      { name: "description", content: "Curated places. Real people. Local perspectives." },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const nav = useNavigate();
  const { t } = useT();
  const finish = () => {
    setState(() => ({ onboarded: true, langChosen: true }));
    nav({ to: "/discover" });
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black">
      {/* Hero image */}
      <img
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center opacity-80"
      />

      {/* Dark gradient overlay bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Header */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-5 pt-12">
        <span className="font-display text-[22px] font-black tracking-tight text-white">
          RINCO<sup className="text-[13px]">®</sup>
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-14">
        {/* Headline */}
        <h1 className="font-display text-[56px] leading-[0.95] font-black uppercase">
          <span className="text-white">FIND</span>
          <br />
          <span style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>YOUR</span>
          <br />
          <span style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>FAVORITE</span>
          <br />
          <span style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>PLACE.</span>
        </h1>

        <div className="mt-4 flex items-end justify-between">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">
            CURATED PLACES. REAL PEOPLE.
            <br />
            LOCAL PERSPECTIVES.
          </p>
          <span className="text-[11px] font-bold text-white/50">#0043</span>
        </div>

        {/* CTA button */}
        <button
          type="button"
          onClick={finish}
          className="mt-6 flex size-14 items-center justify-center rounded-full bg-gradient-primary shadow-lg ml-auto"
          aria-label={t("welcome.start")}
        >
          <ArrowRight className="size-6 text-white" />
        </button>
      </div>
    </div>
  );
}
