/** Hand-curated descriptions for named buildings in Baiae (Baia) — same pattern as
 * app/ostiaDescriptions.ts, app/pompeiiDescriptions.ts, app/herculaneumDescriptions.ts,
 * app/ephesusDescriptions.ts, app/delphiDescriptions.ts, app/jerashDescriptions.ts,
 * app/trierDescriptions.ts, app/meridaDescriptions.ts, app/palmyraDescriptions.ts,
 * app/athensDescriptions.ts, app/leptisMagnaDescriptions.ts, app/timgadDescriptions.ts,
 * app/djemilaDescriptions.ts, app/volubilisDescriptions.ts, app/sabrathaDescriptions.ts,
 * app/baalbekDescriptions.ts, app/luniDescriptions.ts, app/italicaDescriptions.ts,
 * app/paestumDescriptions.ts, app/portusDescriptions.ts and app/cumaeDescriptions.ts — the
 * twenty-second site to get this treatment [06-P0-2].
 *
 * The most fashionable resort on the Bay of Naples, Baiae drew emperors, senators and satirists
 * alike to its volcanic hot springs from the late Republic onward — Seneca and Martial both wrote
 * of its luxury and scandal. Its famous domed "temples" of Diana, Mercury and Venus were never
 * shrines at all but free-standing halls of a sprawling imperial bath complex, misnamed by 18th-
 * and 19th-century antiquarians who mistook their scale for sacred architecture — the mistake is
 * settled fact across the park's own documentation, not a live dispute, so it's stated plainly
 * below rather than hedged. Centuries of bradyseism, the volcanic ground movement of the Campi
 * Flegrei, have since sunk much of the ancient shoreline, including entire villas, several meters
 * beneath the bay.
 *
 * One OSM-tagged building, "Villa Il Soffione," was deliberately left out rather than guessed:
 * every search result for that name is a modern wedding venue/restaurant in Bacoli, and its own
 * marketing copy's claim to sit on "an ancient Roman structure" is unsourced promotional text
 * with no independent archaeological confirmation found anywhere — real data or don't include it.
 * It falls through to the generic archaeological-site description rather than being written up.
 * "Columbari" is kept but written generically (a columbarium as a building type) rather than
 * about one confirmed specific structure — no source located a named, excavated columbarium
 * within the Baia park's own sector list (Ambulatio, Sosandra, Mercurio, Diana, Venere), only the
 * OSM tag itself; the description makes no specific claim beyond what a Baiae-era columbarium
 * generally was.
 *
 * Researched via a background WebSearch pass (the Parco Archeologico Campi Flegrei's own site,
 * Italian Wikipedia, academic PDFs on Punta Epitaffio's underwater excavation, Guinness World
 * Records' dome-history entry — direct fetch of most of these was network-blocked in the
 * researching session, so facts are corroborated through search-snippet synthesis, the same
 * constraint every recent shift's Track A work has documented), personally reviewed before
 * merging. */

export type BaiaeEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

// Keys are matched as substrings against the OSM name (Italian), longer keys checked first, so
// keep entries specific to one building.
export const BAIAE_LOOKUP: Record<string, BaiaeEntry> = {
  "Tempio di Diana": {
    english: "\"Temple of Diana\" (bath hall)",
    category: "bath",
    extant_117ce: false,
    built: 230,
    description:
      "Despite its name, the so-called Temple of Diana was never a shrine — it was the last and largest of Baiae's great thermal halls, raised under the Severan emperors around 230 CE. Its ogival dome, built from ever-narrower rings of tufa and brick, sheltered a pool fed by the volcanic springs of the Campi Flegrei. Marble friezes of hunting scenes once ran along its walls, misleading 18th-century antiquarians into naming it for the huntress goddess. The hall did not yet exist on 11 August 117 CE, more than a century before the Severans built it.",
  },
  "Tempio di Mercurio": {
    english: "\"Temple of Mercury\" (\"Temple of the Echo\")",
    category: "bath",
    extant_117ce: true,
    built: -10,
    description:
      "Nicknamed the Temple of the Echo for the way a whisper carries around its curve, the so-called Temple of Mercury was actually the frigidarium of Baiae's bath complex, roofed between the late 1st century BCE and the 1st century CE with the oldest large-scale concrete dome in the Roman world. Its 21-meter span, pierced by a central oculus and four windows, predated the Pantheon's dome by roughly a century and a half. Bathers once swam in a cold pool beneath its coffered curve. By 117 CE the dome had sheltered swimmers for well over a century.",
  },
  "Tempio di Venere": {
    english: "\"Temple of Venus\" (bath hall)",
    category: "bath",
    extant_117ce: false,
    built: 125,
    description:
      "Like its neighbors, the so-called Temple of Venus was a bathhouse, not a shrine — an octagonal natatio built for Baiae's monumental thermal complex under Hadrian. Its umbrella dome spanned roughly 25 meters and was lined inside with marble slabs and mosaic. Antiquarians later named it for the goddess of love simply for its temple-like grandeur. Construction began only after Hadrian succeeded Trajan as emperor, so the hall did not yet stand on 11 August 117 CE.",
  },
  Columbari: {
    english: "Columbarium",
    category: "tomb",
    extant_117ce: true,
    description:
      "A columbarium at Baiae held the resort town's cremated dead in rows of small wall niches, each shaped to cradle a single cinerary urn, built in the same style as the columbaria erected across Campania and Rome under the early Empire. Vaulted brick chambers kept the urns dry and reachable for the offerings families left at each niche. The type flourished as cremation, not burial, remained the standard funerary rite into the 2nd century CE. By 117 CE such columbaria had long served households too modest for a private tomb.",
  },
  "Villa Ferretti": {
    english: "Villa Ferretti (Villa of Publius Cornelius Dolabella)",
    category: "villa",
    extant_117ce: true,
    built: -45,
    description:
      "Terraced across the hillside above Baiae's harbor, this seaside villa is now identified as the residence of Publius Cornelius Dolabella, Cicero's son-in-law and a Caesarian partisan, built in the mid-1st century BCE. Underwater surveys have traced its lower floors descending beneath the waves, submerged over centuries by the coast's slow bradyseismic sinking. The property sat buried under illegal parking until archaeologists cleared it in the 2010s. By 117 CE the villa had already passed through Rome's elite for over 160 years.",
  },
  "Villa Epitaffio": {
    english: "Villa dell'Epitaffio (Nymphaeum of Punta Epitaffio)",
    category: "villa",
    extant_117ce: true,
    built: 45,
    description:
      "This shoreline villa complex at Punta dell'Epitaffio centered on a grand nymphaeum-triclinium built under Claudius, an 18-by-10-meter marble hall with a curved apse where guests dined beside a central basin flanked by four statue-filled niches. Divers recovered its marble sculpture group only in 1969, after bradyseism had sunk the site some 7 meters below the Bay of Naples. The villa likely belonged to Rome's imperial household, overlooking the tidal lake Seneca once described. By 117 CE the villa and its banqueting hall had entertained guests on this shore for over sixty years.",
  },
};

/** Look up a matching description for an OSM building name. */
export function baiaeEntry(name: string | null | undefined): BaiaeEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(BAIAE_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return BAIAE_LOOKUP[k];
  }
  return undefined;
}
