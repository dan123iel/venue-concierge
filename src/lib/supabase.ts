import { createClient } from "@supabase/supabase-js";
import type { Place } from "./data";

const SUPABASE_URL = "https://rklnnzmbbaqhqtanauvf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ss67R5hjDR7vOQJsYBvlqw_kUCSVju1";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DB row shape (partial — only what we use)
interface VenueRow {
  id: number;
  name: string;
  type: string;
  area: string;
  district: string | null;
  address: string;
  description: string | null;
  why_special: string | null;
  price_level_num: number;
  vibe: string[] | null;
  good_for: string[] | null;
  dietary_tags: string[] | null;
  vegan: "yes" | "no" | "possible" | "unknown";
  photo_url: string | null;
  google_maps_url: string | null;
  category: string;
  is_ready: boolean;
}

const FALLBACK_IMAGES: Record<string, string> = {
  restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
  cafe: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&q=80",
  bar: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80",
  club: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
  culture: "https://images.unsplash.com/photo-1545178803-4056771d60a3?w=600&q=80",
};

function fallbackImage(category: string): string {
  return FALLBACK_IMAGES[category.toLowerCase()] ?? FALLBACK_IMAGES.restaurant!;
}

function vibeToMoods(vibe: string[] | null, good_for: string[] | null, category: string): string[] {
  const all = [...(vibe ?? []), ...(good_for ?? [])].map((v) => v.toLowerCase());
  const moods: string[] = [];

  if (all.some((v) => ["quiet", "cozy", "entspannt", "casual"].includes(v))) moods.push("Relaxed");
  if (all.some((v) => ["romantic", "date", "intimate", "anniversary", "elegant"].includes(v))) moods.push("Romantic");
  if (all.some((v) => ["local", "authentic", "neighborhood", "no-frills", "old-berlin", "traditional"].includes(v))) moods.push("Local");
  if (all.some((v) => ["creative", "kreativ", "hipster", "hip", "experimentell", "trendy"].includes(v))) moods.push("Creative");
  if (all.some((v) => ["bar", "cocktails", "craft beer", "drinks", "late night", "lively", "music"].includes(v))) moods.push("Nightlife");

  // Foodie = restaurants/cafés that aren't primarily nightlife
  const cat = category.toLowerCase();
  if (["restaurant", "cafe", "street food", "bakery"].includes(cat)) moods.push("Foodie");
  if (all.some((v) => ["exclusive", "exclusive dinner", "omakase", "upscale", "glamorous"].includes(v))) moods.push("Foodie");

  if (moods.length === 0) moods.push("Local");
  return moods;
}

function categoryToTheme(category: string, type: string): Place["theme"] {
  const c = category.toLowerCase();
  const t = type.toLowerCase();
  if (["club", "bar"].includes(c) || t.includes("club") || t.includes("bar") || t.includes("cocktail")) return "nightlife";
  if (["culture", "museum", "gallery", "cinema"].includes(c)) return "culture";
  if (c === "outdoor") return "outdoor";
  return "food";
}

export function dbToPlace(row: VenueRow): Place {
  return {
    id: `sb-${row.id}`,
    name: row.name,
    type: row.type,
    cityId: "berlin",
    district: row.district ?? row.area,
    lat: 52.52,
    lng: 13.405,
    distanceKm: 0,
    price: Math.max(1, Math.min(4, row.price_level_num ?? 2)),
    image: row.photo_url ?? fallbackImage(row.category),
    tags: [...(row.vibe ?? []).slice(0, 3), ...(row.dietary_tags ?? []).slice(0, 1)],
    description: {
      en: row.description ?? "",
      de: row.description ?? "",
      es: row.description ?? "",
    },
    whyWeRecommend: {
      en: row.why_special ?? "",
      de: row.why_special ?? "",
      es: row.why_special ?? "",
    },
    hours: [],
    vegan: row.vegan === "yes" || row.vegan === "possible",
    address: row.address,
    theme: categoryToTheme(row.category, row.type),
    moods: vibeToMoods(row.vibe, row.good_for, row.category),
  };
}

export async function fetchPlaces(opts: {
  mood?: string;
  category?: string;
  prices?: number[];
  vegan?: boolean;
  query?: string;
  limit?: number;
}): Promise<Place[]> {
  let q = supabase
    .from("venues")
    .select(
      "id,name,type,area,district,address,description,why_special,price_level_num,vibe,good_for,dietary_tags,vegan,photo_url,google_maps_url,category,is_ready"
    )
    .eq("active", true)
    .eq("is_ready", true)
    .eq("city", "Berlin")
    .limit(opts.limit ?? 50);

  if (opts.prices && opts.prices.length > 0) {
    q = q.in("price_level_num", opts.prices);
  }
  if (opts.vegan) {
    q = q.in("vegan", ["yes", "possible"]);
  }
  if (opts.category && opts.category !== "all") {
    if (opts.category === "food") q = q.eq("category", "restaurant");
    if (opts.category === "culture") q = q.eq("category", "culture");
  }

  const { data, error } = await q;
  if (error) {
    console.error("Supabase fetchPlaces error:", error.message);
    return [];
  }

  let results = (data as VenueRow[]).map(dbToPlace);

  // Client-side mood + query filtering (no DB column for these)
  if (opts.mood) {
    results = results.filter((p) => p.moods.includes(opts.mood!));
  }
  if (opts.query) {
    const ql = opts.query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(ql) ||
        p.type.toLowerCase().includes(ql) ||
        p.district.toLowerCase().includes(ql) ||
        p.description.en.toLowerCase().includes(ql)
    );
  }

  return results;
}

export async function fetchPlaceById(id: string): Promise<Place | null> {
  // id format: "sb-123"
  const numId = parseInt(id.replace("sb-", ""), 10);
  if (isNaN(numId)) return null;

  const { data, error } = await supabase
    .from("venues")
    .select(
      "id,name,type,area,district,address,description,why_special,price_level_num,vibe,good_for,dietary_tags,vegan,photo_url,google_maps_url,category,is_ready"
    )
    .eq("id", numId)
    .single();

  if (error || !data) return null;
  return dbToPlace(data as VenueRow);
}
