/** Hand-curated descriptions for named buildings in Herculaneum — same pattern as
 * app/ostiaDescriptions.ts and app/pompeiiDescriptions.ts, the third site to get this
 * treatment [06-P0-2]. Sources: Herculaneum Conservation Project (herculaneum.ox.ac.uk);
 * Parco Archeologico di Ercolano; pompeiisites.org; Britannica; published excavation
 * reports. Written to read like a place blurb, not a scholar's footnote.
 *
 * Every entry is extant_117ce: false, destroyed: 79 — Herculaneum was buried by the
 * pyroclastic flows of the 79 CE eruption, 38 years before our snapshot, and every one
 * of these buildings is pinned as a ruin frozen at that moment, not as it stood in
 * 117 CE. `built` is negative for BCE, omitted where genuinely unresolved. */

export type HerculaneumEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number;
  destroyed?: number;
  description: string;
};

// Keys are matched as substrings against the OSM name (case-insensitive),
// longer keys checked first. Keep entries specific to one building.
export const HERCULANEUM_LOOKUP: Record<string, HerculaneumEntry> = {
  "Arco Quadrifonte": {
    english: "Quadrifons Arch",
    category: "gate",
    extant_117ce: false,
    built: 62,
    destroyed: 79,
    description:
      "The Quadrifons Arch framed the ceremonial entrance to Herculaneum's sacred precinct, its four open faces meeting where two colonnaded streets crossed. Rebuilt around 62 CE after an earthquake shattered the town's public core, its brick piers were originally faced in marble and carried stuccoed arcades. The arch funneled townspeople toward the Augusteum, the imperial cult hall beyond it. Vesuvius buried the arch in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Aula Superiore": {
    english: "Upper Hall of the Palaestra",
    category: "hall",
    extant_117ce: false,
    built: -20,
    destroyed: 79,
    description:
      "The Upper Hall opened onto a gallery over the Great Palaestra's cross-shaped pool, its floor laid in black tesserae and marble beneath walls once covered in Fourth Style frescoes. Slender columns divided the room in half, and doorways along the gallery led to vaulted chambers, some finely decorated, others plain. Built during the Augustan reorganization of the palaestra, it gave an elevated view over the grounds below. Vesuvius sealed it in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa Sannitica": {
    english: "Samnite House",
    category: "house",
    extant_117ce: false,
    built: -180,
    destroyed: 79,
    description:
      "The Samnite House preserved Herculaneum's oldest domestic architecture, its atrium ringed by a false loggia of Ionic columns behind a stucco lattice screen unique among the town's houses. Built in the 2nd century BCE, its vestibule carried rare First Style paintings imitating marble slabs. After the earthquake of 62 CE damaged the loggia, owners walled it off as a separate apartment. Vesuvius entombed the house in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa a Graticcio": {
    english: "House of the Wooden Trellis (Opus Craticium)",
    category: "house",
    extant_117ce: false,
    built: 62,
    destroyed: 79,
    description:
      "The House of the Wooden Trellis showed Herculaneum's cheapest construction: timber frames packed with rubble and plastered over, a technique called opus craticium. Raised after the 62 CE earthquake to replace a damaged Samnite building, it served as a low-cost apartment for several tenant families. Its wooden balcony and staircase survive on both floors, among the only complete examples of this method anywhere. Vesuvius buried it in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa dei Cervi": {
    english: "House of the Deer",
    category: "house",
    extant_117ce: false,
    built: 45,
    destroyed: 79,
    description:
      "The House of the Deer ranked as the grandest seaside mansion excavated at Herculaneum, built during the reign of Claudius around the middle of the 1st century CE. Its garden held marble statues of deer torn apart by hounds, alongside a sculpture of a drunken Hercules, works that gave the house its name. A cryptoporticus wrapped the peristyle garden with more than sixty painted panels in the Fourth Style. Vesuvius buried the house in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa dei Due Atri": {
    english: "House of the Two Atriums",
    category: "house",
    extant_117ce: false,
    destroyed: 79,
    description:
      "Excavators under Amedeo Maiuri uncovered this house in 1939, built around two separate atriums: a tetrastyle hall with tall masonry columns, and an older Tuscan atrium behind it with its impluvium closed by a stone parapet. A facade faced almost entirely in opus reticulatum gave the two-story house an unusually polished street presence. Charred furniture, a table, bed, cupboard, and chest, survived in its rooms. Vesuvius buried the house in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa del Bel Cortile": {
    english: "House of the Beautiful Courtyard",
    category: "house",
    extant_117ce: false,
    built: 50,
    destroyed: 79,
    description:
      "The House of the Beautiful Courtyard took its name from a mosaic-paved courtyard that lit its rooms and organized its stairwell, kitchen, and four upper chambers. Built in the mid-1st century CE, its walls carried Fourth Style frescoes over older Second Style work near the entrance. In 1980, excavators found three skeletons here, a mother, father, and child huddled together, among roughly 300 victims found on the shoreline. Vesuvius buried the house in 79 CE, 38 years before 117 CE.",
  },
  "Casa del Bicentenario": {
    english: "House of the Bicentenary",
    category: "house",
    extant_117ce: false,
    destroyed: 79,
    description:
      "Archaeologists opened the House of the Bicentenary in 1938, two centuries after excavations at Herculaneum began, and named it for the anniversary. Its axial plan led from a vestibule through an atrium with a fine impluvium to a triclinium painted with mythological scenes. In an upstairs room, excavators found a cross-shaped impression in the wall plaster, nail holes still visible where a wooden object once hung. Vesuvius buried the house in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa del Colonnato Tuscanico": {
    english: "House of the Tuscan Colonnade",
    category: "house",
    extant_117ce: false,
    built: -150,
    destroyed: 79,
    description:
      "The House of the Tuscan Colonnade formed when two tuff-built Samnite-era dwellings were joined around a single peristyle, giving the house two street entrances. Its four-sided colonnade of Tuscan columns, painted black or yellow below and white above, gave the house its name and framed seven decorated reception rooms. One room held a painting of Hercules performing the sacrifice that founded the town. Vesuvius buried it in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa del Genio": {
    english: "House of the Genius",
    category: "house",
    extant_117ce: false,
    destroyed: 79,
    description:
      "Excavators opened the House of the Genius between 1828 and 1850, among the earliest houses uncovered at Herculaneum, yet its entrance and much of its western half still lie buried beneath modern Ercolano. The house took its name from a small bronze statuette of a winged genius, a household guardian spirit, found on a candlestick inside. Its surviving peristyle garden centers on a curved rectangular fountain basin. Vesuvius buried the house in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa del Gran Portale": {
    english: "House of the Great Portal",
    category: "house",
    extant_117ce: false,
    built: 10,
    destroyed: 79,
    description:
      "The House of the Great Portal took its name from its entrance, framed by brick half-columns topped with Corinthian capitals carved with winged Victories, stuccoed and painted red beneath a terracotta architrave. Built in the early 1st century CE on land bought from the neighboring Samnite House, it was restored after the 62 CE earthquake, when the doorway was added. It remains one of the town's most ornate entrances. Vesuvius buried it in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa del Mobilio Carbonizzato": {
    english: "House of the Charred Furniture",
    category: "house",
    extant_117ce: false,
    built: -180,
    destroyed: 79,
    description:
      "The House of the Charred Furniture began as a Samnite-period dwelling, one of Herculaneum's oldest, before Claudian renovations covered its walls in colorful Third and Fourth Style frescoes. A wide window lit a garden-facing room at the rear, where excavators in the early 1930s found a carbonized bed and table standing where their owners left them. Vesuvius buried the house in 79 CE, 38 years before this map's 117 CE snapshot; it reopened to visitors in 2026 after a thirty-year restoration.",
  },
  "Casa del Papiro Dipinto": {
    english: "House of the Painted Papyrus",
    category: "house",
    extant_117ce: false,
    destroyed: 79,
    description:
      "The House of the Painted Papyrus ran as a single long corridor rather than around a central atrium, its six rooms lit by a small courtyard and light-well instead of an impluvium. A now-lost fresco over its rear reception room once showed a papyrus scroll beside an inkwell and pen and the Greek name Eutychos, the detail that gave the house its name. Vesuvius buried the house in 79 CE, 38 years before this map's 117 CE snapshot, destroying the scroll it was named for.",
  },
  "Casa del Rilievo di Telefo": {
    english: "House of the Relief of Telephus",
    category: "house",
    extant_117ce: false,
    destroyed: 79,
    description:
      "One of the largest houses in Herculaneum, the House of the Relief of Telephus belonged to the town's leading citizen, the senator Marcus Nonius Balbus. Its atrium displayed a marble relief carved with the myth of Telephus, son of Hercules, healed by Achilles, still visible in place today. Its Marble Room paved the floor with opus sectile cut from 23 types of stone gathered from across the Mediterranean. Vesuvius buried the house in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa del Sacello di Legno": {
    english: "House of the Wooden Shrine",
    category: "house",
    extant_117ce: false,
    built: -180,
    destroyed: 79,
    description:
      "The House of the Wooden Shrine kept the modest layout typical of Herculaneum's 2nd-century-BCE houses, with no running water even at the moment of the eruption. Its name came from a household shrine carved like a miniature temple with Corinthian capitals, found charred but intact in a ground-floor bedroom, its cupboard still holding lamps, glass jars, and bronze statuettes of Hercules and a goddess. Vesuvius buried the house in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa del Salone Nero": {
    english: "House of the Black Hall",
    category: "house",
    extant_117ce: false,
    destroyed: 79,
    description:
      "The House of the Black Hall occupied a prominent corner where Cardo IV met the Decumanus Inferiore, one of the most opulent private residences uncovered at Herculaneum. It took its name from a grand reception hall on its western side, walls divided into three mirror-like black panels flanked by painted pillars and chandeliers in vivid color. The house spanned roughly 400 to 500 square meters. Vesuvius buried it in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa del Tramezzo di Legno": {
    english: "House of the Wooden Partition",
    category: "house",
    extant_117ce: false,
    built: -80,
    destroyed: 79,
    description:
      "The House of the Wooden Partition ranks among the best-preserved houses at Herculaneum, built in the late Republic during the 1st century BCE and remodeled a century later. Its namesake feature, a folding wooden screen of sliding panels with bronze handles, still separates the tablinum from the atrium, two-thirds of the original surviving behind glass. Vesuvius carbonized the wood and buried the house in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa dell'Alcova": {
    english: "House of the Alcove",
    category: "house",
    extant_117ce: false,
    destroyed: 79,
    description:
      "The House of the Alcove combined two originally separate buildings, linked by a stepped entrance between their courtyards, and rose at least three stories, marked by surviving beam-sockets in its walls. It took its name from a recessed, vaulted niche, an alcove, built into one of its principal rooms, architecturally unusual among Herculaneum's houses. Vesuvius buried the house in 79 CE, 38 years before this map's 117 CE snapshot, collapsing its upper floors into the ash.",
  },
  "Casa dell'Atrio Corinzio": {
    english: "House of the Corinthian Atrium",
    category: "house",
    extant_117ce: false,
    built: -150,
    destroyed: 79,
    description:
      "The House of the Corinthian Atrium is the only house so far excavated at Herculaneum with a true Corinthian atrium, more than four columns ringing the impluvium instead of the usual four. Three brick columns lined each side above a cocciopesto floor inlaid with colored marble chips, feeding a marble-lined fountain basin. Building in this Hellenistic style inside a private house signaled unusual wealth. Vesuvius buried it in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa dell'Atrio a Mosaico": {
    english: "House of the Mosaic Atrium",
    category: "house",
    extant_117ce: false,
    destroyed: 79,
    description:
      "The House of the Mosaic Atrium formed from the merger of three or four smaller houses into one of the largest residences in Herculaneum, its ground floor covering as much as 2,150 square meters. Its namesake black-and-white chessboard mosaic paved the atrium floor, buckled where earthquakes and volcanic heat had warped it even before the eruption. South-facing rooms opened onto a terrace over the Bay of Naples. Vesuvius buried it in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa dell'Erma di Bronzo": {
    english: "House of the Bronze Herm",
    category: "house",
    extant_117ce: false,
    built: -150,
    destroyed: 79,
    description:
      "The House of the Bronze Herm was a narrow, modest dwelling built in the Samnite period, its plan simplified to omit the side rooms of grander houses and fit a tight lot. A Tuscan atrium with a tufa impluvium formed its heart, Third Style walls giving way in the rear triclinium to Fourth Style paintings, including a maritime scene. It took its name from a bronze herm portrait bust found upstairs. Vesuvius buried the house in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa della Gemma": {
    english: "House of the Gem",
    category: "house",
    extant_117ce: false,
    built: -30,
    destroyed: 79,
    description:
      "The House of the Gem grew into the second-largest home in Herculaneum, spreading across roughly 1,800 square meters on three levels as part of a complex belonging to the senator Marcus Nonius Balbus. It took its name from an engraved gemstone portrait of a woman from the age of Claudius, found among its ruins. Excavators uncovered the house in 1934, but it opened to the public only in 2022. Vesuvius buried the house in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa dello Scheletro": {
    english: "House of the Skeleton",
    category: "house",
    extant_117ce: false,
    destroyed: 79,
    description:
      "The House of the Skeleton combined three earlier houses into one, its mosaic-paved entrance opening off Cardo III onto an atrium built without the usual impluvium pool, drawing light from an adjoining nymphaeum courtyard instead. Two shrine niches at the rear honored the household's protective nymphs. The house took its name from a human skeleton found in a second-floor room when excavators opened it in 1831. Vesuvius buried it in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa di Apollo suonatore di Lira": {
    english: "House of Apollo the Lyre-Player (Casa dell'Apollo Citaredo)",
    category: "house",
    extant_117ce: false,
    destroyed: 79,
    description:
      "The House of Apollo the Lyre-Player, also known as the Casa dell'Apollo Citaredo, took its name from a painted panel in its tablinum showing the god crowned with laurel and playing his instrument, a nymph beside him and a cupid supporting his quiver. Its atrium preserved a rare architectural detail, the full original height of the compluvium opening, with tufa blocks still bracketing the roof-beam sockets. Vesuvius buried the house in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa di Aristide": {
    english: "House of Aristides",
    category: "house",
    extant_117ce: false,
    destroyed: 79,
    description:
      "Bourbon excavators cleared the House of Aristides between 1829 and 1831, naming it for a statue found there and misidentified as the statesman Aristides; it was later recognized as the orator Aeschines, but the house kept its name. Its small atrium centered on a pool, while rooms behind it sat on vaulted substructures over the hillside. A stairway led to service rooms where workers found the skeletons of residents who never escaped. Vesuvius buried it in 79 CE, 38 years before 117 CE.",
  },
  "Casa di Galba": {
    english: "House of Galba",
    category: "house",
    extant_117ce: false,
    built: -150,
    destroyed: 79,
    description:
      "The House of Galba stands as one of only three buildings so far excavated in its insula, most of the block still buried beneath modern Ercolano. Built in the Samnite period, its peristyle centered on a marble-lined cruciform pool with cylindrical columns and a fountain. The house took its name from a silver bust of the emperor Galba found just outside it, now held in the National Archaeological Museum of Naples. Vesuvius buried it in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Casa di Nettuno e Anfitrite": {
    english: "House of Neptune and Amphitrite",
    category: "house",
    extant_117ce: false,
    built: 50,
    destroyed: 79,
    description:
      "The House of Neptune and Amphitrite packed extraordinary decoration into a small footprint, built around the middle of the 1st century CE with a ground-floor shop opening onto the street. Its namesake wall mosaic, made of glass-paste tesserae rather than stone, depicts the sea god embracing his bride beneath a turquoise canopy framed by real seashells. Vesuvius buried the house in 79 CE, 38 years before this map's 117 CE snapshot, and the mosaic survives as one of the site's finest artworks.",
  },
  "Collegio degli Augustali": {
    english: "College of the Augustales",
    category: "college",
    extant_117ce: false,
    built: 65,
    destroyed: 79,
    description:
      "The College of the Augustales housed the priests of the imperial cult, freedmen granted status for tending the worship of Emperor Augustus and the imperial family. Built after the earthquake of 62 CE badly damaged Herculaneum's public buildings, its hall was lit by a single roof opening and decorated with Fourth Style frescoes of Hercules ascending to Olympus before Juno and Minerva. Vesuvius buried the hall in 79 CE, 38 years before this map's 117 CE snapshot, sealing the frescoes intact.",
  },
  "I Papiri": {
    english: "Villa of the Papyri",
    category: "villa",
    extant_117ce: false,
    built: -50,
    destroyed: 79,
    description:
      "The Villa of the Papyri sprawled roughly 250 meters along Herculaneum's seafront, built for Lucius Calpurnius Piso, Julius Caesar's father-in-law. Its peristyle garden ran 100 meters behind a portico of 64 columns, enclosing a pool 66 meters long. Bourbon tunnelers in the 1750s pulled nearly 1,800 carbonized papyrus scrolls from its library, the only library to survive intact from antiquity. Vesuvius buried the villa in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Padiglione della barca": {
    english: "Boat Pavilion",
    category: "monument",
    extant_117ce: false,
    destroyed: 79,
    description:
      "The Boat Pavilion shelters an 8.6-meter Roman rowboat found capsized on Herculaneum's ancient shoreline in 1982, abandoned during the eruption's final hours. Nearby, arched storage chambers held the remains of roughly 300 victims who fled the burning town only to be overtaken by pyroclastic surges while awaiting rescue by sea. Resin casts of their skeletons were later placed in the chambers where they died. Vesuvius buried the boat in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Palaestra": {
    english: "Great Palaestra",
    category: "palaestra",
    extant_117ce: false,
    built: -20,
    destroyed: 79,
    description:
      "The Great Palaestra covered nearly a full city block, roughly 105 by 70 meters, built during the Augustan reorganization of Herculaneum as a training ground for the town's youth. At its center lay a cross-shaped pool with arms roughly 50 by 30 meters, fed by a bronze fountain shaped like a five-headed serpent coiled around a tree. Much of the complex remained unexcavated and unfinished at the time of the eruption. Vesuvius buried it in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "South-Western Baths": {
    english: "South-Western Baths",
    category: "bath",
    extant_117ce: false,
    destroyed: 79,
    description:
      "The South-Western Baths stood in Herculaneum's Insula Occidentalis, but by 79 CE the complex had stopped functioning as a bathhouse. Excavators found its former bathing rooms converted into a boatyard, holding six oars, a coiled rope, a wooden rudder, and a red-painted serpent-shaped boat prow, alongside stacked planking from a vessel under repair. Vesuvius buried the abandoned baths and their boat gear in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Terme del Foro": {
    english: "Forum Baths",
    category: "bath",
    extant_117ce: false,
    built: -25,
    destroyed: 79,
    description:
      "The Forum Baths served as Herculaneum's main public bathhouse, built in the Augustan era with fully separate suites for men and women, each with its own entrance and sequence of cold, warm, and hot chambers. The women's baths survive best, their floor covered in a black-and-white mosaic of Triton brandishing a trident amid sea creatures. Herculaneum's roughly 4,000 to 5,000 residents relied on it daily. Vesuvius buried the baths in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
  "Terme Suburbane": {
    english: "Suburban Baths",
    category: "bath",
    extant_117ce: false,
    built: 10,
    destroyed: 79,
    description:
      "The Suburban Baths occupied a terrace between the town wall and the beach, a gift to Herculaneum from its leading citizen, the senator Marcus Nonius Balbus, in the early 1st century CE. Sea views accompanied bathers through the frigidarium, tepidarium, and caldarium, among the best-preserved Roman bath buildings anywhere. A slow sinking of the coastline, bradyseism, cracked its southern facade in its final years. Vesuvius buried the baths in 79 CE, 38 years before this map's 117 CE snapshot.",
  },
};

/** Look up a matching description for an OSM building name. */
export function herculaneumEntry(name: string | null | undefined): HerculaneumEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(HERCULANEUM_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return HERCULANEUM_LOOKUP[k];
  }
  return undefined;
}
