/** Hand-curated descriptions for named buildings at Beneventum (modern Benevento, Italy) — same
 * pattern as app/ostiaDescriptions.ts and the other curate-buildings files [06-P0-2]. Keys are
 * exact substrings of public/data/sites/beneventum_buildings.geojson's `name` property, in
 * Italian, matching invariant 1.5's carve-out for the raw OSM layer.
 *
 * "Terme romane" and "Terme romane - resti della chiesa di San Pietro delle Monache" are the same
 * bath complex tagged twice in OSM (155m apart, both on Piazza Cardinal Pacca beside the forum) —
 * one key covers both via substring match rather than duplicating the entry.
 *
 * Filled in by cloud shift 44 research — see SHIFT_LOG.md for sourcing detail.
 */

export type BeneventumEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const BENEVENTUM_LOOKUP: Record<string, BeneventumEntry> = {
  "Arco di Traiano": {
    english: "Arch of Trajan",
    category: "arch",
    extant_117ce: true,
    built: 114,
    description:
      "Rome dedicated this triumphal arch in 114 CE to mark Trajan's new Via Traiana, the fast road to Brundisium that began at its foot. Carved from Parian marble over limestone, the 15.6-meter arch rose at the city gate with reliefs of the emperor's Dacian wars, the founding of colonies, and the alimenta child-support program. It had stood for three years by the time Trajan died, and survives today almost intact, one of Rome's best-preserved arches.",
  },
  "Anfiteatro romano di Benevento": {
    english: "Roman Amphitheatre of Benevento",
    category: "amphitheater",
    extant_117ce: true,
    built: 60,
    description:
      "Emperor Nero watched a gladiator show at this amphitheatre in 63 CE, according to Tacitus, decades before Trajan's reign began. Built on the city's edge near the crossroads for quick crowd access, the arena measured roughly 160 by 130 meters and rivaled the amphitheatres of Capua and Verona in size. A detached branch of Rome's Ludus Magnus gladiator school trained fighters here. Archaeologists rediscovered its buried remains only in 1985.",
  },
  "Foro romano": {
    english: "Roman Forum of Beneventum",
    category: "civic",
    extant_117ce: true,
    built: -268,
    description:
      "Beneventum's forum anchored the Latin colony founded here in 268 BCE, sitting where the decumanus of Corso Garibaldi crossed the ancient cardo. By Trajan's reign, brick civic buildings and temples to the imperial cult ringed the square. Wartime bombing exposed massive brick ruins that remain only partly excavated today. The forum sat roughly 300 meters from the Arch of Trajan, in the heart of the colony.",
  },
  "Obelisco del tempio di Iside": {
    english: "Obelisk of the Temple of Isis",
    category: "religious",
    extant_117ce: true,
    built: 88,
    description:
      "Domitian raised twin granite obelisks around 88-89 CE to flank the entrance of Benevento's new temple to Isis, carving hieroglyphs that hailed her as 'Lady of Benevento.' Egyptologist Ernesto Schiaparelli later deciphered the inscriptions, which paired devotion to the goddess with tribute to the emperor who built her sanctuary. The finds make Benevento home to the largest collection of original Egyptian antiquities outside Egypt. One obelisk still stands in Piazza Papiniano today.",
  },
  "Terme romane": {
    english: "Roman Baths (Piazza Cardinal Pacca)",
    category: "water",
    extant_117ce: true,
    built: 50,
    description:
      "A monumental bath complex once filled the area of today's Piazza Cardinal Pacca, right beside Beneventum's forum. Brick masonry and floor remains found there date to the 1st and 2nd centuries CE, the era of the city's building boom under Trajan. Medieval nuns later built the church and convent of San Pietro delle Monache directly into one of the bath halls, preserving its walls through reuse. Excavators have since uncovered a mosaic floor and bathing pools beneath the square.",
  },
  "Edificio termale": {
    english: "Bath Building (Terme di San Cristiano)",
    category: "water",
    extant_117ce: false,
    built: 120,
    description:
      "A second, separate bath building stood in Beneventum's Triggio district, west of the forum and distinct from the baths at Piazza Cardinal Pacca. Excavators date its expansion to the first half of the 2nd century CE, a window that straddles Trajan's death too closely to call with confidence. Without a firmer date, this snapshot treats it as not yet built on 11 August 117 rather than guess.",
  },
  "Torre tardoantica": {
    english: "Late Antique Tower",
    category: "military",
    extant_117ce: false,
    built: 550,
    description:
      "A defensive tower reinforced Beneventum's circuit walls as the Western Roman world gave way to Byzantine and Lombard control, part of a wall restoration dated to the 6th or 7th century. Trajan's Beneventum needed no such fortification — the city sat safely inland in the settled heart of Italy. In 117 CE this stretch of wall was still four centuries away from needing a tower at all.",
  },
  "Necropoli longobarda": {
    english: "Lombard Necropolis",
    category: "tomb",
    extant_117ce: false,
    built: 650,
    description:
      "A Lombard cemetery grew up at Beneventum after the Germanic Lombards made the city capital of their southern Italian duchy, burying their dead here across the 7th and 8th centuries. The Lombards didn't cross into Italy until 568 CE, close to five centuries after Trajan's death. In 117 CE this ground held nothing but the ordinary fields of a thriving Roman colony.",
  },
};

/** Look up a matching description for an OSM building name. */
export function beneventumEntry(name: string | null | undefined): BeneventumEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(BENEVENTUM_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return BENEVENTUM_LOOKUP[k];
  }
  return undefined;
}
