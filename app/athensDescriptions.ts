/** Hand-curated descriptions for named buildings in the Athenian Agora and its surroundings —
 * same pattern as app/delphiDescriptions.ts, the tenth site to get this treatment [06-P0-2].
 * Athens's OSM building data carries Greek names, like Delphi's — keys below are the exact
 * strings that appear in public/data/sites/athens_buildings.geojson's `name` property.
 *
 * Unlike Delphi (a sanctuary) or the buried 79 CE sites (Pompeii, Herculaneum), Athens was a
 * living, continuously inhabited city in 117 CE. Most of the Classical and Hellenistic Agora
 * survived into the Roman period untouched, so most entries below are `extant_117ce: true` —
 * the exceptions are the handful of buildings Hadrian's post-117 building campaign put up (his
 * Library, the Nymphaeum, the Southeast Temple), each marked false with the dating evidence.
 *
 * Sources: Pausanias, Description of Greece, book 1 (his own tour of Athens, written a couple of
 * generations after this map's snapshot but describing a city whose Agora had barely changed in
 * the interim); Thucydides; ASCSA Agora Excavations publications; Wikipedia; topostext.org.
 * Researched via a background WebSearch pass, personally reviewed before merging — see
 * BOARD.md's [06-P0-2] ticket note for what was dropped and why. */

export type AthensEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

// Keys are matched as substrings against the OSM name (exact Greek string), longer keys checked
// first. Keep entries specific to one building.
export const ATHENS_LOOKUP: Record<string, AthensEntry> = {
  "Άρειος Πάγος": {
    english: "Areopagus",
    category: "civic",
    extant_117ce: true,
    description:
      "The Areopagus is the low rocky hill northwest of the Acropolis that gives its name to Athens's oldest judicial council. In myth it is where Ares stood trial for killing Halirrhothios, and where Orestes was tried for matricide. Stone steps and rock-cut benches mark the open-air meeting place. Through the Classical period the council tried homicide cases and oversaw religious and moral conduct; after Rome conquered Athens in 86 BCE the institution stayed intact, retaining oversight of foreign cults and public morals under the empire. Pausanias, visiting Athens in the mid-2nd century CE, confirms the council still judged homicide cases in his day. The hill and its functioning council are unquestionably in place in 117 CE, continuing a role unbroken since Archaic times.",
  },
  "Αρρηφόριον": {
    english: "Arrephorion",
    category: "civic",
    extant_117ce: true,
    built: -420,
    description:
      "The Arrephorion is a small building on the northwest edge of the Acropolis, next to the Erechtheion, identified from a passage in Pausanias describing the home of the Arrephoroi — two girls, aged seven to eleven, chosen yearly to serve Athena Polias. They lived on the Acropolis for a year and ended their term with the Arrhephoria, a nighttime rite in which they carried covered objects down a hidden stairway to a sanctuary of Aphrodite in the Gardens and returned with others, never learning what they carried. The foundations identified with the building date to the 5th-century BCE program tied to the Erechtheion. Since Pausanias describes the ritual as ongoing in the 2nd century CE, the building and its cult were certainly active in 117 CE.",
  },
  "Βασίλειος Στοά": {
    english: "Stoa Basileios (Royal Stoa)",
    category: "civic",
    extant_117ce: true,
    built: -525,
    description:
      "The Royal Stoa stands at the northwest corner of the Agora, a small Doric building erected around 525 BCE and rebuilt after Persian damage in the 5th century BCE. It served as the seat of the archon basileus, the magistrate in charge of religious law and ancestral rites, and held the axones and kyrbeis recording Solon's and Draco's laws. Incoming officials swore their oath of office on a stone in front of the building, and Socrates was formally charged with impiety here in 399 BCE. The building remained carefully preserved and in continuous use through the Hellenistic period and well into Roman times, functioning until roughly the mid-2nd century CE. It stands and functions normally in 117 CE.",
  },
  "Βιβλιοθήκη του Αδριανού": {
    english: "Library of Hadrian",
    category: "library",
    extant_117ce: false,
    built: 132,
    description:
      "Hadrian's Library is a vast walled precinct just north of the Roman Agora, built as a combined library, lecture hall, and cultural complex — part of Hadrian's campaign to remake Athens as an imperial showcase. Pausanias, seeing it soon after completion, describes a hall of a hundred Phrygian marble columns, gilded ceilings, alabaster walls, and niches holding books and statues, with gardens and a pool at its center. Construction dates to 132 CE, coinciding with Hadrian's second visit to Athens. Since Trajan died in August 117 CE and Hadrian's Athenian building program only gets underway in the 120s, this building simply does not exist yet in 117 CE — it opens roughly 15 years later.",
  },
  "Βιβλιοθήκη τού Πανταίνου": {
    english: "Library of Pantainos",
    category: "library",
    extant_117ce: true,
    built: 98,
    description:
      "The Library of Pantainos sits at the southeast entrance to the Agora, on the west side of the Panathenaic Way just south of the Stoa of Attalos. Titus Flavius Pantainos, an Athenian of means, built and dedicated it to Athena, Trajan, and the people of Athens between 98 and 102 CE. An inscribed rule from the building — among the earliest known library regulations — forbade removing books and set opening hours. It housed a peristyle courtyard, reading rooms, and rows of shops along the Panathenaic Way. Built only about 15-20 years before 117 CE and not destroyed until the Herulian sack of 267 CE, it is open and fully operating in 117 CE.",
  },
  "Βωμός 12 θεών": {
    english: "Altar of the Twelve Gods",
    category: "temple",
    extant_117ce: true,
    built: -522,
    description:
      "The Altar of the Twelve Gods stood in the northwest part of the Agora, set up around 522/1 BCE by Peisistratos the Younger during his archonship, and rebuilt after Persian destruction around 425 BCE. The altar marked the symbolic center of Athens: distances to outlying demes were measured from it, and it functioned as a place of asylum for suppliants and fugitives. Its precinct continued to be recognized as a civic landmark throughout the Classical and Hellenistic periods and on into Roman rule. With no recorded destruction before the Roman era, it stands in 117 CE.",
  },
  "Διογένειον": {
    english: "Diogeneion",
    category: "civic",
    extant_117ce: true,
    built: -229,
    description:
      "The Diogeneion is the gymnasium built around 229 BCE and named for Diogenes, the Macedonian garrison commander who withdrew his troops from Athens that year and was honored for it. From the mid-1st century CE onward it becomes the sole training headquarters of the Athenian ephebate — young men doing their year of civic and military training — replacing the older Lyceum and Ptolemaion in that role. Kosmetai, the annually elected supervisors of the ephebes, ran the syllabus and public accounting from here, and inscribed rosters of graduating ephebe classes were set up on-site every year from the early 1st century CE until 267 CE. That unbroken run confirms the building is fully active in 117 CE.",
  },
  "Εννεάκρουνος": {
    english: "Enneakrounos",
    category: "civic",
    extant_117ce: true,
    built: -520,
    description:
      "Enneakrounos, \"nine spouts,\" was the great public fountain house the Peisistratid tyrants built around 530-520 BCE to pipe water into the city. Agora excavators identify it with the Southeast Fountain House, a rectangular structure with a colonnaded porch at the southeast corner of the square. There is real ancient disagreement about the location: Thucydides places it near the Ilissos south of the Acropolis, while Pausanias, writing in the 2nd century CE, applies the name to the building the Agora tradition points to. Since Pausanias treats it as a going landmark on his visit and nothing indicates it went out of use earlier, it is standing in 117 CE, though whether it still supplied water by then is unclear.",
  },
  "Ερέχθειο": {
    english: "Erechtheion",
    category: "temple",
    extant_117ce: true,
    built: -406,
    description:
      "The Erechtheion is the Ionic temple on the north side of the Acropolis rock, built between 421 and 406 BCE to replace an earlier archaic temple of Athena Polias destroyed by the Persians. It housed the ancient olive-wood cult statue of Athena Polias, the focus of the Panathenaic festival, along with shrines of Poseidon-Erechtheus, the sacred olive tree, and the mark of Poseidon's trident. Its south porch carries the famous Caryatid columns. Named for the legendary king Erechtheus, it remained Athens's most sacred building throughout antiquity and continued in active cult use straight through the Roman period. It is fully standing and functioning as Athens's principal shrine to Athena in 117 CE.",
  },
  "Θόλος": {
    english: "Tholos",
    category: "civic",
    extant_117ce: true,
    built: -465,
    description:
      "The Tholos is the round building on the west side of the Agora, built around 470-465 BCE atop an earlier structure. Six interior columns held up a conical tiled roof; Athenians nicknamed it the \"Skias,\" or parasol. It served as the headquarters of the fifty prytaneis, the rotating executive committee of the Council of 500, who ate at public expense here and kept at least seventeen members on duty overnight to handle emergencies — effectively Athens's seat of continuous government. A kitchen was added on its north side. The building underwent minor Hellenistic and Roman-era repairs but kept its basic form and function without a break, so it is in active daily use as the prytaneis' headquarters in 117 CE.",
  },
  "Μέση Στοά": {
    english: "Middle Stoa",
    category: "civic",
    extant_117ce: true,
    built: -180,
    description:
      "The Middle Stoa is the largest building ever put up in the Agora, a long colonnade some 147 by 17.5 meters running east-west and dividing the square into northern and southern halves. Athenians built it around 180-140 BCE, part of a broader Hellenistic building push that included the Stoa of Attalos across the square. Open on both long sides with a single interior colonnade, it served general commercial and civic gathering functions rather than housing one fixed institution. It remained in continuous use through the Roman conquest and imperial period, forming the south edge of the Roman-era Agora's central square, and is a fully functioning public building in 117 CE.",
  },
  "Ναός του Απόλλωνος Πατρώου": {
    english: "Temple of Apollo Patroos",
    category: "temple",
    extant_117ce: true,
    built: -300,
    description:
      "The Temple of Apollo Patroos, \"Apollo of the fathers,\" stands on the west side of the Agora next to the Stoa of Zeus Eleutherios. It replaced an earlier apsidal temple destroyed by the Persians in 480/79 BCE; the surviving hexastyle Ionic temple, with its unusual L-shaped plan, was built around the very end of the 4th century BCE and housed a famous cult statue of Apollo by the sculptor Euphranor. Apollo Patroos held special civic significance as the mythic ancestor of the Athenian people through Ion, invoked in oaths and legal proceedings. The temple continued in religious use without interruption through the Hellenistic and Roman periods, so it is standing and functioning in 117 CE.",
  },
  "Ναός τού Άρη": {
    english: "Temple of Ares",
    category: "temple",
    extant_117ce: true,
    built: -2,
    description:
      "The Temple of Ares standing near the center of the Agora is not native to the site — it is a complete 5th-century BCE Doric temple, probably built around 440-436 BCE at Pallene (modern Gerakas) for Athena Pallenis, that Augustan-era Athens dismantled block by block and reassembled here around the turn of the millennium. The rededication to Ares tied into the imperial cult: Augustus's grandson Gaius was honored in the Greek world as the \"New Ares,\" making the relocation political theater as much as religious practice. It is one of several such \"itinerant temples\" moved into the Agora under Augustus. Rebuilt roughly a century before 117 CE with no sign of disuse, it stands as an active shrine in 117 CE.",
  },
  "Νομισματοκοπείον": {
    english: "Mint (Athenian Agora)",
    category: "civic",
    extant_117ce: false,
    description:
      "The Mint occupied a large square building, roughly 27 by 29 meters, in the southeast part of the Agora, built in the late 5th century BCE and used to strike Athens's bronze coinage mainly during the 4th to 2nd centuries BCE; excavation found furnaces, water basins, unstruck coin blanks, and metalworking slag confirming its industrial role. The building went out of use and was largely demolished around the 1st century BCE. Its northern half was then built over by the Southeast Temple, one of the relocated \"itinerant temples\" of the early Roman period. Because the Mint's structure was already gone and physically superseded well before Trajan's reign, it does not exist as a standing structure in 117 CE.",
  },
  "Νυμφαίον": {
    english: "Nymphaeum",
    category: "civic",
    extant_117ce: false,
    built: 140,
    description:
      "The Nymphaeum is a large semicircular monumental fountain on the south side of the Agora, along the west side of the Panathenaic Way. It formed the showpiece terminus of the Hadrianic aqueduct piping water into Athens from Mount Penteli, with niches in its curved facade holding statues of the imperial family and a pedestal for a statue of Hadrian out front. Hadrian began the project as part of his remaking of Athens, but it was only finished under his successor Antoninus Pius, around 140 CE. Since Trajan died in 117 CE and Hadrian's Athenian works only get going in the 120s during his visits to the city, the Nymphaeum has not been started yet in 117 CE.",
  },
  "Νότια Στοά 1": {
    english: "South Stoa I",
    category: "civic",
    extant_117ce: false,
    built: -400,
    description:
      "South Stoa I ran along the south side of the Agora, a long two-aisled Doric colonnade built at the end of the 5th century BCE, likely around 425-400 BCE. Sixteen rooms lined its back wall, fifteen nearly square with off-center doors and sockets for klinai — a layout marking them as dining rooms for boards of Athenian officials. It anchored the south side of the square for roughly two and a half centuries. Around 150 BCE it was demolished to make way for its larger successor, South Stoa II, built slightly to the south. Because it was already replaced three centuries before Trajan's reign, South Stoa I no longer exists in 117 CE.",
  },
  "Νότια Στοά 2": {
    english: "South Stoa II",
    category: "civic",
    extant_117ce: true,
    built: -150,
    description:
      "South Stoa II replaced South Stoa I around the mid-2nd century BCE, part of the same Hellenistic campaign that produced the Middle Stoa and the Stoa of Attalos, together enclosing a new South Square at the southern edge of the Agora. It ran as a long colonnaded portico fronting the square, continuing a commercial and administrative role similar to its predecessor. The building remained a working part of the Agora's southern precinct into the Roman imperial period, when the South Square it framed was still used for public gatherings and events. With no evidence of demolition before the Roman era, it stands as an active part of the Agora complex in 117 CE.",
  },
  "Νοτιοανατολικός Ναός": {
    english: "Southeast Temple",
    category: "temple",
    extant_117ce: false,
    built: 125,
    description:
      "The Southeast Temple is an Ionic temple in the southeast corner of the Agora, assembled from spolia — carved blocks stripped from the Temple of Athena at Sounion — and built directly over the demolished remains of the old Athenian Mint. Scholars date its construction to the first half of the 2nd century CE, tying it to Hadrian's relocation of Attic temples into the Agora, a program that begins after 117 CE and picks up momentum during his visits to Athens in the 120s. Its dedication is unknown — no inscription survives naming the honored god or hero. Because its construction falls within Hadrian's building program rather than before it, the Southeast Temple has not yet been built in 117 CE.",
  },
  "Νοτιοδυτικός Ναός": {
    english: "Southwest Temple",
    category: "temple",
    extant_117ce: true,
    description:
      "The Southwest Temple stands in the southwest part of the Agora, a small Doric temple built from spolia taken from Classical-period structures — including a 5th-century BCE stoa — originally standing at Thorikos in southeastern Attica. Like the Temple of Ares and the Southeast Temple, it belongs to the \"itinerant temples\" phenomenon: Attic countryside sanctuaries dismantled and re-erected in the Agora as rural populations declined. This one dates to the age of Augustus, in the late 1st century BCE, making it one of the earlier relocations rather than a Hadrianic-period one. Having stood for well over a century before Trajan's death, the Southwest Temple is an established fixture of the Agora in 117 CE.",
  },
  "Παλαιό Βουλευτήριον και Μητρώον": {
    english: "Old Bouleuterion and Metroon",
    category: "civic",
    extant_117ce: true,
    built: -140,
    description:
      "The Old Bouleuterion, built around 500 BCE on the west side of the Agora, originally housed the 500-member Athenian boule. Once a New Bouleuterion was built behind it around 400 BCE, the old building was repurposed as the city's archive and became linked with the neighboring sanctuary of the Mother of the Gods (Meter), earning the name Metroon — holding Athens's laws, decrees, court records, and official weights and measures. Around 140 BCE a new, larger Metroon replaced the old structure on the same site, absorbing the archive function into a grander Hellenistic building that Pausanias later visits and describes. That successor Metroon, standing on the old Bouleuterion's footprint, is Athens's active civic archive in 117 CE.",
  },
  "Πύλη Αρχηγέτιδος Αθηνάς": {
    english: "Gate of Athena Archegetis",
    category: "civic",
    extant_117ce: true,
    built: -11,
    description:
      "The Gate of Athena Archegetis is the monumental western entrance to the Roman Agora, four Doric columns of Pentelic marble carrying an architrave, funded by donations from Julius Caesar and Augustus and dedicated around 11 BCE. An inscription on the architrave names Athena Archegetis, \"the leader,\" as the honoree, and records the gate as the formal gateway into the new market building the Romans financed for Athens. It remains the grandest surviving entrance to the Roman Agora complex. Built roughly 128 years before Trajan's death and showing no sign of alteration before the Herulian sack of 267 CE, the gate stands as the working entrance to Athens's Roman-era commercial square in 117 CE.",
  },
  "Στοά του Αττάλου": {
    english: "Stoa of Attalos",
    category: "civic",
    extant_117ce: true,
    built: -150,
    description:
      "The Stoa of Attalos is the great two-story commercial colonnade on the east side of the Agora, built between about 159 and 138 BCE as a gift from King Attalos II of Pergamon, who studied philosophy in Athens as a young man and wanted to repay the city. Forty-two shops lined its two floors behind a double colonnade of Doric and Ionic columns, making it ancient Athens's closest equivalent to a shopping arcade. It functioned as a commercial hub for centuries, straight through the Roman conquest and imperial period, and was not destroyed until the Herulian sack of 267 CE (the reconstruction visitors see today dates only to 1956). In 117 CE it is a busy, fully operating commercial building.",
  },
  "Στοά του Ελευθερίου Διός": {
    english: "Stoa of Zeus Eleutherios",
    category: "temple",
    extant_117ce: true,
    built: -415,
    description:
      "The Stoa of Zeus Eleutherios stands in the northwest corner of the Agora, a two-winged Doric colonnade built around 425-410 BCE and dedicated to Zeus in his aspect as \"Eleutherios,\" god of freedom — a cult founded to commemorate liberation from the Persian invasions. Pausanias describes veterans dedicating captured shields here, including from the 3rd-century BCE wars against the Macedonian garrison and invading Gauls, and notes a bronze statue of Zeus Eleutherios standing before it. Socrates reportedly liked to spend time here. The building and its cult remained a going religious and civic site through the Hellenistic period and into Roman rule, with no recorded destruction before the Roman era, so it functions normally in 117 CE.",
  },
  "Ωδείο τού Αγρίππα": {
    english: "Odeon of Agrippa",
    category: "theater",
    extant_117ce: true,
    built: -15,
    description:
      "The Odeon of Agrippa is the roofed concert hall built around 15 BCE at the center of the Agora as a gift from Marcus Vipsanius Agrippa, Augustus's son-in-law and general. A two-story auditorium seated roughly 1,000 people around a marble-paved orchestra and raised stage for musical and rhetorical performances. Its unsupported 25-meter roof span was an engineering gamble that eventually failed: the roof collapsed around 150 CE, after which the building was rebuilt smaller as a lecture hall seating about 500, with giant and triton figures added to its new facade. In 117 CE, roughly three decades before that collapse, the Odeon still stands in its original grand form and is in active use as Athens's premier concert venue.",
  },
  "Ἐλευσίνιον": {
    english: "City Eleusinion",
    category: "temple",
    extant_117ce: true,
    description:
      "The City Eleusinion is the urban sanctuary of Demeter and Kore on the north slope of the Acropolis, just off the Panathenaic Way as it climbs from the Agora. It served as Athens's in-town counterpart to the main sanctuary at Eleusis: each September during the Eleusinian Mysteries, priestesses carried the sacred objects on foot from Eleusis to be deposited and guarded here while the festival's opening rites played out in the city before the great procession returned everyone to Eleusis. The sanctuary had stood in continuous cult use since at least the Archaic period, with building phases added over centuries, and the Mysteries remained one of the best-attended religious festivals in the Roman world. The Eleusinion is fully active in its ritual role in 117 CE.",
  },
  "Ηλιαία": {
    english: "Heliaia",
    category: "civic",
    extant_117ce: true,
    description:
      "The Heliaia was Classical Athens's largest law court, a jury body of up to 1,501 citizens chosen by lot to hear major public and private cases. Excavators tentatively place its home in a large walled enclosure at the southwest corner of the Agora, roofed and given an internal peristyle around 150 BCE, though the identification is not certain — the site has also been proposed as the Aiakeion, a hero shrine, since no juror's equipment turned up to confirm the courthouse function. Whichever identification is correct, nothing in the archaeological record points to the building's demolition before the Roman period. On balance the structure remains standing on the Agora's southwest corner in 117 CE, though its exact use under Roman-period Athens is less clear than its Classical role.",
  },
  "Μνημείο επωνύμων ηρώων": {
    english: "Monument of the Eponymous Heroes",
    category: "civic",
    extant_117ce: true,
    description:
      "The Monument of the Eponymous Heroes is a long marble base, over 16 meters, that stood in the Agora between the Metroon and the Temple of Ares, carrying ten bronze statues of the mythical heroes for whom Kleisthenes named Athens's ten tribes in 508 BCE. Public notices — proposed laws, upcoming lawsuits, military call-up lists, decrees — were posted on wooden boards along its fence, making it Athens's central public bulletin board. Pausanias describes it directly in his tour of the Agora. The monument was moved and rebuilt more than once as the surrounding square changed, most recently in the Hellenistic period, but it kept functioning as the city's official notice board into the Roman era, standing and in daily civic use in 117 CE.",
  },
  "Εγκιβωτισμένη κοίτη Ηριδανού ποταμού": {
    english: "Culverted channel of the Eridanos river",
    category: "civic",
    extant_117ce: true,
    description:
      "This is the covered channel that carried the Eridanos, the small stream that once ran from the slopes of Lykabettos down through the Kerameikos and along the north edge of the Agora before joining the city's drainage system. Already reduced to little more than a drain by the Classical period, Athenians boxed the streambed in stone and brick barrel vaulting so it could run beneath streets and public buildings, passing near the Stoa Basileios and under the Panathenaic Way. Roman-era Athens maintained and repaired this brickwork channel as part of the city's sewer and drainage network, work archaeologists have traced through at least two phases of imperial-period repair. As continuously maintained civic infrastructure, the culverted Eridanos is in active use in 117 CE.",
  },
};

/** Look up a matching description for an OSM building name. */
export function athensEntry(name: string | null | undefined): AthensEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(ATHENS_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return ATHENS_LOOKUP[k];
  }
  return undefined;
}
