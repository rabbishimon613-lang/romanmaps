/** Hand-curated descriptions for named buildings in the Sanctuary of Apollo at Delphi — same
 * pattern as app/ostiaDescriptions.ts, app/pompeiiDescriptions.ts, app/herculaneumDescriptions.ts
 * and app/ephesusDescriptions.ts, the fifth site to get this treatment [06-P0-2]. Delphi's OSM
 * building data carries Greek names rather than Italian/English, so keys below are Greek — the
 * exact strings that appear in public/data/sites/delphi_buildings.geojson's `name` property.
 *
 * Sources: Pausanias, Description of Greece, book 10 (his own tour of the sanctuary, written a
 * couple of generations after this map's snapshot but describing the same buildings Plutarch —
 * a working priest at Delphi in 117 CE — would have walked past daily); Herodotus; Plutarch's own
 * writing; Fouilles de Delphes excavation reports (École française d'Athènes); the Delphi
 * Archaeological Museum's published guide. Researched via a background WebSearch pass, personally
 * reviewed before merging — see BOARD.md's [06-P0-2] ticket note for what was dropped and why.
 *
 * Delphi was a living, continuously visited Panhellenic sanctuary in 117 CE, not a buried site —
 * almost everything here predates the snapshot by centuries and is `extant_117ce: true`. The
 * exceptions are noted individually. */

export type DelphiEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

// Keys are matched as substrings against the OSM name (exact Greek string), longer keys checked
// first. Keep entries specific to one building.
export const DELPHI_LOOKUP: Record<string, DelphiEntry> = {
  "Ναός Απόλλωνος": {
    english: "Temple of Apollo",
    category: "temple",
    extant_117ce: true,
    built: -333,
    description:
      "The temple standing at Delphi in 117 CE was finished in 333 BCE, a 60-meter Doric building ringed by 38 columns and coated in marble-dust stucco over local limestone. Inside sat the tripod from which the Pythia delivered her oracles, alongside the carved maxims \"Know Thyself\" and \"Nothing in Excess.\" This was the exact temple Plutarch served as priest of when Trajan died and Hadrian took power in August 117 CE.",
  },
  "Θέατρο Δελφών": {
    english: "Theatre of Delphi",
    category: "theater",
    extant_117ce: true,
    built: -159,
    description:
      "Cut into the hillside above the Temple of Apollo, the theatre held roughly 5,000 spectators for the singing and instrumental contests of the Pythian Games. First built in stone in the 4th century BCE, it was substantially renovated in 160-159 BCE with funding from King Eumenes II of Pergamon, whose money bought Delphi a theatre a Hellenistic king was proud to put his name on.",
  },
  "Θησαυρός Αθηναίων": {
    english: "Athenian Treasury",
    category: "treasury",
    extant_117ce: true,
    built: -490,
    description:
      "Built entirely of gleaming Parian marble, the Athenian Treasury stands at the first bend of the Sacred Way, its base measuring about 6.7 by 9.7 meters. Pausanias reported that Athens funded it with a tenth of the spoils from Marathon in 490 BCE, turning a single land battle into permanent architecture inside the most-watched sanctuary in Greece. Doric metopes carved around the building show the exploits of Theseus and Heracles.",
  },
  "Θησαυρός Θηβαίων": {
    english: "Theban Treasury",
    category: "treasury",
    extant_117ce: true,
    built: -371,
    description:
      "Thebes built the largest treasury in the entire sanctuary after crushing Sparta at Leuctra in 371 BCE, at 12.3 by 7.2 meters deliberately sized to outclass its older Spartan- and Athenian-aligned neighbors on the Sacred Way. Cut from limestone quarried near the nearby town of Chrisso, it announced Theban military supremacy over the two cities that had dominated Delphi's monumental landscape for the previous century.",
  },
  "Θησαυρός Κνιδίων": {
    english: "Cnidian Treasury",
    category: "treasury",
    extant_117ce: true,
    built: -545,
    description:
      "Two draped marble caryatids, each roughly 2.5 meters tall, held up the porch of this small treasury in place of ordinary columns — Cnidus built it around 550 BCE, just before falling to the Persians in 544 BCE. Its compact 5-by-6.6-meter footprint packed in some of the finest Archaic Ionic sculpture at Delphi. Fragments of the original caryatids are now on display in the Delphi Archaeological Museum.",
  },
  "Θησαυρός Κορινθίων": {
    english: "Corinthian Treasury",
    category: "treasury",
    extant_117ce: true,
    built: -650,
    description:
      "The very first treasury built at Delphi, raised by the Corinthian tyrant Cypselus starting around 657 BCE. Herodotus wrote that Croesus of Lydia kept a golden lion and gold ingots inside it, alongside six golden bowls the earlier Lydian king Gyges had dedicated there a century before. By the time Plutarch served as a Delphic priest, the Corinthian Treasury had already stood for the better part of eight centuries.",
  },
  "Θησαυρός Κυρηναίων": {
    english: "Treasury of Cyrene",
    category: "treasury",
    extant_117ce: true,
    built: -330,
    description:
      "Cyrene in North Africa built one of the last treasuries raised at Delphi, going up between 334 and 322 BCE, centuries after most of its Archaic neighbors. Scholars connect its construction to a large gift of wheat Cyrene once sent Delphi during a famine, turning grain diplomacy into permanent stone on the Sacred Way — a reminder that Delphi's treasury-building tradition ran unbroken for more than three centuries.",
  },
  "Θησαυρός Μεγαρέων": {
    english: "Megarian Treasury",
    category: "treasury",
    extant_117ce: true,
    built: -500,
    description:
      "Megara built and then rebuilt its treasury on this spot, an original Doric structure going up around 500 BCE followed by a trapezoid-shaped replacement roughly a century later. Twenty-six inscriptions carved across its walls — mostly honorary decrees for Megarian citizens — turned the treasury's own surface into a running public record rather than just a box for storing offerings.",
  },
  "Θησαυρός Ποτίδαιας": {
    english: "Treasury of Potidaea",
    category: "treasury",
    extant_117ce: true,
    built: -400,
    description:
      "Pausanias recorded that the Potidaeans, a Corinthian colony on the Chalcidice peninsula in the northern Aegean, built a treasury at Delphi as a straightforward act of piety rather than to mark any one victory. Its existence is directly attested in his text, standing somewhere along the crowded Sacred Way among the dozens of treasuries cities raised to be seen by every pilgrim who passed.",
  },
  "Θησαυρός Σιφνίων": {
    english: "Siphnian Treasury",
    category: "treasury",
    extant_117ce: true,
    built: -525,
    description:
      "The island of Siphnos spent a tithe of its gold and silver mine revenue on the most lavishly decorated treasury at Delphi, built around 525 BCE. A continuous marble frieze ran across all four sides — some 30 meters of relief carving the Trojan War and a battle of gods against giants — held up by two caryatids at the porch instead of ordinary columns. Herodotus wrote that the island's mines flooded soon after, as if the treasury marked the exact peak of Siphnian wealth just before its collapse.",
  },
  "Θησαυρός Βοιωτών": {
    english: "Boeotian Treasury",
    category: "treasury",
    extant_117ce: false,
    built: -525,
    description:
      "The cities of the Boeotian federation built a limestone treasury near the southwest end of the Sacred Way around 525 BCE, its surviving inscriptions cut in distinctive Boeotian lettering. It predates the much larger Theban Treasury built after Leuctra by a century and a half, representing an earlier collective Boeotian dedication rather than a purely Theban one. By the time Pausanias toured the sanctuary two generations after Trajan's death, he never mentioned it — it was gone by then, and possibly already gone in 117 CE.",
  },
  "Ιερά οδός": {
    english: "Sacred Way",
    category: "road",
    extant_117ce: true,
    description:
      "The Sacred Way climbed from the sanctuary's lower gate to the Temple of Apollo, switching back west and then north as it rose past a dense field of treasuries and votive monuments. Every pilgrim, ambassador, and athlete entering the sanctuary walked this one paved route, and Greek cities competed hard for its most visible plots — turning the climb itself into an open-air gallery of civic rivalry that ran unbroken for centuries by the time Trajan died in 117 CE.",
  },
  "Κολώνα Ναξίων": {
    english: "Naxian Sphinx Column",
    category: "monument",
    extant_117ce: true,
    built: -560,
    description:
      "The people of Naxos raised a sphinx atop a slender Ionic column around 560 BCE, the whole monument reaching about 12.5 meters with the sphinx itself standing 2.2 meters tall. Its capital ranks among the earliest true Ionic capitals known anywhere in Greece. An inscription cut into the column's base in 328 BCE renewed Naxos's privilege of consulting the oracle out of turn, proof the monument still mattered politically some two centuries after it went up.",
  },
  "Λέσχη Κνιδίων": {
    english: "Cnidian Lesche",
    category: "hall",
    extant_117ce: true,
    built: -458,
    description:
      "Cnidus built this clubhouse between 458 and 447 BCE to give pilgrims a covered place to rest, then commissioned the painter Polygnotus of Thasos to cover its walls with two monumental murals — one of the sack of Troy, the other of Odysseus's visit to the underworld. Pausanias devoted an entire long passage of his own Delphi tour to cataloguing the individual figures Polygnotus had painted into each scene, a rare case of an ancient viewer describing a lost masterpiece room by room.",
  },
  "Μέγας Βωμός": {
    english: "Great Altar of the Chians",
    category: "altar",
    extant_117ce: true,
    built: -246,
    description:
      "Standing directly in front of the Temple of Apollo, the Great Altar measured 8.6 by 5.1 meters and was faced in dark bluish-black marble with only its base and cornice cut from contrasting white stone. Chios funded this 3rd-century-BCE rebuild, replacing an older altar the Athenian Alcmaeonid family had dedicated after fire destroyed the original in 548 BCE. Every sacrifice offered to Apollo at Delphi passed over this single altar, the busiest stone in the whole sanctuary.",
  },
  "Μνημείον Δαόχου": {
    english: "Monument of Daochos",
    category: "monument",
    extant_117ce: true,
    built: -336,
    description:
      "Daochos II of Pharsalus, Thessaly's delegate to the sanctuary's governing council, commissioned nine marble statues on one base near the temple terrace around 336-332 BCE: Apollo alongside eight men of his own family across six generations. Carved epigrams beneath each figure named the man and listed his victories — one of them, the athlete Agias, had won multiple Olympic and Pythian wrestling titles, and his statue survives as one of the best-preserved pieces of the whole group.",
  },
  "Πηγή Κασσότις": {
    english: "Spring of Cassotis",
    category: "spring",
    extant_117ce: true,
    description:
      "A low wall above the temple terrace enclosed the spring the Delphians called Cassotis, named for a nymph of Mount Parnassus. Pausanias recorded the local belief that its water sank underground and resurfaced directly beneath the temple, feeding the trance the Pythia entered before delivering an oracle. Unlike the Castalian Spring outside the sanctuary, where visitors washed before entering, Cassotis served no bathing function at all — its whole purpose was the oracle itself.",
  },
  "Στοά Αθηναίων": {
    english: "Stoa of the Athenians",
    category: "hall",
    extant_117ce: true,
    built: -478,
    description:
      "Athens built this open colonnade against the sanctuary's polygonal retaining wall between 478 and 470 BCE to display actual captured war material rather than statues. Seven monolithic Ionic columns of Pentelic marble, each 3.3 meters tall, once held cables salvaged from Xerxes's pontoon bridge across the Hellespont, dismantled after the Athenian siege of Sestos in 478 BCE — real Persian wreckage on public display instead of a commissioned artwork.",
  },
  "Στοά Αττάλου": {
    english: "Stoa of Attalos",
    category: "hall",
    extant_117ce: true,
    built: -241,
    description:
      "Not to be confused with its far more famous namesake in the Athens Agora, this stoa east of the theatre was funded by Attalos I of Pergamon between roughly 241 and 223 BCE — a different king from the Attalos who paid for the Athens building. Its Doric colonnade opened south over drainage channels and vaulted substructure arches, with painted panels along the back wall and statues of Pergamene kings out front, deliberately facing the Aetolian League's own stoa across the temple terrace.",
  },
  "Στοά των Αιτωλών": {
    english: "Stoa of the Aetolians",
    category: "hall",
    extant_117ce: true,
    built: -279,
    description:
      "After the Aetolian League helped turn back Brennus and his invading Gauls at Delphi in 279 BCE, the Aetolians claimed the last open ground on the temple terrace and built one of the largest porticoes in the sanctuary there — 72.6 meters long, nearly matching the length of the Temple of Apollo itself. It served as a permanent showground for Aetolian war spoils, announcing an emerging federal power's claim to have saved the most sacred site in the Greek world.",
  },
  "Στάδιον": {
    english: "Stadium of Delphi",
    category: "stadium",
    extant_117ce: true,
    built: -334,
    description:
      "Set into a hollow at the highest point of the sanctuary, the stadium hosted the running and equestrian events of the Pythian Games, eventually holding as many as 6,500 spectators. Its layout took shape in the 4th and 3rd centuries BCE, but the fine stone seating and monumental arched entrance visitors see today weren't added until decades after 117 CE, funded by the Athenian benefactor Herodes Atticus. When Hadrian became emperor, spectators here still sat on plain limestone benches.",
  },
  "Στἀδιον": {
    english: "Stadium of Delphi",
    category: "stadium",
    extant_117ce: true,
    built: -334,
    description:
      "Set into a hollow at the highest point of the sanctuary, the stadium hosted the running and equestrian events of the Pythian Games, eventually holding as many as 6,500 spectators. Its layout took shape in the 4th and 3rd centuries BCE, but the fine stone seating and monumental arched entrance visitors see today weren't added until decades after 117 CE, funded by the Athenian benefactor Herodes Atticus. When Hadrian became emperor, spectators here still sat on plain limestone benches.",
  },
  "Σικυώνιος θησαυρός": {
    english: "Sicyonian Treasury",
    category: "treasury",
    extant_117ce: true,
    built: -580,
    description:
      "Sicyon built at this exact spot three times over — first a round tholos around 580 BCE marking the end of the First Sacred War, then a circular monopteros, then the rectangular treasury whose foundations survive today, recycling sculpted metopes salvaged from the two earlier buildings. Pausanias listed the Sicyonian Treasury first among every treasury he catalogued, and it does sit at the very first bend of the Sacred Way — the first dedication any pilgrim on the climb actually reached.",
  },
  "Βουλευτήριον": {
    english: "Bouleuterion",
    category: "civic",
    extant_117ce: true,
    built: -600,
    description:
      "Just off the Sacred Way, across from the Cnidian Treasury, the Bouleuterion housed the local council that ran Delphi's own civic affairs — a separate body from the Panhellenic Amphictyonic Council that oversaw the sanctuary as a whole. Its walls stood on tufa foundations laid as early as 600 BCE. Plutarch, who spent decades as a Delphic priest right around 117 CE, placed the building beside the Athenian Treasury in his own account of the site.",
  },
  "Πρυτανείον": {
    english: "Prytaneion",
    category: "civic",
    extant_117ce: true,
    description:
      "Delphi's Prytaneion housed the sanctuary's sacred hearth of Hestia, whose flame colonists founding new cities abroad are said to have carried out from here to kindle their own city's first fire. The building's exact footprint among the surviving ruins is disputed among archaeologists, but the institution itself is not in doubt — a working civic hearth at the heart of the sanctuary for as long as Delphi mattered to the Greek world.",
  },
  "Ασκληπιείον": {
    english: "Asklepieion",
    category: "sanctuary",
    extant_117ce: true,
    description:
      "Tucked directly behind the Bouleuterion, this small shrine belonged to Asclepius, god of healing and, in Delphic tradition, a son of Apollo. Pilgrims practiced incubation here, sleeping inside the precinct in hopes the god would appear in a dream and prescribe a cure. On-site dedicatory inscriptions confirm Asclepius as the shrine's owner, and the building reused the foundations of an earlier structure — this plot had been sacred ground before it was ever his.",
  },
  "Ηρώον Νεοπτόλεμου": {
    english: "Heroon of Neoptolemus",
    category: "shrine",
    extant_117ce: true,
    description:
      "A walled enclosure near the temple held the grave the Delphians tended for Neoptolemus, son of Achilles, whom local myth said was killed at Delphi in a dispute over sacrificial meat. Every year the Delphians sacrificed to him as a hero rather than a god, one of the sanctuary's few cult sites built around a single named mortal. Worshippers added unworked wool to the grave marker at each festival, a ritual Plutarch would have watched run its course during his own decades as priest.",
  },
  "Αναθηματική προσφορά Αθηναίων (Νίκη Μαραθώνος)": {
    english: "Athenian Marathon Monument",
    category: "monument",
    extant_117ce: true,
    built: -490,
    description:
      "Athens funded thirteen bronze statues on a single 15-meter base with a tenth of the spoils from Marathon, placing the general Miltiades alongside Athena, Apollo, and the ten mythical heroes who gave their names to Athens's own tribes. It stood just south of the Spartan admirals' monument, letting Athenian and Spartan war memorials face off permanently inside the same sanctuary. Pausanias catalogued each figure by name generations after it went up, confirming the group still stood intact long after 117 CE.",
  },
  "Αναθηματική προσφορά Αργείων (απογόνων)": {
    english: "Monument of the Epigonoi",
    category: "monument",
    extant_117ce: true,
    description:
      "Argos dedicated a semicircular row of bronze statues of the Epigonoi — the sons of the Seven generals who died besieging Thebes — marking that this second generation of warriors finished what their fathers couldn't. The sculptors Hypatodorus and Aristogeiton cast the group, including Diomedes and Alcmaeon, funded from spoils of an Argive-Athenian victory over Sparta. Its base inscription read simply \"the Argives dedicated this to Apollo,\" standing just west of a separate Argive monument to the original Seven.",
  },
  "Αναθηματική προσφορά Αργείων (βασιλείς τού Άργους)": {
    english: "Exedra of the Kings of Argos",
    category: "monument",
    extant_117ce: true,
    built: -369,
    description:
      "Argos built a curved exedra of statues of its own legendary kings, starting with Danaus at the center and running through Perseus, Electryon, Alcmena, and Heracles. The Argive sculptor Antiphanes signed the work in 369 BCE, raised to mark the founding of the new city of Messene as part of Argos's alliance against Sparta. The base held slots for twenty bronze figures, but only about ten were ever installed — a monument left visibly unfinished even in antiquity.",
  },
  "Αναθηματική προσφορά Κερκυραίων (ταύρος)": {
    english: "Bull of Corcyra",
    category: "monument",
    extant_117ce: true,
    built: -480,
    description:
      "Corcyra dedicated a bronze bull just inside the sanctuary entrance around 480 BCE after an enormous windfall catch of tuna, paying for the statue with a tenth of the profits from selling the fish. Pausanias recorded the local legend behind it: a bull kept wandering to the shore bellowing until herdsmen followed it and found the sea teeming with tuna. The sculptor Theopropos of Aegina cast the bronze, and its stone base still stands beside the sanctuary entrance today.",
  },
  "Αναθηματική προσφορά Λακεδαιμονίων": {
    english: "Spartan Monument of the Admirals",
    category: "monument",
    extant_117ce: true,
    built: -405,
    description:
      "After annihilating the Athenian fleet at Aegospotami in 405 BCE, the Spartan admiral Lysander spent the spoils on a monument of 38 bronze statues in two groups just inside the sanctuary entrance — one showing Poseidon crowning Lysander himself, the other arranged like a warship's deck with the allied commanders standing at their posts. Decades later a strange growth reportedly crept across Lysander's own cracking statue right as Sparta lost its dominance to Thebes at Leuctra, read at the time as an omen of Sparta's coming fall.",
  },
  "Αναθηματική προσφορά Ροδίων": {
    english: "Rhodian Dedication",
    category: "monument",
    extant_117ce: true,
    built: -304,
    description:
      "Rhodes raised a bronze chariot of the sun god Helios at Delphi to celebrate its successful year-long defense against the siege of Demetrius Poliorcetes in 305-304 BCE — a siege so famous Rhodes later melted the attacker's abandoned equipment to help cast the Colossus of Rhodes. The monument stood positioned to face the sculpted pediment of the Temple of Apollo directly, its bronze horses traditionally linked to the workshop of the sculptor Lysippos.",
  },
  "Αναθηματική προσφορά Τάραντα": {
    english: "Tarentine Dedication",
    category: "monument",
    extant_117ce: true,
    description:
      "The Greek colonists of Taras in southern Italy sent two separate tenths of war spoils to Delphi after fighting the Messapians and the Peucetii, among the largest dedications any non-mainland Greek city made at the sanctuary. The sculptor Ageladas of Argos cast bronze horses and captive women from one victory; a second group by Ageladas and Onatas of Aegina showed the Iapygian king Opis dead on the ground with the hero Taras and the Spartan colonist Phalanthus standing over him. Pausanias described both in detail, proof a distant Italian colony used Delphi to advertise its wars to the whole Greek world.",
  },
};

/** Look up a matching description for an OSM building name. */
export function delphiEntry(name: string | null | undefined): DelphiEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(DELPHI_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return DELPHI_LOOKUP[k];
  }
  return undefined;
}
