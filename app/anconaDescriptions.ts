/** Hand-curated descriptions for named buildings at Ancona (Roman Ancon) — same pattern as
 * app/veronaDescriptions.ts and the other curate-buildings files [06-P0-2]. Keys are exact
 * substrings of public/data/sites/ancona_buildings.geojson's `name` property, in Italian,
 * matching invariant 1.5's carve-out for the raw OSM layer.
 *
 * Ancona is a genuinely thin site for this ticket, and the thinness is real, not a research
 * shortfall: of the 66 named features in the site's own OSM building extract, only three carry
 * `historic:archaeological_site` — "Foro romano", "Porto traianeo" and "Domus" — everything else
 * is a modern church, palazzo, ministry office or apartment block from the living city stacked on
 * top of the ancient one. A fourth candidate, "Basamento della lanterna" (lighthouse base), is
 * tagged plain `building:yes` with no historic value and was left out rather than guessed into
 * Roman.
 *
 * The site's real headline monument — the Arch of Trajan on the harbor mole, dedicated 115 CE,
 * CIL IX 5894 — never had an OSM name tag in this extract at all, so it can't be curated here
 * regardless of how well documented it is; it was added instead as a standalone `pois.geojson`
 * point in the same shift (see SHIFT_LOG.md), the correct home for a monument this well attested.
 *
 * Sources: English Wikipedia (Ancona, Arch of Trajan (Ancona)), Comune di Ancona's own cultural
 * pages (comuneancona.it/ankonline/cultura), Perseus's Princeton Encyclopedia of Classical Sites
 * entry for Ancona — researched via WebSearch (direct fetches to these domains stayed blocked in
 * this environment).
 */

export type AnconaEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const ANCONA_LOOKUP: Record<string, AnconaEntry> = {
  "Foro romano": {
    english: "Roman Forum",
    category: "forum",
    extant_117ce: true,
    built: -100,
    description:
      "Greek exiles from Syracuse founded Ancona around 387 BCE on the elbow-shaped harbor that gave the city its name (ankon, Greek for elbow), and Rome absorbed it as an ally against Illyrian pirates well before it became a municipium. The civic forum grew up on the hill the cathedral now crowns, tight against the amphitheater and the baths that served the same neighborhood. By 117 CE it had anchored the town's public life for two centuries, four years into Trajan's own reshaping of the harbor below.",
  },
  "Porto traianeo": {
    english: "Trajanic Harbor Works",
    category: "port",
    extant_117ce: true,
    built: 100,
    description:
      "Ancona's natural elbow-shaped bay made it the best deep harbor on Italy's exposed Adriatic coast, and Trajan paid to expand it out of his own funds, extending the north mole and improving the docks to secure the sea route toward his Dacian and eastern campaigns. The emperor's own triumphal arch went up on the finished mole in 115 CE to mark the work's completion. By 117 CE the enlarged harbor was two years old and already the busiest crossing point between Italy and the Balkans.",
  },
  Domus: {
    english: "Roman House",
    category: "house",
    extant_117ce: true,
    built: -50,
    description:
      "Excavation south of the forum uncovered the footprint of an ordinary Roman house from Ancona's municipal era, one residence among the private houses packed onto the same hill as the civic buildings above the harbor. Wartime bombing in the 1940s tore away the medieval and later houses that had buried much of this quarter, exposing Roman walls underneath that archaeologists have picked through ever since. By 117 CE this house had stood on its plot for well over a century, one small piece of the residential city wrapped around Ancona's public core.",
  },
};

/** Look up a matching description for an OSM building name. */
export function anconaEntry(name: string | null | undefined, _osmId?: number): AnconaEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(ANCONA_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return ANCONA_LOOKUP[k];
  }
  return undefined;
}
