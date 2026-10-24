import { MapPin, ChevronDown } from "lucide-react";
import { cities, getCity } from "@/lib/data";
import { useAppState, setState } from "@/lib/store";

export function CityChip() {
  const cityId = useAppState((s) => s.cityId);
  const city = getCity(cityId);

  return (
    <div className="relative self-start">
      <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
        <MapPin className="size-3 text-muted-foreground" aria-hidden />
        <span className="text-[13px] font-semibold text-foreground">{city.name.en}</span>
        <ChevronDown className="size-3 text-muted-foreground" aria-hidden />
      </div>
      <select
        aria-label="Select city"
        value={cityId}
        onChange={(e) => setState(() => ({ cityId: e.target.value }))}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {cities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name.en}
          </option>
        ))}
      </select>
    </div>
  );
}
