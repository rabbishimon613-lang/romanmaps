# Roman Maps — Shift Brief

**The project.** Roman Maps is a Google-Maps-style web app of the Roman Empire at its peak (**117 CE**, Trajan's death — maximum territorial extent). One frozen snapshot in time, not a timeline. Live at https://romanmaps.vercel.app. Stack: Next.js + MapLibre GL, deployed on Vercel, data as GeoJSON in `public/data/`.

---

## Where we are (2026-08-12)

**40 archaeological sites live** with street-level detail (buildings + park paths from OSM). They render on click from the Explore panel (60px dark left rail → compass icon). Ostia has 44 hand-curated Google-Business-style building descriptions; the other 39 cities still use OSM names only.

Empire-level layers already live: land polygons (Natural Earth), coastlines, provinces (dashed), rivers, lakes, main + secondary Roman roads (from Itiner-e / DARE / Pelagios), gazetteer of ancient places, category-filtered POI pill markers.

**The current 40 sites** — you can grep them from `app/sites.ts::SITES[]`, but at time of writing:
Ostia · Pompeii · Herculaneum · Ephesus · Timgad · Djemila · Volubilis · Leptis Magna · Sabratha · Jerash · Palmyra · Baalbek · Rome · Aquincum · Carnuntum · Vindolanda · Trier · Xanten · Corinth · Athens · Delphi · Mérida · Italica · Aquileia · Verona · Ravenna · Portus · Tivoli · Palestrina · Puteoli · Baiae · Cumae · Capua · Beneventum · Paestum · Brescia · Milan · Rimini · Ancona · Luni.

## Where we're going — six parallel expansion axes

Every shift picks ONE axis (and often ONE sub-category inside it) and pushes it forward. Don't try to touch multiple axes in one shift; don't try all sub-categories inside one axis in one shift. **Depth beats breadth.**

The six axes:
1. **More cities**
2. **Sites along the roads**
3. **Micro-level POIs** (9 sub-categories: military, sacred, economic, villae, tombs, water, games, battlefields, shipwrecks)
4. **The living empire in 117 CE** (people, events, ongoing wars, political moment)
5. **Peoples, cultures, client states** (language belts, ethnic groups, non-Roman neighbors)
6. **Systems overlay** (trade routes, intellectual centers, religious communities, natural landmarks)

### Axis 1 — MORE CITIES beyond the current 40

We want another 60+ cities added over the coming shifts. Hunt them yourself. Sources:

- **Wikipedia "List of Roman sites in [country]"** — every European + Mediterranean country has one; each row is a candidate.
- **Pleiades** (pleiades.stoa.org) filtered by feature type "settlement" — the definitive gazetteer.
- **Barrington Atlas of the Greek and Roman World** — the map-plate index lists thousands of settlements by province. The `topostext.org` index is a searchable proxy.
- **DARE (Digital Atlas of the Roman Empire)** — has settlement categories.
- **Talbert 2000 (Barrington Atlas) directory** — every named place with coords.
- **Wikimedia Category:Archaeological sites of [province]** — surfaces sites with excavated remains that OSM will actually have building outlines for.

**What makes a city worth adding:** archaeological remains visible on OSM at zoom 16+ (means the Overpass fetch will actually return outlines) OR the site is famous enough that its bbox will hit modern buildings on top of the ancient core. If OSM returns fewer than ~30 named buildings/monuments for a bbox, the site's page will look empty — skip or note in log.

**The playbook to add a city** is in `research/italia_batch.py`. Read it, then extend it (or spawn a `<region>_batch.py` sibling) with new bbox rows. Rerun. It appends to the merged `sites_buildings.geojson` + `sites_streets.geojson` idempotently and updates `sites_index.json`. Also add a row to `app/sites.ts::SITES[]` with Roman province name (117 CE!), founding, one-line blurb (Google-Business voice, see below).

Regional queue in rough priority: **Gallia** (Nemausus/Nîmes, Arelate, Lugdunum, Vienne, Autun, Reims, Narbo, Massilia, Fréjus, Saintes) → **Britannia** (Londinium, Aquae Sulis, Colchester, York, Chester, Silchester, Wroxeter, St Albans) → **Hispania** (Tarraco, Segovia, Barcino, Corduba, Conimbriga, Cartagena, Zaragoza) → **Germania + Rhine** (Cologne, Mainz, Bonn, Regensburg) → **Balkans + Danube** (Salona, Split, Viminacium, Serdica, Naissus, Sirmium, Butrint) → **Greece & Aegean** (Thessaloniki, Nicopolis, Olympia, Mycenae, Sparta, Aegina) → **Asia Minor** (Pergamon, Aphrodisias, Hierapolis, Miletus, Sardis, Antalya, Nicaea, Nicomedia) → **Levant** (Beirut, Tyre, Sidon, Caesarea Maritima, Bosra) → **Egypt & Cyrenaica** (Alexandria, Karanis, Cyrene, Apollonia) → **North Africa** (Carthage, Utica, Dougga, Bulla Regia).

### Axis 2 — SITES ALONG THE ROADS (mansiones, mutationes, road stations)

The Roman road network was punctuated with staging posts. **These matter as much as the cities** — they're what made the empire logistically real. They exist in the historical record but haven't been added to the map yet.

**Where to find them:**

- **Antonine Itinerary** (`Itinerarium Antonini`, c. 300 CE but records stations that existed under Trajan) — full text on LacusCurtius. Every entry is: FROM → TO with intermediate mansiones and their distances in Roman miles.
- **Peutinger Table** (Tabula Peutingeriana, 13th-c. copy of a Roman original) — pictorial road map. High-res available at Wikimedia. Reads left-to-right, road-by-road; each named vignette is a mansio or mutatio.
- **Bordeaux Itinerary** (Itinerarium Burdigalense, 333 CE) — pilgrimage route Bordeaux→Jerusalem, lists every stop.
- **Ravenna Cosmography** (c. 700 CE) — encyclopedic gazetteer.
- **Vindolanda tablets, Vindonissa tablets** — mention specific stations by name.
- **Milestones (miliarium)** — 8,000+ known Roman milestones physically survive. Each pins a Roman road within 1500m. Corpus is in the Epigraphik-Datenbank Clauss-Slaby (EDCS) — searchable.

**How to add them:**

1. Pick a road: Via Appia, Via Egnatia, Via Domitia, Via Augusta, Via Traiana Nova, Via Agrippa. One road per shift.
2. Read the Itinerary section for that road. Extract every station name + distance.
3. Cross-reference with Pleiades to find modern coordinates (most stations are identified by scholars). Where unidentified, put a `confidence: "low"` point along the known road path at the correct distance from the last known station.
4. Add features to `public/data/road_stations.geojson` (create if missing). Schema:

```json
{"type":"Feature","geometry":{"type":"Point","coordinates":[LNG,LAT]},
 "properties":{
   "id":"station_ad_medias",
   "category":"mansio",   // mansio | mutatio | statio | milestone | vicus
   "name":"Ad Medias",
   "road":"Via Appia",
   "distance_from_previous_mp":16,     // Roman miles from prior named station
   "identified":true,                   // false = "somewhere on this stretch"
   "notes":"Overnight halt with imperial post horses. Mentioned by Antonine Itinerary 108.4.",
   "sources":["Itin. Ant. 108.4","https://pleiades.stoa.org/places/XXXX"],
   "confidence":"high|medium|low"
 }}
```

5. Wire a `road-stations` layer in `app/Map.tsx` — small square markers, dim gray, no pin, tooltip with name + road + distance.

Target for a shift: **one entire road** with all its stations, or **50+ stations** across several roads.

### Axis 3 — MICRO-LEVEL POIs (not cities, not road stations)

Below city level, above road-station level. Real archaeological sites, one point each, that populate the map between the cities and along the roads. These are what make the empire feel *lived-in* on the map.

Below is the full hunting list — nine sub-categories, roughly ordered by how much they'd change the map right now. Pick ONE sub-category per shift and go deep. Don't dabble across all nine.

#### 3a — Military infrastructure

The 117 CE army has ~28 legions plus roughly twice that in auxiliary units. Each of those units has a fixed base. Also frontier lines, signal towers, naval bases.

- **Legionary fortresses (castra legionis).** 28 in 117 CE — every legion had one. Examples: II Augusta at Isca Silurum (Caerleon), XX Valeria Victrix at Deva (Chester), VI Ferrata at Judea, III Cyrenaica at Bostra, X Fretensis at Aelia Capitolina area. Full list is on Wikipedia + Ritterling's *Legio* article (1925, still the reference).
- **Auxiliary forts.** Hundreds. Concentrate on frontier zones — Hadrian's Wall is being planned (not built until 122) but many pre-existing forts on that line already existed (Vindolanda is one, already in). Rhine limes: Saalburg, Zugmantel, Kapersburg. Danube limes: Regensburg (Castra Regina, Trajanic), Aquincum (in), Carnuntum (in), Viminacium. Fossatum Africae is Trajanic so it's fresh.
- **Signal towers (burgi / turres).** Chains of watchtowers between forts. Well-documented on Hadrian's Wall line pre-wall, on the Rhine, and in Wales.
- **Naval bases (classis stations).** Misenum (Classis Misenensis), Ravenna (in, Classis Ravennas), Forum Iulii/Fréjus (Classis Gallica), Alexandria (Classis Alexandrina), Seleucia Pieria (Classis Syriaca), Boulogne (Classis Britannica), Cologne (Classis Germanica). Each has excavated harbor works.
- **Frontier lines as continuous features.** Fossatum Africae (Trajanic), Limes Germanicus (extended by Domitian, still going in 117), Dacian ripa (Trajan just built it 105–117 — brand new). Draw as `LineString` in a new `frontiers.geojson`.

#### 3b — Sacred sites beyond city temples

Every big temple in a city already gets picked up by the city Overpass fetch. What we're missing: rural sanctuaries, oracles, healing shrines, sacred groves.

- **Panhellenic sanctuaries.** Olympia (Zeus, games), Nemea (Zeus, games), Isthmia (Poseidon, games), Delphi (in as city), Dodona (Zeus oracle in Epirus), Nikopolis' Actia. Pausanias catalogs every one.
- **Oracles.** Claros (near Colophon), Didyma (near Miletus), Siwa (Ammon, in Egyptian desert — Alexander visited), Praeneste (already in as city, Fortuna).
- **Healing sanctuaries (Asklepieia).** Epidaurus, Pergamon (in as city), Kos, Corinth (in). Include drinking basins, sleep halls (abaton), snake pits.
- **Rural sanctuaries.** Apollo Grannus at Grand (Gaul), Sequana at Fontes Sequanae (river-source shrine), Nemi (Diana Nemorensis, lakeshore grove south of Rome), Sulis Minerva at Aquae Sulis/Bath, Nodens at Lydney.
- **Mystery cult sites.** Eleusis (Demeter mysteries, still active), Samothrace (Great Gods).
- **Egyptian temples still functioning in 117 CE** — Karnak, Luxor, Philae, Dendera, Edfu. All operational under Roman imperial patronage.
- **Punic/Semitic sanctuaries absorbed by Rome** — Tophet at Carthage, Hierapolis Bambyce (Atargatis), Tyre (Melqart/Herakles).

**Careful with Mithraea.** Mithraism peaked 2nd–3rd century. A handful of Mithraea existed by 117 (Sidon, one in Rome, possibly Ostia's earliest) but most on the map today are 130+. Log carefully.

#### 3c — Economic infrastructure

Mines, quarries, factories, imperial estates. The dots that show how the empire made its money.

- **Mines.** Rio Tinto (Iberian silver/copper — huge Roman operation), Las Médulas (León, gold, worked with hydraulic mining Pliny describes), Alburnus Maior (Roșia Montană in Dacia, gold — Trajan grabbed it after conquest), Wadi Faynan (Jordan, copper), Wroxeter/Halkyn (Britain, lead), Dolaucothi (Wales, gold).
- **Quarries.** Docimium/İscehisar (Phrygian pavonazzetto marble), Mons Porphyrites (imperial porphyry, Eastern Desert Egypt), Mons Claudianus (granite, ditto), Chemtou (Numidian giallo antico), Carrara/Luni (in as city, but the quarries themselves are separate points inland).
- **Garum factories.** Baelo Claudia (Iberia), Neapolis in Sardinia, Cotta (Morocco), Lixus (Morocco). Salted fish + fermented fish sauce, industrial scale.
- **Salinae.** Ostia's salt pans (probably in Ostia bbox already), Cervia, Halae in Boeotia, plus dozens along Adriatic + Iberian coasts.
- **Amphora kilns / pottery workshops.** La Graufesenque (Millau, terra sigillata factory — millions of stamps recovered), Arretium (in Etruria, samian ware), Rheinzabern (Rhine sigillata).
- **Imperial estates (praedia Caesaris).** Traceable through stamped tiles + inscriptions. North African olive-oil villae belong here.
- **Wine + olive-oil villae rusticae** — productive, not luxury. Settefinestre (Etruria), Villa Regina at Boscoreale.

#### 3d — Villae (residential + productive)

Named individual villas, either imperial retreats or aristocratic country houses.

- Hadrian's Villa (Tibur) — foundations laid ~117, mostly post-snapshot but log with a note.
- Domitian's Alban villa (Castel Gandolfo).
- Nero's Sublaqueum (Subiaco) — lakeside pleasure complex.
- Villa dei Quintili (Via Appia).
- Pliny the Younger's Laurentine + Tuscan villas — he describes both in letters; coords approximate.
- Sperlonga — Tiberius's cave-grotto with the Odyssey sculptures.
- Villa Adriana precursors, Anguillara, Baia (Baiae already in as city, but individual villas on the shore).
- Fishbourne (Britain, post-conquest palatial complex).
- Chedworth, Bignor (Britain), Piazza Armerina (Sicily, later but shell may exist).

#### 3e — Necropoleis + isolated tombs

Roman roads leaving cities were lined with tombs. Some are major individual monuments.

- **Named tomb monuments** — Mausoleum of Augustus (Rome), Castel Sant'Angelo (Hadrian's Mausoleum, not yet — 135), Pyramid of Cestius, Cecilia Metella (Via Appia), Munatius Plancus at Gaeta, Eurysaces at Porta Maggiore (baker's tomb), Poblicius at Cologne.
- **Necropolis complexes** — Isola Sacra between Ostia and Portus (huge — hundreds of tombs), Vatican Necropolis (already exists in 117, later covered by St Peter's), Alyscamps at Arelate, Fidenae, Puteoli necropolis, Petra's rock-cut royal tombs.
- **Via Appia tomb corridor** — first 5 miles south of Rome, dense with named tombs.

Add as a new `tombs` POI category (color it purple/plum, glyph = urn or obelisk).

#### 3f — Water infrastructure (beyond city aqueducts)

- **Aqueducts as line features.** Aqua Claudia, Aqua Anio Novus, Aqua Marcia, Aqua Traiana (opened 109 CE — very fresh in 117). Nemausus's aqueduct (Pont du Gard). Segovia. Carthage. Draw as LineStrings.
- **Roman dams.** Prosperina & Cornalvo (Emerita Augusta), Homs dam (Syria), Subiaco (Nero's).
- **Standalone bridges.** Alcántara (Trajanic, completed 106 — perfectly on-snapshot), Ponte di Tiberio (in as Rimini), Puente Romano at Merida (in), Trajan's Bridge over the Danube (finished 105 — huge, longest Roman bridge, doesn't survive but coords documented).
- **Watermills.** Barbegal (near Arles, 16-wheel industrial complex, dated Trajanic/Hadrianic). Only a handful of others survive.
- **Cisterns** — Yerebatan later, but Constantinople not yet. Alexandria, Ptolemais, Carthage have monumental Roman cisterns.

#### 3g — Games + festivals sites

- **Panhellenic games** — Olympia, Nemea, Isthmia, Delphi (Pythian). All active.
- **Roman games sites** — Actia at Nikopolis (in Trajan's day), Capitoline Games at Rome (started 86 CE by Domitian).
- **Chariot circuses** — Circus Maximus (Rome), Circus of Nero (Vatican area), Antioch circus, Carthage circus.

Some overlap cities — pin them anyway; a great sanctuary is its own entity even if inside a city zone.

#### 3h — Battlefields

Not new in 117 CE (Trajan's Parthian campaigns are ongoing) but pin the famous ones as historical markers with a `battle` category. Even pre-Trajan sites are relevant — the empire has memory.

- **Recent (still in living memory 117 CE):** Teutoburg (9 CE), Mons Graupius (83 CE), Sarmizegetusa (fall of Dacia, 106), Cremona battles (69, Year of Four Emperors), various Trajanic Dacian sites.
- **Classical:** Cannae, Zama, Alesia, Pharsalus, Philippi, Actium.
- **Traianic Parthian campaign is unfolding in 117** — Ctesiphon captured 116. Include with an `active` flag.

#### 3i — Shipwrecks with cargo

The Oxford Roman Economy Project catalogs ~1,600 known Roman shipwrecks. Each identifies a trade route. Show the biggest/most-famous.

- Madrague de Giens (wine, 70 BCE — pre-snapshot but relevant).
- Antikythera (60 BCE, mechanism ship).
- Uluburun is Bronze Age — skip.
- Comacchio (1st c. BCE, Adriatic).
- Grado (Trajanic era).
- La Roche Fouras (olive oil amphorae).

Use a `shipwreck` category, muted blue, tiny anchor glyph.

---

**Where micro-POIs go:** `public/data/pois.geojson` (already used for empire-wide POIs). Point geometry, existing schema. LineStrings (aqueducts, frontier lines) go in `public/data/lines.geojson` (create if missing).

**New POI categories may need new visual families** in `app/poiCategories.ts`. If it doesn't slot into the current 15, add one with a matching color + short glyph — keep the total under ~22 so the category chips row doesn't wrap.

### Axis 4 — THE LIVING EMPIRE IN 117 CE (people, events, political moment)

This axis makes the map *time-stamped* instead of just a static gazetteer. The empire on 11 August 117 CE is in the middle of dramatic events. Pin them.

#### 4a — People alive right now, geolocated

Not just emperors — writers, philosophers, generals, bishops, rabbis, doctors. Pin each with their known 117 CE location. Rich-hover shows their one-sentence bio.

- **Trajan (Marcus Ulpius Traianus)** — 63, ill, on his way back from the Parthian campaign. Dies at Selinus in Cilicia (modern Gazipaşa, Turkey) on 11 August 117. **The map's timestamp.** Pin Selinus with a special "final act" marker.
- **Hadrian** — 41, legate of Syria at Antioch. About to be declared emperor there (Aug 11) as soon as Trajan's death is confirmed. Pin Antioch.
- **Plotina** — Trajan's widow, with him at Selinus. Instrumental in Hadrian's accession.
- **Pliny the Younger** — probably dead by now (last dated letter ~113 CE from Bithynia). Log as `died 113` but pin his Laurentine + Tuscan villas.
- **Tacitus** — ~61, in Rome writing the *Annals*. Just published the *Histories*.
- **Suetonius** — Hadrian's imperial secretary shortly, right now attached to court. Pin Antioch/Rome.
- **Plutarch** — ~71, priest at Delphi (pin Delphi), lives at Chaeronea (pin).
- **Epictetus** — 62, running his Stoic school at Nikopolis in Epirus. Pin.
- **Juvenal** — writing satires in Rome.
- **Rufus of Ephesus** — physician, active at Ephesus.
- **Rabbi Akiva** — active in Judaea, gathering pupils; Bar Kokhba revolt is 15 years off but Kitos War is happening now.
- **Ignatius of Antioch** — bishop, martyred at Rome ~108 (dead, but his letters just landed).
- **Polycarp of Smyrna** — bishop, ~48, active.
- **Lucius Quietus** — Trajan's Berber general, at this exact moment putting down the Kitos War in Judaea, will be governor of Judaea briefly. Pin his campaign locations.
- **Publius Aelius Hadrianus's inner circle** — Attianus (praetorian prefect), Marcius Turbo (Kitos War general in Egypt/Cyrenaica).

Store in `public/data/people_117.geojson`. Schema:

```json
{"type":"Feature","geometry":{"type":"Point","coordinates":[LNG,LAT]},
 "properties":{
   "id":"person_trajan",
   "name":"Trajan",
   "role":"Emperor",
   "location_117":"Selinus, Cilicia (dies here 11 August)",
   "one_line":"63-year-old emperor returning ill from the Parthian campaign.",
   "sources":["Cass. Dio 68.33","HA Hadr. 4.7"]
 }}
```

Render as small portrait-medallion markers (colored ring by role: purple=imperial, red=military, blue=writer/philosopher, gold=religious).

#### 4b — Events happening in 117 CE

Overlay the actual news of the year.

- **Kitos War (115–117)** — Jewish revolts against Rome in Cyrenaica, Egypt, Cyprus, and Mesopotamia. Massive death toll. Being put down right now by Lucius Quietus (Judaea), Marcius Turbo (Egypt/Cyrenaica), Lusius Quietus (Mesopotamia). Pin the four revolt zones as areas.
- **Parthian War (114–117)** — Trajan's biggest campaign. He captured Ctesiphon in 116, formed the province of Mesopotamia briefly. In 117 the position is collapsing — Hadrian will abandon it. Pin Ctesiphon, the Parthian front, Trajan's line of retreat.
- **Dacian settlement (post-106)** — new colonies being founded (Sarmizegetusa Ulpia Traiana just built), Roman gold rush at Alburnus Maior, veterans settling. Pin.
- **Nabataean absorption (106)** — Arabia Petraea only 11 years old as a province in 117. Pin Petra + Bostra as freshly Roman.
- **Trajan's Column dedicated 113** — pin at Trajan's Forum in Rome with narrative "just finished".
- **Aqua Traiana opened 109** — pin along its route.
- **Trajan's Forum + Market dedicated 112** — pin.

Store as a mixture of point events + polygon zones (`public/data/events_117.geojson`). Give each a `date_iso` field.

#### 4c — Emperor travel routes

Trajan's final journey: **Antioch → Ctesiphon (advance 114-116) → retreat 117 → Selinus (dies)**. Draw as an animated LineString with dated waypoints.

Hadrian's own travels (mostly post-117) start soon: log the 118 return-to-Rome route as a "coming next" preview line.

### Axis 5 — PEOPLES, CULTURES, CLIENT STATES

The map should show that Rome was a top layer over a very heterogeneous world. Add overlays.

#### 5a — Language belts

The empire in 117 CE has: Latin (Italy, Africa, western provinces, army), Greek (all East + educated everywhere), Punic (Africa, still spoken in towns), Berber/Libyan (Africa interior), Aramaic + Syriac (Syria, Judaea, Mesopotamia), Egyptian/Coptic (rural Egypt), Celtic (rural Gaul + Britain + Galatia), Iberian + Basque + Celtiberian (Iberia interior), Illyrian (Dalmatia + Pannonia interior), Thracian (Balkans), Punic-Phoenician descendants (Spain, Malta), Aramaic-derived (Nabataean).

Draw as soft polygon overlays in `public/data/languages.geojson`. Toggleable overlay in the Layers panel. Reference: **The Cambridge Encyclopedia of the World's Ancient Languages**; **J. N. Adams, *Bilingualism and the Latin Language***.

#### 5b — Client kingdoms + neighbors just outside the empire

Rome in 117 CE has ~40 million people; the surrounding world matters. Label the neighbors on the map — visible outside the border.

- **Client kingdoms inside the frontier** — Bosporan Kingdom (Crimea), Iberia + Albania (Caucasus, clients), Osroene (Edessa), Armenia (briefly Roman under Trajan, being lost 117), Nabataea (annexed 106 — already in), Palmyrene semi-autonomy.
- **Free Germans** — Cherusci, Chatti, Marcomanni, Quadi. Label the tribal territories.
- **Sarmatians** — Iazyges, Roxolani, Alans. Label north-of-Danube.
- **Caledonii + northern British tribes** — north of the not-yet-built Wall.
- **Parthian Empire** — the main rival. Label capital Ctesiphon, satrapies.
- **Kushan Empire (Kanishka's era imminent)** — northwestern India. Silk Road partner.
- **Han Dynasty (Emperor An)** — China. Silk Road terminal.
- **Aksum forming** — Ethiopia, early days.
- **Meroë (Kush)** — Sudan. Still a kingdom.
- **Garamantes** — Fezzan, Sahara. Trade partners, sometimes raiders.
- **Sabaeans + Himyarites** — Arabia Felix. Incense trade.
- **Sassanid precursors** — not yet.

Store in `public/data/neighbors_117.geojson` as polygons with `name`, `type: kingdom | tribe | confederation | empire`, `relation_to_rome: client | ally | trading_partner | rival | enemy`.

#### 5c — Ethnic/cultural pockets inside the empire

Fine-grained. Places where a non-Roman identity remained visible.

- **Gauls** — Druids officially outlawed under Claudius but continued in remote areas. Grand sanctuary. Alesia memory.
- **Jewish diaspora communities** — Alexandria (a third of the city, before Kitos War devastated them), Rome (Trastevere), Cyrenaica, Antioch, Sardis, Delos, Ostia (synagogue possibly built by 100 CE), Puteoli.
- **Egyptian priesthoods** — Karnak, Philae, Dendera. Still fully operational.
- **Nabataean identity** — freshly conquered, still Aramaic-speaking.
- **Basques (Vascones)** — Iberian mountains, holding out.
- **Berber tribes** — Africa interior.
- **Isaurian brigands** — Cilicia mountains, famously ungovernable.

### Axis 6 — SYSTEMS OVERLAY (trade, learning, religion, nature)

Continuous systems that span the empire and beyond.

#### 6a — Trade routes as line features

- **Silk Road** — western end at Antioch → via Palmyra → through Parthian Persia → via Kushan → to Han China. Draw the Roman side.
- **Incense Road** — Arabia Felix → Petra → Gaza / Alexandria. Frankincense + myrrh.
- **Amber Road** — Baltic → down through Germania → Aquileia → onward to Rome.
- **Grain routes** — Egypt → Rome (via Alexandria → Puteoli/Portus), Africa → Rome, Sicily → Rome.
- **Olive oil route** — Baetica → Rome (Monte Testaccio built from these amphorae), Africa → Rome.
- **Tin route** — Cornwall → Massilia → Rome.
- **Slave routes** — Delos declined by 117; active from Danube, Britain, Judaea (Kitos War producing many right now).
- **Wine routes** — Gaul → North Sea + Rhineland, Italy → Egypt.

Store in `public/data/trade_routes.geojson` as LineStrings with `commodity`, `direction`, `notes`.

#### 6b — Religious communities (beyond the temple points)

- **Christian communities in 117 CE** — Pliny's Bithynia letter (~112) tells us Christianity was disturbingly common in Pontus-Bithynia. Firm attestation: Rome, Antioch, Alexandria, Corinth, Ephesus, Smyrna, Philippi, Thessalonica, Jerusalem area, some Bithynian towns. Pin as small crosses with confidence bands (attested / probable / claimed).
- **Jewish diaspora communities** — big and geographically dispersed. Pin.
- **Isis cult centers** — from Alexandria outward; big in Pompeii (buried), Rome, Ostia, Delos, Baiae. Isis was empire-wide.
- **Mithraea** — barely started in 117. Log only what's securely dated.
- **Cybele (Magna Mater) centers** — Rome (Palatine sanctuary), Pessinus (Anatolia, home shrine), Ostia.
- **Sol Invictus, Sabazios, various eastern mystery cults** — pin known centers.

Store in `public/data/religions_117.geojson` with `tradition`, `attestation` (attested_117 | probable | claimed).

#### 6c — Intellectual + educational centers

- **Alexandria** — Museion + Great Library (still going, though smaller than Ptolemaic peak). Serapeum library annex.
- **Athens** — the four philosophy schools all still teaching (Platonic Academy, Aristotelian Lyceum, Stoic Stoa Poikile, Epicurean Garden).
- **Rhodes** — rhetoric school (where Julius Caesar and Cicero once studied).
- **Berytus (Beirut)** — law school forming, will become the empire's premier law school in the 3rd century.
- **Nicopolis** — Epictetus's Stoic school.
- **Pergamon** — Asklepieion + library.
- **Antioch** — literary + Christian intellectual scene.
- **Massilia** — Greek education outpost.
- **Rome** — grammar + rhetoric schools, though secondary to Athens philosophically.

Store in `public/data/learning_117.geojson`. Category: `library | philosophy_school | rhetoric_school | law_school | medical_school | scriptorium`.

#### 6d — Natural landmarks people knew and revered

The Roman world had a rich sacred + practical geography of natural features.

- **Active volcanoes** — Vesuvius (erupted 79 within living memory), Aetna, Stromboli, Vulcano.
- **Sacred mountains** — Olympus (Greek), Argaeus (Cappadocia), Zaphon (Syrian), Ida (Trojan), Kithairon, Helicon, Parnassus (all Greek + already partly covered by Delphi).
- **Sacred islands** — Delos (Apollo's birth), Samothrace (mysteries), Ortygia at Syracuse.
- **Legendary sea-hazards** — Scylla + Charybdis (Straits of Messina), Cape Malea storms, the Pillars of Hercules (Gibraltar/Ceuta, edge of the known world).
- **River sources** treated as sacred — Fontes Sequanae (Seine source, Gaul), Fontes Aponi (Padua thermal springs), Fons Bandusiae (Horace).
- **Notable geological wonders** — Naples's Solfatara sulfur field (Baiae), Pamukkale's travertine (Hierapolis), Petra's ravines.

Store in `public/data/landmarks_117.geojson` with `type: volcano | sacred_mountain | sacred_island | sea_hazard | sacred_spring | wonder`.

---

## The two invariants that override everything

### 1. 117 CE snapshot rule

Trajan's death, 11 August 117 CE. Every record: `extant_117ce: true | false`.

- Built after 117 CE → `false`. Includes Baths of Caracalla (216), Pantheon-as-we-know-it (Hadrianic 126), Hadrian's Wall (started 122 — a few forts already existed on the site, log carefully), Baths of Neptune Ostia (139), Hadrian's Library Athens (132), most Mithraea. Also: Constantine's basilicas, Baths of Diocletian, etc.
- Destroyed before 117 CE → also record as `false`, but you still pin them. Pompeii + Herculaneum (79). Corinth's pre-146 BCE Greek city.
- Under construction in 117 → judgment call. Foundations laid → `true` with a note. Still just planning → `false`.

**When in doubt: `false` and explain in notes.**

### 2. Voice = Google Business, not scholar footnote

Every description is read by a stranger on their phone. Banned phrases (each one has been screenshotted at me by the user): "per the brief", "per the guardrail", "extant_117ce: true", "confidence: low/medium/high", "cf.", scholar-name-drops like "Squarciapino says" or "White vs. Runesson", parenthetical citation notes like "(Meiggs 1973 p. 240)".

**Do:** past tense, active voice, one concrete number (built ~139, seated 3,000), one arresting detail (mosaics of tritons, workers trod cloth in urine vats), 3–5 sentences under 500 chars.

**Don't:** hedge, list uncertainties, use "may have been / possibly / some scholars suggest". Pick a story and tell it. Only cite in the `sources` field, never inline in `notes`.

Model — Baths of Neptune (Ostia):
> A monumental bath complex begun under Hadrian, funded partly by his own donation. Its floors are covered in some of the finest black-and-white mosaics in the Roman world — Neptune in his chariot, tritons, sea nymphs. In 117 CE this whole block was still older shops and houses.

Three sentences. One number. One arresting detail. One 117 CE anchor. Ships.

---

## The pipeline for a new city (5 phases)

1. **Bbox.** Tight to the excavated park OR to the ancient core if it's a modern city on top. Modern cities → you'll get thousands of modern buildings, that's OK. Coastal? Check for silting (Ostia's coast is 3km west of where it was in 117 CE — same problem for Portus, Ravenna, Ephesus, Miletus, Aquileia; and Alexandria has the opposite — part of the ancient city is now underwater).
2. **Overpass fetch.** Extend a `research/<region>_batch.py` file with the row, run. Query template already handles buildings + archaeological sites + ruins + park paths. Retry with 5-10s sleeps on 429.
3. **Categorize.** Substring matching in `research/italia_batch.py::categorize()`. Multilingual — for new regions add keywords in the local language (Turkish, Arabic, French, German).
4. **Wire.** One row in `app/sites.ts::SITES[]` — Roman province (117 CE!), modern country, `center: [lng,lat]`, `zoom` (15 for whole modern cities, 16.5–17 for tight parks), `founded` string, one-line `blurb` (Google-Business voice).
5. **Curated descriptions** (LABOR-INTENSIVE, deprioritize if time short). Mirror `app/ostiaDescriptions.ts` — one file per city, ~20-40 famous named buildings. Then extend `Map.tsx`'s click-handler switch to route to the new city's lookup.

Full skill spec at `~/.claude/skills/city-mapper/SKILL.md` on the developer machine. Shifts running in the cloud: this brief IS your spec.

---

## Two tracks per shift

Every shift picks **one** of the three axes and does BOTH tracks against it:

### Track A — Data (60% of shift)
Add features, cities, road stations, POIs. Real research, cited. Push clean JSON.

### Track B — Feature/UI polish (40% of shift)
Read `FEATURE_BACKLOG.md`. Pick the top unblocked item. Ship.

**Do NOT touch:** deploy config, package.json deps, or the locked UI patterns (60px dark left rail, no dots — pill markers only, no shift-author voice in copy, no Street View, no sourcing-confidence badge in UI).

**Category filter chips** at top of screen filter POIs by family — click to isolate, click again to un-isolate. Wire new POI categories through `app/poiCategories.ts`.

---

## End of every shift

1. **Commit** — one commit per logical batch. Message summarizes what data + what UI shipped.
2. **Push** to `main`. Pre-push runs `npm run build`; if it fails, fix the error or revert — do NOT `--no-verify`.
3. **Vercel auto-deploys** on push. If auto-deploy misses (free-tier cap), run `npx vercel --prod --yes --archive=tgz` locally-equivalent.
4. **Log at top of SHIFT_LOG.md** — what you added, what track, sources, what's next.
5. **Update FEATURE_BACKLOG.md** — check off, add new ideas.

---

## Guardrails

- **117 CE snapshot** — see above.
- **Real data or don't include it.** Coord accuracy ≤100m for identified sites. For "somewhere in this valley" cases: `confidence: "low"`, note the tolerance in `notes`.
- **Latin name first** in `name_latin`, modern in `name_english`. Both present.
- **Small atomic commits.** One commit per logical batch (e.g., "Add 12 amphitheaters in Hispania" or "Via Egnatia — 34 mansiones").
- **Never delete another shift's work.** Correct in a follow-up commit; note the correction in SHIFT_LOG.
- **Don't touch** deploy config or package.json without a data-change justifying it.
- **Never `--no-verify`** to bypass the pre-push build gate. If Vercel is broken, note it in SHIFT_LOG and stop instead of pushing red.
- **Autonomous — no permissions asked.** The user is AFK. Make the reasonable call and keep moving.
