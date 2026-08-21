/** Hand-curated descriptions for named buildings at Timgad (ancient Thamugadi, Algeria) — same
 * pattern as app/ostiaDescriptions.ts and the Pompeii/Herculaneum/Ephesus/Delphi/Jerash/Trier/
 * Merida/Palmyra/Athens/Leptis Magna files, the twelfth site to get this treatment [06-P0-2].
 * Keys are exact substrings of public/data/sites/timgad_buildings.geojson's `name` property.
 *
 * Trajan founded Timgad in 100 CE as Colonia Marciana Ulpia Traiana Thamugadi, a purpose-built
 * retirement town for veterans of Legio III Augusta — a strict 355x355m castrum grid centered on
 * the crossing of the Decumanus Maximus and Cardo Maximus, built for roughly 15,000 people behind
 * a boundary wall with no real fortifications. By 117 CE the colony was only 17 years old: its
 * forum and curia were essentially complete, giving the young town a working civic core, but
 * almost everything now associated with Timgad — the Arch of Trajan, the great bath complexes,
 * the famous semicircular library — belongs to a second building wave under the Antonines and
 * Severans (c. 140-235 CE) that quadrupled the city's size and spilled it out past the original
 * walls. Every one of the six OSM-named buildings in this file postdates 117 CE for exactly that
 * reason; none of Timgad's photogenic monuments existed yet at this map's snapshot date. What did
 * exist — the freshly finished forum and curia, and the taut founding-era grid itself — isn't
 * tagged as a separate named building in the source data, so it lives in this header note rather
 * than a clickable entry.
 *
 * Sources: Wikipedia's Timgad and Arch of Trajan (Timgad) pages; Livius.org's Library of Rogatianus
 * entry; the Madain Project; Wikidata; a French Wikipedia entry on the Grands thermes du Sud;
 * secondary aggregator sites (World History Encyclopedia, Following Hadrian, Lonely Planet) cited
 * where a primary source wasn't reachable. Researched via a background WebSearch pass (WebFetch to
 * Wikipedia/Commons/Livius/Madain Project all stayed blocked in this environment), personally
 * reviewed. Two dates carry a wider error bar than the rest and say so in their own sources line
 * rather than a false-precision guess: the Great North Baths and Small North Baths are dated only
 * by analogy to Timgad's general Severan-era bath-building wave, with no independently attested
 * year found for either. */

export type TimgadEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const TIMGAD_LOOKUP: Record<string, TimgadEntry> = {
  "Arc de Trajan": {
    english: "Arch of Trajan",
    category: "arch",
    extant_117ce: false,
    built: 200,
    description:
      "Timgad's triple-bayed gateway framed the western end of the Decumanus Maximus, three arches cut in pale stone standing about 12 meters tall, dressed with Corinthian half-columns and statue niches. Its inscription honored Trajan's founding of the colony a century earlier, though the arch itself rose long after his death, during the city's later Severan-era building boom. In 117 CE the west road out of town ran through open ground — the arch that now defines every postcard of Timgad was still generations away.",
  },
  "Great North Baths": {
    english: "Great North Baths",
    category: "bath",
    extant_117ce: false,
    built: 200,
    description:
      "The Great North Baths sprawled across roughly 40 rooms just outside the original town gate, one of the largest bathing complexes Timgad ever built, its plan mirrored down the middle with matching warm rooms, hot rooms and latrines on either side. It belonged to the wave of construction that transformed the colony across the 2nd and 3rd centuries, once the town's wealth and population had outgrown its Trajanic core. In 117 CE this whole quarter was still open land north of the young town, decades from being built up.",
  },
  Biblioteca: {
    english: "Library of Timgad",
    category: "library",
    extant_117ce: false,
    built: 300,
    description:
      "Timgad's public library centered on a semicircular reading room off a colonnaded court, one of the few purpose-built libraries to survive anywhere from the Roman world, its curved wall of shelves holding space for roughly 3,000 scrolls. A local benefactor, Marcus Julius Quintianus Flavius Rogatianus, paid for the whole building, leaving 400,000 sesterces in his will to give his hometown a place to read. In 117 CE no library stood here at all — Rogatianus and his gift were still nearly two centuries in the future.",
  },
  "Pequeña Terma norte": {
    english: "Small North Baths",
    category: "bath",
    extant_117ce: false,
    built: 200,
    description:
      "The Small North Baths gave Timgad's northern district a compact, everyday bathhouse, a fraction the size of the nearby Great North Baths but following the same standard bathing sequence at neighborhood scale. It served residents once the city had spread past its original walls, part of the same 2nd-to-3rd-century construction wave as most of Timgad's bath network. In 117 CE this ground sat outside the compact founding-era town — empty and unbuilt.",
  },
  "Terma este": {
    english: "East Baths",
    category: "bath",
    extant_117ce: false,
    built: 146,
    description:
      "The East Baths served Timgad's growing eastern district, on the road toward Mascula, taking bathers through cold, warm and hot rooms before they cooled off in an open colonnaded court. The complex was finished in 146 CE under Antoninus Pius, nearly three decades after Trajan's death. In 117 CE this quarter was still fields beyond the original ramparts — the East Baths wouldn't rise for another generation.",
  },
  "Grand Thermes du sud": {
    english: "Great South Baths",
    category: "bath",
    extant_117ce: false,
    built: 150,
    description:
      "The Great South Baths covered some 1,800 square meters near the theatre, built around a broad frigidarium with two cold pools and a wide curved hemicycle, feeding two separate hot rooms and a dry-heat laconicum through an underground network of service passages. The Antonine emperors built the original complex around 150 CE, and Septimius Severus enlarged it again in 198 and 199. In 117 CE this ground held nothing at all — just open space at the edge of the young colony, decades before construction began.",
  },
};

/** Look up a matching description for an OSM building name. */
export function timgadEntry(name: string | null | undefined): TimgadEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(TIMGAD_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return TIMGAD_LOOKUP[k];
  }
  return undefined;
}
