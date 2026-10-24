import { places, guides, type Place, type Guide } from "./data";
import type { ResultsState } from "./store";

export function filterPlaces(cityId: string, results: ResultsState): Place[] {
  return places.filter((p) => {
    if (p.cityId !== cityId) return false;
    if (results.mood && !p.moods.includes(results.mood)) return false;
    if (results.category !== "all") {
      const map: Record<string, string> = { food: "food", culture: "culture" };
      if (map[results.category] && p.theme !== map[results.category]) return false;
    }
    if (results.prices.length > 0 && !results.prices.includes(p.price)) return false;
    if (results.attrs.includes("Vegan") && !p.vegan) return false;
    if (results.query) {
      const q = results.query.toLowerCase();
      const matches =
        p.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.description.en.toLowerCase().includes(q);
      if (!matches) return false;
    }
    return true;
  });
}

export function searchGuides(cityId: string, query: string): Guide[] {
  const q = query.toLowerCase();
  return guides.filter((g) => {
    if (g.cityId !== cityId) return false;
    return (
      g.title.en.toLowerCase().includes(q) ||
      g.intro.en.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q)
    );
  });
}
