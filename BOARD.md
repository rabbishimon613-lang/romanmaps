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
- [~] `[12-P0-2]` **`validator`** `fix` — `scripts/validate.mjs` in the pre-push hook: required
      fields, unique ids, coordinate sanity, enum checks, non-empty sources, duplicate detection.
      — claimed by editorial (mac), 2026-08-16 00:40
- [ ] `[11-P0-1]` **`split-site-data`** `polish` — Split `sites_buildings`/`sites_streets`
      per-site, fetch on demand. Removes ~28MB from every cold load.
- [ ] `[11-P0-3]` **`delete-dead-data`** `retire` — Delete `roads_high`, `roads_low`,
      `places_high` (~11MB shipped, never loaded) or wire them into a detail ladder.
- [ ] `[01-P0-1]` **`selected-marker`** `polish` — Selected POI gets an enlarged ringed marker;
      camera offsets by the sheet height so the pin stays visible.
- [ ] `[01-P0-2]` **`camera-memory`** `polish` — Persist and restore the last camera.
- [ ] `[03-P0-2]` **`card-rebuild`** `polish` — Rebuild the place card to the eleven-block
      order; every block hides when empty.
- [ ] `[04-P0-1]` **`sheet-detents`** `polish` — Three-detent bottom sheet (peek/half/full),
      velocity-aware.
- [ ] `[13-P0-2]` **`image-audit`** `illustrate` — Audit all 303 existing images; flag and
      replace any modern photograph showing modern infrastructure. Cotinae is the test case.
- [ ] `[05-P0-1]` **`places-in-view-list`** `polish` — Accessible, keyboard-navigable list of
      places in the current viewport; doubles as the browse UI.
- [ ] `[10-P0-1]` **`tours`** `add` — Guided-tour format + player + first three tours
      (Via Appia · A day in Ostia · What was new in 117).
- [ ] `[14-P0-2]` **`place-pages`** `add` — `/place/[slug]` for every POI, server-rendered.
- [ ] `[02-P0-1]` **`terrain`** `polish` — Hillshade/relief under the land fill.
- [ ] `[02-P0-4]` **`self-host-glyphs`** `fix` — Stop depending on `demotiles.maplibre.org`;
      a single point of failure that would erase every label on the map.
- [~] `[09-P0-1]` **`ancient-sources`** `deepen` — `ancient_sources[]` populated for every
      `confidence: high` POI. **Standing task — never "done", always available.**
      — claimed by editorial (mac), 2026-08-16 00:40
- [ ] `[06-P0-2]` **`curate-buildings`** `deepen` — Ostia-depth curated descriptions for the
      other 39 sites, ~10 buildings/day. **Standing task.**
- [ ] `[14-P0-1]` **`gsc-verify`** `fix` — ⚠️ **BLOCKED ON PEDRO.** Verify `romanmaps.org` in
      Google Search Console. Nothing about this property is measured until this is done. Check
      which Google account holds the token first.

## P1

- [ ] `[07-P1-1]` **`travel-time`** `add` — ORBIS-style journey calculator over the existing
      road + sea network. Highest-impact single feature in the backlog.
- [ ] `[07-P0-2]` **`category-life-writing`** `deepen` — One 120-word present-tense "what
      happened here" paragraph per POI category (~20 pieces covering 448 places).
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
- [ ] `[14-P1-4]` **`province-pages`** `add` — ~45 province pages.
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
- [ ] `[15-P1-4]` **`metrics`** `polish` — `METRICS.md`: depth %, coverage, LCP, validator
      warnings, recorded daily.

---

## Done

*(Routine appends here: date · ticket · one-line result.)*

- 2026-08-15 · `[pre-board]` · Layer defaults cut from 29-on to base-5; chrome theme tokens;
  phone layout rebuilt to the Maps shape. Invariant 0 added to the shift brief.
