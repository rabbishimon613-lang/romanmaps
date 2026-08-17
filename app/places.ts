export type Place = {
  id: string;
  modern: string;
  latin: string;
  major: boolean;
  lng: number;
  lat: number;
  /** Present only for a result sourced from `pois.geojson` rather than the raw gazetteer — the
   * full feature properties, ready to hand straight to `selectPoi()` so the result opens a real
   * place card instead of just panning the camera. */
  poiProps?: Record<string, any>;
};

let cache: Place[] | null = null;
let inflight: Promise<Place[]> | null = null;

let poiCache: Place[] | null = null;
let poiInflight: Promise<Place[]> | null = null;

/** The 467 curated landmarks in `pois.geojson`, flattened into the same shape `Place` search
 * already understands — so a search for "Pantheon" or "Circus Maximus" can surface a result that
 * opens its real card (hero image, notes, sources) instead of the bare gazetteer dot most place
 * names fall back to. Merge with `loadPlaces()`'s result before calling `searchPlaces()`. */
export function loadPois(): Promise<Place[]> {
  if (poiCache) return Promise.resolve(poiCache);
  if (poiInflight) return poiInflight;
  poiInflight = fetch("/data/pois.geojson")
    .then((r) => r.json())
    .then((geojson: any) => {
      const pois: Place[] = [];
      for (const f of geojson.features as any[]) {
        if (f.geometry?.type !== "Point") continue;
        const props = f.properties || {};
        const [lng, lat] = f.geometry.coordinates as [number, number];
        pois.push({
          id: String(props.id),
          modern: props.name_english || "",
          latin: props.name_latin || props.name_english || "",
          major: true,
          lng,
          lat,
          poiProps: props,
        });
      }
      poiCache = pois;
      return pois;
    });
  return poiInflight;
}

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
