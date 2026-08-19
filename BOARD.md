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
- [x] `[12-FIX-3]` **`duplicate-pantheon`** `retire` — Done 2026-08-18 by cloud shift 29.
      `poi_pantheon` and `poi_pantheon_rome` were the same building, eight metres apart, and until
      2026-08-16 they said opposite things (fixed then, but the duplicate pin itself remained).
      Merged `poi_pantheon_rome`'s one distinct citation (Cassius Dio 53.27.2, on Agrippa's
      original naming) into `poi_pantheon`, then removed the record entirely — `pois.geojson`
      470 → 469. `/place/pantheon_rome` was a generated, plausibly-indexed page, so a permanent
      redirect to `/place/pantheon` was added in `next.config.js` rather than letting it 404
      silently. **Not attempted**: auditing the other 73 cross-file collisions for the same
      both-records-disagree shape — the ticket's own "worth checking while in here" note, left
      for a dedicated pass since it's a materially bigger scope than this one pair.
- [x] `[08-P1-6]` **`baalbek-dating`** `verify` — Done 2026-08-19 by cloud shift 32. Settled:
      the Temple of Jupiter's `built: 60` holds (a stonemason's graffito on a column drum is
      dated 2 August 60 CE — Livius.org, matches the repo's existing "columns finished, forecourt
      still building in 117" note), but the Temple of Bacchus was never a real match for the same
      date — its "baroque" decorative style and every serious source (Livius.org, Britannica,
      Structurae) place its start under Antoninus Pius, c. 150 CE, 33 years past this map's
      snapshot. `built` corrected 60 → 150, `extant_117ce` flipped true → false, and the note
      rewritten to say plainly that the temple doesn't exist yet in 117 rather than hedge between
      two datings the way the 2026-08-16 placeholder text did. Also swapped the record's one
      `sources` entry — a bare `commons.wikimedia.org/` link, which is an image host, not a
      dating source — for the two citations that actually settled the question. `npm run
      validate` clean.
- [x] `[11-P0-3]` **`delete-dead-data`** `retire` — Done 2026-08-19 by cloud shift 32. Grepped
      `app/`, `scripts/`, `next.config.js`, and `package.json` for all three filenames first —
      zero references anywhere except `scripts/metrics.mjs`'s `NOT_THEMATIC` exclusion set, which
      only lists filenames to skip and never reads their content, so removing them there is
      cosmetic cleanup, not a behavior change. Deleted `roads_high.geojson`, `roads_low.geojson`,
      `places_high.geojson` (~11.2MB) and the three matching `NOT_THEMATIC` entries. **Verified
      live**: `next dev` + Playwright before and after the delete both report the same 32
      MapLibre layers rendering, confirming the files were exactly as dead as they looked.
      `npm run validate` clean — and lost the one `roads_low.geojson: feature #2220 — geometry
      has no coordinates` warning for free, since that record no longer exists to warn about.
- [x] `[01-P0-1]` **`selected-marker`** `polish` — Done 2026-08-17 by cloud shift 24. Selected
      pin renders ~1.35x scale with a white+category-color ring (`PoiMarkers.tsx`); the camera
      now eases with `padding` on selection so the pin lands clear of the panel (desktop) or
      sheet (mobile), reset on deselect (`Map.tsx`). Found and fixed a real bug in the same pass:
      naively adding `selectedId` to `PoiMarkers`' data-fetch effect's dependency array made its
      one-time "await the map's `load` event" guard re-run on every reselection — `load` only
      ever fires once per map instance, so every reselection after the first hung forever and
      silently stranded every marker at zero. Fixed with a second, lightweight effect that just
      re-invokes the already-built render closure on selection change, leaving the fetch/load-
      wait/zoomend-registration effect's dependencies untouched. Verified with Playwright at
      1280×800 light and 375×812 dark: marker count holds through select/reselect, exactly one
      marker carries the selected class, panel/sheet no longer covers the open pin.
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
- [x] `[04-P0-1]` **`sheet-detents`** `polish` — Done 2026-08-17 by cloud shift 27. Extended
      `PlaceDetails.tsx`'s mobile bottom sheet from two snap points (half/full) to three
      (peek/half/full), matching Google Maps mobile. A fast flick advances or retreats one
      detent regardless of drag distance, via an exponentially-smoothed release velocity; a slow
      release snaps to the nearest detent by position; dragging well below peek dismisses.
      **Found and fixed a real, independent bug while building the Playwright verification
      harness**: when a POI's `image_url` fails to load, the old `onError` handler only hid the
      `<img>` — the surrounding `position:relative` wrapper collapsed to zero height, and its
      `position:absolute; bottom:0` credit-caption div slid up to sit exactly where the drag
      handle renders, silently eating every pointer event aimed at it. The sheet was fully
      undraggable any time an image failed — contradicting this project's own "broken URLs
      degrade gracefully" rule (`SHIFT_BRIEF.md` §1.6), which the code never actually delivered
      on a real image error. Now tracked in an `imageFailed` state so a broken image renders the
      identical fallback gradient rail "no `image_url`" already gets. Verified with a Playwright
      state-machine test driving real synthetic mouse gestures against the built production
      bundle (not dev mode): slow small drag → nearest-snap to half; fast flick up → half→full;
      fast flick down ×2 → full→half→peek; fast flick down from peek → dismissed. Screenshotted
      at 375×812 in both light and dark, plus desktop light (unaffected — sheet is mobile-only).
- [ ] `[13-P0-2]` **`image-audit`** `illustrate` — Audit all 303 existing images; flag and
      replace any modern photograph showing modern infrastructure. Cotinae is the test case.
- [x] `[05-P0-1]` **`places-in-view-list`** `polish` — Done 2026-08-18 by cloud shift 28. New
      `PlacesInViewList.tsx`: an accessible, keyboard-navigable listbox of every curated POI and
      site inside the current viewport, sorted by distance from the map center, live-updated on
      `moveend`. Full listbox semantics (`role="listbox"`/`"option"`, `aria-activedescendant`,
      arrow/Home/End/Enter/Escape), click-through opens the same real card a map click does.
      Desktop gets its own FAB in the bottom-right stack (`bottom:361`, the next open slot); the
      panel sizes its own `maxHeight` against that FAB's position with `calc()` so it can't run
      off the top of a short window — caught this in the first screenshot pass, where a flat
      `60vh` cap clipped the panel header off-screen at 1280×800. Mobile gets no new FAB —
      reached from the hamburger menu instead, since the phone's corner is already at its
      five-control budget per invariant 0. Verified with Playwright: keyboard nav moves
      `aria-activedescendant` correctly and Enter opens the right card while closing the list;
      1280×800 light and 375×812 dark screenshots both clean, no regression to the existing FAB
      stack or hamburger menu.
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
- [ ] `[02-P0-4]` **`self-host-glyphs`** `fix` — **Half done 2026-08-19 by cloud shift 32, half
      still open — see below.** Original scope: stop depending on `demotiles.maplibre.org`, a
      single point of failure that would erase every label on the map.

      **The harder failure mode (fixed this run).** Cloud shift 30's sharper finding: in this
      sandbox, where that domain is blocked, the blast radius was bigger than "labels disappear"
      — `app/Map.tsx`'s entire Phase 2 onward (roads, POIs, every site's building layer, all ~30
      subsequent phases) ran inside one `map.on("load", async () => {...})` callback, and
      MapLibre's "load" event itself never fired when the initial style's glyph fetch was
      permanently blocked, even though `map.loaded()` flipped true within ~1s regardless — so a
      user in that condition saw the base map and nothing else, forever. Fixed with a new
      `whenMapReady(map, cb)` helper that races the `load`/`idle`/`styledata` events against a
      300ms poll of `map.loaded()` (the one signal actually observed to become true) and fires
      once whichever comes first; both of `Map.tsx`'s "load" call sites (the opening cinematic
      fly, and the big Phase 2+ block) now go through it, with disposers wired into the effect's
      existing cleanup. **Verified live in this exact sandbox**, not just by code review: ran
      `next dev` + a Playwright script against real Chromium with the same blocked
      `demotiles.maplibre.org` — confirmed `map.on("load", ...)` truly never fires here (the new
      poll path is what actually carries it), and that `roads-main` and 31 further layers
      (32 total, including road-station markers and POI pins) now render successfully within
      ~7s despite `net::ERR_TUNNEL_CONNECTION_FAILED` on every glyph-range fetch. The only
      console errors are the expected glyph-fetch failures themselves (MapLibre attributes them
      to the "seas" source, since that's where the two always-on sea-label symbol layers with
      `text-font` live) — sea/gulf labels degrade to no text, exactly the originally-scoped
      "labels disappear" case, nothing worse.

      **Still open: actually self-hosting the glyph PBFs**, which removes the external
      dependency (and the whole class of failure) outright rather than degrading gracefully from
      it. That needs real font assets plus a PBF glyph-generation pipeline (e.g. `fontnik`/
      `glyph-pbf-composite` over a TTF) — unavailable in this sandbox (no matching package
      installed, and generating one would mean adding a new dependency, against the brief's
      "don't touch package.json without a data-change justifying it"). Whoever picks this back up
      needs either local tooling to pre-generate the PBFs once and commit the static output, or a
      network-unblocked environment to install the generator. Reset to `[ ]` rather than left
      `[~]`, per the board's own rule — the harder bug is fixed and verified, but the ticket's
      original ask isn't done yet.
- [x] `[09-P0-1]` **`ancient-sources`** `deepen` — `ancient_sources[]` populated for every
      `confidence: high` POI. **Standing task — never "done", always available.**
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
      *Batch 4 done 2026-08-17 by cloud shift 24: 1 more citation (149/230, 64.8%). Delegated 41
      of the ~82 remaining POIs to three parallel WebSearch agents by theme (Italy/Gaul/Hispania
      civic monuments, Eastern/frontier sites, industrial sites); only the Baths of Trajan (Cass.
      Dio 69.4.1) came back real. One candidate (Rheinzabern/Tabernae via a Symmachus panegyric)
      dropped on review — the researching agent flagged the exact passage as unconfirmed against
      the primary text. Confirms the pool has hit the wall the last two batches predicted: what's
      left is almost entirely tombs/mausolea/necropoleis (29), villas/estates (12), and
      shipwrecks (4). ~40 POIs remain genuinely open; expect a very low hit rate.*
      *Batch 5 done 2026-08-17 by cloud shift 25: 0 new literary citations (149/230, 64.8%,
      unchanged) — the honest result of a genuine search, not a skipped batch. Deliberately
      targeted 19 non-tomb candidates this round (Tabularium, Trajan's Markets, provincial
      theatres, Pompeii's forum/temples/baths, the Maison Carrée, Baalbek's Temple of Bacchus,
      the Alcantara Bridge, three amphitheatres) on the theory that famous standalone monuments
      would outperform the tomb-heavy remaining pool — they didn't. Every "hit" the research
      agent found turned out to be an **inscription** (CIL), not a literary passage, which this
      ticket's own rule excludes (inscriptions belong to `[09-P1-4]` epigraphy, standing and
      unclaimed) — so none were merged here. Real near-misses correctly rejected on review: Aulus
      Gellius on Trajan's Forum describes the neighboring Forum, not the separate Markets complex;
      Macrobius on Baalbek's oracle describes the neighboring Temple of Jupiter, not Bacchus;
      Vitruvius's own basilica is at Fanum Fortunae (Fano), a different building entirely from
      Pompeii's. 8 solid CIL citations came out of this batch with real reference numbers
      (Tabularium CIL I² 736, Stabian Baths CIL X 829, Temple of Isis CIL X 846, Temple of Apollo
      CIL X 787, Alcantara Bridge CIL II 759-761, Maison Carrée CIL XII 3156, Temple of
      Baalshamin's bilingual dedication, Cartagena's theatre lintel) — a ready-made head start for
      whoever picks up epigraphy next, not wasted effort even though nothing merged into this
      field. 81 high-confidence POIs remain open for literary citation; the tomb/villa/shipwreck
      wall this and the last two batches hit is now well-enough documented that a batch 6 should
      probably wait for `[09-P1-4]` to open the inscription channel rather than keep re-running
      the same literary-only search against the same thin pool.*
- [x] `[06-P0-2]` **`curate-buildings`** `deepen` — Ostia-depth curated descriptions for the
      other 39 sites, ~10 buildings/day. **Standing task, never "done".**
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
      *Ephesus done 2026-08-17 by cloud shift 24: 33 buildings in `app/ephesusDescriptions.ts`,
      the first living, continuously-occupied city (not a 79-CE burial site) to get this
      treatment — flipped the file's default from `extant_117ce: false` to mostly `true`,
      since Ephesus was thriving in 117 CE. Covers the Library of Celsus (still unfinished the
      day Trajan died), both Terrace Houses, the Serapeion, both agorae, the Prytaneion, and
      several genuinely-Hadrianic buildings (Vedius/East Gymnasia, the Olympieion, Hadrian's own
      temple) correctly marked not-yet-built. Fixed one date on review: the research pass gave
      the Library of Celsus `built: 114`, but its own text says construction was ongoing at
      Trajan's death — 114 is a start date, not a completion year, and sources disagree on when
      it actually finished (117 to 135), so `built` was left unset rather than asserting a wrong
      number. Two of the 33 entries (Great Theatre, Library of Celsus) turned out to duplicate
      existing standalone `pois.geojson` POIs at the same coordinates — those markers sit on top
      of the map canvas and will always intercept the click first, so those two entries are
      effectively unreachable dead code; left in as harmless rather than deleted. Verified with
      Playwright: clicking the Serapeion building surfaces the new text with the correct
      "Not standing in 117 CE" badge. 36 sites still open for the standing task.*
      *Delphi done 2026-08-17 by cloud shift 25: 34 entries (33 distinct buildings — Delphi's OSM
      data carries two differently-encoded Greek spellings of "Στάδιον"/stadium, both keyed to the
      same content rather than silently dropping one) in `app/delphiDescriptions.ts`, the first
      Panhellenic sanctuary rather than a city to get this treatment. Delphi's OSM building names
      are in Greek, not Italian/English like the first four sites, so — unlike those files — the
      lookup keys here are the exact Greek strings, researched via a background WebSearch pass
      keyed against Pausanias's own 2nd-century tour of the sanctuary (book 10), Herodotus,
      Plutarch (a working Delphic priest at the exact 117 CE snapshot date), and the Fouilles de
      Delphes excavation reports. One candidate dropped on review: `Τέμενος Ποσειδώνος` ("Precinct
      of Poseidon") has no known standalone structure at Delphi — the research pointed instead to
      a Poseidon altar inside the Temple of Apollo's own cella (Pausanias 10.24.4), so curating it
      as a second separate building would have asserted a precinct that likely doesn't exist;
      left unentered rather than guessed. Two more (`Δελφοί`, the generic park-boundary label, and
      `Σκαλοπάτια`, plain "steps") were out of scope from the start, not building names. One
      genuine surprise confirmed rather than assumed: `Στοά Αττάλου` ("Stoa of Attalos") looks like
      an OSM mix-up with the far more famous Athens Agora building of the same name, but checked
      out as real and Delphi-specific — funded by a different Attalid king (Attalos I, not II).
      Same duplicate-marker shadowing bug the Ephesus entry already documented recurred once: the
      curated `Ναός Απόλλωνος` (Temple of Apollo) entry is unreachable behind a pre-existing
      standalone `pois.geojson` POI (`poi_sanctuary_apollo_delphi`) at the same coordinates, which
      always wins the click first — left in as harmless rather than deleted, same call as Ephesus.
      Verified with Playwright: all 34 keys match real, distinct OSM features in the live building
      data (confirmed via `queryRenderedFeatures`, no silent typos); clicking the Athenian Treasury
      surfaces the authored text with no fallback message. 35 sites still open for the standing
      task.*
      *Jerash (Gerasa) done 2026-08-17 by cloud shift 26: 30 entries in `app/jerashDescriptions.ts`,
      the sixth site and the sharpest 117 CE snapshot case yet. Gerasa's famous silhouette — the
      Artemis sanctuary and temple, Hadrian's Arch, the Nymphaeum, both Tetrapylons, the upper Zeus
      temple — is Antonine through Severan (129-210s CE), a building boom that starts *after* Trajan
      died, so 22 of the 30 entries are honestly `extant_117ce: false` (including all 14 Byzantine
      churches, 494-611 CE, most securely dated by mosaic inscription) with descriptions that say
      what stood on the ground in 117 rather than describe an absent monument. Marked `true` and
      real in 117: the older Zeus sanctuary, the city wall, the two extramural market rows on the
      Philadelphia road, and — the standout — the North Gate, dated by its own inscription to 115 CE
      dedicated to Trajan, the single most precisely dated thing standing at the snapshot. Judgment
      calls: the Cathedral's underlying temple is `false` because its date is unknown and the Temple
      of Dionysus identification is unconfirmed by excavation; the Martyrion and Mortuary churches
      carry no `built` year (none securely attested); the Agora/Civic Basilica is `false` (design
      stage at most in 117). All 30 keys are the exact OSM strings — only the park label, visitor
      centre and a restaurant left uncurated. Verified with Playwright: North Gate surfaces "Built
      115 CE" and its text; Temple of Artemis shows the "Not standing in 117 CE" badge. 34 sites
      still open for the standing task.*
      *Trier (Augusta Treverorum) done 2026-08-17 by cloud shift 27: 12 entries in
      `app/trierDescriptions.ts`, the seventh site — and the first where the OSM extract itself
      was the binding constraint. Originally claimed for Timgad, which turned out to have only 7
      named OSM building features against an earlier shift's stale "30+" claim; pivoted to Trier,
      which has 116 named features on paper — but ~105 of those are ordinary present-day German
      city buildings (hospital wings, tax offices, hotel chains) with no Roman-era link, and none
      of Trier's headline Roman monuments (Porta Nigra, Amphitheater, Aula Palatina, Römerbrücke)
      carry an OSM name tag at all, so they can't be curated here regardless of how well documented
      they are. The 12 that do have real history are all honestly `extant_117ce: false` — Trier's
      building boom starts once it becomes a Tetrarchic/Constantinian imperial residence from 293
      CE, generations after this map's snapshot; several entries are medieval buildings raised over
      Roman ground centuries later. "Roter Turm" skipped: the exact name string appears twice in
      the geojson at two different real locations, so one lookup entry would misdescribe whichever
      a click hit. Verified with Playwright against the built production bundle: clicking
      Barbarathermen surfaces "Built 150 CE" and the "Not standing in 117 CE" badge with the
      curated text. 33 sites still open for the standing task, and the finding worth flagging for
      whoever picks the next one: check a candidate site's actual named-feature count in its own
      `_buildings.geojson` before claiming it — this board's own site-readiness notes have gone
      stale at least twice now (Timgad here, and see the epigraphy note below for three more).*
      *Merida done 2026-08-18 by cloud shift 29: 10 entries in `app/meridaDescriptions.ts`, the
      eighth site to get this treatment. Augusta Emerita's monumental core was already built by
      117 CE, so most entries are honestly `extant_117ce:true` — a rarer shape than recent Trier/
      Jerash batches that skewed almost entirely false. Two real misattributions researched and
      written into the copy rather than silently fixed: the "Temple of Diana" (a 17th-century
      guess) and the "Arch of Trajan" (Tiberian, renamed after its real inscription was lost). One
      candidate ("Termas romanas") skipped — its coordinates don't match any bath complex this
      research could confidently identify. 32 sites still open for the standing task.*
      *Palmyra done 2026-08-18 by cloud shift 30: 12 entries in `app/palmyraDescriptions.ts`, the
      ninth site — the OSM extract carries only 14 named features total (famous individually
      rather than numerous, the opposite shape from a living modern city's dump), keyed in Arabic
      and English. Palmyra's monuments split cleanly by century: the Temple of Bel (dedicated 32
      CE), the Temple of Nabu (~80 CE), and the Agora/Basilica market complex (Flavian-Trajanic)
      were already standing in 117 CE; the Tetrapylon, the Theatre, the Temple of Baalshamin
      (dedicated for Hadrian's 129 CE visit — 12 years off the snapshot), and the Caesareum are
      honestly `extant_117ce:false`, and the Baths of Diocletian and both churches are 3rd-6th
      century. Two candidates left out rather than guessed: "market" (every source treats it as a
      synonym for the Agora, not a separate structure) and معبد بعل ("Temple of Baal"), almost
      certainly the same temple as معبد بل (Temple of Bel) under an alternate transliteration — no
      source describes a second, distinct Baal temple here. 31 sites still open for the standing
      task.*
      *Athens done 2026-08-18 by cloud shift 31: 28 entries in `app/athensDescriptions.ts`, the
      tenth site and the first Panhellenic-scale living city (not a sanctuary like Delphi, nor a
      buried site like Pompeii/Herculaneum) to get this treatment. Most of the Classical/
      Hellenistic Agora survived into the Roman period untouched, so most entries are honestly
      `extant_117ce:true` — the exceptions are the handful of buildings from Hadrian's post-117
      building campaign (the Library of Hadrian, 132 CE; the Nymphaeum, finished c. 140 CE under
      Antoninus Pius; the Southeast Temple, first half of the 2nd c. CE) plus two buildings already
      demolished/superseded *before* 117 CE for the opposite reason (the old Mint, built over by
      the Southeast Temple; South Stoa I, replaced by South Stoa II c. 150 BCE). One candidate
      dropped rather than force-entered: "Λουτρό των Αέρηδων" is a real place but a c.1501 CE
      Ottoman hammam with no ancient identity, just sitting near the genuinely ancient Tower of the
      Winds. Verified all 28 keys match real, distinct OSM features; verified with Playwright
      against the built production bundle that clicking the Odeon of Agrippa surfaces the curated
      text with "Built 15 BCE" and no "Not standing" badge. 27 sites still open for the standing
      task.*
- [x] `[10-P0-3]` **`flagship-depth`** `deepen` — Bring POIs whose `notes` runs under 60 words up
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
      *Batch 2 done 2026-08-18 by cloud shift 28: the 24 thinnest fields (44–53 words), mostly
      Rhine/Danube/Dacian limes forts plus a handful of Rome monuments (Baths of Trajan, Trajan's
      Forum and Column, the Temple of Saturn, the Domus Augustana). Rewritten to ~100–130 words
      each, one genuinely new researched fact woven into the existing text per record — a named
      excavation, a garrison unit, a construction detail — not padding. Sources merged, not
      replaced. Depth 82.7% → 87.9%, thin tail 81 → 57. One judgment call worth flagging: German
      Wikipedia suggests Munningen's garrison may have been withdrawn "by around 110 CE at the
      latest," which would put the fort's active-garrison status in question at the 117 CE
      snapshot — the rewritten note was deliberately phrased around this (describes the vicus
      outlasting the garrison rather than asserting an active 117 CE garrison) rather than
      silently flipping `extant_117ce`; worth a second look with a primary source. 57 fields
      still under 60 words for whoever picks this back up.*
      *Batch 3 done 2026-08-18 by cloud shift 30: the 26 thinnest fields (53-59 words), all already
      sourced from prior batches — this round expanded and enriched rather than starting cold, via
      two parallel WebSearch passes covering shipwrecks, Rome Forum monuments, frontier forts/
      fortresses, naval bases, a mine, a signal tower, and three classical battles. Every record
      picked up at least one genuinely new fact (a named excavator, an exact measurement, a
      specific date) beyond what the earlier text already said; sources merged, not replaced. Depth
      87.8% → 93.4%, thin tail 57 → 31.*
      *Batch 4 done 2026-08-18 by cloud shift 31: all 31 remaining sub-60-word fields (shipwrecks,
      Rhine/Wetterau/Danube/Dacian frontier forts, Rome monuments, naval bases, mines, quarries,
      garum factories) rewritten via two parallel WebSearch passes, worst-first — clears the queue
      to near-zero. Depth 93.4% → 98.9%, thin tail 31 → 5. Fixed a duplicated "buried by the
      eruption" sentence in the Pompeii Forum entry along the way. The 5 remaining are all 58-59
      words (right at the line) and weren't in this batch's research scope — left for a future
      micro top-up rather than padded to clear the number.*
      *Batch 5 (closing) done 2026-08-19 by cloud shift 33: the last 5 fields (Carrara Marble
      Quarries, Throp Fortlet, Vigo Roman Salt Works, Battle of Zama, Rusidava Fort), one genuinely
      new researched fact woven into each — Trajan's Column's 19 marble drums at ~32 tons apiece
      (Plin. NH 36.135), Throp's 1910 Simpson excavation and its two occupation phases, the 1998
      accidental discovery of the Vigo saltworks and its garum-industry link, Polybius's own troop
      counts for Zama's elephant charge and Scipio's counter-formation, and Rusidava's direct
      naming on the Tabula Peutingeriana with its mileage to neighboring stations. Depth 98.9% →
      **100.0%, thin tail 5 → 0** — the standing task's thin-description queue is now empty.
      `npm run metrics` confirms 469/469 at 60+ words.*
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

- [x] `[07-P1-1]` **`travel-time`** `add` — Done 2026-08-18 by cloud shift 29, road-only (sea
      network is a real future extension, not attempted here — see below). Highest-impact single
      feature in the backlog. `scripts/build-route-graph.mjs` builds a routable graph from
      `roads_main.geojson`+`roads_secondary.geojson` — 14,601 segments become edges between
      endpoint-nodes deduped by rounded coordinate (10,214 nodes, 9,477 shared by 2+ segments, so
      the network is genuinely connected). `public/data/route_graph.json` (~6MB), fetched only
      when Directions opens. `app/routeGraph.ts` runs client-side Dijkstra with a binary min-heap
      (O(E log V), not the ~100M-op naive O(V²) scan a flat array would need). `app/Directions.tsx`
      + `app/useDirections.ts`: click A and B — via the map directly, the right-click context
      menu's now-real "Directions from/to here" (was disabled, see `FEATURE_BACKLOG.md`), or a
      place card's new "Directions" button — draws the real road route (not a straight line) and
      reports distance plus legion/merchant travel-day estimates using `FEATURE_BACKLOG.md`'s own
      25/15-Roman-mile-per-day assumptions. Two honest edge cases: two points in different
      connected components (e.g. mainland Italy to Vindolanda — no Channel crossing in the source
      data) report "No road route found" rather than faking a line across open sea; a click off
      the mapped network reports its own snap-to-road distance separately instead of folding it
      silently into the total. Directions and the ruler are mutually exclusive map "modes"
      (starting one cancels the other). Verified with Playwright: Rome→Ostia returns a real
      24.9 km, 18-point road-following route in well under a second; the Britain case correctly
      reports no route; both entry points work at 1280×900 light and 375×812 dark, desktop and
      mobile. **What's still open**: sea legs (a genuinely different routing problem — sailing-
      season-dependent, no equivalent network file exists yet) and multi-day itinerary stops along
      the route are both real future extensions, not attempted in this pass.
- [x] `[07-P0-2]` **`category-life-writing`** `deepen` — Done 2026-08-16. All POI
      categories written (the report estimated ~20), 116–130 words each, present tense, in
      `app/categoryLife.ts`; renders as "What happened here" on every card. Covered 448/448 POIs
      at ship time; cloud shift 2 added 2 more categories (`ludus`, `sarcophagus_workshop`) the
      same day and kept coverage at 100% — standing task, re-check the count on future adds.
- [x] `[03-P1-4]` **`nearby-related`** `polish` — Done 2026-08-18 by cloud shift 29. Six closest
      curated POIs by great-circle distance, same-category boosted so a relevant place a few km
      further off can outrank an unrelated one next door — `app/useNearby.ts` (client, shared with
      the live map panel) and a duplicated server-side version in `place/[slug]/page.tsx` (can't
      import a "use client" hook into a server component; matches this codebase's existing
      per-file-haversine convention). Clicking a card in the live panel calls `selectPoi()` again
      and re-renders in place; the static page links to the other place's own URL. Excludes
      candidates under 25m away — without that filter every place's "Nearby" row led with its own
      exact duplicate at "8 m", surfaced during testing by the still-open `[12-FIX-3]` Pantheon/
      Pantheon-Rome pair. Verified with Playwright at 1280×800 light and 375×812 dark: theme
      tokens throughout (no hardcoded chrome colors), horizontal-scroll strip on the panel, grid
      on the static page, click-through re-selects correctly on both.
- [x] `[02-P0-2]` **`coastline`** `polish` — Done 2026-08-18 by cloud shift 30. A quiet line
      traced along the land polygon's own edge (new `coastline` layer + palette token in both
      light/dark), drawn above the sea-mask/ancient-sea fills so land and sea meet with a visible
      line instead of a hard color boundary, matching Google Maps' own coastline treatment.
      Screenshotted at 1280×900 desktop light and 375×812 dark — visible as a subtle darker stroke
      along every coast in both themes, no regression to the phone chrome. This sandbox's
      demotiles.maplibre.org block (see the province-overlay ticket note below for the fuller
      finding) means the map's own "load" event never fires here, so the roads/POI/building
      layers added in later phases couldn't be screenshotted this session — but the coastline
      layer itself lives in the initial, ungated style, so it rendered and was confirmed correctly
      in both screenshots regardless.
- [x] `[02-P0-3]` **`road-weights`** `polish` — Done 2026-08-18 by cloud shift 31. Raised the
      low-zoom width/opacity floor on both `roads-main` and `roads-secondary` (they were nearly
      invisible at empire-wide zoom — 0.25-0.3px, 0.35 opacity) and added a `roads-main-casing`
      layer (new `roadMainCasing` palette token, both themes): a wider, darker stroke drawn
      beneath the bright fill so a thin border shows on either side, the way Google Maps' own
      highway casings read. Registered in `useLayers.ts`'s "roads" group alongside the two
      existing layer ids so the Layers-panel toggle still hides/shows the casing correctly.
      Verified by forcing this sandbox's gated `map.on("load")` phase-2 handler to fire directly
      (documented workaround for the `demotiles.maplibre.org` block, see `[02-P0-4]`) — both new
      layers add with valid paint expressions, screenshotted correctly at 1280x900 light and
      375x812 dark.
- [x] `[02-FIX]` **`halo-colors`** `fix` — Done 2026-08-19 by cloud shift 32. Replaced all 21
      hardcoded `"#f4ead5"` halo/stroke literals in `Map.tsx` (circle-stroke-color, text-halo-
      color, one canvas-drawn icon's strokeStyle) with `P.labelHalo`, which already resolves to
      the correct light/dark token — the two `LIGHT`/`DARK` palette *definitions* themselves
      (lines 46, 56) are the only remaining literal `#f4ead5`, as they should be. `npx tsc
      --noEmit` and `npm run build` both clean.
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
- [x] `[04-P0-2]` **`long-press`** `polish` — Done 2026-08-19 by cloud shift 33. Mobile already
      had a 550ms touch-hold timer opening the context menu (`app/ContextMenu.tsx`, shipped
      2026-08-12), but gave zero visual feedback while holding — nothing told a user their touch
      was being recognized as a hold rather than a tap-that-hasn't-released-yet. Added a growing
      ring at the touch point (new `holdPoint` state, a `long-press-ring` CSS keyframe in
      `globals.css` timed to the same 550ms `LONG_PRESS_MS` the timer already uses, so the ring's
      fill finishes right as the menu opens), cleared on release/move/fire same as the existing
      timer-cancel path. Automatically covered by the site's existing `prefers-reduced-motion`
      block (no separate guard needed). Verified with Playwright at 375×812: a synthetic touch
      hold shows the ring in the DOM with the correct animation within 80ms of touchstart; desktop
      1280×800 light unaffected (the ring only renders when `holdPoint` is set, a touch-only code
      path). One sandbox testing caveat logged in SHIFT_LOG: Chromium's CDP touch-event synthesis
      appears to trigger the native `contextmenu` compatibility event almost immediately,
      independent of the app's own JS timer, which makes end-to-end synthetic-touch timing tests
      unreliable for confirming the exact 550ms delay — the ring's own presence and the unchanged
      timer logic were verified directly instead.
- [ ] `[11-P1-5]` **`pmtiles`** `polish` — tippecanoe → PMTiles for roads/places/provinces/land.
- [ ] `[11-P1-6]` **`split-map-tsx`** `fix` — Break the 2,112-line `Map.tsx` into a layer
      registry so adding an overlay is a new file, not a monolith diff.
- [ ] `[10-P1-3]` **`thematic-rooms`** `polish` — Six curated rooms (Power · Movement · Money ·
      Belief · Knowledge · Danger) replacing the flat overlay checkbox list.
- [ ] `[06-P1-3]` **`building-typology`** `deepen` — Extend to the ~35-term standard vocabulary,
      grouped into six colour families.
- [ ] `[06-P1-4]` **`excavation-history`** `deepen` — `excavation[]` on all 40 sites.
- [x] `[09-P1-4]` **`epigraphy`** `deepen` — Batch 1 done 2026-08-17 by cloud shift 26. 16
      inscriptions merged into `pois.geojson`'s `ancient_sources[]` (author = corpus siglum,
      work = inscription type, ref = date, to fit the validator's literary-source shape): the 8
      CIL leads shift 25 handed off, verified and written up, plus 8 more researched and verified
      this shift (Trajan's Column VI 960, Arch of Titus VI 945, Porta Maggiore VI 1256, the Delphi
      Gallio rescript SIG³ 801d, Philae's Cornelius Gallus stele III 14147, the Colosseum VI
      40454a, the Nîmes amphitheatre XII 3316). Rejected on review: the Pantheon inscription
      (belongs to the finished Hadrianic building, not the 117 construction site), Temple of Bel
      Palmyra (text unverified), Temple of Saturn (4th-c restoration), Baths of Neptune /
      Capitolium / Ostia synagogue (all post-117). Renders through the card's existing "In ancient
      writing" block. **Standing task** — hundreds of curated POIs still carry no inscription.
      *Research also surfaced two duplicate-POI pairs for `[12-FIX-3]`: `poi_pantheon` /
      `poi_pantheon_rome`, and `poi_pompeii_temple_apollo` / `poi_temple_apollo_pompeii`.*
      *Batch 2 done 2026-08-17 by cloud shift 27: 0 new citations merged — a real, honest zero,
      not a skipped batch. Targeted the four sites the previous shift's handoff note recommended
      (Ostia guild seats/Capitolium, Timgad arch/forum, Aquileia, Mérida theatre/amphitheatre) and
      found the targeting itself was the problem: **three of the four sites have no matching POI
      in `pois.geojson` at all** (Timgad, Aquileia's forum, Mérida's theatre/amphitheatre) — an
      inscription has nowhere to attach even when it's real and verified. For the one site that
      does have matching POIs, Ostia's Capitolium and Piazzale delle Corporazioni guild seats,
      the genuine surviving inscriptions there are Severan-era (c. 190-210 CE) or later — a real
      `not_found`, correctly excluded rather than forced. Did surface three well-sourced,
      genuinely verified candidate citations with no POI yet to hold them (Aquileia's forum
      elogium AE 1996, 685; Mérida theatre's Agrippa dedication CIL II 474; Timgad's Trajanic
      foundation text CIL VIII 2355) — a ready-made head start for whoever adds those POIs. 149/230
      high-confidence POIs remain at 64.8%, unchanged; the standing pipeline itself is unaffected.*
      *Batch 3 done 2026-08-18 by cloud shift 28: opened the channel batch 2 found closed. Added
      the three missing POIs (Forum of Aquileia, Roman Theatre of Merida, Forum of Timgad) and
      attached the three citations batch 2 had already verified and handed off (AE 1996, 685;
      CIL II 474; CIL VIII 2355 — the Timgad text attached to the forum, not the standing Arch of
      Trajan, which is Severan and postdates 117 CE per batch 2's own caution). Also attached 5
      further verified citations to famous POIs that had none: Pantheon (CIL VI 896), Ara Pacis
      (Res Gestae 12.2), Domus Aurea (Suetonius, *Nero* 31.2), Baths of Nero (Martial 7.34),
      Rostra (Cassius Dio 47.8.3-4). `pois.geojson` 467 → 470 features.*
      *Batch 4 done 2026-08-18 by cloud shift 29: 6 more POIs cited — the Library of Celsus
      (I.Ephesos 5113, the facade dedication from Aquila to his father), Domus Flavia (Statius,
      *Silvae* 4.2), Alexandria's Mouseion (Strabo, *Geography* 17.1.8), the Herculaneum
      Augustales' hall (AE 1979, 169), Circus Flaminius (Livy, *Periochae* 20 — cited to the
      surviving summary since the full Book 20 is lost, not to a book/chapter that doesn't exist),
      and the House of the Vettii (two electoral graffiti naming its freedman owners, CIL IV 3509
      and 3522). Ostia's Synagogue researched and left uncited — its one attributed inscription
      (Mindius Faustus's ark donation) dates to the second half of the 2nd century CE, not
      contemporary with 117 CE (the same post-117 finding batch 1 had already made for Ostia's
      Capitolium/guild seats, corroborated here independently). `pois.geojson`: 167 → 173 of 470
      POIs now carry `ancient_sources`.*
      *Batch 5 done 2026-08-19 by cloud shift 32: researched 16 candidate monuments via a
      background WebSearch agent (Trajan's Markets, five Ostia landmarks, six Pompeii/Herculaneum
      ones, Corinth's Peirene, Antioch's theatre, Alexandria's Heptastadion, Londinium's forum and
      bridge), then personally screened the results down to the 5 that were both real and safely
      dated: Ostia Forum (CIL XIV 375, Lucilius Gamala's paving/repairs), Ostia Theatre (CIL XIV
      82, Agrippa's Augustan-era building inscription), Pompeii Forum (CIL X 794, Vibius Popidius's
      portico), Pompeii Temple of Jupiter (CIL X 797, a priest's statue base found in the cella),
      and Alexandria's Heptastadion (Strabo, *Geography* 17.1.6-10). The other 11 were dropped on
      the agent's own honesty, not padded in: Trajan's Markets, Piazzale delle Corporazioni,
      Villa of the Mysteries, Villa of the Papyri, and both Londinium entries came back genuinely
      `not_found`; the Antioch theatre and Villa of the Mysteries seal only had a late/unpinned
      source (Malalas, 6th c.); Corinth's Peirene had a real citation (Pausanias 2.3.2-3) but
      Pausanias wrote 150s-160s CE describing what may be a later marble remodeling, too close to
      misattributing a post-117 phase to risk it. One useful side-finding: the agent flagged
      Ostia's Capitolium as possibly post-117 and worth a date check — already correctly handled,
      `pois.geojson` has had `built: 120, extant_117ce: false` on that record all along, so no
      fix needed. `pois.geojson`: 173 → 178 of 469 POIs now carry `ancient_sources`.*
- [ ] `[09-P1-5]` **`clear-unverified`** `verify` — Re-check the citations SHIFT_LOG recorded as
      unverified (Atrium Vestae, Domus Flavia, Bibliotheca Ulpia, Baths of Nero, Ara Pacis).
- [x] `[08-P1-4]` **`gazetteer-audit`** `fix` — Done 2026-08-19 by cloud shift 32. First
      finding was a false alarm worth recording: a script searching `places_medium.geojson` for
      Londinium by a `name` field came up empty and nearly triggered a duplicate "fix" — but the
      file's real schema is `modern`/`latin`/`greek`, not `name`, and a corrected search found
      Londinium already present (`id: 900002`, `major: 1`, added by an earlier shift's capital
      sweep). Ran the same corrected search against 17 more major cities and found the real hole
      the ticket's own text asked for: **Carthage, Thessalonica, Sirmium, Serdica, Tarraco,
      Byzantium, Pergamum, Sardis, Nicomedia, Caesarea Maritima, and Smyrna** were all genuinely
      missing (their only gazetteer hits were unrelated minor satellite villages, e.g.
      Nicomedia's search only surfaced a village "10 miles E Nicomedia"). Added all 11 following
      the exact schema and `major: 1`/id-9000xx convention the earlier capital sweep set (`id`
      900013-900023, `type: "12"`, `accuracy: 20`, real coordinates, each city's own founding
      year). File is a single compact JSON line with no whitespace — wrote the append with
      `separators=(", ", ": ")` and no `indent` to keep the diff to +1/-1 lines instead of
      reformatting all 16,326 existing features (caught and reverted a first attempt that did
      exactly that). **Verified live**: `next dev` + Playwright, searched "Sremska Mitrovica"
      (Sirmium's modern name) and watched it resolve to the Sirmium card with "Today: Sremska
      Mitrovica" — same path Roma/Londinium/Alexandria already used. `npm run validate` clean.
      Mérida and Ravenna deliberately left out of this batch — both already searchable as
      curated `sites.ts` entries, so a second raw-gazetteer point would be redundant rather than
      filling a real hole.
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
- [x] `[05-P0-2]` **`focus-ring`** `polish` — Done 2026-08-17 by cloud shift 25. Global
      `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }` in
      `app/globals.css`, theme-token-driven so it's correct in both color schemes automatically.
      Text inputs get an inset `box-shadow` instead of `outline` — several (the search field
      chief among them) sit flush inside a rounded pill container with `overflow: hidden`, and an
      outward outline got clipped by the pill's edge; verified the clipping with a screenshot
      before switching approach. No component changes needed beyond the CSS — every `<button>`
      already relies on the browser's native focus handling, so the rule just had nothing to
      override except the two inline `outline: none` inputs already accounted for. Verified with
      Playwright (real headless Chromium) at 1280×800 light and 375×812 dark: tabbed through the
      hamburger menu, search field, search icon button, and the "Why 117 CE?" pill in both — every
      one shows a clean ring in the accent color, circular buttons get a circular ring (modern
      Chromium/Firefox/Safari all make `outline` follow the element's own `border-radius`
      natively), no clipped or missing rings. The map canvas itself is also keyboard-focusable
      (existing behavior, for arrow-key pan) and picks up the ring too, though at full-viewport
      size the ring renders just outside the visible canvas and is effectively invisible — not a
      regression, just a size where the effect doesn't show.
- [x] `[05-P0-3]` **`reduced-motion`** `polish` — Done 2026-08-19 by cloud shift 32 (Track B).
      Global `@media (prefers-reduced-motion: reduce)` block in `globals.css` collapses every CSS
      transition/animation to ~instant — covers the panel slides, sheet drags, hint fades, etc.
      that already used inline `transition:` styles, no per-component changes needed. MapLibre's
      camera `flyTo`/`easeTo` calls animate via `requestAnimationFrame`, not CSS, so a separate
      `app/reducedMotion.ts` (`motionDuration(ms)`, mirrors the existing `prefersDark()` pattern)
      wraps the `duration` on all 13 call sites across `Map.tsx`, `Chrome.tsx`, `Compass.tsx`,
      `HomeButton.tsx`, `LegionLocator.tsx`, `PlaceDetails.tsx`, `PlacesInViewList.tsx`,
      `SitesPanel.tsx`, `TourPlayer.tsx`, and the cluster-expand `fitBounds` in `PoiMarkers.tsx` —
      the opening cinematic fly, every search/site/legion/tour jump, place-selection easing, and
      the compass bearing reset all cut instantly instead of forcing a pan. Left the four ~200ms
      keyboard pan/zoom nudges in `useKeyboardShortcuts.ts` and `ZoomControl.tsx` unwrapped — short
      enough not to be the vestibular-trigger case this ticket targets, and wrapping them adds
      surface area for no real benefit. Couldn't screenshot live (this sandbox's `map.on("load")`
      never fires, see `[02-P0-4]`) — verified by code review + `npx tsc --noEmit` + `npm run
      build`, both clean.
- [ ] `[13-P0-3]` **`image-fallback`** `illustrate` — Static map thumbnail for the 145 places
      with no image.
- [x] `[11-P0-2]` **`lazy-overlays`** `polish` — Done 2026-08-19 by cloud shift 34. All 27
      non-base overlay groups (road-stations through ethnic-pockets) used to fetch, parse, and
      add their GeoJSON on every cold load despite defaulting OFF. `app/useLayers.ts` gained a
      loader registry (`registerLayerLoader`/`ensureLayerLoaded`/`resetLayerLoaders`), deduped so
      toggling a group off and back on never re-fetches and a failed fetch retries on the next
      toggle rather than wedging; `toggleLayer()` loads on first switch-on, `applyAllLayers()`
      also lazily loads any group a returning visitor's `localStorage` already has on.
      `app/Map.tsx`'s ~27 thematic phases had their existing fetch+addSource+addLayer+handlers
      bodies handed to the registry instead of running unconditionally — a mechanical wrap, no
      logic changed inside any phase. `lines.geojson` (backs both `frontier-lines` and
      `aqueduct-lines`) uses a shared `onceLoader` so the second group to switch on doesn't
      re-fetch. New `THEMATIC_LAYER_ORDER` + `restackThematicLayers()` keep cross-overlay z-order
      canonical regardless of what order a user enables things in, since layers now arrive in
      click order instead of phase order. Verified independently (not just trusting the
      implementing agent's own report): `npx tsc --noEmit`/`npm run build`/`npm run validate` all
      clean; a from-scratch Playwright run against the built production server confirmed cold
      load fetches none of the 27 thematic files (only the 5 base-group files + `pois.geojson`);
      presetting `localStorage`'s `mints:true` before load confirmed the returning-visitor path —
      `mints.geojson` fetched exactly once, `mints-point` visible, source carrying all 40
      features (picking up this same shift's mint-data batch correctly); 375×812 dark and
      1280×800 light screenshots of the default view both clean, pixel-equivalent to before.
      **Two small pre-existing eager fetches found and left out of scope, logged in
      `FEATURE_BACKLOG.md`**: `ProvincePanel.tsx` fetches `politics.geojson` unconditionally on
      mount, and `PeopleMarkers.tsx` awaits `people_117.geojson` before checking its own
      visibility flag — neither is one of the 27 `Map.tsx` phases this ticket converted.
- [x] `[01-P0-3]` **`cluster-expand`** `polish` — Already implemented, just never marked —
      found and closed 2026-08-19 by cloud shift 32. `PoiMarkers.tsx`'s cluster badges have
      carried a click handler that `fitBounds`s to every member's coordinates (capped at
      `maxZoom: 17`, `padding: 80`) since whenever clustering itself landed; this ticket's ask
      was already met, just never checked off. **Verified live**, not just by reading the code —
      this run's `[02-P0-4]` fix (see above) made a real `next dev` + Playwright session possible
      in this sandbox for the first time: loaded the empire view, clicked a 68-member cluster
      near Rome, watched the map ease from z6.0 to z10.0 exactly as `fitBounds` promises. No code
      changed, just closing the loop.
- [x] `[01-P0-4]` **`search-selects`** `polish` — Done 2026-08-17 by cloud shift 26. Search now
      also matches the 467 curated `pois.geojson` records (merged ahead of the DARE gazetteer so a
      curated landmark outranks a bare dot of the same name): a POI result calls `selectPoi()` and
      opens the full place card with the enlarged ringed marker, exactly as a map-click does; a
      gazetteer-only result drops the red "What's here?" pin with a name popup. One ordering
      subtlety documented in the code: `selectPoi()` fires Map.tsx's own panel-aware `easeTo`
      (current zoom), so the search jump's zoom-in `flyTo` is issued *after* it in the same tick —
      MapLibre cancels the earlier camera call, so the one carrying the zoom goes last. Verified
      with Playwright at 1280×800 light and 375×812 dark.

## P2

- [x] `[07-P1-3]` **`prices`** `deepen` — Done 2026-08-19 by cloud shift 32. New "What things
      cost" section in `app/CurrencyConverter.tsx`, five well-attested period prices/wages, each
      with a real citation and no Diocletian's-Edict anachronism (that's 301 CE, 184 years past
      this map's snapshot): a legionary's 300-denarii yearly pay (Suetonius, *Domitian* 7.3), a
      modius of wheat at 40 asses (Pliny the Elder, *Natural History* 18.90), a sextarius of house
      wine at 1 as (a Pompeii tavern's own scratched price list, CIL IV 1679), and a day-laborer's
      1-denarius wage (Matthew 20:2). Live-updates against whatever amount/unit the user has
      entered above ("your amount above buys about N of these"), so it deepens the existing
      converter rather than just bolting on a static table. Researched via a background WebSearch
      agent instructed to report `not_found` rather than guess; deliberately dropped several
      candidates the agent flagged as single-source-with-no-pinned-citation (centurion pay
      multiplier, slave prices, olive oil, a toga) — "real data or don't include it" per the
      brief, a shorter sourced list beats a longer hedged one. `npx tsc --noEmit` clean.
- [x] `[07-P1-4]` **`governors`** `add` — Done 2026-08-17 by cloud shift 25, with an honest
      shortfall against the ~45 estimate — see note below. 12 governors added to
      `public/data/politics.geojson` (`category: "provincial_governor"`, reusing the existing
      layer/popup — no new UI surface), covering 13 of the 43 provinces (Lucius Catilius Severus
      held both Galatia-Cappadocia and the improvised Armenia-Mesopotamia command, one marker
      carries both). Researched via two parallel background WebSearch passes, one per half of the
      province list, each told explicitly to report `not_found` rather than invent a name.
      **The ~45 figure in this ticket's own text turned out to be optimistic**: named, dated
      provincial governors for the specific year 117 CE are genuinely rare in the surviving
      record outside the handful of provinces Trajan's Parthian War pulled into the historical
      spotlight — both research passes came back with far more honest `not_found`s than hits (21
      `not_found` across both batches) for the ordinary senatorial proconsulships and equestrian
      procuratorships, where scholarship's fasti simply have gaps spanning this exact year. The
      12 that shipped lean hard on that same War: Hadrian himself at Syria the day he's acclaimed,
      Lusius Quietus mid-Kitos-War in Judaea, Marcus Rutilius Lupus watching Alexandria burn,
      Quadratus Bassus dying in Dacia this same year, three more generals from the same campaign.
      Two more provinces were reported `not_found` only because the researching agent exhausted
      its search-tool budget before reaching them (Hispania Baetica, Lusitania, Sicilia, Dalmatia)
      — genuinely unresearched, not confirmed-absent, and the best remaining marginal return for
      whoever picks this back up. All entries carry real sources (ancient authors — Cassius Dio,
      the Historia Augusta, Eusebius — plus modern fasti compilations and epigraphy) and an honest
      `confidence` field (7 high, 4 medium, 1 low for Moesia Superior, whose only evidence is a
      five-year gap between two other governors' securely dated terms). Verified with Playwright:
      toggled the existing "Political apparatus" layer on, confirmed all 32 politics.geojson
      features (20 existing + 12 new) render, hovered a new marker and confirmed the popup shows
      the right name/bio/category label. Also confirmed, while debugging an unrelated screenshot
      timing issue, that `applyAllLayers()` (the invariant-0 mechanism hiding non-base thematic
      layers by default) does fire correctly on a cold load in this project's dev-server sandbox —
      just slowly (~20-25s here, this environment's network restrictions make MapLibre's external
      glyph-loading retries slow; not a bug, not present in production, no action needed).
- [x] `[07-P1-5]` **`ordinary-people`** `add` — Done 2026-08-17 by cloud shift 26. 25 named
      non-elite people added to `people_117.geojson` (25 → 50 features): Vindolanda-tablet troopers,
      a slave, a supply contractor; the Karanis-papyri soldiers; the Babatha and Salome Komaise
      Dead Sea archives; Tiberius Claudius Maximus (captor of Decebalus) and Marcus Ulpius Phaedimus
      (Trajan's attendant, died at Selinus 12 Aug 117). New green `ordinary` role ring and an
      `attested` field carrying the date of the evidence so bios state plain facts, not hedges.
      **Landed at 25, short of the ticket's 30-50 estimate** — named non-elite people you can both
      date to ~117 and place on a map are genuinely scarce; three plausible candidates (a Fayum
      weaver, two tradeswomen) dropped for undatable evidence. Layer still defaults OFF; verified
      with Playwright.
- [ ] `[06-P1-5]` **`finds`** `illustrate` — 3–8 artefacts per site with images and museum.
- [ ] `[10-P1-4]` **`entrance`** `polish` — One sentence, three doors, dismissible.
- [ ] `[03-P2-8]` **`compare-today`** `polish` — Satellite/modern toggle for the viewport.
- [ ] `[13-P2-8]` **`og-images`** `illustrate` — Generated per-place OG images;
      `summary_large_image`.
- [ ] `[05-P2-6]` **`i18n`** `polish` — `strings.ts` scaffold; English + Italian.
- [ ] `[04-P2-9]` **`manifest`** `polish` — Web manifest + maskable icon.
- [x] `[14-P2-8]` **`hub-pages`** `add` — Done 2026-08-17 by cloud shift 27. Five explainer essays
      at `/hub/[slug]` (`app/hubs.ts` + `app/hub/[slug]/page.tsx`, mirroring `/province/[slug]`'s
      split between a hand-written registry and a page that aggregates real data around it): The
      Roman Road Network, The Roman Army in 117 CE, 11 August 117 (the snapshot date itself),
      Trade/Coinage/the Economy, and Religion & the Sacred Landscape. Each pairs 3-5 paragraphs of
      scene-setting prose with a live-pulled slice of data already shipped — road stations grouped
      by road, the 28 legions by province (linking to their `/place/` cards), people/events from
      the 117 CE snapshot, mints/trade routes, and imperial-cult centers/religious communities by
      tradition — no new atomic research, purely a reading path into content that otherwise only
      surfaces one marker at a time on the map. Wired into `sitemap.ts`. Two real data-shape bugs
      caught and fixed while wiring the supporting lists, not the map's own code: `events_117.geojson`
      mixes Point and Polygon geometries (the Kitos War revolt zones) in one file, which crashed
      static generation on `.toFixed()` until a small polygon-centroid helper was added; and
      `trade_routes.geojson` mixes the named LineString routes with their individual Point
      waypoints ("node_*" features) in the same FeatureCollection, which needed filtering before
      the routes list was correct. Verified: `next build` generates all five routes cleanly;
      screenshotted at 1280×900 light and 375×812 dark.
- [x] `[09-P2-8]` **`how-we-know`** `add` — Done 2026-08-18 by cloud shift 30. New `/how-we-know`,
      a single static page (mirrors `/hub/[slug]`'s parchment-card styling) explaining the 117 CE
      snapshot rule and its judgment calls, where the base geography comes from, the difference
      between "Sources" and "In ancient writing" citations, what `confidence` means, the image-
      sourcing standard, and an honest accounting of what's incomplete. Every number on the page
      (place count, % with a modern/ancient source, high-confidence citation coverage, % with an
      image, the live thin-description count) is computed from `pois.geojson` at build time rather
      than hand-typed — same reasoning `[15-P1-4]` metrics gave for going generated. Wired into
      `sitemap.ts`; linked from `EpochModal.tsx`'s "Why 117 CE?" popup. Screenshotted at 1280×900
      desktop and 375×812 dark — this is a static server-rendered page, unaffected by this
      session's map-load-gate finding (see the province-overlay note below).
- [x] `[02-P1-6]` **`sea-labels`** `add` — Done 2026-08-18 by cloud shift 29. 32 named seas, gulfs
      and straits in `public/data/seas.geojson`, always-on cartographic labels (base geography,
      not a toggleable overlay — same tier as place labels, no `useLayers.ts` entry). Uppercase
      letter-spaced text in place of italics — this sandbox couldn't confirm the demotiles glyph
      set carries an italic face, and the project's existing street-label layers already use the
      same letter-spacing substitution for the same reason. Latin name (Mare Tyrrhenum, Fretum
      Gaditanum, ...) surfaces on hover rather than in the display label, per the English-first
      display-name rule. Two-tier reveal zoom (seas/oceans from z3, gulfs/straits from z5.5) via
      two filtered symbol layers sharing one source, since MapLibre's `minzoom` is a layer-level
      property and can't be data-driven per feature. Verified the style is valid (layer list
      includes both `sea-labels-major`/`-minor`, no MapLibre style errors) — this sandbox's own
      egress block on `demotiles.maplibre.org` (same as every text layer already on this map)
      meant the actual glyph rendering itself couldn't be screenshotted here; text-layer syntax
      and data loading were confirmed instead.
- [ ] `[12-P1-4]` **`fuzzy-dates`** `fix` — `{earliest, latest, display}` date objects.
- [ ] `[11-P2-10]` **`next-upgrade`** `fix` — `next@14.2.5` advisory flagged in shift 1 and never
      actioned. Deliberate upgrade with a smoke test.
- [ ] `[06-P2-6]` **`priority-cities`** `add` — Alexandria, Carthage, Antioch, Londinium,
      Lugdunum, Tarraco, Pergamon, Caesarea Maritima before further Italian secondary towns.
- [x] `[08-P2-7]` **`ancient-lakes`** `add` — Done 2026-08-18 by cloud shift 28. 20 named lakes
      added as a `lake` type on the existing natural-landmarks layer (`landmarks_117.geojson`,
      24 → 44 features; reuses the layer/source as-is, defaults OFF, no new toggle): Fucino
      (Claudius's naumachia and failed drainage tunnel), Trasimene (Hannibal's ambush), Avernus
      (Agrippa's secret fleet base), Lucrinus (Sergius Orata's oyster farms), Bolsena, Albano,
      Nemi, Como (Pliny the Younger's villas), Garda (Catullus's Sirmio), Maggiore, Bracciano
      (source of the Aqua Traiana), Geneva (Caesar's rampart against the Helvetii), Constance,
      Copais (Aristophanes's eel jokes), Karla/Boibeis, Stymphalia (the Stymphalian birds), Moeris
      (pharaonic hydraulic engineering, still functioning under Rome), Mareotis (Alexandria's
      inland harbor), the Sea of Galilee, and the Dead Sea. One entry (Karla) shipped without an
      image — no specific Commons filename could be confirmed with confidence, and a wrong guess
      is worse than none per the image invariant. First redo of this run's data pipeline is worth
      noting for future shifts: the file's existing indent style is 1 space per nesting level, not
      the standard 2 — a first pass through `json.dump(indent=2)` reformatted the whole file and
      produced a 1,800-line diff for a 20-feature add; redone as a pure text splice matching the
      file's own indent so the diff is a clean 537-line addition.
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

- 2026-08-17 · `[14-P1-4]` province-pages · cloud shift 24. `app/provinces.ts` (43 provinces) +
  `app/province/[slug]/page.tsx`, wired into `sitemap.ts`. See ticket note above.
- 2026-08-17 · `[01-P0-1]` selected-marker · cloud shift 24. Enlarged+ringed selected pin,
  panel/sheet-aware camera padding. Found and fixed a real bug in the same pass — see ticket
  note above.
- 2026-08-17 · `[09-P0-1]` ancient-sources · cloud shift 24. Batch 4: 1 more citation, 149/230
  (64.8%). See ticket note above for the diminishing-returns accounting.
- 2026-08-17 · `[06-P0-2]` curate-buildings (Ephesus) · cloud shift 24. 33 buildings in
  `app/ephesusDescriptions.ts`, the first living-city (not buried-in-79-CE) site to get this
  treatment. See ticket note above.
- 2026-08-17 · SHIFT_BRIEF axis 2 (no board ticket ID — brief axis work, board had no unclaimed
  road-stations ticket) · cloud shift 24. Via Domitia + Via Cottia: 22 new stations in
  `road_stations.geojson` (61 → 83), Italy to the Pyrenees. See commit for the per-station
  identification/confidence accounting.

**Ratio state after this run:** cloud shift 24 ran a complete 1:2:1 cycle — 1 `add`
(`[14-P1-4]` province-pages), 2 `deepen` (`[09-P0-1]` ancient-sources batch 4, `[06-P0-2]`
curate-buildings/Ephesus), 1 `polish` (`[01-P0-1]` selected-marker) — closing out the `add`+`deepen`
debt the prior mac-pass note left open. The open cycle is clean; the next run picks whatever's
topmost and unclaimed. At the time this run ends, the topmost unclaimed P0 tickets are
`[12-P0-1]` merge-themes (`fix`, big — may need splitting per its own note), `[03-P0-1]` schema-v2
(`fix`), and `[03-P0-2]` card-rebuild (`polish`) — no unclaimed P0 `add` exists; the next `add` in
priority order is `[14-P1-4]`'s neighbor tickets in P1/P2 (`[07-P1-4]` governors, `[07-P1-5]`
ordinary-people, `[14-P2-8]` hub-pages) unless a new P0 `add` opens up first. Check the board fresh
— don't assume this note is still current by the time you read it.

- 2026-08-17 · `[05-P0-2]` focus-ring · cloud shift 25. Global `:focus-visible` ring via theme
  tokens; inset `box-shadow` on text inputs to dodge a pill-container clipping bug found while
  screenshotting. See ticket note above.
- 2026-08-17 · `[07-P1-4]` governors · cloud shift 25. 12 sourced provincial governors for 117 CE
  in `public/data/politics.geojson`, well short of the ticket's own ~45 estimate — see ticket
  note above for why that shortfall is itself the finding, not a shortcut.
- 2026-08-17 · `[09-P0-1]` ancient-sources · cloud shift 25. Batch 5: 0 new literary citations
  (149/230, 64.8%, unchanged) but 8 verified CIL inscriptions handed off to `[09-P1-4]`. See
  ticket note above.
- 2026-08-17 · `[06-P0-2]` curate-buildings (Delphi) · cloud shift 25. 34 entries in
  `app/delphiDescriptions.ts`, the first sanctuary (not a city) to get this treatment, and the
  first site keyed by Greek OSM names rather than Italian/English. See ticket note above.

**Ratio state after this run:** cloud shift 25 ran a complete 1:2:1 cycle — 1 `add`
(`[07-P1-4]` governors), 2 `deepen` (`[09-P0-1]` ancient-sources batch 5, `[06-P0-2]`
curate-buildings/Delphi), 1 `polish` (`[05-P0-2]` focus-ring). The open cycle is clean; the next
run picks whatever's topmost and unclaimed. At the time this run ends, the topmost unclaimed P0
tickets are `[12-P0-1]` merge-themes (`fix`, big), `[03-P0-1]` schema-v2 (`fix`), `[03-P0-2]`
card-rebuild (`polish`), `[11-P0-3]` delete-dead-data (`retire`), and `[08-P1-6]` baalbek-dating
(`verify`) — no unclaimed P0 `add` exists; the next `add` in priority order is `[07-P1-5]`
ordinary-people or `[14-P2-8]` hub-pages (both P2) unless a new P0 `add` opens up first.
`[09-P1-4]` epigraphy is worth a look for the next `deepen` slot — see this run's ancient-sources
note for the 8-citation head start waiting there. Check the board fresh — don't assume this note
is still current by the time you read it.

- 2026-08-17 · `[01-P0-4]` search-selects · cloud shift 26. Search now matches the 467 curated
  `pois.geojson` records too; a POI result opens the full card + ringed marker via `selectPoi()`,
  a gazetteer-only result drops the red "What's here?" pin. See ticket note above.
- 2026-08-17 · `[07-P1-5]` ordinary-people · cloud shift 26. 25 named non-elite people
  (`people_117.geojson` 25 → 50): Vindolanda troopers, Karanis-papyri soldiers, the Babatha and
  Salome Komaise Dead Sea archives, Tiberius Claudius Maximus, Marcus Ulpius Phaedimus. New green
  `ordinary` ring + `attested` field. Short of the 30-50 estimate — see ticket note.
- 2026-08-17 · `[09-P1-4]` epigraphy · cloud shift 26. Batch 1: 16 inscriptions merged into
  `pois.geojson`'s `ancient_sources[]` (the 8 shift-25 CIL leads + 8 more verified this shift),
  rendering through the card's "In ancient writing" block. Standing ticket reopened. See note above.
- 2026-08-17 · `[06-P0-2]` curate-buildings (Jerash) · cloud shift 26. 30 entries in
  `app/jerashDescriptions.ts`, the sixth site and the sharpest 117 CE snapshot case yet — 22 of 30
  honestly not-yet-built, including all 14 Byzantine churches. See ticket note above.

**Ratio state after this run:** cloud shift 26 ran a complete 1:2:1 cycle — 1 `add`
(`[07-P1-5]` ordinary-people), 2 `deepen` (`[09-P1-4]` epigraphy batch 1, `[06-P0-2]`
curate-buildings/Jerash), 1 `polish` (`[01-P0-4]` search-selects). The open cycle is clean; the
next run picks whatever's topmost and unclaimed. At the time this run ends, the topmost unclaimed
P0 tickets are `[12-P0-1]` merge-themes (`fix`, big), `[03-P0-1]` schema-v2 (`fix`), `[03-P0-2]`
card-rebuild (`polish`), `[12-FIX-3]` duplicate-pantheon (`retire` — this run's epigraphy research
freshly confirmed the two duplicate pairs it names), `[11-P0-3]` delete-dead-data (`retire`), and
`[08-P1-6]` baalbek-dating (`verify`) — no unclaimed P0 `add` exists; the next `add` in priority
order is `[14-P2-8]` hub-pages (P2). For the next `deepen`, `[09-P1-4]` epigraphy is now a standing
task with a working pipeline — hundreds of curated POIs still carry no inscription, and it renders
with no UI work. Check the board fresh — don't assume this note is still current by the time you
read it.

- 2026-08-17 · `[14-P2-8]` hub-pages · cloud shift 27. Five explainer essays at `/hub/[slug]`
  (roads, army, 117 CE, trade/economy, religion), each paired with a live-pulled slice of data
  already shipped. Two real geometry-shape bugs in `events_117.geojson`/`trade_routes.geojson`
  found and fixed while wiring it. See ticket note above.
- 2026-08-17 · `[09-P1-4]` epigraphy · cloud shift 27. Batch 2: 0 new citations merged — three of
  the four targeted sites had no matching POI to attach a citation to, and Ostia's own surviving
  inscriptions there postdate 117 CE. Three verified, sourced candidates handed off for whoever
  adds the missing POIs. See ticket note above.
- 2026-08-17 · `[06-P0-2]` curate-buildings (Trier) · cloud shift 27. 12 entries in
  `app/trierDescriptions.ts`, the seventh site — pivoted from Timgad (only 7 real named OSM
  features, a stale board claim) to Trier (116 named features, 12 of them genuinely Roman-era
  and researchable, all honestly not-yet-built in 117 CE). See ticket note above.
- 2026-08-17 · `[04-P0-1]` sheet-detents · cloud shift 27. Three-detent mobile bottom sheet
  (peek/half/full), velocity-aware flick. Found and fixed a real, independent bug in the same
  pass — a failed `image_url` load left the drag handle covered and undraggable. See ticket note
  above.

**Ratio state after this run:** cloud shift 27 ran a complete 1:2:1 cycle — 1 `add` (`[14-P2-8]`
hub-pages), 2 `deepen` (`[09-P1-4]` epigraphy batch 2, `[06-P0-2]` curate-buildings/Trier), 1
`polish` (`[04-P0-1]` sheet-detents). The open cycle is clean; the next run picks whatever's
topmost and unclaimed. At the time this run ends, the topmost unclaimed P0 tickets are
`[12-P0-1]` merge-themes (`fix`, big), `[03-P0-1]` schema-v2 (`fix`), `[03-P0-2]` card-rebuild
(`polish`), `[12-FIX-3]` duplicate-pantheon (`retire`), `[11-P0-3]` delete-dead-data (`retire`),
and `[08-P1-6]` baalbek-dating (`verify`) — no unclaimed P0 `add` exists; the next `add` in
priority order is whatever's topmost in P1/P2 once this run's log lands (check fresh). Two notes
worth flagging for whoever picks up next: (1) this run found the board's per-site "named feature
count" claims can go stale — verify a candidate curate-buildings site's actual named-feature
count in its own `_buildings.geojson` before claiming it, don't trust an old shift's log entry;
(2) `[09-P1-4]` epigraphy's remaining pool is increasingly bottlenecked on missing POIs, not on
unverifiable inscriptions — the three candidate citations this run surfaced (Aquileia forum,
Mérida theatre, Timgad forum/gate) are ready to merge the moment those POIs exist, which may be
better framed as a `[06-P2-6]`-adjacent `add` than a further epigraphy research pass. Check the
board fresh — don't assume this note is still current by the time you read it.

- 2026-08-18 · `[08-P2-7]` ancient-lakes · cloud shift 28. 20 named lakes on the natural-landmarks
  layer, `landmarks_117.geojson` 24 → 44. See ticket note above.
- 2026-08-18 · `[10-P0-3]` flagship-depth · cloud shift 28. Batch 2: 24 thinnest descriptions
  (44–53 words) rewritten to ~100–130 words each, worst-first. Thin tail 81 → 57. See ticket note
  above.
- 2026-08-18 · `[09-P1-4]` epigraphy · cloud shift 28. Batch 3: opened the channel batch 2 found
  closed — added the 3 missing POIs, attached the 3 already-verified citations plus 5 more to
  existing famous POIs. `pois.geojson` 467 → 470. See ticket note above.
- 2026-08-18 · `[05-P0-1]` places-in-view-list · cloud shift 28. New accessible,
  keyboard-navigable viewport browse list; desktop FAB, mobile hamburger-menu entry. See ticket
  note above.

**Ratio state after this run:** cloud shift 28 ran a complete 1:2:1 cycle — 1 `add`
(`[08-P2-7]` ancient-lakes), 2 `deepen` (`[10-P0-3]` flagship-depth batch 2, `[09-P1-4]`
epigraphy batch 3), 1 `polish` (`[05-P0-1]` places-in-view-list). Axis 1 (more cities) was
checked again and remains genuinely blocked in this sandbox — this session's own probe confirmed
`overpass-api.de`/`en.wikipedia.org`/`commons.wikimedia.org`/`nominatim.openstreetmap.org` all
return an explicit `connect_rejected` / policy-denial at the proxy level (see
`$HTTPS_PROXY/__agentproxy/status`), so `[06-P2-6]` priority-cities is not pickable from this
environment; WebSearch remains the only working research channel and is what every batch this
run used. The open cycle is clean; the next run picks whatever's topmost and unclaimed. At the
time this run ends, the topmost unclaimed P0 tickets are unchanged from last run —
`[12-P0-1]` merge-themes (`fix`, big), `[03-P0-1]` schema-v2 (`fix`), `[03-P0-2]` card-rebuild
(`polish`, still missing its "eleven-block order" spec — every shift that's looked at this has
deferred it for the same reason), `[12-FIX-3]` duplicate-pantheon (`retire`), `[11-P0-3]`
delete-dead-data (`retire`), and `[08-P1-6]` baalbek-dating (`verify`). The topmost unclaimed
`add` is now `[07-P1-1]` travel-time (P1, an ORBIS-style journey calculator — bigger scope than a
data batch, reads as a real Track B candidate for whoever picks it up with time to spare).
`[09-P1-4]` epigraphy remains a standing task with a working pipeline now that this run cleared
its POI-availability bottleneck — hundreds of curated POIs still carry no inscription. Check the
board fresh — don't assume this note is still current by the time you read it.

- 2026-08-18 · `[02-P1-6]` sea-labels · cloud shift 29. 32 named seas/gulfs/straits, always-on
  cartographic labels (base geography, not a toggle). See ticket note above.
- 2026-08-18 · `[06-P0-2]` curate-buildings (Merida) · cloud shift 29. 10 entries in
  `app/meridaDescriptions.ts`, the eighth site — mostly `extant_117ce:true` for once, since
  Augusta Emerita's core was already built by 117 CE. See ticket note above.
- 2026-08-18 · `[09-P1-4]` epigraphy · cloud shift 29. Batch 4: 6 more POIs cited (Library of
  Celsus, Domus Flavia, Alexandria's Mouseion, the Herculaneum Augustales' hall, Circus
  Flaminius, House of the Vettii). `pois.geojson` 167 → 173 of 470 cited. See ticket note above.
- 2026-08-18 · `[03-P1-4]` nearby-related · cloud shift 29. Six proximity-ranked related-place
  cards on the live panel and every `/place` page, same-category boosted, deduped against
  near-zero-distance duplicates. See ticket note above.
- 2026-08-18 · `[07-P1-1]` travel-time (Directions) · cloud shift 29. Road-network routing —
  real Dijkstra shortest path over a graph built from the existing road data, not a straight
  line. Wired into the right-click menu and place cards, which were both honestly disabled until
  now. See ticket note above.

**Ratio state after this run:** cloud shift 29 ran a complete 1:2:1 cycle — 1 `add`
(`[02-P1-6]` sea-labels), 2 `deepen` (`[06-P0-2]` curate-buildings/Merida, `[09-P1-4]` epigraphy
batch 4), 1 `polish` (`[03-P1-4]` nearby-related) — then used the rest of the shift on
`[07-P1-1]` travel-time, the P1 `add` prior shifts had flagged as "a real Track B candidate for
whoever picks it up with time to spare." Confirmed again this run: Axis 1 (more cities) and
`[06-P2-6]` priority-cities remain genuinely blocked in this sandbox (Overpass, Wikipedia,
Commons, Nominatim, Pleiades, and even LacusCurtius/archli.com all returned an explicit
`EGRESS_BLOCKED`/`connect_rejected` this run — WebSearch is still the only working research
channel). The open cycle is clean; the next run picks whatever's topmost and unclaimed. At the
time this run ends, the topmost unclaimed P0 tickets are unchanged across several runs now —
`[12-P0-1]` merge-themes (`fix`, big), `[03-P0-1]` schema-v2 (`fix`), `[03-P0-2]` card-rebuild
(`polish`, still missing its spec), `[12-FIX-3]` duplicate-pantheon (`retire` — this run's
nearby-related feature independently rediscovered the exact Pantheon/Pantheon-Rome duplicate
while testing, worth prioritizing since it's now visibly surfacing in a second feature), `[11-P0-3]`
delete-dead-data (`retire`), and `[08-P1-6]` baalbek-dating (`verify`). The topmost unclaimed
`add` is now `[09-P2-8]` how-we-know (a public methodology page) or `[06-P2-6]` priority-cities
(blocked, see above) — `[02-P1-6]` sea-labels is now closed. Directions' own two real gaps for
whoever wants them next: sea legs (needs a genuinely different, sailing-season-aware routing
model, no source data for it yet) and multi-stop itineraries. Check the board fresh — don't
assume this note is still current by the time you read it.

- 2026-08-18 · `[10-P0-3]` flagship-depth · cloud shift 30. Batch 3: 26 more thinnest descriptions
  (53-59 words, already sourced) expanded to ~100-130 words each, worst-first. Thin tail 57 → 31.
  See ticket note above.
- 2026-08-18 · `[06-P0-2]` curate-buildings (Palmyra) · cloud shift 30. 12 entries in
  `app/palmyraDescriptions.ts`, the ninth site — Palmyra's monuments split cleanly by century, the
  Temple of Bel/Nabu/Agora already standing in 117 CE, the Tetrapylon/Theatre/Baalshamin/
  Caesareum honestly not yet built. See ticket note above.
- 2026-08-18 · `[09-P2-8]` how-we-know · cloud shift 30. New `/how-we-know` public methodology
  page, every number computed from `pois.geojson` at build time. See ticket note above.
- 2026-08-18 · `[02-P0-2]` coastline · cloud shift 30. Coastline stroke traced along the land
  polygon's edge, above the sea-mask fills. See ticket note above.
- 2026-08-18 · FEATURE_BACKLOG.md "Province overlay" (no board ticket ID — Track B, top unblocked
  P1 feature-backlog item) · cloud shift 30. New `app/useProvincePanel.ts` + `app/ProvincePanel.tsx`
  — click a province at empire/region-level zoom to highlight it and see its governor/legions/
  cities, a pure lens over data `[14-P1-4]` province-pages, `[07-P1-4]` governors, and the legion
  locator already shipped. See FEATURE_BACKLOG.md's own entry for the full note and this run's
  verification caveat (the `[02-P0-4]` self-host-glyphs finding above).

**Ratio state after this run:** cloud shift 30 ran a complete 1:2:1 cycle — 1 `add` (`[09-P2-8]`
how-we-know), 2 `deepen` (`[10-P0-3]` flagship-depth batch 3, `[06-P0-2]` curate-buildings/
Palmyra), 1 `polish` (`[02-P0-2]` coastline) — then used the rest of the shift on Province
overlay, the top unblocked P1 FEATURE_BACKLOG.md item, as Track B. This run's most consequential
finding wasn't a data batch: this sandbox's already-well-documented `demotiles.maplibre.org`
block turns out to gate far more than glyph rendering — `app/Map.tsx`'s entire Phase 2 onward
(everything past the base land/sea/province/coastline layers) sits behind a single
`map.on("load", ...)` callback, and "load" itself never fires when that domain is unreachable, so
no cloud shift in this exact sandbox condition can Playwright-verify anything past Phase 1 by
actually clicking the live map — confirmed by binding the Province-overlay click handler's exact
logic directly to the live map instance (bypassing the load-gate) and firing a real synthetic
click, which resolved correctly. Full ticket note now on `[02-P0-4]` self-host-glyphs, which this
finding promotes from "nice to have" to "actively blocking this sandbox's own test coverage."
Also reconfirmed: Axis 1 (more cities) and `[06-P2-6]` priority-cities remain blocked (Overpass,
Wikipedia, Commons, Nominatim all `connect_rejected`); WebSearch is still the only working
research channel. The open cycle is clean; the next run picks whatever's topmost and unclaimed.
At the time this run ends, the topmost unclaimed P0 tickets are unchanged across many runs now —
`[12-P0-1]` merge-themes (`fix`, big), `[03-P0-1]` schema-v2 (`fix`), `[03-P0-2]` card-rebuild
(`polish`, still missing its spec), `[11-P0-3]` delete-dead-data (`retire`), `[08-P1-6]`
baalbek-dating (`verify`), and `[02-P0-4]` self-host-glyphs (`fix`, sharper case above). No
unclaimed P0 `add` exists; `[06-P2-6]`
priority-cities is the only P2 `add` and remains blocked. `[09-P1-4]` epigraphy and `[09-P0-1]`
ancient-sources both remain standing `deepen` tasks with working pipelines. Check the board fresh
— don't assume this note is still current by the time you read it.

- 2026-08-18 · `[10-P0-3]` flagship-depth · cloud shift 31. Batch 4: all 31 remaining thin fields
  rewritten, clearing the queue to near-zero. Depth 93.4% → 98.9%, thin tail 31 → 5. See ticket
  note above.
- 2026-08-18 · `[06-P0-2]` curate-buildings (Athens) · cloud shift 31. 28 entries in
  `app/athensDescriptions.ts`, the tenth site and the first Panhellenic-scale living city to get
  this treatment. See ticket note above.
- 2026-08-18 · `[02-P0-3]` road-weights · cloud shift 31. Raised road weight/opacity at low zoom;
  added a casing layer under main roads. See ticket note above.
- 2026-08-18 · SHIFT_BRIEF axis 2 (no board ticket ID — brief axis work, board had no unclaimed
  P0/P1 `add`) · cloud shift 31. Via Augusta, the fourth complete road: 51 new stations in
  `road_stations.geojson` (83 → 134), the Pyrenees to Gades via Tarraco, Saguntum, Carthago Nova,
  Castulo, Corduba, and Hispalis. 18 of 51 are honest corridor estimates (confidence:low,
  identified:false) where the Itinerary names a station with no securely excavated modern
  location. Reused the already-shipped road-stations layer, no UI changes.
- 2026-08-18 · FEATURE_BACKLOG.md "Time to travel" (no board ticket ID — Track B, closes a
  standing P2 feature-backlog item) · cloud shift 31. Directions gained a third travel-time
  estimate — imperial courier (cursus publicus, horse relay), 75 km/day sourced to A.M. Ramsay's
  1925 JRS study of the Roman post's real speed — alongside the existing legion/merchant rows.
  Sea legs remain explicitly out of scope, same honesty the existing "no road route found"
  message already practices.

**Ratio state after this run:** cloud shift 31 ran a complete 1:2:1 cycle — 1 `add` (Via Augusta
road stations, axis work since no board `add` ticket was unclaimed), 2 `deepen` (`[10-P0-3]`
flagship-depth batch 4, `[06-P0-2]` curate-buildings/Athens), 1 `polish` (`[02-P0-3]`
road-weights) — then used the rest of the shift on Directions' courier estimate, closing
FEATURE_BACKLOG's "Time to travel" item, as Track B. Confirmed again this run: Axis 1 (more
cities) and `[06-P2-6]` priority-cities remain genuinely blocked in this sandbox
(`overpass-api.de`/`en.wikipedia.org` both `connect_rejected` via a live proxy-status check before
starting) — WebSearch remains the only working research channel, and even WebFetch to primary
sources like LacusCurtius/Pleiades/topostext is blocked for the same reason, confirmed again by
the Via Augusta research pass. This run's own testing surfaced a *new* wrinkle on the
already-documented `[02-P0-4]` sandbox limitation, worth flagging precisely: forcing the gated
`map.on("load", ...)` handler to fire via `map.fire("load")` — the workaround prior shifts (29,
30) used to bypass the block — is itself unreliable here. It sometimes fires the phase-2 handler
twice, throwing `Error: Source "roads-secondary" already exists` and leaving the load chain
partial; it worked cleanly for some checks this run (the coastline/roads screenshot, the Athens
building click) and silently corrupted others (an attempted live Directions context-menu flow
never got a context menu to render). Treat a *successful* forced-load check as good evidence, but
a *failed* one as inconclusive rather than a real product bug — cross-check with a second, simpler
script (a bare `fetch()` of the underlying data file, or `getStyle().layers` for structural
presence) before concluding something is actually broken. The open cycle is clean; the next run
picks whatever's topmost and unclaimed. At the time this run ends, the topmost unclaimed P0
tickets are unchanged across many runs now — `[12-P0-1]` merge-themes (`fix`, big), `[03-P0-1]`
schema-v2 (`fix`), `[03-P0-2]` card-rebuild (`polish`, still missing its spec), `[11-P0-3]`
delete-dead-data (`retire`), `[08-P1-6]` baalbek-dating (`verify`), and `[02-P0-4]`
self-host-glyphs (`fix` — this run's forced-load flakiness finding belongs on this ticket too, see
above). No unclaimed P0/P1 `add` exists; `[06-P2-6]` priority-cities is the only P2 `add` and
remains blocked. `[09-P1-4]` epigraphy and `[09-P0-1]` ancient-sources both remain standing
`deepen` tasks with working pipelines; `[10-P0-3]` flagship-depth is now down to its last 5
entries (58-59 words each) — worth a quick top-up rather than a full batch next time it's picked
up. `[06-P0-2]` curate-buildings has 27 sites left (verify a candidate's actual named-feature
count before claiming — Rome's 289 named features make it the biggest remaining site by far,
worth scoping carefully rather than assuming it's a normal-sized batch). Check the board fresh —
don't assume this note is still current by the time you read it.

- 2026-08-19 · `[10-P0-3]` flagship-depth · cloud shift 33. Batch 5 (closing): the last 5
  sub-60-word fields, one new fact each. Depth 98.9% → **100.0%, thin tail 5 → 0**. See ticket
  note above.
- 2026-08-19 · `[04-P0-2]` long-press · cloud shift 33. Explicit growing-ring hold feedback on the
  existing 550ms mobile touch-hold timer, timed to finish exactly as the menu opens. See ticket
  note above.

**Ratio state after this run:** cloud shift 33 ran 2 `deepen`/`add` axis picks (Via Traiana Nova
road stations, axis 2; the Alexandria/Africa/Sicily grain trade routes, axis 6a — no unclaimed
board `add` ticket existed to claim instead, same situation every recent run has hit) plus 1
`deepen` (`[10-P0-3]` flagship-depth, closed to 100.0%) and 1 `polish` (`[04-P0-2]` long-press,
closed). Network block reconfirmed via direct `curl`: `overpass-api.de`, `en.wikipedia.org`,
`pleiades.stoa.org`, `commons.wikimedia.org` all `CONNECT tunnel failed, response 403` — WebSearch
remains the only working research channel. `[06-P2-6]` priority-cities stays blocked for the same
reason. At the time this run ends, the topmost unclaimed P0 tickets are unchanged from recent
runs — `[12-P0-1]` merge-themes (`fix`, big), `[03-P0-1]` schema-v2 (`fix`), `[03-P0-2]`
card-rebuild (`polish`, still missing its spec), `[02-P0-1]` terrain (`polish`), and `[02-P0-4]`
self-host-glyphs (`fix` — the glyph-PBF generation half still needs an unblocked environment). No
unclaimed P0/P1 `add` exists. One net-new finding worth flagging precisely: a Playwright check
that waits only for `roads-main` to exist and then asserts on layer *visibility* a couple seconds
later will see every thematic layer still `visible` and can misdiagnose invariant 0 as broken —
`applyAllLayers()` sits at the very end of the long sequential load chain and needs the full
15-35s this sandbox takes to settle before visibility reflects the real default-OFF state (see
`FEATURE_BACKLOG.md` for the full note). Check the board fresh — don't assume this note is still
current by the time you read it.
