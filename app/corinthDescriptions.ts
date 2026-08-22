/** Hand-curated descriptions for named buildings at Corinth (ancient Corinth, Greece — Roman
 * colony, capital of Achaea) — same pattern as app/ostiaDescriptions.ts and the other
 * curate-buildings files [06-P0-2]. Keys are exact substrings of
 * public/data/sites/corinth_buildings.geojson's `name` property (Greek and English, matching the
 * raw OSM tags), matching invariant 1.5's carve-out for the raw OSM layer.
 *
 * Filled in by cloud shift 44 research — see SHIFT_LOG.md for sourcing detail.
 */

export type CorinthEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const CORINTH_LOOKUP: Record<string, CorinthEntry> = {};

/** Look up a matching description for an OSM building name. */
export function corinthEntry(name: string | null | undefined): CorinthEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(CORINTH_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return CORINTH_LOOKUP[k];
  }
  return undefined;
}
