/** Hand-curated descriptions for named buildings at Aquileia (Roman Aquileia, Italia) — same
 * pattern as app/veronaDescriptions.ts and the other curate-buildings files [06-P0-2]. Keys are
 * exact substrings of public/data/sites/aquileia_buildings.geojson's `name` property, in Italian,
 * matching invariant 1.5's carve-out for the raw OSM layer.
 *
 * Aquileia was founded as a Latin colony in 181 BCE on the Natiso/Natissa river and grew into one
 * of the largest, wealthiest cities of Roman Italy, a river port and crossroads between the
 * Adriatic and central Europe. Its forum, river port, and several elite houses were already old
 * by 117 CE (Trajan's death). But Aquileia's greatest boom of visible monument-building came
 * later — under the Tetrarchy and Constantine the city was elevated further, and most of what
 * tourists photograph today (the Great Baths, the patriarchal basilica, the fortified late-antique
 * market quarter) belongs to the 4th-6th centuries CE, three or more lifetimes after Trajan.
 *
 * Six real candidates were researched and marked `extant_117ce: false` rather than guessed extant,
 * because their own excavation reports date them well past 117 CE: "Grandi Terme" (Aquileia's
 * Great Baths) is a Constantinian project begun around 300 CE; "Domus dei putti danzanti" (House
 * of the Dancing Cupids) has its first identifiable building phase in the early 4th century CE,
 * despite Republican-era substrate beneath it that was never developed into an attested structure
 * by Trajan's day; "Mercati Romani e Mura - Fondo Pasqualis" is the city's late-antique southern
 * defensive wall and attached market stalls, raised around 300 CE or slightly earlier; and
 * "Decumano e mura bizantine" pairs a genuinely early street with 6th-century Byzantine-reconquest
 * fortifications that share the same OSM polygon and give the entry its name. Two more were
 * excluded outright rather than force-fit as `false` entries: "Basilica di Santa Maria Assunta"
 * and "Battistero" are the patriarchal basilica complex, founded in 313 CE by Bishop Theodore with
 * Constantine's backing — squarely post-117, and no earlier structure on that footprint is well
 * enough attested to write around. "Arco San Felice" is not Roman at all despite its ancient-sounding
 * name — it is a medieval gate in Aquileia's Patriarchate-era walls, named for a 4th-century church
 * demolished in the 18th century; excluded as out of scope rather than mis-dated as ancient.
 * "Palestra comunale" is the modern town gymnasium (Italian "palestra" = "gym"), not a Roman
 * palaestra. "Fondo Cosaar" (OSM's spelling of Fondo Cossar) sits inside the same excavated
 * property as the Domus di Titus Macer and Domus delle bestie ferite below but could not be
 * confirmed as a distinct, separately identified structure, so it was left out rather than
 * guessed. Modern hotels, hostels, the train station, the museum buildings, and the civil
 * protection office are not curated here — they are not ancient monuments.
 *
 * Sources: English and Italian Wikipedia, Fondazione Aquileia's own site pages
 * (fondazioneaquileia.it), Italy's national cultural heritage catalog
 * (catalogo.beniculturali.it), archeocartafvg.it, and academic excavation reports (Academia.edu,
 * FastiOnline) — cross-confirmed across 2+ independent results per fact, researched via a
 * background WebSearch pass (direct fetches to these domains stayed blocked in this environment).
 */

export type AquileiaEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const AQUILEIA_LOOKUP: Record<string, AquileiaEntry> = {
  "Foro:lato orientale": {
    english: "Roman Forum (Eastern Side)",
    category: "forum",
    extant_117ce: true,
    built: 40,
    description:
      "Aquileia laid out its civic forum as early as the 2nd century BCE, but the paved square and shop-lined porticoes visitors picture today took shape in the first half of the 1st century CE, when arcades went up along its eastern and western flanks to house rows of tabernae. The square stretched 141 meters long and 55 wide, entirely paved in Aurisina limestone quarried from the nearby Karst plateau. By 117 CE traders and magistrates had already crossed this pavement for decades, decades before later imperial rebuilding added the composite capitals still standing along its eastern colonnade.",
  },
  "Domus di Titus Macer": {
    english: "House of Titus Macer",
    category: "domus",
    extant_117ce: true,
    built: -90,
    description:
      "Aquileia's wealthiest known private house began as an atrium residence in the early 1st century BCE and kept growing for six centuries, eventually spreading across 1,260 square meters, one of the largest Roman-era homes ever excavated in northern Italy. Archaeologists named it for its owner after finding a bronze steelyard weight stamped T.MACR. By 117 CE the house had already anchored its city block for two centuries, its black-and-white geometric mosaic floors from the late Republic still underfoot long before the property took on the grander, more colorful decoration of later remodelings.",
  },
  "Domus Romane - Fondo Cal": {
    english: "Fondo CAL Roman Houses",
    category: "domus",
    extant_117ce: true,
    built: 1,
    description:
      "On a city block near the Natissa river and Aquileia's cardo maximus, several separate houses stood side by side from the start of the imperial age, each opening onto the street through a row of shopfronts. Their earliest floors were plain geometric mosaics in black and white tile, laid down when Augustus was still shaping the empire. By 117 CE those houses had stood for a century, still generations away from the 4th-century renovation that would knit them into a single 34-room mansion and lay the famous Good Shepherd mosaic that later gave the site its fame.",
  },
  "Domus delle bestie ferite": {
    english: "House of the Wounded Beasts",
    category: "domus",
    extant_117ce: true,
    built: -20,
    description:
      "This elite Aquileian townhouse began life in the Augustan age as part of the same prosperous residential quarter as its neighbors near the forum and river port. Its first floors carried the restrained geometric mosaics typical of the early empire, nothing like the vivid hunting scene that would eventually give the house its name. By 117 CE the domus had already sheltered several generations of Aquileia's elite, more than two centuries before a late-antique redecoration added the wounded-animal mosaic panel that archaeologists rediscovered and made famous.",
  },
  "Mausoleo Candia": {
    english: "Candia Mausoleum",
    category: "tomb",
    extant_117ce: true,
    built: -10,
    description:
      "A wealthy Aquileian family raised this monumental tomb in the Augustan age along the Roman road running northeast toward Tergeste, modern Trieste, marking their family plot the way countless Romans lined their approach roads with funerary architecture. By 117 CE the mausoleum had stood beside that road for roughly a century, one marker among many in a landscape of tombs outside the city walls. Its scattered stone fragments were found centuries later at the Roncolon locality and reassembled within the archaeological park, funded by the Candia family in memory of their own dead in 1956 — a private monument answering a private monument, eighteen centuries apart.",
  },
  "Porto fluviale romano": {
    english: "Roman River Port",
    category: "port",
    extant_117ce: true,
    built: 10,
    description:
      "Aquileia's river port ran for more than 300 meters along a branch of the Natiso, its quays reaching nearly 48 meters wide at points, handling cargo moving between the Adriatic and the interior of the empire. The Julio-Claudian emperors treated it as critical infrastructure — Claudius ordered a major rebuilding of its quays and warehouses in the mid-1st century CE. By 117 CE the port had already been Aquileia's commercial lifeline for a century, its wharves loaded with wine amphorae, glass, and amber funneling south from the Baltic trade routes.",
  },
  "Sponda orientale del porto": {
    english: "Eastern Riverbank of the Port",
    category: "port",
    extant_117ce: true,
    built: 10,
    description:
      "The eastern bank of Aquileia's river port complemented the main quays across the water, part of the same Julio-Claudian-era harbor works that turned the Natiso into a working commercial waterfront. Recent excavations here uncovered tanks used for retting hemp, soaking the plant fiber to loosen it for rope- and sailcloth-making, a detail that reveals the unglamorous industrial work behind Aquileia's trading wealth. By 117 CE this riverbank had functioned as part of the city's harbor for a century, loading and unloading the goods that made Aquileia one of Roman Italy's great emporiums.",
  },
  "Sepolcreto": {
    english: "Roman Burial Ground",
    category: "necropolis",
    extant_117ce: true,
    built: 50,
    description:
      "Along a secondary road leading southeast out of the city, Aquileian families laid out this stretch of roadside cemetery across the first three centuries of the empire, marking each family plot with low balusters and limestone coping. Excavators found the burials preserved roughly three meters below modern ground level, offering a rare cross-section of how an ordinary Roman necropolis actually looked in use. By 117 CE the ground held generations of cremation burials, with inhumation graves for children present too — cremation would only begin giving way to inhumation as the dominant rite generally from the 2nd century CE onward.",
  },
  "Domus dei putti danzanti": {
    english: "House of the Dancing Cupids",
    category: "domus",
    extant_117ce: false,
    built: 300,
    description:
      "Named for a refined polychrome mosaic of cupids dancing in garlands, discovered only in 2005, this sprawling house eventually covered most or all of a city block just steps from the forum and river port. Excavation showed its earliest identifiable building phase dates to the start of the 4th century CE, built over older Republican-era foundations that never developed into an attested standing house. In 117 CE this insula near the port still held whatever earlier structures those buried foundations represent — not yet the grand late-antique mansion, and certainly not yet its famous dancing cupids, which were two centuries away.",
  },
  "Grandi Terme": {
    english: "Great Baths",
    category: "bath",
    extant_117ce: false,
    built: 300,
    description:
      "Aquileia's largest bath complex, comparable in plan to Constantine's own baths on Rome's Quirinal Hill, rose in the early 4th century CE as one of the city's most ambitious public building projects. Recent excavations have kept turning up new rooms and a monumental apse, evidence of just how large the complex eventually grew before it fell out of use around 500 CE. In 117 CE this site held no baths at all — Aquileians of Trajan's day washed elsewhere, nearly two centuries before Constantine's era gave the city this grand Constantinian-style bathing hall.",
  },
  "Mercati Romani e Mura - Fondo Pasqualis": {
    english: "Fondo Pasqualis Market and Walls",
    category: "market",
    extant_117ce: false,
    built: 300,
    description:
      "At the southwestern edge of the ancient city, excavators uncovered a stretch of late-antique defensive wall, three meters thick and built largely from recycled stone salvaged from demolished buildings elsewhere in Aquileia, with small market stalls tucked in behind it near the riverbank. The wall and its markets belong to a new fortified perimeter raised around 300 CE or slightly earlier, as the city drew in its defenses. In 117 CE this ground lay well within an open, unwalled river city — Aquileia would not fortify this southern edge for another 180 years, and these particular market stalls only began trading goods off passing river barges in the 4th and 5th centuries.",
  },
  "Decumano e mura bizantine": {
    english: "Decumanus and Byzantine Walls",
    category: "street",
    extant_117ce: false,
    built: 550,
    description:
      "The east-west street here, part of the Via Gemina decumanus, was already an established Aquileian thoroughfare in the 1st century CE, running past the site later occupied by the forum and civic basilica. But the fortification you see hugging its southern edge today — a jagged line of triangular bastions — is a Byzantine-era addition, raised after the Gothic War and Constantinople's reconquest of the city in the 6th century CE. In 117 CE this stretch of the decumanus ran open and unfortified through the heart of the city; the wall would not exist for another four centuries, built only after the empire's own political center had shifted away from Rome entirely.",
  },
};

/** Look up a matching description for an OSM building name. */
export function aquileiaEntry(name: string | null | undefined, _osmId?: number): AquileiaEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(AQUILEIA_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return AQUILEIA_LOOKUP[k];
  }
  return undefined;
}
