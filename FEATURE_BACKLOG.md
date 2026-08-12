# Roman Maps — Feature Backlog

Shifts pick top **unblocked** item, ship it, check it off, then push. Add new items you spot.

## Rules

- **Clone Google Maps UI/UX** — study current Google Maps web + mobile; match interaction, chrome, panel styling, animations. Users should feel like they already know how to use this.
- **DO NOT build Street View** — that's a separate future project. If a feature seems to imply Street View, skip it.
- Every feature must work on desktop AND mobile.
- Every distance / area must respect the units toggle (see below).
- Persist user preferences to `localStorage` under key `roman-maps:*`.

## P0 — foundational

- [x] **Units toggle (miles ⇄ kilometers)** — settings panel item; default km; persist to `localStorage`. Every other feature reads from a small hook `useUnits()`. *(2026-08-11, Shift 2: hamburger menu → "Distance units" panel; `app/useUnits.ts` exposes `useUnits()` + `formatDistance()`, backed by a module-level store + `useSyncExternalStore` so it stays in sync across components without prop drilling. Key: `roman-maps:units`.)*
- [x] **Ruler tool** — click a start point, click subsequent points, live distance readout in current unit (great-circle for now, road-snap later). Show total + segment. Right-click / double-click ends. Copy-to-clipboard the total. UI: a small floating card top-right when active. *(2026-08-11, Shift 2: `app/Ruler.tsx`. Great-circle haversine, per-leg breakdown when >1 segment, Esc/right-click/dblclick-suppressed to end, Copy total + Clear buttons. Road-snapped distance is a future upgrade.)*
- [x] **Search bar actually works** — types into the top-left card, fuzzy-matches the gazetteer (16k places, Latin + modern), shows a dropdown of matches with province + modern name, click to fly there. Google-Maps-style suggestions. *(2026-08-11, Shift 2: `app/places.ts` loads+flattens `places_medium.geojson` once (module-level cache), `searchPlaces()` scores exact/startsWith/includes matches with a `major` boost. Chrome.tsx wires the dropdown with mouse + arrow-key/Enter/Esc nav, flies the map via the existing `window.__map` handle. NOTE: this dataset (DARE-derived, ~16.3k points) is missing some very major cities we'd expect — e.g. no "Londinium" entry at all under that name or "London" — flagging as a data gap for a future Track A shift, not something to patch by hand in this file.)*
- [x] **Place details panel** — click a POI → slide-in left panel with name, category, dates, photo (later), notes, sources, "Directions to here" button. Mirror Google Maps' left panel layout. *(2026-08-11, Shift 4: `app/PlaceDetails.tsx` + `app/usePoiPanel.ts`. Replaced the Maplibre click-popup entirely — real React panel, slides in from the left on desktop (positioned below the search card, not yet a full search-bar-becomes-header merge like real Google Maps), becomes a bottom sheet on mobile (`<640px`, non-draggable — drag-to-expand is still the separate "Mobile bottom sheet" P1 item below). Shows category chip (lightweight per-category color dot, not the full icon/legend system — see backlog item below), built/destroyed dates, `extant_117ce:false` badge, province/modern location, notes, linked sources, sourcing-confidence line. Clicking empty map space or Esc closes it. "Directions to here" is present but honestly disabled with a "coming soon" tooltip — Directions itself hasn't shipped, so it doesn't fake a route. No photo field yet (`pois.geojson` schema has none currently).)*
- [ ] **Directions** — pick A and B, route along the Roman road network (ORBIS-style routing, but road-only for MVP), show total distance + estimated days-on-foot (assume 25 Roman miles/day for a legion, 15 for a merchant). Route as red line on top of the roads.

## P1 — parity with Google Maps

- [ ] **Right-click context menu** — "What's here?" (lat/lng + nearest known Roman place), "Directions from here", "Directions to here", "Measure distance" (triggers ruler).
- [ ] **Share button** — copies a URL that restores center/zoom + selected POI + active route.
- [ ] **Coordinates URL sync** — `#12.4964,41.9028,5z` in the hash; back/forward buttons work.
- [x] **Layers menu** — the ▨ button at bottom-right opens a panel; toggles for Roads, Rivers, Provinces, Cities, POIs, Fortifications, Aqueducts, Legions. *(2026-08-11, Shift 3: `app/useLayers.ts` + panel in Chrome.tsx. Real toggles for the 5 layer groups that actually exist on the map today — Roads, Rivers & lakes, Province borders, Cities & towns, Landmarks (POIs) — persisted to `localStorage` under `roman-maps:layers`, `useSyncExternalStore`-backed like `useUnits`. Fortifications/Aqueducts/Legions aren't checkboxes yet because there's no dedicated layer/data for them — POIs already includes forts/aqueducts as point features, so add real toggles for those once the data + dedicated map layers exist.)*
- [x] **Zoom controls polish** — bigger +/– stacked buttons bottom-right, Google-style shadow. *(2026-08-11, Shift 3: `app/ZoomControl.tsx`. Removed the dead/hidden default `NavigationControl` from Map.tsx and replaced it with a real custom control — stacked +/– buttons, card shadow matching the search box, disabled state at minZoom/maxZoom, calls `map.zoomTo` with a short animation. **2026-08-12, Shift 6: fixed a real bug in this — `MAX_ZOOM` was still hardcoded to 10 from when this shipped, left behind after the map's own `maxZoom` was raised to 19 for street-level site detail; the + button disabled itself at 10 and couldn't reach the zoom levels the app's own flagship feature needs. Now `MAX_ZOOM = 19`, matching `Map.tsx`.**)*
- [x] **Explore / site-jump panel + street-level site detail** — click a building in one of 40 archaeological sites (Ostia, Pompeii, Rome, Ephesus, Timgad, Palmyra, and 35 more spanning the empire) to see real building-footprint polygons color-coded by type (bath, temple, theater, domus, etc.), not just point pins. *(2026-08-11/12, undocumented commits between Shift 5 and Shift 6 — `app/sites.ts`, `app/SitesPanel.tsx`, `app/LeftRail.tsx`, `public/data/sites_buildings.geojson` + `sites_streets.geojson`. Left rail "Explore" icon opens a searchable panel listing all 40 sites with province/founding-date/blurb, click to fly there. Not originally logged in SHIFT_LOG.md or checked off here — backfilled by Shift 6, see its log entry for the full architecture note.)*
- [x] **POI markers as real pill/pin markers with category filter chips** — replaced the flat MapLibre circle-dot POI layer with Google-Maps-style HTML pin markers (colored teardrop + glyph + name label) and a horizontal category filter-chip row (Temples, Baths, Arenas, Civic, Palaces, Ports, Aqueducts, Forts...) across the top of the map. *(Same undocumented-until-Shift-6 batch — `app/PoiMarkers.tsx`, `app/CategoryChips.tsx`. The old `pois-dot`/`pois-label` MapLibre layers in `Map.tsx` still exist in the style but are vestigial (radius/opacity forced to 0) — safe cleanup for a future shift.)*
- [x] **Deploy Council pre-push build gate** — `.githooks/pre-push` runs `next build` before every push to `main`, wired via `postinstall` so fresh clones (including cloud shift containers) pick it up automatically. Blocks broken builds from ever reaching Vercel. *(Same undocumented-until-Shift-6 batch.)*
- [ ] **Keyboard shortcuts** — arrow keys pan, +/– zoom, `/` focuses search, `M` opens ruler, `L` opens layers.
- [ ] **Mobile bottom sheet** — on mobile, place details come up as a bottom sheet, drag-to-expand like Google Maps mobile. *(Bottom sheet itself shipped Shift 4. 2026-08-12, Shift 6 fixed the sheet-covers-the-FAB-stack bug flagged by Shift 5 — new `app/useIsMobile.ts`, the Zoom/Ruler/Legend/Layers buttons now hide themselves while the sheet is open instead of sitting unreachable underneath it. Drag-to-expand is still open.)*
- [ ] **Compass** — appears when map is rotated; click to reset north.

## P2 — Roman-specific

- [ ] **117 CE date pill upgrade** — click it → modal with "Why 117 CE?" explainer (Trajan's death, peak extent).
- [ ] **Currency conversion sidebar** — sestertii, denarii, aurei; convert to modern USD equivalents. Educational.
- [ ] **"Time to travel"** — walking / marching / horse / sea days between two points (once directions ship).
- [ ] **Province overlay** — click a province → highlighted, panel shows governor at 117 CE, legions stationed, main cities.
- [ ] **Legion locator** — filter to show where each of 28 legions was stationed in 117 CE.
- [ ] **"On this spot today"** — for each Roman place, one-line note on what the modern city/site is now.

## P3 — polish / delight

- [ ] **Roman-style typography for POI labels** — Cinzel or Trajan Pro (open-source alternative) for major place labels.
- [ ] **Terrain shading** — subtle hillshade under the parchment layer (Alps, Pyrenees, Anatolian plateau visible).
- [ ] **Onboarding hint** — first-visit tooltip on the search bar: "Try 'Londinium' or 'Ephesus'." *(Careful: "Londinium" isn't in `places_medium.geojson` today — see Track A gap note in SHIFT_LOG.md 2026-08-11. Pick example names that are actually in the gazetteer, or wait until that gap is filled.)*
- [ ] **Dark mode / night-map style** — parchment → dark leather, water dark blue.

## New ideas spotted this shift (2026-08-11, Shift 2)

- [x] **POI category icons + legend** — `pois-dot` is currently a single flat maroon circle for every category (temple, bath, amphitheater...). Google-Maps-style would give each category its own glyph/icon and a small legend. Now that the Layers panel exists (Shift 3), a natural extension is per-category POI toggles inside it — worth designing together. *(Shift 4 note: the new Place details panel gives each category a small colored dot chip as a stopgap — same color mapping could seed the eventual map-dot icon set.)* *(2026-08-12, Shift 5: done — not full glyph icons yet, but every category now gets a distinct color via the new `app/poiCategories.ts` (15 visual family groups), used consistently by the map dot, the details-panel chip, and a new collapsible `app/Legend.tsx` panel bottom-right. Also bumped dot radius/stroke to fix the "buried under roads" visibility bug noted below. Per-category Layers-panel toggles are still open — see new note below.)*
- [x] **Layers panel POI toggles** — done in Shift 3, see P1 "Layers menu" above.
- [x] **Replace POI click-popup with the real details panel** — done in Shift 4, see P0 "Place details panel" above.

## New ideas spotted this shift (2026-08-11, Shift 4)

- [x] **POI dots get visually buried at dense road intersections** — noticed while browser-testing the new details panel: at Rome's city-center zoom levels, several `pois-dot` points (e.g. Forum Romanum) sit exactly on top of the converging `roads-main` lines and are nearly invisible despite rendering above them in z-order (thin single-pixel circle vs. thick multi-line convergence). A white halo widen or slightly larger radius at low zoom would help; tie into the category-icon work above if picked up together. *(2026-08-12, Shift 5: done, together with the category-icon work — larger radius, thicker halo, and per-category color all landed in the same `app/Map.tsx` change. Verified in-browser at both the Rome and Ostia/Portus road-convergence clusters.)*
- [ ] **Search-bar-becomes-header on place selection** — real Google Maps collapses the search card into a back-arrow + place name header at the top of the details panel itself. This shift's `PlaceDetails.tsx` instead renders as an independent panel below the search card (simpler, non-invasive, no Chrome.tsx changes) — works fine but isn't full parity; a future shift could merge them.
- [x] **Gazetteer missing every mega-capital, not just Londinium** — Shift 4 (Track A) found `places_medium.geojson`/`places_high.geojson` had zero entries for Roma, Alexandria, Ephesus, Corinthus, and Lugdunum(-Lyon) at their real coordinates (only minor satellite sites nearby) — the "Londinium missing" note from Shift 2 was one symptom of a bigger gap. Patched the 9 biggest offenders this shift (Roma, Londinium, Alexandria, Ephesus, Corinthus, Lugdunum, Carthago Nova, Antiochia, Colonia Agrippinensis — see SHIFT_LOG.md), verified in-browser: "Roma"/"Londinium"/"Lugdunum" all now resolve correctly, and "Lugdunum" ranks the real Lyon capital above the pre-existing minor Batavian "Lugdunum" thanks to the new `major:1` boost. Still worth a systematic audit — script-check every province-capital-tier name against the gazetteer rather than discovering gaps one-by-one — since only these 9 were checked, not the full provincial-capital list.

## New ideas spotted this shift (2026-08-12, Shift 5)

- [ ] **Mobile bottom-sheet can cover the FAB stack** — `PlaceDetails.tsx`'s mobile bottom sheet is full-width (`left:0, right:0`) at `maxHeight: 55vh`; on short viewports this overlaps the Legend/Ruler/Layers/Zoom buttons (also bottom-right, `position:absolute`), which sit at a lower `zIndex` than the sheet. Not a regression — the panel has been full-width since Shift 4 — just newly noticed while adding the Legend button into that same button stack. Likely fix is moving the FAB stack above the sheet's top edge when it's open, or shrinking the sheet's width to leave a margin.
- [ ] **Per-category POI toggles in the Layers panel** — the Layers panel's "Landmarks" toggle is still all-or-nothing for every POI. `app/poiCategories.ts` (new this shift) now gives every category a stable group id + label, which is exactly the shape a per-group toggle list would need — natural next step for whoever picks up the Layers panel again.
- [ ] **`public/data/pompeii.geojson` placeholder is dead weight** — still a 0-byte, unreferenced file (noted by Shifts 2-4, left alone again this shift). Every shift's Pompeii/Herculaneum-adjacent POI work goes into `pois.geojson` per the brief's own schema, so this file has never been used for anything. Safe to delete, or repurpose — just flagging since nobody's pulled the trigger.

## New ideas spotted this shift (2026-08-12, Shift 6)

- [ ] **Vestigial `pois-dot`/`pois-label` MapLibre layers in `Map.tsx`** — superseded by `PoiMarkers.tsx`'s HTML pin markers (Italia batch), but the old layer objects are still added to the style with radius/opacity forced to 0. Dead code, safe to delete, just flagging since nobody's pulled the trigger (same pattern as the long-dead `pompeii.geojson` placeholder).
- [ ] **Most of the 40 `sites.ts` street-level sites lack cited `pois.geojson` landmark entries** — the OSM-derived building layer gives every site real building footprints, but only a handful (Rome, Ostia/Portus, Pompeii/Herculaneum, the 8 provincial capitals, and now the legions) have actual researched-and-cited point records with sources/confidence/notes. The other ~25 sites (Timgad, Djemila, Volubilis, Leptis Magna, Sabratha, Jerash, Palmyra, Baalbek, Aquincum, Carnuntum, Vindolanda, Trier, Xanten, Athens, Delphi, Mérida, Italica, and the 17-site Italia batch) are prime, well-bounded Track A scope — pick one or two per shift.

## Shipped (moved from above; newest on top)

- 2026-08-12 — Shift 6: Fixed zoom control's stale 10-zoom cap (map itself goes to 19) and mobile bottom-sheet burying the FAB stack
- 2026-08-11/12 — (undocumented until Shift 6) Explore panel + street-level building detail for 40 archaeological sites, POI pill markers + category filter chips, Deploy Council pre-push build gate
- 2026-08-12 — Shift 5: POI category icons + legend, fixed dots buried under roads
- 2026-08-11 — Shift 4: Place details slide-in panel (replaces POI click-popup)
- 2026-08-11 — Shift 3: Layers panel (Roads/Rivers/Provinces/Cities/POIs toggles, persisted)
- 2026-08-11 — Shift 3: Zoom control polish (custom stacked +/– buttons)
- 2026-08-11 — Shift 2: Search bar wired to the 16k-place gazetteer (fuzzy match, keyboard nav, fly-to)
- 2026-08-11 — Shift 2: Ruler / measure-distance tool
- 2026-08-11 — Shift 2: Units toggle (km ⇄ mi), `useUnits()` hook, localStorage-persisted
- 2026-08-11 — Shift 2: First `pois.geojson` layer — 35 Rome landmarks, wired into Map.tsx with click popups
- 2026-08-11 — Google-Maps-style search bar chrome (mock only, no search yet)
- 2026-08-11 — 117 CE epoch pill
- 2026-08-11 — Base map: land/coasts/provinces/rivers/lakes/roads deployed
