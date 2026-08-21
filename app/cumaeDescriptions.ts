/** Hand-curated descriptions for named buildings in Cumae (Cuma) — same pattern as
 * app/ostiaDescriptions.ts, app/pompeiiDescriptions.ts, app/herculaneumDescriptions.ts,
 * app/ephesusDescriptions.ts, app/delphiDescriptions.ts, app/jerashDescriptions.ts,
 * app/trierDescriptions.ts, app/meridaDescriptions.ts, app/palmyraDescriptions.ts,
 * app/athensDescriptions.ts, app/leptisMagnaDescriptions.ts, app/timgadDescriptions.ts,
 * app/djemilaDescriptions.ts, app/volubilisDescriptions.ts, app/sabrathaDescriptions.ts,
 * app/baalbekDescriptions.ts, app/luniDescriptions.ts, app/italicaDescriptions.ts,
 * app/paestumDescriptions.ts and app/portusDescriptions.ts — the twenty-first site to get this
 * treatment [06-P0-2].
 *
 * Founded by Euboean Greeks in the second half of the 8th century BCE, Cumae was the oldest Greek
 * colony on the Italian mainland before it passed to the Samnites in 421 BCE and to Rome in 338
 * BCE. Its acropolis carried temples to Apollo and, by Roman tradition, Jupiter above a lower
 * town whose forum, amphitheatre and baths reflect over four centuries of Roman civic life by
 * 117 CE. The site's deepest fame rests on the rock-cut Antro della Sibilla, the cave of the
 * prophetic Cumaean Sibyl that Virgil wrote into the Aeneid — solidly sacred to the Sibyl by
 * Roman times, though the cave's own excavation date is genuinely debated among archaeologists
 * (its excavator dated it to the 7th-6th century BCE, others argue for as late as the 4th) and it
 * isn't separately tagged as a clickable building in the source data, so it's noted here rather
 * than invented as a record. Every named building below was already standing well before 117 CE.
 *
 * Researched via a background WebSearch pass (the Vergilian Society's own Study Centre pages,
 * Perseus's Encyclopedia of Classical Sites, fastionline.org excavation reports, Madain Project —
 * direct fetch of most of these was network-blocked in the researching session, so facts are
 * corroborated through search-snippet synthesis, the same constraint every recent shift's Track A
 * work has documented), personally reviewed before merging. One entry ("Le Terme del Foro")
 * carries a single-source century-level date that couldn't be independently cross-confirmed —
 * flagged in case a future shift finds a firmer citation. */

export type CumaeEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

// Keys are matched as substrings against the OSM name (Italian/English), longer keys checked
// first, so keep entries specific to one building.
export const CUMAE_LOOKUP: Record<string, CumaeEntry> = {
  "Anfiteatro di Cuma": {
    english: "Amphitheatre of Cumae",
    category: "theater",
    extant_117ce: true,
    built: -100,
    description:
      "Builders cut Cumae's amphitheatre into the hillside at the end of the 2nd century BCE, making it one of the oldest stone arenas in the Roman world, decades before the Colosseum rose in Rome. A single ring of tuff arches braced the oval cavea just outside the city's southern walls. Gladiator bouts and beast hunts drew crowds from across the Bay of Naples for generations. By 117 CE the arena had already stood for more than two centuries.",
  },
  "Apollo temple": {
    english: "Temple of Apollo",
    category: "temple",
    extant_117ce: true,
    built: -20,
    description:
      "Greek settlers raised a temple to Apollo on Cumae's lower acropolis terrace in the 6th century BCE, tying the site forever to the Cumaean Sibyl whom Virgil later placed here to greet Aeneas. Roman rebuilding gave it its final tufa-and-stucco form under Augustus. A sacred way climbed from its terrace up to the Temple of Jupiter on the acropolis summit. By 117 CE worshippers had climbed its steps for close to six centuries.",
  },
  "Tempio di Giove": {
    english: "Temple of Jupiter",
    category: "temple",
    extant_117ce: true,
    built: -20,
    description:
      "Greek Cumaeans crowned their acropolis with a sanctuary around the 6th century BCE, on the site's highest terrace above the sea. Romans rebuilt the shrine in the late 1st century BCE and rededicated it, by tradition, to Jupiter. Its wide podium dominated the skyline for sailors approaching the coast. By 117 CE the temple had watched over Cumae's harbor for roughly a century under its new Roman dedication.",
  },
  "tomba romana": {
    english: "Roman tomb",
    category: "tomb",
    extant_117ce: true,
    description:
      "Cumae's Roman-era dead lined a monumental necropolis stretching nearly 3 kilometers along the roads out of the city. Wealthier families built barrel-vaulted chamber tombs from massive tufa blocks, their facades stuccoed and painted, to hold cremated ashes in bronze urns alongside jewelry and grave goods. One tomb here, later nicknamed the Mausoleum of the Waxed Heads, held skeletons whose skulls had been replaced with wax death-masks. By 117 CE generations of Cumaeans already rested in these roadside chambers.",
  },
  "Le Terme del Foro": {
    english: "Forum Baths",
    category: "bath",
    extant_117ce: true,
    description:
      "Cumae's Forum Baths stood just off the town's civic square, fed by water piped down the coast on the Aqua Augusta aqueduct. Bathers moved between a frigidarium with two cold pools and a calidarium with three heated basins, warmed by wood-fired furnaces beneath the floors. The complex served the daily routine of a town that had shed its Greek and Samnite past to become thoroughly Roman. By 117 CE Cumaeans had long relied on these baths as the social heart of the forum district.",
  },
  Capitolium: {
    english: "Capitolium",
    category: "temple",
    extant_117ce: true,
    built: 90,
    description:
      "Cumae's Capitolium rose over the forum on the reused podium of a 4th-century-BCE Samnite temple, anchoring the square where the old Greek agora once stood. Dedicated to the Capitoline triad of Jupiter, Juno and Minerva, it reached its final monumental form under Domitian in the late 1st century CE. Its bulk dominated a forum ringed by two-story arcaded shops and fountains. By 117 CE it had stood as Cumae's chief civic temple in finished form for roughly two decades.",
  },
};

/** Look up a matching description for an OSM building name. */
export function cumaeEntry(name: string | null | undefined): CumaeEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(CUMAE_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return CUMAE_LOOKUP[k];
  }
  return undefined;
}
