/** Explainer hubs — [14-P2-8]. Five standalone, server-rendered essay pages that give a reader
 * context the interactive map can't: why the roads mattered, what the army looked like, why
 * 11 August 117 CE is the map's fixed date, how money and goods moved, and where the empire's
 * many religions stood. Each hub's supporting lists are pulled live from data already shipped
 * (`public/data/*.geojson`, `app/legions.ts`) at build time in `app/hub/[slug]/page.tsx` — no
 * new atomic research here, just a reading path into content that otherwise only surfaces one
 * marker at a time on the map. Mirrors `app/provinces.ts` + `app/province/[slug]/page.tsx`'s
 * split between a small hand-written registry and a page that aggregates real data around it.
 */

export type Hub = {
  slug: string;
  title: string;
  dek: string;
  /** 3-5 paragraphs of scene-setting prose, Google-Business-listing voice throughout — past
   * tense, active voice, concrete numbers, no hedging, no inline citations. General reference
   * works used across all five hubs are listed once in `HUB_GENERAL_SOURCES` below; a hub's own
   * `sources` covers anything more specific to its own claims. */
  intro: string[];
  sources: string[];
};

export const HUB_GENERAL_SOURCES = [
  "CAH XI, The High Empire, 70–192 CE (Cambridge Ancient History, 2nd ed.)",
  "Fergus Millar, The Roman Near East, 31 BC–AD 337",
  "Barrington Atlas of the Greek and Roman World",
];

export const HUBS: Hub[] = [
  {
    slug: "roman-roads",
    title: "The Roman Road Network",
    dek: "How the empire's 80,000 miles of paved roads actually worked, station by station.",
    intro: [
      "By 117 CE the empire ran on roughly 80,000 miles of built road, engineered to a standard that let a courier cover 50 Roman miles in a day and a laden ox-cart move without breaking an axle. Distances were measured in Roman miles (mille passus, \"a thousand paces,\" about 1,480 modern meters) and marked by milestones (miliaria) that gave the distance to the nearest city and, often, which emperor had paid for the surface.",
      "The roads were built for the army first and everyone else second. A legion on the march needed a graded, drained surface it could keep moving on in any weather, and the empire's core network — the Via Appia south from Rome, the Via Egnatia across the Balkans to the Bosphorus, the Via Domitia through southern Gaul to Spain — began as conquest roads before they became trade and travel corridors.",
      "Every 12 to 18 Roman miles or so, the road met a mansio — a staging post with stabling, a change of horses for the state courier system (the cursus publicus), and rooms for travelers with the right permit (a diploma, issued by the provincial governor's office). Smaller mutationes in between offered only a horse change, no beds. A private traveler without a diploma paid for the same amenities at a roadside inn (caupona) instead.",
      "Below, every road station on the map with a name and a source is grouped by road. Most come from the Antonine Itinerary (Itinerarium Antonini), a Roman-era route gazetteer compiled around 300 CE from older imperial records — it lists each stage of a journey with the distance to the next stop, exactly the way a modern driving-directions app would, just for a road network that was already centuries old by the time it was written down.",
    ],
    sources: [
      "Itinerarium Antonini (Antonine Itinerary)",
      "Raymond Chevallier, Roman Roads",
      "Ray Laurence, The Roads of Roman Italy",
    ],
  },
  {
    slug: "roman-army",
    title: "The Roman Army in 117 CE",
    dek: "28 legions, hundreds of auxiliary units, and the household troops guarding Rome itself.",
    intro: [
      "In 117 CE the Roman army stood at roughly 380,000 men under arms: 28 legions of Roman citizens, each about 5,500 strong, plus a roughly equal number again in auxiliary cohorts and cavalry alae recruited from the provinces. Trajan had just raised a new legion, II Traiana Fortis, for the Parthian campaign that was collapsing as this map's snapshot date arrived — the first legion added to the standing establishment in decades.",
      "Every legion had a fixed home base, a castra legionis built to hold roughly 5,000 men behind earth-and-timber or stone walls, and most of those bases sat directly on a frontier: the Rhine, the Danube, the edge of the Syrian desert, the hills of northern Britain. A legion's name carried its own history — Legio X Fretensis (\"of the strait\") for the crossing that took it into the war against Judaea, Legio III Cyrenaica for a province it had garrisoned since Augustus.",
      "Rome itself was garrisoned separately. The Praetorian Guard — about 10,000 men in ten cohorts, barracked at the Castra Praetoria on the city's northeast edge — protected the emperor's person and, more than once in the previous century, decided who the emperor would be. Smaller forces handled everyday order: the urban cohorts policed the city itself, and the vigiles, organized like a fire brigade crossed with a night watch, covered Rome's fourteen regions from guardhouses spread across the city.",
      "The map below groups the 28 legionary fortresses by province, each one linked to its own place card with the fortress's Latin name and modern location, plus Rome's household troops — the Praetorian barracks, the urban cohorts, and the equites singulares Augusti, the emperor's mounted bodyguard.",
    ],
    sources: [
      "Emil Ritterling, \"Legio\" (Realencyclopädie der classischen Altertumswissenschaft, 1924-25)",
      "Yann Le Bohec, The Imperial Roman Army",
      "Public data: app/legions.ts, public/data/politics.geojson",
    ],
  },
  {
    slug: "117-ce",
    title: "11 August 117: The Day the Empire Peaked",
    dek: "Why this map is frozen on one day, and what was actually happening across the empire that day.",
    intro: [
      "Every place on this map is shown as it stood on 11 August 117 CE — the day the emperor Trajan died at Selinus in Cilicia, on the southern coast of modern Turkey, and the day the legions at Antioch acclaimed his cousin and ward Hadrian as his successor. Rome's territory had just reached its largest extent it would ever hold: from Britain's northern frontier to the edge of the Sahara, from the Atlantic coast of Spain to a province of Mesopotamia that Trajan's own conquests had carved out of Parthia only a year before.",
      "Trajan had left Rome in 113 CE to fight Parthia over control of Armenia, and by 116 his armies had taken the Parthian capital Ctesiphon and pushed a fleet down the Tigris to the Persian Gulf — the farthest east a Roman army ever operated. By early 117, revolts across the newly won territory and a wave of Jewish uprisings from Cyrenaica to Mesopotamia (the Kitos War) were unwinding those gains faster than Trajan's generals could hold them. Ill and worn out, Trajan started home, got only as far as Selinus, and died there — the succession decided, by his widow Plotina's own account, in his final hours.",
      "Hadrian did not attend the death. He was already governing Syria from Antioch, and it was there, two days later, that word reached him and the legions declared him emperor before the Senate in Rome had even been formally told. He would spend his first year as emperor undoing much of what his predecessor had just finished — abandoning Mesopotamia and Armenia as indefensible, and turning the empire's posture from conquest to consolidation for good.",
      "Below is a sample of who else was alive and where they stood that same week — soldiers, philosophers, provincial governors, ordinary people caught up in the Kitos War — plus the year's other dated events, from the earthquake that nearly killed Trajan at Antioch two years earlier to the new colonies still being planted in conquered Dacia.",
    ],
    sources: [
      "Cassius Dio, Roman History, book 68",
      "Historia Augusta, Life of Hadrian",
      "Public data: public/data/people_117.geojson, public/data/events_117.geojson",
    ],
  },
  {
    slug: "trade-economy",
    title: "Trade, Coinage & the Roman Economy",
    dek: "How goods and money actually moved around a sea the Romans called their own.",
    intro: [
      "The Mediterranean was, in the most literal sense, an internal Roman lake by 117 CE — mare nostrum, \"our sea\" — and the empire's economy ran on that fact. Grain grown in Egypt and North Africa fed Rome's roughly one million residents; wine and oil moved the other way from Italy, Spain, and Gaul; and luxury goods — silk from China, pepper from India, incense from Arabia — arrived through a relay of middlemen that started well outside Rome's own borders.",
      "Coinage held the whole system together. The mint at Rome struck the gold aureus and silver denarius that circulated empire-wide, but running a currency at that scale from one city was impractical, so provincial mints struck their own coin under license — Antioch's silver tetradrachms paid the legions fighting Parthia, Alexandria ran a closed currency system that didn't circulate outside Egypt at all, and something like 120 smaller civic mints across Asia Minor and the Levant struck their own bronze small change for local use.",
      "Shipping followed the seasons, not the calendar: the sailing season (mare apertum) ran roughly May to September, when Mediterranean weather was predictable enough to risk an open-water crossing; from November to March (mare clausum) most captains kept their ships in harbor. A grain convoy from Alexandria to Puteoli or Portus, sailing with the summer Etesian winds, made the return trip against them — Pliny the Younger complained that ships bound for Rome in the wrong season could take two months for a crossing that should take three weeks.",
      "Below: the empire's mints, and a sample of the specific trade routes already mapped — the Amber Road down from the Baltic, the Silk Road's Roman leg out of Antioch and Palmyra, the grain lanes that fed Rome itself.",
    ],
    sources: [
      "Roman Imperial Coinage (RIC), vol. II (Trajan)",
      "Pliny the Younger, Letters",
      "Public data: public/data/mints.geojson, public/data/trade_routes.geojson",
    ],
  },
  {
    slug: "religion-belief",
    title: "Religion & the Sacred Landscape",
    dek: "A polytheist empire that absorbed local gods faster than it exported its own.",
    intro: [
      "Rome in 117 CE did not have an official state religion in the modern sense so much as a state cult layered over hundreds of local ones. Every city kept its own patron gods and civic priesthoods alongside whatever temples Rome itself required — chiefly the imperial cult, the formal worship of deified emperors (divi) and, in the provinces, of Roma and Augustus together, administered by a provincial high priest and centered on one designated temple per province.",
      "Local religion ran far deeper than the imperial overlay. Egyptian temples at Karnak and Philae kept performing the same rites they had for two thousand years, now under Roman imperial patronage instead of a pharaoh's. Druidic practice, officially banned under Claudius, persisted in remote parts of Gaul and Britain. Jewish communities were established across the empire from Alexandria to Rome's own Trastevere district — Alexandria's alone may have made up a third of that city's population before the Kitos War devastated it in the very years this map is set.",
      "Newer cults were spreading fast along exactly the trade and army routes covered elsewhere on this map. The Egyptian goddess Isis had temples from Pompeii to Rome to the Danube frontier. Small Christian communities were attested in Rome, Antioch, Corinth, Ephesus, and enough towns in Pontus and Bithynia that the governor Pliny the Younger wrote to Trajan around 112 CE asking how to handle the sheer number of people denouncing themselves as believers — the earliest outside account of Christian practice to survive.",
      "Below: the empire's provincial imperial-cult centers, and the religious communities so far mapped by tradition and by how firmly each is attested for the year 117 itself.",
    ],
    sources: [
      "Pliny the Younger, Letters 10.96-97 (to Trajan, on the Christians of Bithynia)",
      "S.R.F. Price, Rituals and Power: The Roman Imperial Cult in Asia Minor",
      "Public data: public/data/religions_117.geojson, public/data/imperial_cult.geojson",
    ],
  },
];
