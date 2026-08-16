# Roman Maps — Shift Brief

**The project.** Roman Maps is a Google-Maps-style web app of the Roman Empire at its peak (**117 CE**, Trajan's death — maximum territorial extent). One frozen snapshot in time, not a timeline. Live at https://romanmaps.vercel.app. Stack: Next.js + MapLibre GL, deployed on Vercel, data as GeoJSON in `public/data/`.

---

## Where we are (2026-08-12)

**40 archaeological sites live** with street-level detail (buildings + park paths from OSM). They render on click from the Explore panel (60px dark left rail → compass icon). Ostia has 44 hand-curated Google-Business-style building descriptions; the other 39 cities still use OSM names only.

Empire-level layers already live: land polygons (Natural Earth), coastlines, provinces (dashed), rivers, lakes, main + secondary Roman roads (from Itiner-e / DARE / Pelagios), gazetteer of ancient places, category-filtered POI pill markers.

**The current 40 sites** — you can grep them from `app/sites.ts::SITES[]`, but at time of writing:
Ostia · Pompeii · Herculaneum · Ephesus · Timgad · Djemila · Volubilis · Leptis Magna · Sabratha · Jerash · Palmyra · Baalbek · Rome · Aquincum · Carnuntum · Vindolanda · Trier · Xanten · Corinth · Athens · Delphi · Mérida · Italica · Aquileia · Verona · Ravenna · Portus · Tivoli · Palestrina · Puteoli · Baiae · Cumae · Capua · Beneventum · Paestum · Brescia · Milan · Rimini · Ancona · Luni.

## Where we're going — twenty parallel expansion axes

Twenty axes. Each shift touches **at least TWO axes** and ships **quantitative minimums** (see "Per-shift throughput" below). Depth still matters — no fake features — but throughput matters too. The empire's big; we're not going to finish it dabbling.

The twenty axes:
1. **More cities**
2. **Sites along the roads** (mansiones, mutationes, milestones)
3. **Micro-level POIs** — 9 sub-categories: military, sacred, economic, villae, tombs, water, games, battlefields, shipwrecks
4. **The living empire in 117 CE** — people, events, ongoing wars
5. **Peoples, cultures, client states** — language belts, ethnic groups, non-Roman neighbors
6. **Systems overlay** — trade routes, intellectual centers, religious communities, natural landmarks
7. **Environment, climate, agriculture** — crops, wine + olive belts, grain zones, sailing seasons
8. **Money, administration, communication** — mints, provincial fiscal boundaries, conventus assize centers
9. **Daily life patterns** — housing, cuisine, clothing, spectacle, sexuality, death ritual regions
10. **Historical substrate** — pre-Roman layers still visible (Greek, Etruscan, Phoenician, Celtic, Iberian, Egyptian pharaonic)
11. **Disasters + memory** — earthquakes, eruptions, fires, floods, famines
12. **Imperial cult + ceremony** — sebasteia, provincial altars, processional routes
13. **Political apparatus + factions** — senate composition, chariot factions, praetorians, vigiles
14. **Foreign relations + embassies** — hostages, treaties, embassies inbound and outbound
15. **Welfare + euergetism** — alimenta towns, grain doles, benefactor inscriptions
16. **Textile + luxury craft geography** — purple dye, silk, wool, linen, amber, pearls
17. **Exile + penal geography** — exile islands, penal mines, quarry work camps
18. **Health, medicine, spa culture** — Aquae towns, mineral springs, malaria zones, doctors
19. **Correspondence networks** — Pliny's letters mapped, Ignatius's route, imperial rescripts
20. **Sports + athletic culture** — panhellenic games (in 3g), gymnasia empire-wide, chariot faction reach

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

### Axis 7 — ENVIRONMENT, CLIMATE, AGRICULTURE

The economic map of the empire is agrarian. Zones + specialties matter.

#### 7a — Crop zones as polygons
- **Grain belts** — Egypt (Nile flood, three months a year of harvest), Africa Proconsularis (rain-fed wheat), Sicily (Ceres's island), Baetica (wheat + barley), Pannonia. Egypt + Africa together fed Rome — 400,000 tonnes/year through Portus.
- **Olive belt** — everywhere the frost line permits: Baetica (oil that filled Monte Testaccio), Africa (Tripolitania olive villae), Istria, Attica, Syria.
- **Wine regions** — Falernian (Campania), Setine, Caecuban, Massic (all central Italy), Chian + Lesbian (Aegean), Rhaetic (Alps), Vienne (Gaul, wine boom underway), Baetica.
- **Fruit + specialty** — dates (Nabataea, Egypt), silphium (Cyrene — probably extinct by 117 per Pliny, log the last-mentioned area), figs (Caria), pomegranates (Judaea).
- **Timber zones** — Silva Hercynia (Germania), Alpine forests, Lebanon cedars, Corsica pine, Bruttium fir.
- **Livestock** — Apulian sheep transhumance corridors, Numidian horses, Cisalpine cattle, Britannia hunting dogs.

Store in `public/data/agriculture.geojson`.

#### 7b — Sailing seasons + mare clausum
Mediterranean commercial shipping was seasonal: `mare apertum` roughly May–September, `mare clausum` Nov–March (Vegetius codifies later but the practice is old). Riskier shoulder months in between. Overlay this as an animated seasonal indicator on the map header — winter mode shows Med grey/hazardous, summer shows blue/open.

#### 7c — Notable winds + currents
- **Etesian winds** (northerlies, July–September) — helped ships sail Alexandria→Rome, hindered the return.
- **Aquilo** (northeast wind) — feared on the Adriatic.
- **Auster** (south wind) — hot, bad weather.
- **Nile flood** — annual, June–October, life-and-death for Egypt.

Points + arrows in `public/data/wind_currents.geojson`.

#### 7d — Wild fauna sourcing
The Colosseum + provincial arenas demand exotic animals: elephants from Ethiopia + Mauretania, tigers from India (via Parthian brokers), lions from Numidia + Syria, bears from Caledonia + Dalmatia, giraffes from Sudan (Nubia), rhinoceroses. Pin the source regions with `fauna` markers and arrows to the biggest amphitheatre destinations.

### Axis 8 — MONEY, ADMINISTRATION, COMMUNICATION

The state's fiscal + bureaucratic footprint.

#### 8a — Mints
Coin production locations in 117 CE:
- **Rome mint** (primary) — silver denarii + gold aurei.
- **Lugdunum** (Gaul) — imperial provincial coinage.
- **Antioch** — silver tetradrachms for the East.
- **Alexandria** — closed monetary system, tetradrachms for Egypt only.
- **Caesarea Maritima, Caesarea Cappadociae, Nicomedia, Pergamon, Ephesus, Smyrna** — provincial mints striking bronze.
- **~120 civic mints** across Asia Minor + Levant striking their own small change under license.

Pin each with a `mint` marker showing metal + volume estimate. Reference: RIC (*Roman Imperial Coinage*) volumes.

#### 8b — Provincial fiscal boundaries + capitals
Every province has:
- A **provincial capital** (governor's seat).
- A **procurator's seat** (financial officer — often not the same city).
- **Conventus juridici** — assize centers where the governor held court. Well-attested for Asia (~13 conventus), Baetica, Tarraconensis. Ephesus, Pergamon, Smyrna, Sardis, Ephesus, Miletus, Halicarnassus, Alabanda, Apameia, Synnada, Cibyra, Adramyttium, Kyzikos, Philadelphia. Add these as `conventus` markers.
- **Boundary stones** — provinces marked their borders; some inscribed stones survive. Pin.

#### 8c — Cursus publicus + imperial post
The state courier system uses the road stations (Axis 2). Add on top of that:
- **Beneficiarii stations** — soldiers detached to policing + tax duties. Well-attested by inscriptions.
- **Statores** — imperial couriers.
- **Speculatores** — intelligence corps.

Category: `beneficiarii_station | courier_post`. Sources: EDCS epigraphy database.

#### 8d — Tax + census
- **Portoria stations** — customs posts at provincial + imperial boundaries. Corpus in France + Rhine well-documented (Zoll-Rhine).
- **Publican company HQs** — tax farmers. Rome-based but with regional offices.

### Axis 9 — DAILY LIFE PATTERNS (regional variation)

Instead of city dots, pattern overlays. Where did Romans live differently?

#### 9a — Housing typologies
- **Atrium-domus** — Italy, Sicily.
- **Peristyle houses** — Hellenistic east, Baetica.
- **Insula apartment blocks** — Rome, Ostia, Puteoli.
- **Rond-house survivals** — rural Britain, Gaul.
- **Trulli / mudbrick vaulted** — Apulia, North Africa interior.
- **Cave dwellings** — Cappadocia (already carving churches into rock).
- **Rectangular Egyptian mudbrick** — Fayum, rural Egypt.

Overlay soft polygons in `public/data/housing_styles.geojson`.

#### 9b — Cuisine regions
Food is one of the strongest cultural signals. Overlay:
- **Bread cultures** — wheat everywhere, but barley bread staple in poor Iberia + Egypt, spelt in Alpine + Rhine.
- **Fish sauce (garum) regions** — Iberia + Africa + Bosporus produced; consumed everywhere.
- **Wine vs beer belt** — Mediterranean drinks wine, northern Gaul + Britannia + Germania drink cervesia (beer) though wine trade is pushing north.
- **Olive oil vs animal fat** — same divide.
- **Silphium extinction** — Cyrenaica, iconic 117 CE moment: Pliny (writing later but describing this era) says the last-known stalk was sent to Nero.
- **Roman "Spice trade"** — pepper (via Muziris in India → Alexandria → Rome), cinnamon, cassia. Pin arrivals.

#### 9c — Clothing + fashion by region
- **Toga territory** — legal Roman citizens only, ceremonial garment. Everyday wear is the tunica.
- **Gallic bracae (trousers)** — barbaric to Romans but universal in Gaul, Britain, Germania.
- **Greek chiton + himation** — East.
- **Egyptian linen kilt** — rural Egypt.
- **Palmyrene silk textiles** — hybrid Parthian-Greek styles.
- **Berber tribal dress** — Africa interior.

#### 9d — Spectacle + gladiator geography
- **Gladiator schools (ludi)** — Rome (Ludus Magnus, Dacicus, Gallicus, Matutinus), Capua (in), Ravenna (in), Alexandria, Pergamon.
- **Amphitheatre density** — West (Italia, Gaul, Africa) LOVED gladiatorial games; East preferred Greek athletic games + theatre.
- **Ludi calendar** — approximate: 176 days a year of state games at Rome by our snapshot (Fasti Ostienses).

#### 9e — Death rituals by region
Transition from cremation → inhumation is JUST BEGINNING in 117 CE. Log the shift as a heat-map:
- **Predominantly cremation** — Italy, Gaul (still).
- **Predominantly inhumation** — Egypt (always), Judaea (always), some pockets in the East.
- **Mixed / transitioning** — provinces catching the shift 2nd–3rd century.
- **Sarcophagus workshops** — Docimium, Athens, Aphrodisias (sarcophagus industry booming).

#### 9f — Sexuality + gender geography (contextual, historical)
- **Pompeii lupanaria + graffiti** — buried but documented.
- **Baiae's reputation** — resort of hedonism per Seneca.
- **Priestesses of Isis + Vestals** — female religious roles.
- **Vestals in Rome** — sacred college.
- **Galli (Cybele priests) — self-castrated, based at Rome + Pessinus** — pinned as religious markers.

Treat this axis carefully — informational, no crude language, contextualize as social history.

### Axis 10 — HISTORICAL SUBSTRATE (pre-Roman layers still visible)

The Roman empire in 117 CE is layered over 3000+ years of prior civilizations. Show those layers as toggleable overlays.

#### 10a — Greek substrate (Magna Graecia + Aegean + Ionia)
Colonies of the 8th–6th c. BCE. Many still culturally Greek in 117: Syracusa, Neapolis (Naples), Massilia, Emporion (in Iberia), Cumae (in), Paestum (in as Poseidonia), Croton, Sybaris ruins.

#### 10b — Etruscan substrate (central Italy)
Etruscan cities that became Roman: Volsinii (Bolsena), Tarquinia, Veii (destroyed 396 BCE — pin the ruined city), Cerveteri, Vulci, Populonia, Roselle, Vetulonia, Chiusi (Camars).

#### 10c — Phoenician / Punic substrate (Africa + Iberia + Sardinia)
Phoenician then Carthaginian settlements. Carthage (destroyed 146 BCE, refounded 46 BCE by Caesar — Roman by 117 but Punic still spoken), Utica, Gades (Cadiz — one of the oldest cities in Iberia, still Phoenician-culture), Motya (Sicily), Nora + Tharros + Sulci (Sardinia), Baria (SE Iberia).

#### 10d — Celtic substrate (Gaul + Britain + Iberia + Galatia + Danube)
Iron Age oppida still often occupied: Alesia, Bibracte (moved to Autun), Gergovia (moved to Clermont), Avaricum (Bourges), Vercingetorix's memory sites. Also British hillforts, Iberian castros, and Galatian centers in Anatolia.

#### 10e — Iberian + Basque substrate
Iberian city-states, Vascones territory in the Pyrenees, Cantabrian resistance sites.

#### 10f — Egyptian pharaonic substrate
Pyramids of Giza (already ~2500 years old in 117, tourist attraction — graffiti of Roman visitors survives), Sphinx, Valley of the Kings (already tomb-robbed), Karnak + Luxor + Thebes ruins + Roman restorations. Roman tourists at the Colossi of Memnon left graffiti.

#### 10g — Mesopotamian / Mesopotamian-adjacent
Freshly relevant since Trajan's conquest. Babylon (in ruins, but still visited), Assyria's Nineveh (long ruins), Ur (ancient), Hatra (independent, Parthian ally). All briefly in Roman hands 116–117.

Store all substrate features in `public/data/substrate.geojson` with `culture` field. Render as ghosted markers with dashed outline.

### Axis 11 — DISASTERS + MEMORY

Events people are still talking about in 117 CE, plus what's just happened.

- **Antioch earthquake, 13 December 115** — massive, killed thousands, Trajan himself was there and barely escaped. Pin Antioch with a fresh-scar marker.
- **Vesuvius eruption, 79** — Pompeii + Herculaneum buried. 38 years ago in 117; survivors and their kids still alive.
- **Great Fire of Rome, 64** — Nero's fire. 53 years old memory. Reconstructed districts still visible in 117.
- **Rome flooded, 15 CE + 69 CE** — Tiber floods, especially bad ones remembered.
- **Fires in the Forum + Campus Martius under Titus (80) + Domitian** — reconstruction under way through Trajan.
- **Famines** — Egyptian Nile-flood failures triggered grain crises; 6 CE, 41 CE remembered.
- **Plagues** — pre-Antonine world; localized epidemics only.
- **Barbarian raids in memory** — Cimbri + Teutones (late 2nd c. BCE) still cited, Boudica's revolt (60 CE) recent in Britain, Batavian revolt (69 CE).
- **Ships lost** — the Alexandrian grain fleet losses were periodic tragedies; Josephus was on one wreck.

Store in `public/data/disasters.geojson` with `year`, `type`, and a `still_visible_in_117` flag (survivors' generation, ruins, etc). Render with a fault-line/flame icon by type.

### Axis 12 — IMPERIAL CULT + CEREMONY

The state religion of empire worship — geographic layer, distinct from the temples of Olympian gods.

- **Provincial imperial cult centers.** Each province has a primary altar/temple to Roma and the Augusti. Lugdunum (Ara Romae et Augusti, Gallic capital), Colonia Camulodunum (Britannic center), Tarraco (Hispania), Pergamon (Asia, first provincial cult temple in the East 29 BCE), Nicomedia + Ephesus (secondary Asian centers), Ancyra (Galatia — the Res Gestae inscribed there).
- **Sebasteia** — dedicated shrines. Sebasteion at Aphrodisias (Julio-Claudian, extensively decorated — still standing in 117).
- **Ara Pacis Augustae** — Rome, still on display; annual sacrifice.
- **Divi (deified emperors)** temples — Divus Iulius, Divus Augustus, Divus Vespasianus, Divus Titus, Divus Nerva. Each has a temple in Rome.
- **Processional routes** — Roman triumphs took a fixed route (Porta Triumphalis → Campus Martius → Circus Maximus → Via Sacra → Capitoline). Trajan's Parthian triumph would have been about to happen; Hadrian gives a post-mortem one to Trajan.
- **Imperial birthday festivals + accession anniversaries** — celebrated empire-wide with dated altars.

Store in `public/data/imperial_cult.geojson`. Rich hover shows first-emperor-worshipped and current status.

### Axis 13 — POLITICAL APPARATUS + FACTIONS

The mechanics of empire.

- **Senate composition** — ~600 senators in 117 CE. Trajan was the first non-Italian emperor (Spanish, from Italica — in). Roughly 15–20% of the senate is now provincial (Spanish, Gallic, African, one or two Asian). Pin senators' home cities.
- **Chariot factions.** By 117 CE the four factions are established: Reds (Russata), Whites (Albata), Blues (Veneta), Greens (Prasina). Each has stables (stationes) in Rome — pin locations. Domitian added Purples + Golds; discontinued. Rich passionate followings especially for Blues + Greens.
- **Praetorian Guard.** ~10 cohorts of ~1,000 each. Barracks: Castra Praetoria (Rome), plus small detachments at Alba Longa. Prefect in 117: Attianus (Hadrian's ally). Pin.
- **Equites singulares Augusti** — imperial horse guard, ~1,000 strong. Cavalry barracks near the Lateran.
- **Urban cohorts** (III–VI, urban police): ~6,000 total, at Rome + Lugdunum + Carthage + Ostia.
- **Vigiles** — 7 cohorts of ~1,000 each, firefighters + night watch, split across Rome's 14 regions. Each cohort has 2 excubitoria (guardhouses).
- **Provincial armies** — 28 legions in 117 CE with fortresses (see Axis 3a). Pin.

Store in `public/data/politics.geojson` grouped by `category: senator_hometown | chariot_faction_HQ | praetorian_barrack | urban_cohort_HQ | vigiles_station | legion_HQ`.

### Axis 14 — FOREIGN RELATIONS + EMBASSIES

Rome as a diplomatic center.

- **Princely hostages at Rome.** Long tradition — Parthian princes, Armenian princes, German nobles, Nabataean princes (before annexation), British chieftains' sons. Each hostage has a documented Roman residence.
- **Embassies inbound.** Documented visits: Indian embassy to Augustus, Han Chinese contact attempted 97 CE by Gan Ying (didn't cross), Aksumite delegations, Nabataean pre-annexation, Parthian truce embassies. Each embassy has a route + destination.
- **Embassies outbound.** Roman traders in India (Muziris port well-attested via Muziris papyrus + Periplus Maris Erythraei ~50 CE), Roman envoys to Parthia periodically. Pin known Roman-goods-found sites in South India + Sri Lanka.
- **Treaty locations.** Rhandeia (63 CE, with Parthia over Armenia), Colchis, Nisibis — border-negotiation sites.
- **Diplomatic gifts routes.** Ivory + silk + exotic animals flowed into Rome as tribute + gift; drew on trade routes.

Store in `public/data/diplomacy_117.geojson`. Include a `direction` (inbound|outbound|treaty) and `polity` (Parthia, Han, Aksum, India, etc.).

### Axis 15 — WELFARE + EUERGETISM (public benefaction)

Where imperial and private largesse landed on the ground.

- **Alimenta towns** — Trajan's welfare program funding grain for Italian orphans. ~50 known Italian towns received alimenta. Full list attested through inscriptions (the Ligures Baebiani + Veleia bronze tables are the two main sources). Pin each town.
- **Grain dole (annona)** distribution points — Rome's Porticus Minucia Frumentaria distributed to ~200,000 male citizens monthly. Ostia + Portus handled receipt.
- **Aqueduct dedications** — private + imperial benefactions. Trajan personally funded Aqua Traiana (109 CE) — pin route as Axis 6a covers water.
- **Benefactor inscriptions** — Plancia Magna at Perge (Trajanic, rebuilt city gate), Herodes Atticus is later, but earlier benefactors documented at Aphrodisias, Ephesus, Prusa. Pin known Trajanic-era benefactors.
- **Congiaria (imperial cash handouts)** — periodic emperor-to-people distributions. Trajan did several; Hadrian will do more.

Store in `public/data/euergetism.geojson`.

### Axis 16 — TEXTILE + LUXURY CRAFT GEOGRAPHY

- **Tyrian purple dye works** — Tyre + Sidon primary; also Meninx (Djerba), Kaudos (Cythera). Murex-shell mounds at each site.
- **Chinese silk arrival points** — enters via Palmyra + Petra + Alexandria. Pin caravan endpoints.
- **Coan silk (Cos)** — famous transparent gauze fabric.
- **Egyptian linen** — Alexandria + upriver Delta towns.
- **Wool centers** — Miletus, Tarentum (Apulian sheep), Padua, Baetican wool, Britain (introduced under Rome).
- **Amber crafting** — Aquileia (in, workshops process Baltic amber for the imperial market), Rome shops.
- **Pearl fisheries** — Persian Gulf (Charax Spasinou), Red Sea, Britain (yes, Britons dive for freshwater pearls).
- **Perfume/cosmetics** — Cyprus (rose water), Arabia (frankincense + myrrh — already in Axis 6a).
- **Glass** — Sidon + Alexandria (blown glass), Cologne emerging as western center.
- **Bronze workshops** — Corinth (famous "Corinthian bronze"), Capua, Aegina.
- **Jewelry centers** — Alexandria + Antioch specialize in fine gold work.

Store in `public/data/crafts.geojson`.

### Axis 17 — EXILE + PENAL GEOGRAPHY

- **Exile islands.** Pandateria (Ventotene) — Julia the Elder banished there by Augustus. Pontia (Ponza), Planasia (elder Agrippa Postumus), Trimerus (Julia the Younger), Rhodes (Tiberius's voluntary exile), Aegina, Gyaros (barren island east of Athens — feared exile destination). Pin each.
- **Penal mines (damnatio ad metalla)** — condemnation to hard labor in mines. Sardinia notoriously deadly (silver mines). Danube salt mines. Egyptian Eastern Desert quarries — Mons Claudianus + Mons Porphyrites (Axis 3c) had penal + free labor mixed.
- **Quarry work camps.** Same principle — condemned worked stone.
- **Prison Rome** — Tullianum (still standing on Capitoline slope). Saint Peter tradition later; in 117 it's just Rome's execution room.
- **Beast-fights ad bestias** — condemned to the arena. Executions at Colosseum, provincial amphitheatres.

Store in `public/data/penal.geojson`.

### Axis 18 — HEALTH, MEDICINE, SPA CULTURE

- **Aquae towns** — every place called Aquae X is a hot/mineral spring. Aquae Sulis (Bath), Aquae Mattiacae (Wiesbaden), Aquae Cutiliae (near Rome), Aquae Statiellae (Acqui Terme), Aquae Baiae (in as Baiae), Aquae Ciceronianae (Baiae area), Aquae Herculis, Aquae Segestae, Aquae Aureliae (Baden-Baden). Dozens more. Pin each — Roman spa culture is empire-wide.
- **Asklepieia (temple-clinics)** — already covered in Axis 3b, but add smaller ones: Corinth's Asklepieion, Athens's, Rome's Tiber Island.
- **Malaria zones** — Pontine marshes south of Rome, Sardinia (notorious), Etruria wetlands. Pin as zones.
- **Named doctors** — Rufus of Ephesus (Ephesus, active), Archigenes of Apameia (writing in Rome now), Soranus of Ephesus a bit later (gynecology). Pin their bases.
- **Medical schools** — Alexandria (dominant), Kos + Knidos (rival traditions), Rome (public teaching hospitals began under Vespasian).
- **Herbal + drug centers** — Cyrene (silphium's last stand), Crete (herbal reputation), Attica.

Store in `public/data/health.geojson`.

### Axis 19 — CORRESPONDENCE NETWORKS

Turn preserved letter corpuses into map data.

- **Pliny the Younger's letters** — his correspondence network is a snapshot of elite Rome ~100–113 CE. Every named recipient with a known location becomes a pin. Draw lines from Pliny's estates to each recipient. Multiple estates (Laurentine, Tuscan, Como) as origin nodes.
- **Cicero's letters** — earlier (mid-1st c. BCE) but still-cited literary reference. Pin.
- **Ignatius of Antioch's route** — his seven surviving letters were written on his journey to martyrdom at Rome (~108 CE): Antioch → Smyrna (letters to Ephesus, Magnesia, Tralles, Rome from here) → Troas → Rome. Draw the route.
- **Imperial rescripts** — emperor's replies to provincial governors' queries. Pin known Trajanic ones by requesting city.
- **Fronto** — later (Marcus Aurelius era), but pin his students' network as it forms.

Store in `public/data/letters.geojson` — points for people + LineStrings for routes.

### Axis 20 — SPORTS + ATHLETIC CULTURE

Beyond spectacle sites (Axis 3g).

- **Gymnasia** — every self-respecting Greek/Hellenized city has one. Naked exercise culture. Pin.
- **Athletic guilds** — the Herakleistai + Xystic Synod of Athletes had HQs (Ephesus, Rome, Alexandria). Pin.
- **Athletic festival circuit** — the "sacred crown" games (Olympia, Pythia, Nemea, Isthmia) plus dozens of periodic games at Athens (Panathenaia), Ephesus, Pergamon, Actia, Sebasta at Naples, Capitolia at Rome. Overlay as a circuit map.
- **Chariot faction reach** — the Roman factions (Axis 13) had followings in every hippodrome city (Antioch's is the biggest outside Rome). Pin faction supporter concentrations.
- **Gladiator schools (ludi)** — see Axis 9d.

Store in `public/data/sports.geojson`.

---

## The three invariants that override everything

### 0. The map has to look like Google Maps

This is the invariant that got broken hardest, so it goes first. The product promise is a
Google-Maps-grade map of the Roman Empire — polished, quiet, easy to use. By 2026-08-15 the
opening view was twenty-nine thematic overlays painted on top of each other, a white control
column down the right edge of a dark map, and a full-width white credit band across the bottom
of every phone screen. Twenty shifts each added a layer and each defaulted it ON, and no shift
ever opened the site at phone size.

Three rules follow, and they bind every future shift:

1. **A new overlay defaults OFF.** Add it to `LAYER_GROUPS` in `app/useLayers.ts` *without*
   `base: true`. Only the five base groups (roads, rivers, provinces, cities, landmarks) are on
   at first load. A thematic layer is readable one or two at a time; the default view is the
   base map, always. If a shift's new data is genuinely basemap-grade, say so in SHIFT_LOG and
   argue it — don't just set the flag.
2. **No hardcoded colors in chrome.** `app/globals.css` defines the light/dark token set
   (`--surface`, `--text`, `--text-2`, `--icon`, `--accent`, `--divider`, `--shadow-1/2`, …).
   UI components reference tokens; only the MapLibre paint properties in `Map.tsx` and the
   category colors in `poiCategories.ts` carry literals. A literal `#fff` in a panel is a bug —
   it means that panel is a white slab for every user on a dark phone.
3. **Every shift that touches UI checks it at 375×812, in dark mode, before committing.** Not
   a typecheck, not a desktop screenshot — a phone-width screenshot in both color schemes. And
   count the controls: the phone gets a search pill, a layers button, one corner FAB, an epoch
   pill and a credit chip. Anything beyond that goes in the hamburger menu, not on the map.


### 1. 117 CE snapshot rule

Trajan's death, 11 August 117 CE. Every record: `extant_117ce: true | false`.

- Built after 117 CE → `false`. Includes Baths of Caracalla (216), Pantheon-as-we-know-it (Hadrianic 126), Hadrian's Wall (started 122 — a few forts already existed on the site, log carefully), Baths of Neptune Ostia (139), Hadrian's Library Athens (132), most Mithraea. Also: Constantine's basilicas, Baths of Diocletian, etc.
- Destroyed before 117 CE → also record as `false`, but you still pin them. Pompeii + Herculaneum (79). Corinth's pre-146 BCE Greek city.
- Under construction in 117 → judgment call. Foundations laid → `true` with a note. Still just planning → `false`.

**When in doubt: `false` and explain in notes.**

### 1.5 Display-name rule — English-standard, uniform, legible

**Every `display` field, every marker label, every search-panel row uses the name a general English-speaking Google-Maps user would recognise.** Ancient/Roman names live in the blurb or in the details panel body, never in the display name.

- **Living modern city on the Roman core → modern city name.** "Milan", not "Mediolanum". "Trier", not "Augusta Treverorum". "Merida", not "Emerita Augusta". "Rimini", not "Ariminum".
- **Pure archaeological park → the site name people search for.** "Timgad", "Volubilis", "Palmyra", "Vindolanda", "Palestrina" (not "Praeneste"), "Tivoli" (not "Tibur").
- **No parenthetical alternates in the display name.** Never `"Trier (Augusta Treverorum)"` or `"Milan (Mediolanum)"`. Put the Roman name inline in the blurb where it enriches the story: `"Roman Mediolanum, the largest city in northern Italy..."`.
- **No diacritics in the display.** Write `"Merida"` not `"Mérida"`. Accented form may live in the blurb text.
- **No abbreviations.** Never `"S. Maria Capua Vetere"` — just `"Capua"`.
- **No qualifiers like `"(city center)"` or `"(Roman Agora)"`.** The map already centers on the right place; the display is the name, not the framing.
- **Provinces stay in Latin.** `province: "Africa Proconsularis"`, not `"Africa"`. English scholarship standard.
- **`modernCountry` in plain English.** `"United Kingdom"`, not `"UK"`. `"United States"` if it ever comes up. `"Czech Republic"` not `"Czechia"` unless the Wikipedia article is currently at Czechia (check).
- **Slugs stay lowercase, unchanged once set.** Slug is the routing key inside the geojson `site` property — never rename it after data is committed.

This applies to *every* feature type across all 20 axes: cities, road stations, POIs, people, embassies, mints, gladiator schools — all of them. Uniform, legible, English-first.

### 1.6 Every new POI ships with an image_url

The PlaceDetails panel now shows a hero image at the top of every place — modeled after the way Google Business listings put a photograph above the name. **Every POI you add MUST carry an `image_url` field**, or the panel falls back to a slim tinted rail and looks worse than the ones already on the map.

- **Preferred source: Wikimedia Commons.** Use the canonical hotlink URL format:
  `https://commons.wikimedia.org/wiki/Special:FilePath/<FILENAME>?width=800`
  Substitute the exact file name from the Commons page (spaces are fine — URL-encode if you write it by hand, but this exact pattern is stable across Wikimedia's file-rotation and cache layers).
- **What to pick.** In order of preference: (a) a well-known artist rendering or 19th-c. engraving (Piranesi, David Roberts, Léon Vaudoyer reconstructions, Alma-Tadema), (b) a scholarly reconstruction drawing, (c) a modern photograph of the ruin/monument. Never use a screenshot, a modern illustration behind a paywall, or an AI-generated image.
- **Every image needs an `image_credit` field** — one line naming the source and, if applicable, the artist and license (e.g. `"Reconstruction by Léon Vaudoyer, 1830 · Wikimedia Commons"`). Renders quietly at the bottom of the hero.
- **Broken URLs degrade gracefully.** `PlaceDetails.tsx` hides the `<img>` on load error and shows the fallback rail — so a wrong filename is a soft failure, not a broken layout. That is NOT permission to skip due diligence; verify the Commons page loads before pasting the filename.
- **Optional `image_alt`** — short alt text if the name alone doesn't convey what the image shows. Omit if unsure.

Schema addition (applies to every axis that pins places — cities, road stations, POIs, people, mints, embassies, everything):

```json
"image_url":    "https://commons.wikimedia.org/wiki/Special:FilePath/Roma-pantheon-frontfacade.jpg?width=800",
"image_credit": "Pantheon, Rome · Wikimedia Commons (public domain)",
"image_alt":    "Front façade of the Pantheon"
```

Missing an image_url is treated the same as missing a `notes` blurb — the feature is incomplete and does not count toward the per-shift throughput minimums.

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

## Per-shift throughput — MINIMUMS, not maximums

Each 6-hour shift MUST touch at least TWO axes and MUST hit the following per-axis minimums for whichever axes it touches. These are floors — go over if you have material. **Do not stop early.** If you finish minimums with time left, keep going on the same axes or open a third.

| Axis | Per-shift minimum output |
|---|---|
| 1 — Cities | **5 new cities** wired end-to-end (Overpass fetch + `sites.ts` row + blurb) |
| 2 — Roadside | **1 complete road's mansiones + mutationes** (typically 20–50 stations) OR 60 miscellaneous stations from Itinerary sources |
| 3 — Micro-POIs | **40 new features** in the chosen sub-category, all with sources |
| 4 — Living empire | **20 people or events** geolocated with one-line bios and sources |
| 5 — Peoples/cultures | **1 complete overlay populated** (e.g., all client kingdoms; OR all Germanic tribes; OR full language belt map) |
| 6 — Systems overlay | **1 complete trade route** (LineString + all named nodes) OR 25 religious communities + attestation OR full learning-center set |
| 7 — Environment/climate | **1 complete crop or wind overlay** with source citations |
| 8 — Money/admin | **1 mint OR 1 province's conventus centers OR 20 beneficiarii stations** |
| 9 — Daily life | **1 complete regional overlay** (housing typology, cuisine map, gladiator schools, sarcophagus workshops, etc.) |
| 10 — Historical substrate | **20 pre-Roman substrate points** in one culture layer |
| 11 — Disasters + memory | **15 events** pinned with year + still-visible-in-117 note |
| 12 — Imperial cult | **1 province's complete cult centers OR 12 sebasteia/altars** |
| 13 — Political apparatus | **30 senators' hometowns OR 4 chariot faction HQs + all vigiles stations OR full praetorian layout** |
| 14 — Foreign relations | **15 hostage residences, embassy routes, or treaty sites** |
| 15 — Welfare + euergetism | **All 50 alimenta towns OR 20 named benefactor inscriptions** |
| 16 — Textile + luxury craft | **25 workshop/production sites** |
| 17 — Exile + penal | **1 complete category** (all exile islands OR all penal mines OR all penal quarries) |
| 18 — Health + spa | **All Aquae towns in one province OR 25 mineral springs + doctors** |
| 19 — Correspondence networks | **1 corpus fully mapped** (Pliny OR Ignatius OR imperial rescripts) |
| 20 — Sports + athletic | **25 gymnasia + 1 athletic festival circuit** |

**Rule of thumb:** if you're not committing at least 30–100 new features per shift, you're going too slow. The empire is enormous. The user built this for scale.

### Two tracks per shift

Track A — data (70–80% of shift): the axis minimums above.
Track B — one UI/feature backlog item (20–30% of shift): pick top unblocked item in `FEATURE_BACKLOG.md`, ship it. If you don't have time for track B, that's fine — data wins.

**Do NOT touch:** deploy config, package.json deps, or the locked UI patterns (60px dark left rail, no dots — pill markers only, no shift-author voice in copy, no Street View, no sourcing-confidence badge in UI).

**Category filter chips** at top of screen filter POIs by family — click to isolate, click again to un-isolate. Wire new POI categories through `app/poiCategories.ts`.

### Batch commits, not one-at-a-time

Don't commit one feature at a time. Batch: fetch 5 cities → one commit. Compile 60 mansiones → one commit. Add 40 mines → one commit. Faster, cleaner log, easier to review + revert.

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
- **New overlays default OFF; chrome uses theme tokens; UI changes get a 375px dark-mode screenshot.** See invariant 0.
- **Real data or don't include it.** Coord accuracy ≤100m for identified sites. For "somewhere in this valley" cases: `confidence: "low"`, note the tolerance in `notes`.
- **Latin name first** in `name_latin`, modern in `name_english`. Both present.
- **Small atomic commits.** One commit per logical batch (e.g., "Add 12 amphitheaters in Hispania" or "Via Egnatia — 34 mansiones").
- **Never delete another shift's work.** Correct in a follow-up commit; note the correction in SHIFT_LOG.
- **Don't touch** deploy config or package.json without a data-change justifying it.
- **Never `--no-verify`** to bypass the pre-push build gate. If Vercel is broken, note it in SHIFT_LOG and stop instead of pushing red.
- **Autonomous — no permissions asked.** The user is AFK. Make the reasonable call and keep moving.
