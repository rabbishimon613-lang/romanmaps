# Roman Maps — Shift Log

Four 6-hour research shifts per day (00:00, 06:00, 12:00, 18:00 UTC), 7 days a week.
Each shift picks up where the last left off, researches, and pushes real map data.

New entries go on top. Each shift appends its own section.

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
