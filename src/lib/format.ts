import type { City, Place } from "./data";
import type { Lang } from "./i18n";

const locale = (l: Lang) => (l === "de" ? "de-DE" : l === "es" ? "es-MX" : "en-GB");

export function km(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export function fmtKm(lang: Lang, d: number) {
  return `${d.toLocaleString(locale(lang), { maximumFractionDigits: 1, minimumFractionDigits: 1 })} km`;
}

export const priceLabel = (city: City, n: number) => (city.currency === "MXN" ? "$" : "€").repeat(n);

export function fmtDate(lang: Lang, iso: string) {
  return new Date(iso).toLocaleDateString(locale(lang), { day: "numeric", month: "short" });
}

/** "Open" only when computed from stored hours in the place's local time zone. */
export function isOpenNow(p: Place, tz: string, now = new Date()): boolean | null {
  if (!p.hours?.length) return null;
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.find((x) => x.type === "weekday")!.value);
  const hm = `${parts.find((x) => x.type === "hour")!.value}:${parts.find((x) => x.type === "minute")!.value}`;
  return p.hours.some((h) => {
    if (h.closes > h.opens) return h.weekday === wd && hm >= h.opens && hm < h.closes;
    // past midnight
    return (h.weekday === wd && hm >= h.opens) || (h.weekday === (wd + 6) % 7 && hm < h.closes);
  });
}

export function todayHours(p: Place, tz: string, now = new Date()) {
  if (!p.hours?.length) return null;
  const wdName = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short" }).format(now);
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wdName);
  const h = p.hours.find((x) => x.weekday === wd);
  return h ? `${h.opens}–${h.closes}` : "—";
}

export function mapsUrl(stops: Place[]) {
  if (!stops.length) return "#";
  const ll = (p: Place) => `${p.lat},${p.lng}`;
  if (stops.length === 1) return `https://www.google.com/maps/search/?api=1&query=${ll(stops[0]!)}`;
  const dest = stops[stops.length - 1]!;
  const way = stops.slice(1, -1).map(ll).join("|");
  return `https://www.google.com/maps/dir/?api=1&origin=${ll(stops[0]!)}&destination=${ll(dest)}${way ? `&waypoints=${encodeURIComponent(way)}` : ""}&travelmode=walking`;
}
