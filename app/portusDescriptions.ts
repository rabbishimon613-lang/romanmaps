/** Hand-curated descriptions for named buildings in Portus, imperial Rome's harbor complex — same
 * pattern as app/ostiaDescriptions.ts, app/pompeiiDescriptions.ts, app/herculaneumDescriptions.ts,
 * app/ephesusDescriptions.ts, app/delphiDescriptions.ts, app/jerashDescriptions.ts,
 * app/trierDescriptions.ts, app/meridaDescriptions.ts, app/palmyraDescriptions.ts,
 * app/athensDescriptions.ts, app/leptisMagnaDescriptions.ts, app/timgadDescriptions.ts,
 * app/djemilaDescriptions.ts, app/volubilisDescriptions.ts, app/sabrathaDescriptions.ts,
 * app/baalbekDescriptions.ts, app/luniDescriptions.ts, app/italicaDescriptions.ts and
 * app/paestumDescriptions.ts — the twentieth site to get this treatment [06-P0-2].
 *
 * Claudius began Portus around 42 CE as a huge outer harbor on the coast north of the Tiber's
 * mouth, sheltered by two curving moles and a lighthouse island, completing it under Nero in 64
 * CE — but its open basin proved exposed to storms and silting. Trajan fixed this by cutting a
 * hexagonal inner basin directly behind Claudius's harbor: engineered from 103 CE and inaugurated
 * in 113 CE, its six 357-meter sides enclosed 32 hectares of sheltered water, doubling capacity
 * to roughly 500 ships between the two basins combined. Ringed by warehouses, granaries and the
 * new Palazzo Imperiale administrative palace, Portus became the receiving point for Egyptian and
 * African grain feeding Rome's annona, a free grain dole supplying a capital of roughly a million
 * people. At the 117 CE snapshot Trajan's hexagonal basin was barely four years old — the
 * freshest, most technically daring piece of harbor engineering in the Roman world — while
 * Isola Sacra's Christian-era basilicas still lay two to three centuries in the future.
 *
 * One OSM-tagged building, "Tempio di Portuno" (Temple of Portunus), was deliberately left out
 * rather than guessed: every source for that temple places it in central Rome, beside the Forum
 * Boarium and the old Portus Tiberinus river harbor roughly 30 km upriver — a real, well-attested
 * 117 CE building, just not one that stood at this site. No source describes a distinct Portunus
 * temple actually built at Portus itself, so this OSM node looks like a misapplied tag rather
 * than a real Portus monument; it falls through to the generic archaeological-site description
 * rather than being written up as if it belonged here.
 *
 * Researched via a background WebSearch pass (the Portus Project/University of Southampton's own
 * MOOC materials, ostia-antica.org's detailed topographical dictionary, the Parco Archeologico di
 * Ostia Antica's own site, Wikipedia, Archaeology Magazine — direct fetch of most of these was
 * network-blocked in the researching session, so facts are corroborated through search-snippet
 * synthesis, the same constraint every recent shift's Track A work has documented), personally
 * reviewed before merging. */

export type PortusEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

// Keys are matched as substrings against the OSM name (Italian), longer keys checked first, so
// keep entries specific to one building.
export const PORTUS_LOOKUP: Record<string, PortusEntry> = {
  "Palazzo Imperiale": {
    english: "Imperial Palace",
    category: "villa",
    extant_117ce: true,
    built: 114,
    description:
      "Trajan raised this three-story palace on the spit between his new hexagonal basin and Claudius's older harbor, its brickwork stamped 114-116 CE. The two-hectare complex paired a villa's porticoes, mosaics and dining halls with the offices of the annona, Rome's grain administration. Officials tracked incoming Alexandrian grain fleets from a peristyle lined with fine statuary. When Trajan died on 11 August 117 CE, mortar in its newest wing had barely cured.",
  },
  Horreum: {
    english: "Grain Warehouse",
    category: "warehouse",
    extant_117ce: true,
    description:
      "Portus ringed its basins with multi-story horrea, brick-and-concrete granaries with floors raised on low walls to keep grain off the damp ground and vents built into the walls to stop it rotting. Some held over a thousand tons of wheat at once, part of a supply chain moving well over 150,000 tons of Egyptian and African grain to Rome yearly. Dockworkers carried sacks straight from moored ships into the storerooms outside. In 117 CE these granaries stood packed, feeding a capital of roughly a million people.",
  },
  "Necropoli di Porto": {
    english: "Isola Sacra Necropolis",
    category: "tomb",
    extant_117ce: true,
    built: 100,
    description:
      "Portus buried its dead along the Via Flavia on Isola Sacra, the reclaimed island by Trajan's canal, a cemetery that grew from the late 1st century into more than 200 family tombs by the 4th. Brick tomb-houses, some two stories tall, carried carved reliefs of the trades their owners practiced — ropemakers, boatbuilders, midwives. By 117 CE the necropolis was already a bustling street of the dead facing the Ostia road.",
  },
  "Darsena porto di Traiano": {
    english: "Basin of Trajan's Harbor",
    category: "port",
    extant_117ce: true,
    built: 113,
    description:
      "Trajan's engineers spent a decade carving a perfect hexagon from the marshland behind Claudius's older harbor, inaugurating it in 113 CE. Each of its six sides ran about 357 meters, enclosing 32 hectares of water that could dock 200 ships alongside the 300 already anchored in Claudius's basin. Quays three meters wide, marked with numbered mooring points, ringed the whole perimeter for unloading. Trajan's hexagonal basin had opened just four years before his death on 11 August 117 CE.",
  },
  "Basilica Portuense": {
    english: "Basilica Portuense",
    category: "civic",
    extant_117ce: false,
    built: 350,
    description:
      "The standing Basilica Portuense is a Christian-era hall, built in the mid-4th century CE and later fitted with an apse, mosaic floors and a bishop's throne. Its walls reused older Roman work — excavations show the site held ordinary harbor-side commercial buildings from the 1st century CE onward. In 117 CE, under Trajan, this isthmus was lined with warehouses serving arriving grain ships. The basilica visitors see today rose here two centuries after Trajan's death.",
  },
  "Basilica di Sant'Ippolito e Antiquarium": {
    english: "Basilica of St. Hippolytus",
    category: "sanctuary",
    extant_117ce: false,
    built: 400,
    description:
      "This three-aisled Christian basilica rose on Isola Sacra in the late 4th or early 5th century CE to house the cult of the martyred soldier Hippolytus, built directly over an earlier Roman bath complex whose rooms and cisterns still lie beneath its floor. Vandals sacked it in 455 CE, and Pope Leo III rebuilt it around 800 CE with a marble ciborium now shown in the Antiquarium. In 117 CE, over two centuries before the church existed, this spot held only a bathhouse for Portus's workers.",
  },
};

/** Look up a matching description for an OSM building name. */
export function portusEntry(name: string | null | undefined): PortusEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(PORTUS_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return PORTUS_LOOKUP[k];
  }
  return undefined;
}
