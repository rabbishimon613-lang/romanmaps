/** Hand-curated descriptions for named buildings in Ostia Antica.
 * Sources: Meiggs (Roman Ostia, 1973); ostia-antica.org; Ostia Archaeological Park;
 * Britannica; Madain Project; Pleiades. Written to read like a place blurb,
 * not a scholar's footnote. Extant-at-117-CE noted where relevant. */

export type OstiaEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

// Keys are matched as substrings against the OSM name (case-insensitive),
// longer keys checked first. Keep entries specific to one building.
export const OSTIA_LOOKUP: Record<string, OstiaEntry> = {
  Capitolium: {
    english: "Capitolium",
    category: "temple",
    extant_117ce: true,
    built: 120,
    description:
      "Ostia's main temple, dedicated to the Capitoline Triad (Jupiter, Juno, Minerva). Built under Hadrian on the north side of the Forum, its brick core still stands 17m tall — the tallest building in the archaeological park. In 117 CE construction was underway; the temple was dedicated a few years later.",
  },
  "Terme del Foro": {
    english: "Forum Baths",
    category: "bath",
    extant_117ce: false,
    built: 160,
    description:
      "The largest bath complex in Ostia, built under Antoninus Pius by the wealthy senator M. Gavius Maximus. Still being planned in 117 CE — Ostians of Trajan's day bathed at the older Neptune or Buticosus baths.",
  },
  "Terme di Nettuno": {
    english: "Baths of Neptune",
    category: "bath",
    extant_117ce: false,
    built: 139,
    description:
      "A monumental bath complex begun under Hadrian, funded partly by his own donation. Its floors are covered in some of the finest black-and-white mosaics in the Roman world — Neptune in his chariot, tritons, sea nymphs. In 117 CE this whole block was still older shops and houses.",
  },
  "Teatro romano": {
    english: "Roman Theatre",
    category: "theater",
    extant_117ce: true,
    built: -12,
    description:
      "Ostia's theatre, originally built by Agrippa around 12 BCE and enlarged repeatedly under later emperors. Seated about 3,000 in Trajan's day. Behind it stands the Square of the Guilds (Piazzale delle Corporazioni), where shipping companies from across the Mediterranean advertised their trade in floor mosaics.",
  },
  "Piazzale della Vittoria": {
    english: "Piazzale della Vittoria",
    category: "plaza",
    extant_117ce: true,
    description:
      "The 'Square of Victory' — the open plaza just inside the Porta Romana. First view of Ostia for anyone arriving from Rome along the Via Ostiensis. Its centerpiece was a colossal statue of a winged Victory, of which fragments survive.",
  },
  "Caserma dei Vigili": {
    english: "Barracks of the Vigiles",
    category: "barracks",
    extant_117ce: true,
    built: 117,
    description:
      "Barracks of Ostia's fire brigade — a detachment of the Vigiles Urbani, Rome's paramilitary firefighters. Built under Hadrian right at our snapshot moment. Centered on a courtyard with a shrine to the Genius of the Vigiles. About 400 men were stationed here.",
  },
  "Grandi Horrea": {
    english: "Great Warehouse",
    category: "warehouse",
    extant_117ce: true,
    built: -25,
    description:
      "Ostia's biggest granary, a state-run warehouse for grain from Egypt and Africa that fed Rome's annona (grain dole). First built in the Augustan era, massively expanded under Claudius and Trajan. Two stories of vaulted magazines around a central courtyard.",
  },
  "Horrea centrali": {
    english: "Central Warehouse",
    category: "warehouse",
    extant_117ce: true,
    description:
      "One of a dozen state warehouses along the Tiber wharf, storing grain and oil bound for Rome. Trajan's new hexagonal harbor at Portus increased the volume that had to pass through here.",
  },
  "Horrea di Hortensius": {
    english: "Warehouses of Hortensius",
    category: "warehouse",
    extant_117ce: true,
    description:
      "A privately-owned warehouse block. Its ground floor held a shrine dedicated by its manager to the Genius Loci — the spirit of the place — one of many small dedications by warehouse staff scattered across Ostia.",
  },
  "Tempio di Ercole": {
    english: "Temple of Hercules",
    category: "temple",
    extant_117ce: true,
    built: -100,
    description:
      "A Republican-era temple, one of the oldest in Ostia. Hercules was patron god of sailors and the salvage trade — critical to a port that regularly picked up cargo from wrecks. Reliefs found here show him hauling a fishing net from the sea.",
  },
  "Tempio dell'Ara Rotonda": {
    english: "Temple of the Round Altar",
    category: "temple",
    extant_117ce: true,
    description:
      "Small temple beside a circular altar, tucked into the block behind the theatre. Its dedication is uncertain — possibly to Bona Dea, the women-only goddess of fertility and healing.",
  },
  "Tempio dei Fabri Navales": {
    english: "Temple of the Shipbuilders",
    category: "temple",
    extant_117ce: true,
    description:
      "Meeting hall and temple of the collegium of shipbuilders — one of Ostia's most powerful trade guilds. Every emperor from Claudius on made a point of cultivating them, since they built and repaired the grain fleet.",
  },
  "Tempio dei Mensores": {
    english: "Temple of the Grain Measurers",
    category: "temple",
    extant_117ce: true,
    description:
      "Shrine of the mensores frumentarii — the officials who measured grain being unloaded from ships. Their floor mosaic, still in place, shows a modius (grain measure) being levelled with a rod.",
  },
  "Temple of Cybele": {
    english: "Temple of Cybele",
    category: "temple",
    extant_117ce: true,
    description:
      "Precinct of the Magna Mater (Cybele), the Phrygian mother goddess whose cult Rome imported in 204 BCE. Home to the taurobolium — the bull-sacrifice initiation rite where devotees stood in a pit and were drenched in blood from above.",
  },
  "Temple of Serapis": {
    english: "Temple of Serapis",
    category: "temple",
    extant_117ce: false,
    built: 127,
    description:
      "A Hadrianic temple to the Alexandrian god Serapis, popular with the many Egyptian merchants working the Ostia-Alexandria grain run. Not yet built at our 117 CE snapshot; the site would have been residential.",
  },
  "Terme del Sileno": {
    english: "Baths of the Silenus",
    category: "bath",
    extant_117ce: true,
    description:
      "A small neighborhood bathhouse named for a mosaic of Silenus (Bacchus's tutor and drinking companion) on the floor of its frigidarium.",
  },
  "Terme Marittime": {
    english: "Maritime Baths",
    category: "bath",
    extant_117ce: true,
    description:
      "Bath complex facing the sea — in 117 CE the shoreline was still just beyond its western wall. Popular with sailors putting in at Ostia. The seawater views are long gone; the coast is now 3 km further west after two millennia of Tiber silt.",
  },
  "Terme del Faro": {
    english: "Baths of the Lighthouse",
    category: "bath",
    extant_117ce: false,
    description:
      "Named after a mosaic of the great lighthouse of Portus. Built later in the 2nd century; the block was residential in Trajan's day.",
  },
  "Terme della Trinacria": {
    english: "Baths of Trinacria",
    category: "bath",
    extant_117ce: false,
    description:
      "Late 2nd-century baths with a mosaic showing Trinacria — the three-legged emblem of Sicily — a nod to the island's role in the grain supply.",
  },
  "Terme della Basilica Cristiana": {
    english: "Baths of the Christian Basilica",
    category: "bath",
    extant_117ce: true,
    description:
      "A 2nd-century bath complex — the neighboring Christian basilica that gives it its modern name only replaced part of it centuries later. In 117 CE this was one of Ostia's newer commercial bathhouses.",
  },
  "Basilica Cristiana": {
    english: "Christian Basilica",
    category: "basilica_christian",
    extant_117ce: false,
    built: 350,
    description:
      "A 4th-century Christian basilica converted from earlier rooms of a bath complex. Not extant at our 117 CE snapshot — Christianity would not be legal in the Empire for another two centuries.",
  },
  "Basilica di Pianabella": {
    english: "Basilica of Pianabella",
    category: "basilica_christian",
    extant_117ce: false,
    description:
      "Late-antique Christian basilica in the necropolis south of the city. Not extant in 117 CE.",
  },
  "Mitreo delle Sette Sfere": {
    english: "Mithraeum of the Seven Spheres",
    category: "mithraeum",
    extant_117ce: false,
    built: 160,
    description:
      "Mid-2nd-century Mithraeum named for the mosaic of seven celestial spheres on its floor. The mystery cult of Mithras spread through the empire from the 70s CE on; by 117 it was popular with soldiers and traders but had not yet reached its 3rd-century height.",
  },
  "Mitreo delle Sette Porte": {
    english: "Mithraeum of the Seven Gates",
    category: "mithraeum",
    extant_117ce: false,
    description:
      "Mithraeum installed inside an older warehouse. Named for the mosaic of seven arched gates — the seven grades of Mithraic initiation.",
  },
  "Mitreo di Lucrezio Menandro": {
    english: "Mithraeum of Lucretius Menander",
    category: "mithraeum",
    extant_117ce: false,
    description:
      "Small Mithraeum built into a courtyard house, named for the Greek-Roman freedman who dedicated it. Typical of the many 'house Mithraea' scattered through Ostia's residential blocks.",
  },
  "Mitreo della Planta Pedis": {
    english: "Mithraeum of the Footprint",
    category: "mithraeum",
    extant_117ce: false,
    description:
      "Named for a mosaic footprint at the entrance — a symbol of arrival, or of the god Mithras walking the earth. One of about 18 Mithraea identified so far in Ostia.",
  },
  "Casa di Amore e Psiche": {
    english: "House of Cupid and Psyche",
    category: "domus",
    extant_117ce: false,
    built: 300,
    description:
      "Elegant late-antique townhouse named for a marble statuette of Cupid embracing Psyche found in its garden. Built long after 117 CE; the block was commercial in Trajan's day.",
  },
  "Domus di Amore e Psiche": {
    english: "House of Cupid and Psyche",
    category: "domus",
    extant_117ce: false,
    built: 300,
    description:
      "Elegant late-antique townhouse named for a marble statuette of Cupid embracing Psyche found in its garden. Built long after 117 CE; the block was commercial in Trajan's day.",
  },
  "Casa delle Volte Dipinte": {
    english: "House of the Painted Vaults",
    category: "domus",
    extant_117ce: true,
    description:
      "A well-preserved apartment (insula) with painted vaulted ceilings in its ground-floor rooms. Middle-class housing of the kind ordinary Ostians actually lived in — no atrium, no peristyle, just rooms opening off a central corridor.",
  },
  "Casa delle Pareti Gialle": {
    english: "House of the Yellow Walls",
    category: "domus",
    extant_117ce: true,
    description:
      "Named for the yellow-ground wall paintings in its living quarters. A typical Ostian apartment block, one of many built during Trajan's construction boom.",
  },
  "Domus dei Dioscuri": {
    english: "House of the Dioscuri",
    category: "domus",
    extant_117ce: true,
    description:
      "Townhouse named for a floor mosaic of Castor and Pollux, the Dioscuri twins — patron gods of sailors and horsemen. Their cult was strong in a port city.",
  },
  "Domus delle Muse": {
    english: "House of the Muses",
    category: "domus",
    extant_117ce: true,
    description:
      "A grand courtyard house with a mosaic of Apollo and the nine Muses on its main reception room floor. Owned by someone rich enough to advertise their literary taste in the entrance.",
  },
  "Case a Giardino": {
    english: "Garden Houses",
    category: "domus",
    extant_117ce: false,
    built: 128,
    description:
      "A planned residential complex of six blocks arranged around shared gardens — an early experiment in what we'd recognize as suburban housing. Built under Hadrian; still on the drawing board in 117 CE.",
  },
  "House of the Fishes": {
    english: "House of the Fishes",
    category: "domus",
    extant_117ce: false,
    built: 250,
    description:
      "Later 3rd-century house named for its fish-and-chalice mosaic, sometimes read as an early Christian image. Not extant in 117 CE.",
  },
  "Fullonica": {
    english: "Fuller's Shop",
    category: "fullery",
    extant_117ce: true,
    description:
      "A fullonica — laundry and wool-finishing workshop. Workers trod cloth in vats of urine (collected as a public tax) and then rinsed, bleached with sulphur, and combed the fibers. One of the smelliest and most profitable trades in a Roman city.",
  },
  "Tomb of C. Cartilius Poplicola": {
    english: "Tomb of Cartilius Poplicola",
    category: "tomb",
    extant_117ce: true,
    built: -20,
    description:
      "Monumental tomb of Gaius Cartilius Poplicola, an Augustan-era duumvir (chief magistrate) of Ostia, elected eight times. Stood just outside the Porta Marina, watching over ships coming and going.",
  },
  "Schola del Traiano": {
    english: "Schola of Trajan",
    category: "collegium",
    extant_117ce: false,
    built: 160,
    description:
      "Guild hall built on the site of an earlier house of Trajan's era — the modern name is misleading. In 117 CE the plot was a private domus. The guild hall itself is mid-2nd century.",
  },
  "Serapeum": {
    english: "Serapeum",
    category: "temple",
    extant_117ce: false,
    built: 127,
    description:
      "Precinct of the Alexandrian god Serapis, patron of the grain trade with Egypt. Dedicated under Hadrian in 127 CE — not yet built at our snapshot.",
  },
  "Antiquarium di Ostia": {
    english: "Ostia Antiquarium",
    category: "other",
    extant_117ce: false,
    description:
      "Modern site museum. Not part of ancient Ostia.",
  },
  "Castello di Giulio II": {
    english: "Castle of Julius II",
    category: "medieval",
    extant_117ce: false,
    built: 1483,
    description:
      "Renaissance fortress built by Pope Julius II (as cardinal) to defend the papal salt monopoly. Not part of ancient Ostia — belongs to the medieval village that grew up around the abandoned ruins.",
  },
  "Torre di Martino V": {
    english: "Tower of Martin V",
    category: "medieval",
    extant_117ce: false,
    description:
      "Medieval watchtower built by Pope Martin V in the early 15th century, defending the medieval salt-flats village. Not ancient.",
  },
  "Basilica di Sant'Aurea": {
    english: "Basilica of Saint Aurea",
    category: "medieval",
    extant_117ce: false,
    description:
      "Medieval church dedicated to Saint Aurea, a young woman martyred at Ostia in the 3rd century under Claudius Gothicus. Marks the center of the medieval village. Not ancient.",
  },
  "Church of Sant'Ercolano": {
    english: "Church of Sant'Ercolano",
    category: "medieval",
    extant_117ce: false,
    description:
      "Small medieval chapel. Not ancient.",
  },
  "Ostia Antica": {
    english: "Ostia Antica (city)",
    category: "city",
    extant_117ce: true,
    description:
      "Rome's port city at the mouth of the Tiber, founded (in legend) by the fourth king Ancus Marcius and (in fact) as a Republican-era castrum around 350 BCE. In 117 CE, at the height of Trajan's reign, Ostia was booming — population around 50,000, handling the entire grain fleet that fed Rome.",
  },
};

/** Look up a matching description for an OSM building name. */
export function ostiaEntry(name: string | null | undefined): OstiaEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(OSTIA_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return OSTIA_LOOKUP[k];
  }
  return undefined;
}
