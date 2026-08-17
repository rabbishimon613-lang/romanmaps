/** Hand-curated descriptions for named buildings at Jerash (ancient Gerasa) — same pattern as
 * app/ostiaDescriptions.ts and the Pompeii/Herculaneum/Ephesus/Delphi files, the sixth site to get
 * this treatment [06-P0-2]. Keys are the exact strings in public/data/sites/jerash_buildings.geojson's
 * `name` property.
 *
 * Gerasa is the sharpest 117 CE snapshot case on the map so far. The city everyone photographs —
 * the Artemis sanctuary, Hadrian's Arch, the Nymphaeum, both Tetrapylons, the great colonnaded
 * Cardo in its final form — is Antonine through Severan (129-210s CE), a whole building boom that
 * begins *after* Trajan died. So most of these entries are honestly `extant_117ce: false`, and their
 * descriptions say what stood on the ground in Trajan's day rather than describe a monument that
 * wasn't there yet. What WAS real and impressive in 117: the Oval Plaza, the older Zeus sanctuary,
 * the city wall, the North Gate (dated by inscription to 115 CE, the single most precisely dated
 * thing standing at the snapshot), and the two extramural market rows on the Philadelphia road.
 *
 * Sources: Pliny the Elder (Natural History 5.74, listing Gerasa among the Decapolis); the dated
 * mosaic and building inscriptions each entry rests on; C. Kraeling (ed.), Gerasa: City of the
 * Decapolis (1938); the Fouilles/Northeast Insulae Project and Danish-German excavation reports;
 * the Oxford Cult of Saints inscription catalogue for the churches. Researched via two background
 * WebSearch passes, personally reviewed — see BOARD.md's [06-P0-2] note for what was dropped. */

export type JerashEntry = {
  english?: string;
  category?: string;
  extant_117ce?: boolean;
  built?: number; // year, negative = BCE
  destroyed?: number;
  description: string;
};

// Keys matched as substrings against the OSM name, longer keys first. Roman-era buildings that
// stood in 117 CE come first, then the buildings not yet raised at the snapshot.
export const JERASH_LOOKUP: Record<string, JerashEntry> = {
  // --- Standing and real in 117 CE ---
  "North gate": {
    english: "North Gate",
    category: "gate",
    extant_117ce: true,
    built: 115,
    description:
      "A dedicatory inscription names Trajan as the city's founder and savior and fixes this gate to 115 CE — which makes it the single most precisely dated thing standing at Gerasa when this map is set, two years old the day Trajan died. It carried the road in from Pella onto the Cardo. Trajan's annexation of the Nabataean kingdom in 106 had rerouted the region's trade through the new province of Arabia, and the gate announced the payoff. Cart ruts are still worn into the roadbed just inside it.",
  },
  "The South Gate and the City Wall": {
    english: "City Wall and South Gate",
    category: "wall",
    extant_117ce: true,
    built: 110,
    description:
      "Pottery under six stretches of the perimeter dates Gerasa's first true city wall to about the turn of the 2nd century, the years Trajan folded the city into Provincia Arabia — so the circuit itself was standing in 117 CE, running the ridgelines above the Chrysorhoas stream. The carved acanthus-leaf South Gate visitors admire came later, around 129-130, built ahead of Hadrian's own visit and modeled on his arch nearby. In Trajan's day a plainer opening pierced the wall here.",
  },
  "Temple of Zeus": {
    english: "Temple of Zeus (lower sanctuary)",
    category: "temple",
    extant_117ce: true,
    built: 27,
    description:
      "A small Hellenistic shrine crowned this hill generations before Rome ruled Gerasa, standing beside a six-meter altar carved with the emblems of Zeus, the Dioscuri and Heracles. In 27/28 CE a local architect, Diodoros son of Zebedas, walled the precinct into a proper courtyard and cut his own name into the dedication. This modest walled sanctuary — not the soaring peristyle temple that replaced it in the 160s — was what stood over the city when Trajan died.",
  },
  "The East Souk": {
    english: "East Market Row",
    category: "market",
    extant_117ce: true,
    built: 110,
    description:
      "A row of fifteen shops and workshops went up around 110 CE outside the southern edge of the city, flanking the road to Philadelphia — so this was a working market seven years before Trajan died, busy with bronze-workers, potters and carpenters. It predates the monumental South Gate: the foundations of its southernmost shop run right under the later gate. Late in the empire the whole row was levelled to drive a straight new street through to the Oval Plaza.",
  },
  "The West Souk": {
    english: "West Market Row",
    category: "market",
    extant_117ce: true,
    built: 110,
    description:
      "The twin of the east market, built around 110 CE and trading through the 117 CE snapshot, packed with craftsmen's shops beside the road where the South Gate would later rise. Around 220 CE the rock floor of its southernmost shop was cut away to sink an olive press, and that ancient mill still sits in the ruins today. After a looters' fire late in the 3rd century, the burnt-out row was flattened and a small army barracks built over it to watch the gate.",
  },
  "Agora": {
    english: "Agora and Civic Basilica",
    category: "market",
    extant_117ce: false,
    built: 130,
    description:
      "In 117 CE this was not yet the civic square visitors cross today. The Agora and its huge public hall beside the North Theatre were, on the best reading of the evidence, still at the design or earliest-building stage when Trajan died — planned under him, raised under Hadrian. At most the surrounding Ionic colonnade was beginning to go up; the paving would not be laid for two more centuries. A visitor in Trajan's day found open ground and a building site here, not a finished forum.",
  },
  "Civic Basilica": {
    english: "Civic Basilica",
    category: "basilica",
    extant_117ce: false,
    built: 130,
    description:
      "Not yet standing in 117 CE. This great hall beside the Agora — over 30 meters wide and around 100 long, meant for assemblies, courts and probably the city archives — carries no dated inscription, but the consensus puts its design under Trajan and its construction under Hadrian. When Trajan died on 8 August 117 nothing of the hall was up; the ground opposite the North Theatre was still being cleared. Charred remains show it burned in a raid late in the 3rd century.",
  },

  // --- Not yet built at the 117 CE snapshot ---
  "Upper Temple of Zeus": {
    english: "Temple of Zeus (upper terrace)",
    category: "temple",
    extant_117ce: false,
    built: 163,
    description:
      "Not yet built in 117 CE. The soaring peristyle temple whose columns visitors climb to today was raised in 162-163 CE, forty-five years after Trajan's death, on top of the older sanctuary's foundations. In 117 CE only the modest walled precinct of the lower terrace occupied this hill. A visitor climbing here under Trajan found an altar and a small shrine, not a monumental temple front.",
  },
  "Hadrian's Arch": {
    english: "Hadrian's Arch",
    category: "arch",
    extant_117ce: false,
    built: 130,
    description:
      "Not yet built. This triple-arched gateway was raised in 129-130 CE to honor Hadrian's winter visit, thirteen years after this map is set, and deliberately placed outside the walls to mark a planned southward expansion the city never finished. In 117 CE the ground it stands on was open land between Gerasa and the road to Philadelphia. No emperor had yet come to justify a monument here.",
  },
  "The Sanctuary of Artemis": {
    english: "Sanctuary of Artemis",
    category: "sanctuary",
    extant_117ce: false,
    built: 150,
    description:
      "Not yet built. Artemis was Gerasa's patron long before 117 CE and rode the city's coins, but the great terraced sanctuary that dominates the site today was not begun until after the Jewish revolt of 132-136 and not substantially finished until around 150. In 117 CE her worship most likely had a far smaller shrine somewhere in the city rather than this engineered hilltop precinct.",
  },
  "The Temple of Artemis": {
    english: "Temple of Artemis",
    category: "temple",
    extant_117ce: false,
    built: 150,
    description:
      "Not yet built. Eleven of its 13-meter Corinthian columns still stand, but construction did not begin until after 136 CE and the temple was not substantially complete until around 150 — and its roof may never have been finished even in antiquity. In 117 CE this terrace held no temple at all. The Artemis a Gerasene prayed to under Trajan had a humbler home somewhere in the streets below.",
  },
  "Propylaeum of the Sanctuary of Artemis": {
    english: "Propylaea of Artemis",
    category: "gate",
    extant_117ce: false,
    built: 150,
    description:
      "Not yet built. This monumental gateway and its grand stair, climbing from the Cardo up to the Artemis terrace, carry an inscription fixing completion to 150 CE, thirty-three years after Trajan died; its columns stood some 16 meters tall. In 117 CE this stretch of the main street had no ceremonial gate or processional stair — just the ordinary colonnade, with the whole Artemis complex still decades in the future.",
  },
  "Nymphaeum": {
    english: "Nymphaeum",
    category: "fountain",
    extant_117ce: false,
    built: 191,
    description:
      "Not yet built. Gerasa's grand public fountain, two storeys of marble facing and lion-headed spouts, was finished in 191 CE — seventy-four years after this map is set, under Commodus. In 117 CE the Cardo carried smaller working fountains fed by the city's water supply, but nothing on this scale. The half-domed showpiece visitors photograph belongs to a later, richer Gerasa.",
  },
  "The North Tetrapylon": {
    english: "North Tetrapylon",
    category: "monument",
    extant_117ce: false,
    built: 170,
    description:
      "Not yet built. This four-pillared monument marking where the Cardo met the North Decumanus went up around half a century after Trajan's reign and was later rededicated to Julia Domna, wife of Septimius Severus. In 117 CE the crossing here was an ordinary street junction with nothing to mark it — one more sign that the Gerasa on this map is the plainer city before its 2nd-century boom.",
  },
  "The South Tetrapylon": {
    english: "South Tetrapylon",
    category: "monument",
    extant_117ce: false,
    built: 190,
    description:
      "Not yet built. This four-pillared monument at the crossing of the Cardo and the South Decumanus dates to the very end of the 2nd century, some eighty years past the 117 CE snapshot. In Trajan's day the intersection was a plain street corner. The tetrapylon came only once the Cardo had grown into the grand colonnaded avenue it was not yet in 117.",
  },
  "Umayyad Houses": {
    english: "Umayyad Houses",
    category: "house",
    extant_117ce: false,
    built: 660,
    description:
      "The house standing here belongs to the 8th century, an Umayyad residential block of shops fronting the street and five or six families sharing a courtyard behind, ended by the earthquake of 749. But it was built straight onto Roman foundation walls and out of recycled Roman stone — the crooked shape of its courtyard follows the old grid underneath. In 117 CE this was exactly that: an ordinary residential insula of houses and shops inside the city.",
  },

  // --- The Byzantine churches: all centuries after 117 CE ---
  "The Cathedral": {
    english: "The Cathedral",
    category: "sanctuary",
    extant_117ce: false,
    built: 400,
    description:
      "Not standing in 117 CE, and neither, on current evidence, was what came before it. This church — reached by a monumental stair off the Cardo and dated somewhere between the late 4th and the mid-5th century — was raised on the cut-down podium of a Roman temple, reusing its columns as masonry. That temple was long identified as a sanctuary of Dionysus, but excavation has not confirmed it, and even its construction date is unknown. In Trajan's day this hill may still have been waiting for its first temple.",
  },
  "Church of St. Theodore": {
    english: "Church of St Theodore",
    category: "sanctuary",
    extant_117ce: false,
    built: 496,
    description:
      "Not built until nearly four centuries after this map is set. Begun in 494 and finished in 496 CE under Bishop Aeneas, this three-aisled basilica honored Theodore the soldier-martyr, and its own inscription says plainly that it displaced an older pagan cult on the spot — though it does not name which god. It sits back-to-back with the Cathedral across a shared fountain court. The building collapsed in the great earthquake of 749.",
  },
  "Church of St. Georg": {
    english: "Church of St George",
    category: "sanctuary",
    extant_117ce: false,
    built: 530,
    description:
      "Not built until 529-530 CE, when it was paved with a dedicatory poem set into the floor — the earliest of three churches raised side by side under Bishop Paulos. In 117 CE this ground held no church. Its figural mosaics were later scratched out by iconoclasts, unlike those of its northern neighbor, which survived untouched.",
  },
  "Church of St. John the Baptist": {
    english: "Church of St John the Baptist",
    category: "sanctuary",
    extant_117ce: false,
    built: 531,
    description:
      "Not built until 531 CE, four centuries after Trajan. The middle of the three adjoining churches, it broke from the basilica plan of its neighbors for a round interior set inside a square outer wall. It shared a single western courtyard and porch with the churches of St George and of Saints Cosmas and Damian on either side. None of it existed at the 117 CE snapshot.",
  },
  "Church of St Cosmos & St Damianus": {
    english: "Church of Saints Cosmas and Damian",
    category: "sanctuary",
    extant_117ce: false,
    built: 533,
    description:
      "Not built until 533 CE. The northernmost of the three linked churches, it carries the finest floor at Gerasa — full-length portraits of its donors, the warden Theodore and his wife Georgia, worked into the mosaic among gazelles, hares and peacocks. It is the one figural pavement in the whole city the iconoclasts never reached. In 117 CE this was open ground west of the main street.",
  },
  "Church of St Peter & St Paul": {
    english: "Church of Saints Peter and Paul",
    category: "sanctuary",
    extant_117ce: false,
    built: 540,
    description:
      "Not built until around 540 CE — its floor names Bishop Anastasius but gives no year, so the date rests on his following the bishop of 533. A three-apsed basilica over 31 meters long on high ground near the southwest wall, it was floored with mosaics across nave and aisles. In 117 CE none of it stood; the ground was part of the ordinary city inside the walls.",
  },
  "Church of Bishop Isaiah": {
    english: "Church of Bishop Isaiah",
    category: "sanctuary",
    extant_117ce: false,
    built: 559,
    description:
      "Not built until 558-559 CE, when a mosaic inscription named its founder, Bishop Isaiah. The church was raised almost entirely from recycled Roman material — its aisles were divided by Ionic columns lifted straight from the North Decumanus, the city's own cross-street. It stood until the earthquake of 749. In 117 CE the street it later cannibalized was still carrying traffic.",
  },
  "Church of Procopius": {
    english: "Church of Procopius",
    category: "sanctuary",
    extant_117ce: false,
    built: 527,
    description:
      "Not built until 526-527 CE, four centuries past this map's date. Its mosaic names Bishop Paulos, a deacon named Saola who helped pay for it, and the supervisor Procopius, whom the modern name remembers. The basilica had three parallel apses and good mosaics in both side chapels; the panel from its south aisle now hangs in a museum in the United States. In 117 CE this southeast quarter held no church.",
  },
  "The Church of the Propylaea": {
    english: "Church of the Propylaea",
    category: "sanctuary",
    extant_117ce: false,
    built: 565,
    description:
      "Not built until 565 CE, and doubly out of place on a 117 CE map: it was inserted into the colonnaded plaza that formed the ceremonial approach to the Artemis sanctuary — and that whole processional way is itself mid-2nd-century, decades in the future when Trajan died. In 117 CE this was open ground on the approach to the river crossing, with neither the pagan plaza nor the church that later ate it.",
  },
  "Church of Bishop Genesius": {
    english: "Church of Bishop Genesius",
    category: "sanctuary",
    extant_117ce: false,
    built: 611,
    description:
      "Not built until 611 CE — the latest dated church at Gerasa, finished just a few years before the Persian invasion of 614. Its mosaic names the sitting bishop, Genesius, and it was raised over the floor of a still-earlier church, so even its own foundation is a replacement. In 117 CE, half a millennium earlier, this ground was part of the pagan Roman city.",
  },
  "Synagogue Church": {
    english: "Synagogue-Church",
    category: "synagogue",
    extant_117ce: false,
    built: 400,
    description:
      "Neither building here existed in 117 CE. A synagogue rose on this spot in the 4th or 5th century, its floor laid with a rare mosaic of the animals leaving Noah's ark and a Hebrew blessing on all Israel. In 530-531 CE, under Justinian's anti-Jewish laws, it was seized and turned into a church: the orientation was reversed toward the east, the western colonnade torn down for an apse, and a plain new mosaic laid straight over the ark scene — which is why it survived.",
  },
  "Martyrion Church": {
    english: "Martyrion Church",
    category: "sanctuary",
    extant_117ce: false,
    description:
      "A Byzantine martyr shrine near the southwest wall, its name taken from a burial cave cut into the slope on its south side. No dated inscription survives to pin its founding, but it belongs with the cluster of 6th-century churches around it, some four centuries after this map is set. In 117 CE this was ordinary ground inside the Roman city.",
  },
  "Mortuary Church": {
    english: "Mortuary Church",
    category: "sanctuary",
    extant_117ce: false,
    description:
      "A late church on the western high ground, grouped with the church of Saints Peter and Paul. It carries no securely dated inscription; it belongs somewhere in the last stretch of Byzantine Gerasa, before the earthquake of 749 brought the city's churches down. Whatever it was, it was many centuries younger than the 117 CE city this map shows.",
  },
  "The Baths of Placcus": {
    english: "Baths of Placcus",
    category: "bath",
    extant_117ce: false,
    built: 455,
    description:
      "Not built until 454-455 CE, by order of Bishop Placcus, whose Greek dedication survives on architrave blocks in the courtyard. Around 800 square meters, it was raised out of the dismantled Sanctuary of Zeus — a Christian bathhouse physically built from a pagan temple. A second inscription records its restoration in 584. In 117 CE none of this stood; the Zeus sanctuary whose stone it later reused was itself only a small hilltop shrine.",
  },
};

/** Look up a matching description for an OSM building name. */
export function jerashEntry(name: string | null | undefined): JerashEntry | undefined {
  if (!name) return undefined;
  const keys = Object.keys(JERASH_LOOKUP).sort((a, b) => b.length - a.length);
  const nlow = name.toLowerCase();
  for (const k of keys) {
    if (nlow.includes(k.toLowerCase())) return JERASH_LOOKUP[k];
  }
  return undefined;
}
