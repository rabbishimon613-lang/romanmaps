/** Guided tours — an ordered walk through places already on the map, each stop framed by one
 * linking sentence here. A stop never invents new facts; the full description for a "poi" stop
 * comes from its real pois.geojson record (via the existing Place details panel), and "station"/
 * "event"/"person" stops show their own already-sourced `notes`/`one_line` inline in the player,
 * fetched at tour-open time — this file supplies only the sequence and the connective narration.
 *
 * `kind` decides where a stop's data lives:
 *  - "poi"     → public/data/pois.geojson, opens the full Place details panel on select.
 *  - "station" → public/data/road_stations.geojson (mansio/mutatio/statio/vicus).
 *  - "event"   → public/data/events_117.geojson.
 *  - "person"  → public/data/people_117.geojson. */

export type TourStopKind = "poi" | "station" | "event" | "person";

export type TourStop = {
  kind: TourStopKind;
  id: string;
  caption: string; // one linking sentence, this tour's own narration
};

export type Tour = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  distanceNote: string;
  stops: TourStop[];
};

export const TOURS: Tour[] = [
  {
    slug: "via-appia",
    title: "Via Appia",
    subtitle: "Rome to Brundisium, 360 Roman miles",
    description:
      "The Queen of Roads, begun in 312 BCE by the censor Appius Claudius Caecus and finished under Trajan with a fresh extension to Brundisium. Walk it stop by stop, from the tomb-lined approach south of Rome to the harbor where travelers embarked for Greece.",
    distanceNote: "360 Roman miles · 31 stops",
    stops: [
      { kind: "poi", id: "poi_tomb_scipios", caption: "The road out of Rome passed straight through a cemetery — burial inside the city walls was forbidden, so the wealthy built along the highway instead. The Scipios, conquerors of Carthage, got there first." },
      { kind: "poi", id: "poi_columbaria_vigna_codini", caption: "A few steps further, whole apartment blocks for cremated ash urns — space bought in bulk by burial clubs for freedmen and slaves who couldn't afford tombs of their own." },
      { kind: "poi", id: "poi_tomb_cecilia_metella", caption: "Three miles out, the road's most famous monument: a drum-shaped tower tomb for a consul's daughter-in-law, built so massively it would later be fortified as a medieval castle." },
      { kind: "poi", id: "poi_mausoleum_casal_rotondo", caption: "The largest tomb on the whole road — a circular drum nearly 40 meters across, its owner's name lost even in antiquity." },
      { kind: "poi", id: "poi_torre_selce", caption: "A tower tomb standing alone in the Roman campagna, visible for miles across the flat volcanic plain the road was built to cross." },
      { kind: "station", id: "station_bovillae", caption: "Eleven miles from Rome, the first real stop — an old Latin town the Julian family kept close ties to, claiming descent from its founders." },
      { kind: "station", id: "station_aricia", caption: "A steep descent into the crater-lake town of Aricia, ringed by the sacred grove of Diana Nemorensis just off the road." },
      { kind: "station", id: "station_tres_tabernae", caption: "\"Three Taverns\" — a roadside junction plain enough that its whole identity was three inns, exactly as blunt as the name suggests." },
      { kind: "station", id: "station_forum_appii", caption: "Forty-three miles out, a canal town built at the head of a barge-cut through the Pontine Marshes — noisy, overpriced, and unforgettable to every traveler who wrote about it." },
      { kind: "station", id: "station_terracina_anxur", caption: "The road finally meets the sea, climbing a cliff town with a temple to Jupiter Anxur commanding the whole coastline." },
      { kind: "station", id: "station_fundi", caption: "A wine town on the coastal plain, its vintage well known enough in Rome to be worth a line in the poets." },
      { kind: "station", id: "station_formiae", caption: "A resort stop with villas overlooking the bay — Cicero owned one here, and was murdered near it." },
      { kind: "station", id: "station_minturnae", caption: "A river-crossing town at the Liris, with its own amphitheater and a bridge the road still depends on." },
      { kind: "station", id: "station_sinuessa", caption: "The last stop in Latium, known for its mineral springs — a spa break before the road turns inland toward Campania." },
      { kind: "station", id: "station_pons_campanus", caption: "A bridge crossing marking the entry into Campania's rich farmland." },
      { kind: "station", id: "station_ad_octavum", caption: "A minor changing-post, eight miles from the next major town — its whole name is just that distance." },
      { kind: "station", id: "station_casilinum", caption: "A river town on the Volturnus, at the edge of Capua's fertile plain." },
      { kind: "station", id: "station_calatia", caption: "A small station between Capua and Caudium, on the stretch the road takes instead of detouring through Capua itself." },
      { kind: "station", id: "station_caudium", caption: "The town beside the infamous Caudine Forks, where a Roman army was trapped and humiliated by the Samnites four centuries earlier — old history, but every traveler on this road knew the story." },
      { kind: "station", id: "station_ad_calorem", caption: "A crossing of the river Calor, on the climb into the Apennine hill country." },
      { kind: "station", id: "station_aeclanum", caption: "A hill town controlling the pass into Samnium's interior, prosperous enough to mint its own coins before Rome absorbed it." },
      { kind: "station", id: "station_sub_romula", caption: "A minor way-station on the long haul across the mountains toward Apulia." },
      { kind: "station", id: "station_pons_aufidi", caption: "A bridge over the river Aufidus — the same river that ran red at Cannae, two centuries before, a few miles downstream." },
      { kind: "station", id: "station_venusia", caption: "The poet Horace's hometown, a substantial colony on the road's long stretch across Apulia's plains." },
      { kind: "station", id: "station_silvium", caption: "A hill station on the ridge road across inland Apulia, exposed to whatever weather the plateau had that day." },
      { kind: "station", id: "station_blera_apulia", caption: "A waypoint deep in Apulia's sheep country, part of the same transhumance landscape as the grazing corridors nearby." },
      { kind: "station", id: "station_sub_lupatia", caption: "Another Apulian stop on the final descent toward the heel of Italy." },
      { kind: "station", id: "station_canales", caption: "A station on the last stretch before the road reaches the coast at Tarentum." },
      { kind: "station", id: "station_tarentum", caption: "The old Greek city of Taras, once the largest in Magna Graecia — the Appia's most important stop between Rome and the coast." },
      { kind: "station", id: "station_uria", caption: "A small town on the final leg across the heel of Italy toward the crossing point." },
      { kind: "station", id: "station_brundisium", caption: "Journey's end — the great harbor where the Via Appia met the sea, and where every traveler bound for Greece, Macedonia, or the East boarded a ship." },
    ],
  },
  {
    slug: "day-in-ostia",
    title: "A Day in Ostia",
    subtitle: "Rome's port, one walk through its streets",
    description:
      "Ostia Antica at its commercial peak under Trajan — warehouses, baths, a working synagogue, and a forum still under construction. A single day's walk from the city gate to the sea, past the buildings that made the port run.",
    distanceNote: "13 stops · ~2km on foot",
    stops: [
      { kind: "poi", id: "poi_ostia_porta_romana", caption: "Arrival from Rome: the city's grandest gate, the first thing anyone walking or riding down the Via Ostiensis would see." },
      { kind: "poi", id: "poi_ostia_decumanus_maximus", caption: "Straight through the gate onto the decumanus maximus, the paved high street running the length of the city, worn smooth by cart traffic." },
      { kind: "poi", id: "poi_ostia_piazzale_corporazioni", caption: "A colonnaded square where shipping firms from across the Mediterranean advertised their trade in black-and-white floor mosaics — Ostia's answer to a trading floor." },
      { kind: "poi", id: "poi_ostia_theatre", caption: "Behind the square, the city's theatre, first built under Augustus and still seating a few thousand for an afternoon's entertainment." },
      { kind: "poi", id: "poi_ostia_baths_neptune", caption: "Just past the theatre, a bath block still mid-construction in 117 — its famous Neptune mosaics are a couple of decades off yet." },
      { kind: "poi", id: "poi_ostia_grandi_horrea", caption: "The Great Warehouse, one of the largest grain stores in the port — this building, more than any temple, is why Ostia existed." },
      { kind: "poi", id: "poi_ostia_forum", caption: "The civic heart of the city, flanked by its main temples and the seat of local government." },
      { kind: "poi", id: "poi_ostia_capitolium", caption: "On the forum's north side, the city's main temple to Jupiter, Juno and Minerva — under construction now, its 17-meter brick core will outlast nearly everything around it." },
      { kind: "poi", id: "poi_ostia_temple_rome_augustus", caption: "Facing the Capitolium across the forum, the older temple to Rome and the deified Augustus, dedicated when the imperial cult was still new." },
      { kind: "poi", id: "poi_ostia_horrea_hortensius", caption: "A second, older warehouse complex a few streets over, named for the family that built it — one of many private storage operations feeding Rome." },
      { kind: "poi", id: "poi_ostia_synagogue", caption: "South toward the coast, one of the oldest synagogues anywhere in the Roman world — Ostia's Jewish community had its own congregation and its own building." },
      { kind: "poi", id: "poi_ostia_terme_porta_marina", caption: "Near the old shoreline, a smaller bath complex serving the neighborhood by the sea gate." },
      { kind: "poi", id: "poi_ostia_porta_marina", caption: "The day ends at the sea gate, where the city opened onto the beach — the coastline has since silted three kilometers further out, but in 117 the waves were right here." },
    ],
  },
  {
    slug: "new-in-117",
    title: "What Was New in 117",
    subtitle: "Trajan's last decade, place by place",
    description:
      "The empire's news of the year, mapped. An aqueduct, a forum, a gold rush, a captured Persian capital, and finally the emperor's own death — Trajan's reign told through what was freshly built, freshly conquered, or freshly lost the moment this map is set.",
    distanceNote: "12 stops · 109–117 CE",
    stops: [
      { kind: "event", id: "event_aqua_traiana_opened", caption: "109 CE: a brand-new aqueduct starts delivering spring water from Lake Bracciano into Trastevere — the newest of Rome's water supplies at our snapshot." },
      { kind: "poi", id: "poi_baths_trajan", caption: "The same year, a monumental new bath complex opens on the Esquiline, built over the ashes of Nero's old Golden House." },
      { kind: "event", id: "event_trajans_forum_markets_dedicated", caption: "112 CE: the largest forum Rome had ever built, paid for with Dacian War plunder, opens with a multi-level market wrapped around it." },
      { kind: "event", id: "event_trajans_column_dedicated", caption: "113 CE: a 30-meter marble column, its spiral relief telling the whole Dacian War in stone, is dedicated at the new forum's edge." },
      { kind: "poi", id: "poi_portus_trajani_hexagon", caption: "The same year, downriver at Portus, a new hexagonal harbor basin opens — Rome's grain supply finally gets a port big enough for it." },
      { kind: "event", id: "event_dacia_sarmizegetusa_colonia", caption: "A new Roman colony rises on the site of the Dacian capital Rome had just destroyed — the empire's rawest frontier, barely a decade old." },
      { kind: "event", id: "event_dacia_alburnus_maior_gold", caption: "Up in the Carpathian hills nearby, Roman miners are working one of the richest gold rushes the empire has ever seen." },
      { kind: "event", id: "event_nabataea_bostra_capital", caption: "106 CE: the last independent kingdom on Rome's eastern edge, Nabataea, is annexed without a fight and its city Bostra made a Roman provincial capital." },
      { kind: "event", id: "event_parthian_ctesiphon_capture", caption: "116 CE: Trajan reaches further east than any Roman emperor before or since, capturing the Parthian capital Ctesiphon itself." },
      { kind: "event", id: "event_parthian_collapse_117", caption: "By 117 the conquest is already unraveling — revolts break out behind Roman lines and the new eastern province cannot be held." },
      { kind: "person", id: "person_trajan", caption: "11 August 117: word reaches Antioch that the emperor has died at Selinus, on the coast of Cilicia, worn out on the journey home. This is the moment this whole map is set." },
      { kind: "event", id: "event_hadrian_acclamation_antioch", caption: "The same day, in Antioch, the army acclaims Hadrian emperor before the news has even reached Rome. A new reign starts the instant the old one ends." },
    ],
  },
];
