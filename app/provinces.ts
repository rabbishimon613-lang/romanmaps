/** The empire's provincial map, 117 CE. One entry per administrative unit — the ~53 polygons in
 * `public/data/provinces.geojson` collapse to ~43 pages here because Italy's eleven Augustan
 * regiones (`I`–`XI` in that file) aren't provinces at all and share one page, and a handful of
 * short-lived or contested units fold into their nearest real province rather than shipping an
 * empty page. `aliases` lists every distinct `province` string seen across `pois.geojson` and
 * `sites.ts` so `app/province/[slug]/page.tsx` can group content without a second data pass.
 *
 * Sources for administrative status/capital, used across the file unless a per-entry source is
 * more specific: Barrington Atlas of the Greek and Roman World; A.H.M. Jones, The Cities of the
 * Eastern Roman Provinces; F. Millar, The Roman Near East; CAH XI (The High Empire, 70–192 CE).
 */

export type ProvinceStatus =
  | "region" // Italy — not a province
  | "senatorial" // governed by a proconsul, Senate-appointed
  | "imperial-consular" // governed by a legatus Augusti pro praetore of consular rank, usually multi-legion
  | "imperial-praetorian" // governed by a legatus Augusti pro praetore of praetorian rank
  | "imperial-procurator" // small province run by an equestrian procurator, not a senator
  | "prefecture"; // Egypt only — run by an equestrian prefect, senators barred by law

export type Province = {
  slug: string;
  displayName: string;
  /** Matches `properties.name` in public/data/provinces.geojson, for map linking. Null = no single
   * polygon (Italia) or the polygon is folded into another entry's page. */
  polygonName: string | null;
  status: ProvinceStatus;
  capital: string;
  /** app/sites.ts slug for the capital, if it's already a mapped site. */
  capitalSlug?: string;
  blurb: string;
  aliases: string[];
  sources: string[];
};

export const PROVINCES: Province[] = [
  {
    slug: "italia",
    displayName: "Italia",
    polygonName: null,
    status: "region",
    capital: "Rome",
    capitalSlug: "rome",
    blurb:
      "Italy was never a province — it was the empire's metropole, its free citizens exempt from the land tax every provincial paid. Augustus split it into eleven administrative regions for the census, from Latium et Campania around Rome to Venetia et Histria in the northeast. By 117 CE the whole peninsula had been Roman for two centuries and its cities competed for imperial building projects, not survival.",
    aliases: ["Italia", "Campania", "Venetia et Histria"],
    sources: ["Barrington Atlas of the Greek and Roman World", "Pliny the Elder, Natural History 3"],
  },
  {
    slug: "britannia",
    displayName: "Britannia",
    polygonName: "Britannia",
    status: "imperial-consular",
    capital: "Londinium",
    blurb:
      "Conquered from 43 CE, still only two-thirds occupied by 117 — the Scottish Highlands and most of Wales sat outside direct control. Three legions garrisoned the frontier, the highest legion-per-taxpayer ratio anywhere in the empire. Hadrian's Wall was five years off; in 117 the northern line ran along a looser chain of forts the new emperor would soon replace with stone.",
    aliases: ["Britannia"],
    sources: ["Tacitus, Agricola", "Barrington Atlas"],
  },
  {
    slug: "gallia-lugdunensis",
    displayName: "Gallia Lugdunensis",
    polygonName: "Lugdunensis",
    status: "imperial-praetorian",
    capital: "Lugdunum",
    blurb:
      "Central Gaul, organized around Lugdunum's confluence of the Rhône and Saône. The city held the empire's western mint and hosted the annual assembly of Gaul's sixty tribal delegates at the altar of Roma and Augustus — the model every other province's imperial-cult center copied. A fire under Nero (65 CE) and Vitellian troops under the Year of Four Emperors (69) had both scarred the city; by 117 both were long rebuilt.",
    aliases: ["Gallia Lugdunensis", "Lugdunensis"],
    sources: ["Strabo, Geography 4", "Barrington Atlas"],
  },
  {
    slug: "gallia-belgica",
    displayName: "Gallia Belgica",
    polygonName: "Belgica",
    status: "imperial-praetorian",
    capital: "Durocortorum",
    blurb:
      "Northeastern Gaul, named for the Belgae Caesar called the bravest of all Gallic peoples in his own conquest narrative. Durocortorum (Reims) was its administrative capital, but Augusta Treverorum on the Moselle — modern Trier — was already growing into the region's real commercial center, on its way to becoming an imperial residence within two centuries.",
    aliases: ["Gallia Belgica"],
    sources: ["Caesar, Gallic War 1.1", "Barrington Atlas"],
  },
  {
    slug: "germania-inferior",
    displayName: "Germania Inferior",
    polygonName: "Germania Inferior",
    status: "imperial-consular",
    capital: "Colonia Claudia Ara Agrippinensium",
    blurb:
      "The lower Rhine frontier, formalized as a province under Domitian in 85 CE after decades as a military district. Two legions held the river line; the provincial capital, modern Cologne, was founded as a colony for veterans and named for Agrippina the Younger, who was born there.",
    aliases: ["Germania Inferior"],
    sources: ["Tacitus, Annals 12.27", "Barrington Atlas"],
  },
  {
    slug: "germania-superior",
    displayName: "Germania Superior",
    polygonName: "Germania Superior",
    status: "imperial-consular",
    capital: "Mogontiacum",
    blurb:
      "The upper Rhine and Main frontier, also made a formal province in 85 CE. Mogontiacum — modern Mainz — anchored two legions at the river crossing; the Taunus limes running east of the Rhine had been pushed forward under the Flavians and was still being consolidated with a chain of new forts when Trajan died.",
    aliases: ["Germania Superior"],
    sources: ["Tacitus, Germania", "Barrington Atlas"],
  },
  {
    slug: "gallia-aquitania",
    displayName: "Gallia Aquitania",
    polygonName: "Aquitania",
    status: "imperial-praetorian",
    capital: "Burdigala",
    blurb:
      "Southwestern Gaul between the Garonne and the Pyrenees, the province Caesar described as ethnically distinct from the rest of Gaul — closer, he thought, to the Iberians across the mountains. Burdigala (Bordeaux) sat on the Garonne's tidal reach and was already shipping wine north by the second century, the start of a trade the region never abandoned.",
    aliases: ["Gallia Aquitania", "Aquitania"],
    sources: ["Caesar, Gallic War 1.1", "Barrington Atlas"],
  },
  {
    slug: "alpes-graiae-poeninae",
    displayName: "Alpes Graiae et Poeninae",
    polygonName: "Alpes Graiae et Poeninae",
    status: "imperial-procurator",
    capital: "Axima",
    blurb:
      "One of three small Alpine provinces Augustus carved out to run the mountain passes directly rather than leave them to Gaul or Italy — this one covers the Great and Little St Bernard routes. An equestrian procurator, not a senator, ran it: too small and too strategically narrow a job to hand to the Senate.",
    aliases: ["Alpes Graiae et Poeninae"],
    sources: ["Barrington Atlas"],
  },
  {
    slug: "alpes-cottiae",
    displayName: "Alpes Cottiae",
    polygonName: "Alpes Cottiae",
    status: "imperial-procurator",
    capital: "Segusio",
    blurb:
      "Named for Cottius, the local dynast who submitted to Augustus and was left running his own mountain kingdom as a Roman client before it was annexed outright under Nero. Segusio (Susa) still carries Cottius's own triumphal arch, dedicated to Augustus around 9 BCE — one of the best-preserved Augustan monuments left standing in 117.",
    aliases: ["Alpes Cottiae"],
    sources: ["CIL V 7231 (Arch of Augustus, Susa)", "Barrington Atlas"],
  },
  {
    slug: "alpes-maritimae",
    displayName: "Alpes Maritimae",
    polygonName: "Alpes Maritimae",
    status: "imperial-procurator",
    capital: "Cemenelum",
    blurb:
      "The coastal Alpine strip behind Nice, the last of Augustus's three mountain-pass provinces and the one that let Rome control the road along the Ligurian coast without routing it through client territory. Its capital Cemenelum sits just above modern Nice; the Tropaeum Alpium at La Turbie, dedicated 7/6 BCE, lists every tribe Rome claimed to have subdued to secure the pass.",
    aliases: ["Alpes Maritimae"],
    sources: ["Pliny the Elder, Natural History 3.136–137 (Tropaeum Alpium inscription)"],
  },
  {
    slug: "gallia-narbonensis",
    displayName: "Gallia Narbonensis",
    polygonName: "Narbonensis",
    status: "senatorial",
    capital: "Narbo",
    blurb:
      "The oldest Roman territory in Gaul, organized as a province in 121 BCE — two centuries Roman by 117 CE, and it showed. Pliny the Elder called it more like Italy than a province: villas, vineyards and a Senate seat rather than a legion. Narbo (Narbonne) gave the province its name; Massilia, an older Greek colony, kept a special semi-autonomous status inside it.",
    aliases: ["Narbonensis"],
    sources: ["Pliny the Elder, Natural History 3.31"],
  },
  {
    slug: "hispania-tarraconensis",
    displayName: "Hispania Tarraconensis",
    polygonName: "Tarraconensis",
    status: "imperial-consular",
    capital: "Tarraco",
    blurb:
      "By far the largest Spanish province — most of the peninsula, from the Pyrenees to the Atlantic northwest. Trajan himself was born at Italica, not here, but Tarraco's provincial forum and its temple to the deified Augustus, dedicated by Tiberius, made it the ceremonial seat for the whole Hispanic imperial cult.",
    aliases: ["Hispania Tarraconensis", "Tarraconensis", "Hispania Citerior"],
    sources: ["Strabo, Geography 3.4", "Barrington Atlas"],
  },
  {
    slug: "hispania-baetica",
    displayName: "Hispania Baetica",
    polygonName: "Baetica",
    status: "senatorial",
    capital: "Corduba",
    blurb:
      "The richest Spanish province, named for the Baetis (Guadalquivir) river that carried its olive oil to Rome — so much of it that the amphorae stamps recovered from Monte Testaccio, Rome's broken-pottery hill, are mostly Baetican. Trajan and Hadrian both had family roots here, at Italica just upriver from Corduba.",
    aliases: ["Hispania Baetica", "Baetica"],
    sources: ["Strabo, Geography 3.2", "Rodríguez-Almeida, Il Monte Testaccio"],
  },
  {
    slug: "lusitania",
    displayName: "Lusitania",
    polygonName: "Lusitania",
    status: "imperial-praetorian",
    capital: "Emerita Augusta",
    capitalSlug: "merida",
    blurb:
      "Western Iberia, roughly modern Portugal and Spanish Extremadura, settled with veterans of Augustus's Cantabrian Wars at its capital Emerita Augusta — 'the veterans' city' — around 25 BCE. The theatre and amphitheatre built for those retired legionaries were already a century old by 117 and still in use.",
    aliases: ["Lusitania"],
    sources: ["Cassius Dio, Roman History 53.26", "Barrington Atlas"],
  },
  {
    slug: "raetia",
    displayName: "Raetia",
    polygonName: "Raetia",
    status: "imperial-procurator",
    capital: "Augusta Vindelicorum",
    blurb:
      "The Alpine and upper-Danube province Tiberius and Drusus conquered in a single campaigning season in 15 BCE, opening the shortest road from Italy to the Rhine. Run by an equestrian procurator rather than a senator, it garrisoned auxiliary units, not legions — the legionary muscle sat next door in the two Germanies.",
    aliases: ["Raetia"],
    sources: ["Cassius Dio, Roman History 54.22", "Barrington Atlas"],
  },
  {
    slug: "noricum",
    displayName: "Noricum",
    polygonName: "Noricum",
    status: "imperial-procurator",
    capital: "Virunum",
    blurb:
      "A former client kingdom absorbed peacefully around 15 BCE, famous in antiquity for its iron — ferrum Noricum was the standard by which Roman writers judged sword steel. Virunum, its capital on the Zollfeld plain, never needed walls: Noricum's annexation was so uncontested it kept almost no permanent garrison.",
    aliases: ["Noricum"],
    sources: ["Pliny the Elder, Natural History 34.145 (Noric iron)", "Barrington Atlas"],
  },
  {
    slug: "sicilia",
    displayName: "Sicilia",
    polygonName: "Sicilia",
    status: "senatorial",
    capital: "Syracusae",
    blurb:
      "Rome's first province, taken from Carthage in 241 BCE at the end of the First Punic War and still, four centuries later, one of the empire's grain baskets — Cicero's prosecution of the corrupt governor Verres, delivered from this island's own farmers' complaints, remained required reading for every Roman student.",
    aliases: ["Sicilia"],
    sources: ["Cicero, In Verrem", "Barrington Atlas"],
  },
  {
    slug: "pannonia-superior",
    displayName: "Pannonia Superior",
    polygonName: "Pannonia Superior",
    status: "imperial-consular",
    capital: "Carnuntum",
    capitalSlug: "carnuntum",
    blurb:
      "The western half of Pannonia, split from the single original province in 106 CE — the same year Trajan finished off Dacia across the river. Carnuntum anchored a legion on the Danube's great bend and doubled as a trading post for amber coming down from the Baltic.",
    aliases: ["Pannonia Superior"],
    sources: ["CIL III (Carnuntum inscriptions)", "Barrington Atlas"],
  },
  {
    slug: "pannonia-inferior",
    displayName: "Pannonia Inferior",
    polygonName: "Pannonia Inferior",
    status: "imperial-praetorian",
    capital: "Aquincum",
    capitalSlug: "aquincum",
    blurb:
      "The eastern half of the 106 CE split, fronting the Sarmatian tribes across the Danube rather than the Germans further west. Aquincum — under modern Budapest — held a legion and grew a civilian town alongside its fortress; both would eventually merge into one municipality, though not yet in 117.",
    aliases: ["Pannonia Inferior"],
    sources: ["Barrington Atlas"],
  },
  {
    slug: "dalmatia",
    displayName: "Dalmatia",
    polygonName: "Dalmatia",
    status: "imperial-praetorian",
    capital: "Salona",
    blurb:
      "The Adriatic's eastern coast, conquered in stages that finished only with Tiberius's brutal three-year suppression of the Great Illyrian Revolt (6–9 CE) — the hardest war Augustus ever fought, by his own account. By 117 the province was fully pacified and demilitarized, its legions long since reassigned to the Danube frontier.",
    aliases: ["Dalmatia"],
    sources: ["Suetonius, Tiberius 16", "Cassius Dio, Roman History 55–56"],
  },
  {
    slug: "sardinia-corsica",
    displayName: "Sardinia et Corsica",
    polygonName: "Sardinia et Corsica",
    status: "imperial-procurator",
    capital: "Caralis",
    blurb:
      "Rome's second province after Sicily, seized from Carthage in 238 BCE during the mercenary revolt that followed the First Punic War. Sardinia's interior mountains stayed lightly Romanized and malarial well into the imperial period — Cicero called exile here one of the harshest a Roman could draw.",
    aliases: ["Sardinia et Corsica"],
    sources: ["Cicero, Pro Scauro", "Barrington Atlas"],
  },
  {
    slug: "moesia-superior",
    displayName: "Moesia Superior",
    polygonName: "Moesia Superior",
    status: "imperial-consular",
    capital: "Viminacium",
    blurb:
      "The western half of the middle Danube frontier, split from a single Moesia in 86 CE under Domitian to give each half its own consular legate for the Dacian wars. Viminacium's legionary fortress was Trajan's own staging base for the second Dacian campaign of 105–106 — Trajan's Bridge across the Danube starts a short march downstream from it.",
    aliases: ["Moesia Superior"],
    sources: ["Cassius Dio, Roman History 68.13 (Trajan's Danube bridge)"],
  },
  {
    slug: "dacia",
    displayName: "Dacia",
    polygonName: "Dacia",
    status: "imperial-praetorian",
    capital: "Sarmizegetusa",
    blurb:
      "The empire's newest province, finished in 106 CE after Trajan's two hard-fought wars against King Decebalus — commemorated the same year on the 200-foot spiral relief of Trajan's Column in Rome. A gold rush followed almost immediately at Alburnus Maior in the Apuseni mountains; veteran colonies were still being planted when Trajan died eleven years later.",
    aliases: ["Dacia"],
    sources: ["Cassius Dio, Roman History 68.6–14", "Trajan's Column reliefs"],
  },
  {
    slug: "moesia-inferior",
    displayName: "Moesia Inferior",
    polygonName: "Moesia Inferior",
    status: "imperial-consular",
    capital: "Tomis",
    blurb:
      "The eastern half of the Danube split, fronting the Black Sea's Getic and Sarmatian frontier. Its port city Tomis is best known for a single unwilling resident: the poet Ovid, exiled here by Augustus in 8 CE for reasons he never named outright, and dead in this province a decade later without ever being recalled.",
    aliases: ["Moesia Inferior"],
    sources: ["Ovid, Tristia and Epistulae ex Ponto"],
  },
  {
    slug: "thracia",
    displayName: "Thracia",
    polygonName: "Thracia",
    status: "imperial-praetorian",
    capital: "Perinthus",
    blurb:
      "A client kingdom until Claudius annexed it outright in 46 CE after the last Thracian king died without an heir the Senate trusted. Governed first by a procurator, then — from around 107 CE — by a full legatus Augusti, an upgrade in status that lands squarely inside this map's snapshot decade.",
    aliases: ["Thracia"],
    sources: ["Cassius Dio, Roman History 60.17", "Barrington Atlas"],
  },
  {
    slug: "macedonia",
    displayName: "Macedonia",
    polygonName: "Macedonia",
    status: "senatorial",
    capital: "Thessalonica",
    blurb:
      "Once Alexander's homeland, a Roman province since 146 BCE — the oldest Roman foothold in the Greek-speaking world. The Via Egnatia, Rome's great east–west military road, crosses the whole province from the Adriatic to Thrace; Philippi, where Antony and Octavian crushed Caesar's assassins in 42 BCE, still sits on that road.",
    aliases: ["Macedonia"],
    sources: ["Livy, Ab Urbe Condita 45", "Cassius Dio, Roman History 47.35–49"],
  },
  {
    slug: "achaia",
    displayName: "Achaia",
    polygonName: "Achaia",
    status: "senatorial",
    capital: "Corinth",
    capitalSlug: "corinth",
    blurb:
      "Roman Greece — the old heartland of Classical civilization, ruled since 27 BCE from a city the Romans themselves had rebuilt: Corinth, razed by the Republic in 146 BCE and refounded as a colony a century later. Athens kept a special cultural prestige no governor's seat could match; Epirus in the northwest and the Aegean islands both fell under this same province's administration.",
    aliases: ["Achaea", "Achaia", "Epirus", "Insulae Cycladae"],
    sources: ["Pausanias, Description of Greece", "Cassius Dio, Roman History 51.4"],
  },
  {
    slug: "bithynia-pontus",
    displayName: "Bithynia et Pontus",
    polygonName: "Bithynia et Pontus",
    status: "senatorial",
    capital: "Nicomedia",
    blurb:
      "A senatorial province with an odd Trajanic exception: local finances had run so far into debt that around 110 CE Trajan sent his own trusted correspondent, Pliny the Younger, as a special imperial legate to fix it — bypassing the ordinary proconsul entirely. Pliny's surviving letters from the job, and Trajan's terse replies, are the best-documented governorship anywhere in the empire, including the famous exchange asking what to do about local Christians.",
    aliases: [],
    sources: ["Pliny the Younger, Letters Book 10"],
  },
  {
    slug: "galatia-cappadocia",
    displayName: "Galatia et Cappadocia",
    polygonName: "Galatia et Cappadocia",
    status: "imperial-consular",
    capital: "Ancyra",
    blurb:
      "Two provinces run as one since Vespasian, and by far the empire's most important eastern staging ground in 117 — the legions at Satala and Melitene on this province's eastern edge fed Trajan's whole Armenian and Mesopotamian campaign. Ancyra's Res Gestae inscription, a full copy of Augustus's own account of his reign carved into a temple wall, still stood for every visitor to read.",
    aliases: ["Galatia et Cappadocia", "Cappadocia"],
    sources: ["Monumentum Ancyranum (Res Gestae Divi Augusti)", "CAH XI"],
  },
  {
    slug: "lycia-pamphylia",
    displayName: "Lycia et Pamphylia",
    polygonName: "Lycia et Pamphylia",
    status: "imperial-praetorian",
    capital: "Patara",
    blurb:
      "A late annexation — Lycia ran its own federal league of cities, one of the most sophisticated pre-Roman republics in the Mediterranean, until Claudius folded it into direct rule in 43 CE, joining it to neighboring Pamphylia. Patara's harbor, since silted, made it the province's administrative anchor even after Attaleia grew into its busiest port.",
    aliases: ["Lycia et Pamphylia"],
    sources: ["Strabo, Geography 14.3", "Barrington Atlas"],
  },
  {
    slug: "asia",
    displayName: "Asia",
    polygonName: "Asia",
    status: "senatorial",
    capital: "Ephesus",
    capitalSlug: "ephesus",
    blurb:
      "The single richest province in the empire, willed to Rome outright by its last king, Attalus III of Pergamon, in 133 BCE. Its governorship was the most prestigious senatorial posting a former consul could draw by lot — one rung below actually commanding an army. Ephesus outgrew the old royal capital Pergamon as the real seat of provincial business, its harbor handling trade for the whole Anatolian interior.",
    aliases: ["Asia"],
    sources: ["Strabo, Geography 13.4", "OGIS 338 (Attalus III's will)"],
  },
  {
    slug: "cilicia",
    displayName: "Cilicia",
    polygonName: "Cilicia",
    status: "imperial-praetorian",
    capital: "Tarsus",
    blurb:
      "Once notorious as a pirate haven Pompey had to clear out by force in 67 BCE, by 117 a settled province anchoring the empire's southeastern approach to Syria and the Cilician Gates through the Taurus mountains. Trajan died at Selinus, on this province's own coast, on 11 August 117 — the exact date this whole map is frozen on.",
    aliases: ["Cilicia"],
    sources: ["Cassius Dio, Roman History 68.33", "Historia Augusta, Hadrian 4.7"],
  },
  {
    slug: "cyprus",
    displayName: "Cyprus",
    polygonName: "Cyprus",
    status: "senatorial",
    capital: "Paphos",
    blurb:
      "A small senatorial province run by a proconsul, taken back from Marc Antony's old grant to Cleopatra after Actium and folded permanently into the settlement of 22 BCE. An earthquake around 76/77 CE had badly damaged Paphos; by 117 imperial funds had rebuilt its sanctuary of Aphrodite, the island's most visited shrine since Homer's day.",
    aliases: ["Cyprus"],
    sources: ["Cassius Dio, Roman History 54.4", "Barrington Atlas"],
  },
  {
    slug: "syria",
    displayName: "Syria",
    polygonName: "Syria",
    status: "imperial-consular",
    capital: "Antioch",
    blurb:
      "The empire's most important eastern command — four legions at its Trajanic peak, more than any other province — because it borders Parthia. Hadrian, its sitting legate in 117, is at Antioch the moment Trajan dies at Selinus and will be acclaimed emperor here within the day, the succession settled before Rome even hears the news. A massive earthquake had struck Antioch itself just two years earlier, in December 115, with Trajan barely escaping the collapsing building he was staying in.",
    aliases: ["Syria"],
    sources: ["Cassius Dio, Roman History 68.24–25 (Antioch earthquake), 69.1–2 (accession)"],
  },
  {
    slug: "iudaea",
    displayName: "Iudaea",
    polygonName: "Iudaea",
    status: "imperial-praetorian",
    capital: "Caesarea Maritima",
    blurb:
      "Annexed outright in 6 CE, then again after the catastrophic Jewish Revolt of 66–73 CE that ended with the Temple's destruction and Jerusalem's razing. By 117 the province is deep in a second, less-remembered crisis — the Kitos War, a wave of diaspora Jewish revolts Trajan's Berber general Lusius Quietus was actively suppressing the very month Trajan died. Legio X Fretensis garrisoned the ruins of Jerusalem itself.",
    aliases: ["Judaea", "Iudaea"],
    sources: ["Josephus, The Jewish War", "Cassius Dio, Roman History 68.32 (Kitos War)"],
  },
  {
    slug: "arabia",
    displayName: "Arabia Petraea",
    polygonName: "Arabia",
    status: "imperial-praetorian",
    capital: "Bostra",
    blurb:
      "The empire's newest annexation before Dacia — the Nabataean kingdom, absorbed without a real fight in 106 CE when its last king died, its famous rock-cut capital Petra becoming a Roman provincial city overnight. The Via Nova Traiana, a paved military road from Bostra clear down to the Red Sea, was under construction through most of the province's first decade as Roman territory.",
    aliases: ["Arabia Petraea", "Arabia"],
    sources: ["Cassius Dio, Roman History 68.14", "CIL III 14149 (Via Nova Traiana milestones)"],
  },
  {
    slug: "aegyptus",
    displayName: "Aegyptus",
    polygonName: "Aegyptus",
    status: "prefecture",
    capital: "Alexandria",
    blurb:
      "Legally unlike every other province — Augustus barred senators from even entering without his personal permission, and ran it through an equestrian prefect answerable only to the emperor, because Egypt's grain fed Rome and no ambitious senator was allowed near that lever. In 117 the province was still recovering from the Kitos War, whose Jewish-Greek communal violence had devastated Alexandria's ancient Jewish quarter.",
    aliases: ["Aegyptus"],
    sources: ["Cassius Dio, Roman History 51.17", "Tacitus, Annals 2.59 (senators barred from Egypt)"],
  },
  {
    slug: "creta-cyrenaica",
    displayName: "Creta et Cyrenaica",
    polygonName: "Creta et Cyrene",
    status: "senatorial",
    capital: "Gortyn",
    blurb:
      "An odd pairing — Crete and the five Greek cities of Cyrenaica, on opposite sides of open sea, governed as one senatorial province since 27 BCE simply because neither was large enough to justify its own proconsul. Cyrenaica bore the worst of the Kitos War's opening massacres in 115–117; Cassius Dio's account of hundreds of thousands killed there, while likely inflated, still reflects real, near-total devastation.",
    aliases: ["Creta et Cyrenaica"],
    sources: ["Cassius Dio, Roman History 68.32", "Eusebius, Historia Ecclesiastica 4.2"],
  },
  {
    slug: "africa-proconsularis",
    displayName: "Africa Proconsularis",
    polygonName: "Africa Proconsularis",
    status: "senatorial",
    capital: "Carthage",
    blurb:
      "The grandest senatorial governorship left in the empire by 117 — its proconsul outranked every other, a consolation prize for the Senate after Augustus stripped away the military provinces. Carthage, rebuilt by Julius Caesar on the site Scipio had razed in 146 BCE, had grown back into the empire's second-busiest port, its harbor feeding Rome's grain supply almost as heavily as Egypt's.",
    aliases: ["Africa Proconsularis"],
    sources: ["Cassius Dio, Roman History 53.12", "Barrington Atlas"],
  },
  {
    slug: "numidia",
    displayName: "Numidia",
    polygonName: "Numidia",
    status: "imperial-praetorian",
    capital: "Lambaesis",
    blurb:
      "Not yet a province in its own right in 117 — that formal split from Africa Proconsularis waits until Septimius Severus, around 193 CE. In practice it already ran as one: the legate commanding Legio III Augusta at Lambaesis administered this whole military district directly, building a chain of forts south from Vescera under Trajan to hold the desert frontier the Senate's Carthage-based proconsul never touched.",
    aliases: ["Numidia", "Africa Proconsularis (Numidia military district)"],
    sources: ["Tacitus, Histories 4.48 (legate's authority)", "CIL VIII (Lambaesis inscriptions)"],
  },
  {
    slug: "mauretania-caesariensis",
    displayName: "Mauretania Caesariensis",
    polygonName: "Mauretania Caesariensis",
    status: "imperial-procurator",
    capital: "Caesarea",
    blurb:
      "The eastern half of the old client kingdom of Mauretania, annexed by Claudius in 44 CE after its last king, Ptolemy — a grandson of Cleopatra and Mark Antony — was executed by Caligula. Its capital Caesarea kept the extravagant Hellenistic building program that Ptolemy's father Juba II, a genuine scholar-king, had lavished on it.",
    aliases: ["Mauretania Caesariensis"],
    sources: ["Cassius Dio, Roman History 59.25", "Pliny the Elder, Natural History 5.11"],
  },
  {
    slug: "mauretania-tingitana",
    displayName: "Mauretania Tingitana",
    polygonName: "Mauretania Tingitana",
    status: "imperial-procurator",
    capital: "Tingis",
    blurb:
      "The western sliver of old Mauretania, split off in 44 CE and run separately because its coast faced Spain across the Strait, not Numidia and Carthage further east. Volubilis, its inland showpiece city, had already built the arch, basilica and capitol its ruins are known for today — one of the best-preserved Roman city plans left standing on the African continent.",
    aliases: ["Mauretania Tingitana"],
    sources: ["Pliny the Elder, Natural History 5.2", "Barrington Atlas"],
  },
  {
    slug: "armenia-mesopotamia",
    displayName: "Armenia and Mesopotamia",
    polygonName: "Armenia Mesopotamia",
    status: "imperial-consular",
    capital: "not formally established",
    blurb:
      "Trajan's biggest gamble — three brand-new provinces (Armenia, Mesopotamia and Assyria) carved out of the Parthian war of 114–116, with Ctesiphon itself captured and a Parthian client king installed on the throne. By the exact week this map is frozen on, the gamble is already failing: revolts across the new territory and Trajan's own fatal illness are forcing the retreat Hadrian will make official within days of taking power, abandoning all three east of the Euphrates.",
    aliases: ["Armenia", "Mesopotamia", "Assyria"],
    sources: ["Cassius Dio, Roman History 68.26–33", "Eutropius, Breviarium 8.3"],
  },
];

export function findProvince(slug: string): Province | undefined {
  return PROVINCES.find((p) => p.slug === slug);
}

export function provinceForField(value: string | undefined | null): Province | undefined {
  if (!value) return undefined;
  return PROVINCES.find((p) => p.aliases.includes(value) || p.displayName === value);
}
