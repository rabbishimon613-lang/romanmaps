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

export const CORINTH_LOOKUP: Record<string, CorinthEntry> = {
  "Αγορά αρχαίας Κορίνθου": {
    english: "Agora of Ancient Corinth (Roman Forum)",
    category: "civic",
    extant_117ce: true,
    built: -44,
    description:
      "Julius Caesar's colonists laid out Corinth's Roman forum in 44 BCE atop the ruined Greek marketplace, and it grew into a plaza some 200 meters long, ringed by shops, temples and stoas. At its center stood the marble Bema, the raised platform where the proconsul Gallio tried the Apostle Paul around 51 CE. The forum still bustled as the marketplace of Achaea's provincial capital when Trajan died in 117.",
  },
  "Ιουλία βασιλική": {
    english: "Julia Basilica",
    category: "civic",
    extant_117ce: true,
    built: -1,
    description:
      "Corinth's colonists raised the Julian Basilica on the forum's east side around 1 BCE, dedicating it to the Julio-Claudian imperial family with more than a dozen marble statues of Augustus and his heirs. The two-story hall rose on a podium over four meters high and served as the law court for the province of Achaea. It still dominated the forum's east end when Trajan died in 117.",
  },
  "Νότια στοά": {
    english: "South Stoa",
    category: "civic",
    extant_117ce: true,
    built: -300,
    description:
      "Corinthian builders raised the South Stoa around 300 BCE as one of the largest porticoed buildings in Greece, its shaded arcade lined with wine shops cooled by individual wells behind 71 Doric columns. After Julius Caesar refounded Corinth as a Roman colony, builders converted its rooms into offices, a fountain house and the city council's meeting hall. The old Greek colonnade, stretching some 164 meters, still framed the forum's south side in 117.",
  },
  "Corinth amphitheater": {
    english: "Amphitheatre of Corinth",
    category: "amphitheater",
    extant_117ce: true,
    built: -40,
    description:
      "Corinth's Roman colonists cut an earthen amphitheatre into a ravine at the city's edge soon after Julius Caesar refounded the colony, one of only a few ever built anywhere in the Greek world. Spectators packed its sloped earthen banks, not marble tiers, to watch gladiators and beast hunts. It had entertained the city for over 150 years by the time Trajan died in 117.",
  },
};

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
