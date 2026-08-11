# Roman Maps — Shift Log

Four 6-hour research shifts per day (00:00, 06:00, 12:00, 18:00 UTC), 7 days a week.
Each shift picks up where the last left off, researches, and pushes real map data.

New entries go on top. Each shift appends its own section.

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
