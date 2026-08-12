/** Shared POI category → color/label mapping, single source of truth for both the map's
 * pois-dot layer (app/Map.tsx) and the details panel chip (app/PlaceDetails.tsx) and legend
 * (app/Legend.tsx). Categories are grouped into a handful of visual "families" (Google-Maps-style
 * POI icon sets group dozens of sub-types under a shared glyph+color) so the legend stays short
 * even as pois.geojson accumulates more granular categories shift over shift. */

export type CategoryGroup = {
  id: string;
  label: string;
  color: string;
  categories: string[];
};

export const CATEGORY_GROUPS: CategoryGroup[] = [
  { id: "religious", label: "Temples & shrines", color: "#8b1a1a", categories: ["temple", "synagogue"] },
  { id: "leisure", label: "Baths", color: "#1a6b8b", categories: ["bathhouse"] },
  { id: "entertainment", label: "Theatres & arenas", color: "#7a4a1a", categories: ["amphitheater", "theater", "circus"] },
  { id: "civic", label: "Civic & government", color: "#b0431a", categories: ["forum", "basilica", "curia"] },
  { id: "residential", label: "Palaces & residences", color: "#6a1a8b", categories: ["palace"] },
  { id: "maritime", label: "Ports & harbors", color: "#1a5c8b", categories: ["port", "lighthouse", "canal"] },
  { id: "infrastructure", label: "Aqueducts", color: "#1a6b46", categories: ["aqueduct"] },
  { id: "military", label: "Forts & fortifications", color: "#3c4043", categories: ["fort", "mansio", "wall"] },
  { id: "industry", label: "Mines", color: "#5f6368", categories: ["mine"] },
  { id: "learning", label: "Libraries", color: "#8b6a1a", categories: ["library"] },
  { id: "monuments", label: "Arches, columns & monuments", color: "#8b1a1a", categories: ["arch", "column", "monument"] },
  { id: "tombs", label: "Tombs & mausolea", color: "#5c1414", categories: ["mausoleum", "necropolis"] },
  { id: "commerce", label: "Markets & warehouses", color: "#8b6a1a", categories: ["market", "warehouse"] },
  { id: "transit", label: "Roads, bridges & gates", color: "#5f6368", categories: ["road", "gate", "bridge"] },
  { id: "water", label: "Fountains", color: "#1a6b8b", categories: ["fountain"] },
];

export const DEFAULT_COLOR = "#8b1a1a";

/** Flat category -> color map (e.g. "temple" -> "#8b1a1a"), derived from CATEGORY_GROUPS so the
 * map layer, the details-panel chip, and the legend can never drift out of sync with each other. */
export const CATEGORY_COLORS: Record<string, string> = Object.fromEntries(
  CATEGORY_GROUPS.flatMap((g) => g.categories.map((c) => [c, g.color])),
);

export function colorForCategory(category: string): string {
  return CATEGORY_COLORS[category] || DEFAULT_COLOR;
}

/** Flat list for building a MapLibre `match` expression: ["temple", "#8b1a1a", "bathhouse", "#1a6b8b", ...]. */
export function categoryColorMatchPairs(): (string)[] {
  const pairs: string[] = [];
  for (const [cat, color] of Object.entries(CATEGORY_COLORS)) {
    pairs.push(cat, color);
  }
  return pairs;
}
