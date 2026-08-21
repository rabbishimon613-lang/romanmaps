/** Hand-curated descriptions for named buildings at Sabratha (Libya) — same pattern as
 * app/ostiaDescriptions.ts and the other curate-buildings files, the fifteenth site to get this
 * treatment [06-P0-2]. Keys are exact substrings of public/data/sites/sabratha_buildings.geojson's
 * `name` property — only 4 real named features here, a thin site like Volubilis and Timgad.
 *
 * Sabratha was already an old Phoenician trading post by the time Rome absorbed Tripolitania, and
 * by 117 CE it had been a Roman municipium for decades. Almost everything a modern visitor
 * photographs here — the theatre, the Antonine-era forum temple, the Baths of Oceanus — belongs to
 * the city's 2nd-and-3rd-century building boom, the same pattern this project has now confirmed at
 * Leptis Magna and Timgad along the same Tripolitanian coast. Only the Temple of Isis, an
 * Augustan-Flavian foundation, genuinely predates the snapshot.
 *
 * Sources: World History Encyclopedia's Sabratha pages; historyandarchaeologyonline.com; Études et
 * Travaux XXX (2017) on Sabratha's bath architecture; Vici.org's Sabratha gazetteer. Researched via
 * a background WebSearch pass (WebFetch to Wikipedia/Livius/World History Encyclopedia all stayed
 * blocked in this environment), personally reviewed. */

export type SabrathaEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const SABRATHA_LOOKUP: Record<string, SabrathaEntry> = {
  "Antonine temple": {
    english: "Antonine Temple",
    category: "temple",
    extant_117ce: false,
    built: 150,
    description:
      "A temple raised on Sabratha's forum during the building boom of Antoninus Pius's reign, part of a wholesale remaking of the city's civic center around the mid-2nd century CE. In 117 CE this stretch of the forum was still open ground or held whatever more modest structure came before it — the temple itself was still more than thirty years away.",
  },
  "Baths of Oceanus in Sabratha": {
    english: "Baths of Oceanus",
    category: "bath",
    extant_117ce: false,
    built: 150,
    description:
      "A public bathhouse named for the bearded face of the sea god Oceanus set into its tepidarium's mosaic floor, built as Sabratha reorganized itself in the wake of Flavian-era urban growth around the mid-2nd century CE. In 117 CE bathers here had no such building yet — the whole complex, mosaic included, was still decades in the future.",
  },
  "Teatro de Sabratha": {
    english: "Theatre of Sabratha",
    category: "theater",
    extant_117ce: false,
    built: 200,
    description:
      "Sabratha's grandest surviving monument, a three-story stage building carved with reliefs of Dionysus, Hercules and the Muses, seating thousands on a curved cavea facing the sea. Work began under Marcus Aurelius, continued under Commodus, and finished under the Severan dynasty around 200 CE. In 117 CE, under Trajan, no theatre stood here at all — the site was still generations from its start.",
  },
  "Temple of Isis, Sabratha": {
    english: "Temple of Isis",
    category: "temple",
    extant_117ce: true,
    built: -27,
    description:
      "An Egyptian cult temple first built under Augustus and enlarged under Vespasian in the 70s CE, serving the Isis worship that spread through Roman port cities on trade routes from Alexandria. By 117 CE it had already stood for well over a century, one of the few buildings at Sabratha genuinely old enough for Trajan's contemporaries to call venerable.",
  },
};

/** Look up a matching description for an OSM building name. */
export function sabrathaEntry(name: string | null | undefined): SabrathaEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(SABRATHA_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return SABRATHA_LOOKUP[k];
  }
  return undefined;
}
