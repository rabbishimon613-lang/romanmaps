/** Hand-curated descriptions for named buildings at Djemila (ancient Cuicul, Algeria) — same
 * pattern as app/ostiaDescriptions.ts and the Pompeii/Herculaneum/Ephesus/Delphi/Jerash/Trier/
 * Merida/Palmyra/Athens/Leptis Magna/Timgad files, the thirteenth site to get this treatment
 * [06-P0-2]. Keys are exact substrings of public/data/sites/djemila_buildings.geojson's `name`
 * property.
 *
 * Trajan's predecessor Nerva founded Cuicul in 96 CE as a veteran colony on a narrow mountain
 * spur between two ravines — a sister town to Timgad, built the same generation for the same
 * purpose. By 117 CE the town was 21 years old: its original forum, curia and capitol were up
 * and working, a compact civic core on the hilltop. Everything that makes Djemila famous today —
 * the Arch of Caracalla, the sprawling Severan quarter and its Temple of the Severan Family, the
 * Great Baths, the Christian basilica named for Bishop Cresconius — belongs to a second and third
 * wave of building across the 2nd through 5th centuries, long after Trajan's death.
 *
 * Sources: World History Encyclopedia's Cuicul/Djémila photo-essay pages; Pleiades and vici.org's
 * Djemila gazetteer entries; Following Hadrian Photography's Cuicul field notes; theses.fr.
 * Researched via a background WebSearch pass (WebFetch to Wikipedia/Commons/UNESCO/Persée all
 * stayed blocked in this environment), personally reviewed. One entry carries a genuine sourcing
 * gap flagged rather than papered over: OSM's generic "Thermes romains" tag doesn't say which of
 * Djemila's three bath complexes it means, so this entry names the best-attested candidate (the
 * Great Baths, 183 CE) while saying plainly that the identification is inferred, not confirmed —
 * doesn't change the 117 CE verdict either way, since every dated bath complex here is 2nd-century
 * or later. */

export type DjemilaEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const DJEMILA_LOOKUP: Record<string, DjemilaEntry> = {
  "Arc de Caracalla": {
    english: "Arch of Caracalla",
    category: "arch",
    extant_117ce: false,
    built: 216,
    description:
      "Cuicul's citizens raised this triumphal arch at the southern edge of the forum in 216 CE, honoring the reigning emperor Caracalla, his mother Julia Domna and his deified father Septimius Severus. It marks the gateway into the town's later, larger Severan quarter, built a full century after the veteran colony's founding. In 117 CE, under Trajan, this spot sat at the edge of a much smaller hilltop town — the arch was still ninety-nine years away.",
  },
  "Basilica of Cresconius": {
    english: "Basilica of Cresconius",
    category: "civic",
    extant_117ce: false,
    built: 400,
    description:
      "A Christian basilica roughly 40 by 28 meters, built around 400-411 CE under Bishop Cresconius as the centerpiece of Cuicul's Christian quarter, distinct from the older pagan-era civic basilica in the forum. Its nave and two side aisles once held a congregation nearly three centuries after Trajan's reign. In 117 CE Christianity had barely reached North Africa in organized form — no church stood anywhere in Cuicul, let alone this one.",
  },
  "Roman Forum Courtyard": {
    english: "Forum Courtyard",
    category: "civic",
    extant_117ce: true,
    built: 96,
    description:
      "The open, colonnaded square at the center of Cuicul's original hilltop grid, paved and framed by porticoes on two sides as part of the veteran colony Nerva founded in 96 CE. Citizens crossed it daily to reach the curia and the temples that ringed it. By Trajan's death in 117, this courtyard had been the working heart of the town for two decades already.",
  },
  "Roman Forum": {
    english: "Roman Forum",
    category: "civic",
    extant_117ce: true,
    built: 96,
    description:
      "Cuicul's founding-era forum, laid out with the veteran colony itself in 96 CE under Nerva and built up through the following decades with a curia, temples and a capitol on its narrow mountain spur between two ravines. A separate civil basilica was added to its edge later, in 169 CE, but the square and its original civic buildings were already the settled center of town when Trajan died in 117. Two decades old and still growing, it anchored a colony that would later sprawl far beyond these walls.",
  },
  "Temple de la famille des Sévères": {
    english: "Temple of the Severan Family",
    category: "temple",
    extant_117ce: false,
    built: 229,
    description:
      "A temple on a tall podium reached by a monumental staircase, its Corinthian colonnade fronting the new Severan Forum that Cuicul built outside its original walls as the colony outgrew its hilltop. Dedicated in 229 CE under Severus Alexander to the ruling Severan dynasty, it anchored an entire new quarter of the expanded town. In 117 CE this ground lay outside Cuicul's walls entirely — open land more than a century away from becoming the city's second civic center.",
  },
  "Thermes romains": {
    english: "Roman Baths",
    category: "bath",
    extant_117ce: false,
    built: 183,
    description:
      "Cuicul had at least three public bath complexes by the time it reached its full size, and its grandest — the Great Baths, roughly 2,600 square meters — was raised in 183-184 CE at the town's own expense and excavated by Yvonne Allais in the 1950s. Whichever of the site's bath complexes this marker refers to, none of them predate the 2nd century. In 117 CE, sixty-six years before ground broke on the Great Baths, Cuicul's veterans and their families still bathed in whatever smaller facilities the young colony had managed to build.",
  },
};

/** Look up a matching description for an OSM building name. */
export function djemilaEntry(name: string | null | undefined): DjemilaEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(DJEMILA_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return DJEMILA_LOOKUP[k];
  }
  return undefined;
}
