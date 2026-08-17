# Roman Maps — the board

The prioritised work queue. Every ticket traces to a report in `research/reports/`.
**This file is the daily editorial routine's only instruction set.** Shifts may also pull from
it. Read `research/reports/15-editorial-operations.md` for why this exists.

## Claiming — read this before touching anything

Four cloud shifts work this repo around the clock, and a Mac-side editorial pass works it at
09:30. Two workers on one ticket is wasted effort and a merge conflict, so **claiming is
mandatory, and it happens before the work, not after**:

1. `git pull --rebase` — the cloud shifts push straight to `origin`, and the local clone runs
   behind by design.
2. Change the ticket's `[ ]` to `[~]` and append ` — claimed by <worker>, <YYYY-MM-DD HH:MM>`.
3. Commit **only BOARD.md** and push it immediately. That push is the claim.
4. Now do the work. `git pull --rebase` again before the final push.
5. On finish, mark `[x]`. If you ran out of time, set it back to `[ ]` with a note on what is
   already done — never leave a `[~]` behind you.

A `[~]` older than 24 hours is stale: clear it back to `[ ]` and take it if you want it.

## How to work this board

1. Take the **topmost unblocked, unclaimed ticket** whose type fits the ratio below.
2. Do it properly. A half-done ticket stays open with a note; it is never marked `[x]`.
3. Mark `[x]`, add a one-line result, commit, and update `METRICS.md`.
4. If the work reveals new work, add tickets at the right priority — don't silently expand scope.

**Ratio — every four tickets: 1 `add` · 2 `deepen` · 1 `polish`.** If the next ticket in
priority order breaks the ratio, skip to the next one that fits and note the skip.

**Types:** `add` (new places/data) · `deepen` (enrich what exists) · `polish` (UI/UX/perf) ·
`fix` (defect) · `verify` (check a claim) · `illustrate` (imagery) · `retire` (remove).

**Gate on every ticket before commit:** screenshot at 375×812 dark **and** desktop light if the
UI changed · data validator clean · any new layer defaults OFF · new card fields degrade when
absent.

**Who deploys:** nobody here. Commit and push with a clean tree; the 19:00 publisher is the only
process on the Mac permitted to build and deploy, and it ships whatever changed that day. A
Mac-side worker that runs its own production deploy is the collision the operating cycle exists
to prevent. Building locally to *test* your own work is expected and fine.

---

## P0 — do these first

- [ ] `[12-P0-1]` **`merge-themes`** `fix` — Merge the ~25 thematic point files into
      `pois.geojson` with a `theme` field; collapse their 25 bespoke layer/popup blocks in
      `Map.tsx` into one. Unlocks search, cards, nearby and every content ticket below.
      *Big — may take several passes. Split per-file if needed.*
- [ ] `[03-P0-1]` **`schema-v2`** `fix` — Extend the POI schema: `description`, `snapshot_117`,
      `tags[]`, `images[]{url,credit,author,licence,kind}`, `ancient_sources[]{author,work,ref,
      quote}`, `peak`, `rediscovered`, `status`, `verified_at`, `added_by`, `added_at`.
      Migration script over all records; old fields retained.
- [x] `[12-P0-2]` **`validator`** `fix` — `scripts/validate.mjs`, wired into `.githooks/pre-push`
      ahead of the build and exposed as `npm run validate`. Runs in ~1.5s over all 40 files.
      0 errors, 14 reviewed warnings. Calibrated so base geography isn't held to the curated
      schema — otherwise it drowns and gets bypassed, which is the same as not having it.
- [x] `[11-P0-1]` **`split-site-data`** `polish` — Done 2026-08-16 by cloud shift 3. Split the
      27MB merged `sites_buildings`/`sites_streets` into 80 per-site files under
      `public/data/sites/` (`scripts/split-site-data.mjs`, `npm run split-site-data`); `Map.tsx`
      now starts both sources empty and fetches a site's pair only when visited (Explore-panel
      jump or a moveend proximity check, so deep links/search still work). Verified with
      Playwright: 0 requests to `/data/sites/*` on cold load, correct fetch + render on visit.
- [ ] `[12-FIX-3]` **`duplicate-pantheon`** `retire` — `poi_pantheon` and `poi_pantheon_rome` are
      the same building, eight metres apart, and until 2026-08-16 they said opposite things:
      one had the site as a Trajanic construction site with `extant_117ce: false`, the other
      claimed Agrippa's temple was still standing — which is wrong, it burned in 80 CE. The
      contradiction is fixed and both records now read correctly, but two pins for one Pantheon
      remain. Retire `poi_pantheon_rome` (the shallower record) and keep `poi_pantheon`.
      **Not a silent delete:** `/place/pantheon_rome` is a generated page, so this needs a
      redirect or a decision to accept the 404, which is why it was left rather than done in
      passing. Worth checking the other 73 cross-file collisions the validator reports for the
      same both-records-disagree shape while in here.
- [ ] `[08-P1-6]` **`baalbek-dating`** `verify` — Both Baalbek temples carry `built: 60` in
      `pois.geojson`, and the Temple of Bacchus is conventionally dated a good deal later — mid
      2nd century, under Antoninus Pius. If that is right, the building is barely begun at the
      117 CE snapshot rather than nearly finished. The description written on 2026-08-16 was
      deliberately phrased to hold under either dating ("the shell is well advanced and the
      carvers are still at work") rather than silently reverse another worker's `built` value.
      Settle the date, then set `built` and the text to match.
- [ ] `[11-P0-3]` **`delete-dead-data`** `retire` — Delete `roads_high`, `roads_low`,
      `places_high` (~11MB shipped, never loaded) or wire them into a detail ladder.
- [~] `[01-P0-1]` **`selected-marker`** `polish` — Selected POI gets an enlarged ringed marker;
      camera offsets by the sheet height so the pin stays visible. — claimed by cloud shift 24,
      2026-08-17 00:00
- [x] `[01-P0-2]` **`camera-memory`** `polish` — Done 2026-08-16 by cloud shift 4. A returning
      visitor now lands where they left off instead of always resetting to the empire-wide
      opening view. `Map.tsx`'s existing `#lng,lat,zoomz` hash sync only covered shared links and
      in-session back/forward, not a plain reload/new tab — added a localStorage fallback
      (`loadCamera`/`saveCamera`, try/catch-wrapped for private-browsing) that piggybacks on the
      already-debounced moveend hash writer, no new listener. A real hash still wins, and the
      cinematic opening flyTo is skipped for a restored camera the same way it already was for a
      hash link. Verified with Playwright: fresh context still gets the unchanged default Rome
      view; pan+zoom, strip the hash, reload → lands back at the panned position.
- [ ] `[03-P0-2]` **`card-rebuild`** `polish` — Rebuild the place card to the eleven-block
      order; every block hides when empty.
- [x] `[03-FIX-1]` **`notes-truncation`** `fix` — Done 2026-08-16 by cloud shift 2. Audited every
      `notes`/`one_line` field across `public/data/*.geojson` for the shift-scholar voice the
      280-char/2-sentence cut was hiding; found and rewrote 24 fields in `pois.geojson` into
      plain Google-Business voice (same facts and 117 CE judgment calls, no "per the brief" /
      "kept per the guardrail" / scholar-name-drop apparatus). Deleted the hard truncation in
      `PlaceDetails.tsx`'s `cleanNotes()`; the regex voice-cleanup stays as a safety net. Verified
      in a real browser (Playwright + Chromium) at 1280×800 light and 375×812 dark.
- [x] `[12-FIX-1]` **`stringified-props-audit`** `fix` — Maplibre flattens array and object
      feature properties to JSON strings on a click query, but the same records arrive as real
      arrays via a deep link or the legion locator. `PlaceDetails.tsx` handled only the array
      case, so the Sources block silently rendered nothing on the normal map-click path. Fixed
      there with an `asArray()` helper. **Audit completed 2026-08-16 by cloud shift 2**: grepped
      every `e.features`/`queryRenderedFeatures` call site (`Map.tsx` only) and every place any
      component reads a `sources`/`ancient_sources` property (`PlaceDetails.tsx`,
      `PeopleMarkers.tsx`). `Map.tsx`'s ~25 thematic-layer hover popups never render an array
      field — only strings (`name`, `notes`, `regions`, `category`) — so the bug shape can't
      occur there. `PeopleMarkers.tsx`'s `Array.isArray(props.sources)` check is correct as
      written: it builds markers from a direct `fetch()` of the geojson, never from a Maplibre
      click query, so `props.sources` is always a real array on that path, never stringified.
      No other live instance found — closing rather than leaving open on a hypothetical.
- [x] `[12-FIX-2]` **`brigetio-stacked-pins`** `fix` — Done 2026-08-16 by cloud shift 3. Brigetio
      itself was already fixed by cloud shift 2's audit note (confirmed distinct coordinates).
      Ran a fresh exact-coordinate scan across every `public/data/*.geojson` Point feature and
      found the same fixed-size-DOM-marker occlusion bug in `people_117.geojson`
      (`PeopleMarkers.tsx`, no clustering): 6 stacked clusters, 11 markers, spread ~0.012° around
      each cluster's first marker. Other collisions found (crafts/diplomacy/letters render as
      MapLibre circle layers — milder "one popup wins" issue, not full occlusion; gazetteer
      duplicates in places_high/medium pending `[12-P0-1]`'s theme merge) left alone — see the
      commit for the full accounting. `poi_fortress_i_adiutrix_brigetio` and
      for other exact-coordinate stacks while in there.
- [ ] `[04-P0-1]` **`sheet-detents`** `polish` — Three-detent bottom sheet (peek/half/full),
      velocity-aware.
- [ ] `[13-P0-2]` **`image-audit`** `illustrate` — Audit all 303 existing images; flag and
      replace any modern photograph showing modern infrastructure. Cotinae is the test case.
- [ ] `[05-P0-1]` **`places-in-view-list`** `polish` — Accessible, keyboard-navigable list of
      places in the current viewport; doubles as the browse UI.
- [x] `[10-P0-1]` **`tours`** `add` — Done 2026-08-16 by cloud shift 4. New `app/tours.ts`
      (54 stops), `app/useTour.ts` (shared panel state), `app/TourPlayer.tsx` (left-rail slide-in
      on desktop, compact card on mobile). Three tours, every stop built from data already on the
      map (pois.geojson, road_stations.geojson, events_117.geojson, people_117.geojson) rather
      than new research: Via Appia (31 stops, Rome to Brundisium), A Day in Ostia (13 stops),
      What Was New in 117 (12 stops, closing on Trajan's death and Hadrian's acclamation the same
      day). Dashed route line + numbered markers draw on the map while a tour is active. Found and
      fixed a real overlap bug before shipping — the tour panel and Place details panel share the
      same left-side screen slot, so opening a stop's full card was rendering invisibly behind the
      tour panel; added a minimize/resume mechanism. Verified with Playwright at 1280×800 light
      and 375×812 dark, all three stop kinds, full 31-stop Via Appia run.
- [x] `[14-P0-2]` **`place-pages`** `add` — Done 2026-08-16 by cloud shift 3. New
      `app/place/[slug]/page.tsx`, statically generated for all 467 `pois.geojson` records
      (`/site/[slug]`'s pattern extended — hero image + About/What-happened-here/In-ancient-
      writing/Sources blocks, JSON-LD `Place` schema, full OG/Twitter metadata, a button back
      into the interactive map that reopens the same panel). `sitemap.ts` now lists all 467
      alongside the 40 site pages; the 16k-point raw gazetteer stays out of scope. Verified:
      `next build` generates all 513 routes cleanly (~18s); Playwright at desktop + 375×812 for
      an image-bearing page and a no-image fallback page; the map round-trip link confirmed
      landing on the right panel.
- [ ] `[02-P0-1]` **`terrain`** `polish` — Hillshade/relief under the land fill.
- [ ] `[02-P0-4]` **`self-host-glyphs`** `fix` — Stop depending on `demotiles.maplibre.org`;
      a single point of failure that would erase every label on the map.
- [~] `[09-P0-1]` **`ancient-sources`** `deepen` — `ancient_sources[]` populated for every
      `confidence: high` POI. **Standing task — never "done", always available.** — batch 4
      claimed by cloud shift 24, 2026-08-17 00:00
      *Batch 1 done 2026-08-16: 108 of 221 high-confidence POIs (48.9%), 122 citations, plus an
      "In ancient writing" block on the card. Shape is `{author, work, ref, note}` — `note` says
      what the passage contains, in place of a quotation nobody here can check against a text.
      Literary sources only; inscriptions belong to `[09-P1-4]`.*
      *Batch 2 done 2026-08-16 by cloud shift 3: 37 more citations across the remaining 122
      high-confidence POIs (145/221, 65.6%), via four parallel WebSearch-only research passes by
      theme, personally reviewed and two spot-verified before merge. Hit rate ran from 2/31
      (tombs) to 22/55 (forts and industrial — much higher than expected, since Ptolemy's
      Geography names most legionary fortresses directly). One candidate dropped on review: a
      citation whose own passage was actually about a neighboring POI's temple, not the site it
      was offered for. 85 high-confidence POIs remain open — mostly tombs, villas, and
      single-purpose industrial sites with no text naming them directly; expect a continued low
      hit rate there and skip rather than stretch.*
      *Batch 3 done 2026-08-16 by cloud shift 4: 3 more citations (148/230, 64.3% — the pool grew
      to 230 as other shifts added POIs). Confirmed the board's own prediction — this remaining
      85-POI pool is almost entirely tombs (0/29), villas/shipwrecks (0/12), and industrial sites
      with a real but thin yield (2/21: Ptolemy on Caetobrix/Troia and on Dacian Salinae/Ocna
      Mures) plus one civic hit (1/23: Salvian on Carthage's circus in its final Vandal-siege
      days). One candidate dropped again for the same wrong-POI-mismatch shape batch 2 caught —
      a Macrobius passage about Baalbek's temple oracle offered for the neighboring quarry POI.
      82 remain open; expect a continued low hit rate.*
- [~] `[06-P0-2]` **`curate-buildings`** `deepen` — Ostia-depth curated descriptions for the
      other 39 sites, ~10 buildings/day. **Standing task, never "done".** — next site claimed by
      cloud shift 24, 2026-08-17 00:00
      *Pompeii done 2026-08-16 by cloud shift 3: 28 buildings in `app/pompeiiDescriptions.ts`
      (House of the Faun, Temple of Apollo, the Forum and its temples, the three bath complexes,
      the Brothel, named houses on Via dell'Abbondanza and elsewhere), same pattern as
      `ostiaDescriptions.ts`. 2 of 30 researched buildings dropped on review for confidence/
      conflation reasons — see commit for specifics.*
      *Herculaneum done 2026-08-16 by cloud shift 4: 34 buildings in
      `app/herculaneumDescriptions.ts` — the Villa of the Papyri, the Great Palaestra, the Boat
      Pavilion, the College of the Augustales, three bath complexes, and named houses. One
      candidate ("Sacello") dropped as a duplicate of the Augustales hall already covered under
      its own name. One suspiciously exact claim (a 2026 reopening date) spot-verified against
      the Parco Archeologico di Ercolano's own site and independent press before merging — real,
      9 July 2026. 38 sites still open for the standing task.*
      **Real bug found and fixed in the same pass, site-wide, not Pompeii-only**: several sites'
      Overpass fetches mix each park's own boundary polygon and (Ostia, Pompeii) "Regio"-numbered
      district outlines into the *same* source as individual named buildings. Whichever renders
      later in the source's feature array draws on top and permanently swallows clicks meant for
      the specific building underneath — confirmed this was silently breaking the curated-Pompeii
      content before the fix (every click returned the generic "detailed archaeology in progress"
      fallback). Fixed at the render layer, not the data: the building-fill click handler now
      ranks every feature under the click point by polygon area and picks the smallest, which is
      reliably the actual building meant — future-proof against new Overpass pulls. Verified with
      Playwright against both Pompeii's new content and three known-good Ostia buildings (no
      regression). 39 sites still open for the standing task.
- [ ] `[10-P0-3]` **`flagship-depth`** `deepen` — Bring POIs whose `notes` runs under 60 words up
      to real panel depth in that same field, worst-first. This is the **panel tier of
      `[10-P0-2]`** applied to the places that need it most; the tombstone/label tiers still need
      that ticket's schema and UI work. Renders through the card's existing "About" block, so it
      needs no UI change and no visual gate — which makes it the one `deepen` the unattended Mac
      pass can fully ship while `[15-P0-1]` stands. **Standing until the thin count reaches zero;
      `npm run metrics` prints the queue.**
      *Batch 1 done 2026-08-16 by the mac editorial pass: 35 fields rewritten, depth 76.4% →
      82.7%, thin tail 110 → 81. The tail was led by the most famous places on the map — the
      Parthenon at 33 words, the Pantheon at 32, Karnak, Baalbek, the Roman Forum, the Colosseum,
      Maison Carrée, Trajan's Markets — which is the "feels empty" complaint in its purest form.
      Nine of the 35 were not thin but were shipping authoring scaffolding to readers: notes
      opening "COMPLICATED CASE", "CORRECTION TO INITIAL BRIEF", "CAVEAT", "per project
      guardrails", one naming the `extant_117ce` field outright, and the Temple of Isis at Pompeii
      arguing with itself and trailing off in "... wait: Pompeii is buried by 117". Research
      preserved, voice replaced. What remains in the tail is frontier forts at 44–59 words, not
      monuments anyone came looking for — a lower-value but still real batch 2.*
- [ ] `[15-P0-1]` **`unattended-screenshot-gate`** `fix` — ⚠️ **This blocks the daily pass from
      taking any UI ticket at all.** The gate below requires a screenshot at 375×812 dark and at
      desktop light, but the 09:30 editorial pass runs unattended and a dev server cannot be
      started from an unattended session — nobody is there to approve it. Local `file://` pages
      render only as static snapshots the browser tools can't screenshot either. So every
      `polish` ticket on this board is unreachable by the routine that is supposed to keep the
      ratio, which is how the ratio quietly becomes "content only". Fix by giving the routine a
      way to render the chrome without a dev server — a static harness page built from the real
      components and the real theme tokens, checked in and rendered at build time — or by
      granting the scheduled task a pre-approved server. Until then the daily pass must say in
      its diary line that it skipped the visual gate, and must not ship UI blind.
- [ ] `[14-P0-1]` **`gsc-verify`** `fix` — ⚠️ **BLOCKED ON PEDRO.** Verify `romanmaps.org` in
      Google Search Console. Nothing about this property is measured until this is done. Check
      which Google account holds the token first.

## P1

- [ ] `[07-P1-1]` **`travel-time`** `add` — ORBIS-style journey calculator over the existing
      road + sea network. Highest-impact single feature in the backlog.
- [x] `[07-P0-2]` **`category-life-writing`** `deepen` — Done 2026-08-16. All POI
      categories written (the report estimated ~20), 116–130 words each, present tense, in
      `app/categoryLife.ts`; renders as "What happened here" on every card. Covered 448/448 POIs
      at ship time; cloud shift 2 added 2 more categories (`ludus`, `sarcophagus_workshop`) the
      same day and kept coverage at 100% — standing task, re-check the count on future adds.
- [ ] `[03-P1-4]` **`nearby-related`** `polish` — Six related-place cards on every card and page.
- [ ] `[02-P0-2]` **`coastline`** `polish` — Coastline stroke over the sea mask.
- [ ] `[02-P0-3]` **`road-weights`** `polish` — Raise road weights/opacity at low zoom; add
      casings to main roads.
- [ ] `[02-FIX]` **`halo-colors`** `fix` — ~12 layers in `Map.tsx` hardcode `#f4ead5` (the
      *light* land colour) as halo/stroke regardless of theme. Replace with `P.labelHalo`.
- [ ] `[08-P0-1]` **`palaeo-coasts`** `fix` — Ancient coastline patches for Ostia/Portus,
      Ravenna, Ephesus, Miletus, Priene, Rhine–Meuse, the Fens, Romney Marsh, Maeander,
      Scamander, Lake Fucinus, Lake Copais.
- [ ] `[08-P0-3]` **`province-provenance`** `verify` — Date-stamp and flag province boundaries;
      explicit treatment for Armenia/Mesopotamia/Assyria (held 114–117 only).
- [ ] `[10-P0-2]` **`three-depth-labels`** `deepen` — Tombstone (10w) / label (50w) / panel
      (250–400w) for every place.
- [ ] `[13-P1-4]` **`engravings`** `illustrate` — Period engravings (Piranesi, Gell, Wood,
      Cassas, Rossini) for the 40 sites and top 100 POIs. **Standing task.**
- [ ] `[06-P0-1]` **`phase-banners`** `fix` — Per-site phase banner; honest handling of sites
      destroyed before 117 (Pompeii, Herculaneum).
- [ ] `[04-P0-2]` **`long-press`** `polish` — Explicit touch-hold timer → "What's here?" card.
- [ ] `[11-P1-5]` **`pmtiles`** `polish` — tippecanoe → PMTiles for roads/places/provinces/land.
- [ ] `[11-P1-6]` **`split-map-tsx`** `fix` — Break the 2,112-line `Map.tsx` into a layer
      registry so adding an overlay is a new file, not a monolith diff.
- [ ] `[10-P1-3]` **`thematic-rooms`** `polish` — Six curated rooms (Power · Movement · Money ·
      Belief · Knowledge · Danger) replacing the flat overlay checkbox list.
- [ ] `[06-P1-3]` **`building-typology`** `deepen` — Extend to the ~35-term standard vocabulary,
      grouped into six colour families.
- [ ] `[06-P1-4]` **`excavation-history`** `deepen` — `excavation[]` on all 40 sites.
- [ ] `[09-P1-4]` **`epigraphy`** `deepen` — 1–3 inscriptions per site from EDCS/EDH with text,
      translation and reference. **Standing task.**
- [ ] `[09-P1-5]` **`clear-unverified`** `verify` — Re-check the citations SHIFT_LOG recorded as
      unverified (Atrium Vestae, Domus Flavia, Bibliotheca Ulpia, Baths of Nero, Ara Pacis).
- [ ] `[08-P1-4]` **`gazetteer-audit`** `fix` — Londinium is missing from `places_medium`. Audit
      against Pleiades and find the rest of the hole.
- [x] `[14-P1-4]` **`province-pages`** `add` — Done 2026-08-17 by cloud shift 24. New
      `app/provinces.ts` (43 provinces — Italy's eleven Augustan regiones fold into one Italia
      entry, not a separate province each; a few short-lived/contested units fold into their
      nearest real province rather than shipping an empty page) with 117 CE administrative
      status, capital, and a sourced blurb per entry. New `app/province/[slug]/page.tsx` lists
      every `sites.ts` city and `pois.geojson` record whose `province` field normalizes to that
      province — the underlying data uses ~15 different spellings for the same provinces
      (Achaea/Achaia, Judaea/Iudaea, Baetica/Hispania Baetica), absorbed by an alias table rather
      than touching the records. Wired into `sitemap.ts`. 6 of 43 pages have no mapped content
      yet and degrade to an honest empty state — see ticket note in the Done log below.
- [ ] `[05-P0-2]` **`focus-ring`** `polish` — Global `:focus-visible`.
- [ ] `[05-P0-3]` **`reduced-motion`** `polish` — Honour `prefers-reduced-motion`.
- [ ] `[13-P0-3]` **`image-fallback`** `illustrate` — Static map thumbnail for the 145 places
      with no image.
- [ ] `[11-P0-2]` **`lazy-overlays`** `polish` — Fetch a thematic layer's data on first enable.
- [ ] `[01-P0-3]` **`cluster-expand`** `polish` — Tapping a cluster badge fits to its members.
- [ ] `[01-P0-4]` **`search-selects`** `polish` — Search result drops a pin and opens its card.

## P2

- [ ] `[07-P1-3]` **`prices`** `deepen` — Prices and wages; extend the currency converter.
- [ ] `[07-P1-4]` **`governors`** `add` — Governor of every province in 117 CE (~45 names).
- [ ] `[07-P1-5]` **`ordinary-people`** `add` — 30–50 named non-elite people, pinned.
- [ ] `[06-P1-5]` **`finds`** `illustrate` — 3–8 artefacts per site with images and museum.
- [ ] `[10-P1-4]` **`entrance`** `polish` — One sentence, three doors, dismissible.
- [ ] `[03-P2-8]` **`compare-today`** `polish` — Satellite/modern toggle for the viewport.
- [ ] `[13-P2-8]` **`og-images`** `illustrate` — Generated per-place OG images;
      `summary_large_image`.
- [ ] `[05-P2-6]` **`i18n`** `polish` — `strings.ts` scaffold; English + Italian.
- [ ] `[04-P2-9]` **`manifest`** `polish` — Web manifest + maskable icon.
- [ ] `[14-P2-8]` **`hub-pages`** `add` — Four or five explainer hubs.
- [ ] `[09-P2-8]` **`how-we-know`** `add` — Public methodology page.
- [ ] `[02-P1-6]` **`sea-labels`** `add` — `seas.geojson`, ~30 water names, italic letterspaced.
- [ ] `[12-P1-4]` **`fuzzy-dates`** `fix` — `{earliest, latest, display}` date objects.
- [ ] `[11-P2-10]` **`next-upgrade`** `fix` — `next@14.2.5` advisory flagged in shift 1 and never
      actioned. Deliberate upgrade with a smoke test.
- [ ] `[06-P2-6]` **`priority-cities`** `add` — Alexandria, Carthage, Antioch, Londinium,
      Lugdunum, Tarraco, Pergamon, Caesarea Maritima before further Italian secondary towns.
- [ ] `[08-P2-7]` **`ancient-lakes`** `add` — Fucinus, Copais, Karla and the rest.
- [x] `[15-P1-4]` **`metrics`** `polish` — Done 2026-08-16 by the mac editorial pass.
      `scripts/metrics.mjs` + `npm run metrics` (`--write` rewrites `METRICS.md`, `--json` for a
      future dashboard). Measures depth, imagery, ancient-source and per-site curation coverage
      off `public/data/` and `app/`, and shells out to `scripts/validate.mjs` rather than
      reimplementing "clean". Re-running on the same day replaces that day's section and history
      row; a new day inserts above the previous one. The point of writing it: the hand-kept table
      already read 448 POIs against 467 in the file, because the data grew while it was being
      tallied. It also prints the thinnest fifteen descriptions, which is the work queue behind
      the depth number and is what `[10-P0-3]` was opened from. Cold-load LCP deliberately left
      unmeasured rather than faked — it needs a dev server, blocked by `[15-P0-1]`.

---

## Done

*(Routine appends here: date · ticket · one-line result.)*

- 2026-08-15 · `[pre-board]` · Layer defaults cut from 29-on to base-5; chrome theme tokens;
  phone layout rebuilt to the Maps shape. Invariant 0 added to the shift brief.
- 2026-08-16 · `[12-P0-2]` validator · `scripts/validate.mjs` + pre-push hook + `npm run
  validate`. 0 errors, 14 reviewed warnings. Dropped 212 empty `image_url`/`image_credit`/
  `image_alt` keys across four files so the report reads clean.
- 2026-08-16 · `[09-P0-1]` ancient-sources · Batch 1: 122 citations on 108 high-confidence POIs
  (48.9% of the target set), plus the "In ancient writing" card block. Standing ticket reopened.
- 2026-08-16 · `[07-P0-2]` category-life-writing · All 50 categories, 116–130 words each,
  covering 448/448 POIs, rendering as "What happened here".
- 2026-08-16 · `[03-FIX-1]` notes-truncation · cloud shift 2. Deleted the 280-char/2-sentence
  hard cut in `PlaceDetails.tsx`; audited and rewrote the 24 `pois.geojson` fields the cut was
  hiding shift-scholar voice inside. Verified in a real browser, both themes, both viewports.
- 2026-08-16 · `[12-FIX-1]` stringified-props-audit (closing the reopened half) · cloud shift 2.
  Audited every `e.features`/`queryRenderedFeatures` call site and every `sources`-reading
  component; no other live instance of the bug shape found. Closed rather than left open.
- 2026-08-16 · SHIFT_BRIEF axes 9b/9d/9e/5c (no board ticket ID — brief axis work, board had
  nothing unclaimed that fit) · cloud shift 2. 19 new `pois.geojson` POIs (gladiator schools,
  circuses, amphitheatres, sarcophagus workshops) plus three new thematic files — cuisine
  regions (7), death ritual regions (5), ethnic & cultural pockets (15, first content on axis
  5c) — all wired into `useLayers.ts`/`Map.tsx`, defaulting OFF. Also fixed 3 same-category
  exact-coordinate marker stacks (Brigetio, Tapae, Bedriacum) found while auditing for the
  merge-themes backlog.
- 2026-08-16 · `[11-P0-1]` split-site-data · cloud shift 3. Split the 27MB merged
  `sites_buildings`/`sites_streets` into 80 per-site files under `public/data/sites/`
  (`scripts/split-site-data.mjs`); `Map.tsx` now fetches a site's pair only when visited instead
  of all 40 on every cold load. Verified with Playwright: 0 `/data/sites/*` requests on cold
  load, correct fetch + render on Explore-panel visit and on a direct deep link.
- 2026-08-16 · `[12-FIX-2]` brigetio-stacked-pins · cloud shift 3. Brigetio itself was already
  fixed by shift 2's audit; found and fixed the same fixed-DOM-marker occlusion bug in
  `people_117.geojson` (6 clusters, 11 markers offset).
- 2026-08-16 · `[09-P0-1]` ancient-sources · Batch 2: 37 more citations, 145/221 high-confidence
  POIs now covered (65.6%). See ticket note above for the per-theme hit-rate breakdown.
- 2026-08-16 · `[14-P0-2]` place-pages · cloud shift 3. `/place/[slug]` for all 467
  `pois.geojson` records, `/site/[slug]`'s pattern extended (hero/fallback, About/What-happened/
  In-ancient-writing/Sources, JSON-LD, OG/Twitter, map round-trip link). `sitemap.ts` now lists
  507 URLs. `[10-P0-1]` tours was skipped this run — see that ticket's own note for why.
- 2026-08-16 · `[06-P0-2]` curate-buildings (Pompeii) · cloud shift 3. 28 buildings in
  `app/pompeiiDescriptions.ts`. Found and fixed a site-wide click-priority bug in the same pass
  (oversized boundary/district polygons were swallowing clicks meant for the building underneath)
  — see ticket note above.
- 2026-08-16 · `[10-P0-1]` tours · cloud shift 4. Guided-tour format + player + first three tours
  (Via Appia, A Day in Ostia, What Was New in 117), 54 stops total, every one built from data
  already on the map. See ticket note above for the panel-overlap bug found and fixed in the
  same pass.
- 2026-08-16 · `[09-P0-1]` ancient-sources · Batch 3: 3 more citations, 148/230 high-confidence
  POIs now covered (64.3%). See ticket note above for the per-theme breakdown.
- 2026-08-16 · `[06-P0-2]` curate-buildings (Herculaneum) · cloud shift 4. 34 buildings in
  `app/herculaneumDescriptions.ts`. See ticket note above.
- 2026-08-16 · `[01-P0-2]` camera-memory · cloud shift 4. localStorage fallback for the camera
  position when no URL hash is present, so a returning visitor lands where they left off instead
  of always resetting to the empire-wide opening view. See ticket note above.
- 2026-08-16 · SHIFT_BRIEF axis 2 (no board ticket ID — brief axis work, board had no unclaimed
  road-stations ticket) · cloud shift 4. Via Egnatia, the empire's second complete road after
  Via Appia: 35 new stations in `road_stations.geojson` (26 → 61), Dyrrachium to Byzantium via
  the Antonine Itinerary. 8 of 35 shipped `identified: false` where the Itinerary names a station
  with no securely excavated modern location. Reused the already-shipped road-stations layer, no
  UI changes. Verified with Playwright (layer toggle + queryRenderedFeatures).
- 2026-08-16 · `[15-P1-4]` metrics · mac editorial pass. `scripts/metrics.mjs` + `npm run
  metrics`; the hand-kept table had already drifted 19 POIs behind the data it described.
- 2026-08-16 · `[10-P0-3]` flagship-depth · mac editorial pass. Batch 1: 35 `notes` rewritten,
  depth 76.4% → 82.7%, thin tail 110 → 81. The thin tail turned out to be the Parthenon, the
  Pantheon, the Colosseum, Karnak, Baalbek and the Roman Forum; nine of the 35 were also shipping
  authoring scaffolding ("COMPLICATED CASE", "CORRECTION TO INITIAL BRIEF", "... wait: Pompeii is
  buried by 117") straight to readers. Ticket opened this run and stays standing.

**Ratio state after this run:** cloud shift 3 shipped 1 `polish` (`[11-P0-1]` split-site-data),
2 `deepen` (`[09-P0-1]` ancient-sources batch 2, `[06-P0-2]` curate-buildings/Pompeii), and 1
`add` (`[14-P0-2]` place-pages) — a complete 1:2:1 cycle in one run — plus one off-ratio `fix`
(`[12-FIX-2]`, found while auditing for the polish ticket) and a second, unplanned `fix` (the
click-priority bug, found while verifying the second deepen ticket). Cloud shift 4 opened a fresh
cycle with `[10-P0-1]` tours (`add`), followed it with 2 `deepen` (`[09-P0-1]` ancient-sources
batch 3, `[06-P0-2]` curate-buildings/Herculaneum), and closed it with 1 `polish`
(`[01-P0-2]` camera-memory) — a second complete 1:2:1 cycle.

The 2026-08-16 mac editorial pass then ran 1 `polish` (`[15-P1-4]` metrics) and 1 `deepen`
(`[10-P0-3]` flagship-depth). **A collision worth recording, because it will recur:** it claimed
the polish at 09:34, when shift 4's open cycle was `add` + 2 `deepen` and owed exactly one
polish. Shift 4 closed that slot itself with camera-memory in the meantime, so the cycle took two
polishes and the local clone only learned about it on the rebase at the end of the run. Claiming
prevented the duplicated *work*, which is what it is for; it does not synchronise the *ratio*.
Treat the ratio as an estate-wide average across runs, not a contract any single run can hold.

**So the open cycle owes 1 `add` and 1 `deepen`, and the next run should start with the `add`.**
At the time this run ends the topmost unclaimed `add` is `[14-P1-4]` province-pages (P1) unless a
P0 `add` opens up first — check the board fresh, don't assume this note is still current by the
time you read it.

**One standing constraint the mac pass re-confirmed 2026-08-16**, in case it reads as stale: it
tried `preview_start` on the checked-in `.claude/launch.json` before choosing tickets, and got a
hard refusal — dev servers cannot be started from an unattended session, full stop. `[15-P0-1]`
is real and current, and it is why that run took a non-visual `polish` (a script, no chrome) and
a `deepen` that renders through a card block that already exists. That pairing is the shape of a
mac-pass run until `[15-P0-1]` is fixed.

**Note on `[15-P0-1]` for future runs:** the visual gate is only unreachable from the *Mac-side
unattended editorial routine*, which has no way to launch a dev server or a browser. A cloud
shift has full Bash access and this environment ships a pre-installed Chromium
(`/opt/pw-browsers`) — `npm run dev` + a small Playwright script (install `playwright` into a
scratch dir outside the repo, point `executablePath` at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`) is enough to screenshot at 375×812 dark
and desktop light. Cloud shifts should treat `polish` tickets as fully available, not blocked —
this run cleared one that way. `[15-P0-1]` itself stays open; it's specifically about giving the
*unattended* routine a static harness, which is a different problem.

**`[06-P0-2]` curate-buildings, previously skipped for a visual-gate concern that no longer
applies, cleared 2026-08-16 by cloud shift 3** — see the ticket's own note above. Since
`[11-P0-1]`'s per-site split, the 21MB combined file this was skipped over no longer exists;
`public/data/sites/pompeii_buildings.geojson` alone was small enough to key entries against
directly.
