/** Registry of every archaeological site with street-level detail on the map.
 * Feeds the site-jump panel and the click-handler's "modern location / province" line.
 *
 * NAMING RULE (do not break):
 * `display` uses the name a general English-speaking Google-Maps user would recognise.
 *  - Living modern city on top of the Roman core → modern city name (Milan, Trier, Merida).
 *  - Pure archaeological park → site name (Timgad, Volubilis, Palmyra).
 *  - No parenthetical alternates in `display`. If the Roman name is essential context,
 *    put it inside the blurb (e.g. "Roman Mediolanum..." or "known to Romans as Ariminum").
 *  - No diacritics in `display` (write "Merida", not "Mérida"); accented form may live in blurb.
 *  - No abbreviations, no "(city center)" qualifiers, no ancient-vs-modern parens.
 *  - `province` stays in Latin (English scholarship standard).
 *  - `modernCountry` in plain English ("United Kingdom", not "UK"). */

export type SiteInfo = {
  slug: string;
  display: string;
  province: string;      // Roman province name in 117 CE
  modernCountry: string; // for the quick-jump list
  center: [number, number]; // [lng, lat]
  zoom: number;
  founded: string;       // human string (e.g., "~350 BCE" or "founded 100 CE by Trajan")
  blurb: string;         // one-liner for the panel card
};

export const SITES: SiteInfo[] = [
  { slug: "ostia",       display: "Ostia Antica",   province: "Italia",         modernCountry: "Italy",       center: [12.2911, 41.7550], zoom: 16.5,
    founded: "~350 BCE (castrum)",
    blurb: "Rome's port at the mouth of the Tiber, at its commercial peak under Trajan." },
  { slug: "pompeii",     display: "Pompeii",        province: "Italia",         modernCountry: "Italy",       center: [14.4853, 40.7495], zoom: 16.5,
    founded: "6th c. BCE (Oscan)",
    blurb: "Buried 79 CE by Vesuvius. Frozen at that moment — houses, shops, graffiti and all." },
  { slug: "herculaneum", display: "Herculaneum",    province: "Italia",         modernCountry: "Italy",       center: [14.3480, 40.8060], zoom: 17.5,
    founded: "6th c. BCE",
    blurb: "Coastal resort town buried by Vesuvius. Wood, papyri, and food survived under 20m of pyroclastic mud." },
  { slug: "ephesus",     display: "Ephesus",        province: "Asia",           modernCountry: "Turkey",      center: [27.3410, 37.9400], zoom: 16.5,
    founded: "10th c. BCE (Ionian)",
    blurb: "Capital of the province of Asia, home of the Temple of Artemis (one of the Seven Wonders) and the Library of Celsus." },
  { slug: "timgad",      display: "Timgad",         province: "Numidia",        modernCountry: "Algeria",     center: [6.4690, 35.4842], zoom: 17,
    founded: "100 CE by Trajan",
    blurb: "A veterans' colony founded by Trajan for Legio III Augusta. A textbook Roman grid, 17 years old at our snapshot." },
  { slug: "djemila",     display: "Djemila",        province: "Numidia",        modernCountry: "Algeria",     center: [5.7350, 36.3200], zoom: 17,
    founded: "96 CE by Nerva",
    blurb: "Mountain colony of veterans (Roman Cuicul), contemporary with Timgad. Its stepped forum climbs the hillside." },
  { slug: "volubilis",   display: "Volubilis",      province: "Mauretania Tingitana", modernCountry: "Morocco", center: [-5.5540, 34.0750], zoom: 16.5,
    founded: "3rd c. BCE (Berber)",
    blurb: "Frontier city at the edge of the empire, only recently annexed (44 CE). Olive-oil boom town." },
  { slug: "leptismagna", display: "Leptis Magna",   province: "Africa Proconsularis", modernCountry: "Libya",  center: [14.2930, 32.6380], zoom: 16.5,
    founded: "1000 BCE (Phoenician)",
    blurb: "Phoenician foundation, later home of emperor Septimius Severus. Its 2nd-century monumental core was still being planned in 117 CE." },
  { slug: "sabratha",    display: "Sabratha",       province: "Africa Proconsularis", modernCountry: "Libya",  center: [12.4850, 32.8040], zoom: 16.5,
    founded: "5th c. BCE",
    blurb: "One of the three cities of Tripolitania. Its theatre is one of the largest surviving anywhere in North Africa." },
  { slug: "jerash",      display: "Jerash",         province: "Arabia Petraea", modernCountry: "Jordan",      center: [35.8920, 32.2780], zoom: 16,
    founded: "170 BCE (Seleucid)",
    blurb: "Best-preserved of the Decapolis cities (Roman Gerasa). Oval forum, colonnaded cardo, Temple of Artemis." },
  { slug: "palmyra",     display: "Palmyra",        province: "Syria",          modernCountry: "Syria",       center: [38.2690, 34.5500], zoom: 16,
    founded: "1st c. BCE (Aramean)",
    blurb: "Caravan city on the trade route between Rome and the Silk Road. Great colonnaded street, Temple of Bel." },
  { slug: "baalbek",     display: "Baalbek",        province: "Syria",          modernCountry: "Lebanon",     center: [36.2040, 34.0060], zoom: 17,
    founded: "1st c. BCE (Roman colony)",
    blurb: "Roman Heliopolis. Temple of Jupiter — one of the largest sanctuaries in the empire. Still under construction in Trajan's day." },
  { slug: "rome",        display: "Rome",           province: "Italia",         modernCountry: "Italy",       center: [12.4870, 41.8920], zoom: 15,
    founded: "753 BCE (traditional)",
    blurb: "Caput mundi. Around 1 million people in 117 CE — the largest city on earth for centuries either side." },
  { slug: "aquincum",    display: "Aquincum",       province: "Pannonia",       modernCountry: "Hungary",     center: [19.0480, 47.5670], zoom: 16.5,
    founded: "89 CE (legionary fortress)",
    blurb: "Base of Legio II Adiutrix on the Danube frontier. The proconsul Hadrian lived here just before becoming emperor in 117." },
  { slug: "carnuntum",   display: "Carnuntum",      province: "Pannonia",       modernCountry: "Austria",     center: [16.8770, 48.1160], zoom: 16,
    founded: "40 CE",
    blurb: "Major Danube legionary base and the civilian city that grew beside it. Marcus Aurelius later wrote parts of the Meditations here." },
  { slug: "vindolanda",  display: "Vindolanda",     province: "Britannia",      modernCountry: "United Kingdom", center: [-2.3612, 54.9910], zoom: 17,
    founded: "85 CE",
    blurb: "Auxiliary fort south of what became Hadrian's Wall. The wooden Vindolanda tablets — Rome's oldest written documents from Britain — come from around our snapshot." },
  { slug: "trier",       display: "Trier",          province: "Gallia Belgica", modernCountry: "Germany",     center: [6.6440, 49.7520], zoom: 15.5,
    founded: "16 BCE by Augustus",
    blurb: "Augusta Treverorum, Roman capital of northern Gaul. Later imperial residence and one of the empire's biggest cities. In 117 CE, a booming provincial capital." },
  { slug: "xanten",      display: "Xanten",         province: "Germania Inferior", modernCountry: "Germany",  center: [6.4415, 51.6600], zoom: 16,
    founded: "~100 CE by Trajan",
    blurb: "Colonia Ulpia Traiana, a Trajanic colonia on the Rhine named for the emperor. Fresh-built at our 117 CE snapshot — mostly veterans of the Rhine legions." },
  { slug: "corinth",     display: "Corinth",        province: "Achaea",         modernCountry: "Greece",      center: [22.8880, 37.9070], zoom: 16.5,
    founded: "44 BCE (re-founded by Caesar)",
    blurb: "Provincial capital of Achaea, re-founded by Caesar over the ruins of the Greek city Rome had destroyed a century earlier." },
  { slug: "athens",      display: "Athens",         province: "Achaea",         modernCountry: "Greece",      center: [23.7260, 37.9750], zoom: 17,
    founded: "1st c. BCE (Roman agora)",
    blurb: "Under Rome but coasting on its glorious past. Hadrian would soon add his Library, arch, and Olympieion." },
  { slug: "delphi",      display: "Delphi",         province: "Achaea",         modernCountry: "Greece",      center: [22.5010, 38.4820], zoom: 17,
    founded: "8th c. BCE",
    blurb: "Sanctuary of Apollo — still a working oracle in 117 CE, though its reputation was fading." },
  { slug: "merida",      display: "Merida",         province: "Lusitania",      modernCountry: "Spain",       center: [-6.3390, 38.9160], zoom: 16,
    founded: "25 BCE by Augustus",
    blurb: "Emerita Augusta, capital of Lusitania, founded for veterans of the Cantabrian wars. Its theatre, amphitheatre, and aqueducts are among Spain's best preserved." },
  { slug: "italica",     display: "Italica",        province: "Baetica",        modernCountry: "Spain",       center: [-6.0450, 37.4420], zoom: 16.5,
    founded: "206 BCE by Scipio",
    blurb: "Home town of Trajan and Hadrian. Trajan's expansions doubled the city just before our snapshot." },

  // ── Italia batch ────────────────────────────────────────────────────────────
  { slug: "aquileia",    display: "Aquileia",       province: "Italia",         modernCountry: "Italy",       center: [13.3720, 45.7700], zoom: 16,
    founded: "181 BCE (Latin colony)",
    blurb: "Adriatic gateway to the Danube — a booming port and one of the largest cities in Italy in 117 CE." },
  { slug: "verona",      display: "Verona",         province: "Italia",         modernCountry: "Italy",       center: [10.9980, 45.4400], zoom: 15.5,
    founded: "89 BCE (Roman municipium)",
    blurb: "Prosperous northern-Italy city on the Adige. Its arena, built around 30 CE, was already old when Trajan died." },
  { slug: "ravenna",     display: "Ravenna",        province: "Italia",         modernCountry: "Italy",       center: [12.1980, 44.4180], zoom: 15.5,
    founded: "1st c. BCE (Roman municipium)",
    blurb: "Base of the Classis Ravennas, the Adriatic fleet, from Augustus onward. In 117 CE Ravenna sat directly on the coast — the shore is now 8 km east." },
  { slug: "portus",      display: "Portus",         province: "Italia",         modernCountry: "Italy",       center: [12.2570, 41.7780], zoom: 16,
    founded: "42 CE by Claudius",
    blurb: "Rome's imperial harbor. Trajan's inner hexagonal basin was finished just before our snapshot — you can still see its outline today." },
  { slug: "tivoli",      display: "Tivoli",         province: "Italia",         modernCountry: "Italy",       center: [12.7980, 41.9640], zoom: 16.5,
    founded: "traditional 1215 BCE (Sabine)",
    blurb: "Roman Tibur, a hillside retreat above the Aniene falls. Old sanctuary of Hercules Victor, favored by Rome's senatorial class. Hadrian's villa was still on the drawing board." },
  { slug: "palestrina",  display: "Palestrina",     province: "Italia",         modernCountry: "Italy",       center: [12.8970, 41.8370], zoom: 16.5,
    founded: "7th c. BCE",
    blurb: "Roman Praeneste. Home to the Sanctuary of Fortuna Primigenia — a vast terraced complex climbing the hillside, one of the most ambitious pieces of architecture the Republic ever built." },
  { slug: "pozzuoli",    display: "Pozzuoli",       province: "Italia",         modernCountry: "Italy",       center: [14.1210, 40.8260], zoom: 16,
    founded: "194 BCE (Roman colony)",
    blurb: "Roman Puteoli, Italy's main port for eastern grain and luxury goods before Portus took over. Its Flavian amphitheatre — the third-largest in the empire — was newly built at our snapshot." },
  { slug: "baiae",       display: "Baiae",          province: "Italia",         modernCountry: "Italy",       center: [14.0750, 40.8220], zoom: 16.5,
    founded: "2nd c. BCE (resort)",
    blurb: "The emperors' favorite spa. Domed bath halls fed by volcanic hot springs on the Bay of Naples. Trajan and his court would have known it well." },
  { slug: "cumae",       display: "Cumae",          province: "Italia",         modernCountry: "Italy",       center: [14.0520, 40.8480], zoom: 16.5,
    founded: "8th c. BCE (Euboean Greek)",
    blurb: "The oldest Greek colony in Italy, home of the Cumaean Sibyl. By 117 CE its acropolis temples were already tourist attractions." },
  { slug: "capua",       display: "Capua",          province: "Italia",         modernCountry: "Italy",       center: [14.2590, 41.0830], zoom: 16,
    founded: "9th c. BCE (Etruscan)",
    blurb: "Once the second city of Italy, home to a huge amphitheatre that later served as the model for the Colosseum. Its gladiator school was Spartacus's starting point." },
  { slug: "beneventum",  display: "Benevento",      province: "Italia",         modernCountry: "Italy",       center: [14.7770, 41.1300], zoom: 16,
    founded: "268 BCE (Latin colony)",
    blurb: "Roman Beneventum, terminus of the Via Appia and starting point of the Via Traiana. Trajan's Arch here was dedicated in 114 CE — three years old at our snapshot." },
  { slug: "paestum",     display: "Paestum",        province: "Italia",         modernCountry: "Italy",       center: [15.0060, 40.4210], zoom: 16.5,
    founded: "600 BCE (Greek Poseidonia)",
    blurb: "A Greek colony absorbed into Rome. Its three Doric temples — 500 years old in 117 CE — were already ancient monuments." },
  { slug: "brescia",     display: "Brescia",        province: "Italia",         modernCountry: "Italy",       center: [10.2220, 45.5390], zoom: 16.5,
    founded: "89 BCE (Roman municipium)",
    blurb: "Roman Brixia, a northern-Italy city under the Alps. Vespasian's Capitolium — three temples in one — was newly built and dominated the forum." },
  { slug: "milan",       display: "Milan",          province: "Italia",         modernCountry: "Italy",       center: [9.1870, 45.4630], zoom: 15,
    founded: "590 BCE (Insubres); Roman 222 BCE",
    blurb: "Roman Mediolanum, the largest city in northern Italy. In 117 CE, a booming provincial hub — not yet the imperial residence it would become in the 3rd century." },
  { slug: "rimini",      display: "Rimini",         province: "Italia",         modernCountry: "Italy",       center: [12.5730, 44.0580], zoom: 16,
    founded: "268 BCE (Latin colony)",
    blurb: "Roman Ariminum, the pivot of Roman north — the Via Flaminia met the Via Aemilia here. Its Arch of Augustus (27 BCE) and Bridge of Tiberius (21 CE) both still stand." },
  { slug: "ancona",      display: "Ancona",         province: "Italia",         modernCountry: "Italy",       center: [13.5100, 43.6220], zoom: 16,
    founded: "387 BCE (Syracusan Greek)",
    blurb: "Adriatic naval harbor. Trajan enlarged its port; his commemorative arch was dedicated in 115 CE, two years before our snapshot." },
  { slug: "luni",        display: "Luni",           province: "Italia",         modernCountry: "Italy",       center: [10.0200, 44.0620], zoom: 16.5,
    founded: "177 BCE (Roman colony)",
    blurb: "Roman Luna, the marble port. All the white Carrara marble that clad imperial Rome shipped from here." },
];

export const SITE_META: Record<string, { display: string; province: string }> =
  Object.fromEntries(SITES.map((s) => [s.slug, { display: s.display, province: s.province }]));
