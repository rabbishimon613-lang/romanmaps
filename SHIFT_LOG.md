# Roman Maps — Shift Log

Four 6-hour research shifts per day (00:00, 06:00, 12:00, 18:00 UTC), 7 days a week.
Each shift picks up where the last left off, researches, and pushes real map data.

New entries go on top. Each shift appends its own section.

---

## Shift 7 — 2026-08-12 (12:00–18:00 UTC block)

Started by reading SHIFT_LOG.md's last three entries and the current `SHIFT_BRIEF.md` — found the brief had been completely rewritten since Shift 6's entry (three commits landed between shifts: `d9b8c1d`/`c6bbb29`/`c38415c`, "Shift brief rewrite: 3 expansion axes"), replacing the old numbered priority-queue framing with a new **six-axis** structure. This is the first shift to operate under that new framework, so there was no prior Track A axis-continuation to pick up — read the whole brief fresh and picked two starting axes myself.

While mid-shift, two more brief-rewrite commits landed from the human maintainer (not a shift session) expanding six axes to **twenty** and adding hard per-shift throughput minimums ("touch at least TWO axes, don't stop early"), plus a third landing a new **display-name invariant (1.5)**: no parenthetical alternates, no diacritics in any `name`/`display` field, across every axis. Re-read both before continuing and adjusted scope mid-shift — see the naming-rule correction below.

### Track A — Research & data (four axes touched, 94 new geolocated features)

**Axis 2 — Roadside: Via Appia, 26 stations** (`public/data/road_stations.geojson`, new file). Every mansio/mutatio/statio/vicus from Rome to Brundisium, sourced from the Antonine Itinerary and cross-checked against Pleiades. 14 high confidence, 6 medium, 6 low — the 6 low-confidence/unidentified stations are interpolated along this repo's own `roads_main`/`roads_secondary` line geometry rather than a naive straight-line guess. Rome/Capua/Beneventum omitted since they're already full sites; Tarentum and Brundisium included as the route's previously-uncovered terminus. Delegated to a sub-agent scoped strictly to that one file (no `app/` access); reviewed and spot-checked its output before wiring it in.

**Axis 4 — Living empire: 117 CE people + events** (`public/data/people_117.geojson`, 25 features; `public/data/events_117.geojson`, 17 features — 12 point, 5 polygon). The empire on 11 August 117 CE, the day Trajan died at Selinus and Hadrian was acclaimed at Antioch (both pinned as the map's own timestamp). People: the imperial party, Pliny/Tacitus/Suetonius/Plutarch/Epictetus/Juvenal and other writers, three physicians, two rabbinic sages, three bishops, and the Kitos War's generals on both sides. Events: all four Kitos War theaters, the Parthian War's collapse, the Dacian settlement, Nabataea's annexation, Trajan's building program, and the Antioch earthquake. Corrected two factual errors present in the brief's own seed list while researching — worth flagging since a future shift skimming an old brief draft could repeat them: **Lucius Quietus** is **Lusius Quietus** in every ancient and modern source; **Suetonius** was in Rome in 117, not Antioch — the *ab epistulis* post that would move him east didn't come until c. 121.

**Axis 6a — Systems overlay, trade routes: the Amber Road** (`public/data/trade_routes.geojson`, new file, 10 features: 1 LineString + 9 nodes). Baltic amber coast to Aquileia. The southern Roman leg (Carnuntum → Aquileia) reuses coordinates from this repo's own `roads_main`/`roads_secondary` data so the route's geometry matches what's already drawn on the map; the northern stretch through free Germania has no surviving road bed, and the route's own `notes` field says so plainly rather than implying false precision. Primary source: Pliny, *NH* 37.45 (the equestrian Julianus sent north for amber under Nero). Vindobona was deliberately excluded as a node — it's on a separate Danube road, not this route.

**Axis 11 — Disasters + memory** (`public/data/disasters.geojson`, new file, 16 features). Events still felt or remembered in 117 CE: the Antioch earthquake (115, two years before this map's snapshot — Trajan barely escaped it), Vesuvius (79), Nero's fire (64) and the lesser-known fire + plague under Titus (80), two Tiber floods (15, 69), the 6 CE grain famine, Teutoburg (9 CE), Vercellae (101 BCE), Boudica's sack of Camulodunum (60), the Batavian revolt's siege of Castra Vetera (69), Cremona's destruction (69), the Fire of Lugdunum (65), Josephus's shipwreck (63), and the destruction of the Second Temple (70).

All four data files were researched by sub-agents scoped strictly to one output file each (no `app/` access), so they ran in parallel with each other and with Track B; I reviewed, validated (JSON well-formedness, unique ids, coordinate sanity, source presence), and wired every one in personally before committing.

**Naming-rule correction, mid-shift** (commit `f96d971`): invariant 1.5 landed from the maintainer after I'd already pushed the four files above. Audited all of them against it and fixed the violations in a follow-up commit: `"Tarracina (Anxur)"` → `"Terracina"` (the modern town on the site), `"Pliny the Younger (Tuscan villa)"` → `"Pliny the Younger"` (already disambiguated by its distinct `location_117`), `"Titus Statilius Crito (Criton of Heraclea)"` → `"Titus Statilius Crito"` (moved the alternate name into `one_line` prose so it isn't lost), `"Lukuas (Andreas)"` → `"Lukuas"`, and four Amber Road waypoint nodes that are real living towns today got their modern name as the display (Scarbantia→Sopron, Savaria→Szombathely, Poetovio→Ptuj, Celeia→Celje, Emona→Ljubljana) — each node's `role` text already opens with the ancient name, so nothing was lost. Kept "Sala" in Latin rather than the diacritic-heavy, obscure-village "Zalalövő" — same judgment call the rule's own examples make room for. Left `location_117`/`role`/`notes` prose fields alone; the rule targets display/marker-label fields specifically, not free prose ("accented form may live in the blurb text").

### Track B — Features & UI/UX

Shipped the top unblocked P1 item: **right-click context menu** (`app/ContextMenu.tsx` new, `app/useRuler.ts` new, `app/Ruler.tsx` refactored). "What's here?" drops a temporary red pin + popup showing lat/lng and the nearest known gazetteer place (reuses `app/places.ts`'s 16k-point search index). "Directions from/to here" honestly disabled with the same "coming soon" tooltip `PlaceDetails.tsx` already established for the unshipped Directions feature — didn't fake a route. "Measure distance" hands off to the ruler, seeded with the clicked point, via a new small `useRuler.ts` store (`useSyncExternalStore`-backed, same pattern as `usePoiPanel`/`useLayers`) — `Ruler.tsx`'s previously-local `active` `useState` now reads/writes this shared store so both its own FAB and the context menu drive one measuring session. Long-press (550ms, cancels on >10px move) is the mobile equivalent, since touch has no right-click analogue and the project's own rule requires every feature to work on both. Menu closes on outside click, Escape, or map pan/zoom, and clamps to the viewport edges so it never renders off-screen on a narrow phone.

**Verified in a real browser** (Playwright + the pre-installed Chromium), both 1280×800 desktop and 390×844 mobile viewports: right-click and long-press both open the menu; "What's here?" drops a pin and shows the correct real nearest-place distance; "Measure distance" opens the ruler card with the seeded point; outside-click/Escape/pan all close the menu; the four new Track-A map layers (road stations, people/events, trade routes, disasters) all render real features at their expected zooms with working hover/click popups showing real researched content, and their four new Layers-panel toggles all correctly show/hide their layers (native `setLayoutProperty` for the map layers, a shared `useLayers()` boolean read directly by the new `PeopleMarkers.tsx` HTML-marker component — a cleaner pattern than the old POI approach, see the open item below). `npx tsc --noEmit` and `npm run build` both clean on every commit.

**Operational notes for future shifts** (see `FEATURE_BACKLOG.md`'s "New ideas" section for the full writeups): `research/` is `.gitignore`d and doesn't exist in a fresh cloud clone, so Axis 1 (more cities) needs its Overpass pipeline rebuilt from scratch, not "extended" as the brief's phrasing implies; never run `npm run build` concurrently with a live `next dev` against the same checkout — they collided and corrupted `.next/` mid-shift, costing real debugging time before I traced it; Playwright browser sessions in this sandbox intermittently die mid-multi-step-script ("Target page ... has been closed") independent of memory/disk pressure — splitting into shorter single-assertion scripts and retrying worked every time, not a real product bug.

### Commits this shift

1. `Right-click context menu: What's here?, Directions (disabled), Measure distance` (Track B)
2. `Via Appia road stations + 117 CE people/events — axes 2 and 4` (Track A)
3. `Amber Road trade route + disasters/memory — axes 6a and 11` (Track A)
4. `Fix display names against the new 1.5 naming rule` (Track A correction)

All pushed to `main`, rebasing twice mid-shift onto commits that landed concurrently from elsewhere (the brief rewrites + the sites.ts naming sweep); pre-push build gate ran clean every time.

### Next shift should pick up

- **Track A:** Any axis not yet touched (1, 3, 5, 7–10, 12–20) is fully open — Axis 3 (micro-POIs) has the most detailed brief guidance and nine ready-to-pick sub-categories; Axis 1 (more cities) needs its Overpass tooling rebuilt first (see note above) so budget extra time or pick a different axis. The brief's per-axis minimums table (bottom of `SHIFT_BRIEF.md`) is the floor, not a target — this shift cleared 94 features across four axes in well under the 6-hour budget, so there's real room to go further per shift.
- **Track B:** Directions is still the only unshipped P0 (biggest remaining scope item — real road-network routing). P1 remainders: Share button, Coordinates URL sync, Keyboard shortcuts, Compass, drag-to-expand on the mobile bottom sheet. The vestigial `pois-dot`/`pois-label` MapLibre layers (flagged since Shift 6) are still safe-to-delete dead code — `PeopleMarkers.tsx`'s pattern of gating an HTML-marker component directly off a `useLayers()` boolean (rather than a native layer's visibility) is probably the right template for finally wiring `PoiMarkers.tsx`'s "Landmarks" toggle up to something real.
- **General:** Re-audit any `name`/`display` field written before invariant 1.5 landed (mid-morning today) for stray parens/diacritics — this shift only checked its own four new files, not the pre-existing `pois.geojson`/`sites_buildings.geojson` etc.

---

## Shift 6 — 2026-08-12 (06:00–12:00 UTC block)

Started by reading the last three log entries per the brief, but found the repo had moved significantly past what SHIFT_LOG.md described: five commits landed after Shift 5's own log entry (`f271dd3`) without ever getting logged — `813333f` (Ostia street-level: 1,266 buildings + 251 park paths), `6362bde` (fix selectPoi signature), `1c52cb4` (Ostia/Portus gazetteer fix), `76ceecd` (Deploy Council pre-push build-gate hook, `.githooks/pre-push` + `postinstall` wiring), and `2649fae` (Italia batch — expanded street-level detail from Ostia-only to **40 archaeological sites** across the empire, plus a new `CategoryChips.tsx`/`LeftRail.tsx`/`SitesPanel.tsx`/`PoiMarkers.tsx` UI layer replacing the old flat MapLibre POI dots with clickable pill markers and an "Explore" site-jump panel). Author on those commits is a human (`Pedro Parga Bastos`, co-authored `Claude Opus 4.7`), not a shift session — logging retroactively here since nobody else did, so the next shift isn't confused the way this one briefly was. **Read `app/Map.tsx`, `app/sites.ts`, `app/SitesPanel.tsx`, `app/CategoryChips.tsx`, `app/PoiMarkers.tsx`, `app/LeftRail.tsx` before touching UI code** — the architecture has moved on from what Shifts 2-5 described (POI markers are now HTML `maplibregl.Marker` pins driven by `PoiMarkers.tsx`, not the old flat `pois-dot` MapLibre circle layer, though that layer object still exists in the style with radius/opacity forced to 0 — vestigial, safe to ignore or clean up later). New source files: `public/data/sites_buildings.geojson` (~20MB, all 40 sites' building footprints, OSM-derived) and `public/data/sites_streets.geojson` (~7MB). `public/data/pompeii.geojson` is *still* the original 0-byte placeholder (now doubly dead — Pompeii has both a `pois.geojson` entry from Shift 5 *and* full street-level building detail from the Italia batch, neither of which uses this file).

### Track A — Research & data

**All 28 legionary fortresses for the legions Rome had in 117 CE** (`public/data/pois.geojson`, 100 → 128 features) — priority-queue item 7, the largest item on SHIFT_BRIEF.md's list, untouched since Shift 2 first logged the queue. Delegated to a sub-agent scoped strictly to `pois.geojson` (no `app/` access) so it ran in parallel with this shift's Track B; verified its output before folding in — valid JSON, 128/128 unique ids, full schema conformance, pure-append diff (763 insertions, 0 deletions against the existing 100), spot-checked 6 of the trickier entries' sourcing personally.

Correctly excludes **Legio III Italica** (not raised until c. 165 CE, Marcus Aurelius) and **Legio XXI Rapax** (destroyed c. 92 CE) — neither existed in 117 CE despite being on some casual "28 legions" lists that don't account for the exact year.

**Two corrections to the brief's own starting assumptions** (the brief's priority-queue item 7 listed rough guesses for research to verify, not ground truth — worth noting since a future shift skimming an old brief draft could make the same starting error):
- **Legio III Augusta** — Trajan had already moved it to **Lambaesis** by c. 100 CE, not Theveste.
- **Legio XXX Ulpia Victrix** — its 117 CE base was **Brigetio**, not Vetera; it didn't take over Vetera until 122 CE when Hadrian sent VI Victrix to Britain.

**Genuine transitional-year uncertainty, all flagged in-feature rather than papered over** — several legions were mid-movement during Trajan's Parthian War (114-117 CE) and the Kitos War side-revolt it triggered:
- **I Adiutrix** and **XXX Ulpia Victrix** both pinned at Brigetio (same coordinates) — XXX Ulpia Victrix was the actual 117 CE occupant; I Adiutrix was still returning from the eastern campaign and likely didn't physically reoccupy its long-term fortress until c. 118. `confidence: medium` on I Adiutrix with the gap fully explained.
- **II Traiana Fortis** and **VI Ferrata** both pinned at Caparcotna/Legio (Judaea, near Megiddo) — plausible brief overlap in the same Jezreel Valley camp during this transitional year before II Traiana Fortis continued toward its later Egyptian base. `confidence: low`/`medium`.
- **III Cyrenaica** at Bostra kept `confidence: low` — real scholarly dispute over whether its main body was there in 117 or still on Kitos War suppression duty in Egypt.
- **IX Hispana** kept at Eboracum/York (well-attested for 117 CE itself) with its disputed post-117 fate (traditional "wiped out" story vs. the modern Nijmegen-transfer theory) explicitly left unresolved in the notes — the map only needs to be right about 117, not adjudicate a 1,900-year-old historiographical argument.

Confidence distribution: 16 high, 10 medium, 2 low. 2+ sources per fortress. Sourcing note: this environment's WebFetch egress has apparently opened back up somewhat since the string of `EGRESS_BLOCKED` reports from Shifts 2-5 (no fresh report of it this shift, but the sub-agent still leaned on WebSearch-synthesized citations as its primary method, consistent with prior practice — didn't specifically stress-test direct fetches).

### Track B — Features & UI/UX

Found and fixed two real bugs by reading through the (undocumented, per above) new architecture before adding to it:

1. **Zoom control capped at zoom 10** (`app/ZoomControl.tsx`) — `MAX_ZOOM` was still `10`, a leftover from before the map's own `maxZoom` was raised to `19` for the new street-level site detail (which needs zoom 12-18 to render buildings at all). The on-screen `+` button disabled itself at 10 and lied about being maxed out — scroll/pinch still worked past it, but the primary on-screen control for the app's own flagship new feature couldn't reach the zoom levels that feature needs. One-line fix: `MAX_ZOOM = 19`, matching `Map.tsx`'s real `maxZoom: 19`.
2. **Mobile bottom sheet burying the FAB stack** (new `app/useIsMobile.ts`, used by `ZoomControl.tsx`/`Ruler.tsx`/`Legend.tsx`/`Chrome.tsx`'s Layers button) — flagged as an open bug by Shift 5 ("Mobile bottom-sheet can cover the FAB stack") and still unfixed. The Place details sheet (`zIndex: 7`) sat visually on top of the Zoom/Ruler/Legend/Layers buttons (`zIndex: 5`) on narrow viewports without covering them edge-to-edge, so they looked present but were actually unreachable underneath the sheet. Fix: those four controls now hide themselves while the mobile sheet is open and reappear when it closes, via a small shared `useIsMobile()` hook (deduped out of a private copy that was already living in `PlaceDetails.tsx`). Ruler keeps its measurement readout card visible if the user is mid-measurement rather than yanking it away.

**Verified both in a real browser**, not just typecheck/build: ran `next dev`, drove it with Playwright + the pre-installed Chromium, on both 1280×800 desktop and 390×844 mobile viewports. Desktop: jumped to Ostia at zoom 12, clicked the zoom-in button 8 times, confirmed it climbs cleanly to 19 and disables exactly there (previously would've disabled at 10); confirmed Ostia's street-level buildings (colored building-footprint polygons, previously unreachable via the on-screen control) render correctly once past zoom 12. Mobile: confirmed all four FABs are present before opening a POI, all four disappear the instant the bottom sheet opens, and all four reappear on Esc-close. `npx tsc --noEmit` and `npm run build` both clean before and after.

**Also hit and worked around, not a regression:** my first Playwright pass showed 0 rendered `ostia-buildings-fill` features immediately after a `jumpTo` even at valid zoom — reproduced the exact same false-alarm pattern Shift 5 already diagnosed and documented (`map.queryRenderedFeatures()` right after a programmatic `jumpTo` under headless/software-WebGL doesn't reliably reflect the freshly-loaded tile state). A small `panBy([1,1])` nudge after settling fixed it in my own test; not a code bug, just confirming Shift 5's finding held up under a different scenario.

**Didn't touch:** the vestigial `pois-dot`/`pois-label` MapLibre layers in `Map.tsx` (radius/opacity forced to 0, superseded by `PoiMarkers.tsx`'s HTML markers per the Italia-batch UI rework — dead code, safe to remove but out of scope for a bug-fix-focused Track B pass); Directions (still the only unshipped P0); the `next@14.2.5` security advisory (still flagged every shift since Shift 2, still someone's deliberate off-shift call).

### Commits this shift

1. `Fix zoom cap stuck at 10 and mobile bottom-sheet burying the FAB stack` (Track B)
2. `Legionary fortresses: all 28 legions Rome had in 117 CE (Track A)`

Both pushed to `main`; pre-push build gate (new since last logged shift — see architecture note above) ran clean on both.

### Next shift should pick up

- **Track A:** Amphitheaters beyond the Colosseum (priority queue item 6 — Verona, Nîmes, El Djem, Pula, Pozzuoli; note Verona and Pozzuoli/Puteoli now have street-level site detail from the Italia batch but likely still need individual `pois.geojson` landmark entries the same way other sites do) is the last fully-untouched priority-queue item. Otherwise: the systematic gazetteer audit flagged by Shifts 3-4 (script-check every notable ancient-city name against `places_medium.geojson`) is still open, and a full research pass on the 40-site `sites.ts` roster for cited `pois.geojson` landmark entries (most of those 40 sites currently only have the OSM-derived building layer + a one-line blurb in `sites.ts`, not proper cited POI records) would meaningfully deepen what's already the app's biggest visual feature.
- **Track B:** Directions (the only unshipped P0, road-network routing — biggest remaining scope item), Coordinates URL sync or Keyboard shortcuts (both P1, well-bounded, didn't get to them this shift after the bug-fix detour), right-click context menu (P1), or cleaning up the vestigial `pois-dot`/`pois-label` MapLibre layers noted above now that `PoiMarkers.tsx` has fully superseded them.
- **General:** whoever does hands-on UI work next should budget time to actually read through `app/Map.tsx`, `app/sites.ts`, `app/SitesPanel.tsx`, `app/CategoryChips.tsx`, `app/PoiMarkers.tsx` first — the architecture changed more between Shift 5's log entry and now than in the four shifts before it combined, and none of it was logged until this entry. Also: **update `FEATURE_BACKLOG.md`** to reflect the Italia-batch UI work (Explore panel, category filter chips, HTML pill markers) — none of it is listed there either, despite being shipped and live.

---

## Shift 5 — 2026-08-12 (00:00–06:00 UTC block)

Read the last two entries before starting. Shift 4's "Next shift should pick up" left Track A pointing at Pompeii/Herculaneum (priority queue item 3, `public/data/pompeii.geojson` still a 0-byte placeholder) or legionary fortresses (item 7), and Track B pointing at POI category icons + legend plus the POI-dots-buried-under-roads visibility bug. Did both, paired directly — the visibility fix and the icon/legend work share the same underlying color-mapping change, so did them as one Track B unit rather than two.

### Track A — Research & data

**Pompeii & Herculaneum, 16 new POI features** (`public/data/pois.geojson`, 84 → 100, pure append — verified programmatically: all 84 pre-existing features byte-identical, zero removed, 16 new unique ids, no duplicate ids across the whole file). Delegated to a sub-agent scoped strictly to that one file (no `app/` access) so it could run in parallel with Track B; reviewed and validated its output before folding in.

Every new feature has `"extant_117ce": false, "destroyed": 79` — both cities were buried in the 79 CE eruption of Vesuvius, 38 years before this map's 117 CE snapshot, so per the brief's own priority-queue item 3 framing they're geographically pinned as context but correctly filtered out of the live `pois-dot` render (the layer's existing `extant_117ce == true` filter handles this with no code change needed).

Coverage — **Pompeii** (10): city-center pin, Forum, Amphitheatre (~70 BCE, one of the oldest known Roman amphitheaters), Temple of Jupiter (Capitolium), Temple of Apollo, Basilica, Stabian Baths, the Large Theatre (Teatro Grande), House of the Vettii, Villa of the Mysteries, Porta Marina gate. **Herculaneum** (6): city-center pin, College of the Augustales, Suburban Baths, House of the Deer, Villa of the Papyri.

**Sourcing:** primary-source anchor is Pliny the Younger's eyewitness letters to Tacitus (*Epistulae* 6.16 and 6.20) on both city-level entries, cross-referenced with archaeological literature (Pompeii Archaeological Park's official site, Herculaneum Society/Oxford, Britannica, Madain Project) — 2+ sources per feature. WebFetch to the usual reference domains was untested-but-assumed-blocked given the unbroken run of prior shifts hitting `EGRESS_BLOCKED`; went straight to WebSearch's synthesized results, same fallback as every prior shift.

**Judgment calls (logged in-feature):**
- Added a general "city center" pin for both Pompeii and Herculaneum, not just individual landmarks — reasoned useful for search/wayfinding since every other POI in the file is a specific building with no anchor for the settlement itself. New `city` category, only used here so far.
- **Villa of the Papyri** → `confidence: low`, explicit coordinate caveat: most of the villa is unexcavated or below the water table; the pin marks the excavated-atrium area reached via Bourbon-era tunnels, not a confirmed full-villa centroid.
- Temple of Apollo, Large Theatre, House of the Vettii, Villa of the Mysteries, Porta Marina → `confidence: medium` (real scholarly spread on exact construction phasing for several; coordinates not independently re-verified against Pleiades given the egress situation).
- Deliberately skipped a separate Forum Baths entry (brief said "Stabian and/or Forum") to stay inside a 12–18 feature target without padding — one bathhouse per city plus Herculaneum's Suburban Baths felt sufficient.
- Left `public/data/pompeii.geojson` (the pre-existing 0-byte placeholder flagged by Shifts 2–4) untouched — the brief's schema puts POI data in `pois.geojson`, and every prior shift's Pompeii-adjacent work already follows that, so the placeholder is dead weight, not a gap. A future shift could just delete it, or repurpose it for something else — flagging rather than deleting unilaterally.

**Schema note:** three more categories introduced — `house` (private domus), `villa` (suburban/extramural villas), `collegium` (civic/cult-association hall, distinct from a standalone `temple`) — plus first real use of `city` for settlement-level pins. Nothing enforces a closed enum, same as every prior shift's practice; Track B below finally gives every category a defined color via a shared module, so any future new category needs a line added there (falls back to a default maroon otherwise, doesn't break).

**Deliberately excluded** (researched, judged not to add): the Mithraeum of the Seven Spheres and Mitreo di Fructosus at Ostia are a different site (already correctly excluded by Shift 3, not re-litigated here); no Pompeii/Herculaneum equivalent mithraea were added since none turned up with 117 CE-relevant framing distinct from the eruption-destruction story already told by the city-level pins.

### Track B — Features & UI/UX

Shipped **POI category icons + legend**, and folded in the **POI-dots-buried-under-roads** visibility fix Shift 4 flagged, since both are one underlying change:

1. **`app/poiCategories.ts`** (new) — single source of truth for category → color, replacing the duplicate `CATEGORY_COLORS` maps that had drifted slightly between `app/Map.tsx` (didn't have one — flat maroon) and `app/PlaceDetails.tsx` (had one, chip-only). Groups ~30 raw `pois.geojson` categories into 15 visual families (Temples & shrines, Baths, Theatres & arenas, Civic & government, Palaces, Ports & harbors, Aqueducts, Forts, Mines, Libraries, Monuments, Tombs, Markets, Roads/bridges/gates, Fountains) so the legend stays short and legible even as categories keep growing shift over shift. `PlaceDetails.tsx`'s chip now imports `colorForCategory()` from here instead of keeping its own copy.
2. **`app/Map.tsx`** — `pois-dot` layer's `circle-color` is now a MapLibre `match` expression driven by category (was a flat `#8b1a1a` for every single POI regardless of type). Also bumped `circle-radius` (3→4 at zoom 3, 7→8.5 at zoom 8) and `circle-stroke-width` (1.5→2.2) — directly fixes Shift 4's "POI dots buried at dense road intersections" note (Forum Romanum sitting right on Rome's road hub was nearly invisible before). Verified in-browser: the Rome road-convergence cluster and the Ostia/Portus cluster both now show clearly differentiated, legible colored dots (green aqueducts, blue ports/baths, maroon temples/monuments) instead of a single indistinguishable maroon smear.
3. **`app/Legend.tsx`** (new) — collapsible Google-Maps-style legend panel, bottom-right FAB stacked above the Ruler button (Zoom → Layers → Ruler → Legend, bottom-to-top), lists all 15 category groups with color swatches. Closed by default so it doesn't compete with the epoch pill for attention on first load. Wired into `app/page.tsx`.

**Verified in a real browser**, not just typecheck/build: ran `next dev`, drove it with Playwright + the pre-installed Chromium. Confirmed the legend opens/closes on both desktop (1280×800) and mobile (390×844) viewports with the full 15-item color-swatch list; confirmed clicking a POI still opens the details panel with a chip color that matches its legend/map-dot color (spot-checked "Aquae Claudia et Anio Novus" → green Aqueduct chip, matching the map dot and legend swatch); confirmed the new larger/colored dots render correctly over dense road convergences at Rome and Ostia via real mouse-wheel zoom interaction. `npx tsc --noEmit` and `npm run build` both clean.

**Found and ruled out, not a regression:** while testing, `map.queryRenderedFeatures()` calls made immediately after a programmatic `map.jumpTo()` intermittently returned 0 features for `pois-dot` even though the layer, source, filter, and paint were all provably correct (confirmed via `getPaintProperty`/raw-source-data checks, and via a screenshot that *did* show correctly-colored dots). Isolated this by `git stash`-ing back to the untouched Shift-4 `HEAD` and reproducing the identical 0-rendered result there — so it predates this shift and isn't caused by this change. A real mouse-wheel zoom sequence (instead of instant `jumpTo`) reliably rendered 47/47 expected features every time. Read as headless/software-WebGL query-timing flakiness specific to this sandboxed test environment (console logs show `Automatic fallback to software WebGL` + `GPU stall due to ReadPixels` on every run) rather than a real user-facing bug — real interaction (wheel/drag) always triggers the repaints `jumpTo`-then-immediately-query does not reliably wait for. Not fixed (nothing in shipped code to fix), just documented here in case a future shift's browser-testing hits the same false alarm.

**Didn't touch:** the mobile bottom-sheet Place Details panel spans full viewport width when open (`left:0, right:0`) and, at `maxHeight: 55vh`, can sit on top of the FAB stack (Legend/Ruler/Layers/Zoom) on short mobile viewports — noticed while testing, pre-existing since Shift 4 shipped the panel, not introduced this shift. Logged as a new backlog item below rather than fixed inline, since fixing it well probably means the FABs move above the sheet or into it, a small design call worth its own pass. Right-click context menu and Directions remain untouched, same as every prior shift's notes.

### Commits this shift

1. `Add 16 Pompeii/Herculaneum POIs (Track A)` — `public/data/pois.geojson`
2. `POI category icons + legend, fix dots buried under roads (Track B)` — `app/poiCategories.ts`, `app/Map.tsx`, `app/PlaceDetails.tsx`, `app/Legend.tsx`, `app/page.tsx`

### Next shift should pick up

- **Track A:** Legionary fortresses (priority queue item 7 — 28 legions, still fully untouched) is the largest remaining priority-queue item. Amphitheaters beyond the Colosseum (item 6 — Verona, Nîmes, El Djem, Pula, Pozzuoli) is a smaller, well-bounded alternative. The systematic gazetteer audit Shift 4 flagged (script-check every notable ancient-city name against `places_medium.geojson` rather than discovering gaps one city at a time) is still worth doing and hasn't been picked up by anyone yet.
- **Track B:** Mobile bottom-sheet-vs-FAB-stack overlap (new note above — Place Details panel can cover the Legend/Ruler/Layers/Zoom buttons on short mobile viewports when open), Directions (the other still-open P0, bigger scope — road-network routing), or right-click context menu (P1). The Layers panel could also grow real per-category POI toggles now that `app/poiCategories.ts` gives every category a stable group id — currently Layers only has one blanket "Landmarks" toggle for all POIs.
- **General:** WebFetch egress has now been blocked (or assumed blocked, going straight to the WebSearch fallback) across 5 consecutive shifts — still worth someone outside the shift loop actually looking at the network policy rather than every shift re-logging the same workaround.

---

## Shift 4 — 2026-08-11 (18:00–00:00 UTC block)

Read the prior two entries before starting. Shift 3's "Next shift should pick up" pointed at provincial capitals (priority queue item 4) for Track A and either POI icons/legend or the Place details panel for Track B — did both, plus an unplanned but higher-leverage Track A find (see below).

### Track A — Research & data

**Before picking a scope**, verified Shift 2's "Londinium missing from the gazetteer" note myself by bounding-box-searching `public/data/places_medium.geojson` (16,315 pts) and `places_high.geojson` (9,844 pts, still unwired/unused) around the real coordinates of several major cities. Found it wasn't a Londinium-specific gap: **Roma, Alexandria, Ephesus, Corinthus, and Lugdunum(-Lyon) were all completely absent as named points too** — only minor satellite settlements/villas/temples near each survive in this particular DARE export. Worse, the file *does* contain a feature literally named `"Lugdunum"` — but at `[4.394802, 52.225647]`, which is Lugdunum Batavorum near Katwijk, Netherlands, a much more minor town, not Lyon. A real "search returns the wrong Lugdunum" trap. Re-scoped this shift's Track A around fixing this + provincial capitals together, since they're the same underlying task.

**Gazetteer fix** (`public/data/places_medium.geojson`, 16,315 → 16,324 features, commit `95ab620`): added 9 Point features — Roma, Londinium, Alexandria, Ephesus, Corinthus, Lugdunum (the real Gallic one, Fourvière hill, Lyon), Carthago Nova, Antiochia, Colonia Claudia Ara Agrippinensium (Cologne) — ids `900001`–`900009` (a block well outside the DARE import's own id range, to avoid ever colliding with a future re-import). Set `major: 1` on all nine — the first real use of that field anywhere in the file (all 16,315 prior entries have `major: 0`), which directly boosts these in `app/places.ts`'s search ranking. The pre-existing Batavian `Lugdunum` was left completely untouched. **Verified live**: searching "Roma" now surfaces Roma/Today: Rome top-of-list; "Londinium" flies to London; "Lugdunum" now returns the real Lyon capital *first* (major-boosted) with the Batavian one second, instead of only the wrong one.

**30 landmark POIs for 8 of those 9 capitals** (`public/data/pois.geojson`, 54 → 84, pure append, commit `7de1b03`) — Rome itself got no new POIs (already has 35 from Shift 2; only its gazetteer point was missing). Delegated the research to a sub-agent scoped strictly to the two data files (no `app/` access) so it could run in parallel with Track B; reviewed its output before folding in — valid JSON, 84/84 unique ids, full schema conformance, pure-append diff (813 insertions, 0 deletions/modifications against the existing 54), coordinates sanity-checked per city.

Coverage: **Londinium** — Forum/Basilica, Governor's palace (Praetorium), Cripplegate fort, the Thames bridge crossing. **Alexandria** — Pharos lighthouse, Serapeum, Library/Mouseion, Heptastadion. **Ephesus** — Great Theatre, Library of Celsus, Temple of Artemis, Temple of Hadrian. **Corinthus** — Temple of Apollo, Fountain of Peirene, Julian Basilica, Isthmian sanctuary of Poseidon. **Lugdunum** — Amphitheatre of the Three Gauls, theatre, Altar of Rome and Augustus, Aqueduc du Gier. **Carthago Nova** — theatre, augusteum, forum, the imperial silver/lead mines. **Antiochia** — Circus, theatre, Temple of Apollo at Daphne. **Colonia Agrippinensis** — Praetorium, city wall, Ubii watchtower/monument.

**`extant_117ce: false` calls (4), all explained in-feature notes:**
- **Londinium Forum-Basilica** — dating evidence puts completion ~122 CE, plausibly timed to Hadrian's visit that year; almost certainly still under construction at Trajan's death. Kept per the Pantheon-precedent the last two shifts established.
- **Cripplegate Fort** — stone fort dated c. 120 CE (Hadrianic), no attested earlier phase on the site.
- **Library of Celsus (Ephesus)** — genuine source disagreement on exact completion (some say functionally done by 117, others say full completion with facade sculpture wasn't until ~135 under Aquila's heirs); followed the cautious read, `confidence: medium`, both sides cited in notes.
- **Temple of Hadrian (Ephesus)** — can't predate Hadrian's accession (8 Aug 117) under any reading; kept on the map anyway since it's directly tied to the snapshot's pivot event, same logic as Shift 2's Mausoleum of Hadrian call.

**Notable research finds:** Alexandria was mid-suppression of the **Kitos War** revolt at the literal moment of the snapshot — Cassius Dio records Marcius Turbo putting it down in August 117, the same month as Trajan's death; flagged as context on the Library/Mouseion entry without overclaiming specific building damage (no source tied the revolt's destruction to named landmarks). Antioch's Circus entry is directly attested by **Cassius Dio 68.25** — Trajan sheltered there during the 13 Dec 115 CE earthquake, escaping through a window — bumped to `confidence: high` on that primary-source basis; the adjacent theatre entry notes the city was still only ~20 months into earthquake recovery at 117 CE. The Aqueduc du Gier's construction date is a genuine decades-long French-scholarship dispute (Claudian → Hadrianic → Claudian again → a 2018 dendrochronology study back to Trajanic c. 110 CE) — kept `true`/`confidence: low` rather than picking a side.

**Deliberately excluded** (researched, not enough to stand up a record): Cologne's Ara Ubiorum (sources say it's untraceable in later Roman Cologne, too speculative to pin a point), a separate Antioch forum/bath complex (no verifiable coordinates found), Corinth's Herodes Atticus-era Peirene facade (that's a 150s CE remodel, not what stood in 117 — kept the earlier fountain-house phase instead and said so in the note).

**Schema note:** three more categories introduced (`bridge`, `fountain`, `wall`), plus first real use of `fort` and `mine` from the brief's own example list. Nothing enforces a closed enum, consistent with Shift 3's precedent.

**Egress**: same `EGRESS_BLOCKED` pattern on WebFetch as the last three shifts (Pleiades, Wikipedia, LacusCurtius, etc. all unreachable) — this is now 4 for 4 shifts today. Went straight to WebSearch's synthesized snippets, same fallback as before. **Escalating again**: if a fifth shift starts and this is still blocked, it's worth someone outside the shift loop actually fixing the egress policy rather than each shift re-discovering and re-logging the same workaround.

### Track B — Features & UI/UX

Shipped the P0 **Place details panel** (`app/PlaceDetails.tsx` + `app/usePoiPanel.ts`, commit `be052c6`) — the last unchecked P0 item, flagged as the natural next step by both Shift 2 and Shift 3. Replaced the Maplibre click-popup on `pois-dot` entirely with a real React panel: slides in from the left on desktop (positioned below the search card — not yet a full search-bar-becomes-header merge like real Google Maps, flagged as a follow-up idea below), becomes a non-draggable bottom sheet on mobile (`<640px`). Shows a category chip (small per-category color dot — a lightweight stopgap for the still-open "POI category icons + legend" item, not the full icon/legend system), built/destroyed dates, an "Not standing in 117 CE" badge when `extant_117ce: false`, province/modern-location line, notes, linked sources, and a sourcing-confidence line. Clicking empty map space or pressing Esc closes it (verified no race with the `pois-dot`-specific click handler — both query the render state at the same point, so selection always wins over the close-on-empty-click handler when a POI is actually hit). "Directions to here" is present but honestly disabled with a "coming soon" tooltip, since Directions itself hasn't shipped — didn't fake a route. Wired via a new tiny `usePoiPanel` store (`useSyncExternalStore`, same pattern as `useUnits`/`useLayers`) so `Map.tsx` and the new panel component stay decoupled.

**Verified in a real browser**, not just typecheck/build: ran `next dev`, drove it with Playwright + the pre-installed Chromium (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`), on both 1280×800 desktop and 390×844 mobile viewports. Screenshotted: panel opening with real content (Circus Flaminius), closing on outside-click, closing on Esc, the mobile bottom-sheet variant (Synagoga Ostiensis), and — after Track A landed — the new Londinium POIs opening correctly with the new "Bridge" category. Regression-checked ruler (still measures correctly, no interference from the new map click handler) and zoom/layers controls (unaffected). `npx tsc --noEmit` and `npm run build` both clean. Reverted a spurious `package-lock.json` diff from `npm install` under a different npm version (same non-issue Shift 3 flagged and fixed once already — happens every time `npm install` runs fresh in a new container; a future shift shouldn't need to re-discover this, just always diff-check `package-lock.json` before committing).

**Observed but not fixed:** several `pois-dot` points sit almost exactly on top of dense road convergences at low zoom (e.g. Forum Romanum right at Rome's road-network hub) and are visually hard to spot despite rendering above the roads in z-order — noted as a backlog item, natural to pair with the category-icon work.

### Commits this shift

1. `Place details slide-in panel (Track B)` (`be052c6`)
2. `Fix missing imperial-capital entries in the search gazetteer (Track A)` (`95ab620`)
3. `Add 30 landmark POIs for 8 provincial capitals (Track A)` (`7de1b03`)

All pushed to `main` mid-shift as each piece was verified, not batched to the end.

### Next shift should pick up

- **Track A:** Only 9 of the provincial-capital-tier gazetteer gaps were checked and fixed this shift (the ones on the brief's own priority-queue item-4 list). A systematic audit — script-check every notable ancient-city name against the gazetteer rather than discovering gaps one city at a time — is still worth doing. Otherwise: the three great baths of Rome (priority queue item 5, still untouched), legionary fortresses (item 7, 28 legions, still untouched), or Pompeii/Herculaneum (item 3, `public/data/pompeii.geojson` is still a 0-byte placeholder).
- **Track B:** POI category icons + legend (now has a natural seed — the details panel's per-category color-dot mapping in `PlaceDetails.tsx`), the POI-dots-buried-under-roads visibility issue noted above, "Directions" itself (the other still-open P0 — bigger scope, road-network routing), or right-click context menu (P1, includes a "Measure distance" trigger for the existing ruler).
- **General:** WebFetch egress has now been blocked for 4 consecutive shifts across at least 3 different administrators' worth of research — worth escalating outside the shift loop rather than continuing to route around it silently.

---

## Shift 3 — 2026-08-11 (12:00–18:00 UTC block)

Read the last two shift entries before starting; picked up exactly where Shift 2 left off (its `Next shift should pick up` pointed at Ostia for Track A and the Layers panel / zoom fix for Track B — did both).

### Track A — Research & data

**Ostia Antica + Portus, 19 new POI features** (`public/data/pois.geojson`, 35 → 54 total, pure append — the existing 35 Rome features are untouched). Delegated to a sub-agent scoped strictly to that one file so it could run in parallel with Track B; reviewed and spot-checked its output (JSON validity, unique IDs, sourcing, coordinate sanity against the real Ostia/Portus archaeological areas, live in-browser render + popup check) before folding it in.

Coverage: **Portus** — Claudian harbor basin (42 CE), Trajan's hexagonal inner basin (~100–112 CE, high confidence via Pleiades), the Portus lighthouse/Pharos, the Fossa Traiana canal, Isola Sacra necropolis. **Ostia** — Forum, Temple of Rome and Augustus, Piazzale delle Corporazioni, the Augustan-phase Theatre, Grandi Horrea, Horrea of L. Hortensius, the Decumanus Maximus, Porta Romana and Porta Marina gates, the Ostia synagogue.

**Judgment calls, all logged in-feature (`notes`):**
- **Baths of Neptune** and **Terme di Porta Marina** → both `extant_117ce: false`. Verified via brick-stamp/dedication evidence that the famous mosaic-floored Baths of Neptune are Hadrianic (started ~117–120, dedicated 138/139 under Antoninus Pius), not the Domitianic-era bath that actually stood on the same footprint in 117 — a real and easy trap (most casual sources just say "Baths of Neptune, Ostia" without the date caveat).
- **Ostia Capitolium** → `extant_117ce: false` (Hadrianic, c. 120 CE), noting an earlier Republican-era Capitoline-triad temple occupied the site at 117.
- **Palazzo Imperiale (Portus)** → `extant_117ce: false`, flagged as the most debatable call: built 112/114–120 CE, spanning Trajan's death, treated like the Pantheon precedent (not certainly finished) but a good-faith case exists for the other read since a majority of an 8-year build was probably standing by year 5.
- **Ostia synagogue** → kept `extant_117ce: true` but `confidence: low` — genuine scholarly dispute on founding date (Squarciapino's Claudian-era dating vs. L. Michael White's private-house-first argument vs. Runesson's alternative), didn't pick a side, said so.
- Researched but deliberately **excluded** (postdate 117, not padded in): Mithraeum of the Seven Spheres (~160–170 CE), Mitreo di Fructosus (~120–125 CE), the Portus amphitheater (2nd–early 3rd c.), and the Commodus/Severus-era enlargement of Ostia's theatre.

Sources: Pleiades, Suetonius, Cassius Dio, Meiggs *Roman Ostia* (cited by author/title, couldn't fetch full text), the Portus Project (Keay, Millett, Strutt), Squarciapino/White/Runesson on the synagogue question, Wikipedia only as a cross-check pointer. **Network egress blocked WebFetch for essentially every relevant domain this shift** — pleiades.stoa.org, ostia-antica.org, portusproject.org, ostiaantica.cultura.gov.it, en.wikipedia.org, britannica.com, romanports.org all returned `EGRESS_BLOCKED` — so citations to those are real URLs surfaced by WebSearch's synthesized snippets, not independently re-verified by direct fetch. This is the third consecutive shift to hit this (Shift 2 had the same issue with LacusCurtius/Platner) — **worth a future shift checking whether egress can be opened for at least the core reference domains** (Pleiades, ostia-antica.org, LacusCurtius), since it's now a recurring tax on every Track A shift's confidence levels.

**Schema note:** the new Ostia/Portus features introduced a few categories not in SHIFT_BRIEF.md's example list (`canal`, `palace`, `necropolis`, `market`, `warehouse`, `road`, `gate`, `synagogue`) — reasonable since nothing in the app enforces a closed enum (Map.tsx only filters on `extant_117ce`), but flagging in case a future shift wants to formalize the category list once POI category icons (see below) start depending on it.

### Track B — Features & UI/UX

Shipped the two P1 items Shift 2 flagged as next-up:

1. **Zoom control polish** (`app/ZoomControl.tsx`) — Shift 2 had found that `globals.css`'s `.maplibregl-ctrl-bottom-right { display: none }` was hiding the default MapLibre `NavigationControl`, leaving no visible zoom UI at all. Removed the now-dead `NavigationControl` from `Map.tsx` (it was invisible and did nothing) and built a real custom control: stacked +/− buttons, same card shadow as the search box, disabled/dimmed state at min/max zoom, animated `zoomTo`. Sits at bottom-right, below the Layers button.
2. **Layers panel** (`app/useLayers.ts` + panel wired into `Chrome.tsx`) — the Layers button was a non-functional mock; it now opens a real Google-Maps-style checklist panel toggling five layer groups — Roads, Rivers & lakes, Province borders, Cities & towns, Landmarks (POIs) — each backed by real `map.setLayoutProperty` visibility changes, persisted to `localStorage` under `roman-maps:layers` via a `useSyncExternalStore` store (same pattern as `useUnits`). Fortifications/Aqueducts/Legions aren't toggles yet since there's no dedicated data/layer for them independent of the general POI layer.

**Verified both in a real browser** (not just typecheck/build): ran `next dev`, drove it with Playwright + the pre-installed Chromium, screenshotted zoom in/out, the Layers panel open/closed and each checkbox actually hiding/showing its layer (screenshotted roads disappearing on uncheck), on both a 1280×800 desktop viewport and a 390×844 mobile viewport. Also regression-checked the existing units toggle, ruler, and search bar — all still work, no console errors introduced (one pre-existing `favicon.ico` 404 unrelated to this shift's changes, left alone). Fixed one `useSyncExternalStore` `getServerSnapshot`-should-be-cached warning in `useLayers.ts` while building it (was allocating a new object every call; now a stable module-level constant). `npx tsc --noEmit` and `npm run build` both clean.

**Also fixed in passing:** `package-lock.json` picked up spurious diff noise from a local `npm install` under a different npm version (dropped `libc` fields from optional-dependency entries) — reverted, not a real dependency change, and per the brief deps aren't something to touch unilaterally. Added `tsconfig.tsbuildinfo` (a local build artifact, was untracked and about to get committed accidentally) to `.gitignore`.

**Didn't touch:** the `next@14.2.5` security advisory Shift 2 flagged (still someone's deliberate call to make, not a Track A/B task); POI category icons + legend (backlog item, still open — flagged as a good next pairing now that Ostia/Portus roughly doubles the POI categories in play); the dead "Directions" button in the search bar chrome (that's the unshipped P0 "Directions" feature, out of scope this shift).

### Commits this shift

1. `Zoom control polish + Layers panel toggles` (Track B, pushed mid-shift once verified)
2. `Add 19 Ostia/Portus POIs (Track A)` (this commit — see diff)

### Next shift should pick up

- **Track A:** Provincial capitals (priority queue item 4 — Lugdunum, Carthago Nova, Alexandria, Antiochia, Ephesus, Corinth, Londinium, Colonia Agrippinensis) is the next unclaimed priority-queue item; recall Londinium is still missing from the `places_medium.geojson` gazetteer (Shift 2's finding, still unfixed) so budget time to source it directly from Pleiades if picking that city. Alternatively, the three great baths of Rome (priority queue item 5) or legionary fortresses (item 7) are still untouched. Also worth escalating the recurring WebFetch egress block (now 2-3 shifts running) to whoever administers this environment.
- **Track B:** POI category icons + legend (color-coded or glyph dots per category, tied to a small legend UI — natural next step now that Layers panel exists and POI categories have grown past the original 14), the "Place details panel" P0 item (replace the Maplibre click-popup with a real slide-in left panel + wire "Directions to here"), or right-click context menu (P1).

---

## Shift 2 — 2026-08-11 (00:00–06:00 UTC block, run started ~06:xx UTC)

SHIFT_LOG.md had no prior entries when this shift started (only the header), so I followed the brief's "no prior shift log" priority queue and started at item 1 (Rome itself).

### Track A — Research & data

Created `public/data/pois.geojson` from scratch (didn't exist before) — **35 features**, all inside the city of Rome, 117 CE snapshot. Delegated the research to a sub-agent scoped strictly to that one file (no `app/` edits) so it could run in parallel with Track B; I reviewed its output before wiring it in.

Coverage: Forum Romanum complex (Curia Julia, Basilica Julia, Basilica Aemilia, Temple of Saturn, Temple of Vesta, Atrium Vestae, Temple of Castor & Pollux, Temple of Divus Julius, Temple of Concord, Regia, Rostra), Capitoline (Temple of Jupiter Optimus Maximus, Tabularium), Palatine (Domus Augustana, Domus Flavia), Arch of Titus, Circus Maximus, Colosseum, Theatre of Marcellus, Circus Flaminius, the whole Trajanic complex (Forum, Markets, Column, Bibliotheca Ulpia, Baths), Baths of Titus, Baths of Nero, Mausoleum of Augustus, Ara Pacis, Domus Aurea (kept as context, buried by 117), Porta Maggiore aqueduct crossing, Aqua Virgo terminus.

**Two deliberate judgment calls, both logged in the features' own `notes`:**
- **Pantheon** → `extant_117ce: false`. Domitian's rebuild burned again in 110 CE (Cassius Dio 66.24); brick-stamp dating (Hetland, "Dating the Pantheon", JRA 2007) puts the current rotunda as started under Trajan but still under active construction at his death (8 Aug 117) — not dedicated until after 125 CE under Hadrian. Kept on the map per the guardrail for commissioned-but-unfinished work, flagged as a construction site at the snapshot moment.
- **Mausoleum of Hadrian** (future Castel Sant'Angelo) → `extant_117ce: false`. Brick-stamp evidence points to construction starting c. 123–130 CE, not literally at Hadrian's 117 accession as the brief's framing implied — corrected that nuance in the feature's notes. Completed 139 CE, after Hadrian's own death. Kept because Hadrian's accession is the event that closes this snapshot.

Sources used across the batch: Pleiades, Cassius Dio, Pliny NH, Wikipedia (cross-checked against cited archaeological literature, not taken standalone), ToposText, Digital Augustan Rome, Smarthistory, romanaqueducts.info, ancienttheatrearchive.com. Direct LacusCurtius/Platner fetches were blocked by this environment's network egress policy, so those citations are by title/URL from indexed search rather than a live fetch — worth a follow-up shift re-verifying a few of the `medium`-confidence entries (Atrium Vestae, Domus Flavia, Bibliotheca Ulpia, Baths of Nero, Ara Pacis) directly against Platner/LacusCurtius or Pleiades once egress allows it.

I validated the file after the sub-agent finished: valid JSON, 35/35 unique IDs, every feature has ≥1 source and a valid `confidence`, coordinates all fall in the expected Rome bounding box (lng 12.46–12.52, lat 41.88–41.91).

**Data gap found (not fixed, flagging for a future shift):** the base gazetteer `public/data/places_medium.geojson` (~16.3k points, powers the new search bar) has **no entry for Londinium/London at all**. That's a real hole in the underlying DARE-derived import, not something to patch by hand in this file — a future Track A shift should look at whether `places_high.geojson` (currently unused/unwired, 9,850 lines) covers it, or whether it needs sourcing from Pleiades directly. Also affects backlog item "Onboarding hint" which suggested "Try 'Londinium'" as an example — flagged there too.

### Track B — Features & UI/UX

Shipped all three P0 foundational items:

1. **Units toggle** (`app/useUnits.ts`) — `useUnits()` hook backed by a module-level store + `useSyncExternalStore`, so every consumer (search results later, ruler now) stays in sync without prop drilling or context. Persists to `localStorage` under `roman-maps:units`. Surfaced in the hamburger menu (previously a dead button) as a "Distance units" dropdown panel, Kilometers/Miles segmented control, Google-Maps settings-menu style.
2. **Ruler tool** (`app/Ruler.tsx`) — new floating-action button stacked above the (currently mock) Layers button, bottom-right. Click to activate, click points on the map to measure (great-circle haversine), live total + per-leg breakdown in the current unit, Copy total / Clear buttons, Esc/right-click/(suppressed-)double-click to end. Draws the line + point markers directly via MapLibre sources/layers using the same `window.__map` escape hatch Map.tsx already exposes.
3. **Search bar** (`app/places.ts` + wiring in `app/Chrome.tsx`) — loads+flattens the 16k-place gazetteer once (module-level cache so repeated typing doesn't re-fetch/re-parse), fuzzy-scores exact/startsWith/includes matches with a boost for `major` places, dropdown with pin icon + Latin name + "Today: <modern>" subtitle, full keyboard nav (↑/↓/Enter/Esc), click or Enter flies the map to the result via `flyTo`.

Also wired the new `pois.geojson` into `app/Map.tsx` (brief's instruction #5 — "once one shift adds POIs, subsequent shifts just append features"): a `pois-dot`/`pois-label` layer pair, filtered to `extant_117ce == true` (so the Pantheon/Mausoleum of Hadrian construction-site entries correctly don't render), click opens a popup with name, English name, built year, and notes. This isn't the full "Place details panel" backlog item (that wants a Google-Maps-style slide-in left panel) — left that unchecked and noted the partial state.

**Verified all three in a real browser**, not just typecheck/build: ran `next dev`, drove it with Playwright + the pre-installed Chromium (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome` — note the versioned subdirectory, `/opt/pw-browsers/chromium/...` doesn't exist), screenshotted the units toggle changing and persisting to `localStorage`, the ruler drawing a line with a live "430 mi" readout, the search dropdown filtering/flying, and the new POI dots + click popup rendering over Rome. `npx tsc --noEmit` and `npm run build` both clean.

**Also noticed, not fixed:** `globals.css` has `.maplibregl-ctrl-bottom-right { display: none; }`, which hides the default MapLibre zoom control Map.tsx adds — there's currently no visible zoom UI at all (scroll/pinch/keyboard still work). Left as-is since the real fix is the P1 "Zoom controls polish" backlog item (build the custom Google-style stacked +/– buttons), not a one-line CSS revert; noted it there for whoever picks that up.

**Didn't touch:** `package.json`/deps (npm flagged `next@14.2.5` has a known security advisory — noting it here per guardrails rather than upgrading unilaterally; someone should evaluate a Next.js patch upgrade deliberately, off-shift, since it's not a data or Track-B-scoped change), `roads_high.geojson`/`roads_low.geojson` (appear superseded by `roads_main`/`roads_secondary`, which is what Map.tsx actually loads — didn't investigate further, flagging in case a future shift wants to delete the now-unused files), `public/data/pompeii.geojson` (still a 0-byte placeholder, unreferenced anywhere — Pompeii/Herculaneum per priority-queue item 3 is still unstarted).

### Next shift should pick up

- **Track A:** Ostia (priority queue item 2 — port infrastructure) is the next unclaimed item, or start on provincial capitals (item 4: Lugdunum, Carthago Nova, Alexandria, Antiochia, Ephesus, Corinth, Londinium, Colonia Agrippinensis) — note Londinium's gazetteer gap above before pinning it. Also worth a pass re-verifying the `medium`-confidence Rome POIs against LacusCurtius/Pleiades directly if egress allows.
- **Track B:** Layers panel (wire the mock Layers button to real Roads/Rivers/Provinces/POI toggles — now has real POI data to toggle), zoom control fix/polish, or POI category icons + legend (currently one flat color for every category).

---
