/** Hand-curated descriptions for named buildings in Pompeii — same pattern as
 * app/ostiaDescriptions.ts, the second site to get this treatment [06-P0-2].
 * Sources: Pompeii Archaeological Park (pompeiisites.org); Britannica; Naples
 * Archaeological Museum; published excavation reports. Written to read like a
 * place blurb, not a scholar's footnote.
 *
 * Every entry is extant_117ce: false, destroyed: 79 — Pompeii was buried by
 * Vesuvius on 24 August 79 CE, 38 years before our snapshot, and every one of
 * these buildings is pinned as a ruin frozen at that moment, not as it stood
 * in 117 CE. `built` is negative for BCE. Omitted where the construction date
 * is genuinely unresolved among excavators rather than just unresearched. */

export type PompeiiEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number;
  destroyed?: number;
  description: string;
};

// Keys are matched as substrings against the OSM name (case-insensitive),
// longer keys checked first. Keep entries specific to one building.
export const POMPEII_LOOKUP: Record<string, PompeiiEntry> = {
  "Casa del Fauno": {
    english: "House of the Faun",
    category: "house",
    extant_117ce: false,
    built: -180,
    destroyed: 79,
    description:
      "Pompeii's largest private house, an entire city block with two atria and two peristyle gardens. Its floor held the Alexander Mosaic — some 1.5 million tiny stone tiles depicting the Battle of Issus, now in Naples' archaeological museum with a copy laid in its place. A small bronze dancer, the Dancing Faun, stood in the first atrium's pool and gave the house its name.",
  },
  "Tempio di Apollo": {
    english: "Temple of Apollo",
    category: "temple",
    extant_117ce: false,
    built: -120,
    destroyed: 79,
    description:
      "Pompeii's oldest and most important temple, ringed by 48 Ionic columns on a raised podium beside the Forum. Cult worship here reached back to the 6th century BCE, long before the standing building went up around 120 BCE. The earthquake of 62 CE tore through it, and repairs were still unfinished when Vesuvius erupted.",
  },
  "Tempio di Giove": {
    english: "Temple of Jupiter (Capitolium)",
    category: "temple",
    extant_117ce: false,
    built: -150,
    destroyed: 79,
    description:
      "Rome's Capitoline Triad — Jupiter, Juno, Minerva — was worshipped inside this temple at the Forum's north end, its podium standing roughly 17 by 37 meters. Built around 150 BCE and rededicated after Pompeii became a Roman colony in 80 BCE, it never recovered from the 62 CE earthquake. It still stood unrepaired on the day of the eruption.",
  },
  "Basilica di Pompei": {
    english: "Basilica",
    category: "basilica",
    extant_117ce: false,
    built: -125,
    destroyed: 79,
    description:
      "One of the oldest basilicas known anywhere in the Roman world, built around 125 BCE at the Forum's southwest corner. Some 1,500 square meters of covered hall hosted lawsuits, contracts, and the everyday business of a working port town. A raised platform at the west end served as the tribunal, with small holding rooms tucked underneath for defendants awaiting trial.",
  },
  Lupanare: {
    english: "The Brothel",
    category: "brothel",
    extant_117ce: false,
    built: 72,
    destroyed: 79,
    description:
      "Pompeii's only building put up specifically as a brothel — a coin pressed into its wall plaster dates construction to around 72 CE, barely seven years before Vesuvius erupted. Ten narrow cells, each fitted with a stone bed, line two floors around a corridor covered in erotic frescoes and client graffiti.",
  },
  "Terme Stabiane": {
    english: "Stabian Baths",
    category: "bath",
    extant_117ce: false,
    built: -125,
    destroyed: 79,
    description:
      "The oldest public bath complex known anywhere in the Roman world, with parts reaching back to the 4th century BCE and its main build around 125 BCE. It fills an entire city block, terracotta wall pipes once carrying hot air to separate men's and women's wings that shared a single furnace.",
  },
  "Terme del Foro": {
    english: "Forum Baths",
    category: "bath",
    extant_117ce: false,
    built: -80,
    destroyed: 79,
    description:
      "Built with public money in 80 BCE, the year Pompeii became a Roman colony, funded by two aediles and the town's chief magistrate. Modeled on the older Stabian Baths a few streets away, its vaulted ceilings were redecorated with stucco mythological reliefs after the 62 CE earthquake.",
  },
  "Terme centrali": {
    english: "Central Baths",
    category: "bath",
    extant_117ce: false,
    built: 63,
    destroyed: 79,
    description:
      "Begun after the 62 CE earthquake and designed to be Pompeii's largest bath complex, with one shared circuit of rooms instead of separate wings for men and women. Work was still going on when Vesuvius erupted — no furnaces were ever installed, leaving it a rare frozen snapshot of an active Roman building site.",
  },
  Macellum: {
    english: "Macellum (food market)",
    category: "market",
    extant_117ce: false,
    built: -120,
    destroyed: 79,
    description:
      "Pompeii's covered provisions market, its centerpiece a twelve-sided pavilion built for the fish trade, complete with a drainage channel for cleaning the catch. A shrine to the imperial cult stood at the back, and the surrounding walls carried still-life paintings of game and fruit. Earthquake repairs from 62 CE were still under way when the city was buried.",
  },
  "Edificio di Eumachia": {
    english: "Building of Eumachia",
    category: "civic",
    extant_117ce: false,
    built: 3,
    destroyed: 79,
    description:
      "A monumental porticoed hall on the Forum, funded around 3 CE by Eumachia, a wealthy priestess of Venus from a wool-trading family — one of the few major public buildings in the Roman world known to have been paid for by a woman in her own name. The wool-fullers' guild, who used the building, dedicated a statue of her that still stood in a niche at the rear.",
  },
  "Santuario dei Lari Pubblici": {
    english: "Sanctuary of the Public Lares",
    category: "shrine",
    extant_117ce: false,
    destroyed: 79,
    description:
      "An unusually shaped shrine on the Forum, roughly 18 by 21 meters, dedicated to the Lares Publici — guardian spirits of the whole city rather than of any one household. An apse and several niches once held a rich set of statues, all lost to time. Its odd, improvised layout stands out against the more conventional temples around it on the Forum.",
  },
  "Tempio di Vespasiano": {
    english: "Temple of Vespasian",
    category: "temple",
    extant_117ce: false,
    built: 70,
    destroyed: 79,
    description:
      "A small imperial-cult shrine wedged between the Building of Eumachia and the Sanctuary of the Public Lares, among the youngest structures on the Forum. Its marble altar carries a relief of a bull being led to sacrifice — the offering reserved for a living emperor's guardian spirit — framed by carved sacrificial knives and ox skulls.",
  },
  "Foro di Pompei": {
    english: "Forum",
    category: "forum",
    extant_117ce: false,
    built: -150,
    destroyed: 79,
    description:
      "A pedestrian-only plaza roughly 142 by 38 meters, paved in travertine and ringed on three sides by a two-story colonnade added in the 2nd century BCE. Large stone blocks set into its entrances physically kept carts out. Temples, the market, the basilica, and the town's civic offices all opened directly onto it.",
  },
  "Casa di Sallustio": {
    english: "House of Sallust",
    category: "house",
    extant_117ce: false,
    built: -350,
    destroyed: 79,
    description:
      "One of the oldest houses standing in Pompeii, its core dating to the 4th century BCE and named for an election notice painted on its facade endorsing a Gaius Sallustius. Its walls still carried the faux-marble panels of the earliest Pompeian painting style, and by the final years part of the house had been turned into an inn for travelers.",
  },
  "Casa del Citarista": {
    english: "House of the Citharist",
    category: "house",
    extant_117ce: false,
    destroyed: 79,
    description:
      "A sprawling house of roughly 2,700 square meters, merged from at least two earlier homes and built around three separate peristyle gardens on two levels. Named for a bronze statue of Apollo playing the cithara found there, its main garden pool was ringed with bronze animal statues — a boar set on by dogs, a lion, a fleeing deer.",
  },
  "Casa di Paquio Proculo": {
    english: "House of Paquius Proculus",
    category: "house",
    extant_117ce: false,
    destroyed: 79,
    description:
      "A house best known for its entrance mosaic of a chained guard dog and an elaborate geometric floor laid in alabaster in the atrium. Already cracked by the 62 CE earthquake, the house was still standing when Vesuvius erupted — excavators found the remains of seven children who had taken shelter together in a room off the garden.",
  },
  "Casa di Meleagro": {
    english: "House of Meleager",
    category: "house",
    extant_117ce: false,
    built: -200,
    destroyed: 79,
    description:
      "A Samnite-era house with a plain street front hiding a lavishly painted interior, its walls redecorated across three centuries of changing fashion. Named for a fresco of the hunter Meleager and Atalanta, most of its best mythological paintings — Mars and Venus, Io watched over by Argus — were cut out and taken to Naples after excavation.",
  },
  "Praedia di Giulia Felice": {
    english: "Praedia of Julia Felix",
    category: "house",
    extant_117ce: false,
    built: -30,
    destroyed: 79,
    description:
      "A sprawling property of roughly 5,800 square meters combining a luxury house, an inn, private baths, and gardens, assembled from several older buildings in the late 1st century BCE. After the 62 CE earthquake its owner, a woman named Julia Felix, opened her baths to the public and advertised rooms for rent on a painted sign — evidence the building's use had already shifted well before the eruption.",
  },
  "Palestra Sannitica": {
    english: "Samnite Palaestra",
    category: "palaestra",
    extant_117ce: false,
    built: -150,
    destroyed: 79,
    description:
      "A tuff-columned exercise courtyard where young Pompeian men trained, likely the meeting place of an association of noble youths who paraded and competed together. A Roman copy of the Greek sculptor Polykleitos's Spear-Bearer, found on the site, helped identify what the courtyard was used for. After 62 CE the neighboring Temple of Isis expanded into part of its space, shrinking the palaestra before the eruption.",
  },
  "Granai del Foro": {
    english: "Forum Granary",
    category: "warehouse",
    extant_117ce: false,
    built: -80,
    destroyed: 79,
    description:
      "A public warehouse on the Forum's west side, built in the 1st century BCE to store the grain and produce that fed the town. Long after the eruption, excavators turned its long storage bays into a display space for amphorae and for the plaster casts of Pompeians caught by the ash — it now holds the largest such collection on the site.",
  },
  "Mensa Ponderaria": {
    english: "Mensa Ponderaria (public weights table)",
    category: "civic",
    extant_117ce: false,
    built: -110,
    destroyed: 79,
    description:
      "A limestone counter built into the outer wall of the Temple of Apollo, fitted with nine round hollows sized to standard measures for grain and produce sold in the market next door. An inscription records that after Pompeii became a Roman colony, the town's magistrates had the measures recut to match Roman standards and added three more.",
  },
  "Arco di Caligola": {
    english: "Arch of Caligula",
    category: "arch",
    extant_117ce: false,
    destroyed: 79,
    description:
      "A single-arched honorary gateway at the start of the Via di Mercurio near the Forum Baths, long known as the Arch of Caligula for fragments of a bronze equestrian statue found nearby that were once thought to show the emperor. It stood on the same street axis as a matching arch a short way off, part of a pair framing the approach to the Forum.",
  },
  "Porta Nola": {
    english: "Nola Gate",
    category: "gate",
    extant_117ce: false,
    built: -250,
    destroyed: 79,
    description:
      "One of Pompeii's seven main gates, cut from tuff with a single wide archway leading out toward the town of Nola. An Oscan-language inscription, now in the British Museum, credits its construction to the Samnite magistrate Vibius Popidius. A weathered relief bust of Minerva still looks down from the inner keystone.",
  },
  "Casa della Venere in Conchiglia": {
    english: "House of Venus in the Shell",
    category: "house",
    extant_117ce: false,
    built: 60,
    destroyed: 79,
    description:
      "Named for a large, strikingly well-preserved fresco on its garden wall of a nude Venus reclining in a giant scallop shell, flanked by cupids. The rest of the garden wall was painted to extend the space itself — fountains, hedges, and birds giving the small courtyard the illusion of a much larger private park.",
  },
  "Casa del Moralista": {
    english: "House of the Moralist",
    category: "house",
    extant_117ce: false,
    destroyed: 79,
    description:
      "Formed by joining two older houses, its dining room once carried three painted verse inscriptions unique in Pompeii — house rules in elegiac couplets telling guests to keep their hands off other men's wives, avoid quarrels, and wash their feet before reclining. A bronze seal found in the wine cellar names the likely owner, Caius Arrius Crescens; one of the three inscriptions was destroyed by Allied bombing in 1944.",
  },
  "Casa di Apollo": {
    english: "House of Apollo",
    category: "house",
    extant_117ce: false,
    destroyed: 79,
    description:
      "A large thirteen-room house named for a cycle of garden paintings showing the god Apollo enthroned beneath a canopy. Some of its finest figural mosaics were lifted and taken to Naples' museum after excavation in the 19th century; others remain on the floors where they were laid.",
  },
  "Casa del Giardino di Ercole": {
    english: "House of the Garden of Hercules",
    category: "house",
    extant_117ce: false,
    destroyed: 79,
    description:
      "Also known as the House of the Perfumer for the glass vials, seeds, and irrigation channels found in its garden — physical evidence of a working perfume business rather than an ornamental courtyard. A small marble statue of Hercules gave the house its name, and a mosaic by the entrance reads 'Cras credo,' credit given tomorrow.",
  },
  "Castellum Aquae": {
    english: "Castellum Aquae (water tower)",
    category: "water",
    extant_117ce: false,
    built: -20,
    destroyed: 79,
    description:
      "Pompeii's main water tower, sited at the highest point in the city beside the Vesuvius Gate to feed the town by gravity. Water arriving via the Augustan-era Serino aqueduct was split here into three mains feeding fourteen smaller distribution towers across the city. Cracked by the 62 CE earthquake, it was patched with an improvised above-ground pipe network — damage visible even in a fresco painted inside a nearby house.",
  },
};

/** Look up a matching description for an OSM building name. */
export function pompeiiEntry(name: string | null | undefined): PompeiiEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(POMPEII_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return POMPEII_LOOKUP[k];
  }
  return undefined;
}
