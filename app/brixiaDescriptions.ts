/** Hand-curated descriptions for named buildings at Brescia (ancient Brixia, Roman Cisalpine
 * Gaul) — same pattern as app/ostiaDescriptions.ts and the other curate-buildings files [06-P0-2].
 * Keys are exact substrings of public/data/sites/brescia_buildings.geojson's `name` property, in
 * Italian, matching invariant 1.5's carve-out for the raw OSM layer.
 *
 * Brixia's Augustan-age forum was rebuilt wholesale under Vespasian in the early 70s CE — the
 * Capitolium, the theatre's Flavian phase, and the basilica all belong to that single building
 * program, commemorating Vespasian's rise to power (the decisive battle against Vitellius in 69 CE
 * was fought near here). By 117 CE the complex was a relatively recent, still-striking monument,
 * only about 44 years old, not yet the ancient fixture it would become to later visitors. Two OSM
 * names in this site's building file turned out to have no Roman-era identity at all and are
 * skipped entirely: "Arco del Granarolo" is an 1822 neoclassical covered arch by Rodolfo Vantini,
 * roughly 1,700 years too late; "Palazzo Martinengo da Barco" is a 17th-century palazzo on Piazza
 * Moretto with no connection to the site's Roman remains (not to be confused with the separate,
 * genuinely Roman-relevant "Palazzo Martinengo Cesaresco Novarino" nearby, which isn't present in
 * this site's OSM extract and so isn't curated here).
 *
 * Sources: Ministero della Cultura's own Brixia archaeological-park pages (cultura.gov.it),
 * Comune di Brescia / brescia.eu official municipal pages, Fondazione Brescia Musei
 * (bresciamusei.com), Lombardia Beni Culturali architecture record sheets, and Italian Wikipedia's
 * Capitolium/Foro romano/Teatro romano di Brescia and Arco del Granarolo articles — cross-
 * referenced across independent hits per fact via a background WebSearch pass (direct fetches to
 * Wikipedia and most of these domains stayed blocked in this environment; the Capitolium's own
 * pediment inscription and its 73 CE dedication under Vespasian are the one fact independently
 * confirmed by multiple primary-source-citing pages, not just search snippets). Filled in by cloud
 * shift 45 — see SHIFT_LOG.md for sourcing detail and the one open follow-up (a tighter destruction
 * date for the Capitolium than "4th century CE").
 */

export type BrixiaEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const BRIXIA_LOOKUP: Record<string, BrixiaEntry> = {
  "Tempio Capitolino": {
    english: "Capitolium of Brixia",
    category: "temple",
    extant_117ce: true,
    built: 73,
    destroyed: 400,
    description:
      "Vespasian's monumental gift to Brixia: three temples in one, dedicated side by side to Jupiter, Juno and Minerva and consecrated in 73 CE, as the emperor's own inscription on the pediment records. It replaced an earlier Republican-era temple on the same spot, raised in gratitude for the city's support during Vespasian's rise to power after the decisive battle nearby against Vitellius. By 117 CE it was a striking, still-fairly-new monument — only about 44 years old — closing the forum's northern side. It didn't survive antiquity: fire during the 4th-century barbarian invasions gutted it, and a later landslide off the Cidneo hill buried the ruins until excavation uncovered them starting in 1823.",
  },
  "Foro Romano": {
    english: "Roman Forum",
    category: "forum",
    extant_117ce: true,
    built: -15,
    description:
      "Brixia's civic center, laid out along the decumanus maximus in the Augustan age as a plaza dominated by an earlier Republican-period temple. Vespasian's building program of the early 70s CE swept that older temple away and rebuilt the forum on a grand scale, flanking it with the new Capitolium and a monumental basilica faced in Botticino stone, the whole square wrapped in a colonnaded portico. By 117 CE it had anchored the town's administrative, religious and commercial life for well over a century.",
  },
  "Teatro Romano": {
    english: "Roman Theatre",
    category: "theater",
    extant_117ce: true,
    built: 73,
    description:
      "A large theatre built into the slope of the Cidneo hill, raised in the Flavian era of the 70s-90s CE as part of the same Vespasianic program that produced the neighboring Capitolium — an earlier Augustan-era structure may have stood on the same spot before it. Seating an estimated 15,000, it ranked among the largest Roman theatres in northern Italy. By 117 CE it had hosted performances for several decades, though its most opulent form — a full rebuild in the late 2nd century, followed by a Severan-era redecoration in imported stone — still lay generations ahead.",
  },
};

/** Look up a matching description for an OSM building name. */
export function brixiaEntry(name: string | null | undefined, _osmId?: number): BrixiaEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(BRIXIA_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return BRIXIA_LOOKUP[k];
  }
  return undefined;
}
