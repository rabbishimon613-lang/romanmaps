/** Hand-curated descriptions for named buildings at Rome — same pattern as app/anconaDescriptions.ts
 * and the other curate-buildings files [06-P0-2]. Keys are exact substrings of
 * public/data/sites/rome_buildings.geojson's `name` property, in Italian, matching invariant
 * 1.5's carve-out for the raw OSM layer.
 *
 * Rome is by far the largest of the 40 curated sites (3,557 named OSM building features) and the
 * last of the 40 to get this treatment. Almost all of that count is modern Rome — churches,
 * palazzi, ministry buildings, apartment blocks — with no link to the ancient city at all. Only
 * 63 named features in the extract carry an OSM `historic` tag suggesting real antiquity; of
 * those, 21 are churches or medieval/early-modern structures (skipped) and 21 more duplicate an
 * existing standalone `pois.geojson` point (the Colosseum, Pantheon, Forum Romanum, Arch of
 * Titus, Circus Maximus, Trajan's Forum/Column/Markets, the Baths of Trajan/Titus/Nero, and
 * more) — those standalone markers always win the click first, so curating the shadowed building
 * polygon underneath would just be unreachable dead code, the same shape Ephesus and Delphi's own
 * files already documented and left alone. That leaves the 35 entries below: real, distinct,
 * individually dated monuments that fill in the map's biggest remaining building-layer gap.
 *
 * Three genuinely tricky snapshot calls, all settled by construction date rather than fame:
 * the Base of the Colossus of Nero is `extant_117ce:false` because Hadrian didn't relocate the
 * statue here until ~128 CE — on 11 August 117 it still stood at its original Neronian spot on
 * the Velian ridge; the Arch of Gallienus is `extant_117ce:true` under its Augustan identity as
 * the plain Porta Esquilina gate, since the arch's current name and dedication only date to
 * Gallienus's rededication in 262 CE; and five famous arches (Constantine, Septimius Severus,
 * Janus Quadrifrons, the Argentarii) are all correctly `false` — every one of them rose in the
 * Severan-to-Constantinian building wave, 86 to 198 years after this map's snapshot.
 *
 * Three researched candidates were dropped rather than force-dated: "Tempio della Speranza (?)"
 * (the "(?)" in its own OSM name reflects a genuine, still-unresolved scholarly dispute over
 * which Forum Holitorium ruin is actually Spes); "Tempio di Iside a via Labicana" (sources
 * conflict on whether the "Isis et Serapis" district name is attested before or after 117); and
 * "insula Volusiana" (excavation reports place its build phases starting in the Hadrianic period,
 * which begins the same day as this map's snapshot — too close to call safely).
 *
 * "Tempio di Apollo" and "Tempio di Apollo Sosiano" are two separate OSM name strings for the
 * same building (the Temple of Apollo Sosianus, rededicated 13 BCE) — both keyed to identical
 * content below, the same double-name handling Delphi's own file already established for two
 * differently-spelled OSM tags of one real building.
 *
 * Sources: English and Italian Wikipedia, Penelope/UChicago's Platner & Ashby topographical
 * dictionary, Digital Augustan Rome, Turismo Roma's own municipal heritage pages, Livius.org, and
 * several classical-history reference sites — researched via a background WebSearch pass (direct
 * fetches to these domains stayed blocked in this environment). Filled in this shift — see
 * SHIFT_LOG.md for sourcing detail.
 */

export type RomeEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

export const ROME_LOOKUP: Record<string, RomeEntry> = {
  "Acquedotto Neroniano": {
    english: "Aqueduct of Nero (Arcus Neroniani)",
    category: "aqueduct",
    extant_117ce: true,
    built: 64,
    description:
      "Nero ran this arched branch off the Aqua Claudia in 64 CE to carry water up the Caelian and Palatine hills toward his new Domus Aurea, its brick piers striding across the valley later filled by the Colosseum. Domitian lengthened the line to reach his own palace on the Palatine within a generation. By 117 CE the arches had carried water for over fifty years, feeding imperial residences on the Palatine continuously.",
  },
  "Arco degli Argentari": {
    english: "Arch of the Money-Changers",
    category: "arch",
    extant_117ce: false,
    built: 204,
    description:
      "Rome's silver and money-changers financed this small marble-and-travertine arch at the edge of the Forum Boarium, dedicating it in 204 CE to Septimius Severus and his family. Reliefs on its piers once named Geta and the prefect Plautianus, both later chiselled away after their downfalls. In 117 CE the spot held no such arch at all — just the open cattle-market square, nearly ninety years before the bankers raised their monument here.",
  },
  "Arco di Costantino": {
    english: "Arch of Constantine",
    category: "arch",
    extant_117ce: false,
    built: 315,
    description:
      "The Senate dedicated this triple-bayed arch in 315 CE to celebrate Constantine's victory over Maxentius at the Milvian Bridge, reusing sculpted panels stripped from monuments of Trajan, Hadrian, and Marcus Aurelius. It rose beside the triumphal route between the Colosseum and the Palatine. In 117 CE the site was open ground along that same processional road — the arch itself lay two full centuries in the future.",
  },
  "Arco di Gallieno": {
    english: "Arch of Gallienus (Porta Esquilina)",
    category: "gate",
    extant_117ce: true,
    built: -10,
    description:
      "This travertine gate began as one of the Servian Wall's Republican openings, then Augustus rebuilt it in monumental form as the Porta Esquilina; the single arch standing today is what remains of its original three bays. In 117 CE it was still just a working city gate on the road east from Rome, unconnected to any emperor. Only in 262 CE did Gallienus rededicate it as a triumphal arch, giving it the name it carries now.",
  },
  "Arco di Giano": {
    english: "Arch of Janus Quadrifrons",
    category: "arch",
    extant_117ce: false,
    built: 320,
    description:
      "Workers raised this four-way marble-clad arch over the Cloaca Maxima's outflow at the edge of the Forum Boarium in the early 4th century CE, likely under Constantine, its 48 wall niches once holding statues. Merchants working the cattle market below used its four vaulted passages as a crossroads shelter rather than a triumphal monument. In 117 CE nothing stood on this spot but the open crossroads itself.",
  },
  "Arco di Settimio Severo": {
    english: "Arch of Septimius Severus",
    category: "arch",
    extant_117ce: false,
    built: 203,
    description:
      "The Senate raised this triple-bayed marble arch at the northwest corner of the Roman Forum in 203 CE, its panels carved with scenes from Septimius Severus's Parthian campaigns and the capture of Ctesiphon. Caracalla later erased his murdered brother Geta's name from the dedication. In 117 CE this ground at the foot of the Capitoline sat open beside the Rostra — the arch would not go up for another 86 years.",
  },
  "Base del Colosso di Nerone": {
    english: "Base of the Colossus of Nero",
    category: "monument",
    extant_117ce: false,
    built: 128,
    description:
      "Hadrian had this concrete foundation laid beside the Flavian Amphitheatre around 128 CE so that twenty-four elephants could haul Nero's 30-meter bronze Colossus here, clearing room for his new Temple of Venus and Roma. Only the pedestal's core blocks survive today. On 11 August 117 CE the statue still stood at its original Neronian location on the Velian ridge, over a decade before this base existed.",
  },
  "Cisterna delle Sette Sale": {
    english: "Seven Halls Cistern",
    category: "cistern",
    extant_117ce: true,
    built: 109,
    description:
      "Trajan's architect Apollodorus of Damascus built this brick-vaulted cistern on the Oppian Hill around 109 CE, its nine parallel double-story chambers holding roughly 8 million liters to feed the pools and fountains of the Baths of Trajan next door. A branch aqueduct off the Esquiline kept it filled. By 117 CE it had supplied the baths for about eight years.",
  },
  "Crypta Balbi": {
    english: "Crypt of Balbus",
    category: "monument",
    extant_117ce: true,
    built: -13,
    description:
      "Lucius Cornelius Balbus, honored with a triumph over the Garamantes, built Rome's third permanent stone theater here and dedicated it in 13 BCE, funding it from his African campaign's spoils. Behind the stage he added a long colonnaded courtyard — the crypta — where audiences sheltered from rain, ending in a broad semicircular exedra. By 117 CE the complex had stood for 130 years, still a working theater in the Campus Martius.",
  },
  "Curia di Pompio": {
    english: "Curia of Pompey",
    category: "curia",
    extant_117ce: true,
    built: -55,
    description:
      "Pompey the Great built this exedra-shaped meeting hall as part of his theater and portico complex, completed in 55 BCE, giving the Senate a new chamber after fire destroyed the old Curia Hostilia. On the Ides of March, 44 BCE, senators stabbed Julius Caesar 23 times here, and he fell at the foot of a statue of Pompey himself. Augustus later walled up the hall. By 117 CE the sealed chamber had sat silent for over a century.",
  },
  "Equus Traiani": {
    english: "Equestrian Statue of Trajan",
    category: "monument",
    extant_117ce: true,
    built: 112,
    description:
      "A colossal bronze statue of Trajan on horseback dominated the center of his new forum, dedicated along with the rest of the complex in January 112 CE. Coins from that year show the emperor gripping a downturned lance in one hand and a winged Victory in the other. By 117 CE the statue had presided over the piazza for five years — the very year Trajan died and Hadrian succeeded him.",
  },
  "Foro Boario": {
    english: "Forum Boarium (Cattle Market)",
    category: "forum",
    extant_117ce: true,
    description:
      "Rome's oldest marketplace grew up on the flat riverside ground between the Capitoline, Palatine, and Aventine hills, next to the city's original Tiber docks. Traders sold cattle here from as early as the 8th century BCE, and in 264 BCE the square hosted Rome's first recorded gladiator combat, staged as a funeral tribute. By 117 CE the forum was ringed with temples — Hercules Victor, Portunus, Mater Matuta — after eight centuries as a commercial hub.",
  },
  "Foro Olitorio": {
    english: "Forum Holitorium (Vegetable Market)",
    category: "forum",
    extant_117ce: true,
    description:
      "Squeezed between the Capitoline's slope, the Theatre of Marcellus, and the Tiber port, this square handled Rome's fruit and vegetable trade while the neighboring Forum Boarium sold meat and cattle. Its sacred precinct held three small Republican temples — to Janus, Spes, and Juno Sospita — built in the 3rd century BCE. By 117 CE the market and its temples had anchored this corner of the city for roughly 150 years.",
  },
  "Insula dell'Ara Coeli": {
    english: "Ara Coeli Insula",
    category: "house",
    extant_117ce: true,
    built: 110,
    description:
      "Builders raised this five-story apartment block against the Capitoline's slope in the early 2nd century CE, during Trajan's reign, packing shops at street level and housing for 350 to 400 tenants above. Ceiling heights shrank with each higher floor. Mussolini's 1930s demolitions around the Capitoline exposed it from beneath later medieval buildings. By 117 CE it stood as a newly finished addition to its crowded hillside neighborhood.",
  },
  "Largo di Torre Argentina": {
    english: "Sacred Area of Largo Argentina",
    category: "temple",
    extant_117ce: true,
    built: -300,
    description:
      "Four Republican temples stood packed together on this Campus Martius platform, the oldest going up in the early 3rd century BCE; archaeologists still label them Temple A through D for want of certain identifications with the gods named in ancient texts. Pompey's theater complex rose directly behind them within a lifetime. By 117 CE the four shrines had shared this raised sacred precinct for three to four centuries.",
  },
  "Macellum Liviae": {
    english: "Market of Livia",
    category: "market",
    extant_117ce: true,
    built: -7,
    description:
      "Augustus built this covered marketplace on the Esquiline Hill and named it for his wife Livia, with Tiberius dedicating the precinct in early 7 BCE. An open court roughly 80 by 25 meters, ringed by a portico and rows of shops, gave Esquiline residents a formal place to buy meat and produce outside the crowded Porta Esquilina. By 117 CE the market had served the neighborhood for 124 years.",
  },
  "Magazzini di Lucio Nevio Clemente": {
    english: "Warehouses of Lucius Naevius Clemens",
    category: "market",
    extant_117ce: true,
    built: 90,
    description:
      "A private owner named Lucius Naevius Clemens built this brick warehouse complex on the Quirinal Hill in the closing years of the 1st century CE, storing goods for the busy commercial district below. Workers restored the horrea again under Trajan and later under the Severans. By 117 CE the complex was recently repaired, long before Constantine's baths eventually buried it beneath their embankment.",
  },
  "Miliarum Aureum": {
    english: "Golden Milestone",
    category: "column",
    extant_117ce: true,
    built: -20,
    description:
      "Augustus erected this gilded bronze-sheathed column near the Temple of Saturn in 20 BCE, the year he took charge of Rome's road network, marking it as the symbolic zero point from which distances to every provincial gate were measured in gold lettering. It stood about 4 meters tall beside the Rostra. By 117 CE the milestone had marked the empire's notional center for 137 years.",
  },
  "Mura Serviane": {
    english: "Servian Wall",
    category: "monument",
    extant_117ce: true,
    built: -378,
    description:
      "After the Gauls sacked Rome in 390 BCE and exposed the city's weak defenses, workers quarried volcanic tuff from newly conquered Veii and finished a new 11-kilometer circuit wall by 378 BCE, some ten meters high with sixteen gates. Later tradition wrongly credited the wall to the 6th-century BCE king Servius Tullius, whose original earthen rampart it replaced. By 117 CE the tuff wall had stood for nearly 500 years, already obsolete as a defense.",
  },
  "Ninfeo di Alessandro Severo": {
    english: "Nymphaeum of Alexander Severus (Trofei di Mario)",
    category: "monument",
    extant_117ce: false,
    built: 226,
    description:
      "Emperor Severus Alexander built this monumental nymphaeum on the Esquiline Hill in 226 CE, its facade later nicknamed \"Trofei di Mario\" for the captured-arms trophies displayed there, marking where the Aqua Julia and Aqua Marcia fed a display fountain. In 117 CE this junction had only older Claudian-era aqueduct arches passing nearby — the fountain itself was 109 years from being built.",
  },
  "Porta Caelimontana": {
    english: "Porta Caelimontana (Arch of Dolabella)",
    category: "gate",
    extant_117ce: true,
    built: 10,
    description:
      "Consuls Publius Cornelius Dolabella and Gaius Junius Silanus rebuilt this Servian Wall gate on the Caelian Hill in travertine in 10 CE, giving it the alternate name Arch of Dolabella that stuck to this day. Nero's engineers later used its upper story as a support arch for a branch of the Aqua Claudia feeding the Domus Aurea. By 117 CE it had carried both road traffic below and aqueduct water above for over a century.",
  },
  "Portico d'Ottavia": {
    english: "Porticus Octaviae",
    category: "monument",
    extant_117ce: true,
    built: -27,
    description:
      "Augustus rebuilt this colonnaded precinct between 27 and 23 BCE on the site of the older Portico of Metellus, dedicating it to his sister Octavia and wrapping it around the temples of Jupiter Stator and Juno Regina near the Theatre of Marcellus. Libraries and meeting rooms filled its enclosure. By 117 CE the Augustan portico had stood for roughly 140 years — its rebuilding after a Severan-era fire still lay 74 years in the future.",
  },
  "Sepolcro di Gaio Poplicio Bibulo": {
    english: "Tomb of Gaius Publicius Bibulus",
    category: "tomb",
    extant_117ce: true,
    built: -100,
    description:
      "A plebeian aedile named Gaius Publicius Bibulus earned the rare honor of a public tomb built right on the Clivus Argentarius at the foot of the Capitoline, its inscription recording the Senate's grant of the burial plot itself as the reward. Built from tufa and travertine around 100 BCE, only its facade survives today. By 117 CE the tomb had stood in full public view for over 200 years.",
  },
  "Tempio B": {
    english: "Temple B, Largo Argentina",
    category: "temple",
    extant_117ce: true,
    built: -101,
    description:
      "Archaeologists label this round temple, the youngest of the four shrines in the Largo Argentina sacred precinct, \"Temple B\" for lack of a certain ancient name, though many identify it with the Temple of Fortuna Huiusce Diei that Quintus Lutatius Catulus vowed after his 101 BCE victory over the Cimbri. Its circular plan and marble columns set it apart from its three rectangular neighbors. By 117 CE it had shared the platform with the older temples for over two centuries.",
  },
  "Tempio C": {
    english: "Temple C, Largo Argentina",
    category: "temple",
    extant_117ce: true,
    built: -300,
    description:
      "Temple C is the oldest of the four sanctuaries at Largo Argentina, its podium going up in the early 3rd century BCE, possibly dedicated to the ancient goddess Feronia, among the very oldest standing temple structures anywhere in Rome. A large tufa altar sits before its facade. By 117 CE the temple had already stood on this spot for roughly four centuries.",
  },
  "Tempio D": {
    english: "Temple D, Largo Argentina",
    category: "temple",
    extant_117ce: true,
    built: -190,
    description:
      "The largest of the four Largo Argentina temples, Temple D, went up in the early 2nd century BCE and is tentatively linked to the cult of the Lares Permarini, gods thanked for victory at sea. Much of it still lies buried beneath the modern Via Florida. By 117 CE the temple had stood for roughly three centuries within the same crowded sacred enclosure as its three older neighbors.",
  },
  "Tempio delle Ninfe": {
    english: "Temple of the Nymphs",
    category: "temple",
    extant_117ce: true,
    built: -200,
    description:
      "This temple in the Campus Martius held Rome's census and electoral records, making it a target when a mob loyal to Clodius burned it down in 57 BCE during Cicero's political battles; workers rebuilt it afterward. A second major fire swept through the district in 80 CE, and Domitian's masons rebuilt the cella in brick soon after. By 117 CE the restored temple had stood for roughly 35 years since that Flavian repair.",
  },
  "Tempio di Apollo": {
    english: "Temple of Apollo Sosianus",
    category: "temple",
    extant_117ce: true,
    built: -13,
    description:
      "A temple to Apollo the Healer had stood on this Campus Martius site since 431 BCE, but the general Gaius Sosius rebuilt it entirely in fine marble after his 34 BCE triumph, work interrupted by civil war and finished once Augustus and Sosius reconciled. Rededicated around 13 BCE, it stood beside the new Theatre of Marcellus and the Portico of Octavia. By 117 CE the marble temple had marked this corner of Rome for about 130 years.",
  },
  "Tempio di Apollo Sosiano": {
    english: "Temple of Apollo Sosianus",
    category: "temple",
    extant_117ce: true,
    built: -13,
    description:
      "A temple to Apollo the Healer had stood on this Campus Martius site since 431 BCE, but the general Gaius Sosius rebuilt it entirely in fine marble after his 34 BCE triumph, work interrupted by civil war and finished once Augustus and Sosius reconciled. Rededicated around 13 BCE, it stood beside the new Theatre of Marcellus and the Portico of Octavia. By 117 CE the marble temple had marked this corner of Rome for about 130 years.",
  },
  "Tempio di Bellona": {
    english: "Temple of Bellona",
    category: "temple",
    extant_117ce: true,
    built: -296,
    description:
      "The consul Appius Claudius Caecus vowed this temple to the war goddess Bellona during the Third Samnite War in 296 BCE, deliberately siting it just outside the pomerium near the Circus Flaminius so the Senate could legally receive foreign envoys and returning generals there. A small column before it, the columna bellica, served as the ceremonial spot where priests threw a spear to formally declare war. By 117 CE the temple had hosted these rites for over four centuries.",
  },
  "Tempio di Ercole Vincitore": {
    english: "Temple of Hercules Victor",
    category: "temple",
    extant_117ce: true,
    built: -143,
    description:
      "This round marble temple in the Forum Boarium, likely funded by the general Lucius Mummius after he sacked Corinth, went up around 143 to 132 BCE using Pentelic marble imported from Greece — the earliest known marble building in Rome. Twenty slender columns ring its cella, a form later misidentified as a temple of Vesta. By 117 CE it had stood beside the Tiber for roughly 250 years, already one of the city's oldest surviving structures.",
  },
  "Tempio di Giunone Sospita": {
    english: "Temple of Juno Sospita",
    category: "temple",
    extant_117ce: true,
    built: -194,
    description:
      "Consul Gaius Cornelius Cethegus vowed this temple to Juno the Protectress during a campaign against Gallic tribes and dedicated it in the Forum Holitorium on 1 February 194 BCE. Six Ionic columns fronted its facade, set between the neighboring temples of Spes and Janus in the same sacred row. By 117 CE the temple had stood for 311 years.",
  },
  "Tempio di Minerva": {
    english: "Temple of Minerva (Forum Transitorium)",
    category: "temple",
    extant_117ce: true,
    built: 97,
    description:
      "Domitian began this temple to Minerva, his personal patron goddess, as the centerpiece of a narrow forum linking the older imperial squares, but his assassination in 96 CE left the project to his successor Nerva, who finished and dedicated the complex in 97 CE without changing its dedication. Two of its columns still stand today. By 117 CE the temple was twenty years old, part of the newest of Rome's imperial fora.",
  },
  "Tempio di Portuno": {
    english: "Temple of Portunus",
    category: "temple",
    extant_117ce: true,
    built: -120,
    description:
      "Rome's harbor god Portunus, guardian of the nearby Tiber docks, got this rectangular Ionic temple in the Forum Boarium sometime between 120 and 80 BCE, replacing an earlier shrine on the same spot. Its podium and four-sided colonnade of travertine and tufa, later stuccoed to imitate marble, survive today as one of Italy's best-preserved Republican temples. By 117 CE it had watched over river traffic at this bend of the Tiber for roughly two centuries.",
  },
  "Templi dell'Area Sacra di Sant'Omobono": {
    english: "Sanctuary of Sant'Omobono (Temples of Fortuna and Mater Matuta)",
    category: "temple",
    extant_117ce: true,
    built: -350,
    description:
      "An archaic wood-and-mudbrick temple stood on this spot beside the Forum Boarium as early as the 6th century BCE, among the oldest known temple foundations in Rome, until it was destroyed around the fall of the monarchy. After a century of neglect, builders raised the ground nearly 4 meters and built twin temples here, identified with Fortuna and Mater Matuta. By 117 CE the sanctuary had drawn worshippers to this riverside spot for over 700 years.",
  },
  "Tomb of Servius Sulpicius Galba": {
    english: "Tomb of Servius Sulpicius Galba",
    category: "tomb",
    extant_117ce: true,
    built: -100,
    description:
      "A member of the prominent Sulpicii Galbae family, likely the consul of 108 BCE, was buried in this plain rectangular tomb of tufa and peperino in the Emporium district south of the Aventine, near the riverside warehouse quarter his family later built up. Workers found it in 1885 buried along an ancient road, later enclosed within the sprawling Horrea Galbae. By 117 CE the tomb had marked this roadside spot for roughly two centuries.",
  },
};

// "Tempio B"/"Tempio C"/"Tempio D" are short enough that a plain substring test false-matches
// unrelated temples starting with "Tempio d..." (della, del, di) — e.g. "Tempio D" is a literal
// substring of "Tempio della Speranza (?)". These three keys require an exact match instead.
const EXACT_ONLY_KEYS = new Set(["Tempio B", "Tempio C", "Tempio D"]);

/** Look up a matching description for an OSM building name. */
export function romeEntry(name: string | null | undefined, _osmId?: number): RomeEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(ROME_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase().trim();
  for (const k of keys) {
    const klow = k.toLowerCase();
    if (EXACT_ONLY_KEYS.has(k) ? nlow === klow : nlow.includes(klow)) return ROME_LOOKUP[k];
  }
  return undefined;
}
