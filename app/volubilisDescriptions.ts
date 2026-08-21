/** Hand-curated descriptions for named buildings at Volubilis (Morocco) — same pattern as
 * app/ostiaDescriptions.ts and the Pompeii/Herculaneum/Ephesus/Delphi/Jerash/Trier/Merida/
 * Palmyra/Athens/Leptis Magna/Timgad/Djemila files, the fourteenth site to get this treatment
 * [06-P0-2]. Keys are exact substrings of public/data/sites/volubilis_buildings.geojson's `name`
 * property — only 4 named features here, the thinnest site yet, but a real one.
 *
 * Volubilis was already an old Berber town, Mauretanian royal capital under Juba II and Ptolemy,
 * before Rome formally annexed the kingdom in 44 CE. By 117 CE it had been Roman for 73 years — a
 * frontier city at the empire's western edge, growing rich on the olive-oil trade its surviving
 * presses still attest to. Two of this file's three buildings genuinely stood in 117 CE, a rarer
 * split than most sites on this map get, since Volubilis's headline monument (the Arch of
 * Caracalla) is one of the latest-dated triumphal arches anywhere in the empire.
 *
 * Sources: World History Encyclopedia's Volubilis photo-essay pages; sitevolubilis.com's temple
 * pages; theses.fr's dissertation catalog (Les Thermes du Nord à Volubilis, 1986PA040403); a 1998
 * Persée article abstract on Temple B (Ponsich's original 1954 excavation, re-examined). Researched
 * via a background WebSearch pass (WebFetch to Wikipedia/Commons/UNESCO/Persée all stayed blocked
 * in this environment), personally reviewed. Temple B's early-1st-century date rests on one 1954
 * excavation campaign's stylistic judgment — the best scholarly estimate available, not a firmly
 * fixed date, and said so plainly in its own description rather than hedged with guardrail
 * language. */

export type VolubilisEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const VOLUBILIS_LOOKUP: Record<string, VolubilisEntry> = {
  "Arc de triomphe de Caracalla": {
    english: "Arch of Caracalla",
    category: "arch",
    extant_117ce: false,
    built: 217,
    description:
      "Volubilis's grandest monument frames the western end of the Decumanus Maximus, raised between December 216 and April 217 CE on the order of the province's governor, Marcus Aurelius Sebastenus. It honored Caracalla for granting the city's people Roman citizenship and freedom from tribute — a gift that outlived him, since he was murdered before the arch that thanked him was even finished. In 117 CE, exactly a century earlier, this end of the street ran straight out toward open farmland with no arch in sight.",
  },
  "Temple B": {
    english: "Temple B (Sanctuary of Saturn)",
    category: "temple",
    extant_117ce: true,
    built: 1,
    description:
      "Set apart from the main city across a small ravine, this temple follows a local North African plan rather than a classical Roman one — excavators recovered over 800 votive stelae here dedicated to Saturn, the Romanized descendant of the older Punic god Baal Hammon. Its layout points to a Berber and Punic cult site absorbed into Roman-period Volubilis rather than built fresh by Rome. Archaeologists date its construction to the early 1st century CE, which would make it already a century old — one of the very few buildings on this hill genuinely standing when Trajan died in 117.",
  },
  "Thermes du nord": {
    english: "North Baths",
    category: "bath",
    extant_117ce: true,
    built: 70,
    description:
      "A full public bathing complex with its own exercise yard and a block of heated rooms, built under the Flavian emperors around 60-80 CE as one of the more prestigious bath buildings raised anywhere in Roman Mauretania. Its scale signaled a provincial capital determined to look the part. By 117 CE it had already been open for a generation, one of the few Volubilis landmarks a visitor today can be sure Trajan's own contemporaries actually used.",
  },
};

/** Look up a matching description for an OSM building name. */
export function volubilisEntry(name: string | null | undefined): VolubilisEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(VOLUBILIS_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return VOLUBILIS_LOOKUP[k];
  }
  return undefined;
}
