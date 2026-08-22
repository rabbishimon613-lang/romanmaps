/** Hand-curated descriptions for named buildings at Palestrina (ancient Praeneste, Italy) — same
 * pattern as app/ostiaDescriptions.ts and the other curate-buildings files [06-P0-2]. Keys are
 * exact substrings of public/data/sites/palestrina_buildings.geojson's `name` property, in
 * Italian, matching invariant 1.5's carve-out for the raw OSM layer.
 *
 * Filled in by cloud shift 44 research — see SHIFT_LOG.md for sourcing detail.
 */

export type PalestrinaEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const PALESTRINA_LOOKUP: Record<string, PalestrinaEntry> = {
  "Area Archeologica - Tempio Dea Fortuna": {
    english: "Sanctuary of Fortuna Primigenia",
    category: "religious",
    extant_117ce: true,
    built: -110,
    description:
      "Praeneste's sanctuary to Fortuna Primigenia climbed Monte Ginestro in seven vast terraces, ranking among the largest religious complexes ever built in Italy. Builders raised it in the late 2nd century BCE, crowning the hill with a domed rotunda visible for miles. Pilgrims climbed its ramps to consult Praeneste's famous oracle, drawing wooden lots for answers to their questions. Cicero praised its fame, and its terraces still shape the modern town built atop them.",
  },
  "Area Sacra Foro di Preneste - Antro delle Sorti": {
    english: "Grotto of the Lots (forum nymphaeum)",
    category: "religious",
    extant_117ce: true,
    built: -110,
    description:
      "A rock-cut grotto beside Praeneste's forum held one of the finest Hellenistic mosaics in Italy, a polychrome floor teeming with fish, crabs and octopi. Alexandrian craftsmen laid the mosaic on site in the late 2nd century BCE, framing it with three deep niches and artificial stalactites. Locals nicknamed it the Grotto of the Lots after the city's oracle, though the true oracle stood higher up in the Fortuna sanctuary. A monumental tuff archway framed its entrance.",
  },
  "Basilica Civile di Praeneste": {
    english: "Civil Basilica of Praeneste",
    category: "civic",
    extant_117ce: true,
    built: -120,
    description:
      "Praeneste's civil basilica anchored the town forum, a long colonnaded hall where magistrates dispensed justice and merchants conducted business. Builders raised it around 120 BCE during the city's Hellenistic-influenced building boom, beside the sacred grotto and a hall holding the famed Nile mosaic. Rows of columns divided the interior into aisles beneath a coffered roof. The basilica later lay buried beneath Palestrina's medieval cathedral, preserving its foundations intact.",
  },
  "Tempio di Giove": {
    english: "Temple of Jupiter",
    category: "religious",
    extant_117ce: true,
    built: -320,
    description:
      "A temple to Jupiter rose in the heart of Praeneste's forum as early as the late 4th century BCE, among the oldest monuments in the city center. Builders faced its podium with massive squared tufa blocks, remnants of which still stand today. Workers rebuilt its stairs and forecourt paving around 100 BCE when the whole forum was remodeled. Centuries later Praeneste's Christians built their cathedral directly atop its foundations, preserving the temple's core beneath the church crypt.",
  },
  "terme romane": {
    english: "Roman Baths",
    category: "water",
    extant_117ce: true,
    built: 25,
    description:
      "Praeneste's lower town spread downhill from the sanctuary along a Roman street grid, and excavations there uncovered the remains of two public bathhouses. Builders raised them during the 1st and 2nd centuries CE as the post-Sullan town grew below the old city walls. The baths served residents and travelers passing along the Via Praenestina. Their brick and masonry walls still surface amid Palestrina's modern lower streets today.",
  },
  "Porta del Sole": {
    english: "Sun Gate",
    category: "gate",
    extant_117ce: true,
    built: -150,
    description:
      "Praeneste's southern defenses included a fortified gate faced in massive squared tuff blocks, part of a wall system rebuilt in the mid-2nd century BCE over an even older 3rd-century-BCE polygonal wall. A stone-paved ramp climbed from the gate toward the town's upper quarters. It had guarded this approach for well over two centuries by 117. Centuries later still, Palestrina's Baroque-era Sun Gate rose over the very same ancient threshold.",
  },
};

/** Look up a matching description for an OSM building name. */
export function palestrinaEntry(name: string | null | undefined): PalestrinaEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(PALESTRINA_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return PALESTRINA_LOOKUP[k];
  }
  return undefined;
}
