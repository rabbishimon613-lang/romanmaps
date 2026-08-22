/** Hand-curated descriptions for named buildings at Capua (ancient Capua, modern Santa Maria
 * Capua Vetere, Italy) — same pattern as app/ostiaDescriptions.ts and the other curate-buildings
 * files [06-P0-2]. Keys are exact substrings of public/data/sites/capua_buildings.geojson's `name`
 * property, in Italian, matching invariant 1.5's carve-out for the raw OSM layer.
 *
 * Filled in by cloud shift 44 research — see SHIFT_LOG.md for sourcing detail.
 */

export type CapuaEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const CAPUA_LOOKUP: Record<string, CapuaEntry> = {};

/** Look up a matching description for an OSM building name. */
export function capuaEntry(name: string | null | undefined): CapuaEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(CAPUA_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return CAPUA_LOOKUP[k];
  }
  return undefined;
}
