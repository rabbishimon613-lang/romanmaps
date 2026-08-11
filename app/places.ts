export type Place = {
  id: string;
  modern: string;
  latin: string;
  major: boolean;
  lng: number;
  lat: number;
};

let cache: Place[] | null = null;
let inflight: Promise<Place[]> | null = null;

/** Fetches + flattens the DARE-derived gazetteer once, then serves it from memory. */
export function loadPlaces(): Promise<Place[]> {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;
  inflight = fetch("/data/places_medium.geojson")
    .then((r) => r.json())
    .then((geojson: any) => {
      const places: Place[] = [];
      for (const f of geojson.features as any[]) {
        if (f.properties?.ancient !== 1 || f.geometry?.type !== "Point") continue;
        const [lng, lat] = f.geometry.coordinates as [number, number];
        places.push({
          id: String(f.properties.id),
          modern: f.properties.modern || "",
          latin: f.properties.latin || "",
          major: f.properties.major === 1,
          lng,
          lat,
        });
      }
      cache = places;
      return places;
    });
  return inflight;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[*?]/g, "").trim();
}

export function searchPlaces(places: Place[], query: string, limit = 8): Place[] {
  const q = normalize(query);
  if (!q) return [];

  const scored: { place: Place; score: number }[] = [];
  for (const p of places) {
    const latin = normalize(p.latin);
    const modern = normalize(p.modern);
    let score = -1;
    if (latin === q || modern === q) score = 100;
    else if (latin.startsWith(q) || modern.startsWith(q)) score = 80;
    else if (latin.includes(q) || modern.includes(q)) score = 50;
    if (score < 0) continue;
    if (p.major) score += 10;
    scored.push({ place: p, score });
  }
  scored.sort((a, b) => b.score - a.score || a.place.latin.length - b.place.latin.length);
  return scored.slice(0, limit).map((s) => s.place);
}
