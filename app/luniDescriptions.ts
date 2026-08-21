/** Hand-curated descriptions for named buildings at Luni (ancient Luna, Italy) — same pattern as
 * app/ostiaDescriptions.ts and the other curate-buildings files, the seventeenth site to get this
 * treatment [06-P0-2]. Keys are exact substrings of public/data/sites/luni_buildings.geojson's
 * `name` property, in Italian, matching invariant 1.5's carve-out for the raw OSM layer. Two
 * features are out of scope — "Antica Luni" (the park's own boundary label) and "Museo
 * Archeologico Nazionale di Luni" (the modern on-site museum building) — neither is an ancient
 * structure to curate.
 *
 * Rome founded Luna as a Latin colony in 177 BCE, prized for the white marble quarried in the
 * hills behind it — the same stone Augustus later used to remake Rome itself. By 117 CE it was
 * already three centuries old, its forum, theatre and shopfronts long since settled into daily
 * use, though its most photographed features today (the amphitheatre, the Oceanus mosaic, the
 * Christian basilica) all belong to the 2nd century and later.
 *
 * Sources: comune.luni.sp.it and luni.cultura.gov.it (the site's own official archaeological-park
 * documentation, including per-building area archeologica pages for the tabernae and Domus di
 * Oceano); the Ancient Theatre Archive's Luna/Luni entry; Italian Wikipedia's "Anfiteatro romano
 * di Luni" and "Luna (colonia romana)" pages. Researched via a background WebSearch pass (WebFetch
 * to Wikipedia/the Luni cultura.gov.it domain stayed blocked in this environment), personally
 * reviewed. */

export type LuniEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const LUNI_LOOKUP: Record<string, LuniEntry> = {
  "Anfiteatro romano di Luni": {
    english: "Roman Amphitheatre of Luni",
    category: "amphitheater",
    extant_117ce: false,
    built: 150,
    description:
      "An amphitheatre raised on the edge of the colony, most likely during the Antonine building wave of the mid-2nd century CE that reshaped several of Luna's public spaces. In 117 CE the site held nothing of it yet — the colony's residents still traveled elsewhere for large-scale games, decades before ground broke here.",
  },
  "Basilica cristiana di Luni": {
    english: "Christian Basilica of Luni",
    category: "civic",
    extant_117ce: false,
    built: 400,
    description:
      "A Christian church built as Luna's bishopric grew in the late 4th or early 5th century CE, centuries after the marble colony's pagan Roman heyday. In 117 CE, under Trajan, organized Christianity hadn't yet reached this stretch of the Ligurian coast — the ground here held nothing resembling a church for nearly three hundred more years.",
  },
  Foro: {
    english: "Forum",
    category: "civic",
    extant_117ce: true,
    built: -177,
    description:
      "Laid out at the crossing of the cardo and decumanus when Rome founded Luna as a colony in 177 BCE, the forum anchored the marble town's civic life for centuries — later paved in the very stone the colony was famous for exporting, and framed by a capitolium and shopfronts added over time. By 117 CE it had been the working heart of the town for close to three hundred years.",
  },
  "Mosaici di Oceano e del Circo Massimo": {
    english: "Mosaics of Oceanus and the Circus Maximus",
    category: "domus",
    extant_117ce: false,
    built: 300,
    description:
      "A richly patterned floor in the House of Oceanus, one of Luna's private residences, centered on the bearded face of the sea god amid swimming fish and framed by a band showing chariot racing at Rome's Circus Maximus. The colony's own excavation records date it to the late 3rd or mid-4th century CE. In 117 CE this floor, and likely the room itself, didn't yet exist.",
  },
  "Teatro Romano di Luni": {
    english: "Roman Theatre of Luni",
    category: "theater",
    extant_117ce: true,
    built: 40,
    description:
      "Built in the Julio-Claudian era, datable to around the 40s CE from coins of Tiberius and Caligula found in its foundations and roof tiles stamped with the name of a local Roman knight who also supervised building work at Cosa. By 117 CE it had already staged performances for roughly three-quarters of a century, one of the few structures at Luna a visitor under Trajan could call genuinely old.",
  },
  "Tabernae Lunae": {
    english: "Tabernae of Luna",
    category: "civic",
    extant_117ce: true,
    built: 45,
    description:
      "A row of shops fronting the colony's main street, the Decumanus Maximus, at least two of which still preserve floor pavements laid in the Claudian era, the 40s and early 50s CE. By 117 CE these storefronts had been open for business for well over sixty years, selling to residents and travelers passing through the marble town.",
  },
};

/** Look up a matching description for an OSM building name. */
export function luniEntry(name: string | null | undefined): LuniEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(LUNI_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return LUNI_LOOKUP[k];
  }
  return undefined;
}
