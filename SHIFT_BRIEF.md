# Roman Maps — Shift Brief

**The project.** Roman Maps is a Google-Maps-style web app of the Roman Empire at its peak (**117 CE**, Trajan's death — maximum territorial extent). One frozen snapshot in time, not a timeline. Live at https://romanmaps.vercel.app. Stack: Next.js + MapLibre GL, deployed on Vercel, data as GeoJSON in `public/data/`.

---

## Where we are (2026-08-12)

**40 archaeological sites live** with street-level detail (buildings + park paths from OSM). They render on click from the Explore panel (60px dark left rail → compass icon). Ostia has 44 hand-curated Google-Business-style building descriptions; the other 39 cities still use OSM names only.

Empire-level layers already live: land polygons (Natural Earth), coastlines, provinces (dashed), rivers, lakes, main + secondary Roman roads (from Itiner-e / DARE / Pelagios), gazetteer of ancient places, category-filtered POI pill markers.

**The current 40 sites** — you can grep them from `app/sites.ts::SITES[]`, but at time of writing:
Ostia · Pompeii · Herculaneum · Ephesus · Timgad · Djemila · Volubilis · Leptis Magna · Sabratha · Jerash · Palmyra · Baalbek · Rome · Aquincum · Carnuntum · Vindolanda · Trier · Xanten · Corinth · Athens · Delphi · Mérida · Italica · Aquileia · Verona · Ravenna · Portus · Tivoli · Palestrina · Puteoli · Baiae · Cumae · Capua · Beneventum · Paestum · Brescia · Milan · Rimini · Ancona · Luni.

## Where we're going — three parallel expansion axes

Every shift picks ONE axis and pushes it forward. Don't try all three in one shift.

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

### Axis 3 — MICRO-LEVEL: villae, sanctuaries, forts, mines, quarries, lighthouses

Below city level, above road-station level. Real historical/archaeological sites that aren't full cities but matter to the map.

**Categories to hunt:**

- **Imperial villae** — Hadrian's Villa (Tibur, still being built at our snapshot), Villa of the Papyri (Herculaneum, buried), villa dei Quintili (Via Appia), villa Adriana precursors. Pliny the Younger's letters describe several by location.
- **Rural sanctuaries** — Delphi/Baalbek are already in as cities; but Apollo Grannus at Grand, Sequana at Fontes Sequanae, the Tetrapylon at Portus Iulius, Nemi (Diana), Segeda (Iberia). Pausanias catalogs the Greek ones.
- **Auxiliary forts on the limes** — Every fort along Hadrian's Wall (Vindolanda is done; do Chesters, Housesteads, Wallsend), the Rhine (Saalburg, Neuss, Xanten, Nijmegen), the Danube, the Fossatum Africae. **Roman Fort Locator** tools + Ordnance Survey / RCAHMS records are your friends.
- **Mines and quarries** — Rio Tinto (Hispania silver), Las Médulas (gold), Docimeium (Phrygian marble), Mons Porphyrites (Egyptian porphyry), Mons Claudianus (granite), Carrara/Luna already in. Ancient Mining Wiki + specific archaeological reports.
- **Lighthouses (pharos)** — Alexandria (still standing 117), Ostia (rebuilt under Trajan), Dover (Roman pharos still stands), La Coruña (Tower of Hercules, still working today).
- **Amphitheaters, aqueducts, bridges not attached to a listed city** — Pont du Gard, Segovia aqueduct, Alcántara bridge, Ponte di Tiberio.
- **Villas that were productive units** — olive-oil villae in North Africa, wine villae in Gaul. Each represents a named archaeological find.

**Where they go:** `public/data/pois.geojson` (already used for empire-wide POIs). Schema is the existing one — add `category` from the list above.

Wire a filter category if not already covered by the current 15 (see `app/poiCategories.ts` for the current families). New categories may need a new family — coordinate with a matching color + short glyph.

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
