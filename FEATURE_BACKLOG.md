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
- [x] **Directions** — pick A and B, route along the Roman road network (ORBIS-style routing, but road-only for MVP), show total distance + estimated days-on-foot (assume 25 Roman miles/day for a legion, 15 for a merchant). Route as red line on top of the roads. *(2026-08-18, cloud shift 29: `scripts/build-route-graph.mjs` builds a routable graph from `roads_main.geojson`+`roads_secondary.geojson` — 14,601 road segments become graph edges between endpoint-nodes deduped by rounded coordinate (10,214 nodes; 9,477 of them shared by 2+ segments, so the network is real, not fragments), written to `public/data/route_graph.json` (~6MB, fetched only when Directions is actually opened). `app/routeGraph.ts` runs Dijkstra client-side with a binary min-heap (naive O(V²) would be ~100M ops and janky on click; this is O(E log V)). `app/Directions.tsx` + `app/useDirections.ts`: click A and B (via the map directly, the right-click context menu's now-real "Directions from/to here", or a place card's new "Directions" button) draws the real road-network route as a blue line — not a straight line — and reports total distance plus legion/merchant travel-day estimates using the assumptions this item itself specifies. Two real edge cases handled honestly rather than papered over: a query whose endpoints land in different connected components (e.g. mainland Italy to Vindolanda in Britain — no Channel crossing in the source data) reports "No road route found" instead of faking a straight line across open sea; and clicking a point that isn't exactly on a mapped road reports the snap-to-nearest-road distance separately so the total isn't silently inflated without explanation. Directions and the ruler are mutually exclusive map "modes" (starting one cancels the other), same as real Google Maps. Verified with Playwright: a real Rome→Ostia query returns 24.9 km over an 18-point road-following line in well under a second; the Britain case correctly returns no route; both the context-menu and place-card entry points work on desktop and mobile, 1280×900 light and 375×812 dark.)*

## P1 — parity with Google Maps

- [x] **Right-click context menu** — "What's here?" (lat/lng + nearest known Roman place), "Directions from here", "Directions to here", "Measure distance" (triggers ruler). *(2026-08-12, Shift 7: `app/ContextMenu.tsx` + `app/useRuler.ts`. "What's here?" drops a temporary red pin + popup with lat/lng and the nearest gazetteer place; "Directions from/to here" honestly disabled with the same "coming soon" tooltip `PlaceDetails.tsx` already uses; "Measure distance" hands off to the ruler seeded with the clicked point via a new shared `useRuler.ts` store (`Ruler.tsx`'s local `active` state was refactored onto this store so both the FAB and the context menu drive the same session). Right-click on desktop, 550ms long-press on mobile (cancels on >10px move) since touch has no right-click equivalent and every feature needs desktop+mobile parity. Menu closes on outside click, Escape, or map pan/zoom, and clamps to the viewport edges. **2026-08-18, cloud shift 29: "Directions from/to here" now real** — see the "Directions" item above.)*
- [x] **Share button** — copies a URL that restores center/zoom + selected POI + active route. *(2026-08-13, Shift 10: `app/Map.tsx` + `app/usePoiPanel.ts`. The "Copy link" button already added by the UX-sweep commit now actually shares something: the hash carries an optional trailing `:poiId` (`#12.4964,41.9028,12.00z:poi_colosseum`), written the instant a place is selected/cleared via a small `subscribeSelectedPoi`/`getSelectedPoi` pair, and restored both on initial load and on back/forward via an id→feature index built from `pois.geojson`. Verified in-browser: clicking a POI updates the hash, loading that URL fresh reopens the same place, Escape drops the id back off. Scoped to `pois.geojson`-backed places only — the `sites_buildings.geojson` click path (Ostia/Pompeii/etc. individual buildings) doesn't yet encode a restorable id, see SHIFT_LOG for why. Active-route encoding is moot until Directions ships.)*
- [x] **Coordinates URL sync** — `#12.4964,41.9028,5z` in the hash; back/forward buttons work. *(2026-08-12, Shift 8: `app/Map.tsx`. `#lng,lat,zoomz` kept live on every `moveend`, debounced 400ms; first write `replaceState`s so page load doesn't consume a back-step, later writes `pushState`. Loading a URL with a hash lands directly there instead of playing the default opening flyTo. `popstate` flies back to a hash's view so back/forward retrace map moves. Verified in-browser: pan/zoom update the hash, back restores the prior one, and a direct link with a hash restores that exact center/zoom on load.)*
- [x] **Layers menu** — the ▨ button at bottom-right opens a panel; toggles for Roads, Rivers, Provinces, Cities, POIs, Fortifications, Aqueducts, Legions. *(2026-08-11, Shift 3: `app/useLayers.ts` + panel in Chrome.tsx. Real toggles for the 5 layer groups that actually exist on the map today — Roads, Rivers & lakes, Province borders, Cities & towns, Landmarks (POIs) — persisted to `localStorage` under `roman-maps:layers`, `useSyncExternalStore`-backed like `useUnits`. Fortifications/Aqueducts/Legions aren't checkboxes yet because there's no dedicated layer/data for them — POIs already includes forts/aqueducts as point features, so add real toggles for those once the data + dedicated map layers exist. **2026-08-12, Shift 7: added four more groups** — "Road stations" and "117 CE — people & events" (axes 2 and 4), then "Trade routes" and "Disasters & memory" (axes 6a and 11) — for the new `road_stations.geojson`/`people_117.geojson`/`events_117.geojson`/`trade_routes.geojson`/`disasters.geojson` layers (see SHIFT_LOG). The people-markers group is the first to gate an HTML-marker component (`PeopleMarkers.tsx`) directly off `useLayers()` state rather than a native map layer's visibility — a cleaner pattern than the older POI approach, where the Layers panel's "Landmarks" toggle now points at vestigial `pois-dot`/`pois-label` layers that don't actually control `PoiMarkers.tsx`'s HTML pins (still open, see below). **2026-08-12, Shift 8: fixed the "Landmarks" toggle** — `PoiMarkers.tsx` now also reads `useLayers()["pois"]` directly, same pattern as `PeopleMarkers.tsx`, so unchecking it actually hides the HTML pins instead of doing nothing (verified: 101→0→101 markers across a toggle-off/toggle-on cycle). Also **added three more groups** — "Mints", "Health & spa culture", "Imperial cult" (axes 8a, 18, 12) — for the new `mints.geojson`/`health.geojson`/`imperial_cult.geojson` layers, same source+circle-layer+popup pattern as the Shift 7 batch. **2026-08-13, Shift 9: added two more groups** — "Political apparatus" and "Frontier lines" (axes 13 and 3a). **2026-08-13, Shift 10: added two more groups** — "Aqueducts (major lines)" and "Welfare & benefaction" (axes 3f and 15); `lines.geojson`'s single source now feeds two filtered layers (frontier lines dashed brown, aqueduct lines solid green) instead of one, so the two feature families read distinctly on the map. Checkbox count is now 16.)*
- [x] **Two eager thematic fetches survive `[11-P0-2]`'s lazy-overlay refactor** — found and
      fixed same-shift, 2026-08-19 cloud shift 34. `ProvincePanel.tsx` fetched
      `/data/politics.geojson` on mount for its governor lookup, unconditional on whether a
      province panel was ever opened — now gated behind `open` (the province-panel-is-visible
      flag), with `loadGovernors()`'s existing module-level cache meaning a later open still never
      re-fetches. `PeopleMarkers.tsx` awaited `/data/people_117.geojson` before checking its own
      `visible` flag — reordered so the `if (!visible) return` guard runs first. Verified with a
      fresh Playwright cold-load network check against the built production server: the only
      `/data/*.geojson` requests left on cold load are the base-group files
      (land/provinces/lakes/rivers/ancient_sea/seas/roads_main/roads_secondary/pois/
      places_medium) — zero thematic files, including these two, fetch until their layer is
      actually switched on.
- [x] **Zoom controls polish** — bigger +/– stacked buttons bottom-right, Google-style shadow. *(2026-08-11, Shift 3: `app/ZoomControl.tsx`. Removed the dead/hidden default `NavigationControl` from Map.tsx and replaced it with a real custom control — stacked +/– buttons, card shadow matching the search box, disabled state at minZoom/maxZoom, calls `map.zoomTo` with a short animation. **2026-08-12, Shift 6: fixed a real bug in this — `MAX_ZOOM` was still hardcoded to 10 from when this shipped, left behind after the map's own `maxZoom` was raised to 19 for street-level site detail; the + button disabled itself at 10 and couldn't reach the zoom levels the app's own flagship feature needs. Now `MAX_ZOOM = 19`, matching `Map.tsx`.**)*
- [x] **Explore / site-jump panel + street-level site detail** — click a building in one of 40 archaeological sites (Ostia, Pompeii, Rome, Ephesus, Timgad, Palmyra, and 35 more spanning the empire) to see real building-footprint polygons color-coded by type (bath, temple, theater, domus, etc.), not just point pins. *(2026-08-11/12, undocumented commits between Shift 5 and Shift 6 — `app/sites.ts`, `app/SitesPanel.tsx`, `app/LeftRail.tsx`, `public/data/sites_buildings.geojson` + `sites_streets.geojson`. Left rail "Explore" icon opens a searchable panel listing all 40 sites with province/founding-date/blurb, click to fly there. Not originally logged in SHIFT_LOG.md or checked off here — backfilled by Shift 6, see its log entry for the full architecture note.)*
- [x] **POI markers as real pill/pin markers with category filter chips** — replaced the flat MapLibre circle-dot POI layer with Google-Maps-style HTML pin markers (colored teardrop + glyph + name label) and a horizontal category filter-chip row (Temples, Baths, Arenas, Civic, Palaces, Ports, Aqueducts, Forts...) across the top of the map. *(Same undocumented-until-Shift-6 batch — `app/PoiMarkers.tsx`, `app/CategoryChips.tsx`. The old `pois-dot`/`pois-label` MapLibre layers in `Map.tsx` still exist in the style but are vestigial (radius/opacity forced to 0) — safe cleanup for a future shift.)*
- [x] **Deploy Council pre-push build gate** — `.githooks/pre-push` runs `next build` before every push to `main`, wired via `postinstall` so fresh clones (including cloud shift containers) pick it up automatically. Blocks broken builds from ever reaching Vercel. *(Same undocumented-until-Shift-6 batch.)*
- [x] **Keyboard shortcuts** — arrow keys pan, +/– zoom, `/` focuses search, `M` opens ruler, `L` opens layers. *(2026-08-13, Shift 9: `app/useKeyboardShortcuts.ts`, wired from `Chrome.tsx`. Ignored while a text field has focus or a modifier key is held; `/` is the deliberate exception, jumping focus into the search box from anywhere else. `M`/`L` reuse the existing `useRuler.ts` store and Layers-panel state rather than introducing new state. Verified in-browser: pan/zoom/search-focus/layers-toggle/ruler-toggle all work, and typing "mars" into the focused search box types normally instead of `M` re-toggling the ruler mid-word.)*
- [x] **Mobile bottom sheet** — on mobile, place details come up as a bottom sheet, drag-to-expand like Google Maps mobile. *(Bottom sheet itself shipped Shift 4. 2026-08-12, Shift 6 fixed the sheet-covers-the-FAB-stack bug flagged by Shift 5 — new `app/useIsMobile.ts`, the Zoom/Ruler/Legend/Layers buttons now hide themselves while the sheet is open instead of sitting unreachable underneath it. **2026-08-13, Shift 11: drag-to-expand done** — `app/PlaceDetails.tsx` now snaps between a 55vh half-height and 92vh full-height state via a drag handle at the sheet's top edge, and dismisses the panel on a hard drag-down past a threshold. Built around per-gesture `window`-level pointer listeners (not `setPointerCapture`, which a real Playwright drag test caught silently failing and aborting the gesture) so add/remove always reference the same closure. Verified in-browser at a 390×844 mobile viewport: drag-up expands, hard drag-down closes the panel, desktop's left-side panel is unaffected.)*
  **2026-08-17, Shift 27 (board `[04-P0-1]`): third "peek" detent + velocity-aware flicks added**
  — half/full became peek/half/full, and a fast flick now moves one detent regardless of drag
  distance instead of requiring a slow drag past the midpoint. Also fixed a real bug found while
  testing it: a failed `image_url` load used to leave the drag handle covered by a collapsed
  image wrapper's credit caption, making the sheet undraggable — see SHIFT_LOG for the full
  diagnosis. Verified with a Playwright state-machine test against the built production bundle.
- [x] **Compass** — appears when map is rotated; click to reset north. *(2026-08-13, Shift 12: `app/Compass.tsx`. Polls for `window.__map` same pattern as `ZoomControl.tsx`, subscribes to the map's native `rotate` event, hidden entirely while bearing is within 0.5° of north, needle rotates live to counter the map's bearing so it always points true north, click calls `easeTo({bearing:0})`. Sits in the bottom-right FAB stack above Legend, hidden on mobile while the Place details sheet is open (same pattern as Ruler/Legend/Layers/Zoom). MapLibre's default `dragRotate`/`touchZoomRotate` handlers were already enabled and untouched — right-click-drag or two-finger-twist rotates the map, this control just surfaces the reset affordance Google Maps has. Verified in a real browser (Playwright + Chromium): hidden at bearing 0, appears at bearing 45, click resets bearing to exactly 0 and the button disappears again; also confirmed visible/functional at a 390×844 mobile viewport. Noticed but did NOT fix while in this corner of the screen: the Legend button (`bottom:214`) and Layers button (`bottom:186`) overlap by ~12px in the FAB stack — a pre-existing layout bug from before this shift, out of scope here, flagged in SHIFT_LOG for whoever wants a quick fix.)*

## P2 — Roman-specific

- [x] **117 CE date pill upgrade** — click it → modal with "Why 117 CE?" explainer (Trajan's death, peak extent). *(2026-08-14, Shift 14: `app/EpochModal.tsx`, opened from the bottom-left pill in `app/Chrome.tsx`. Centered Google-Maps-info-card-style modal — Trajan's 11 August death at Selinus, the ~5 million km² peak extent, and the snapshot discipline the map follows, cited to Cassius Dio 68.33 and *Historia Augusta*, *Hadrian* 4.7. Closes on backdrop click or Esc. Verified in-browser at 1280×800 and 390×844.)*
- [x] **Currency conversion sidebar** — sestertii, denarii, aurei; convert to modern USD equivalents. Educational. *(2026-08-14, Shift 15: `app/CurrencyConverter.tsx`, an expandable section in the hamburger menu next to Distance units. Fixed as/sestertius/denarius/aureus ratios (exact) plus a clearly-labeled rough USD range from wheat-purchasing-power parity (~$20-28/denarius, based on mid-1st-c. Rome grain prices) rather than false precision on an inherently approximate ancient-to-modern conversion — the methodology is stated directly in the UI. Verified in-browser at 1280x800 and 390x844.)*
- [x] **Sailing season indicator** (axis 7b) — mare apertum/mare clausum explainer + toggle. *(2026-08-24, cloud shift: `app/SailingSeason.tsx` + `app/useSailingSeason.ts`, same hamburger-menu expandable pattern as `CurrencyConverter.tsx`, right below it. A manual Summer/Winter toggle (not tied to the visitor's live date, since the map itself is a frozen 117 CE snapshot) — "Winter" tints the map's sea fill grey via two new always-present, zero-opacity map layers (`sea-mask-winter-tint`, `ancient-sea-winter-tint` in `app/Map.tsx`) toggled through `setPaintProperty`, persisted to `localStorage`. Cites Vegetius, *De Re Militari* 4.39 for the safe/risky/closed date windows. Verified live with `next dev` + Playwright: toggling tints and un-tints the sea correctly, renders correctly at 1280x900 light and 375x812 dark.)*
- [x] **A real URL per archaeological site** — *the single largest untapped thing on this project, added by the SEO sweep 2026-08-15.* *(2026-08-16, Shift 20: `app/site/[slug]/page.tsx`, statically generated for all 40 `app/sites.ts` entries via `generateStaticParams`. Server-rendered display name, province, modern country, founding date, blurb, the "on this spot today" line, per-site `<title>`/canonical/OpenGraph metadata, a JSON-LD `Place` schema block, and a deep link back into the client map at `/#lng,lat,zoomz`. All 40 listed in `app/sitemap.ts` alongside the existing single map route. Deliberately scoped to the 40 curated sites only, not the 16k-point gazetteer, per this item's own original note. Verified with `next build`: all 40 `/site/<slug>` routes prerender as static HTML; spot-checked `/site/ostia`'s output for correct title, canonical link, and JSON-LD.)*
- [x] **A real URL per curated POI, extending the above** — *(2026-08-16, cloud shift 3: `app/place/[slug]/page.tsx`, same pattern extended to all 467 `public/data/pois.geojson` records — hero image + About/What-happened-here/In-ancient-writing/Sources blocks, JSON-LD, OG/Twitter, a link back into the interactive map. `sitemap.ts` now lists 507 URLs. 16k-point raw gazetteer still explicitly out of scope. See `BOARD.md` `[14-P0-2]` for full detail.)*
- [x] **"Time to travel"** — walking / marching / horse / sea days between two points (once directions ship). *(Already shipped piecemeal by the time this was checked, 2026-08-19 cloud shift 32: `app/Directions.tsx`'s road-route result panel shows "Legion on the march" (25 Roman miles/day), "Merchant on foot" (15/day), and "Imperial courier, horse relay" (75 km/day, cursus publicus) — see `[07-P1-1]` travel-time in BOARD.md. Sea legs are the one explicitly-deferred piece: no sailing-season-aware network exists, so a route needing a sea crossing honestly reports no road route rather than faking one, same scope this item's own parenthetical called for.)*
- [x] **Province overlay** — click a province → highlighted, panel shows governor at 117 CE, legions stationed, main cities. *(2026-08-18, cloud shift 30: by the time this was picked back up, `app/provinces.ts` (43 provinces, capital/blurb/status), `public/data/politics.geojson` governors, and `app/legions.ts` all already shipped from later work — the "needs real per-province research" blocker the note below flagged no longer applied, and the feature became a pure lens over data that already exists, same shape as `/province/[slug]`. New `app/useProvincePanel.ts` + `app/ProvincePanel.tsx`: clicking a province polygon at empire/region-level zoom (gated below z7.5 — provinces-fill covers virtually all land, so an ungated handler would pop a panel on every close-up click) highlights it and opens a panel with blurb/capital/governor/legions/cities, mutually exclusive with the Place details panel and skipped while the ruler or Directions is active. See `BOARD.md`'s `[02-P0-2]`/`[06-P0-2]` combined commit note for a verification caveat: this sandbox's `map.on("load", ...)` gate never fires here due to the demotiles.maplibre.org block, so the click-to-panel path couldn't be screenshotted live in this session — the click→resolve→highlight logic was confirmed correct by binding it directly to the live map instance and firing a real click.)*
- [x] **Legion locator** — filter to show where each of 28 legions was stationed in 117 CE. *(2026-08-14, Shift 16: `app/legions.ts` + `app/LegionLocator.tsx`, left-rail "Legions" icon. Derived straight from the 28 legionary-fortress records already researched and cited in `pois.geojson` (category "fort") — no new research needed, this just gives that existing data a dedicated browsable index instead of leaving it buried in the generic Forts filter. Search/browse all 28, click one to fly to its real fortress and open the same Place details panel a map click would. Verified in-browser: search for "IX Hispana" finds it, click flies to Eboracum/York and opens the real fortress detail panel.)*
- [x] **"On this spot today"** — for each Roman place, one-line note on what the modern city/site is now. *(2026-08-15, Shift 17: new `today` field on every `SiteInfo` in `app/sites.ts`, rendered in `SitesPanel.tsx` under each site's blurb as a small italic line. Covers all 40 street-level sites — inhabited modern city vs. uninhabited archaeological park, UNESCO status where applicable, honest notes on conflict damage (Palmyra, Sabratha) and submersion (Baiae). Scoped to the 40 `sites.ts` entries only, not the ~700 individual `pois.geojson`/axis-file points — those would need per-feature "today" research, a much bigger lift; a future shift could extend the same field to POIs if wanted. Verified in-browser at 1280x800 (panel renders correctly) and 390x844 (SitesPanel is desktop-only by existing design, same as the rest of the Explore panel — confirmed no mobile regression).)*

## P3 — polish / delight

- [x] **Roman-style typography for POI labels** — Cinzel or Trajan Pro (open-source alternative) for major place labels. *(2026-08-15, Shift 18: Cinzel via `next/font/google`, exposed as `--font-cinzel` and applied through a shared `.roman-label` class — Place details panel titles, `SitesPanel`/`LegionLocator` list rows, and every POI's on-map pin label (`PoiMarkers.tsx`). Deliberately scoped away from native MapLibre map text (city/place labels) — those render through a glyph-PBF pipeline that would need a whole separate generated-tileset lift to support a new font, a materially bigger job than swapping a CSS `font-family` on HTML elements. Verified in-browser at 1280x800 and 390x844: computed font-family resolves to the real Cinzel stack, renders correctly on both panel titles and map pins.)*
- [ ] **Terrain shading** — subtle hillshade under the parchment layer (Alps, Pyrenees, Anatolian plateau visible).
- [x] **Onboarding hint** — first-visit tooltip on the search bar: "Try 'Londinium' or 'Ephesus'." *(2026-08-15, Shift 19: `app/useOnboardingHint.ts` + wired into `app/Chrome.tsx`. Confirmed both example names now resolve in `places_medium.geojson` (Shift 4's gazetteer patch already fixed the "Londinium" gap this item used to be blocked on) before shipping. Dismissible tooltip under the search card, persists dismissal to `localStorage["roman-maps:onboarding-hint-seen"]`, dismisses on typing, focusing the search box, or an explicit close button. Verified in-browser at 1280x800 and 390x844: shows on a fresh localStorage, disappears and stays gone after typing + reload, and the close button works standalone.)*
- [x] **Dark mode / night-map style** — parchment → dark leather, water dark blue. *(Found already shipped, 2026-08-24 cloud shift: `app/Map.tsx`'s `LIGHT`/`DARK` `Palette` objects (added alongside `app/globals.css`'s chrome token set — see that file's own header comment, "the basemap already follows prefers-color-scheme") drive every base-map paint property — land `#f4ead5` → `#232628`, sea `#a9d1e3` → `#0f2233`, provinces/rivers/lakes/roads/labels all repalette too — off `prefers-color-scheme`, resolved once at map-style construction (`prefersDark()`, line 187). This item's literal ask (parchment↔dark-leather map, light↔dark water) was simply never checked off despite existing; no code changed this pass. Verified live with `next dev` + Playwright, `colorScheme: 'dark'`/`'light'` contexts: desktop 1280×900 light renders the parchment map with light chrome; mobile 375×812 dark renders `map.getPaintProperty('bg','background-color') === "#0f2233"` and `land === "#232628"` (exact `DARK` palette values) with dark chrome — screenshots confirm both. **Known gap, not this item's scope**: the palette is OS-preference-only, computed once at mount — there's no in-app manual light/dark toggle, and repainting one live would mean threading `setPaintProperty` through ~30 layer IDs that currently take their color only from the literal `P.*` value baked in at style-creation time (grepped every callsite before deciding this — MapLibre's dozen circle-layer thematic overlays included). That's a real, separate, materially bigger feature (`app/useTheme.ts` + a settings toggle + a live-repaint pass) than what this checkbox asked for — flagging as a fresh backlog item below rather than attempting it in the same pass as this verification.)*

## New ideas spotted this shift (2026-08-11, Shift 2)

- [x] **POI category icons + legend** — `pois-dot` is currently a single flat maroon circle for every category (temple, bath, amphitheater...). Google-Maps-style would give each category its own glyph/icon and a small legend. Now that the Layers panel exists (Shift 3), a natural extension is per-category POI toggles inside it — worth designing together. *(Shift 4 note: the new Place details panel gives each category a small colored dot chip as a stopgap — same color mapping could seed the eventual map-dot icon set.)* *(2026-08-12, Shift 5: done — not full glyph icons yet, but every category now gets a distinct color via the new `app/poiCategories.ts` (15 visual family groups), used consistently by the map dot, the details-panel chip, and a new collapsible `app/Legend.tsx` panel bottom-right. Also bumped dot radius/stroke to fix the "buried under roads" visibility bug noted below. Per-category Layers-panel toggles are still open — see new note below.)*
- [x] **Layers panel POI toggles** — done in Shift 3, see P1 "Layers menu" above.
- [x] **Replace POI click-popup with the real details panel** — done in Shift 4, see P0 "Place details panel" above.

## New ideas spotted this shift (2026-08-11, Shift 4)

- [x] **POI dots get visually buried at dense road intersections** — noticed while browser-testing the new details panel: at Rome's city-center zoom levels, several `pois-dot` points (e.g. Forum Romanum) sit exactly on top of the converging `roads-main` lines and are nearly invisible despite rendering above them in z-order (thin single-pixel circle vs. thick multi-line convergence). A white halo widen or slightly larger radius at low zoom would help; tie into the category-icon work above if picked up together. *(2026-08-12, Shift 5: done, together with the category-icon work — larger radius, thicker halo, and per-category color all landed in the same `app/Map.tsx` change. Verified in-browser at both the Rome and Ostia/Portus road-convergence clusters.)*
- [x] **Search-bar-becomes-header on place selection** — real Google Maps collapses the search card into a back-arrow + place name header at the top of the details panel itself. *(2026-08-21, cloud shift 43: `app/Chrome.tsx`'s search card now branches on `headerMode` (`!isMobile && a place is selected`) — the hamburger+input+search-icon row swaps for a back arrow (calls `clearPoi()`) plus the selected place's name, ellipsis-truncated, inside the same card box so the transform reads as one continuous element. Search-results dropdown and hamburger menu force-close the instant headerMode turns on. `app/PlaceDetails.tsx`'s own floating close-X (over the hero image) is now mobile-only, since the header's back arrow is the single desktop close affordance — no more redundant second X. Deliberately scoped to desktop only: mobile's bottom sheet (drag handle + its own X) is already the correct mobile pattern, matching this item's own original framing. Verified with Playwright: desktop 1280x900 light (search input hidden, back arrow present and functional, restores the prior query on click) and mobile 375x812 dark (no regression — search input and the sheet's own X both still present, headerMode never activates there).)*
- [x] **Gazetteer missing every mega-capital, not just Londinium** — Shift 4 (Track A) found `places_medium.geojson`/`places_high.geojson` had zero entries for Roma, Alexandria, Ephesus, Corinthus, and Lugdunum(-Lyon) at their real coordinates (only minor satellite sites nearby) — the "Londinium missing" note from Shift 2 was one symptom of a bigger gap. Patched the 9 biggest offenders this shift (Roma, Londinium, Alexandria, Ephesus, Corinthus, Lugdunum, Carthago Nova, Antiochia, Colonia Agrippinensis — see SHIFT_LOG.md), verified in-browser: "Roma"/"Londinium"/"Lugdunum" all now resolve correctly, and "Lugdunum" ranks the real Lyon capital above the pre-existing minor Batavian "Lugdunum" thanks to the new `major:1` boost. Still worth a systematic audit — script-check every province-capital-tier name against the gazetteer rather than discovering gaps one-by-one — since only these 9 were checked, not the full provincial-capital list.

## New ideas spotted this shift (2026-08-12, Shift 5)

- [x] **Mobile bottom-sheet can cover the FAB stack** — `PlaceDetails.tsx`'s mobile bottom sheet is full-width (`left:0, right:0`) at `maxHeight: 55vh`; on short viewports this overlaps the Legend/Ruler/Layers/Zoom buttons (also bottom-right, `position:absolute`), which sit at a lower `zIndex` than the sheet. Not a regression — the panel has been full-width since Shift 4 — just newly noticed while adding the Legend button into that same button stack. Likely fix is moving the FAB stack above the sheet's top edge when it's open, or shrinking the sheet's width to leave a margin. *(Found already resolved, 2026-08-20 cloud shift 36, while scoping a Track B pick — no separate fix needed. `ZoomControl.tsx`/`Ruler.tsx`/`Legend.tsx`/the Layers button in `Chrome.tsx` all already read `usePoiPanel()` and hide themselves while a place is open, same pattern as the mobile-sheet-open case this item describes; some later shift's work superseded the bug without flipping this checkbox. Confirmed by reading the current source, not just by the absence of a bug report.)*
- [x] **Per-category POI toggles in the Layers panel** — the Layers panel's "Landmarks" toggle is still all-or-nothing for every POI. `app/poiCategories.ts` (new this shift) now gives every category a stable group id + label, which is exactly the shape a per-group toggle list would need — natural next step for whoever picks up the Layers panel again. *(2026-08-14: shipped. New `app/useHiddenCategories.ts` — a real independent hide-set, deliberately NOT reusing `CategoryChips.tsx`'s `useCategoryFilters` "isolate to only this category" model, since checking/unchecking a box in a list has the opposite semantics from tapping a chip (chips: show ONLY the active ones; checkboxes: hide the unchecked ones, everything else stays as-is) — conflating the two would have made unchecking a box in the Layers panel secretly hide every other category instead of just that one. `PoiMarkers.tsx` ANDs both filters together so chips and the new checkboxes compose correctly if a user touches both. The "Landmarks" row in `Chrome.tsx`'s Layers panel got a chevron that expands into all 15 `CATEGORY_GROUPS` as their own checkboxes (colored dot + label, matching `CategoryChips.tsx`'s palette). Panel gained `maxHeight:70vh` + scroll since 15 extra rows made it taller than the viewport on shorter screens. Verified in-browser: unchecking "Temples & shrines" at Rome zoom 13 dropped marker count 145→134 and nothing else moved; state persists to `localStorage["roman-maps:hidden-categories"]`.)*
- [x] **`public/data/pompeii.geojson` placeholder is dead weight** — resolved before Shift 39: the file no longer exists in the repo (confirmed absent, no references anywhere in `app`/`scripts`/`next.config.js`/`package.json`). A prior shift already deleted it; this note was stale.

## New ideas spotted this shift (2026-08-12, Shift 6)

- [x] **Vestigial `pois-dot`/`pois-label` MapLibre layers in `Map.tsx`** — superseded by `PoiMarkers.tsx`'s HTML pin markers (Italia batch), but the old layer objects are still added to the style with radius/opacity forced to 0. *(2026-08-19, cloud shift 35: deleted both layers plus their dead click/hover handlers; the empty-click-closes-panel handler no longer queries a layer that never rendered anything, just clears unconditionally — HTML markers already stopPropagation() before a click reaches the map. useLayers.ts's "Landmarks" toggle group's mapLayerIds emptied to match. Verified with Playwright: marker-click still opens the place panel, a genuine empty-canvas click still closes it (checked via aria-hidden since the panel stays mounted for its close transition), desktop 1280x800 and mobile 375x812 dark both clean.)*
- [ ] **Most of the 40 `sites.ts` street-level sites lack cited `pois.geojson` landmark entries** — the OSM-derived building layer gives every site real building footprints, but only a handful (Rome, Ostia/Portus, Pompeii/Herculaneum, the 8 provincial capitals, and now the legions) have actual researched-and-cited point records with sources/confidence/notes. The other ~25 sites (Timgad, Djemila, Volubilis, Leptis Magna, Sabratha, Jerash, Palmyra, Baalbek, Aquincum, Carnuntum, Vindolanda, Trier, Xanten, Athens, Delphi, Mérida, Italica, and the 17-site Italia batch) are prime, well-bounded Track A scope — pick one or two per shift.

## New ideas spotted this shift (2026-08-12, Shift 7)

- [ ] **`research/` is gitignored and empty in cloud shift containers.** SHIFT_BRIEF.md's Axis 1 playbook says "the playbook to add a city is in `research/italia_batch.py`, read it, then extend it" — but that file only ever existed on the developer's own machine (`.gitignore` excludes `research/` entirely) and a fresh cloud clone has no `research/` directory at all. A shift picking up Axis 1 (more cities) will need to write the whole Overpass-fetch-and-categorize pipeline from scratch, not "extend" an existing script — budget real time for that, it's a bigger lift than the brief's phrasing implies.
- [ ] **Never run `npm run build` while `next dev` is also running against the same repo checkout.** Both write to `.next/` and collided mid-shift, corrupting the dev server into a `MODULE_NOT_FOUND`/500 loop that took a few restarts + `rm -rf .next` to diagnose. The pre-push hook's `next build` is fine (it runs in the same process that's about to exit), the problem is only a *concurrent* `next dev` + `next build` sharing one `.next` directory. Use two different checkouts (or just stop `next dev` before any `npm run build`) if a future shift needs both running at once.
- [ ] **`page.mouse.click()`/`locator.click()` on real chrome buttons can silently no-op in this sandbox, even off the map canvas.** Confirmed this shift on `Chrome.tsx`'s hamburger-menu and Layers-panel `IconBtn`s (not a MapLibre/WebGL element, not the already-documented `demotiles.maplibre.org`-adjacent click issue `BOARD.md`'s `[02-P0-2]` note covers) — a normal Playwright click registered no error and no visible effect at all, repeatably. `locator.dispatchEvent("click")` fired the real `onClick` handler correctly every time. If a future shift's Playwright script clicks something and nothing happens with no error, try `dispatchEvent("click")` before assuming the feature itself is broken.
- [ ] **`app/LeftRail.tsx` and `app/Chrome.tsx` both render a button with `title="Menu"`** (different features — the left rail's is decorative/unwired, Chrome's opens the real settings panel with Distance units/Currency/Sailing season). A `page.locator('button[title="Menu"]')` resolves to 2 elements on desktop (only 1 on mobile, since the left rail is desktop-only) — check `.boundingBox()` on each before picking `.first()`/`.nth()`, don't assume there's only one.
- [ ] **Playwright browser sessions in this sandbox intermittently die mid-test** ("Target page, context or browser has been closed") on multi-step scripts, independent of system resources (memory/disk were never tight) — a pattern distinct from the jumpTo/queryRenderedFeatures headless-WebGL flakiness Shifts 4-5 already documented. Splitting into shorter single-assertion scripts and re-running past the flake worked every time; a future shift hitting the same thing shouldn't assume it's a real product bug without cross-checking with a fresh, isolated script first.
- [ ] **Live verification (screenshots, click simulation) is no longer blocked in this sandbox, as of 2026-08-19 Shift 32's `[02-P0-4]` fix.** Every prior shift assumed `map.on("load", ...)` never firing here (because `demotiles.maplibre.org` is network-blocked) meant Phase 2+ (roads, POIs, every layer past the base map) simply couldn't be tested live. `app/Map.tsx` now gates on a `whenMapReady()` helper that also polls `map.loaded()` directly, so the map genuinely finishes loading within a few seconds even with that host blocked. `npm install` if `node_modules` is missing, then `(npm run dev > /tmp/.../dev.log 2>&1 &)`, wait ~6s, then drive it with Playwright from the global install at `/opt/node22/lib/node_modules/playwright` (not a project dependency — `require()` it by full path) against Chromium at `/opt/pw-browsers/chromium-<version>/chrome-linux/chrome` (check the exact versioned directory first). Wait for `window.__map.getLayer('roads-main')` before asserting anything. Kill the dev server (`pkill -f "next dev"`) when done. Don't write "couldn't verify, sandbox blocks map load" into a commit or SHIFT_LOG without actually trying this first.
  **2026-08-19, cloud shift 33: a specific trap within this — `window.__map.getLayer('roads-main')` existing does NOT mean the full load chain has finished.** `Map.tsx`'s `applyAllLayers()` call (which hides every non-base thematic layer per invariant 0) sits at the very end of the ~2500-line sequential `await` chain, so a Playwright check that waits only for `roads-main` to exist and then asserts on layer *visibility* a couple seconds later will see every thematic layer still `visible` (the pre-sync default) and can easily misdiagnose a real, working system as an invariant-0 violation. Confirmed this run: the same layers correctly resolved to `visibility: "none"` after a 30-35s wait. If a check specifically needs the post-sync state, wait far longer than the `roads-main` existence check requires, or check for something added at/near the very end of the chain instead.
- [ ] **Audit new `name` display fields against invariant 1.5 before committing, not after.** This shift researched and pushed four data files before invariant 1.5 (no parens, no diacritics in display names) landed mid-session from another shift's commit, then had to go back and fix `"Tarracina (Anxur)"` → `"Terracina"` and similar in a follow-up commit. Now that the rule exists, run a quick grep for `(` and non-ASCII characters in any new `name`/`display` field before the commit, not just before the push.

## New ideas spotted this shift (2026-08-12, Shift 8)

- [x] **Deleting the vestigial `pois-dot`/`pois-label` layers** — resolved before Shift 39: both layers are gone from `Map.tsx`/`PoiMarkers.tsx` (only comments documenting their removal remain, confirmed by grep). A prior shift completed the cleanup; this note was stale.
- [ ] **`.next/` collision between `next dev` and `npm run build`** has now bitten two shifts in a row (Shift 7's original note, and this shift independently rediscovering it mid-session). Worth fixing at the tooling level rather than continuing to rely on every shift remembering the workaround — e.g. point one of the two commands at a separate `--dist-dir` so they can't collide.

## New ideas spotted this shift (2026-08-13, Shift 10)

- [ ] **Share button doesn't cover the `sites_buildings.geojson` click path.** The new URL-restore only knows about `pois.geojson`-backed places (the ones going through `PoiMarkers.tsx`). Clicking an individual building inside one of the 40 street-level archaeological sites (Ostia, Pompeii, etc.) still opens the same Place details panel, but that selection isn't encoded into the shareable link. Fixing it needs an id→feature lookup against a 20MB+ file rather than the small `pois.geojson`, a meaningfully bigger lift — flagging for whoever wants full share parity next.
- [ ] **New POI categories need a `poiCategories.ts` entry, not just data.** Confirmed this shift: a category absent from `CATEGORY_GROUPS` still renders on the map (falls back to the default maroon marker), but is invisible to the category-chip filter row and the Legend panel. Worth a standing reminder in `SHIFT_BRIEF.md` itself, not just tribal knowledge — every Track A shift that introduces a new POI category should add it to `poiCategories.ts` in the same pass.

## New ideas spotted this shift (2026-08-13, Shift 9)

- [ ] **`.next`/`next dev` collision has now bitten four shifts in a row** (Shifts 7, 8, and twice independently this shift). The documented workaround (kill dev, `rm -rf .next`, restart) keeps working but clearly isn't sticking as tribal knowledge across shifts that don't share memory — worth actually wiring a separate `--dist-dir` for `dev` or `build` in `next.config.js`/`package.json` so the two commands physically can't collide, rather than relying on every future shift remembering to check.
- [ ] **A future cloud-container shift may boot into a detached `HEAD` that looks behind `main`** — this shift found local `main`/`origin/main` both pointing at the repo's very first commit while `HEAD` was detached 35 commits ahead, and initially worried 8 shifts of work had been lost. `git ls-remote origin` showed GitHub's real `main` matched detached `HEAD` exactly — it was just a stale local tracking ref from the clone step, not data loss. Worth a one-line habit: run `git ls-remote origin` before doing anything drastic if this symptom recurs.

## New ideas spotted this shift (2026-08-13, Shift 11)

- [x] **Axis 3c (economic infrastructure) has real, sourced candidates still on the table.** *(2026-08-20, cloud shift 38: this note was stale — a later shift already committed all four as full `pois.geojson` records (`poi_docimium_quarries`, `poi_mons_porphyrites`, `poi_cotta_garum`, `poi_henchir_mettich_estate`) sometime after Shift 11, without updating this backlog item. Verified: 3 of the 4 still lacked `image_url`. Added a confirmed image to Henchir Mettich (the inscription itself, cross-checked against a French Wikipedia file-description page showing real dimensions, not just a search-snippet filename guess) and confirmed Mons Porphyrites' existing image is real. Left Cotta and Docimium empty rather than force a fit — no confirmable Commons filename exists for the Cotta site itself, and the one Docimium candidate found is a Pavonazzetto marble sculpture in a Copenhagen museum, not a photo of the quarry.)*
- [ ] **`penal.geojson`'s schema (`name_latin`/`name_english`/`notes`) is an outlier among the axis data files.** `mints.geojson`/`health.geojson`/`imperial_cult.geojson`/`politics.geojson`/`euergetism.geojson` all settled on a simpler `name`/`one_line` pattern for their non-`pois.geojson` hover-popup features. `penal.geojson` (Shift 11) instead mirrors `pois.geojson`'s two-name pattern to preserve both Latin and English names. Functionally fine (the popup code reads `name_english || name_latin` directly), but worth a deliberate decision next time someone touches axis-file schemas: standardize one way or the other rather than let a third pattern appear.
- [ ] **A full integrity pass on every `image_url` across every `public/data/*.geojson` file** would be valuable once/if this cloud environment's egress block on `commons.wikimedia.org` lifts — every shift since the `image_url` invariant landed has verified images via `WebSearch` result-page matches rather than a direct fetch of the actual file, since `WebFetch`/`curl` to that domain returns a hard `EGRESS_BLOCKED`/connection-refused in this environment (confirmed independently by Shifts 9, 10, and 11 now). That's solid due diligence within the constraint, but a script that walks every file and checks for a real 200 would catch any filename typos that slipped through search-result matching across dozens of shifts of accumulated data.

## New ideas spotted this shift (2026-08-13, Shift 12)

- [ ] **Axis 1 (more cities) is blocked at the network level in this cloud environment, not just missing tooling.** Confirmed this shift: `overpass-api.de` returns a hard `EGRESS_BLOCKED` via `WebFetch` and connection-refused via direct `curl` — the same block already known for Wikipedia/Commons, now confirmed for the Overpass API itself (and `nominatim.openstreetmap.org` too). This means Axis 1's whole approach (fetch OSM building outlines via Overpass, per `research/italia_batch.py`) cannot run from this sandbox at all, regardless of how the pipeline script is rebuilt. Worth updating `SHIFT_BRIEF.md`'s Axis 1 section to say this plainly — a future shift needs either a different environment or a non-Overpass data source for new cities, not just "rewrite the script."
- [x] **Legend button (`bottom:214`) and Layers button (`bottom:186`) overlap by ~12px in the bottom-right FAB stack.** Confirmed via Playwright `boundingBox()`: Layers spans y=574–614, Legend spans y=546–586 at a 1280×800 viewport — a real 12px overlap, not a rendering artifact. Fix is a few pixels of adjustment across `Ruler.tsx`/`Chrome.tsx`'s Layers button/`Legend.tsx`. *(2026-08-14: fixed — and the overlap ran deeper than the flagged pair. Re-derived the whole bottom-right stack's `bottom` values from ZoomControl's real footprint (bottom:32, 81px tall) with a consistent 8px gap between every 40×40 button: Ruler 121, Layers 169, Legend 217, HomeButton 265, Compass 313 (was 132/186/214/240/268). The old numbers cascaded — Legend/HomeButton and HomeButton/Compass were ALSO overlapping by 12-14px each, just never independently flagged. Verified every gap is exactly 8px via Playwright `boundingBox()` at 1280×800, including Compass by programmatically rotating the map to force it to render.)*
- [ ] **Axis 20 (sports) landed at 21 of the 25-gymnasia floor — 9 real candidates need image top-up, not fresh research.** Corinth, Rhodes, Termessos, Thera (Gymnasium of the Ephebes), Assos, Magnesia on the Maeander, Iasos, Knidos, and Alinda all have real, excavated gymnasia confirmed via research, but no specific, confirmable Wikimedia Commons filename could be pinned down for any of them even across two separate research sessions' WebSearch budgets this shift. Termessos in particular has a confirmed 28-file Commons category (`Category:Gymnasium (Termessos)`) — someone with a fresh search budget should be able to close most of this gap fast. **Correction, 2026-08-15, Shift 18**: this note is stale for the 7 sites still open (Rhodes and Assos were genuinely closed by Shift 14). A Shift 18 agent dispatched to "top up their null `image_url`" found those 7 were never actually committed to `sports.geojson` at all — no feature, no null field, nothing to top up. Whoever picks this up next needs to re-add them as new features (name/notes/sources/coordinates from scratch) with a verified image in the same pass, not just search for an image against an existing entry.
- [x] **The `sites_buildings.geojson`/`sites_streets.geojson` naming-rule question needs a deliberate decision, not another audit.** *(2026-08-20, cloud shift 38: decided. Invariant 1.5 is scoped to curated display names — `sites.ts`, `pois.geojson`, and every other axis file's `name`/`display` field — and explicitly does not apply to the raw OSM building/street layer, whose in-language labels are source data, not the ancient/modern-name-duplication pattern the rule targets. One-line scope note added to `SHIFT_BRIEF.md` §1.5 so this stops resurfacing as an open question.)*

## New ideas spotted this shift (2026-08-14, Shift 13)

- [ ] **`demotiles.maplibre.org` (the map style's glyph/font CDN) is also blocked by this environment's egress proxy** — confirmed via a failed `net::ERR_TUNNEL_CONNECTION_FAILED` request to `demotiles.maplibre.org/font/...` during in-browser testing this shift. Not previously documented alongside the Wikipedia/Commons/Overpass/Nominatim blocks. In this specific sandbox it means MapLibre's own internal glyph-loading retries can make the map's `"idle"` event fire very slowly or effectively never during a Playwright session — don't use `map.once("idle", ...)` as a completion signal for in-sandbox testing; use a bounded `waitForTimeout` + explicit state check instead (what this shift's own testing settled on after hitting the hang firsthand). Untested whether real end users on the deployed Vercel site hit this at all — likely a sandbox-only proxy restriction, same pattern as the other confirmed blocks.
- [x] **`Map.tsx`'s thematic-layer load chain is no longer eager** — resolved by `[11-P0-2]` (lazy overlay loading). Each thematic axis file is now handed to `registerLayerLoader()` and only fetched the first time its group is switched on (or restored from persisted-on state), not in a sequential `await` chain on every cold load. The old "late-phase source is `false` after 3-5s" testing false-alarm no longer applies: a thematic source doesn't exist at all until its layer is toggled. The two base phases (roads, places) still load on ready, via `whenMapReady()`. This note and its Shift 17 follow-up below described the pre-`[11-P0-2]` architecture.
- [ ] **Playwright headless sessions in this sandbox died mid-test again this shift** (`"Target page, context or browser has been closed"`), same pattern Shifts 4-5 and 12 already documented, now confirmed a fourth+ time. Retrying with a fresh, shorter, single-purpose script worked every time, consistent with the existing note — just adding a data point, not a new finding.

## New ideas spotted this shift (2026-08-14, Shift 14)

- [ ] **Axis 3b coordinate precision — several entries are best-effort estimates, not gazetteer-verified.** The research session's own WebSearch budget ran out before dedicated coordinate checks for Grand (France), Fontes Sequanae, Tas-Silġ (Malta), and the pre-flooding Nile locations of the three Nubian temples (Kalabsha, Dendur, Debod). Coordinates are accurate to roughly a few kilometers — fine for the current point-marker scale, but worth tightening if a future feature (routing, precise distance measurement) needs better precision.
- [ ] **Axis 20 — Corinth, Termessos and Magnesia on the Maeander are now real features (added
  2026-08-22 by a cloud shift), but still ship without `image_url`** — a fourth dedicated search
  pass still couldn't confirm an exact Commons filename for any of the three (omitted the key
  entirely rather than `null`, per the validator's own preference). Termessos's `Category:Gymnasium
  (Termessos)` (~28 files) remains the closest to resolved — a session with working `WebFetch` to
  `commons.wikimedia.org` (or a different sandbox) should be able to open the category page
  directly and pick one filename, which every WebSearch-only attempt so far has failed to surface.
  **Iasos, Knidos and Alinda are still fully unresearched** — no feature exists for any of them yet,
  same "never actually committed" gap the rest of this note's history describes. Rhodes, Assos and
  Thera were closed by earlier shifts.
- [ ] **The detached-HEAD-behind-stale-main git symptom is now confirmed on 6 consecutive shifts (9 through 14).** Every shift independently rediscovers and fixes it (`git fetch origin main` + `git checkout main && git reset --hard origin/main` when a plain ff-only merge refuses due to unrelated histories). The fix is solid and well-documented in SHIFT_LOG.md at this point, but it's still costing real per-shift time — worth whoever administers these scheduled cloud sessions actually looking at why each fresh container starts with a stale local `main` pointer, rather than relying on tribal knowledge that doesn't carry across sessions.
- [ ] **JSON file re-indentation noise.** This shift's programmatic splice-and-rewrite of `pois.geojson` and `sports.geojson` (via Python's `json.dump(..., indent=1)`) reformatted the entire file from the original 2-space indent to 1-space, inflating the git diff for those commits even though every pre-existing feature's content is byte-identical (verified before committing). Not a data problem, just diff noise — match the original file's indent width if editing these files programmatically again.

## New ideas spotted this shift (2026-08-14, Shift 15)

- [ ] **Real bug found and fixed: `PoiMarkers.tsx` only ever rendered features with `extant_117ce === true`, silently hiding every non-extant POI from the map.** This was by-design for destroyed/not-yet-built structures (Pompeii's own buildings route through `sites_buildings.geojson`/the Explore panel instead), but it meant the entire new "battle" category (historical-memory event markers, almost never `extant_117ce:true`) would have been invisible on the live map despite being valid, correctly-schema'd data. Fixed by exempting `category === "battle"` from the extant gate. **Flagging for whoever picks up axis 3i (shipwrecks) or any other future "event, not structure" category**: the same exemption will be needed again — worth generalizing the filter (e.g. an explicit allowlist of "always show regardless of extant" categories, or a dedicated `is_event: true` property) rather than hardcoding one more `|| p.category === "..."` clause per axis.
- [ ] **`json.dump(..., ensure_ascii=True)` is a second flavor of the JSON reformatting-noise trap Shift 14 already flagged for `indent`.** Hit this firsthand this shift: re-serializing `pois.geojson` with Python's default `ensure_ascii=True` silently escaped every pre-existing literal `·` (middle dot, used in essentially every `image_credit` field) into `·`, inflating a 39-feature-addition commit into a 1,300+ line diff before it was caught and fixed (`ensure_ascii=False` matches the file's existing convention). Caught and fixed before pushing this time by diffing before committing — worth either a repo-level lint check, or just a standing reminder: **always diff a programmatically-rewritten `.geojson` file for stray whole-file changes before committing, not just spot-check the new features.**
- [ ] **Axis 3h (battlefields) landed at 39 of a rough 40-feature target — essentially complete against the brief's own named list.** Real remaining headroom if picked up again: the Kitos War's Cyrenaica and Mesopotamia fronts only got one attested engagement each (Lydda, Salamis) despite the brief flagging all four revolt zones (Cyrenaica, Egypt, Cyprus, Mesopotamia) — a fresh research pass specifically hunting a *named, attested* Cyrenaica or Mesopotamia engagement (not just "somewhere in the province") would close that gap. Two features (Vosges/Ariovistus, Idistaviso) still need a Commons image.
- [ ] **Axis 5b (client kingdoms/neighbors) is essentially complete against the brief's own list — 22/22 named polities, deliberately not padded further.** The one open item: Kingdom of Albania (Caucasian Albania) has no verified image — the research pass found candidates but they were all misleadingly late (medieval Christian-era structures), so it shipped `image_url: null` rather than force a wrong one. A future shift with a fresh search budget could try again for a genuinely period-appropriate image (a coin, an inscription, an archaeological-site photo).

## New ideas spotted this shift (2026-08-14, Shift 16)

- [x] **`provinces.geojson` carries only a bare `name` property per province — no governor, capital, or legion data.** ~~The open P2 "Province overlay" backlog item...~~ Resolved by later shifts' own work rather than by this note's own suggestion: `app/provinces.ts` (capital/blurb/status), `public/data/politics.geojson` governors, and `app/legions.ts` all shipped independently, and Province overlay (above) was built as a lens over them 2026-08-18.
- [x] **The sequential `await` chain settle-time concern is obsolete** — superseded by `[11-P0-2]`'s lazy overlay loading (see the resolved note above). Thematic layers are no longer fetched on cold load at all, so there is no multi-phase chain to settle; the cold-load cost is now just the two base phases. The `Promise.all` fix Shift 13 proposed is moot — lazy per-group loading solved the same problem more completely.
- [ ] **`public/data/substrate.geojson`'s `province` field intentionally departs from `pois.geojson`'s convention.** Every existing Italian `pois.geojson` entry uses `province: "Italia"`; the new Etruscan substrate layer instead uses the historically precise regional name (`"Etruria"`, `"Cisalpine Gaul"`) since a substrate/culture layer's whole point is showing pre-Roman regional identity. This is a deliberate, logged choice (see SHIFT_LOG Shift 16), not an oversight — flagging here too so a future consistency audit doesn't "fix" it back to "Italia" without checking this note first.
- [ ] **Wrong-period-photo risk applies beyond Mithraea/Hadrianic temples.** This shift caught a proposed image for a 117 CE "conventus center" entry (Philadelphia/Alaşehir) that was actually a photo of a 6th/7th-century Byzantine church — a real building at the right site, just 500+ years too late. Worth a standing habit for any future axis pinning "the famous building at this ancient site": a quick dating check on the image's own subject, not just on the site's founding date, before treating a Commons hit as safe to use.
- [ ] **Axis 10 (historical substrate) now has a working schema and one culture done (10b, Etruscan).** `public/data/substrate.geojson`'s `culture` field is ready to extend with the other five substrate cultures the brief lists: 10c (Phoenician/Punic — Carthage, Utica, Gades, Motya, Nora/Tharros/Sulci, Baria), 10d (Celtic — Alesia, Bibracte, Gergovia, Avaricum, British hillforts, Iberian castros, Galatian centers), 10e (Iberian/Basque), 10f (Egyptian pharaonic — Giza, the Sphinx, Valley of the Kings, Colossi of Memnon), 10g (Mesopotamian — Babylon, Nineveh, Ur, Hatra). A future shift can reuse the same Map.tsx wiring pattern (ghosted dashed-outline circle layer) and just add features with a new `culture` value.

## New ideas spotted this shift (2026-08-15, Shift 17)

- [ ] **Axis 10c (Phoenician/Punic substrate) is now done** — `substrate.geojson` has 28 Punic features alongside Shift 16's 22 Etruscan ones. Three of the brief's five remaining substrate cultures are still fully open: 10d (Celtic), 10e (Iberian/Basque), 10f (Egyptian pharaonic), 10g (Mesopotamian) — same schema, same `Map.tsx` wiring pattern, just a new `culture` value.
- [ ] **`Map.tsx`'s substrate-layer popup used to hardcode `"Etruscan"` as the culture label** — fixed this shift to read `p.culture` dynamically and capitalize it, since the layer now has two cultures. Worth remembering for any future per-culture styling (e.g. a legend color key) that a future shift might want to add as more cultures land.
- [x] **A small reusable splice-append script (`append_features.js`) can add new GeoJSON Feature objects to an existing file with a pure-addition diff** — done by a cloud shift, 2026-08-22: `scripts/append-geojson-features.mjs` (`npm run append-geojson`), a committed helper rather than scratch-directory throwaway code. Detects the target file's own indent width and line ending from the bytes around its `"features": [` array (not a hardcoded guess), text-splices new Feature objects in before the closing bracket, and rolls back automatically if the resulting feature count doesn't match. Tested against 1-space, 2-space, and empty-array target files plus literal unicode content (verified un-escaped, sidestepping the separate `ensure_ascii` trap Shift 15 also flagged). Used for real the same shift: 7 Via Sebaste road stations and 3 gymnasia both went in via this script with clean pure-addition diffs.
- [ ] **Dark mode (P3) is a bigger lift than a normal Track B slot** — confirmed this shift while scoping it before picking a different item instead. `Map.tsx` hardcodes the label-halo color `#f4ead5` inline more than a dozen times across its ~28 layer-definition blocks rather than reading from the `P` palette object already defined at the top of the file. A real "parchment → dark leather" theme swap needs either a careful multi-site refactor onto palette tokens first, or shipping a visibly inconsistent first pass. Flagging so the blocker is known going in, not discovered mid-shift.
- [ ] **Villae (axis 3d) landed at 37 of the brief's 40-feature floor, 3 short, and it's a real gap rather than a padding decision.** The research pass tested and rejected 18 well-known "Roman villa" candidates specifically because their earliest attested phase postdates 117 CE (Hadrian's Villa foremost — construction didn't begin until late 118/early 119, a full year past Trajan's death, not the "foundations already underway" case the brief's own judgment-call language covers). A future top-up would need either a fresh, wider geographic sweep (this shift's search leaned Italy/Britain/Gaul/Hispania heavy; Africa Proconsularis's imperial olive-oil estates and Pannonia/Noricum/Syria are thin) or accepting 37 as close to the real ceiling for "genuinely pre-118, well-attested, named villa."
- [ ] **Image gaps for a fresh-search-budget top-up**: 13 of this shift's 28 Punic substrate features and 22 of 37 villae shipped `image_url: null` after a first WebSearch pass found no confirmable Commons filename — same "real gap, not exhausted" flag prior shifts have used for similar cases (e.g. axis 20's gymnasia).

## New ideas spotted this shift (2026-08-15, Shift 18)

- [ ] **Axis 3c's 38 new economic-infrastructure features (this shift) still need image top-up on 33 of them.** Docimium, Mons Porphyrites, Cotta, Henchir Mettich, Rio Tinto, Timna, Elba, Baalbek quarry, and Mount Pentelicus are done; the rest (mostly lower-profile mines/quarries/garum factories/salinae/kilns across Cyprus, Dacia, Noricum, the Black Sea, and further Iberian/African sites) shipped `image_url: null` after two separate WebSearch passes' combined effort. Sites and prose are complete — this is a pure image-search top-up for whoever has a fresh search budget, same shape as the axis 20 gymnasia gap.
- [ ] **Substrate axis (10) now has four of six named cultures done** — Etruscan (10b), Punic (10c), Celtic (10d), Egyptian pharaonic (10f), 92 features total in `public/data/substrate.geojson`. Only **10e (Iberian/Basque)** and **10g (Mesopotamian)** remain untouched. 10g is a particularly good next pick — Babylon, Nineveh, Ur, and Hatra were all briefly under direct or allied Roman control in 116–117 CE during Trajan's own Mesopotamian campaign, so it doubles as living-empire (axis 4) material.
- [ ] **`app/Map.tsx`'s substrate hover-popup used to title-case the raw `culture` value directly** — worked fine for single-word values (`"etruscan"` → `"Etruscan"`, `"punic"` → `"Punic"`) but rendered the new `"egyptian_pharaonic"` value as `"Egyptian_pharaonic"` with the underscore intact. Fixed this shift to split on `_` and title-case each word. Worth remembering for any future multi-word `culture`/category value (e.g. if 10g's Mesopotamian entries ever want a two-word culture key).

## New ideas spotted this shift (2026-08-15, Shift 19)

- [ ] **Axis 10 (historical substrate) is now complete against the brief's own six named cultures** — Etruscan, Punic, Celtic, Iberian/Basque, Egyptian pharaonic, Mesopotamian, 148 features total in `public/data/substrate.geojson`. A future shift wanting more from this axis would need to go deeper on an existing culture (e.g. Iberian's Lusitanian/Turduli sub-regions were thin) rather than open a new one.
- [ ] **`substrate.geojson` uses 2-space JSON indent, `pois.geojson` uses 1-space.** Confirmed this shift when a first splice attempt used the wrong indent width and produced a 2,579-line whole-file reformat diff instead of the intended ~30-feature addition (caught by diffing before committing, not after). Any future programmatic splice into either file needs to check that specific file's own indent convention first — don't assume one width applies project-wide.
- [ ] **Iberian substrate (axis 10e) has a real image gap**: 12 of 32 features shipped `image_url:null` after two combined search passes (one research-agent pass, one personal follow-up). Real remaining candidates: Edeta likely has more Commons-hosted companion pieces beyond the one vase now in use; Tarraco/Kese could use a photo of the polygonal Iberian-era masonry visible beneath Tarragona's later walls; Enserune (Gallia Narbonensis) is a genuinely excavated, museum-backed site that just didn't turn up a confirmable filename yet.
- [ ] **Mesopotamian substrate (axis 10g) has a smaller image gap**: 4 of 24 features (Larsa, Vologesias, Charax Spasinou, and one other) shipped `image_url:null`. Vologesias in particular may never close — its ruins remain archaeologically unidentified, so there may be no photographable site to find an image of at all.
- [ ] **Axis 3c's economic-infrastructure image gap is down to 28 of the original 34** (was 33 after Shift 18, now 6 closed this shift). The research agent's own near-miss notes are the fastest path to closing more: an 18th-century Andrea Locatelli painting of Ostia's salt pans (exact filename unconfirmed), a Carteia garum-factory reconstruction illustration (needs verification it's site-specific, not generic), and Commons category pages for Tricio pottery and Henchir Mettich's Lex Manciana inscription that likely contain a matching file but weren't isolated to an exact name.

## New ideas spotted this shift (2026-08-16, Shift 20)

- [ ] **Axis 9 (daily life patterns) now has its first content** — housing typologies (`public/data/housing_styles.geojson`, 7 zones). The other five sub-axes the brief lists (9b cuisine regions, 9c clothing/fashion, 9d spectacle/gladiator schools, 9e death-ritual heat-map, 9f sexuality/gender geography) are all still fully open and would reuse the exact same soft-fill polygon pattern this shift used (or the point-marker `pois.geojson` pattern for something like gladiator schools specifically, which is a short, well-documented list — Rome's four imperial ludi, Capua, Ravenna, Alexandria, Pergamon).
- [ ] **Axis 3e (necropoleis + tombs) has real headroom left.** 43 new features shipped this shift (14 → 57 total in the mausoleum/tomb/necropolis family), well past the axis-3 40-feature floor, but the research agent's own excluded-candidates list (Kom el Shoqafa, Igel Column — both post-117) and untouched leads (more of Via Appia's tomb corridor beyond what shipped, Cyrenaica's Ptolemais necropolis, additional Petra Royal Tombs beyond the 5 that shipped, Gallic/German provincial elite tombs beyond the one Glanum example) mean a future shift could keep going here without repeating work.
- [ ] **`pois.geojson`'s real schema is `name_latin` + `name_english` + `built`/`destroyed` year fields, not a single `name` field** — confirmed this shift when a research agent's own output used `name` and had to be transformed before merging (checked against `poi_mausoleum_augustus` to confirm the real schema). Any future research-agent prompt targeting `pois.geojson` specifically should hand the agent this exact schema up front (including the `Sepulcrum X` / `Mausoleum X` Latin-name-construction convention already established for tomb-family features) rather than a `name`-only schema borrowed from one of the project's other, simpler axis files (health.geojson, imperial_cult.geojson, etc., which really do use a single `name` field) — the two schema families are easy to conflate and this shift's mixup cost a full manual-transform pass to fix before it could be committed.
- [ ] **Axis 3e image gap**: 12 of this shift's 43 tomb-family features shipped `image_url:null` — see this shift's own commit message for the exact list and candidates.
- [ ] **Every `/site/[slug]` page reuses the 40 `app/sites.ts` entries as-is** — no new content was written, so none of the 40 pages carry an `image_url` (that field doesn't exist on `SiteInfo` at all yet). A future shift wanting real hero images on these SEO pages would need to add an `image_url`/`image_credit` pair to `SiteInfo` first, sourced the same way axis POIs are (Wikimedia Commons, verified before use).

## New ideas spotted this shift (2026-08-16, cloud shift 3)

- [ ] **A real, site-wide click-priority bug — check any future multi-polygon layer for it.** Several sites' Overpass fetches mix each park's own whole-site boundary polygon and, in Ostia/Pompeii's case, "Regio"-numbered district outlines, into the *same* source and layer as individual named buildings. Whichever renders later in the source's feature array draws on top and permanently swallows clicks meant for the specific building underneath — confirmed this was silently breaking Pompeii's brand-new curated content until fixed by ranking `e.features` by polygon area and picking the smallest in `Map.tsx`'s click handler (see `[06-P0-2]` in `BOARD.md`). Any future overlay that mixes point/polygon features of very different sizes in one clickable layer should check for this same failure mode before shipping.
- [ ] **`app/pompeiiDescriptions.ts` has real headroom left.** 28 of 30 researched buildings shipped; 332 of Pompeii's 360 named OSM buildings are still uncurated (Casa dei mosaici geometrici, Casa di Trebio Valente, Casa del Triclinio all'aperto, more named tombs on the Porta Ercolano/Porta Nocera necropolis streets, and dozens more — `python3 -c "import json; ..."` against `public/data/sites/pompeii_buildings.geojson`'s `name` field is the fastest way to pull the current uncurated list). 38 other sites in `app/sites.ts` still have zero curated buildings at all.

## New ideas spotted this shift (2026-08-21, cloud shift 40)

- [x] **Axis 12's 10 new imperial-cult records shipped `image_url: null`** — resolved 2026-08-21 by cloud shift 41: 6 of the 10 closed (Banias/Omrit, Gortyn, Corinth, Philippi, Nicopolis, Segobriga). Four remain genuinely open — see the new note below, same shape, smaller list.
- [ ] **Banias's Augusteum and the Tres Arae Sestianae both ship `confidence: medium`** on a genuine scholarly disagreement, not a research shortfall — Banias's temple location is actively debated between a cave-mouth candidate and Khirbet Omrit (recent excavations favor the latter), and the Tres Arae's exact footprint on the Cape Finisterre headland is traditional rather than excavated. Worth a revisit if either site gets a firmer identification in the literature.
- [ ] **Via Cottia was already complete (6/6 stations) when this shift checked it** — Shift 39's own handoff suggested it as the next pick, but it turned out to be done already (presumably by an untagged commit between Shift 39's research and this shift's start, or Shift 39 simply hadn't re-checked it against the live file). Worth a standing habit: verify a handoff's "still open" claim against the actual data file before spending research budget on it, not just trusting the note.

## New ideas spotted this shift (2026-08-21, cloud shift 41)

- [ ] **Axis 12's remaining 4 image-null cult centers**: Tres Arae Sestianae and Savaria's Ara Augustorum are known only from ancient texts/inscriptions with no excavated structure ever photographed — these may never close. Salona's Temple of Augustus and Nola's Temple of Divus Augustus have no Commons file specifically depicting the temple itself among the generic site photos available for those towns — worth one more fresh-search-budget attempt before writing them off the same way.
- [ ] **Axis 15's alimenta-town gap (23/50) needs a source this environment can't reach, not more WebSearch effort.** A dedicated research pass this shift confirmed scholarship puts the real ceiling at 39-53 attested Italian towns, but the two catalogs that would name the rest — Ruggiero's Dizionario Epigrafico "Alimentarii" entry, R. Duncan-Jones's Appendix II in *The Economy of the Roman Empire* — sit behind fetches (Treccani, EDCS, two university institutional repositories) that returned `EGRESS_BLOCKED` even via WebSearch snippets, not just direct WebFetch. A shift with real library/database access, or a session in a different sandbox, is the actual unlock here.
- [ ] **`curate-buildings` [06-P0-2] has 28 sites left; Djemila and Volubilis are the next-easiest picks by named-OSM-building count.** Djemila has 10 named buildings — checked this shift (`Thermes romains`, `Arc de Caracalla`, `Temple de la famille des Sévères`, `Roman Forum`, `Basilica of Cresconius`, `Roman Forum Courtyard`, plus 4 modern non-ancient tags to skip: `Djémila` itself, `Centre de santé`, `Maison de jeunes`, `Auberge Djemila`) but not researched — the Arc de Caracalla/Severan-family temple/Basilica of Cresconius all look post-117 on their names alone (Caracalla reigned 198-217; Cresconius is a Byzantine-era bishop's name) but need the same real per-building research pass Leptis Magna and Timgad got before shipping dates, not an assumption. Volubilis has only 4 named buildings — thinner but real, same treatment.
- [x] **The `curate-buildings` click-handler chain in `Map.tsx` is now 12 sites deep as a nested ternary** (ostia → pompeii → herculaneum → ephesus → delphi → jerash → trier → merida → palmyra → athens → leptismagna → timgad → undefined). Still readable, but worth converting to a lookup table (`Record<string, (name) => Entry | undefined>`) before a 15th or 20th site makes it genuinely hard to read — flagging now rather than letting it compound silently the way `[03-P0-2]` card-rebuild's missing spec did. *(2026-08-22, cloud shift 44: done — it had reached 22 deep by the time this was picked up. `app/Map.tsx` now holds a `SITE_ENTRY_LOOKUP: Record<string, (name) => CuratedEntry | undefined>`; the click handler is a one-line `SITE_ENTRY_LOOKUP[site]?.(rawName)`. Adding a site is now a two-line diff (one import, one table row) instead of restructuring the ternary — used immediately for this same shift's own six new sites.)*
- [ ] **Leptis Magna's OSM `name` field had a real, sourced error** (`"Arch of Marcus Aurelius"` for what every dated source calls Trajan's own arch — the Marcus Aurelius name belongs to a different arch entirely, at Tripoli/ancient Oea) — corrected this shift, one-line diff. Worth a standing habit for any future curate-buildings pass: check a monument's OSM name against its actual attested date/attribution before writing a description around it, the same way axis-file image sourcing already checks a photo's actual date against the site's founding date.

## New ideas spotted this shift (2026-08-22, cloud shift 44)

- [x] **The curate-buildings lookup pattern has a real architecture limitation: it matches purely
  by OSM `name` string, with no way to give two identically-named polygons two different
  answers.** *(2026-08-22, cloud shift 45: the plumbing half is done — every `*Entry` lookup
  function now receives an optional `osmId` second argument (`SITE_ENTRY_LOOKUP[site]?.(rawName,
  p.osm_id)` in `app/Map.tsx`), additive and non-breaking since every existing site file still
  ignores it. Vindolanda's own two dropped name-families ("Bath House" x2, "Temple" x3) are
  **still not restored** — that needs real per-osm_id research (which specific polygon is which
  fort period) that this shift didn't attempt, not just the code change. Left open for whoever
  wants to do that research pass.)*
- [ ] **`curate-buildings [06-P0-2]` has 10 sites left.** Rome (289 named features, by far the
  biggest remaining site — worth scoping carefully or splitting across multiple passes rather than
  assuming a normal-sized batch), aquincum and xanten (both confirmed too-thin by Shift 43 — don't
  re-check expecting a normal batch), and three more modern-city-sized sites (verona, ravenna,
  milan) — checked this shift, all three have real named-building files worth a look: Verona has
  Arco dei Gavi, Teatro Romano, Tempio di Giove Lustrale, Porta Borsari and Porta Leoni (Roman
  gates — verify Porta Nuova/San Giorgio aren't Sanmicheli-era Renaissance rebuilds before
  including them); Ravenna's named features all looked post-Roman on inspection (5th-6th c.
  Christian basilicas, medieval gates) — worth a real research pass to confirm there's nothing
  period-appropriate before skipping it outright, rather than assuming from names alone; Milan has
  a real Anfiteatro Romano plus a Domus Nostra, everything else in its 138 named features is later
  Christian basilicas or modern clutter. Brescia and Rimini (this shift) are a further data point
  that modern-city size alone doesn't predict thinness — both had real, dateable Roman cores.

## New ideas spotted this shift (2026-08-22, cloud shift 45)

- [x] **Ravenna's OSM building extract has zero genuine 117 CE content — confirmed, not just
  flagged.** A cloud shift, 2026-08-22, checked all 114 named features in `ravenna_buildings.geojson`
  directly (no Overpass fetch needed, already on disk): every one is 5th-6th-century-or-later
  (basilicas San Vitale/Sant'Apollinare Nuovo, the Mausoleo di Galla Placidia, medieval city gates)
  or modern port/rail infrastructure. `[06-P0-2]` curate-buildings should skip Ravenna outright —
  don't re-check expecting a normal batch, same as the already-settled aquincum/xanten calls.
- [ ] **Road-station additions need an exact-coordinate check against already-mapped stations and
  full sites before adding a new point**, the same lesson `[12-FIX-2]` already taught for POIs.
  Hit this concretely adding Via Domitiana's stations this shift: Sinuessa is both the Via
  Domitiana's actual starting point *and* an existing `station_sinuessa` (Via Appia) at the exact
  same coordinates — re-added as a road-station point it would have stacked a duplicate pin.
  Enriched the existing entry's `notes` instead of adding a second point. Worth a standing habit
  for the next road-stations batch, the same way `[06-P0-2]`'s own batches now check named-building
  counts before claiming a site.

## New ideas spotted this shift (2026-08-22, a cloud shift)

- [x] **Axis 9d (spectacle + gladiator geography) is already fully complete — confirmed, not a
  gap.** Dispatched a research agent to open this sub-axis fresh (it had zero prior data by this
  shift's own read of the file layout), only to find, before writing anything, that all 7 named
  candidates already exist as real, sourced `pois.geojson` records: `poi_ludus_magnus_rome`,
  `poi_ludus_dacicus_rome`, `poi_ludus_gallicus_rome`, `poi_ludus_matutinus_rome`,
  `poi_ludus_capua`, `poi_ludus_ravenna`, `poi_ludus_pergamon` — an earlier, undocumented shift
  must have shipped this axis without a `sports.geojson`-family file of its own (it lives in the
  main POI canon instead, category `ludus`). Caught by the standing exact-coordinate collision
  check before any duplicate was written — no data changed. Saves a future shift the same
  redundant research pass.
- [ ] **A real dating question surfaced on `poi_ludus_pergamon` while checking the above, worth a
  dedicated `[08-P1-6]`-style verify pass.** The existing record ships `extant_117ce: true` on the
  strength of literary attestation of a state-run *institution* (unrv.com), which is a defensible
  claim on its own — but this shift's research agent found real, independent evidence (DAI
  Pergamon Excavation project fieldwork, 2019-2021; Archaeology Magazine May/June 2022) that the
  *excavated amphitheatre* at Pergamon — the building where such a school's fighters would have
  performed — was actually built under Hadrian's 120s CE program, after this map's 117 CE
  snapshot. The clearest evidence tying a named gladiator troop to Pergamon specifically (Galen's
  post as physician to "the gladiators of the high priest of Asia") also dates to 157-161 CE, four
  decades past the snapshot. Not changed this shift since the existing claim (an institution, not
  a building) isn't strictly contradicted — but a future `verify` ticket should settle whether
  `poi_ludus_pergamon`'s `confidence: low` should also carry an explicit note about the building
  itself postdating 117 CE, the same way Baalbek's Temple of Bacchus got corrected.
- [ ] **Also researched but explicitly not added: a gladiator school at Alexandria.** The research
  agent could not confirm a real, located ludus there — the one architectural candidate
  (Kom el-Dikka's "amphitheatre") turns out on closer reading to be a small Roman theatre/odeon
  used for music and civic gatherings, not gladiatorial combat, and the only spectacle-culture
  citation found (Dio Chrysostom, *Oration* 32) doesn't name a specific school. Correctly excluded
  rather than guessed — matches the brief's own framing of Alexandria as one candidate among the
  named list, not a certainty.
- [ ] **Image top-up pass on 13 long-standing null-`image_url` POIs came back mostly empty — this
  environment's `WebSearch` budget is per-session, not per-agent, and this shift exhausted it.**
  Targeted the 9 remaining economic-infrastructure nulls (Lutudarum, Pangaion, Ampelum, Docimium,
  Marmara Island, Goktepe, Montans, Banassac, Tricio) plus the 4 remaining Mesopotamian-substrate
  nulls (Charax Spasinou, Vologesias, Singara, Larsa). Only Larsa produced even a medium-confidence
  candidate (`Larsa Ziggurat (30897923765).jpg`, via a real `Category:Larsa` hit) — not added this
  shift since the agent's own search budget ran out before it could open the file page to confirm
  licensing/subject match, and a wrong image is worse than none. Four more (Docimium, Marmara
  Island, Tricio, Charax Spasinou) have real, confirmed Commons *categories* but no specific
  filename pinned down before the budget ran out — best next candidates for a fresh pass. The other
  eight came back with zero usable Commons content after real searching (one near-miss caught and
  correctly rejected: Charax Spasinou's only Commons hit is a butterfly genus of the same name, not
  the ancient city) and may genuinely lack a photographable/identifiable site. **Worth flagging
  for whoever picks this up next: don't run more than one WebSearch-heavy agent per shift if a
  prior agent in the same session may have already spent most of the budget** — this shift's own
  three research agents before this one likely account for the exhaustion.
- [ ] **Via Herculia is Tetrarchic (built under Diocletian and Maximianus "Herculius," c. 293-305
  CE, named after the latter), not Trajanic — do NOT add it as a 117 CE road.** This shift went
  in on a wrong premise (conflating it with the genuinely Trajanic Via Traiana, which it happens
  to physically cross at Aequum Tuticum) and a dedicated research pass caught the error before
  anything was written: every source found (P.G. Buck, "The Via Herculia," *PBSR* 39 (1971) 66-87;
  Italian Wikipedia; a 2019 MDPI/Geosciences geoarchaeological study) agrees on the Tetrarchic
  date, with a later repair recorded under Maxentius in 311 CE. It postdates this map's snapshot
  by 176+ years and should not be added under any name — same discipline as the project already
  applies to Hadrian's Wall (started 122) or the Baths of Caracalla (216). The research did surface
  three real, useful things for whoever wants to look at this road as a later-era note or picks a
  genuinely Trajanic road instead: (1) three of its towns are already curated `road_stations.geojson`
  entries under different, correct roads — Venusia (`station_venusia`, Via Appia), Aequum Tuticum
  (`station_aequum_tuticum`, Via Traiana, whose own notes already mention the Herculia crossing),
  and Nerulum/Consilinum (Via Popilia) — don't duplicate these if a later-era Herculia layer is
  ever built; (2) Potentia (Potenza), Anxia (Anzi, under active excavation by the University of
  Basilicata's "Ritorno ad Anxia" project) and Grumentum (Grumento Nova) are real, well-documented
  nodes with no existing curated entry, genuinely new content if this road is revisited under its
  correct multi-century-later date; (3) no ancient itinerary lists this road's stations in
  sequence — everything is scattered milestones and modern survey, so most inter-station distances
  are simply unattested and shouldn't be invented even in a later-era pass.

## New ideas spotted this shift (2026-08-22, a cloud shift, water infrastructure batch)

- [ ] **Axis 3f (water infrastructure) image gap**: 7 of the 14 new point features shipped
  `image_url: null` after the research agent's search budget ran dry — Glanum Dam, Ermita de la
  Virgen del Pilar Dam, Faynan Reservoir/Dam, Bulla Regia Cisterns, Avdat Cisterns, Mamshit
  Cisterns, and the Janiculum Watermills. Same "real gap, not exhausted" shape as prior axes'
  image top-up notes (axis 20 gymnasia, axis 3c economic infrastructure) — worth a fresh-budget
  WebSearch pass rather than assumed unphotographable; Avdat and Mamshit in particular are active
  Israeli national park sites almost certainly on Wikimedia Commons under a slightly different
  search term than what was tried.
- [ ] **Axis 3f has real headroom left beyond this shift's 21 features** (24 → 45 total, past the
  40-floor). Researched-but-excluded for postdating 117 CE: Consuegra Dam (3rd/4th c.), Cendere/
  Severan Bridge at Commagene (198-204 CE), the Hadrianic aqueduct of Corinth, the Side aqueduct
  (Pamphylia, late 2nd c.). Researched but dropped for too-broad dating: Kasserine Dam and Puy
  Foradado Dam (both only "2nd or 3rd century CE" in every source found, not enough to place
  confidently on either side of 117). Karamagara Bridge wasn't researched at all — flagged, not
  excluded. A future pass could also look at cisterns in the Levant/Asia Minor beyond the Negev
  (Side, Perge) and more named bridges in Britain/Germania, both thin in this batch's coverage.

## New ideas spotted this shift (2026-08-22, a cloud shift, curate-buildings batch)

- [x] **`curate-buildings [06-P0-2]`'s Carnuntum candidate is dead — confirmed, not just flagged.**
  Checked before spending research budget: all 8 named features in
  `public/data/sites/carnuntum_buildings.geojson` are modern Petronell-Carnuntum village buildings
  (a kindergarten, a parish office, a cultural center) — zero Roman content. Skip outright, same
  call already settled for Aquincum, Xanten, and Ravenna.
- [x] **Ancona `curate-buildings` — done 2026-08-23 by cloud shift 48.** Confirmed: 3 of 66 named
  OSM features (`Foro romano`, `Porto traianeo`, `Domus`) carry `historic:archaeological_site`;
  "Arco del Rastrello" checked and confirmed a later, non-Roman arch, not the Arch of Trajan under
  a different name. The Arch of Trajan itself has no OSM name tag at all in this extract, so it
  couldn't be curated here — added as a standalone `pois.geojson` point instead, along with the
  amphitheater. See `app/anconaDescriptions.ts` and `SHIFT_LOG.md` for the full writeup.
- [ ] **Docimium (İscehisar, Phrygian pavonazzetto marble) is the one axis-17 quarry
  `SHIFT_BRIEF.md`'s own hunting list names that still isn't on the map.** Don't confuse it with
  the already-present Proconnesus/Marmara Island quarry (Special:FilePath aside, a genuinely
  different stone and a different island) — that one's real, this is a separate gap. Small,
  well-bounded, single-point addition for whoever wants to fully close axis 17's quarry side to
  match this shift's completed mine side.
- [ ] **`scripts/append-geojson-features.mjs`'s text-splice guarantee only holds until the next
  thing touches the target file.** Confirmed this shift: running a Python cleanup pass with
  `json.dump()` *after* a successful append (to drop some empty `image_url` keys) silently
  re-serialized the entire file in Python's own indent/quoting convention — a 1,352-line diff for
  a 14-feature cleanup, caught only because `git diff --stat` looked wrong before committing. Any
  post-append fixup needs to happen on the *source* JSON before the splice runs, never on the
  target `.geojson` after — the append script has no way to know or prevent a later tool from
  reformatting its own careful text-splice.

## New ideas spotted this shift (2026-08-23, a cloud shift, agriculture/roads/alimenta batch)

- [ ] **Axis 7a (crop/livestock zones) is now complete against `SHIFT_BRIEF.md`'s own list** —
  `agriculture.geojson` 18 → 28. Still fully open: 7b (sailing seasons / mare clausum, an animated
  header overlay, not a data file) and 7c (named winds — Etesian, Aquilo, Auster — plus the Nile
  flood, as points/arrows in a new `wind_currents.geojson`). Good next pick for whoever continues
  this axis; neither needs Overpass or direct image fetch, both are WebSearch-only research.
- [ ] **Before adding a "new road," check every candidate station's coordinates against the whole
  file, not just the road name.** This shift nearly duplicated 6 stations (Gesoriacum through
  Bagacum) that already existed under `road: "Via Agrippa"` — a different name for what turned out
  to be the same physical route. A road name search alone (`grep road_stations.geojson`) would have
  missed it since the existing entries use "Via Agrippa," not "Via Belgica." Caught only by
  comparing actual coordinates before committing. `road_stations.geojson`'s Boulogne-to-Cologne
  stretch is now complete (Via Agrippa, 495 stations total) — a genuinely untouched road is still
  open work for axis 2.
- [ ] **Alimenta towns (axis 15) likely can't get much past ~26/50 from WebSearch snippets alone.**
  The two big bronze tables (Veleia, Ligures Baebiani) that prior shifts already mined are the bulk
  of what's individually nameable from secondary-source summaries; several more towns the brief's
  own "53 towns and municipia" figure implies are attested only in aggregate scholarship, not by
  name, in what WebSearch surfaces. Whoever wants to close the rest of the gap likely needs direct
  access to Duncan-Jones's full town list (a library/JSTOR source this sandbox can't reach), not
  another round of the same search terms.
- [ ] **`[09-P0-1]` ancient-sources batch 6 nearly repeated batch 5's own documented mistake** — a
  search for a "Trajan's Markets ancient source" surfaced an Aulus Gellius passage that on close
  reading is about the neighboring Forum's colonnades, not the Markets, exactly the confusion
  batch 5 already flagged and rejected for this same POI. A general WebSearch summary can blur
  "Forum of Trajan" and "Markets of Trajan" together even when the underlying source text
  distinguishes them — worth reading the board's own prior-batch notes for a POI before trusting a
  fresh search hit, not just searching cold. This ticket's own conclusion still holds: the
  remaining ~80-POI pool needs `[09-P1-4]` epigraphy's inscription channel, not more literary-only
  passes.

## New ideas spotted this shift (2026-08-23, cloud shift 51, provenance/excavation/citations batch)

- [ ] **`ProvincePanel.tsx`'s real-mouse-click path onto `provinces-fill` still doesn't register
  in this exact sandbox**, reconfirming cloud shift 30's 2026-08-18 finding on the same panel
  (`BOARD.md`'s `[02-P0-2]` note) two weeks later. A synthetic Playwright `page.mouse.click()` at
  a screen point verified via `queryRenderedFeatures` to be over a real `provinces-fill` polygon,
  at zoom 4.2 (well under the handler's 7.5 gate), simply produces no panel — `map.fire('click',
  {point, lngLat, originalEvent})` does work and is the only verification path that's succeeded
  twice now. Worth either a genuine root-cause dig (real click events clearly aren't reaching
  MapLibre's internal interaction manager here, for a reason distinct from the documented
  `demotiles.maplibre.org` glyph block) or just formalizing `map.fire('click', ...)` as this
  project's standard way to test any layer-click handler in this sandbox, so the next shift
  doesn't have to rediscover the same workaround from scratch.
- [ ] **`json.dump(...)` without an explicit `indent=2` reformats `pois.geojson`'s whole-file
  diff, same trap Shift 14/15 already flagged for `indent`/`ensure_ascii`.** Hit it directly this
  shift: a first pass at adding two `ancient_sources` entries used Python's `indent=1` default-ish
  habit (carried over from a different file's edit earlier the same session) and produced a
  31,000+ line diff for what should have been a 20-line addition — caught and reverted before
  committing by diffing first, per the standing habit those earlier shifts already established,
  but worth restating pointedly: **check the target file's actual indent width before any
  programmatic JSON rewrite, every time, not just for files touched for the first time.**
- [x] **Axis 7's 7b (sailing seasons/mare clausum) and 7c (named winds/currents) are still
  untouched** — resolved: 7b/7c shipped 2026-08-24 (cloud shift, `wind_currents.geojson` +
  `SailingSeason.tsx`) and 7d (wild fauna sourcing) shipped the same day by the next shift
  (`fauna_sourcing.geojson`). Axis 7 is now fully closed against `SHIFT_BRIEF.md`'s own named
  list for the first time.

## New ideas spotted this shift (2026-08-24, cloud shift — axis 7d/ancient-sources/images)

- [ ] **`[09-P0-1]` ancient-sources' remaining ~67-POI pool is now dominated by tombs, villas,
  shipwrecks, and industrial sites where a real ancient source is genuinely unlikely to exist** —
  batch 7 (this shift) confirmed the pattern batches 5/6 already found: 11 of 15 researched
  candidates came back honestly unsourced. Two near-misses caught and rejected before merging
  (an Aulus Gellius passage about the neighboring Forum offered for Trajan's Markets; a Temple-
  of-Augustus inscription at Pula misattributed to the neighboring amphitheatre) — worth reading
  before trusting a fresh search hit on a POI a prior batch already checked, same lesson batch 6
  already logged. Diminishing returns without a new source class; `[09-P1-4]` epigraphy is
  already standing and has already absorbed the inscription-bearing wins this pool had.
- [ ] **Image coverage for `confidence: high` POIs isn't tracked by `npm run metrics`** — only
  overall image coverage (53.5%→57.1% this shift) is. A direct query against `pois.geojson`
  found 67 confidence:high POIs with no `image_url` at shift start (now 49 after an 18-POI
  batch); the 28 `poi_fortress_*` legionary-fortress records are the largest untried single
  cluster left. Worth adding a confidence:high image-coverage row to `scripts/metrics.mjs`'s
  output so this doesn't need re-deriving by hand each time.

## New ideas spotted this shift (2026-08-24, cloud shift — dark-mode verification)

- [x] **A manual light/dark/system theme toggle is a real, separate feature from the
  "Dark mode / night-map style" item just closed above** — *(Shipped 2026-08-24, the next cloud
  shift: `app/useTheme.ts` + `app/ThemeToggle.tsx`, an "Appearance" section in the hamburger menu
  next to Sailing season. Three states — System (the unchanged default, tracks
  `prefers-color-scheme` live) / Light / Dark — persisted to `localStorage["roman-maps:theme"]`.
  The scoping note below turned out right about the shape and wrong about the cost: the ~30
  `P.<key>` callsites needed neither hand-threading nor a map remount. `swapPaletteColors()` walks
  `map.getStyle().layers` and swaps any paint property whose literal string value matches an
  outgoing `Palette` entry, so it covers every layer including thematic overlays switched on
  later, with no per-layer list to keep in sync. Two real traps handled: `LIGHT.land` and
  `LIGHT.labelHalo` are the same `#f4ead5` but diverge in `DARK`, so a naive value lookup is
  ambiguous for that one pair — disambiguated by paint-property name (`land` only ever paints
  fill/background, `labelHalo` only halo/stroke); and the road-station marker is a canvas-drawn
  `addImage` icon with the halo color baked into its pixels, so it's regenerated via
  `updateImage` on switch. `P` also became a `let`, reassigned on switch, so a lazy overlay
  loaded after a theme change bakes in the right palette rather than the mount-time one.
  A flash-of-wrong-theme guard runs in `app/layout.tsx` — deliberately a plain synchronous
  `<script>`, not `next/script`'s `beforeInteractive`, which measurably runs after first paint in
  Next 14's app router (caught by Playwright mid-implementation: `data-theme` was still null at
  DOMContentLoaded and only appeared by `load`). `globals.css` now defines the dark token block
  twice — guarded `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` plus
  `:root[data-theme="dark"]` — so an explicit choice wins in both directions. Verified live with
  `next dev` + Playwright: OS-dark default still renders dark with no `data-theme` attribute;
  toggling to Dark on a light-OS context live-repaints bg `#a9d1e3`→`#0f2233`, land
  `#f4ead5`→`#232628`, roads `#a12b0d`→`#c9573b`, label halos `#f4ead5`→`#111315` and chrome
  `--surface` `#ffffff`→`#292a2d` with no reload; the choice survives a reload with `data-theme`
  set by DOMContentLoaded; and an explicit Light beats a dark OS at 375×812. Screenshots at
  1280×900 and 375×812, both schemes.)* Original scoping note, kept for the record — the map and
  chrome already repalette
  correctly off OS `prefers-color-scheme`, but there's no in-app override, so a user whose OS is
  stuck light (or dark) can't see the other mode. Scoping this honestly: `app/globals.css`'s
  chrome tokens could take a `:root[data-theme="dark"]` override cleanly (same pattern this repo
  already documents for artifact theming), but `app/Map.tsx` bakes its `LIGHT`/`DARK` `Palette`
  into every layer's paint properties once at style-construction time (`prefersDark()`, one read,
  line 187) — grepped every `P.<key>` callsite before writing this note: it's ~30 distinct layer
  IDs (base map, provinces, roads, every thematic circle-layer's `circle-stroke-color`, label
  halos). A live toggle needs either a `setPaintProperty` pass over all ~30, or a full map
  remount — and a remount is riskier than it looks, since `Ruler.tsx`/`Directions.tsx`/
  `ZoomControl.tsx`/`Compass.tsx`/`PoiMarkers.tsx`/`PeopleMarkers.tsx`/`ContextMenu.tsx`/
  `ProvincePanel.tsx` all grab a live reference to `window.__map` once on their own mount and
  don't currently re-poll on a later map replacement. Real, well-scoped Track B work for a future
  shift with a full 25-30% slice free for it — not something to rush into the same pass as the
  verification above.

## New ideas spotted this shift (2026-08-24, cloud shift — Beneventum/Paestum/fortress-images)

- [ ] **`next dev` started 404ing on every `/place/[slug]` route mid-session, including
  long-established ones like `poi_forum_romanum`, not just this shift's new data.** Happened after
  a `pkill -f "next dev"` + restart partway through the session (the first restart, right after
  the dark-mode verification pass, worked fine — this was a *second* restart later on). Root-
  caused as isolated to `next dev` in this sandbox: a full `npm run build` at the exact same
  commit generated and correctly served all 620 pages, confirmed by grepping three of this shift's
  own new pages directly out of `.next/server/app/place/*.html`. Didn't chase the dev-server root
  cause further given production build is what Vercel actually deploys — but a future shift
  relying on `next dev` + Playwright for live verification (per `[02-P0-4]`'s note that this
  became possible again 2026-08-19) should know a `/place/` 404 doesn't necessarily mean the data
  is broken; cross-check against a real `npm run build` before concluding a regression.
- [ ] **14 of `sites.ts`'s 16 zero-`pois.geojson`-coverage sites remain** (Djemila, Volubilis,
  Leptis Magna, Sabratha, Jerash, Trier, Italica, Tivoli, Palestrina, Cumae, Capua, Brescia, Milan,
  Rimini, Luni) after this shift closed Beneventum and Paestum. Same well-bounded Track A shape
  the original note (2026-08-12, Shift 6) already described — pick one or two per shift. Worth
  checking each candidate's monument set for 117-CE datability before committing a research pass
  to it, the way this shift did for Beneventum's theatre trap — some of these (Volubilis
  especially: its Capitolium, Basilica, and Arch of Caracalla are all genuinely 3rd-century, so a
  naive pass could end up with a mostly-`extant_117ce:false` set) will need more care than others.

## New ideas spotted this shift (2026-08-24, cloud shift — Djemila/Volubilis, theme toggle)

- [ ] **HIGH VALUE / invariant-1.5 violation: all 545 `/place/[slug]` pages are titled with the
  LATIN name, not the English one.** `app/place/[slug]/page.tsx` lines 109 and 140 both read
  `p.name_latin || p.name_english`, so the Colosseum's page is titled *"Amphitheatrum Flavium —
  Roman Maps"*, Paestum's Temple of Neptune is *"Templum Neptuni"*, and the English name is demoted
  to a grey subtitle under the heading. This inverts invariant 1.5 ("every display field ... uses
  the name a general English-speaking Google-Maps user would recognise; ancient names live in the
  blurb or the details panel body, never in the display name"), and it does so on exactly the
  surface where it costs the most: the `<title>`, the `<h1>`, the OpenGraph and Twitter card
  titles, the JSON-LD `name`, and the "nearby places" list at line 304 — i.e. every string Google
  indexes and every string a shared link previews with. Nobody searches "Amphitheatrum Flavium".
  **Not fixed this shift on purpose**: flipping the fallback order is a two-line change, but it
  rewrites 545 already-indexed page titles at once and deserves a considered pass with the SEO
  side thought through (`SEO-LOG.md` should probably record the change), plus a decision on whether
  the Latin name moves into the subtitle slot or into the body — not something to land in a
  shift's last stretch. Discovered while spot-checking this shift's own new pages in the build
  output; the behavior is long-standing and site-wide, not introduced by any recent data.

- [ ] **`next/script`'s `beforeInteractive` strategy does not run before first paint in this
  Next 14 app-router setup** — worth knowing before anyone reaches for it again. Implementing the
  theme toggle's flash guard, a `<Script id="theme-init" strategy="beforeInteractive">` compiled
  into a `(self.__next_s=self.__next_s||[]).push(...)` queue entry that Next's runtime only
  processes once the app-router bundle boots. Measured directly with Playwright:
  `document.documentElement.getAttribute("data-theme")` was still `null` at `domcontentloaded`
  and only `"dark"` by `load` — i.e. exactly the flash the guard exists to prevent. A plain
  `<script dangerouslySetInnerHTML>` in `<head>` is parsed and executed inline by the browser and
  measured correct (`"dark"` at `domcontentloaded`). Same applies to any future
  before-first-paint init (a locale guess, a saved units preference used in SSR-visible chrome).
- [ ] **`swapPaletteColors()` in `Map.tsx` is a reusable pattern for any future full-map restyle**,
  not just light/dark — it walks `map.getStyle().layers` and swaps paint properties by matching
  their literal string value against an outgoing palette object, so it needs no per-layer list and
  automatically covers lazy thematic overlays added later. Its one fragile assumption is documented
  inline: two `Palette` keys sharing a color value in one palette but not the other are ambiguous
  by value alone (today only `LIGHT.land`/`LIGHT.labelHalo`, disambiguated by paint-property name).
  **If a future shift adds a palette key, check for a new same-value collision first** — a silent
  wrong-key swap would repaint the wrong layers with no error.
- [ ] **A canvas-drawn `map.addImage` icon bakes its colors into pixels and won't follow a
  `setPaintProperty` restyle** — the road-station square marker was the only one in the codebase
  and is now regenerated via `updateImage` on a theme switch (`buildRoadStationIcon`). Any future
  generated icon needs the same treatment, or it'll keep a stale halo/border color after a switch.
- [ ] **Image coverage on the Djemila/Volubilis batches: 14 of 25 shipped with no `image_url`**
  (9 of 13 Djemila, 5 of 12 Volubilis) after the research pass found no confirmable Commons
  filename. Real gap, not exhausted — the Djemila side especially, since the site is a
  well-photographed UNESCO property and a fresh search budget aimed at Commons *categories*
  (`Category:Djémila` and its subcategories) rather than individual filenames would likely close
  most of it. Same "real gap, not exhausted" shape as prior image-coverage notes.
- [ ] **The 2 remaining image-null legionary fortresses (Melitene, Nicopolis/Alexandria) have now
  survived three separate search passes** with different angles (tourism, excavation-report,
  academic). For Nicopolis, the honest finding is that the material exists but not on Commons —
  ~25 Legio II Traiana Fortis funerary stelae in Alexandria's Graeco-Roman Museum, published in
  academic PDFs with DAI photo credits, none of them Commons-hosted. A fourth pass along the same
  lines is unlikely to pay; treat these two as closed unless someone uploads to Commons.

## Shipped (moved from above; newest on top)

- 2026-08-24 — a cloud shift: Appearance / theme toggle (System / Light / Dark in the
  hamburger menu, live map + chrome repaint, no reload, persisted). Djemila (13) and
  Volubilis (12) curated landmark POIs — two more zero-coverage `sites.ts` sites closed.
  Ancient-sources batch 9 (3 POIs) and the legionary-fortress image gap down to 2 of 28.
- 2026-08-22 — a cloud shift: Entrance welcome screen (board `[10-P1-4]`) — one sentence, three
  doors (guided tour / browse nearby / just explore), dismissible, once per browser. Water
  infrastructure top-up (axis 3f, +21 features: 6 bridges, 3 dams, 3 cisterns, 1 watermill, 1
  aqueduct point, 7 aqueduct lines — 24 → 45, past the 40-floor). Aquileia and Pozzuoli curated
  buildings (`[06-P0-2]`, 12 + 9 entries, 32/40 → 34/40).
- 2026-08-21 — Shift 41: Via Popilia (24 stations, seventeenth road) + Via Praenestina/Labicana/
  Nomentana/Latina (17 stations, eighteenth-through-twenty-first roads) — `road_stations.geojson`
  382 → 423, closing out the brief's named road queue and Shift 40's Rome-radiating handoff. Two
  more `curate-buildings [06-P0-2]` sites (Leptis Magna 15 buildings, Timgad 6 buildings, including
  a real OSM-name correction at Leptis). Axis 12 image top-up (6 of 10 image-null cult centers
  closed). Axis 15's Beneventum alimenta town (23/50).
- 2026-08-21 — Shift 41: Web app manifest + maskable icon (board `[04-P2-9]`) — `app/manifest.ts`,
  favicon/apple-touch-icon via Next's `icon.tsx`/`apple-icon.tsx` convention, 192/512 maskable PWA
  icons via two `next/og` route handlers, one shared parchment-medallion mark.

- 2026-08-16 — Shift 23: Guided tours (`[10-P0-1]`) — format, player, and 3 starter tours (Via
  Appia, A Day in Ostia, What Was New in 117), built entirely from data already on the map. Also:
  camera memory (`[01-P0-2]`, a returning visitor lands where they left off), Herculaneum curated
  buildings (`[06-P0-2]`, 34 entries), ancient-sources batch 3 (`[09-P0-1]`, 3 more citations),
  and the Via Egnatia road (axis 2, 35 new `road_stations.geojson` entries, the empire's second
  complete road after Via Appia).
- 2026-08-15 — Shift 19: Onboarding hint (first-visit dismissible tooltip on the search bar, "Try Londinium or Ephesus")
- 2026-08-15 — Shift 18: Roman-style typography for place-name labels (Cinzel display serif on panel titles, list rows, and map pin labels)
- 2026-08-14 — Shift 16: Legion locator (search/browse all 28 legions, fly to fortress + open real detail panel)
- 2026-08-14 — Shift 15: Roman currency converter (sestertii/denarii/aurei ⇄ rough USD, hamburger menu)
- 2026-08-14 — Shift 14: "117 CE date pill upgrade" — click the epoch pill for a "Why 117 CE?" explainer modal
- 2026-08-14 — Shift 13: Per-category POI toggles in Layers panel + fixed the whole bottom-right FAB stack's cascading overlap (not just the one pair Shift 12 flagged)
- 2026-08-13 — Shift 12: Compass (appears on map rotation, click resets north)
- 2026-08-13 — Shift 11: Mobile bottom sheet drag-to-expand (snap between half/full height, drag-down dismisses)
- 2026-08-13 — Shift 10: Share button (selected place now encoded into the URL hash, restored on load/back-forward); fixed the `.next`/`next dev` collision that bit four prior shifts (separate `distDir`s)
- 2026-08-13 — Shift 9: Keyboard shortcuts (arrows pan, +/- zoom, / search, M ruler, L layers)
- 2026-08-12 — Shift 8: Coordinates URL sync (`#lng,lat,zoomz`, back/forward retraces map moves); fixed "Landmarks" Layers-panel toggle to actually control `PoiMarkers.tsx`
- 2026-08-12 — Shift 7: Right-click context menu (What's here? / Directions disabled / Measure distance), long-press equivalent on mobile
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
