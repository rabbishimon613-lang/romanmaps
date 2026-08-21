/** Hand-curated descriptions for named buildings at Baalbek (ancient Heliopolis, Lebanon) — same
 * pattern as app/ostiaDescriptions.ts and the other curate-buildings files, the sixteenth site to
 * get this treatment [06-P0-2]. Keys are exact substrings of
 * public/data/sites/baalbek_buildings.geojson's `name` property (mostly Arabic — OSM's local-
 * language convention for this site, matching invariant 1.5's carve-out for the raw OSM layer).
 * Two generic tags ("حوض", a plain basin/pool, and "عواميد بعلبك", "columns of Baalbek" with no
 * specific building named) are too vague to curate and are skipped.
 *
 * This project already settled the Temple of Jupiter and Temple of Bacchus dating question in an
 * earlier pass (`[08-P1-6]` baalbek-dating, cloud shift 32) — Jupiter's `built: 60` and Bacchus's
 * `built: 150` are reused here, not re-researched, with descriptions written fresh for this file's
 * voice. Baalbek's approach sequence — Propylaea, Hexagonal Court, Great Court — all postdate 117
 * CE as finished monuments, part of a building program that ran from Trajan's own reign (who began
 * the Great Court's forecourt, still under construction when he died) through the Severan dynasty a
 * century later. The round Temple of Venus is a distinct, later Severan addition entirely.
 *
 * Sources: Livius.org's Baalbek/Heliopolis pages (Temple of Jupiter, Propylaea, Hexagonal Court,
 * Great Court, Temple of Venus); Wikipedia's Temple of Bacchus page; Rome Art Lover's Baalbek notes.
 * Researched via a background WebSearch pass (WebFetch to Livius.org/Wikipedia stayed blocked in
 * this environment), personally reviewed. */

export type BaalbekEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const BAALBEK_LOOKUP: Record<string, BaalbekEntry> = {
  Propylaea: {
    english: "Propylaea",
    category: "civic",
    extant_117ce: false,
    built: 220,
    description:
      "The monumental stairway and columned gateway meant to announce the sanctuary of Jupiter Heliopolitanus to arriving pilgrims, planned in the Antonine period but not actually built until the joint reign of Septimius Severus and Caracalla in the early 3rd century CE. In 117 CE no such grand entrance existed — visitors reached the sanctuary by a far humbler approach, over a century before this staircase was cut.",
  },
  "الفناء السداسي": {
    english: "Hexagonal Court",
    category: "civic",
    extant_117ce: false,
    built: 247,
    description:
      "An unusual six-sided forecourt linking the Propylaea to the Great Court beyond, planned alongside the rest of the entrance sequence but only built under the short-lived emperor Philip the Arab around 244-249 CE — and, by some accounts, never entirely finished, with sculptural details left incomplete. In 117 CE this whole approach to the sanctuary was still a blank slate, thirteen decades from construction.",
  },
  "غران باتيو": {
    english: "Great Court",
    category: "civic",
    extant_117ce: false,
    built: 138,
    description:
      "The vast colonnaded forecourt fronting the Temple of Jupiter, its final hexagonal-exedrae form begun under Antoninus Pius and only finished under the Severan dynasty in the early 3rd century. Trajan himself had already broken ground on an earlier version of this space, adding a forecourt in front of Nero's older altar-tower — which is exactly why, when he died on 11 August 117, the ground here was an active construction site rather than open field or finished monument. The grand porticoed court visitors walk through today is a later, Antonine-to-Severan rebuild of what Trajan left half-done.",
  },
  "معبد باخوس": {
    english: "Temple of Bacchus",
    category: "temple",
    extant_117ce: false,
    built: 150,
    description:
      "One of the best-preserved Roman temples anywhere, built for the wine god Bacchus beside the great sanctuary of Jupiter, its cella walls carved floor to ceiling with vines, grapes and scenes of Bacchic ritual. Construction began under Antoninus Pius around 150 CE, a full generation after Trajan's death. In 117 CE the site held nothing of it yet.",
  },
  "معبد جوبيتر": {
    english: "Temple of Jupiter",
    category: "temple",
    extant_117ce: true,
    built: 60,
    description:
      "The centerpiece of Roman Heliopolis, dedicated to Jupiter Optimus Maximus Heliopolitanus and raised on six towering Corinthian columns still counted among the tallest ever built by Rome. A stonemason left his name and the date on a column drum — 2 August 60 CE — fixing when the columns themselves went up. By 117 CE the temple proper stood finished, even as Trajan's own forecourt addition out front remained a live building site.",
  },
  "معبد فينوس": {
    english: "Temple of Venus",
    category: "temple",
    extant_117ce: false,
    built: 230,
    description:
      "A small, strikingly unconventional round temple near the main sanctuary, its curved entablature and scalloped podium ranking among the most original designs Roman architects ever built. Raised under the Severan dynasty in the first half of the 3rd century CE, it belongs to the same later building wave as Baalbek's Propylaea and Hexagonal Court. In 117 CE this shape didn't exist anywhere in the Roman world yet, let alone here.",
  },
};

/** Look up a matching description for an OSM building name. */
export function baalbekEntry(name: string | null | undefined): BaalbekEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(BAALBEK_LOOKUP).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    if (name.includes(k)) return BAALBEK_LOOKUP[k];
  }
  return undefined;
}
