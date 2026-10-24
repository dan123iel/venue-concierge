import { Link } from "@tanstack/react-router";
import { Check, MapPin } from "lucide-react";
import { type ButtonHTMLAttributes, type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { type Place } from "@/lib/data";

// --- Icon Button ---
export function IconButton({
  label,
  onClick,
  variant = "outline",
  type = "button",
  children,
  className,
}: {
  label: string;
  onClick?: () => void;
  variant?: "outline" | "photo" | "primary";
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type={type}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full transition-opacity active:opacity-70",
        variant === "outline" && "border border-border bg-card text-foreground",
        variant === "photo" && "bg-black/40 text-white backdrop-blur-sm",
        variant === "primary" && "bg-gradient-primary text-white",
        className,
      )}
    >
      {children}
    </button>
  );
}

// --- Chip ---
export function Chip({
  selected,
  onClick,
  onDoubleClick,
  children,
  className,
}: {
  selected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors",
        selected
          ? "border-transparent bg-gradient-primary text-white"
          : "border-border bg-card text-foreground hover:border-foreground/30",
        className,
      )}
    >
      {selected && <Check className="size-3.5" aria-hidden />}
      {children}
    </button>
  );
}

// --- Primary Button ---
export function PrimaryButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-[52px] w-full items-center justify-center rounded-full bg-gradient-primary px-6 text-[15px] font-bold uppercase tracking-wide text-white transition-opacity active:opacity-80",
        className,
      )}
    >
      {children}
    </button>
  );
}

// --- Secondary Button ---
export function SecondaryButton({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border-2 border-border px-6 text-[15px] font-bold uppercase tracking-wide text-foreground transition-colors hover:border-foreground/40 active:opacity-70",
        className,
      )}
    >
      {children}
    </button>
  );
}

// --- Headline ---
export function Headline({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "font-display text-[clamp(40px,12vw,56px)] text-foreground",
        className,
      )}
      style={{ whiteSpace: "pre-line" }}
    >
      {children}
    </h1>
  );
}

// --- Label ---
export function Label({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("label-caps text-muted-foreground", className)}>{children}</p>
  );
}

// --- SampleBadge ---
export function SampleBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
        className,
      )}
    >
      Sample Data
    </span>
  );
}

// --- Img with fallback ---
export function Img({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [err, setErr] = useState(false);
  return (
    <img
      src={err ? "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=60" : src}
      alt={alt}
      onError={() => setErr(true)}
      className={cn("object-cover", className)}
    />
  );
}

// --- EmptyState ---
export function EmptyState({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <p className="max-w-xs text-[15px] text-muted-foreground">{text}</p>
      {children && <div className="flex flex-col items-center gap-3 w-full max-w-xs">{children}</div>}
    </div>
  );
}

// --- PlaceRow ---
export function PlaceRow({
  place,
  action,
}: {
  place: Place;
  action?: ReactNode;
}) {
  return (
    <Link
      to="/place/$id"
      params={{ id: place.id }}
      className="flex items-center gap-3 rounded-[16px] border-[1.5px] border-border bg-card p-2.5 text-left"
    >
      <Img
        src={place.image}
        alt={place.name}
        className="size-16 shrink-0 rounded-[10px]"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-extrabold text-foreground">{place.name}</p>
        <p className="text-[12px] text-muted-foreground">
          {place.type} · {place.district}
        </p>
        <p className="text-[12px] text-muted-foreground">
          {place.distanceKm} km · {"€".repeat(place.price)}
        </p>
      </div>
      {action ?? (
        <svg className="size-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      )}
    </Link>
  );
}

// --- AddButton ---
export function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      aria-label="Add to plan"
      className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary"
    >
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  );
}

// --- GuideCard ---
export function GuideCard({
  guide,
}: {
  guide: { id: string; image: string; title: { en: string; de?: string; es?: string }; intro: { en: string; de?: string; es?: string }; category: string; placeCount: number };
}) {
  const { useT: _unused, ..._ } = { useT: null };
  return (
    <Link
      to="/inspire/guide/$id"
      params={{ id: guide.id }}
      className="flex items-center gap-3 rounded-[16px] border-[1.5px] border-border bg-card p-3 text-left"
    >
      <Img src={guide.image} alt="" className="size-16 shrink-0 rounded-[10px]" />
      <div className="min-w-0 flex-1">
        <p className="label-caps text-primary mb-0.5">{guide.category}</p>
        <p className="font-extrabold text-foreground">{guide.title.en}</p>
        <p className="text-[12px] text-muted-foreground">{guide.placeCount} places</p>
      </div>
      <svg className="size-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </Link>
  );
}

// --- CityChip ---
export function CityChip() {
  const cityName = "Berlin"; // simplified for now
  return (
    <div className="flex items-center gap-1.5 self-start rounded-full border border-border bg-card px-3 py-1.5">
      <MapPin className="size-3 text-muted-foreground" aria-hidden />
      <span className="text-[13px] font-semibold text-foreground">{cityName}</span>
    </div>
  );
}

// --- MapBlock ---
export function MapBlock({
  places: ps,
  numbered,
  height = 160,
}: {
  places: Place[];
  numbered?: boolean;
  height?: number;
}) {
  if (ps.length === 0) return null;
  const lats = ps.map((p) => p.lat);
  const lngs = ps.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const padLat = (maxLat - minLat) * 0.3 || 0.01;
  const padLng = (maxLng - minLng) * 0.3 || 0.01;
  const toX = (lng: number) => ((lng - minLng + padLng) / (maxLng - minLng + padLng * 2)) * 100;
  const toY = (lat: number) => 100 - ((lat - minLat + padLat) / (maxLat - minLat + padLat * 2)) * 100;

  return (
    <div
      className="overflow-hidden rounded-[16px] border border-border bg-muted"
      style={{ height }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full">
        {ps.map((p, i) => (
          <g key={p.id}>
            <circle cx={toX(p.lng)} cy={toY(p.lat)} r="3.5" className="fill-primary" />
            {numbered && (
              <text
                x={toX(p.lng)}
                y={toY(p.lat) + 1.2}
                textAnchor="middle"
                fontSize="3"
                fontWeight="bold"
                fill="white"
              >
                {i + 1}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

// --- TrustRow ---
export function TrustRow({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-[14px] text-foreground">
      <span className="text-primary">{icon}</span>
      {children}
    </div>
  );
}
