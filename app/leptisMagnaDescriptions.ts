/** Hand-curated descriptions for named buildings at Leptis Magna (Libya) — same pattern as
 * app/ostiaDescriptions.ts and the Pompeii/Herculaneum/Ephesus/Delphi/Jerash/Trier/Merida/Palmyra/
 * Athens files, the eleventh site to get this treatment [06-P0-2]. Keys are exact substrings of
 * public/data/sites/leptismagna_buildings.geojson's `name` property.
 *
 * Leptis Magna is the sharpest 117 CE snapshot case on the map yet. Almost everything a modern
 * visitor photographs — the Severan Forum, the Severan Basilica, the Arch of Septimius Severus,
 * the Hunting Baths, the harborside Temple of Jupiter Dolichenus, even Hadrian's own Baths — was
 * built AFTER Trajan's death, most of it during the reign of Septimius Severus (193-211 CE), a
 * Leptis-born emperor who lavished a building boom on his hometown roughly 80-90 years past this
 * map's snapshot. In 117 CE the city was still centered on its modest, century-old Old Forum
 * (Temple of Roma and Augustus, Temple of Hercules, Temple of Liber Pater, the Curia, the Old
 * Basilica) — genuinely extant, genuinely the heart of the city, but a fraction of what stands
 * on the ground today.
 *
 * One correction made in the same pass as this file: OSM's `sites/leptismagna_buildings.geojson`
 * tagged one arch "Arch of Marcus Aurelius." No securely dated Marcus Aurelius arch is attested at
 * Leptis Magna itself — that name properly belongs to a different, well-known arch at Tripoli
 * (ancient Oea, ~120km away), commonly confused with Leptis in casual sources. The real, well-dated
 * arch on this spot is Trajan's own — raised c. 110 CE after he promoted Leptis to full colonia
 * status, one of the newest monuments in the city when Hadrian took the throne seven years later.
 * The OSM feature's `name` field was corrected to "Arch of Trajan" in the same commit as this file.
 *
 * Sources: Livius.org's Lepcis Magna pages; vici.org's Leptis Magna gazetteer entries; the Madain
 * Project; judaism-and-rome.org's Severan-era epigraphy pages (IPT inscription corpus); Livadiotti
 * & Rocco on the Old Forum Curia; Pleiades. Researched via a background WebSearch pass (WebFetch to
 * Wikipedia/Commons stayed blocked in this environment), personally reviewed before writing. Two
 * entries carry genuine sourcing gaps flagged in their own description rather than papered over —
 * the Decumanus's unknown-divinity temple (no dedication ever survived) and the Old Forum Church's
 * exact Byzantine-era date (several secondary sources conflate it with the separate, better-dated
 * Severan Basilica church conversion). Both would benefit from a specialist Libyan-archaeology pass
 * (Squarciapino's excavation reports, the IRT epigraphy corpus) before tightening further. */

export type LeptisMagnaEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const LEPTIS_MAGNA_LOOKUP: Record<string, LeptisMagnaEntry> = {
  "Arch of Trajan": {
    english: "Arch of Trajan",
    category: "arch",
    extant_117ce: true,
    built: 110,
    description:
      "Leptis Magna's grateful citizens raised this arch after Trajan promoted their city to a full Roman colonia around 110 CE, following his Dacian conquests. Standing near the Chalcidicum, it was originally a four-way tetrapylon; only one limestone pier survives today. It went up just seven years before Trajan died, one of the newest monuments in the city when Hadrian took the throne.",
  },
  "Arch of Septimius Severus": {
    english: "Arch of Septimius Severus",
    category: "arch",
    extant_117ce: false,
    built: 203,
    description:
      "A four-faced quadrifrons arch built in 203 CE where the Cardo crosses the Decumanus, raised by Leptis-born emperor Septimius Severus to mark a visit to his hometown. Its reliefs show Severus riding a chariot with his sons Caracalla and Geta, once covered in marble panelling under eight Corinthian columns and a shallow dome. In 117 CE this was still an ordinary street crossing — the arch wouldn't rise for another 86 years.",
  },
  "Hunting Baths": {
    english: "Hunting Baths",
    category: "bath",
    extant_117ce: false,
    built: 200,
    description:
      "A small bathhouse built for the venatores, the hunters who supplied wild animals to the amphitheatre, during the reign of Septimius Severus. Its poured-concrete domed roof survives intact — one of the best-preserved Roman roofs anywhere, buried under sand dunes for roughly seventeen centuries along with its original frescoes and mosaics. In 117 CE the site was still open ground outside the walls; these baths were nearly a century away.",
  },
  "Hadrian's Baths": {
    english: "Hadrianic Baths",
    category: "bath",
    extant_117ce: false,
    built: 127,
    description:
      "Hadrian commissioned this bath complex to honor his own tribunician power, opening it in 127 CE through the governor Publius Valerius Priscus, with finishing touches not completed until 137. Its symmetrical plan let men and women bathe at the same time in separate wings, heated by a hypocaust running beneath caldarium, tepidarium and frigidarium. In 117 CE, the very year Hadrian succeeded Trajan, this whole complex existed only as a plan.",
  },
  "Basilica of Severus": {
    english: "Severan Basilica",
    category: "basilica",
    extant_117ce: false,
    built: 216,
    description:
      "A three-aisled law court roughly 95 by 35 meters, its nave rising some 30 meters on columns of Egyptian purple granite. Septimius Severus began it as a showpiece for his birth city; his son Caracalla finished it in 216 CE, five years after Severus's death. In 117 CE this ground still held the older residential quarter that Severus later cleared to make room for it.",
  },
  "Forum of Severus": {
    english: "Severan Forum",
    category: "forum",
    extant_117ce: false,
    built: 205,
    description:
      "A walled forum roughly 1,000 by 600 Roman feet, ringed by arcaded shops and taverns and dominated by a temple to the Severan family. Septimius Severus began it around 200 CE and inspected the work in person on a visit in 203; his son Caracalla completed it by 206. In 117 CE the ground it occupies was still ordinary housing, more than eighty years before Severus cleared it.",
  },
  Serapaeum: {
    english: "Serapaeum",
    category: "temple",
    extant_117ce: false,
    built: 170,
    description:
      "A temple to Serapis, the syncretic Greco-Egyptian god of healing and the afterlife, ringed by fluted Corinthian columns of rare blue-veined marble — a monument to Leptis's trading ties with Alexandria, where the cult began. Built under Marcus Aurelius, more than fifty years after Trajan's death. In 117 CE, Serapis had no temple here at all.",
  },
  "Temple to unknown divinity on the Decumanus": {
    english: "Temple to an Unknown Divinity",
    category: "temple",
    extant_117ce: true,
    description:
      "A small temple fronting the Decumanus whose dedication was never recorded in any surviving inscription — its resident god remains unidentified to this day. It stood among the shops and colonnades of Leptis's main east-west street, part of the older street-front fabric that predates the Severan rebuilding that later reshaped this stretch of road.",
  },
  "Hercules Temple": {
    english: "Temple of Hercules",
    category: "temple",
    extant_117ce: true,
    built: -1,
    description:
      "One of two temples flanking the Old Forum's showpiece Temple of Roma and Augustus, standing on its own high podium. Hercules was worshipped here as the Roman face of Melqart, the Punic city's older patron god of trade and protection. Built during the Augustan campaign that remade the Old Forum, it had already stood for well over a century by the time Trajan died in 117.",
  },
  "معبد جوبيتير": {
    english: "Temple of Jupiter",
    category: "temple",
    extant_117ce: false,
    built: 200,
    description:
      "A temple on a high stepped podium facing directly across Leptis's harbor, most plausibly dedicated to Jupiter Dolichenus — a sky-god cult imported from Commagene in Syria, popular with soldiers and merchants across the empire. Its harborside position advertised Leptis's Mediterranean trade connections to every ship that sailed in. Built during the Severan building boom; in 117 CE the harbor's southern quay stood empty of it.",
  },
  "Old Basilica": {
    english: "Old Basilica",
    category: "basilica",
    extant_117ce: true,
    built: 30,
    description:
      "The Old Forum's original law court and business hall, standing on the forum's southeast side since the reign of Tiberius or Claudius — a full century before Severus built his grander replacement basilica elsewhere in the city. Merchants, magistrates and litigants filled it daily. In 117 CE it was still the city's main civic hall, the job the Severan Basilica would only later take over.",
  },
  Curia: {
    english: "Curia",
    category: "civic",
    extant_117ce: true,
    built: 80,
    description:
      "The council chamber where Leptis's decurions met, built on the east side of the Old Forum in conscious imitation of Rome's own Curia Julia. Its masonry and mouldings date it no later than the Flavian period, after Vespasian raised the city to a municipium. By Trajan's death in 117 it had already stood for close to forty years.",
  },
  "Roma & Augustus temple": {
    english: "Temple of Roma and Augustus",
    category: "temple",
    extant_117ce: true,
    built: 14,
    description:
      "The centerpiece of the Old Forum's three temples, roughly 46 by 20 meters, begun under Augustus and dedicated early in Tiberius's reign. A bilingual Neo-Punic and Latin inscription over its cella door named the statues it held inside: Roma, the deified Augustus, Tiberius and Livia. Among the oldest monumental buildings at Leptis Magna, it was already a century old when Trajan died in 117.",
  },
  "Liber Pater temple": {
    english: "Temple of Liber Pater",
    category: "temple",
    extant_117ce: true,
    built: -8,
    description:
      "An early Augustan temple to Liber Pater, worshipped here as the Roman guise of Shadrapa, a Phoenician healing god tied to wine and fertility — one of Leptis's two great patron deities alongside Hercules. Worshippers once left votive offerings that included a pair of elephant tusks. Built on a podium linked directly to the neighboring Temple of Roma and Augustus, it had stood for well over a century by 117 CE.",
  },
  "Old Forum Church": {
    english: "Old Forum Church",
    category: "civic",
    extant_117ce: false,
    built: 540,
    description:
      "A Christian basilica built into the Old Forum precinct during the Byzantine reconquest of Tripolitania under the general Belisarius, roughly four centuries after Leptis's pagan temples first filled this square. It repurposed the forum's civic and religious core for Christian worship, with an elevated chancel and baptistery in the standard sixth-century style. In 117 CE, under Trajan, this ground held only the working pagan temples of Hercules, Liber Pater, and Roma and Augustus — Christianity did not yet exist as an organized faith at Leptis.",
  },
};

/** Look up a matching description for an OSM building name. */
export function leptisMagnaEntry(name: string | null | undefined): LeptisMagnaEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(LEPTIS_MAGNA_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return LEPTIS_MAGNA_LOOKUP[k];
  }
  return undefined;
}
