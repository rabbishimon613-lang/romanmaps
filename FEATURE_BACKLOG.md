# Roman Maps — Feature Backlog

Shifts pick top **unblocked** item, ship it, check it off, then push. Add new items you spot.

## Rules

- **Clone Google Maps UI/UX** — study current Google Maps web + mobile; match interaction, chrome, panel styling, animations. Users should feel like they already know how to use this.
- **DO NOT build Street View** — that's a separate future project. If a feature seems to imply Street View, skip it.
- Every feature must work on desktop AND mobile.
- Every distance / area must respect the units toggle (see below).
- Persist user preferences to `localStorage` under key `roman-maps:*`.

## P0 — foundational

- [ ] **Units toggle (miles ⇄ kilometers)** — settings panel item; default km; persist to `localStorage`. Every other feature reads from a small hook `useUnits()`.
- [ ] **Ruler tool** — click a start point, click subsequent points, live distance readout in current unit (great-circle for now, road-snap later). Show total + segment. Right-click / double-click ends. Copy-to-clipboard the total. UI: a small floating card top-right when active.
- [ ] **Search bar actually works** — types into the top-left card, fuzzy-matches the gazetteer (16k places, Latin + modern), shows a dropdown of matches with province + modern name, click to fly there. Google-Maps-style suggestions.
- [ ] **Place details panel** — click a POI → slide-in left panel with name, category, dates, photo (later), notes, sources, "Directions to here" button. Mirror Google Maps' left panel layout.
- [ ] **Directions** — pick A and B, route along the Roman road network (ORBIS-style routing, but road-only for MVP), show total distance + estimated days-on-foot (assume 25 Roman miles/day for a legion, 15 for a merchant). Route as red line on top of the roads.

## P1 — parity with Google Maps

- [ ] **Right-click context menu** — "What's here?" (lat/lng + nearest known Roman place), "Directions from here", "Directions to here", "Measure distance" (triggers ruler).
- [ ] **Share button** — copies a URL that restores center/zoom + selected POI + active route.
- [ ] **Coordinates URL sync** — `#12.4964,41.9028,5z` in the hash; back/forward buttons work.
- [ ] **Layers menu** — the ▨ button at bottom-right opens a panel; toggles for Roads, Rivers, Provinces, Cities, POIs, Fortifications, Aqueducts, Legions.
- [ ] **Zoom controls polish** — bigger +/– stacked buttons bottom-right, Google-style shadow.
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
- [ ] **Onboarding hint** — first-visit tooltip on the search bar: "Try 'Londinium' or 'Ephesus'."
- [ ] **Dark mode / night-map style** — parchment → dark leather, water dark blue.

## Shipped (moved from above; newest on top)

- 2026-08-11 — Google-Maps-style search bar chrome (mock only, no search yet)
- 2026-08-11 — 117 CE epoch pill
- 2026-08-11 — Base map: land/coasts/provinces/rivers/lakes/roads deployed
