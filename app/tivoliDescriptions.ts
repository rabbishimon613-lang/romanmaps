/** Hand-curated descriptions for named buildings at Tivoli (ancient Tibur, Italy) — same pattern
 * as app/ostiaDescriptions.ts and the other curate-buildings files [06-P0-2]. Keys are exact
 * substrings of public/data/sites/tivoli_buildings.geojson's `name` property, in Italian,
 * matching invariant 1.5's carve-out for the raw OSM layer.
 *
 * Filled in by cloud shift 44 research — see SHIFT_LOG.md for sourcing detail. Note: none of these
 * entries are Hadrian's Villa (Villa Adriana) — that complex began construction in 118 CE, a year
 * past this map's 117 CE snapshot, and isn't tagged in this site's building file.
 */

export type TivoliEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const TIVOLI_LOOKUP: Record<string, TivoliEntry> = {
  "Anfiteatro di Bleso": {
    english: "Amphitheatre of Bleso",
    category: "amphitheater",
    extant_117ce: false,
    built: 130,
    description:
      "Hadrian's amphitheatre at Tibur seated 2,000 spectators for gladiatorial bouts and staged beast hunts. Marcus Tullius Rufus funded its lavish inauguration in honor of his father Blaesus, wrapping the elliptical arena in blind brick arcades on a travertine podium. Its own dedicatory inscription ties it to Hadrian's court, whose reign began the same day Trajan died — in 117 CE this ground still held nothing.",
  },
  "Santuario di Ercole Vincitore": {
    english: "Sanctuary of Hercules Victor",
    category: "temple",
    extant_117ce: true,
    built: -120,
    description:
      "Tibur's Republican-era builders raised one of Italy's largest sanctuaries to Hercules Victor on terraces above the Aniene gorge, second in the Mediterranean only to the god's shrine at Cadiz. A covered street tunneled straight through the sanctuary's foundations, carrying the Via Tiburtina beneath the sacred terrace. Augustus himself came here to dispense justice, and by 117 the sanctuary had drawn pilgrims and petitioners for two centuries.",
  },
  Teatro: {
    english: "Theatre of the Sanctuary of Hercules Victor",
    category: "theater",
    extant_117ce: true,
    built: -120,
    description:
      "A semicircular theatre rose within the Sanctuary of Hercules Victor, its cavea cut into Tibur's hillside to seat crowds gathered for the sanctuary's festivals. Republican builders raised it alongside the sanctuary's porticoes in the late 2nd century BCE, and Augustan-era masons later reworked the stage. The theatre faced the temple platform directly, folding performance into the god's own precinct, still active when Trajan died in 117.",
  },
  "Tempio della Sibilla": {
    english: "Temple of the Sibyl",
    category: "temple",
    extant_117ce: true,
    built: -150,
    description:
      "Tibur's acropolis carried a rectangular Ionic temple raised in the 2nd century BCE, its cella wrapped in a false colonnade of twelve engaged half-columns on a travertine podium. Standing beside the round Temple of Vesta just steps away, it gave the acropolis its famous double silhouette above the Aniene falls. Both temples had already watched over the gorge for generations by 117.",
  },
  "Tempio di Vesta": {
    english: "Temple of Vesta",
    category: "temple",
    extant_117ce: true,
    built: -80,
    description:
      "A circular tholos crowned Tibur's acropolis above the Aniene falls, its cella ringed by eighteen fluted Corinthian columns on a travertine drum. Builders raised it around 80 BCE in the late Republic, and its capitals grew so admired that architects later dubbed the variant the 'Tivoli order.' Ten of those columns still stand today, overlooking the same gorge they did in 117.",
  },
  "Tempio della Tosse": {
    english: "Tempio della Tosse (a Roman mausoleum, not a temple)",
    category: "tomb",
    extant_117ce: false,
    built: 320,
    description:
      "A round mausoleum in banded brick and stone rose along the Via Tiburtina below Tivoli's center in the early 4th century, its dome recalling the Pantheon and the tomb of Helena. Builders raised it atop the unfinished vestibule of a 1st-century-BCE villa, and locals later nicknamed it for the Tuscia family thought buried within. In 117 CE, two centuries before it existed, that vestibule still sat unfinished.",
  },
};

/** Look up a matching description for an OSM building name. */
export function tivoliEntry(name: string | null | undefined): TivoliEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(TIVOLI_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return TIVOLI_LOOKUP[k];
  }
  return undefined;
}
