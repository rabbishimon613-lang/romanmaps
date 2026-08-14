/** Shared POI category → color/label mapping, single source of truth for both the map's
 * pois-dot layer (app/Map.tsx) and the details panel chip (app/PlaceDetails.tsx) and legend
 * (app/Legend.tsx). Categories are grouped into a handful of visual "families" (Google-Maps-style
 * POI icon sets group dozens of sub-types under a shared glyph+color) so the legend stays short
 * even as pois.geojson accumulates more granular categories shift over shift. */

export type CategoryGroup = {
  id: string;
  label: string;
  short: string;
  color: string;
  categories: string[];
  glyph: string; // inline SVG path d= for a 24×24 viewBox
};

// SVG paths — flat single-color glyphs. Small enough to inline.
const G_TEMPLE = "M4 21h16v-1H4v1zm2-3h12v-2H6v2zm-2-4h16l-8-9-8 9z";
const G_BATH = "M12 2C8 6 6 9 6 12a6 6 0 0 0 12 0c0-3-2-6-6-10z";
const G_AMPHI = "M4 8h16v10a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8zm2-4h12v2H6V4z";
const G_FORUM = "M3 21h18v-2H3v2zm2-4h14V9L12 4 5 9v8zm2-2v-5h4v5H7zm6 0v-5h4v5h-4z";
const G_PALACE = "M4 20h16v-8H4v8zm2-10 6-4 6 4v1H6v-1z";
const G_PORT = "M12 2 8 6h3v6H5v3l7 5 7-5v-3h-6V6h3l-4-4z";
const G_AQUEDUCT = "M2 9h4v10H4a2 2 0 0 1-2-2V9zm16 0h4v8a2 2 0 0 1-2 2h-2V9zM8 5h8v14H8V5z";
const G_FORT = "M4 4v10a8 8 0 0 0 16 0V4l-4 2-4-2-4 2-4-2z";
const G_MINE = "M14 3l7 7-3 3-7-7 3-3zM3 21h18v-2H3v2z";
const G_LIBRARY = "M5 4h5v16H5V4zm7 0h5v16h-5V4zM3 20V6h1v14H3zm17 0V6h1v14h-1z";
const G_MONUMENT = "M10 22h4v-2h-4v2zm-1-4h6l-1-16h-4l-1 16z";
const G_TOMB = "M4 22h16v-2H4v2zm2-4h12V8l-6-6-6 6v10z";
const G_MARKET = "M4 4h16l-1 4H5L4 4zm1 6h14l-1 12H6L5 10z";
const G_BRIDGE = "M2 12s3-6 10-6 10 6 10 6-3 6-10 6-10-6-10-6zm2 8h16v-2H4v2z";
const G_FOUNTAIN = "M12 2a4 4 0 0 0-4 4h2a2 2 0 0 1 4 0h2a4 4 0 0 0-4-4zm-7 20h14v-2H5v2zm2-4h10v-6a5 5 0 0 0-10 0v6z";
// Four-pointed "clash" burst — battles are events, not standing structures, so a starburst reads
// clearer at small marker size than a literal crossed-swords glyph would.
const G_BATTLE = "M12 2 14 10 22 12 14 14 12 22 10 14 2 12 10 10Z";

export const CATEGORY_GROUPS: CategoryGroup[] = [
  { id: "religious",       label: "Temples & shrines",           short: "Temples",      color: "#c94b4b", categories: ["temple","synagogue","mithraeum","sanctuary","oracle","asklepieion"], glyph: G_TEMPLE },
  { id: "leisure",         label: "Baths",                       short: "Baths",        color: "#4a8cbf", categories: ["bath","bathhouse"], glyph: G_BATH },
  { id: "entertainment",   label: "Theatres & arenas",           short: "Arenas",       color: "#a05f2e", categories: ["amphitheater","theater","circus"], glyph: G_AMPHI },
  { id: "civic",           label: "Civic & government",          short: "Civic",        color: "#b0431a", categories: ["forum","basilica","curia","collegium"], glyph: G_FORUM },
  { id: "residential",     label: "Palaces & residences",        short: "Palaces",      color: "#8859a6", categories: ["palace","house","villa","domus"], glyph: G_PALACE },
  { id: "maritime",        label: "Ports & harbors",             short: "Ports",        color: "#2a7fb5", categories: ["port","lighthouse","canal","harbor"], glyph: G_PORT },
  { id: "infrastructure",  label: "Water infrastructure",        short: "Water",        color: "#3a9a6a", categories: ["aqueduct","dam","watermill","cistern"], glyph: G_AQUEDUCT },
  { id: "military",        label: "Forts & fortifications",      short: "Forts",        color: "#4a5057", categories: ["fort","mansio","wall","barracks","naval_base","signal_tower","auxiliary_fort"], glyph: G_FORT },
  { id: "industry",        label: "Mines & industry",            short: "Industry",     color: "#6a5f4a", categories: ["mine","quarry","garum_factory","salina","kiln","estate"], glyph: G_MINE },
  { id: "learning",        label: "Libraries",                   short: "Libraries",    color: "#a08a2e", categories: ["library"], glyph: G_LIBRARY },
  { id: "monuments",       label: "Arches, columns & monuments", short: "Monuments",    color: "#c94b4b", categories: ["arch","column","monument","obelisk"], glyph: G_MONUMENT },
  { id: "tombs",           label: "Tombs & mausolea",            short: "Tombs",        color: "#5c5c5c", categories: ["mausoleum","necropolis","tomb"], glyph: G_TOMB },
  { id: "commerce",        label: "Markets & warehouses",        short: "Markets",      color: "#a06b2e", categories: ["market","warehouse","taberna","macellum"], glyph: G_MARKET },
  { id: "transit",         label: "Bridges & gates",             short: "Gateways",     color: "#6a6a6a", categories: ["road","gate","bridge"], glyph: G_BRIDGE },
  { id: "water",           label: "Fountains",                   short: "Fountains",    color: "#4a8cbf", categories: ["fountain"], glyph: G_FOUNTAIN },
  { id: "battles",         label: "Battlefields",                short: "Battles",      color: "#7a1f1f", categories: ["battle"], glyph: G_BATTLE },
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

const CATEGORY_GLYPHS: Record<string, string> = Object.fromEntries(
  CATEGORY_GROUPS.flatMap((g) => g.categories.map((c) => [c, g.glyph])),
);
const DEFAULT_GLYPH = "M12 2 8 6h3v6H5v3l7 5 7-5v-3h-6V6h3l-4-4z";
export function glyphForCategory(category: string): string {
  return CATEGORY_GLYPHS[category] || DEFAULT_GLYPH;
}

const CATEGORY_TO_GROUP: Record<string, string> = Object.fromEntries(
  CATEGORY_GROUPS.flatMap((g) => g.categories.map((c) => [c, g.id])),
);
export function groupIdForCategory(category: string): string {
  return CATEGORY_TO_GROUP[category] || "";
}

/** Flat list for building a MapLibre `match` expression: ["temple", "#8b1a1a", "bathhouse", "#1a6b8b", ...]. */
export function categoryColorMatchPairs(): (string)[] {
  const pairs: string[] = [];
  for (const [cat, color] of Object.entries(CATEGORY_COLORS)) {
    pairs.push(cat, color);
  }
  return pairs;
}
