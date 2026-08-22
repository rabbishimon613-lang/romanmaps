/** Hand-curated descriptions for named buildings at Rimini (ancient Ariminum, Italy) — same pattern
 * as app/ostiaDescriptions.ts and the other curate-buildings files [06-P0-2]. Keys are exact
 * substrings of public/data/sites/rimini_buildings.geojson's `name` property, in Italian, matching
 * invariant 1.5's carve-out for the raw OSM layer.
 *
 * Ariminum sat at the junction of the Via Flaminia (from Rome), the Via Aemilia (to Piacenza) and
 * the Via Popilia (to Aquileia) — one of the empire's real road hubs. By 117 CE its Augustan-era
 * monuments (the Arch, the Bridge, the rebuilt Sullan-era gate) were already a century-plus old;
 * the amphitheatre and the Domus del chirurgo both belong to the 2nd century CE and postdate
 * Trajan's death.
 *
 * Two real name collisions handled in `riminiEntry()` itself rather than in the lookup table:
 * "ex Stazione di Rimini Porta Montanara" is a 1916 (closed 1960) railway station named after its
 * proximity to the real Roman gate, not the gate itself — excluded before the substring matcher
 * runs, since "Porta Montanara" is a literal substring of its name and would otherwise misdescribe
 * an abandoned modern station as a Roman monument. "Pietre del Ponte di Tiberio non rimontate"
 * (loose ancient stone blocks set aside during a modern restoration of the bridge) is excluded the
 * same way — real Roman stone, but not a structure with its own construction/use history distinct
 * from the bridge, so a click on it shouldn't assert it *is* the standing bridge. "Porta Gervasona"
 * (Malatesta-era medieval wall, rebuilt 1733) and "Tempio Malatestiano" (15th-century Renaissance
 * church) are simply not entered — neither is Roman.
 *
 * Sources: comune.rimini.it and museicomunalirimini.it (the city's own archaeological-area and
 * museum pages), riminiturismo.it (official tourism board), the Soprintendenza Archeologia Belle
 * Arti e Paesaggio dell'Emilia-Romagna's Domus del chirurgo page, History Hit's "Arch of Augustus –
 * Rimini", Italian and English Wikipedia's Ariminum-monument articles, and a peer-reviewed Oxford
 * Academic article on the Domus's surgical-instrument hoard — cross-referenced, personally
 * reviewed, researched via a background WebSearch pass (direct fetches to these domains stayed
 * blocked in this environment). Filled in by cloud shift 45 — see SHIFT_LOG.md for sourcing detail.
 */

export type RiminiEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const RIMINI_LOOKUP: Record<string, RiminiEntry> = {
  "Arco d'Augusto": {
    english: "Arch of Augustus",
    category: "arch",
    extant_117ce: true,
    built: -27,
    description:
      "The Senate dedicated this freestanding arch to Augustus in 27 BCE for restoring the Via Flaminia, the road linking Ariminum to Rome, and it still marks the road's start at the city's southern approach. Standing roughly 17 meters tall in Istrian stone, its vault carved with roundels of Jupiter, Neptune, Apollo and Roma, it's widely reckoned the oldest Roman triumphal arch still standing. By 117 CE it had greeted travelers on the Via Flaminia for a century and a half.",
  },
  "Anfiteatro Romano": {
    english: "Roman Amphitheatre",
    category: "amphitheater",
    extant_117ce: false,
    built: 130,
    description:
      "An elliptical brick amphitheatre on Ariminum's eastern edge near the port, its four concentric rings of seating built to hold roughly 10,000 to 12,000 spectators. A coin of Hadrian found embedded in its masonry dates construction to the second quarter of the 2nd century CE, part of the public-works building wave that followed Trajan's reign. In 117 CE the site held nothing of it yet — ground didn't break here until after Hadrian became emperor.",
  },
  "Domus del chirurgo": {
    english: "House of the Surgeon",
    category: "domus",
    extant_117ce: false,
    built: 150,
    destroyed: 260,
    description:
      "A two-story townhouse at what's now Piazza Ferrari, remodeled from an earlier building's peristyle in the second half of the 2nd century CE. Excavators found it holding a hoard of more than 150 surgical and pharmacological instruments belonging to its last occupant, a physician, making it one of the best-documented sites of Roman medical practice anywhere in the empire. A fire destroyed it in the mid-to-late 3rd century, likely during Germanic raids under Gallienus — but in 117 CE, decades before it was even built, the plot held an earlier, unrelated dwelling.",
  },
  "Porta Montanara": {
    english: "Porta Montanara",
    category: "gate",
    extant_117ce: true,
    built: -80,
    description:
      "One of Ariminum's four Roman gates, rebuilt in the 1st century BCE as part of a wall reconstruction after the city backed the losing side in Rome's civil wars between Marius and Sulla. Originally a twin-arched gateway carrying the road toward the Marecchia valley hills, it had stood for close to two centuries by 117 CE. Badly damaged in a 1943 air raid, it was carefully dismantled and rebuilt on its original site on Via Garibaldi in 2003–04.",
  },
  "Ponte di Tiberio": {
    english: "Bridge of Tiberius",
    category: "bridge",
    extant_117ce: true,
    built: 14,
    description:
      "A five-arch bridge of Istrian stone over the Marecchia river, begun under Augustus in 14 CE and finished under Tiberius in 21 CE, as its own dedicatory inscription honoring both emperors records. It marks the point where the Via Aemilia toward Piacenza and the Via Popilia toward Aquileia both began, and by 117 CE had carried traffic across the river for nearly a century. It's still open to foot and light traffic today, one of the very few Roman bridges still serving its original function.",
  },
};

/** Look up a matching description for an OSM building name. */
export function riminiEntry(name: string | null | undefined, _osmId?: number): RiminiEntry | undefined {
  if (!name) return undefined;
  if (name.includes("ex Stazione") || name.includes("non rimontate")) return undefined;
  const keys = Object.keys(RIMINI_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return RIMINI_LOOKUP[k];
  }
  return undefined;
}
