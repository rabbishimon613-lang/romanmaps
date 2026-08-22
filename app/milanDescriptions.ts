/** Hand-curated descriptions for named buildings at Milan (ancient Mediolanum, Roman Italy) —
 * same pattern as app/ostiaDescriptions.ts and the other curate-buildings files [06-P0-2]. Keys
 * are exact substrings of public/data/sites/milan_buildings.geojson's `name` property, in
 * Italian, matching invariant 1.5's carve-out for the raw OSM layer.
 *
 * Mediolanum in 117 CE was a booming provincial hub, but NOT yet the imperial residence it
 * became under Maximian from 286 CE — most of Milan's grandest surviving Roman fabric (the
 * Circus, the Imperial Palace, Torre di Massimiano, the Colonne di San Lorenzo) belongs to that
 * later Tetrarchic building boom and postdates this map's snapshot by 170+ years. Only two
 * genuinely early-imperial structures survive with a confident pre-117 CE date: the amphitheatre
 * and one of the two towers flanking the Augustan-era Porta Ticinensis.
 *
 * Six real candidates researched and correctly excluded rather than guessed: "Parco Archeologico
 * dell'Anfiteatro Romano" and "Parco Archeologico" are the modern park/museum boundary around the
 * amphitheatre, not separate ancient fabric; "Circo Romano"/"Circo romano" are two OSM fragments
 * of the same circus, built under Maximian (c. 290s–300s CE); "Torre di Massimiano" and "Villa
 * Imperiale" (the actual Roman Imperial Palace, despite its misleading OSM name) both date to
 * Maximian's reign (285–310 CE); "Colonne di San Lorenzo" has no credible dating earlier than
 * the mid/late 2nd century CE at best, with a competing hypothesis placing it under Maximian
 * too; "Domus Nostra" is a modern Università Cattolica dining hall with no ancient connection,
 * a coincidental Latin name match, not a genuine Roman domus.
 *
 * Sources: Italian Wikipedia, the Comune di Milano's own archaeology portal
 * (milanoarcheologia.beniculturali.it), Museo Archeologico di Milano, Italy's national cultural
 * heritage catalog (catalogo.beniculturali.it), Lombardia Beni Culturali's architecture record
 * sheets — cross-confirmed across 2+ independent results per fact, researched via a background
 * WebSearch pass (direct fetches to these domains stayed blocked in this environment). Filled in
 * by a cloud shift — see SHIFT_LOG.md for sourcing detail.
 */

export type MilanEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const MILAN_LOOKUP: Record<string, MilanEntry> = {
  "Anfiteatro Romano": {
    english: "Roman Amphitheatre",
    category: "amphitheater",
    extant_117ce: true,
    built: 90,
    destroyed: 539,
    description:
      "Mediolanum's amphitheatre rose just outside the southwestern walls near the Porta Ticinensis, an elliptical arena roughly 155 by 125 meters — the third-largest in the Roman world after the Colosseum and Capua's own arena. Its terraces held as many as 30,000 spectators for gladiatorial combats, wild-beast hunts and mock naval battles flooded across the sunken floor. By 117 CE, the year Trajan died, it had stood finished for a generation, already a fixture of the city's public life. Gothic besiegers stripped it for building stone during the wars of the 6th century, and its outline now survives only as foundations under a public park.",
  },
  "Torre Romana del Carrobbio": {
    english: "Roman Tower of Carrobbio",
    category: "tower",
    extant_117ce: true,
    built: -20,
    description:
      "This tower guarded Mediolanum's southern gate, one of twin towers flanking the Porta Ticinensis where the road to Ticinum, modern Pavia, left the city walls. Built in the Augustan campaign between 30 BCE and 14 CE, its base was eighteen-sided outside and perfectly circular within, a hallmark of early imperial military engineering, with a monumental arch some three meters wide once spanning the carriageway beside it. By 117 CE the tower had guarded the crossroads for over a century. Its lower courses still stand today, buried more than two meters below street level and folded into the cellar of a restaurant at Largo Carrobbio.",
  },
};

/** Look up a matching description for an OSM building name. */
export function milanEntry(name: string | null | undefined, _osmId?: number): MilanEntry | undefined {
  if (!name) return undefined;
  // "Parco Archeologico dell'Anfiteatro Romano" literally contains "Anfiteatro Romano" as a
  // substring — it's the modern park boundary around the ruin, not the ruin itself, so it must
  // not inherit the amphitheatre's own description. Same guard covers the plain "Parco
  // Archeologico" museum/park-facility polygon, which shouldn't match anything in this table.
  if (name.includes("Parco Archeologico")) return undefined;
  const keys = Object.keys(MILAN_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return MILAN_LOOKUP[k];
  }
  return undefined;
}
