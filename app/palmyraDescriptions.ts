/** Hand-curated descriptions for named buildings in Palmyra — same pattern as
 * app/ostiaDescriptions.ts, app/pompeiiDescriptions.ts, app/herculaneumDescriptions.ts,
 * app/ephesusDescriptions.ts, app/delphiDescriptions.ts, app/jerashDescriptions.ts,
 * app/trierDescriptions.ts and app/meridaDescriptions.ts — the ninth site to get this
 * treatment [06-P0-2].
 *
 * `public/data/sites/palmyra_buildings.geojson` carries only 14 distinct named features, most of
 * them Arabic-language OSM tags — famous individually rather than numerous, the opposite shape
 * from a living modern city's OSM dump (Trier, Ephesus). Two candidates were deliberately left
 * out rather than guessed: `market` (every source treats it as a synonym for the Agora itself,
 * not a separate structure — curating it separately would invent a building) and `معبد بعل`
 * ("Temple of Baal") which is almost certainly the same deity/temple as `معبد بل` (Temple of
 * Bel, "Baal" and "Bel" being alternate transliterations) under two spellings — no source
 * describes a second, distinct Baal temple at Palmyra.
 *
 * Palmyra's caravan-city monuments split cleanly by century: the Temple of Bel (dedicated 32 CE),
 * the Temple of Nabu (started ~80 CE) and the Agora/Basilica market complex (Flavian-Trajanic)
 * were already standing in 117 CE. Everything associated with the city's later 2nd/3rd-century
 * boom under the Severans and Zenobia — the Great Colonnade's Tetrapylon, the Theatre and its
 * gate, the Temple of Baalshamin (dedicated for Hadrian's 129 CE visit, still 12 years off at
 * this map's snapshot), the Caesareum — is honestly `extant_117ce: false`. The Baths of
 * Diocletian and both church buildings are 3rd-6th century, centuries after the snapshot.
 *
 * A note on the modern context: Islamic State militants destroyed the Temple of Bel, the Temple
 * of Baalshamin, and the Tetrapylon between 2015 and 2017. Restoration work is ongoing. This file
 * describes each building in its own ancient context, per the project's voice rules, rather than
 * leading with that loss — but see BOARD.md/SHIFT_LOG.md for how "today" fields elsewhere on this
 * project handle the site's modern status honestly.
 *
 * Researched via a background WebSearch pass (Wikipedia, madainproject.com, Getty, academia.edu,
 * the French Ministry of Culture's Palmyra excavation pages, Smarthistory — direct fetch of most
 * of these was network-blocked in the researching session, so facts are corroborated through
 * search-snippet synthesis, the same constraint every recent shift's Track A work has documented),
 * personally reviewed before merging. */

export type PalmyraEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

// Keys are matched as substrings against the OSM name (Arabic or English), longer keys checked
// first, so keep entries specific to one building.
export const PALMYRA_LOOKUP: Record<string, PalmyraEntry> = {
  Agora: {
    english: "Agora",
    category: "market",
    extant_117ce: true,
    built: 75,
    description:
      "Palmyra's civic and commercial heart was a stone-paved courtyard 71 by 84 meters, cut through with eleven gates. Two hundred column bases inside once carried statues of the merchants, caravan leaders, and officials who funded the city's trade routes. In 137 CE a bilingual tariff law went up on a stone slab here, spelling out in Palmyrene Aramaic and Greek exactly what a camel-load of goods owed at the gate — traders had already been haggling under its porticoes for decades by then. Already standing in 117 CE, its columns still bare of the honorific statues that would soon crowd them.",
  },
  Basilica: {
    english: "Basilica (Agora Market Hall)",
    category: "civic",
    extant_117ce: true,
    built: 100,
    description:
      "East of the Agora, excavators uncovered a long open hall now simply called the Basilica — a market annex built without the colonnades that framed its grander neighbor, apparently left unfinished by its builders. A fragment of Palmyra's customs law, the same tax code carved onto the Agora's tariff stone, turned up at its entrance, suggesting the hall doubled as a place to post trade regulations. Merchants likely spilled into it when the Agora's courtyard filled with caravans. Already functioning as market space in 117 CE, even if the colonnade around it never got built.",
  },
  Caesareum: {
    english: "Caesareum",
    category: "temple",
    extant_117ce: false,
    built: 171,
    description:
      "Palmyra built a Caesareum to fold Rome's imperial cult into a city that already worshipped a crowded pantheon of desert gods. The earliest solid trace of it is a bilingual inscription from 171 CE recording its dedication — the first explicit evidence anywhere in the city that the emperors had a temple of their own. Centuries later, Umayyad builders reused its walls inside a mosque, a reburial that helped its stones survive intact. In 117 CE, the year Trajan died and Hadrian took the throne, this ground had no temple to either man — the Caesareum wouldn't be dedicated for another 54 years.",
  },
  "Early Christian Church": {
    english: "Early Christian Church",
    category: "sanctuary",
    extant_117ce: false,
    built: 300,
    description:
      "Christianity reached Palmyra early: by 325 CE the city had its own bishop, Marinus, who traveled to the Council of Nicaea to help settle the fight over Christ's divinity. The city's first church rose in the early 4th century, as imperial policy toward the old religion turned from tolerance to active promotion. Archaeologists have since counted at least eight churches across Palmyra, four of them full basilicas — a Christian community that outlasted the caravan wealth which had built the city in the first place. In 117 CE this was still a thoroughly pagan city; its first church lay roughly two centuries off.",
  },
  "البازيليكا البيزنطينية": {
    english: "Byzantine Basilica",
    category: "sanctuary",
    extant_117ce: false,
    built: 540,
    description:
      "Long after Palmyra's caravan wealth had faded, Emperor Justinian ordered the city's churches and walls rebuilt, and the Byzantine Basilica rose in the 6th century as part of that program. Its builders recycled columns pulled from older Roman structures, lining the nave with six mismatched shafts salvaged from buildings hundreds of years older than the church itself. It served as one of at least eight churches in Palmyra's Christian community before the Islamic conquest reshaped the city again. In 117 CE this spot sat inside a still-pagan trading city under Trajan's rule — the basilica wouldn't rise for roughly 400 more years.",
  },
  "بوابة المسرح": {
    english: "Theatre Gate",
    category: "gate",
    extant_117ce: false,
    built: 200,
    description:
      "The Theatre Gate framed the main entrance to Palmyra's Roman theatre, funneling spectators off the colonnaded street and into a semicircular piazza before they reached their seats. The theatre itself belongs to the Severan building boom of the late 2nd and early 3rd centuries, when Palmyra's caravan wealth from trade between Rome and Parthia peaked. Its gate shares that same late date, designed as one piece with the theatre to impress visitors arriving off the grand colonnade. In 117 CE no theatre stood here at all — this stretch of the city was still open ground, roughly eighty years from its first performance.",
  },
  "تيترابيلون": {
    english: "Tetrapylon",
    category: "gate",
    extant_117ce: false,
    built: 293,
    description:
      "The Tetrapylon marked the midpoint of Palmyra's Great Colonnade with four platforms of four columns each — sixteen pink granite shafts hauled overland from quarries at Aswan in Egypt. Each cluster supported a single stone cornice weighing roughly 150 tons, carved to look unified despite standing on four separate corners of an open crossroads. It went up during Diocletian's building campaign at the very end of the 3rd century, long after Palmyra's earlier Roman-period monuments. Only one of its sixteen columns is original stone today; the rest are 1960s concrete replacements. In 117 CE this crossroads was empty desert road — the Tetrapylon lay some 175 years in the future.",
  },
  "حمامات ديوكليسيان": {
    english: "Baths of Diocletian",
    category: "bath",
    extant_117ce: false,
    built: 300,
    description:
      "These baths sit at the western end of the Great Colonnade, built directly over the ruins of what had been Queen Zenobia's palace. Construction was part of Diocletian's push in the late 3rd and early 4th centuries to turn Palmyra into a fortified military outpost following the collapse of Zenobia's revolt against Rome. A monumental colonnaded entrance framed the approach to the bathing halls, giving soldiers stationed at the nearby camp a proper Roman amenity in the middle of the desert. In 117 CE this spot held nothing resembling a bathhouse — Diocletian himself wouldn't be born for over a century.",
  },
  "معبد اللات": {
    english: "Temple of Al-Lat",
    category: "temple",
    extant_117ce: false,
    built: 148,
    description:
      "A shrine to the desert goddess Al-Lat stood on this spot from at least the 1st century BCE, one of the oldest cult sites in Palmyra. The grand Roman-style temple that replaced it went up around 148 CE, funded by a citizen named Taimarsu, and eventually held a marble cult statue carved in the style of Athena — Al-Lat merged with the Greek goddess as Palmyrene religion absorbed Hellenistic imagery. Zealots acting for the Roman prefect Maternus Cynegius smashed that statue's face in the 380s CE, part of an empire-wide campaign against pagan shrines. In 117 CE only the old shrine stood here — Taimarsu's temple was still three decades away.",
  },
  "معبد بعل شامين": {
    english: "Temple of Baalshamin",
    category: "temple",
    extant_117ce: false,
    built: 130,
    description:
      "A wealthy Palmyrene named Male, nicknamed Agrippa, paid for this temple to Baalshamin, \"Lord of the Heavens,\" timing its dedication to Emperor Hadrian's visit to the city in 129 CE. An inscription dated 130-131 CE records the ceremony. Six Corinthian columns fronted its small, elegant sanctuary, built roughly a century after its far larger neighbor at the Temple of Bel. In 117 CE Baalshamin had no temple of his own in Palmyra yet — Hadrian's visit, and the building it inspired, still lay twelve years off.",
  },
  "معبد بل": {
    english: "Temple of Bel",
    category: "temple",
    extant_117ce: true,
    built: 32,
    description:
      "Dedicated in 32 CE after roughly fifteen years of construction, the Temple of Bel anchored Palmyrene religious life around a triad of gods — Bel, the moon god Aglibol, and the sun god Yarhibol — inside a walled precinct built on a scale to rival any temple in the Roman East. Between 80 and 120 CE, builders added a double colonnaded portico wrapping three sides of the sanctuary, work that would have been finishing right around the time Trajan died. Byzantine Christians later converted the cella into a church, and Arab builders folded it into a mosque in 1132 CE. Already standing in 117 CE, its new portico still half-scaffolded.",
  },
  "معبد نبو": {
    english: "Temple of Nabu",
    category: "temple",
    extant_117ce: true,
    built: 80,
    description:
      "Builders broke ground on this temple to Nabu, the Mesopotamian god of writing and wisdom, around 75-80 CE, raising a peripteral hall on a Roman-style podium with eleven columns down each long side. Work stalled near the end of the 1st century, leaving the sanctuary standing but plain, decades before a grand ten-column entrance hall was finally added around 150-160 CE to open it onto the colonnaded street. French archaeologists didn't even locate the temple until 1960, buried under later debris. Its high-windowed cella, echoing the nearby Temple of Bel, stood quietly for a century before getting its facade. Already standing, if unglamorous, in 117 CE — its monumental gateway was still 33 years away.",
  },
};

/** Look up a matching description for an OSM building name. */
export function palmyraEntry(name: string | null | undefined): PalmyraEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(PALMYRA_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return PALMYRA_LOOKUP[k];
  }
  return undefined;
}
