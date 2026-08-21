/** Hand-curated descriptions for named buildings in Paestum (ancient Poseidonia) — same pattern
 * as app/ostiaDescriptions.ts, app/pompeiiDescriptions.ts, app/herculaneumDescriptions.ts,
 * app/ephesusDescriptions.ts, app/delphiDescriptions.ts, app/jerashDescriptions.ts,
 * app/trierDescriptions.ts, app/meridaDescriptions.ts, app/palmyraDescriptions.ts,
 * app/athensDescriptions.ts, app/leptisMagnaDescriptions.ts, app/timgadDescriptions.ts,
 * app/djemilaDescriptions.ts, app/volubilisDescriptions.ts, app/sabrathaDescriptions.ts,
 * app/baalbekDescriptions.ts, app/luniDescriptions.ts and app/italicaDescriptions.ts — the
 * nineteenth site to get this treatment [06-P0-2].
 *
 * Greek colonists from Sybaris founded Poseidonia around 600 BCE on the fertile Sele plain south
 * of the Gulf of Salerno, naming it for Poseidon. By the late 5th century BCE the Oscan-speaking
 * Lucanians had taken the city, renaming it Paisom and ruling it for roughly a century and a
 * half. In 273 BCE, after Rome's wars with Pyrrhus, it became a Latin colony — Paestum — with
 * veteran-settlers planted on the site, a forum laid over the southern half of the old Greek
 * agora, and the standard furniture of a Roman town (comitium, curia, macellum, amphitheatre,
 * baths, domus) steadily added around the three Greek Doric temples, which remained standing and
 * in cult use throughout. By 117 CE Paestum was a modest, thoroughly Romanized municipium of
 * Italia — its Greek temples already six centuries old and still the dominant skyline on the
 * plain, its Roman civic core (forum, comitium, basilica, macellum, amphitheatre) all comfortably
 * pre-dating the snapshot by one to four centuries. Only the Ekklesiasterion, the Lucanian-era
 * assembly bowl the Romans deliberately buried under a new sanctuary once the comitium took over
 * its role, was already gone from view by 117 CE.
 *
 * Researched via a background WebSearch pass (Wikipedia, the Parco Archeologico di Paestum e
 * Velia's own site, vici.org, the Campania region's archaeology portal, academic aggregators —
 * direct fetch of most of these was network-blocked in the researching session, so facts are
 * corroborated through search-snippet synthesis, the same constraint every recent shift's Track A
 * work has documented), personally reviewed before merging. Two genuine source disagreements are
 * flagged rather than papered over: one source calls the temple encroaching on the comitium
 * "Mater Matuta" where most others (including the park's own restoration page) call it "Mens
 * Bona" — this file follows Mens Bona, matching the OSM tag and the park's own usage. And the
 * "Sanctuary with a pool" (intra-urban, on the forum, dedicated to Venus Verticordia, resting on
 * 73 stone pilasters per vici.org) is a genuinely distinct site from the "Sanctuary of Santa
 * Venera" (extra-urban, south of the walls, an Aphrodite Urania/Venus Iovia pool sanctuary
 * running continuously from ~600 BCE) — some secondary sources blur the two together, but this
 * file keeps them as separate OSM-tagged entries with separate research. */

export type PaestumEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

// Keys are matched as substrings against the OSM name (Italian/English), longer keys checked
// first, so keep entries specific to one building.
export const PAESTUM_LOOKUP: Record<string, PaestumEntry> = {
  "Tempio di Hera II - di Nettuno": {
    english: "Temple of Hera II (\"Temple of Neptune\")",
    category: "temple",
    extant_117ce: true,
    built: -450,
    description:
      "Raised around 450 BCE, this Doric giant measured almost 60 by 24.5 meters on a colonnade of six by fourteen columns, each cut with 24 flutes rather than the usual twenty. Eighteenth-century excavators wrongly dedicated it to Neptune; it was almost certainly Hera's temple all along, its two-tiered interior colonnade still dividing the cella into three aisles. By 117 CE it had watched Poseidonia become Lucanian Paisom and then Roman Paestum, unmoved through all three names.",
  },
  "Tempio di Hera I - Basilica": {
    english: "Temple of Hera I (the \"Basilica\")",
    category: "temple",
    extant_117ce: true,
    built: -550,
    description:
      "Built between 550 and 525 BCE, within a century of the city's founding, this is the oldest of Paestum's three Greek temples — 54 by 24.5 meters on an unusual nine-by-eighteen column plan whose odd-numbered facade forced a row of columns straight down the middle of the cella. Renaissance visitors, unable to identify its missing pediment, mistook it for a civic basilica, a name that stuck. Already nearly seven centuries old and visibly archaic beside its Doric neighbor, it remained the strangest silhouette on the plain in 117 CE.",
  },
  "Tempio di Athena": {
    english: "Temple of Athena (\"Temple of Ceres\")",
    category: "temple",
    extant_117ce: true,
    built: -500,
    description:
      "Built around 500 BCE, this Doric temple stood 14.5 by 32.9 meters on a base of six by thirteen columns, mixing Doric columns outside with Ionic columns in its deep porch. Eighteenth-century antiquarians misnamed it the Temple of Ceres; terracotta statuettes of an armed goddess found on site instead marked it for Athena. By 117 CE it had already served Poseidonians, Lucanians and Romans alike for six centuries, still crowning the highest ground in the city.",
  },
  "Tempio di Mens Bona": {
    english: "Temple of Mens Bona",
    category: "temple",
    extant_117ce: true,
    built: -180,
    description:
      "Roman colonists raised this single-cella temple in the early 2nd century BCE, wedging it into the forum so aggressively that it swallowed part of the older comitium's assembly ring. It was dedicated to Mens Bona, the \"good mind,\" a cult especially popular among freed slaves as a public expression of gratitude to their former masters. A working Roman cult building for nearly three centuries by 117 CE, this modest shrine kept its podium and altar intact into Trajan's day.",
  },
  Heroon: {
    english: "Heroön",
    category: "tomb",
    extant_117ce: true,
    built: -510,
    description:
      "Built around 510 BCE between the forum and the Athena sanctuary, this small stone chamber was sealed from the outside and buried under an earthen mound. Excavators opening it in 1954 found the offerings undisturbed — eight bronze vases, a black-figure amphora, iron skewers — but no human remains, and since burial inside the city walls was forbidden, archaeologists read it as a cenotaph honoring the colony's legendary founder. Sealed and untouched for over six centuries, it still lay hidden beneath its mound when Trajan died in 117 CE.",
  },
  Anfiteatro: {
    english: "Roman Amphitheatre",
    category: "theater",
    extant_117ce: true,
    built: -50,
    description:
      "Cut into the townscape around 50 BCE, Paestum's amphitheatre hosted gladiatorial games and beast hunts for a colony of Roman veteran-settlers two centuries into their tenure. Near the end of the 1st century CE builders wrapped an outer ring around the original arena to seat a larger crowd, a project long finished before Trajan's reign. A modern road driven through the site in 1930 buried its eastern half, leaving only the western arc visible today. By 117 CE the amphitheatre stood complete in both building phases, already the town's venue for spectacle for over a century and a half.",
  },
  Ekklesiasterion: {
    english: "Ekklesiasterion",
    category: "civic",
    extant_117ce: false,
    built: -480,
    description:
      "Cut directly into the rock and ringed with concentric stone benches, this circular, unroofed assembly hall held up to 1,700 citizens for the votes and debates of Poseidonia's democratic government from around 480 BCE onward, and kept meeting under Lucanian rule too. Once Rome founded its Latin colony in 273 BCE, the new comitium took over its civic role, and the old assembly bowl was deliberately filled in and built over with a Roman sanctuary. Already erased and buried nearly four centuries before Trajan's death, nothing of it was visible above ground in 117 CE.",
  },
  "Basilica romana": {
    english: "Roman Basilica (Curia)",
    category: "civic",
    extant_117ce: true,
    built: -273,
    description:
      "Set on the forum's north side soon after Rome planted its Latin colony in 273 BCE, this three-aisled hall doubled as basilica and curia, seat of the local senate and its archive of civic records. Magistrates heard lawsuits and administered justice inside its colonnaded nave, built directly over the old Greek agora. Already the working heart of Paestum's town government for nearly four centuries, it was still hosting magistrates and lawsuits when Trajan died in 117 CE.",
  },
  Macellum: {
    english: "Macellum",
    category: "market",
    extant_117ce: true,
    built: -50,
    description:
      "Built in the early imperial period over ground once occupied by a Greek-era temple, this covered market opened directly onto the south side of the forum. Excavators identified its trade by a shallow basin lined with waterproof cocciopesto mortar, still packed with discarded oyster shells. Trading under its roof for well over a century, the macellum was a fully functioning part of daily forum life by 117 CE.",
  },
  "Sanctuary of Santa Venera": {
    english: "Sanctuary of Santa Venera",
    category: "sanctuary",
    extant_117ce: true,
    built: -600,
    description:
      "Just beyond the city walls, across the Capodifiume stream, this open-air sanctuary served worshippers almost continuously from the city's Greek founding around 600 BCE into late antiquity. Its centerpiece was a great pool, 47 by 21 meters, built around a cult of Aphrodite Urania that Romans later recast as Venus. Already thirteen centuries into its life as a fertility shrine, the sanctuary and its pool were still in active use when Trajan died in 117 CE.",
  },
  "Casa con peristilio": {
    english: "House with Peristyle",
    category: "domus",
    extant_117ce: true,
    built: -150,
    description:
      "One of roughly eight residential quarters uncovered at Paestum, this domus followed the standard Roman house plan grafted onto a Greek layout — an atrium and reception rooms at the front, a colonnaded peristyle garden at the rear. The open court, ringed by a shaded portico, let air and light reach bedrooms and dining rooms that opened onto it. Already a settled feature of Paestum's streetscape for well over a century, this house's colonnaded garden was still shading its rooms in 117 CE.",
  },
  Comitium: {
    english: "Comitium",
    category: "civic",
    extant_117ce: true,
    built: -273,
    description:
      "One of the very first buildings raised when Rome planted its Latin colony in 273 BCE, this round, amphitheater-shaped assembly space with tiered stone seating gave Paestum's colonists a place to elect magistrates and pass local ordinances, mirroring the Comitium at Rome itself. Measuring about 20 by 15 meters, it lost part of its footprint in the early 2nd century BCE when the temple of Mens Bona was built directly against it. Trimmed but still standing after nearly four centuries of civic use, its benches were still hosting colonial votes when Trajan died in 117 CE.",
  },
  "Casa con impluvio di marmo": {
    english: "House with the Marble Impluvium",
    category: "domus",
    extant_117ce: true,
    built: -250,
    description:
      "Standing along the Via di Porta Marina, this compact but wealthy domus covered about 650 square meters and ranked among the richest Roman-period houses excavated at Paestum. A wide vestibule led into an atrium centered on a basin carved from marble rather than plain stone, catching rainwater funneled down from the roof's open compluvium. Already an established Roman residence for a couple of centuries, its marble basin was still catching rain when Trajan died in 117 CE.",
  },
  Shops: {
    english: "Forum shops (tabernae)",
    category: "market",
    extant_117ce: true,
    built: -273,
    description:
      "Rows of single-room tabernae, each about 5.3 meters wide, lined the forum that Rome laid out over the old Greek agora shortly after 273 BCE. Merchants worked with one wall open to the colonnaded square, selling goods and services straight onto the foot traffic of Paestum's civic center. Already trading for close to four centuries, these forum-front shops were still open for business when Trajan died in 117 CE.",
  },
  "Sanctuary with a pool": {
    english: "Sanctuary with a Pool",
    category: "sanctuary",
    extant_117ce: true,
    built: -180,
    description:
      "Inside the forum itself, Roman Paestum built an unusual sacred pool resting on 73 stone pilasters that once supported temporary wooden platforms for ritual use, dedicated to Venus Verticordia, \"the turner of hearts.\" Roman women invoked her every April at the Veneralia, carrying a wooden statue of the goddess in procession, washing it in the pool, dressing it in fine cloth and flowers, then bathing in the water themselves. Already a fixture of civic religious life for well over a century, the pool and its spring rites were still active when Trajan died in 117 CE.",
  },
  "Northern sanctuary": {
    english: "Northern Sanctuary (Athenaion precinct)",
    category: "sanctuary",
    extant_117ce: true,
    built: -600,
    description:
      "Near the city's Porta Aurea, this sacred precinct was one of two major sanctuary zones anchoring Poseidonia's original Greek street grid. Excavation here uncovered traces of cult activity older than the great Doric temple that came to dominate it — the temple long misidentified as Ceres's, but actually Athena's — surrounded by altars and votive deposits including terracotta figures of the armed goddess. Already the city's oldest continuously sacred ground for six centuries, the precinct and its temple still stood at the heart of Paestum's religious life in 117 CE.",
  },
};

/** Look up a matching description for an OSM building name. */
export function paestumEntry(name: string | null | undefined): PaestumEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(PAESTUM_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return PAESTUM_LOOKUP[k];
  }
  return undefined;
}
