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
- [ ] **Place details panel** — click a POI → slide-in left panel with name, category, dates, photo (later), notes, sources, "Directions to here" button. Mirror Google Maps' left panel layout. *(Partial: POIs from `pois.geojson` now show a click popup with name/dates/notes — see Map.tsx `pois-dot` click handler — but it's a Maplibre popup, not the Google-Maps-style slide-in left panel the backlog asks for. Left this item unchecked; a future shift should replace the popup with a real panel + wire "Directions to here".)*
- [ ] **Directions** — pick A and B, route along the Roman road network (ORBIS-style routing, but road-only for MVP), show total distance + estimated days-on-foot (assume 25 Roman miles/day for a legion, 15 for a merchant). Route as red line on top of the roads.

## P1 — parity with Google Maps

- [ ] **Right-click context menu** — "What's here?" (lat/lng + nearest known Roman place), "Directions from here", "Directions to here", "Measure distance" (triggers ruler).
- [ ] **Share button** — copies a URL that restores center/zoom + selected POI + active route.
- [ ] **Coordinates URL sync** — `#12.4964,41.9028,5z` in the hash; back/forward buttons work.
- [x] **Layers menu** — the ▨ button at bottom-right opens a panel; toggles for Roads, Rivers, Provinces, Cities, POIs, Fortifications, Aqueducts, Legions. *(2026-08-11, Shift 3: `app/useLayers.ts` + panel in Chrome.tsx. Real toggles for the 5 layer groups that actually exist on the map today — Roads, Rivers & lakes, Province borders, Cities & towns, Landmarks (POIs) — persisted to `localStorage` under `roman-maps:layers`, `useSyncExternalStore`-backed like `useUnits`. Fortifications/Aqueducts/Legions aren't checkboxes yet because there's no dedicated layer/data for them — POIs already includes forts/aqueducts as point features, so add real toggles for those once the data + dedicated map layers exist.)*
- [x] **Zoom controls polish** — bigger +/– stacked buttons bottom-right, Google-style shadow. *(2026-08-11, Shift 3: `app/ZoomControl.tsx`. Removed the dead/hidden default `NavigationControl` from Map.tsx and replaced it with a real custom control — stacked +/– buttons, card shadow matching the search box, disabled state at minZoom/maxZoom, calls `map.zoomTo` with a short animation.)*
- [ ] **Keyboard shortcuts** — arrow keys pan, +/– zoom, `/` focuses search, `M` opens ruler, `L` opens layers.
- [ ] **Mobile bottom sheet** — on mobile, place details come up as a bottom sheet, drag-to-expand like Google Maps mobile.
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

- [ ] **POI category icons + legend** — `pois-dot` is currently a single flat maroon circle for every category (temple, bath, amphitheater...). Google-Maps-style would give each category its own glyph/icon and a small legend. Now that the Layers panel exists (Shift 3), a natural extension is per-category POI toggles inside it — worth designing together.
- [x] **Layers panel POI toggles** — done in Shift 3, see P1 "Layers menu" above.
- [ ] **Replace POI click-popup with the real details panel** — see the note on "Place details panel" above.

## Shipped (moved from above; newest on top)

- 2026-08-11 — Shift 3: Layers panel (Roads/Rivers/Provinces/Cities/POIs toggles, persisted)
- 2026-08-11 — Shift 3: Zoom control polish (custom stacked +/– buttons)
- 2026-08-11 — Shift 2: Search bar wired to the 16k-place gazetteer (fuzzy match, keyboard nav, fly-to)
- 2026-08-11 — Shift 2: Ruler / measure-distance tool
- 2026-08-11 — Shift 2: Units toggle (km ⇄ mi), `useUnits()` hook, localStorage-persisted
- 2026-08-11 — Shift 2: First `pois.geojson` layer — 35 Rome landmarks, wired into Map.tsx with click popups
- 2026-08-11 — Google-Maps-style search bar chrome (mock only, no search yet)
- 2026-08-11 — 117 CE epoch pill
- 2026-08-11 — Base map: land/coasts/provinces/rivers/lakes/roads deployed
