/** Hand-curated descriptions for named buildings in Ephesus — same pattern as
 * app/ostiaDescriptions.ts, app/pompeiiDescriptions.ts, and
 * app/herculaneumDescriptions.ts, the fourth site to get this treatment [06-P0-2].
 * Sources: Austrian Archaeological Institute excavation reports; Ephesus Museum;
 * ephesus.us; Britannica; published excavation summaries. Written to read like a
 * place blurb, not a scholar's footnote.
 *
 * Unlike Ostia/Pompeii/Herculaneum, Ephesus was a thriving, continuously occupied
 * city in 117 CE — most core buildings from the Augustan through Trajanic period
 * are `extant_117ce: true`. Anything built under Hadrian (r. 117-138) or later is
 * `extant_117ce: false`, with a note on what stood there instead (usually nothing
 * yet, or an earlier structure). */

export type EphesusEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

// Keys are matched as substrings against the OSM name (case-insensitive),
// longer keys checked first. Keep entries specific to one building.
export const EPHESUS_LOOKUP: Record<string, EphesusEntry> = {
  "Celsus Kütüphanesi": {
    english: "Library of Celsus",
    category: "library",
    extant_117ce: false,
    destroyed: 262,
    description:
      "Ephesus's grandest library, built as a monumental tomb and memorial for Tiberius Julius Celsus Polemaeanus, a former proconsul of Asia, funded by his son Julius Aquila's will. Celsus's sarcophagus lay in a vault beneath the reading room's rear wall — an extraordinary burial inside a public building. The two-story facade held some 12,000 scrolls in niche shelving designed to guard against damp. Construction was still underway at his family's expense when Trajan died on 11 August 117 CE; Aquila's heirs finished it a few years later.",
  },
  "Hadrian Tapınağı": {
    english: "Temple of Hadrian",
    category: "temple",
    extant_117ce: false,
    built: 118,
    destroyed: 400,
    description:
      "A small, ornate temple on Curetes Street, dedicated in 118 CE by the wealthy Ephesian Publius Vedius Antoninus to Artemis, the emperor Hadrian, and the people of Ephesus. Its curved lintel, a rare feature for the period, frames a relief of Medusa meant to ward off evil. Partly destroyed in a 4th-century earthquake and later restored, it wasn't yet built when Trajan died in 117 CE — Hadrian had only just become emperor.",
  },
  "Yamaç Ev 1": {
    english: "Terrace House 1",
    category: "house",
    extant_117ce: true,
    built: 25,
    description:
      "A block of multi-story private houses climbing the slope opposite the grander Terrace House 2, built for Ephesus's merchant and professional class rather than its senatorial elite. Rooms opened onto small courtyards, heated by hypocausts and decorated with modest wall paintings. Less completely excavated and preserved than its famous neighbor, it stood in active use in 117 CE, home to families going about ordinary business a stone's throw from Curetes Street.",
  },
  "Yamaç Ev 2": {
    english: "Terrace House 2",
    category: "house",
    extant_117ce: true,
    built: 25,
    description:
      "Ephesus's houses on the slope — seven interconnected multi-story residences for the city's wealthiest families, in use from the 1st century CE. Floors and walls were covered in some of the finest domestic frescoes and mosaics surviving from the Roman world, including a portrait gallery and a hunting scene. Private baths and heated floors gave these homes conveniences most Ephesians never had. Fully lived-in and richly decorated in 117 CE, they weren't damaged until an earthquake around 280 CE.",
  },
  "Meryem Kilisesi": {
    english: "Church of Mary (Council Church)",
    category: "hall",
    extant_117ce: false,
    built: 431,
    description:
      "Ephesus's cathedral church, built on the ruins of a 2nd-century Roman basilica known as the Hall of the Muses. It hosted the Council of Ephesus in 431 CE, the third ecumenical council, which declared Mary Theotokos — Mother of God. Around 500 CE it was expanded into a monumental double church with a huge apse, parts of which still stand. In 117 CE the site held only the pagan basilica; the Marian church and its famous council lay three centuries in the future.",
  },
  "Yedi Uyurlar Mağarası": {
    english: "Cave of the Seven Sleepers",
    category: "tomb",
    extant_117ce: false,
    built: 450,
    description:
      "A catacomb-like cave complex on the slope of Mount Pion, site of the medieval legend of seven Christian youths who fled persecution under Decius in 250 CE, slept for centuries, and woke under Theodosius II. Excavations in 1926-1928 uncovered hundreds of graves dated to the 5th and 6th centuries, with inscriptions invoking the sleepers; the story later appears in the Quran. None of this existed in 117 CE — Christianity in Ephesus was still an obscure, unofficial faith under Trajan.",
  },
  "Bizans Sarayı": {
    english: "Byzantine Palace",
    category: "house",
    extant_117ce: false,
    built: 450,
    description:
      "A large, well-preserved late antique building southeast of the episcopal complex, measuring roughly 75 by 50 meters. Its function is still debated — proposals include a bathhouse, an administrative complex, or the residence of the Metropolitan bishop of Ephesus. It remained in use into the 7th century before being subdivided into smaller units. Nothing stood here in this form in 117 CE; the building postdates the Roman imperial city by centuries.",
  },
  Olympieion: {
    english: "Temple of Hadrian Olympios (the Olympieion)",
    category: "temple",
    extant_117ce: false,
    built: 132,
    description:
      "A monumental temple in northwest Ephesus honoring Hadrian as Zeus Olympios, securing the city a rare second neocorate — the right to host an imperial cult temple. Hadrian granted permission to build it during his tour of the city around 128-132 CE, well after Trajan's death. Its scale rivaled Ephesus's other great civic monuments. It did not exist in 117 CE; the honor came only after Hadrian toured Asia Minor a decade later.",
  },
  "Commercial Market": {
    english: "Tetragonos Agora (Commercial Market)",
    category: "agora",
    extant_117ce: true,
    built: -5,
    description:
      "Ephesus's commercial hub since the 3rd century BCE, rebuilt under Augustus into a vast square 111 meters on a side, ringed by two-story colonnades holding roughly 100 shops and guild offices. Linked to the harbor by the Arcadiane and to the Street of the Curetes by the Gate of Mazeus and Mithridates, it was the beating heart of the city's Mediterranean trade. Fully built and bustling in 117 CE — it wouldn't get its final earthquake-driven makeover for three more centuries.",
  },
  "Vedius Gymnasium": {
    english: "Vedius Gymnasium",
    category: "gymnasium",
    extant_117ce: false,
    built: 148,
    description:
      "A monumental bath-gymnasium complex spanning 135 by 85 meters, funded by the wealthy Ephesian Publius Vedius Antoninus and his wife Flavia Papiane and dedicated to Artemis and Antoninus Pius. Its palestra hosted wrestling and other combat sports for the city's young men. Built in 148-149 CE, it stood over three decades in the future when Trajan died in 117 CE — the ground here was still open land outside the city's built-up core.",
  },
  Serapeion: {
    english: "Serapeion (Temple of Serapis)",
    category: "temple",
    extant_117ce: false,
    built: 160,
    description:
      "A massive temple near the harbor, its columns rising 24 meters, built to serve Ephesus's community of Egyptian merchants who worshipped the healing god Serapis. Its granite monoliths were quarried in Egypt and shipped across the Mediterranean specifically for this building. Dedicatory inscriptions here honor the emperor Caracalla, dating the temple's construction to well after 117 CE — some evidence suggests it was never even fully completed.",
  },
  "Varius Hamamı": {
    english: "Baths of Varius",
    category: "bathhouse",
    extant_117ce: true,
    built: 100,
    description:
      "A marble-built bath complex on Curetes Street, constructed around the turn of the 2nd century CE by P. Quintilius Valens Varius, with the standard frigidarium, tepidarium, and caldarium sequence. It was already serving Ephesian bathers in 117 CE. Three centuries later a Christian woman named Scholastica funded a major renovation, adding a colonnaded corridor whose 5th-century mosaics still survive — which is why locals also know it as the Baths of Scholastica.",
  },
  "East Gymnasium": {
    english: "East Gymnasium",
    category: "gymnasium",
    extant_117ce: false,
    built: 160,
    description:
      "A bath-gymnasium complex north of the Magnesia Gate, built in the 2nd century CE by the sophist Flavius Damianus to educate Ephesian youth in athletics, music, and rhetoric. Excavators nicknamed it the Girls' Gymnasium after the unusually large number of female statues — Aphrodite, Hygeia, and others — found among its ruins. None of it stood in 117 CE; the plot wouldn't be developed for decades.",
  },
  Stadyum: {
    english: "Stadium of Ephesus",
    category: "stadium",
    extant_117ce: true,
    built: 60,
    description:
      "Ephesus's stadium, originally laid out in the 3rd century BCE under King Lysimachus and rebuilt into its familiar U-shaped form under Nero in the mid-1st century CE. It stretched 230 meters long and held as many as 25,000 spectators for athletic games and races. Fully operational when Trajan died in 117 CE. Centuries later, after Christianity became the empire's religion, much of its stone was stripped to build the nearby Church of St. John.",
  },
  "Domitian Tapınağı": {
    english: "Temple of Domitian",
    category: "temple",
    extant_117ce: true,
    built: 90,
    description:
      "Ephesus's first temple to an emperor, dedicated around 89-90 CE after Domitian granted the city its first neocorate — official status as guardian of an imperial cult. The temple sat on a raised terrace of innovative vaulted substructures overlooking a monumental altar. After Domitian's assassination and damnatio memoriae, the temple was quietly rededicated to his father Vespasian and his name was chiseled from its inscriptions. It stood, rededicated, throughout 117 CE.",
  },
  "Gate of Magnesia": {
    english: "Gate of Magnesia",
    category: "gate",
    extant_117ce: true,
    built: -300,
    description:
      "The southeastern entrance through Ephesus's Hellenistic city wall, built around 300 BCE alongside the fortifications raised under Lysimachus, opening onto the road to Magnesia 30 km away. Once flanked by twin defensive towers, it lost its military role once Roman peace made the wall unnecessary, and Vespasian remodeled it in the 70s CE into a triple-arched Gate of Honor. Ephesians passed through its arches daily in 117 CE.",
  },
  Hydrekdocheion: {
    english: "Fountain of Laecanius Bassus",
    category: "fountain",
    extant_117ce: true,
    built: 81,
    description:
      "A two-story monumental fountain at the southwest corner of the State Agora, so large it earned the nickname Water Palace. An inscription credits Gaius Laecanius Bassus with its construction around 80-82 CE. Statues of Tritons and river gods once decorated its facade, now displayed in the Ephesus Museum. It had already been supplying water to the agora for a full generation by the time Trajan died in 117 CE.",
  },
  Oktogon: {
    english: "The Octagon (Tomb of Arsinoe IV)",
    category: "tomb",
    extant_117ce: true,
    built: -30,
    description:
      "An eight-sided marble mausoleum on Curetes Street, roughly 13 meters tall on a square base, believed to hold the remains of Arsinoe IV — Cleopatra's younger sister, exiled to Ephesus and executed on Mark Antony's orders in 41 BCE. A marble sarcophagus inside held the skeleton of a girl about 15 or 16 years old. Built in the decades after her death, the tomb had stood on this prominent street corner for well over a century by 117 CE.",
  },
  Prytaneion: {
    english: "Prytaneion",
    category: "hall",
    extant_117ce: true,
    built: -10,
    description:
      "The civic heart of Ephesus, where the city's sacred flame to Hestia burned continuously, tended by priestesses called the Curetes. First built under Lysimachus in the 3rd century BCE, the version visitors see today dates to the Augustan era. Official banquets, state receptions, and religious ceremonies took place here, and the famous Artemis Ephesia statues now in the Ephesus Museum were found in its ruins. Fully functioning as the city's ceremonial center in 117 CE.",
  },
  "Public Latrines": {
    english: "Public Latrines",
    category: "latrine",
    extant_117ce: true,
    built: 50,
    description:
      "A communal toilet block off Curetes Street, its 48 marble seats arranged around three walls above a continuously flushing water channel — part of Roman Ephesus's sanitation network since the 1st century CE. Users paid an entrance fee and, by ancient accounts, lingered to socialize and trade gossip rather than rushing through. Already in daily use by ordinary Ephesians in 117 CE, centuries before its final marble remodeling in the 4th century.",
  },
  "İsis Tapınağı": {
    english: "Temple of Isis",
    category: "temple",
    extant_117ce: false,
    built: 10,
    destroyed: 30,
    description:
      "A Corinthian temple at the center of the State Agora, ten columns along its long side and six across, once thought dedicated to Isis but now believed a shrine to the imperial cult built near the end of Augustus's reign. It collapsed within a generation of construction and, unusually, was never rebuilt. By 117 CE only its podium and toppled columns remained standing amid the agora's colonnades, a ruin for nearly ninety years.",
  },
  "Theatre Gymnasium": {
    english: "Theatre Gymnasium",
    category: "gymnasium",
    extant_117ce: false,
    built: 150,
    description:
      "A bath-gymnasium complex at the start of Harbour Street, near the Great Theatre, funded by Publius Vedius Antoninus and his wife Flavia Pappiana and dedicated to Artemis and Antoninus Pius. It combined Ephesus's Greek gymnasium tradition — wrestling, oratory, education — with Roman-style bathing. Built in the 2nd century CE, decades after Trajan's death, it didn't yet exist when Ephesians of 117 CE walked this stretch of road down to the harbor.",
  },
  "Harbour Thermae": {
    english: "Harbour Baths",
    category: "bathhouse",
    extant_117ce: true,
    built: 90,
    description:
      "A monumental bath complex between the harbor and the Harbour Gymnasium, 160 by 170 meters and rising 28 meters — among the largest bathing establishments in Ephesus. Its origins trace to a gymnasium built under Domitian in the 80s-90s CE, giving Trajan-era Ephesians a working bathhouse here by 117 CE. An earthquake in 262 CE and later renovations under Constantine II gave the complex the grander form visible in its ruins today.",
  },
  "Great Theatre": {
    english: "Great Theatre of Ephesus",
    category: "theater",
    extant_117ce: true,
    built: -250,
    description:
      "Ephesus's monumental theatre, carved into the slope of Mount Pion, first built around 250 BCE under the Hellenistic king Lysimachus and rebuilt in stone by the Romans over the following two centuries. It seated some 25,000 spectators — the largest in Asia Minor — and hosted the riot against the apostle Paul described in Acts 19. Claudius enlarged it and Nero added its two-story stage building; by 117 CE it stood essentially in the form its ruins show today.",
  },
  Odeon: {
    english: "Odeon (Bouleuterion)",
    category: "theater",
    extant_117ce: false,
    built: 150,
    description:
      "A small, roofed theatre seating about 1,500, built around 150 CE by Publius Vedius Antoninus and his wife Flavia Papiana beside the State Agora. It doubled as Ephesus's bouleuterion, hosting meetings of the city council as well as music and poetry recitals — a striking contrast to the 25,000-seat Great Theatre nearby. It did not yet exist in 117 CE; Ephesus's council still met elsewhere when Trajan died.",
  },
  "Fountain of Pollio": {
    english: "Fountain of Pollio",
    category: "fountain",
    extant_117ce: true,
    built: 97,
    description:
      "A monumental fountain at the entrance to Domitian Square, built in 97 CE by C. Sextilius Pollio's family to honor him as the engineer behind the aqueduct that fed Ephesus's fountains. Its facade later gained a decorative arch and statues, including a group depicting Odysseus blinding the Cyclops Polyphemus, now in the Ephesus Museum. Twenty years old and still delivering water when Trajan died in 117 CE.",
  },
  "Traian Çeşmesi": {
    english: "Nymphaeum of Trajan (Fountain of Trajan)",
    category: "fountain",
    extant_117ce: true,
    built: 104,
    description:
      "A two-story monumental fountain on Curetes Street, the grand terminus of the aqueduct that piped water 20 miles from the Küçükmenderes river into the city, funded by the wealthy official Tiberius Claudius Aristion. A colossal marble statue of Trajan stood in its central niche above a 12-meter basin, flanked by images of Dionysus, Aphrodite, and the imperial family. Inaugurated before 114 CE, it was one of the newest showpieces in the city when Trajan died in 117.",
  },
  "Memmius Anıtı": {
    english: "Monument of Memmius",
    category: "monument",
    extant_117ce: true,
    built: -20,
    description:
      "A four-sided victory monument on the Street of the Curetes, built under Augustus to honor Gaius Memmius, grandson of the dictator Sulla, whose army crushed King Mithridates's revolt and retook Ephesus after Mithridates had massacred some 80,000 Romans across Asia in 88 BCE. Its niches and arched reliefs commemorated that liberation for a city that never forgot it. It had stood watch over the street for well over a century by 117 CE.",
  },
  "Gate of Mazeus": {
    english: "Gate of Mazeus and Mithridates",
    category: "gate",
    extant_117ce: true,
    built: -4,
    description:
      "A triple-arched marble gate marking the entrance to the Commercial Agora from the Library of Celsus, built around 4-3 BCE by two freedmen, Mazeus and Mithridates, in gratitude to the imperial family that had freed them. Its Library-facing side is cut entirely from black marble, the opposite face entirely from white. Well over a century old and a familiar Ephesian landmark by the time Trajan died in 117 CE.",
  },
  "State Agora": {
    english: "State Agora",
    category: "agora",
    extant_117ce: true,
    built: -30,
    description:
      "Ephesus's political and religious agora, a rectangular public square laid out in the Roman period and lined on its north side by the Basilica Stoa, with the Temple of Isis (or imperial cult) once standing at its center. Markets, assemblies, and official business filled its colonnades, distinct from the harborside Commercial Agora used for trade. Long established and fully functioning as the city's civic square by 117 CE.",
  },
  "Great Hall": {
    english: "Basilica Stoa (Royal Portico)",
    category: "hall",
    extant_117ce: true,
    built: 10,
    description:
      "A two-story colonnaded hall 165 meters long lining the north side of the State Agora, built between 4 and 14 CE and funded by the wealthy Ephesian family of Gaius Sextilius Pollio. Sixty-seven Ionic columns, many carved with bulls' heads, supported its roof. Known in Greek as the stoa basilike (royal portico) and in Latin as a basilica, it hosted courts and commercial exchange, and had done so for over a century when Trajan died in 117 CE.",
  },
  "Alytarch's Stoa": {
    english: "Alytarch's Stoa",
    category: "hall",
    extant_117ce: false,
    built: 440,
    description:
      "A colonnaded hall on the east side of the Commercial Agora, roughly 53 meters long, built over the top of earlier honorary imperial monuments in late antiquity. It took its name from the alytarches, the city official who oversaw the conduct of athletic games, one of whom renovated it in the early 5th century CE — work confirmed complete by 440 CE. It didn't exist as a stoa in 117 CE; the monuments beneath its floor still stood in the open air.",
  },
  "Temenos with Double Monument": {
    english: "Temenos with Double Monument",
    category: "monument",
    extant_117ce: true,
    built: -29,
    description:
      "A sacred precinct between the Prytaneion and the Odeon, built under Augustus to house temples to the goddess Roma and the deified Julius Caesar — one of the first sanctuaries in Asia dedicated to Roman citizens' worship of the imperial cult. Its twin structures paired the city's loyalty to Rome with reverence for its founding dynasty. Already a well-established center of civic religion for well over a century when Trajan died in 117 CE.",
  },
  "Hadrian's Gate": {
    english: "Hadrian's Gate",
    category: "gate",
    extant_117ce: false,
    built: 117,
    description:
      "A three-tiered marble gate marking the western end of Curetes Street where it meets Marble Street, rising nearly 17 meters and decorated with Corinthian and Composite columns. Construction began under Trajan but the gate was completed and dedicated to his successor in 117 CE, the same year work finished on the neighboring Library of Celsus's design. It was still being built, unfinished, on the day Trajan died on 11 August 117 CE.",
  },
};

/** Look up a matching description for an OSM building name. */
export function ephesusEntry(name: string | null | undefined): EphesusEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(EPHESUS_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return EPHESUS_LOOKUP[k];
  }
  return undefined;
}
