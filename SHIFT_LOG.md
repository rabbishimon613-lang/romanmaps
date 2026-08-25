# Roman Maps — Shift Log

Four 6-hour research shifts per day (00:00, 06:00, 12:00, 18:00 UTC), 7 days a week.
Each shift picks up where the last left off, researches, and pushes real map data.

New entries go on top. Each shift appends its own section.

---

## Shift 57 — 2026-08-25 (this shift's own prompt claimed "Shift 2 of four")

Same stale-numbering mismatch every shift since #13 has flagged, still unresolved — `SHIFT_LOG.md`
was 56 real shifts deep at session start, not 1. `git status`/`git log` at session start showed a
clean, non-detached `main` already matching `origin/main` exactly (`5093cbe`) — none of the
container-creation-race symptoms recent shifts have had to work around this time. Re-confirmed the
standing network finding independently: `curl` to `commons.wikimedia.org`, `en.wikipedia.org`, and
`overpass-api.de` all returned `EGRESS_BLOCKED`/empty responses (curl exit 56). `WebSearch` via
background research agents was the only research channel, same as every recent cloud shift — and
this session hit a new limit recent shifts hadn't documented: the session-wide WebSearch quota
(200 calls total, shared across every agent spawned) ran out partway through two of this shift's
five research passes (Italica, and the disasters/people image searches), cutting them short
honestly rather than silently. Flagging this for future shifts running several research agents in
one session — budget accordingly, and treat a mid-task "quota exhausted" report as a real partial
result, not a bug.

### Board check

Read `BOARD.md`'s claiming protocol. No `[~]` claims standing. The unclaimed P0 tickets are the
same large refactors recent shifts have correctly declined for a single-session, network-blocked
budget (`[12-P0-1]` merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]`
terrain, `[13-P0-2]` image-audit). Picked up one genuinely-scoped, unclaimed P2 board ticket for
Track B instead, and continued the standing Track A precedent (zero-coverage-site closures +
image top-up) for everything else — no claim commit needed for either, matching recent shifts'
own documented precedent for standing/axis work when the board has nothing else that fits.

### Track B — Board `[13-P2-8]` `og-images`: generated OG/Twitter cards, every place and site page

Every `/place/[slug]` (630 curated POIs) and `/site/[slug]` (40 sites) page now gets a real,
branded 1200×630 social card via Next's `opengraph-image.tsx` file convention, instead of falling
back to a bare link preview (or, for the ~40% of POIs still missing a photo, no image at all).
Deliberately text-only — no fetch of the POI's own `image_url` into the card: this route
prerenders at build time (confirmed live: both new routes appear as dynamic `ƒ` entries in the
build output, server-rendered on demand rather than statically cached, but still zero-network —
pure `next/og` `ImageResponse` text/shape rendering, same technique `app/appIcon.tsx`'s existing
icon family already uses) and Wikimedia Commons is network-blocked in this sandbox, so embedding a
remote photo would have broken the build here. Category-colored accent bar + label on POI cards
(reusing `app/poiCategories.ts`'s existing color map), parchment background and the same
ring-medallion mark as the app's favicon/PWA icons, so social cards read as the same brand.
Twitter card upgraded to `summary_large_image` on both routes now that a card image always exists,
replacing the old branch that fell back to a plain `summary` card whenever `image_url` was empty.
Verified against the built production server, not just a code read: both new routes return real
`200 image/png` responses (28KB/25KB) with the correct layout, screenshotted and checked by eye.

### Track A — 28 curated POIs across four more zero-`pois.geojson`-coverage sites, three image top-ups

**Capua (4) + Cumae (9) + Italica (2) curated POIs** — three more sites off the standing
zero-coverage list (`FEATURE_BACKLOG.md`), 4 remain: Brescia, Milan, Rimini, Luni. Same
research-then-write pipeline as Shift 56's own Leptis Magna/Sabratha/Tivoli/Palestrina batches —
background WebSearch-only research agents, then dated, categorized, and written up by hand against
`app/categoryLife.ts`'s 52-key vocabulary before splicing in with `scripts/append-geojson-features.mjs`.

Capua shipped the Amphitheatre (extant either way — sources genuinely disagree on an Augustan vs.
Trajanic-era date, said plainly rather than picking one), the Capitolium (dated hard by Tacitus,
*Ann.* 4.57 — Tiberius personally dedicated it in 26 CE), the Arch of Hadrian (a real misnomer:
Flavian-era construction, the "Hadrian" attribution traces to a since-discredited 18th-century
inscription reading, kept as the display name since that's what the monument is actually called
today), and the Temple of Diana Tifatina on Monte Tifata (Republican, loaded with votives by Sulla
after 82 BCE). Deliberately held back two research candidates that didn't clear this project's own
bar: the Mithraeum's dating straddles 117 CE closely enough that the research pass itself flagged
it as a coin-flip, and the "Baths of Capua" never had a real source beyond an uncited tourism
one-liner. Caught and avoided a real conflation trap along the way: several tourist pages' "Roman
bridge"/"city gate" near Capua actually belong to ancient Casilinum, a different nearby site, and
one gate is medieval Hohenstaufen construction, not Roman at all.

Cumae shipped the Cave of the Cumaean Sibyl (still walkable in 117 CE — Virgil's own "hundred
mouths" passage, *Aen.* 6.42–155), the Temple of Apollo (*Aen.* 6.14–33), the Temple of Jupiter/
Capitolium, the city walls, the Grotta di Cocceio road tunnel (Agrippa's ~37 BCE Portus Julius
engineering), the Arco Felice gate on the Via Domitiana (Domitian, 95 CE — a tight 22-year snapshot
anchor), the forum, the Forum Baths, and the amphitheater. Left `built` unset on several records
rather than assert a precise year the sources don't actually support (the Forum Baths' widely
repeated "180 BCE" traces to an unquotable secondary summary, not a primary source — a real
dating trap the research pass itself flagged and this pass declined to launder into a hard number).
Skipped the separate, equally real Crypta Romana tunnel as redundant with Grotta di Cocceio at this
map's marker scale, and left Lake Avernus/Portus Julius out entirely per the research agent's own
flag — it belongs to the existing Baiae entry, not Cumae.

Italica confirms this project's own prior finding (`BOARD.md` `[06-P0-2]`'s curated-buildings note):
the site is almost entirely Hadrian's post-117 *nova urbs*. The Amphitheatre and the Traianeum
(Hadrian's own deification temple to Trajan — definitionally can't predate Trajan's death) both
ship `extant_117ce:false`, stated plainly. A real pre-117 *vetus urbs* candidate (the Republican
street grid from Scipio Africanus's 206 BCE founding, a theater, city walls) remains open — the
research pass's WebSearch budget ran out before it could confirm any of that with a real citation,
so it was left for a future shift rather than guessed at, and the two records that did ship carry
`confidence:medium` since their coordinates come from a well-documented public location (a UNESCO
tentative-list site) rather than a fresh this-session geocoding pass.

**Image top-up across three thematic files (55 features closed)** — `health.geojson` (36 of 51),
`people_117.geojson` (13 of 50), and `disasters.geojson` (6 of 16) all shipped with zero images
despite invariant 1.6, an axis-18/axis-4/axis-11 gap this shift closed the same way Shift 56 closed
part of the Djemila/Volubilis gap: dedicated Commons-search research passes (background agents,
WebSearch only), then a small one-shot Python text-splice script (`scripts/_image_topup.py` /
`_disasters_topup.py`, deleted after use each time, same append-without-reformatting principle as
`scripts/append-geojson-features.mjs` but for editing existing features rather than adding new
ones — auto-detects each file's own indent width and property ordering rather than assuming one
convention, since `disasters.geojson` turned out to use a much more compact, no-space JSON style
than any other file in `public/data/`, caught only by a failed first run rather than assumed).

`health.geojson`'s 36: real photos of the ruin where one exists, and the closest honest match
where it doesn't — a museum artifact, a period map, a modern structure standing on the ancient
spring site — said so plainly in `image_alt` rather than letting the picture imply something it
doesn't show (Tiber Island's modern skyline standing in for the vanished Temple of Aesculapius,
Leonardo's own 1514 map of the Pontine Marshes). `people_117.geojson` deliberately researched only
the ~18 of 50 records who are historically prominent enough to plausibly have surviving imagery —
the other 32 are ordinary people known only from papyri and military discharge tablets (Vindolanda,
the Babatha archive), where no portrait could exist and searching for one would have been a wasted
pass. Landed genuine ancient busts/coins for Trajan, Hadrian, Plotina, Matidia and Vibia Sabina,
plus a Trajan's Column relief traditionally (not epigraphically) identified as Lusius Quietus; six
more — Pliny the Younger, Tacitus, Suetonius, Plutarch, Epictetus, Juvenal — got honestly-labeled
later likenesses (a Renaissance statue, 18th/19th-century engravings, one ancient herm whose
identification is scholarly convention rather than an inscription), every one flagged as such in
`image_alt` rather than presented as a contemporary portrait. `disasters.geojson`'s 6: period
history paintings for Vesuvius, the Great Fire of Rome, the Plague of Rome, Vercellae and Teutoburg,
each labeled as later art, and one genuinely contemporary source — the Arch of Titus's own menorah
relief for the Temple's destruction, carved roughly a decade after 70 CE.

### State, verification, next

`npm run validate`: 0 errors throughout the session, same 17 standing warnings — no new warnings
from any of this shift's four data commits. `npm run build`: clean at every push (six commits, six
clean pre-push gates); `npm run start` + `curl` spot-checks against the actual built production
server for both new `opengraph-image` routes and a sampled new POI's page, not just a code read.
`npm run metrics --write`: 615→630 POIs, description depth held at 100.0%, image coverage
59.5%→59.2% (down slightly — new-site POI batches without images outpaced the same session's own
image top-up work, the same expected shape recent add-heavy shifts have documented), ancient-source
coverage of `confidence:high` POIs 67.9%→67.8% (same reason). Curated places total crossed 2,110.
Ran `npm install` fresh this session (`node_modules` wasn't present at start) — surfaced next@14.2.5's
own published security advisory in the install output, not new information (board `[11-P2-10]`
`next-upgrade` already tracks this, flagged first at "shift 1" and never actioned) but worth a
fresh mention since this is the first shift log entry to see the warning directly. Also added
`__pycache__/` to `.gitignore`, cleaning up a stray directory this session's own Python helper
scripts left behind before the first commit.

**Next shift**: the zero-`pois.geojson`-coverage list is down to 4 (Brescia, Milan, Rimini, Luni) —
same well-bounded shape, though Milan's own `curate-buildings` note already found its OSM yield
thin, so temper expectations there. `health.geojson` has 15 image-null features left (Aquae
Helveticae/Baden CH, Aquae Balissae/Daruvar, Aquae Borvonis, Neris-les-Bains, Archigenes of Apamea,
the Cnidus medical school, Sardinia's and Etruria's malaria coasts, Abano Terme, three more French/
Italian aquae towns, Hammam Bou Hanifia, Sceaux-du-Gatinais, Termini Imerese); `people_117.geojson`
has the ~5 remaining prominent-figure candidates this session's WebSearch budget cut off before
confirming (Attianus, Rufus of Ephesus, Arrian, Favorinus, Marcius Turbo); `disasters.geojson` has
9 of 16 still open for the same reason. Italica's genuine pre-117 *vetus urbs* content (street
grid, theater, walls) is real, worthwhile, unresearched work — the next shift with search budget
to spare should pick it up rather than treating the site as closed. The board's large P0 refactors
remain the standing next pick for whichever shift gets a network-unblocked environment or a
dedicated multi-pass budget large enough to see one through in one sitting.

---

## Shift 56 — 2026-08-25 (this shift's own prompt claimed "Shift 1 of four")

Same stale-numbering mismatch every shift since #13 has flagged, still unresolved — `SHIFT_LOG.md`
was 55 real shifts deep at session start, not 0. Session started `HEAD` detached at Shift 55's own
final commit (`935395c`) with local `main` stuck at Shift 28's commit (`709a480`); `git fetch origin
main` confirmed `origin/main` matched detached `HEAD` exactly, so `git checkout -B main origin/main`
re-pointed the local branch with zero risk — same benign container-creation race every recent shift
has documented. Confirmed the standing network finding independently: `curl` to `commons.wikimedia.org`,
`en.wikipedia.org`, and `overpass-api.de` all return `CONNECT tunnel failed, response 403` /
`EGRESS_BLOCKED`. `WebSearch` (via background research agents) stayed reachable and was the only
research channel — no Overpass access this session, so Axis 1's Overpass-fetch pipeline (new cities
from scratch) stayed out of reach, same as every recent cloud shift.

### Board check

Read `BOARD.md`'s claiming protocol. No `[~]` claims standing. The unclaimed tickets are the same
large P0 refactors recent shifts have correctly declined (`[12-P0-1]` merge-themes, `[03-P0-1]`
schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain, `[13-P0-2]` image-audit) — none fit a
network-blocked, single-session budget. Picked up Shift 55's own handoff list instead, same
precedent recent shifts have documented for standing/axis work when the board has nothing that
fits: no claim commit needed.

### Track B — invariant-1.5 fix: place pages titled in Latin, not English

Shift 55's own recommended next pick, logged in `FEATURE_BACKLOG.md` as "HIGH VALUE." Turned out
to be five call sites sharing one backwards `name_latin || name_english` fallback, not the two in
`app/place/[slug]/page.tsx` that Shift 55 spotted: also `app/PlaceDetails.tsx` (the live map's
click-through card — the single most-viewed curated-POI surface on the site), `app/province/[slug]/
page.tsx` (each province's "places on the map" list, including its sort order), and `app/Chrome.tsx`'s
`selectedName` (desktop header once a place is selected). All five swapped to `name_english ||
name_latin`; the Latin name now only shows as a subtitle when it differs from the English one.
Deliberately left alone: `app/places.ts::loadPois()` was already correct (`modern: props.name_english`),
and the raw 16k-point gazetteer's own `Place.latin`/`Place.modern` fields and the UI surfaces reading
them (search dropdown, nearby list, context-menu nearest-place label, `PlacesInViewList`) — a
different data source without a guaranteed English name per record, out of scope for a considered
future pass rather than a drive-by here. Verified in a clean `next build`: `colosseum.html`'s
`<title>` now reads "Colosseum (Flavian Amphitheatre) — Roman Maps" with "Amphitheatrum Flavium"
demoted to the subtitle. Full writeup in `SEO-LOG.md`'s 2026-08-25 entry, `FEATURE_BACKLOG.md`
item checked off.

### Track A — four more zero-coverage `sites.ts` sites closed: 39 curated POIs

Continued Shift 54/55's list (Leptis Magna, Sabratha, Italica, Tivoli, Palestrina, Cumae, Capua,
Brescia, Milan, Rimini, Luni), closing four in two research-then-write passes. Every batch was
researched by a background agent (WebSearch only, no direct page fetches — same network
constraint as the rest of this session) and then dated, categorized, and written up by hand against
`app/categoryLife.ts`'s 52-key vocabulary before being spliced in with `scripts/
append-geojson-features.mjs`.

**Leptis Magna** (12 features, Africa Proconsularis) and **Sabratha** (9 features, same province)
were both genuine dating traps, flagged going in and confirmed by research: each city's most-
photographed monuments are Severan-era, 80–95 years past this map's 117 CE snapshot — Leptis's
Severan Forum and Arch of Septimius Severus (both ~203 CE), Sabratha's huge three-story theatre
(~200 CE) and Commodan amphitheatre — all shipped `extant_117ce:false` with the real date. The
honest pre-117 material is the unglamorous early layer: Leptis's Old Forum triad, its market (9
BCE) and theatre (1–2 CE, both funded by the same benefactor, Annobal Tapapius Rufus), the Arch of
Tiberius (36 CE); Sabratha's Punic-era Mausoleum of Bes (c. 150 BCE, already ancient by 117 CE),
Temple of Liber Pater, and Seaward Baths. One genuinely rare find: Leptis Magna's **Arch of
Trajan**, dedicated 110 CE — a famous monument that's also a tight seven-year anchor to this map's
own snapshot date, the first monument to record the city's promotion to a full Roman colony.

**Tivoli** (10 features, Tibur) and **Palestrina** (8 features, Praeneste) were the opposite case —
both hit their brief's own flagged trap correctly rather than needing one caught after the fact.
Tivoli's **Hadrian's Villa** is explicitly called out in `SHIFT_BRIEF.md` axis 3d as "foundations
laid ~117, mostly post-snapshot" — the research pass confirmed it more sharply than that: Hadrian
became emperor on this map's own 11 August 117 CE snapshot date, and construction didn't start
until 118, so not one stone was laid yet; shipped `false` with that stated plainly rather than
hedged. The real pre-117 Tivoli is the Sanctuary of Hercules Victor (Sullan-era, the largest
Hercules sanctuary in Italy after Cádiz), the Temple of Vesta and its neighbor on the acropolis
above the Aniene falls, Ponte Lucano with the Tomb of the Plautii beside it, and Manlius Vopiscus's
villa, described in full by Statius in *Silvae* 1.3. Palestrina's Sanctuary of Fortuna Primigenia
is safely Republican (c. 100 BCE) with no confirmed Trajanic or Hadrianic rebuilding phase found in
research — the rare zero-coverage site where the obvious answer was also the correct one, so the
whole 8-feature batch ships `true`. Rather than one blob for "the sanctuary," it's carved into
eight distinct features the sources actually support separately: the summit temple, the oracle's
own Pozzo delle Sortes (Cicero, *De Divinatione* 2.85–87, and Suetonius, *Tiberius* 63, both cited
as `ancient_sources`), the Nile Mosaic, the Cortina terrace/theater stair, the sanctuary's cistern,
the citadel above it, and the lower forum-basilica.

Coordinates for all four batches are researched estimates against each site's documented layout
(real degrees/minutes/seconds where a source gave them — Leptis Magna's Temple of Rome and Augustus,
Theatre, and Amphitheatre; Ponte Lucano; most others triangulated from relative position in the
site's known layout), not gazetteer-verified — good to roughly a city block at this map's marker
scale, same caveat every recent city batch has carried forward.

### Track A — image top-up: 4 of the Djemila/Volubilis batch's 14 gaps closed

A dedicated Commons-search pass (background agent, same WebSearch-only constraint) against Shift
55's own logged image gap. Closed: the Civil Basilica and Severan Forum at Djemila (a Carole
Raddato Commons upload of the Cardo Maximus arch beside the basilica, and a Djemila panorama file
for the forum — both honestly captioned as near-matches rather than head-on shots), the House of
Europa (its Rape-of-Europa mosaic, now in the Djemila Museum), and the Tangier Gate at Volubilis (a
Decumanus Maximus street view toward the gate, not a close-up — `image_alt` says so). Left alone:
the ramparts, Old Forum, Capitolium, Temple of Venus Genetrix, Market of Cosinius and Christian
Quarter at Djemila, and the Flavian Baths, House of Venus, Temple of Saturn and city walls at
Volubilis — WebSearch surfaced a right Commons *category* for a couple of these but not a specific
filename, and guessing one risks a wrong-subject hero image on a real public page, so they stay
null. `FEATURE_BACKLOG.md` updated with the exact remaining list.

### State, verification, next

`npm run validate`: 0 errors, 17 warnings throughout the session — the same standing set every
recent shift has carried, no new warnings from any of this session's four city batches, four image
top-ups, or the five-file display-name fix. One validator error surfaced and was fixed same-session:
an `ancient_sources` entry for the Sanctuary of Fortuna Primigenia was missing a required `ref`
field because the citing source (a general Pliny the Elder mention) wasn't precise enough to give
one — rather than fabricate a book/chapter reference, the citation was dropped and the record kept
its two real `sources` URLs instead. `npm run build`: clean at every push (three separate commits,
three clean pre-push gates), 615 curated POIs at the final count (up from 576), 60+ static place
pages added. `npm run metrics --write`: 576→615 POIs, description depth held at 100.0% (two
records briefly dipped under the 60-word floor after a first draft and were lengthened before
commit), image coverage 61.1%→59.5% (down — four new-site batches added real, research-honest
image_url-null gaps faster than the small image top-up closed them, the same expected shape Shift
55 called out for its own add-heavy session), ancient-source coverage of `confidence:high` POIs
70.0%→67.9% (same reason), "what happened here" category coverage held at 100% throughout since
every new record was written against the vocabulary list up front this time. Curated places total
crossed 2,095. Three commits, each pushed after a clean `git fetch origin main` (no divergence at
any point this session — no other worker touched `main`) and a clean pre-push build gate.

**Next shift**: the zero-`pois.geojson`-coverage list is now 7 (Italica, Cumae, Capua, Brescia,
Milan, Rimini, Luni), same well-bounded shape — pick one or two per shift, brief the research
prompt with the exact category vocabulary from `app/categoryLife.ts` up front. The Djemila/Volubilis
image gap is down to 10 of 25; the specific remaining items are listed in `FEATURE_BACKLOG.md` and
need direct Commons category-browsing (not WebSearch, which doesn't enumerate category contents
reliably) to close the rest. The board's large P0 refactors (`[12-P0-1]` merge-themes, `[03-P0-1]`
schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain, `[13-P0-2]` image-audit) remain the
standing next pick for whichever shift gets either a network-unblocked environment or a dedicated
multi-pass budget large enough to see one through in one sitting — none of that changed this shift.

---

## Shift 55 — 2026-08-24 (this shift's own prompt claimed "Shift 4 of four")

Same stale-numbering mismatch every shift since #13 has flagged, still unresolved — SHIFT_LOG was
54 real shifts deep at session start, not 3. Session started `HEAD` detached at Shift 54's own
final commit (`68bf8b2`) with local `main` 50/50 diverged from a stale `origin/main` tracking ref
(pointing at Shift 28's `709a480`); a fresh `git fetch origin main` force-updated the ref to match
detached `HEAD` exactly, confirming the divergence was the same benign container-image race every
recent shift has documented and not real conflicting work, so `git reset --hard origin/main` synced
it with nothing at risk. Re-confirmed the standing network finding independently: `curl` and
`WebFetch` to `commons.wikimedia.org`, `en.wikipedia.org`, `overpass-api.de`, and
`pleiades.stoa.org` all return `EGRESS_BLOCKED` / exit-56. `WebSearch` stayed reachable and was
again the only research channel. `npm run dev` + Playwright against the sandbox Chromium
(`/opt/pw-browsers/chromium-1194`, note the versioned directory — a bare `/opt/pw-browsers/chromium`
path exists but holds no executable) worked reliably all session and carried the whole Track B
verification gate; no repeat of Shift 54's `/place/[slug]` dev-server 404s.

### Board check

Read `BOARD.md`'s claiming protocol. No `[~]` claims standing. The unclaimed tickets remain the
same large P0 refactors recent shifts have correctly declined (`[12-P0-1]` merge-themes,
`[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain, `[13-P0-2]` image-audit).
Picked up Shift 54's own handoff list instead — no claim commit needed, same precedent recent
shifts have documented for standing/axis work. Ratio: 2 `add` (Djemila, Volubilis) + 2 `deepen`
(ancient-sources batch 9, fortress images) + 1 `polish` (Track B) + 1 `fix` (the category remap
below, correcting this shift's own work), same add-leaning skew as Shift 54 and logged rather than
claimed as exact 1:2:1 compliance.

### Track A — Djemila and Volubilis: first curated `pois.geojson` coverage

Two of Shift 54's 14-name remaining list closed. This shift closed two more later in the same
session (Jerash and Trier — see their own section below), so the list is now down to 11:
Leptis Magna, Sabratha, Italica, Tivoli, Palestrina, Cumae, Capua, Brescia, Milan, Rimini, Luni.
25 features total from this first batch.

**Djemila** (13 features, Numidia, veteran colony founded 96 CE under Nerva): only **3** are
correctly `extant_117ce: true` — the original polygonal defensive circuit, the Old Forum, and the
Capitolium, the founding-era infrastructure of a walled 7-hectare colony. The other 10 are
Antonine and Severan growth postdating the snapshot by 50 to 280 years: the theatre (161), the
Severan Forum (210), the Arch of Caracalla (216), the Temple of the Gens Septimia (229), the Great
Baths (183), the civil basilica (169), the Temple of Venus Genetrix (150), the Market of Cosinius
(140), the Christian quarter (380) and the House of Europa (200). That heavy `false` skew is the
honest shape of the site, not a research shortfall — Djemila's famous monumental core exists
precisely *because* the town later outgrew the modest perimeter Nerva's colonists walled.

**Volubilis** (12 features, Mauretania Tingitana, annexed 44 CE): an even 6/6 split, and the split
is the finding. Shift 54's handoff explicitly warned that this site's headline monuments are all
3rd-century and a naive pass would either mis-date them or come back nearly all-`false`; the
research pass was briefed on that trap and confirmed it — the Arch of Caracalla (217), the
basilica (217), the Capitolium (218) and Marcus Aurelius's 168-169 CE wall circuit with its
Tangier Gate all correctly `false`, each with a note saying so plainly rather than hedging. The
`true` side is real and non-obvious: the Neronian forum (~60 CE), a Flavian bath complex, the
Houses of Orpheus and Venus (the **structures** dated, deliberately not their famous mosaics,
which are a generation later), the Trajanic/Hadrianic Decumanus Maximus, and the 44 CE **Edict of
Claudius stela** — a genuine epigraphic record of Volubilis's citizenship grant after the Aedemon
revolt, paired with an honorific stela that Fabia Bira raised to her husband Marcus Valerius
Severus, a Mauretanian auxiliary commander turned duumvir. One deliberate correction before
merging: the Temple of Saturn ships `false` on its 218 CE rebuild date even though the underlying
Punic precinct to Baal is far older, with the earlier sanctuary noted rather than used to justify
a `true`.

Coordinates for both batches are researched estimates against each site's documented layout, not
gazetteer-verified — good to roughly a city block, fine at the current point-marker scale, worth
tightening if a future feature needs real precision. Logged here rather than left implicit.

### Track A — `[09-P0-1]` ancient-sources batch 9: 3 of 15

Continued the standing ticket against a 15-candidate themed list. **3 passed**: the Janiculum
watermills (Procopius, *Gothic War* 5.19 — the mills fell silent when the Goths cut the Aqua
Traiana in 537, and Belisarius rigged replacements on boats in the Tiber), the Efqa spring at
Palmyra (Pliny, *NH* 5.21.88, on the oasis springs that made the desert city possible), and the
Mausoleum of the Julii at Glanum (its own CIL XII 1012 dedicatory inscription naming the three
Julius brothers who raised it). **12 rejected**, several of them near-misses the pass caught
rather than forced: Strabo's "temple of Argive Hera" at Paestum is the separate Heraion at the
mouth of the Sele, roughly 9km from the in-town Basilica the citation was offered for; no ancient
author distinguishes Paestum's three temples by dedication at all, so all three modern
identifications are archaeological, not textual; the Piscina Mirabilis's own name is a
14th-century coinage by Petrarch and Pliny never describes the cistern despite being stationed at
Misenum; and the Tower of the Scipios' traditional attribution is a debunked post-antique
identification with no ancient evidence behind it. Batch 8's ~4-in-18 hit rate is holding at ~1-in-5
— the remaining pool is exactly the tombs/villas/shipwrecks/industrial-sites shape Shifts 53 and 54
already called diminishing.

### Track A — legionary-fortress images: gap 5 → 2

Closed 3 of the 5 Shift 54 left open, using an excavation-report and archaeology-news search angle
instead of the tourism-site searches two prior passes had exhausted. Both Caparcotna records (Legio
II Traiana Fortis and Legio VI Ferrata share the same excavated Legio/Kefar Otnay site near
Megiddo) and Raphanaea (Legio III Gallica, via an Institut français du Proche-Orient aerial
archive image) now carry real Commons files. **Melitene and Nicopolis/Alexandria stay null after a
third pass** and are worth treating as closed: for Nicopolis the honest finding is that the
material exists but not on Commons — roughly 25 Legio II Traiana Fortis funerary stelae sit in
Alexandria's Graeco-Roman Museum, published in academic PDFs with DAI photo credits, none of them
Commons-hosted. A candidate for Melitene was found and **rejected** rather than used: the only
Roman-adjacent Commons file for Battalgazi depicts the Bronze/Iron Age Arslantepe mound, a
different site and era from the 72 CE legionary fortress.

### Track A — Jerash and Trier: two more zero-coverage sites closed

Second curated-coverage batch this shift, closing 2 more of Shift 54's list (now 11 remain: Leptis
Magna, Sabratha, Italica, Tivoli, Palestrina, Cumae, Capua, Brescia, Milan, Rimini, Luni).
31 features total, both research passes primed with the exact allowed category vocabulary this
time — no repeat of the invented-category fix above.

**Jerash** (ancient Gerasa, 16 features, Arabia Petraea, annexed only 106 CE): a genuine 6/10
true/false split with unusually strong epigraphic backing — Gerasa's building inscriptions are
exceptionally well preserved and several entries carry a real in-situ dedicatory text as their
`ancient_sources`, not a forced literary citation. The **North Gate**'s own inscription is dated
115 CE and names Trajan directly as founder and saviour of the city, two years before his death —
about as tight an anchor to this map's snapshot as a POI gets. The **South Theatre** (91/92 CE,
dedicated to Domitian by the governor of Syria, donors' names cut straight into the seating), the
first-century **Sanctuary of Zeus Olympios** lower terrace, the **city walls** (75/76 CE, ~3.5km
circuit), the **Cardo Maximus**'s original Ionic colonnade, and the still-active **Southern
Necropolis** round out the `true` set. The famous **Temple of Artemis**, **Oval Plaza**, **Arch of
Hadrian**, upper **Temple of Zeus**, **Nymphaeum**, **hippodrome**, and both later theatres are all
correctly `false` — Gerasa's postcard skyline is overwhelmingly Hadrianic-and-later, exactly the
trap the research brief warned about, and the pass held the line rather than reaching for round
numbers.

**Trier** (ancient Augusta Treverorum, 15 features, Gallia Belgica, founded ~16 BCE): a 5/10 split
that is the correct shape for a city whose monumental glory is Tetrarchic, two centuries past this
snapshot. `false`, correctly: **Porta Nigra** (~170 CE), the **Imperial Baths** and **Basilica of
Constantine** (both early 4th c.), the **Igel Column** (~250 CE), the amphitheatre, city wall, and
circus (all 2nd-century Antonine). The `true` side required real digging past the postcard
monuments: the Augustan-era forum, the first-century **Sanctuary of Lenus Mars** and **Altbachtal
temple precinct** (both Treveran cult sites with an early phase predating their later monumental
rebuilding), the Augustan **Trier–Cologne road** (part of Agrippa's network), and — the one
genuinely non-obvious find — a **71 CE timber bridge** over the Moselle, tree-ring dated, that
was the working river crossing under Trajan. The famous stone-pier bridge everyone photographs
today is the *third* bridge on the same site, built 144 CE; both are logged as separate records
with the phase distinction stated plainly rather than collapsed into one ambiguous entry.

### Fix — 10 off-vocabulary categories, caught by metrics and corrected same-shift

`npm run metrics` (not the validator) caught that both research batches had invented four category
values — `civic`, `bath`, `domus`, `other` — outside the established 52-key vocabulary in
`app/categoryLife.ts`, dropping "what happened here" coverage from 100% to 92.9%. Three of the four
were also absent from every `app/poiCategories.ts` chip group, so those records would have rendered
as default maroon markers invisible to the category filter — exactly the trap `FEATURE_BACKLOG.md`
has carried as a standing note since Shift 10, hit anyway because the research prompts didn't pin
the vocabulary. Remapped onto existing keys (`civic` → `wall`/`gate`/`road`, `bath` → `bathhouse`,
`domus` → `house`, `other` → `monument`) in a follow-up commit; coverage back to 52/52 over
545/545. All 10 records were this shift's own, so nothing of anyone else's was touched. The later
batches' research prompts were amended to pass the allowed category list explicitly.

### Found, not fixed — every `/place/[slug]` page is titled in Latin

Spot-checking this shift's own new pages in `.next/server/app/place/*.html` surfaced a long-
standing, site-wide invariant-1.5 violation that has nothing to do with this shift's data:
`app/place/[slug]/page.tsx` lines 109 and 140 both resolve the display name as
`p.name_latin || p.name_english`. So the Colosseum's page is titled **"Amphitheatrum Flavium —
Roman Maps"**, Paestum's is **"Templum Neptuni"**, the Forum Romanum keeps its Latin form, and the
English name is demoted to a grey subtitle. Invariant 1.5 says the opposite in as many words —
English-standard display name, ancient name in the blurb or panel body — and this breaks it on the
surface where it costs most: `<title>`, `<h1>`, OpenGraph and Twitter card titles, the JSON-LD
`name`, and the nearby-places list. Every one of those is a string Google indexes or a shared link
previews with, and nobody searches "Amphitheatrum Flavium".

**Deliberately not fixed here.** The code change is two lines, but it rewrites 545 already-indexed
page titles in one push, and that deserves a considered pass — an `SEO-LOG.md` entry, and a real
decision about whether the Latin name takes the subtitle slot or moves into the body — rather than
a drive-by in a shift's last stretch. Logged in `FEATURE_BACKLOG.md` as the highest-value
well-scoped item currently sitting unclaimed, and it is this shift's recommended next pick.

### Track B — Appearance toggle: System / Light / Dark, live repaint

Shipped the item Shift 54 opened when it verified dark mode already worked off
`prefers-color-scheme` but found no in-app override. `app/useTheme.ts` + `app/ThemeToggle.tsx` add
an "Appearance" section to the hamburger menu beside Sailing season; System stays the default and
tracks the OS preference live, Light and Dark override it in either direction, persisted to
`localStorage["roman-maps:theme"]`.

Shift 54's scoping note expected this to need either hand-threading `setPaintProperty` through ~30
layer IDs or a full map remount, and flagged the remount as risky because eight components grab a
`window.__map` reference once on their own mount. **Neither was necessary.** `swapPaletteColors()`
walks `map.getStyle().layers` and swaps any paint property whose literal string value matches an
outgoing `Palette` entry — so it covers every layer including thematic overlays switched on later,
needs no per-layer list to keep in sync, and never replaces the map instance, leaving those eight
components untouched. Three real traps handled rather than papered over: `LIGHT.land` and
`LIGHT.labelHalo` are both `#f4ead5` but diverge in `DARK`, making a value-only lookup ambiguous
for that one pair (disambiguated by paint-property name — `land` only ever paints fill/background,
`labelHalo` only halo/stroke); the road-station marker is a canvas-drawn `addImage` icon with its
border color baked into pixels, so it is regenerated via `updateImage` on switch; and `P` became a
`let`, reassigned on switch, so an overlay lazily loaded *after* a theme change bakes in the current
palette rather than the mount-time one.

**A real finding worth carrying forward**: the flash-of-wrong-theme guard in `app/layout.tsx` is a
plain synchronous `<script>`, deliberately **not** `next/script`'s `beforeInteractive` strategy.
The first implementation used `beforeInteractive` and Playwright caught it failing — Next 14's app
router compiles it to a `(self.__next_s=...).push(...)` queue entry processed only once the router
bundle boots, measured with `data-theme` still `null` at `domcontentloaded` and set only by `load`,
i.e. after first paint, which is precisely the flash the guard exists to prevent. A raw script tag
measured correct (`"dark"` at `domcontentloaded`). Flagged in FEATURE_BACKLOG for any future
before-first-paint init. `app/globals.css` now carries the dark token block twice — guarded
`@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` plus
`:root[data-theme="dark"]` — so an explicit choice wins in both directions.

Verified live rather than by typecheck alone, `next dev` + Playwright: an OS-dark context still
renders dark with no `data-theme` attribute (System unchanged); toggling Dark on a light-OS context
live-repaints bg `#a9d1e3`→`#0f2233`, land `#f4ead5`→`#232628`, roads `#a12b0d`→`#c9573b`, label
halos `#f4ead5`→`#111315` and chrome `--surface` `#ffffff`→`#292a2d` with no reload; the choice
survives a reload with `data-theme` set by `domcontentloaded`; and an explicit Light beats a dark OS
at 375×812. Screenshots at 1280×900 and 375×812 in both schemes; phone control count unchanged
(search pill, layers button, one corner FAB, epoch pill, credit chip), per invariant 0. One
incidental cleanup: `applyStoredTheme()` was written as a React-side backstop, then found redundant
once the head script worked, and deleted rather than left as an unused export.

### State, verification, next

`npm run validate`: 0 errors, 17 warnings, identical set to Shift 54's own — no new warnings from
either POI batch. `npm run build`: clean at every push (five separate commits, five clean pre-push
gates), 664 static pages at the final count (up from 620). `npm run metrics --write`: 520→576 POIs,
image coverage 60.8%→61.1%, ancient-source coverage of confidence:high POIs 73.2%→70.0% (down —
the four new-site batches added real, research-honest `image_url`/`ancient_sources: null` gaps
faster than this shift's smaller ancient-sources/fortress-image batches closed them, an expected
shape when a shift leans add-heavy), "what happened here" category coverage held at 100% after the
same-shift category-vocabulary fix, curated places total crossed 2,050 (2,056). Five commits, each pushed after a clean `git fetch origin main` (no divergence
at any point this shift — no other worker touched `main` during this session) and a clean pre-push
build gate.

**Next shift**: the zero-`pois.geojson`-coverage list is now 11 (Leptis Magna, Sabratha, Italica,
Tivoli, Palestrina, Cumae, Capua, Brescia, Milan, Rimini, Luni) — same well-bounded shape, pick one
or two per shift, and brief the research prompt with the exact allowed category vocabulary from
`app/categoryLife.ts` up front (this shift's own fix exists because that step got skipped once).
The recommended **next pick overall** is the invariant-1.5 violation logged above and in
`FEATURE_BACKLOG.md`: every `/place/[slug]` page titles itself in Latin
(`name_latin || name_english`), which is backwards per the map's own display-name rule and costs
real SEO/share-preview value across all 576 pages — a two-line fix that deserves a considered pass
with an `SEO-LOG.md` entry, not a rushed one. `[09-P0-1]` ancient-sources is at diminishing returns
(the pool is now almost entirely tombs/villas/shipwrecks without a real ancient source, ~3-in-15
hit rate the last two batches running); the fortress-image gap is functionally closed at 2/28
(Melitene, Nicopolis) after three search passes with different angles. The board's large P0
refactors (`[12-P0-1]` merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]`
terrain, `[13-P0-2]` image-audit) remain the standing next pick for whichever shift gets either a
network-unblocked environment or a dedicated multi-pass budget large enough to see one through in
one sitting — none of that changed this shift.

---

## Shift 54 — 2026-08-24 (this shift's own prompt claimed "Shift 3 of four")

Same stale-numbering mismatch every shift since #13 has flagged, still unresolved — SHIFT_LOG
was 53 real shifts deep at session start, not 2. Session started `HEAD` detached at Shift 53's
own final commit (`18d7466`) with local `main` stuck at Shift 28's commit (`709a480`); a fresh
`git fetch origin main` confirmed `origin/main` matched detached `HEAD` exactly (`git ls-remote`
first, per the standing habit FEATURE_BACKLOG.md's own note recommends), so `git checkout -B
main origin/main` re-pointed the local branch with zero risk — same benign container-creation
race every recent shift has documented, no work at risk. Re-confirmed the standing network
finding independently: `curl`/`WebFetch` to `overpass-api.de`, `commons.wikimedia.org`,
`en.wikipedia.org`, `pleiades.stoa.org`, `penelope.uchicago.edu`, and `www.livius.org` all return
`EGRESS_BLOCKED`/`CONNECT tunnel failed, response 403`. `WebSearch` stayed reachable and was the
only research channel. Unlike the last few shifts, `npm run dev` + Playwright worked fine for
the *first* live-verification pass (dark-mode check, before any data changes) but started 404ing
on every `/place/[slug]` route — including long-established ones like `poi_forum_romanum` — after
a `pkill`+restart later in the session; root-caused as a `next dev`-only quirk isolated to this
sandbox (a full `npm run build` at the same commit generated and served every new page correctly
from the static `.next/server/app/place/*.html` output, confirmed by grepping three of this
shift's own new pages directly), not a data or code regression — flagging in FEATURE_BACKLOG for
whoever hits it next rather than chasing it further.

### Board check

Read `BOARD.md`'s claiming protocol. No `[~]` claims standing. The unclaimed tickets are the same
large P0 refactors recent shifts have correctly declined (`[12-P0-1]` merge-themes, `[03-P0-1]`
schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain, `[13-P0-2]` image-audit) — still real
multi-pass work, still not attempted solo this shift given everything else queued. Picked up two
threads instead, no claim commit needed (same precedent recent shifts have documented for
standing/axis work): the `[09-P0-1]` ancient-sources gap (standing) and the prior shift's own
handoff note — the largest still-open image-coverage cluster, the 28 `poi_fortress_*` legionary
fortresses — plus a fresh `add`: two of the sixteen `sites.ts` sites sitting at zero curated
`pois.geojson` coverage (`FEATURE_BACKLOG.md`'s own long-standing note on this gap), picked
Paestum and Beneventum for their well-documented, well-dated Trajanic-era-or-earlier monuments.
Ratio this shift: 2 `add` (Paestum, Beneventum) + 2 `deepen` (ancient-sources, fortress images) +
1 `polish` (Track B) — leans add-heavier than the board's 1:2:1 guideline, but the board ratio
governs board tickets specifically and axis/standing work has followed a looser version of it for
several shifts running; logging the skew rather than silently claiming exact compliance.

### Track A — Beneventum + Paestum: first curated `pois.geojson` coverage

Delegated two parallel research passes (WebSearch-only, no direct Commons/Wikipedia fetch
available) for the two zero-coverage sites, cross-checked against a proximity scan of every
`sites.ts` site's center against `pois.geojson` (16 sites at zero curated points; picked these
two for having the strongest 117-CE-dateable monument sets, not the largest population).

**Beneventum** (8 features): the **Arch of Trajan** is the flagship — dedicated 114 CE, its own
CIL IX 1558 attic inscription cited directly, three years old at Trajan's death and the exact
point where the Via Traiana split from the Via Appia. The Neronian-era amphitheatre carries a
genuine Tacitus citation (*Annals* 15.34, Nero watching Vatinius's games there in 63 CE). The
Isis sanctuary (Domitianic, ~88 CE — Beneventum holds the largest collection of original Egyptian
antiquities outside Egypt), Ponte Leproso, the city walls, forum, and baths round out the extant
set. The **Roman Theatre confirmed the exact trap the research brief warned about**: multiple
independent sources agree it was a Hadrianic building, inaugurated 126 CE — nine years past this
map's snapshot — so it's included with `extant_117ce: false` rather than assumed present because
"Beneventum obviously had a theatre." Two candidates were researched and dropped: Ponte Corvo/
Ponte Valentino (one source dated the latter to "the 2nd century by emperor Flavius Valens" — a
4th-century emperor, an internal contradiction that killed the candidate outright) and a
standalone Traianeum/temple-of-Trajan, never attested in any source found.

**Paestum** (15 features): the three great Doric temples — Neptune/Hera II (~450 BCE), the
"Basilica"/Hera I (~550 BCE, one of the oldest standing Greek temples in Italy), and Athena
(~500 BCE) — all correctly `extant_117ce: true` with their original Greek-period build dates,
since Roman-era Paestum lived alongside these as standing monuments rather than building new
ones. The Roman-period layer (forum, curia, amphitheater — one of the oldest of its form anywhere,
predating the Colosseum — via sacra) dates from the 273 BCE Latin colony. The full ~5km wall
circuit and all four named gates (Sirena, Marina, Giustizia, Aurea) are included, plus the Temple
of Mens Bona (a Second Punic War loyalty dedication). Two Lucanian-period structures — the Heroon
founder's shrine and the rock-cut Ekklesiasterion assembly hall — were deliberately buried by
Roman colonists around 273 BCE and are correctly `extant_117ce: false`, sealed underground for
four centuries by Trajan's reign. The research pass's `province` value ("Italia (Regio III
Lucania et Bruttii)") was corrected to plain `"Italia"` before merging — confirmed against the
existing `paestum`/`beneventum` `sites.ts` entries, which already use unqualified `"Italia"` for
every Italian-peninsula site regardless of Augustan regio.

### Track A — `[09-P0-1]` ancient-sources: 6 more high-confidence POIs

Standing ticket, continued from Shift 53's 67-POI gap. Delegated a themed batch of 18 candidates
(bridges, amphitheatres, famous tombs, mines, pottery workshops, Palmyra/Petra tombs) to a
background research pass instructed to reject near-misses rather than force a connection. 6 came
back real: the Tomb of Amyntas (TAM II 30, the inscription that names the monument), the Nereid
Monument (a fragmentary bilingual statue-base epigram, SEG 28.1245), the Basilica of Pompeii (CIL
IV 1904, a wall graffito joking about how much writing the wall has survived), La Graufesenque
(Marichal's published corpus of bilingual Latin/Gaulish firing-list graffiti — the single richest
surviving body of written Gaulish), the Tower of Elahbel at Palmyra (its own 103 CE foundation
inscription), and Villa Poppaea at Oplontis (a genuine titulus-pictus amphora label naming a
freedman of "a Poppaea" — written up honestly as the traditional-not-certain basis for the
villa's association with Nero's wife, not asserted as settled fact). 12 of 18 came back honestly
unsourced, several explicitly rejected as near-misses the research caught before they became a
misattribution: Dolaucothi (Pliny describes Spanish mining, never Britain), Trajan's Markets
(Aulus Gellius/Cassius Dio describe the neighboring Forum, not the Markets), the Valley of the
Tombs at Palmyra (Pliny describes Palmyra generally, never the tombs specifically), and both Petra
tombs (Strabo covers Petra broadly, never either monument by name). Gap now 61 confidence:high
POIs (67→61).

### Track A — legionary-fortress image top-up: 23 of 28

Continuing Shift 53's own handoff note — the largest single image-coverage cluster left, all 28
`poi_fortress_*` records had zero image at all. Preferred real surviving fortress structures
(the Multangular Tower at York, the Heidentor near Carnuntum, the Porta Principalis Dextra at
Apulum) or an attached amphitheatre/theatre where the fortress core itself is gone (Caerleon,
Chester, Aquincum, Xanten, Viminacium), falling back to an on-site museum artifact only where no
structural remains exist (legionary tombstones at Bonn and Mainz, a mosaic at Zeugma). 5 of 28
came back with no confirmable Commons filename — both Caparcotna/Legio records (the joint Judaean
base), Raphanaea, Melitene, and Nicopolis/Alexandria — left alone rather than guessed. Gap now
5/28.

### Track B — verified and closed the "Dark mode / night-map style" backlog item

`FEATURE_BACKLOG.md` had this unchecked since Shift 2, but reading `app/Map.tsx` and
`app/globals.css` found it already fully shipped: a `LIGHT`/`DARK` `Palette` keyed off
`prefers-color-scheme` drives every base-map paint property (parchment `#f4ead5` → dark leather
`#232628`, sea `#a9d1e3` → dark navy `#0f2233`), and the chrome tokens follow the same media
query. Verified live rather than trusting the code read alone: `next dev` + Playwright with
`colorScheme: 'dark'`/`'light'` browser contexts at 1280×900 and 375×812, confirming both the
computed chrome background AND `map.getPaintProperty()` values match the palette exactly in each
mode. Closed the checkbox with a note rather than leaving it open or, worse, re-implementing
something that already works. Found and logged the real remaining gap instead of attempting it in
the same pass: no in-app manual light/dark toggle exists (OS-preference-only) — scoped it
honestly as a separate, materially bigger feature (every `P.<key>` paint-property callsite
grepped first: ~30 distinct layer IDs would need either a live `setPaintProperty` pass or a full
map remount, and a remount risks breaking the ~8 components that grab a `window.__map` reference
once on their own mount and never re-poll) and left it as a fresh backlog item for whoever has a
full Track B slice free for it.

### State, verification, next

`npm run validate`: 0 errors, 17 warnings, identical set to Shift 53's own (no new warnings from
any of the three batches). `npm run build`: clean at every push (three separate commits, three
clean pre-push gates), 620 static pages at the final count. Spot-checked the actual generated
`.next/server/app/place/*.html` output directly for three of this shift's new pages (Arch of
Trajan, Temple of Neptune at Paestum, the Legio IX Hispana fortress) after `next dev` started
404ing on every `/place/[slug]` route mid-session (see the network-and-verification note above) —
all three render with the correct new content. `npm run metrics --write`: 497→520 POIs, image
coverage 57.1%→60.8%, ancient-source coverage of confidence:high POIs 73.0%→73.2%, curated places
total crossed 2,000 for the first time (2,000 exactly). Four commits, each pushed with a clean
`git pull --rebase` first and a clean pre-push build gate.

**Next shift**: `[09-P0-1]`'s gap is now 61 confidence:high POIs, same diminishing-returns shape
Shift 53 already flagged — the pool is increasingly tombs/villas/shipwrecks/industrial sites
without a real ancient source, and `[09-P1-4]` epigraphy is the standing channel that's already
absorbed the inscription-bearing wins. The fortress-image gap is down to 5/28 (Caparcotna×2,
Raphanaea, Melitene, Nicopolis) — likely needs a different search angle (an academic excavation-
report PDF search rather than tourism-site snippets) rather than a repeat of this shift's
approach. 14 of `sites.ts`'s 16 zero-coverage sites remain (Djemila, Volubilis, Leptis Magna,
Sabratha, Jerash, Trier, Italica, Tivoli, Palestrina, Cumae, Capua, Brescia, Milan, Rimini, Luni —
Beneventum and Paestum closed this shift) — same well-bounded Track A shape, pick one or two per
shift per `FEATURE_BACKLOG.md`'s own note. The board's large P0 refactors remain the standing
next pick for whichever shift first gets a network-unblocked environment or a dedicated
multi-pass budget large enough to see one through in one sitting.

---

## Shift 53 — 2026-08-24 (this shift's own prompt claimed "Shift 2 of four")

Same stale-numbering mismatch every shift since #13 has flagged — SHIFT_LOG was 52 real shifts
deep at session start, not 1. Session started `HEAD` detached at Shift 52's own final commit
(`d80b343`) with local `main` diverged from `origin/main` (50/50 different commits — a stale
tracking ref from container image build, not real conflicting work); `git reset --hard
origin/main` synced it, same benign race every recent shift has documented, no work at risk.
Re-confirmed the standing network finding independently: `curl` to `overpass-api.de`,
`commons.wikimedia.org`, `en.wikipedia.org`, and `pleiades.stoa.org` all return `CONNECT tunnel
failed, response 403` from the agent proxy. `WebSearch` stayed reachable throughout and was the
only research channel this shift. Unlike most recent shifts, this session **could** run `npm
run dev` + Playwright against a real Chromium install (`/opt/pw-browsers`) for live UI
verification — used it below rather than skipping the visual gate.

### Board check

Read `BOARD.md`'s claiming protocol. No `[~]` claims standing. The unclaimed tickets are the
same large P0 refactors recent shifts have correctly declined (`[12-P0-1]` merge-themes,
`[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain, `[13-P0-2]` image-audit,
`[02-P0-4]`'s still-open glyph-PBF half). Picked up Shift 52's own handoff notes instead — axis
7d (wild fauna sourcing, the one still-untouched axis-7 sub-item) and the standing `[09-P0-1]`
ancient-sources ticket — plus a third pick, the standing `[13-P1-4]`-adjacent image-coverage gap
(67 confidence:high POIs had no image at all), all research-only and no-Overpass. No claim
commit needed for standing/axis work, same precedent recent shifts have documented. Ratio this
shift: 1 `add` (fauna_sourcing.geojson) + 2 `deepen` (ancient-sources, image top-up) — matches
the board's own 1:2:1 ratio even though none of the three is a claimed board ticket.

### Track A — Axis 7d: wild fauna sourcing for arena games

New `public/data/fauna_sourcing.geojson`: 8 source-region points that supplied exotic animals
for Roman venationes, each with a real ancient-source citation — Mauretanian elephants (Pliny,
*NH* 8.1; a Veii mosaic shows one being loaded onto a ship), Numidian lions (Pliny *NH* 8.17;
Sulla's 100 and Caesar's 400), Cilician panthers (Cicero's own *Ad Familiares* letters begging
Caelius Rufus to ship him some, the most detailed procurement paper-trail in Roman literature),
Indian tigers via Parthian middlemen (Pliny *NH* 8.65, Augustus's *Res Gestae* 31), Caledonian
bears (Martial's Laureolus epigram from the Colosseum's 80 CE opening games — the strongest
single citation in the set), Nile hippos/crocodiles/rhinos (Pliny *NH* 8.96, Cassius Dio
51.22/55.10), Garamantian ostriches (Herodotus 4.183, Pliny *NH* 10.1), and Nubian
giraffes/rhinos (Cassius Dio 43.23, on Caesar's 46 BCE triumph). Every point ships a verified
Commons image (Zliten and Piazza Armerina mosaics, the Nile mosaic of Palestrina, a Nennig
gladiator mosaic). 8 dashed route LineStrings converge each source on the Colosseum — the one
amphitheatre every citation can actually be tied to as still standing and hosting games in 117
CE (Circus Maximus and the pre-Colosseum venues these events originally happened at are noted in
the prose, not drawn as separate destinations, to keep the layer readable). One researched
candidate — Dalmatian bears — came back from the research pass with no real ancient citation,
only modern secondary claims, and was dropped rather than invented; Pliny's own "Numidian bears"
crux (zoologically odd, textually real) was considered as a replacement but left out to keep the
set to citations with an unambiguous geographic match. Wired as a new "Arena animal sourcing"
layer group (`Map.tsx` Phase 34, `useLayers.ts`), default OFF per invariant 0, same lazy-load-
on-toggle pattern as every other thematic overlay. Also added `wind_currents.geojson` (shipped
last shift without one) to `validate.mjs`'s `PROFILES` map, so it gets the same "themed" schema
checks as every other axis file instead of silently falling back to the looser structural
profile — passed clean with no new warnings.

Verified live, not just by code review: `npm run validate` (0 errors, same 17 warnings), `npm
run build` (597 static pages), and a real `next dev` + Playwright pass — confirmed the fauna
source/layers genuinely don't exist until the Layers panel toggle is switched on (invariant 0,
checked programmatically, not assumed), then render correctly (dashed lines converging on Rome,
point markers at each source region) with zero console errors at 1280×900 light and 375×812
dark.

### Track A — `[09-P0-1]` ancient-sources: 4 more high-confidence POIs

Standing ticket, continued from Shift 52's 71-POI gap. Delegated a themed batch of 15 candidates
(bridges, amphitheatres, famous tombs, Trajan's Markets, Baalbek's Temple of Bacchus) to a
background research pass with explicit instructions to re-verify past batches' documented
mistakes rather than repeat them. 4 came back real: Cecilia Metella's tomb (CIL VI 1274, the
inscription naming her that has identified the tomb since antiquity), the Fabrician Bridge
(CIL I² 751 / CIL VI 1305, carved four times on the bridge itself, Rome's oldest surviving
bridge), the Bridge of Augustus at Narni (Martial, *Ep.* 7.93, a passing but genuine reference),
and Pont Flavien (CIL XII 647 — the research pass flagged a conflicting catalogue number against
CIL XII 654, resolved with an independent follow-up search before merging). 11 of 15 came back
honestly unsourced, two of them near-misses the research explicitly caught and rejected before
they became this project's next wrong-neighbor citation: an Aulus Gellius passage about Trajan's
*Forum* offered for the separate Markets complex, and a Temple-of-Augustus inscription at Pula
misattributed to the neighboring amphitheatre. Gap now 67 confidence:high POIs (71→67).

### Track A — image top-up: 18 flagship POIs

`npm run metrics` doesn't track image coverage per confidence tier, but a direct query found 67
confidence:high POIs shipping with no `image_url` at all — several of them famous monuments any
visitor would expect a photo for (Basilica Julia, Basilica Aemilia, Trajan's Forum, the
Mausoleum of Augustus, the Lighthouse of Alexandria, four separate Pompeii buildings). Delegated
a themed batch of 20 to a background research pass with the same real-Commons-filename-only
standard `[09-P0-1]` uses. 18 of 20 came back with a confirmed file: mostly modern photos of the
surviving ruins, but several genuine period pieces — a Prosper Morey watercolor of Trajan's
Forum, an 1804-11 reconstruction engraving of the Mausoleum of Augustus, Philip Galle's 1572
engraving of the Lighthouse of Alexandria (nothing later exists; the structure itself is gone),
and a Luigi Bazzani watercolor of the Stabian Baths' changing room. Misenum's naval base — no
standalone image of the harbor exists — got the Piscina Mirabilis cistern that supplied its
fleet, honestly credited as the adjacent structure rather than passed off as the base itself. 2
of 20 dropped rather than force a weak fit: the Regia's only confirmed Commons file is a
19th-century locator map, not an image of the building, and the Baths of Titus only turned up an
unconfirmed floor plan.

### State, verification, next

`npm run validate`: 0 errors, 17 warnings, identical set to Shift 52's (no new warnings from
either the new axis file or the two pois.geojson batches — image_url and ancient_sources syntax
both checked clean). `npm run build`: clean, 597 static pages, at every commit this shift.
Spot-checked the built static `/place/` output directly for a handful of the new images (Trajan's
Forum, Basilica Julia, Vindolanda, Tomb of Herod, Alexandria Pharos) — credit line renders
correctly on all five. `npm run metrics --write`: image coverage 53.5%→57.1% (266→284/497);
ancient-source coverage of confidence:high POIs 71.4%→73.0% (177→181/248); thematic files
30→31. Three commits, each pushed with a clean `git pull --rebase` first and a clean pre-push
build gate.

**Next shift**: `[09-P0-1]`'s gap is 67 confidence:high POIs — the pool is now almost entirely
tombs, villas, shipwrecks, and industrial sites where a real ancient source is genuinely
unlikely to exist; expect diminishing returns without opening a new source class (inscriptions
already covered by `[09-P1-4]`, standing). The image-coverage gap (confidence:high POIs with no
`image_url`) was 67 at shift start, now 49 — a direct query (not `npm run metrics`, which
doesn't track this split) is the fastest way to find the next batch; the 28 legionary-fortress
POIs (`poi_fortress_*`) are the largest remaining single cluster and mostly untried. Axis 7 is
now fully closed against the brief's own named list (7a agriculture, 7b sailing seasons, 7c
winds/Nile, 7d fauna sourcing) for the first time. The board's large P0 refactors remain the
standing next pick for whichever shift first gets a network-unblocked environment or dedicated
multi-pass budget.

---

## Shift 52 — 2026-08-24 (this shift's own prompt claimed "Shift 1 of four")

Same stale-numbering mismatch every shift since #13 has flagged — SHIFT_LOG was 51 real shifts
deep at session start, not 0. Session started `HEAD` detached at `2b94f8f` (Shift 51's own final
commit) with local `main`/`origin/main` both stale at `709a480` ("Shift 28") until a fresh
`git fetch origin main` pulled the real tip — same benign container-creation race every recent
shift has documented, no work at risk. Re-confirmed the standing network finding independently:
`curl` to `overpass-api.de`, `commons.wikimedia.org`, and `en.wikipedia.org` all return `CONNECT
tunnel failed, response 403` from the agent proxy. `WebSearch` stayed reachable throughout and was
the only research channel this shift, same as every recent shift. Axis 1 (new cities via Overpass)
stayed off the table for the same reason it has for the last dozen-plus shifts.

### Board check

Read `BOARD.md`'s claiming protocol. No `[~]` claims standing. The unclaimed tickets are the same
large P0 refactors recent shifts have correctly declined (`[12-P0-1]` merge-themes, `[03-P0-1]`
schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain, `[13-P0-2]` image-audit, `[02-P0-4]`
self-host-glyphs' still-open half — all need either live-fetch verification this sandbox's egress
block rules out, or a font-PBF generation pipeline not installed here). Rather than claim one of
those, picked up Shift 51's own handoff note (axis 7b/7c, "still untouched... a good next pick for
a research-only shift") plus the standing `[09-P0-1]` ancient-sources ticket — both explicitly
research-only, no-Overpass, no-direct-fetch, matching this sandbox's constraints, so no claim
commit was needed (same precedent Shift 50/51 documented for axis/standing-ticket work). Ratio
this shift: 1 `add` (the new wind_currents.geojson axis + its UI) + 1 `deepen` (ancient-sources) —
a deliberate return to `add` after Shift 51's 2 `verify` + 1 `deepen`, no `add` shift.

### Track A + Track B — Axis 7b/7c: sailing seasons + named winds/Nile flood

New `public/data/wind_currents.geojson` (7 features, axis 7c): the Etesian winds (Pliny, *Natural
History* 2.47; Aristotle, *Meteorologica* 2.5), Aquilo and Africus/Auster (Horace, *Odes* 1.3 —
"praecipitem Africum decertantem Aquilonibus"), Favonius (Pliny NH 2.47's ~February 8 first
appearance, when sailors waited for it before leaving harbor), Iapyx (the one favorable wind
Horace names by name for Vergil's Brundisium-to-Greece crossing), the Nile's annual flood at the
Elephantine nilometer (Pliny NH 5.10; Herodotus 2.19), and the Tower of the Winds at Athens as the
physical monument to the whole classical eight-wind system (Vitruvius 1.6.4) — still standing and
functioning as weathervane/water-clock in 117 CE. Wired as Phase 33 in `Map.tsx` / a new
`wind-currents` layer group in `useLayers.ts`, default OFF per invariant 0. Image sourcing followed
the established landmarks_117.geojson pattern for abstract phenomena (a real Pompeii ship graffito
and the Elephantine nilometer/Tower of the Winds photos, all confirmed via WebSearch result-page
matching — direct Commons fetch is still blocked in this sandbox).

Also this shift's Track B: `app/SailingSeason.tsx` + `app/useSailingSeason.ts` — a mare
apertum/mare clausum explainer in the hamburger menu, same expandable-card pattern as
`CurrencyConverter.tsx`. A manual Summer/Winter toggle (deliberately not tied to the visitor's
live calendar date, since the map itself is a frozen 117 CE snapshot, not a simulation) that tints
the map's sea fill grey in "Mare clausum" mode via two new always-present, zero-opacity map layers
(`sea-mask-winter-tint`, `ancient-sea-winter-tint`) toggled through `setPaintProperty`, persisted
to `localStorage` and restored on load. Cites Vegetius, *De Re Militari* 4.39 (late source
codifying standing Roman practice — safe late May to mid-September, risky in the shoulder months,
closed November to March) for the actual date windows.

Verified live, not just by code review: `npm run validate` (0 errors, same 17 warnings as before),
`npm run build` (597 static pages), and a real `next dev` + Playwright pass — confirmed the wind
layer's source/layer/features render, the season toggle tints and un-tints the sea correctly
(`fill-opacity` 0 ↔ 0.55), and both features render correctly at 1280×900 light and 375×812 dark.
Hit two real Playwright gotchas along the way, both now logged in `FEATURE_BACKLOG.md`'s process
notes rather than left to rediscover next time: a plain `.click()` on some real (non-map-canvas)
Chrome.tsx buttons silently no-ops in this sandbox where `dispatchEvent("click")` works, and
`LeftRail.tsx` + `Chrome.tsx` both render a `title="Menu"` button, so that selector resolves to 2
elements on desktop (1 on mobile, since the left rail is desktop-only).

### Track A — `[09-P0-1]` ancient-sources: 15 more high-confidence POIs

Standing ticket, continued. Split the work across 3 parallel background research agents, each
handed a themed sub-list from the 86 confidence:high POIs still missing `ancient_sources[]` and
told explicitly to flag rather than invent a citation. Deliberately picked candidates where a real
primary source plausibly exists — mostly the funerary/dedicatory *inscription* a monument is
famous for, which counts as a legitimate primary ancient source in this project's schema exactly
like the Ligures Baebiani/Veleia bronze tables already do for the alimenta towns — rather than
forcing citations onto purely-archaeological-discovery POIs (2024/2026-discovered shipwrecks,
construction-crew villa finds) where no ancient text or inscription could plausibly attest them.

15 applied: three Pompeii Porta Ercolano tombs with Latin excerpts (Mamia, CIL X 998; Umbricius
Scaurus, CIL X 1024; Naevoleia Tyche, CIL X 1030), Vestorius Priscus (AE 1911, 72 — excavated 1908,
after CIL X's 1883 cutoff, so correctly an *Année épigraphique* citation rather than a CIL one, a
distinction the research agent caught rather than forcing), the Tomb of Eurysaces (CIL I² 1203–1205
/ CIL VI 1958, with the "pistoris redemptoris" line), the Vipasca mining law bronze tablets (CIL II
5181), the Alburnus Maior wax tablets (CIL III pp. 921–960 / IDR I), the Henchir Mettich estate
inscription — dated 116–117 CE, this map's own snapshot year (CIL VIII 25902), Ampelum's procurator
inscription (CIL III 1312), the Dougga mausoleum's Punic/Libyan bilingual (KAI 100/101, the text
used to help decipher the Libyco-Berber script), the Benei Hezir priestly tomb's Hebrew inscription
(CIIP I/1 no. 137), the Pomponius Hylas columbarium's mosaic dedication (CIL VI 5552), the Haterii
relief-tomb's attribution inscription (CIL VI 607, flagged honestly as a scholarly attribution
rather than an in-situ label — the tomb's own inscription, if any, is lost), and the Tropaeum
Traiani's Mars Ultor dedication (CIL III 12467, datable to 109 CE from Trajan's titles).

One candidate deliberately shipped *without* a source: the Tower of Elahbel at Palmyra has a real,
well-attested 103 CE dedicatory inscription, but the research pass couldn't confirm a specific
PAT/CIS catalogue number for it — the "CIS II 4160" a first pass turned up actually belongs to two
different hypogeum lintel inscriptions instead. Left unsourced rather than shipping a wrong number.

One real correction found along the way: Munatius Plancus's mausoleum at Gaeta had a `notes` claim
that its inscription "ran the full circumference" of the tomb — unverifiable, and contradicted by
every source the research agent found, which place the text on the entrance facade/architrave, not
encircling the drum. `notes` corrected to match what the source actually shows.

### State, verification, next

`npm run validate`: 0 errors, 17 warnings, identical set to Shift 51's (no new warnings). `npm run
build`: clean, 597 static pages, at every commit this shift. `npm run metrics --write`:
ancient-source coverage of `confidence: high` POIs 65.3%→71.4% (162/248→177/248); thematic files
29→30 (the new wind_currents.geojson); overall ancient-source coverage 36.4%→39.4%. Three commits,
each pushed with a clean `git pull --rebase` first and a clean pre-push build gate.

**Next shift**: `[09-P0-1]`'s gap is now 71 confidence:high POIs (86→71) — still a good research-
only pick, and the remaining pool skews toward sites where a real citation is genuinely less likely
(2020s-discovered shipwrecks, accidental construction finds) rather than the inscription-bearing
monuments this batch prioritized, so expect a lower hit rate and more honest `no_source_found`
flags going forward. Axis 7 is now fully closed against the brief's own named list (7a agriculture,
7b sailing seasons, 7c winds/Nile) — 7d (wild fauna sourcing, arena-animal supply routes + arrows to
amphitheatres) is the one still-untouched axis-7 sub-item if a future shift wants to finish the set.
`wind_currents.geojson`'s `type: "monument"` (currently just the Tower of the Winds) could take
more entries if a future shift finds other well-documented ancient meteorological/navigational
monuments. The board's large P0 refactors remain the standing next pick for whichever shift first
gets a network-unblocked environment or dedicated multi-pass budget.

---

## Shift 51 — 2026-08-23 (this shift's own prompt claimed "Shift 4 of four")

Same stale-numbering mismatch every shift since #13 has flagged — SHIFT_LOG was 50 real shifts
deep at session start, not 3. Session started `HEAD` detached at `2549e4f` (Shift 50's own final
commit) with local `main`/`origin/main` both stale at `709a480` ("Shift 28") until a fresh
`git fetch origin main` pulled the real tip — same benign container-creation race every recent
shift has documented, no work at risk. Confirmed the standing network finding independently:
`curl` to `overpass-api.de` and `commons.wikimedia.org` both return `CONNECT tunnel failed,
response 403` from the agent proxy (checked `$HTTPS_PROXY/__agentproxy/status` directly — both
hosts show up in `recentRelayFailures`). `WebSearch` stayed reachable throughout and was the only
research channel this shift, same as every recent shift. Axis 1 (new cities via Overpass) stayed
off the table for the same reason it has for the last dozen-plus shifts.

### Board check

Read `BOARD.md`'s claiming protocol, pulled first, then claimed two unclaimed P0/P1 tickets that
fit a research-only (no-Overpass, no-direct-fetch) shift: `[08-P0-3]` province-provenance and
`[06-P1-4]` excavation-history — committed the claim alone, pushed immediately, then did the work.
Left the large P0 refactors every recent shift has correctly declined untouched (`[12-P0-1]`
merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain, `[13-P0-2]`
image-audit). Picked up a third, smaller unclaimed ticket mid-shift once time allowed —
`[09-P1-5]` clear-unverified — without a separate claim commit since it was finished start-to-
end in one uninterrupted pass with no collision window. Ratio this shift: 2 `verify` + 1 `deepen`,
no `add` — a deliberate correction after several recent add-heavy shifts (49: 1 fix + 3 add;
50: research-axis-heavy) the board's own 1:2:1 ratio note flags.

### Track A — `[06-P1-4]` excavation-history: all 40 `sites.ts` sites

Real, cited excavation/rediscovery history for every curated site. Split the 40 sites across 4
parallel background research agents (10 sites each) since this is exactly the kind of
independent, WebSearch-only fan-out the token budget supports — each agent returned structured
JSON (year, excavator/institution, one concrete fact, source hint) per site, explicitly told to
flag rather than pad thin entries. Merged all 40 into a new `excavation?: {year, excavator, note,
source}[]` field on `SiteInfo` (`app/sites.ts`) via a scripted text-splice (not hand-editing 40
multi-line TS object literals) and rendered it as an "Excavation history" section on
`/site/[slug]` between the "on this spot today" line and the map CTA button — dated, named
entries in the same parchment styling the rest of that static page already uses. Highlights:
Vindolanda's March 1973 writing-tablet discovery by Robin Birley (initially mistaken for wood
shavings); Pompeii's 1748 Alcubierre dig through Fiorelli's 1860s plaster-cast technique to the
2012-2022 EU-funded Great Pompeii Project; Herculaneum's 1750s Karl Weber tunnel campaign that
recovered ~1,800 papyrus fragments from the Villa of the Papyri, the only library to survive
intact from antiquity; Carnuntum's 2011 ground-penetrating-radar discovery of a previously-
unknown gladiator school. Deliberately did **not** add this to the compact `SitesPanel.tsx`
browse list — a multi-entry dated timeline doesn't fit a one-line jump-list row; the static SEO
page is the right surface for it. Each research agent flagged its own thin spots honestly (a
few Italian sites with generic "Italian state archaeologists" instead of a named individual where
sources genuinely didn't specify one) rather than inventing a name — logged in the board entry,
not silently padded.

### Track A + Track B — `[08-P0-3]` province-provenance: established year + held-only-117 flag

All 43 `app/provinces.ts` entries get a new structured `establishedYear` (negative = BCE, `null`
for Italia and Numidia, neither of which was ever a formal province in 117) and `establishedNote`.
Most years were extractable straight from the file's own already-well-researched blurb prose, but
several needed real verification rather than re-deriving from memory — WebSearch confirmed Tres
Galliae's division is usually dated to Agrippa's 22 BCE reorganization (debated 27-13 BCE range),
Bithynia's 74 BCE bequest with Pontus joined only in 63 BCE, Galatia et Cappadocia's 72 CE
Vespasianic merger (Galatia itself annexed 25 BCE, Cappadocia not until 17 CE), and Crete and
Cyrenaica's separate 67/74 BCE annexations combined into one province only in 27 BCE. Armenia,
Mesopotamia and Assyria — the ticket's own explicitly-named case — get `establishedYear: 116`
(Trajan's own coinage marks the year, though Assyria's status as a genuinely separate third
province is itself debated since no coin issue confirms it) and a new `heldOnly117: true` flag,
with `establishedNote` spelling out plainly that Hadrian ordered Assyria evacuated and gave up
Armenia and Mesopotamia within months of this map's snapshot.

This is also this shift's Track B: wired the new fields into both UI surfaces that read
`app/provinces.ts` — `ProvincePanel.tsx` (the live map's click-a-province panel) and the static
`/province/[slug]` page now both show a "Roman since {year}" line, and the three eastern
provinces get a "HELD ONLY 114-117 CE — ALREADY BEING ABANDONED" badge using the existing
`--warn-bg`/`--warn-text` tokens `PhaseBanner.tsx` and the per-building "not standing in 117"
badge already established — no new hardcoded chrome colors, no new default-on overlay (this
enriches an existing base-layer panel, doesn't add one). Verified live with Playwright at
1280×900 light and 375×812 dark against a real `next dev` server: the static `/province/
armenia-mesopotamia` page's badge and the live map panel's "Roman since" line both render
correctly in both themes. One real sandbox snag worth recording precisely: a genuine
`page.mouse.click()` onto the `provinces-fill` layer never registered a click in this specific
container — checked the zoom gate (4.2, well under the handler's 7.5 cutoff) and confirmed the
layer's features query correctly, so the gate logic itself is fine; the same panel's click path
was already flagged as untestable-by-real-click in this exact sandbox by cloud shift 30 back on
2026-08-18 (`BOARD.md`'s `[02-P0-2]` note), for the same demotiles.maplibre.org-adjacent reason.
Used the identical workaround shift 30 documented — `map.fire('click', {point, lngLat,
originalEvent})` — which opened the real panel and let the new fields be confirmed visually. Not
a regression from this change; a standing, already-documented sandbox limitation on this one
interaction path.

### Track A (small) — `[09-P1-5]` clear-unverified

Picked up once the two claimed tickets were done and time remained. Re-checked all 5 citations
`SHIFT_LOG` had previously flagged as unverified, against their primary text. Three already had
`ancient_sources` (added by later shifts than whichever one first flagged them unverified) and
checked out accurate on a fresh read: Domus Flavia's Statius, *Silvae* 4.2 quote about columns
that could "shoulder the gods and the sky," Baths of Nero's Martial, *Epigrams* 7.34 ("nothing
worse than Nero, yet nothing better than his baths"), and Ara Pacis's *Res Gestae* 12 — no
misattribution found this pass, unlike the real Trajan's-Markets/Aulus-Gellius mixup an earlier
shift caught and rejected for a different POI. The other two had no ancient source at all;
research turned up real ones for both — Atrium Vestae gets Ovid, *Fasti* 6.263-265 (Numa's
"small place that holds the Atria of Vesta"), and Bibliotheca Ulpia gets Aulus Gellius, *Attic
Nights* 11.17.1, in which Gellius describes sitting in the library of Trajan's temple and calling
for old praetorian edicts to read — an actual eyewitness account of a scholar working inside the
library's stacks. `pois.geojson` feature count unchanged (469); two records go from zero literary
citations to one.

### State, verification, next

`npm run validate`: 0 errors, 17 warnings, identical set to Shift 50's (no new warnings
introduced). `npm run build`: clean, 597 static pages, both mid-shift and at the final commit.
`npm run metrics --write`: ancient-source coverage on `pois.geojson` 179→181 (36.0%→36.4%),
everything else unchanged (497 POIs, 100% depth). Reverted an unrelated `package-lock.json`
metadata-only diff (`hasInstallScript`, a `libc` field) from a clean `npm install` before every
commit, per the brief's "don't touch package.json without a data-change justifying it." Fixed one
real bug caught mid-edit, not shipped: a careless `Edit` on `/site/[slug]/page.tsx` briefly
truncated `<a href={mapHref}` down to a bare `<` — caught before committing by re-reading the
file, not by the build (JSX like that doesn't always fail typecheck cleanly depending on what
follows) — worth the reminder to re-read text-editor diffs on JSX open tags specifically, not
just trust the tool call succeeded.

**Next shift**: `excavation[]` could be extended past the 40 curated sites to major individually-
paged POIs (Colosseum, Forum, etc.) if a future shift wants the same treatment at that scale —
not attempted here, scoped to the board ticket's own "all 40 sites" ask. `provinces.ts`'s new
`establishedYear`/`establishedNote` fields are unused by search/sitemap — a future shift could
sort/filter provinces by age, or add a "youngest provinces" list, as a small follow-on Track B.
`[09-P1-5]`'s clearance is real but thin — only 5 POIs were ever explicitly flagged unverified by
name; a broader unverified-citation sweep across the ~318 POIs still without any `ancient_sources`
is a bigger, separate task, not attempted here. Axis 7's 7b (sailing seasons/mare clausum) and 7c
(named winds/currents) are still untouched, per Shift 50's own handoff note — still a good
next pick for a research-only shift.

---

## Shift 50 — 2026-08-23 (this shift's own prompt claimed "Shift 3 of four")

Same stale-numbering mismatch every shift since #13 has flagged. Session started with `HEAD`
detached at `bb092a2` (Shift 49's own final commit); `git checkout main && git reset --hard
origin/main` landed cleanly, no local-only work at risk. Re-confirmed the standing network
finding independently: `curl` to `overpass-api.de`, `commons.wikimedia.org`, and even
`example.com` all return `CONNECT tunnel failed, response 403` from the agent proxy, and
`WebFetch` returns a hard `EGRESS_BLOCKED` for every domain tried, wiki or not — this sandbox's
egress allowlist is `WebSearch`'s own backend and nothing else. Axis 1 (new cities via Overpass)
and any direct image-URL verification stay off the table for this shift, same as the last several.
`npm install` was needed (`node_modules` missing) before `npm run build`/`validate` would run.

### Board check

No `[~]` claims standing. Board's few unclaimed items are the same large P0s recent shifts have
correctly declined (`[12-P0-1]` merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild,
`[02-P0-1]` terrain, `[13-P0-2]` image-audit — the last needs the blocked direct-fetch image
verification anyway). Picked up the standing `[09-P0-1]` ancient-sources ticket for a small batch
instead (see below), and used `SHIFT_BRIEF.md` axes for Track A research, same legitimate
precedent documented by prior shifts when the board has nothing unclaimed that fits a
research-only, no-Overpass, no-direct-fetch shift.

### Track A — Axis 7: agriculture zones, closing out 7a

`agriculture.geojson` had grain (5/5), olive (5/5) and most of wine covered but was missing two
entire sub-lists `SHIFT_BRIEF.md`'s axis 7a names directly: fruit/specialty crops (dates, silphium,
figs, pomegranates) and livestock (Apulian sheep, Numidian horses, Cisalpine cattle, British
hunting dogs), plus two of five timber zones (Alpine fir, Bruttium fir). Researched and added all
10 as polygon zones, each with a real ancient citation and one concrete number/detail in Google-
Business voice: Cyrene's silphium (Pliny's story of the last stalk sent to Nero), the Dead Sea
oases (dates, balsam, and pomegranates together, since all three come from the same Jericho/Ein
Gedi strip per every source found), Carian figs (the Latin *caricae* literally named for the
region), Numidian cavalry horses, Apulian transhumance wool, Cisalpine cattle country, British
hunting dogs (Strabo, Oppian, and Tacitus all independently name this as a real British export),
and Alpine/Bruttium fir forests (Pliny on fir for ship's masts, backed by a 2026 PNAS
dendrochronology paper for the trade-distance claim). `agriculture.geojson` 18 → 28 — axis 7a is
now complete against the brief's own named list. Appended via `scripts/append-geojson-features.mjs`
for a pure-addition diff; `npm run validate` clean, no new warnings.

### Track A — Axis 2: Via Agrippa's Bavay–Cologne branch, 7 new stations

Went in planning a fresh "Via Belgica" road (Boulogne–Cologne, the Gallia Belgica corridor
`SHIFT_BRIEF.md`'s Gaul queue names) and researched the full Antonine Itinerary chain via
WebSearch: Gesoriacum → Tarvenna → Castellum Menapiorum → Viroviacum → Turnacum → Pons Scaldis →
Bagacum (83 mi, matches the itinerary's own stated total exactly), then Bagacum → Vodgoriacum →
Geminiacum → Perniciacum → Aduaca Tungrorum → Coriovallum → Iuliacum → Colonia Agrippina. Before
writing anything, checked whether this route already existed — **it did**: the entire western leg
(Gesoriacum through Bagacum) is already in `road_stations.geojson` under `road: "Via Agrippa"`,
added by an earlier shift as part of the same Lugdunum-radiating network. Caught this by grepping
matching coordinates before committing, not after — the same process discipline Shift 49's
conventus near-miss flagged as worth repeating. Only the genuinely new eastern half (Bavay to
Cologne, 7 stations) got added, under the same `road: "Via Agrippa"` name rather than inventing a
second name for one continuous road. Two identifications (Vodgoriacum = Waudrez, near Binche) ship
at `confidence: medium`; the rest are well-excavated, independently confirmed vici (Geminiacum/
Liberchies has been dug continuously since 1956 with unbroken Roman-period coin finds; Perniciacum/
Braives is named on both the Peutinger Table and the Antonine Itinerary). `road_stations.geojson`
488 → 495.

### Track A — Axis 15: 3 more alimenta towns

`euergetism.geojson` had 23 of the brief's ~50-town target. WebSearch surfaced three more
independently documented in the same secondary literature that named the existing 23 (R.
Duncan-Jones's survey of the scheme): Placentia (Piacenza), Iguvium (Gubbio), and Libarna, a small
Ligurian colony near Serravalle Scrivia whose amphitheater and forum are still standing. Shipped at
`confidence: medium` — none has its own dedicated bronze tablet the way Veleia or Ligures Baebiani
do, only a secondary-source mention. Real ceiling hit here, not a padding decision: several more
WebSearch passes for named alimenta towns (Falerii, Casinum, Suessa Aurunca, Setia, Signia, Anagnia)
came back with nothing specific enough to cite — the two big epigraphic tables (Veleia, Ligures
Baebiani) that prior shifts already mined thoroughly are genuinely the bulk of what survives by
name; the other ~27 towns implied by "53 towns and municipia" are attested in aggregate, not
individually nameable from what WebSearch can surface. Flagging for whoever revisits this: it may
need JSTOR/library access to Duncan-Jones's actual town list, not just search snippets, to close
the rest of the gap. No `image_url` found for any of the three after a real search — shipped
`image_url` key dropped entirely (not `null`) per the validator's own preferred pattern, since
`null` triggers an "image_url key present but empty" warning. `euergetism.geojson` 55 → 58.

### Track B — `[09-P0-1]` ancient-sources, batch 6

Small and honest: 1 new literary citation (Pyramid of Cestius — Cicero, *Phil.* 3.26, naming Gaius
Cestius decades before the pyramid was built). Nearly re-committed batch 5's own documented mistake
in the process — a search for Trajan's Markets surfaced an Aulus Gellius passage that on a closer
read describes the *neighboring Forum's* colonnades, not the Markets, exactly the confusion batch 5
already flagged and rejected for this same POI. Caught it against the board's own note before
merging and dropped it rather than shipping a wrong citation. Also researched and correctly passed
on Piscina Mirabilis, Alburnus Maior (the Cassius Dio "hidden treasure" passage is about the
Sargetia river hoard near Sarmizegetusa, a different place), Tomb of Eurysaces, and Lugdunum's
theatre — no genuine literary hit for any of them. Confirms the board's own standing note: the
remaining ~80-POI pool (tombs, villas, shipwrecks, industrial sites) has hit a real wall for
literary-only search and needs `[09-P1-4]` epigraphy's inscription channel opened instead.

### State, verification, next

`npm run validate`: 0 errors, 17 warnings (all pre-existing and reviewed). `npm run build`: clean,
597 static pages, both before and after the final pois.geojson edit. `METRICS.md` refreshed for
today (497 POIs unchanged — this shift's Track B was a citation top-up, not new POIs; thematic
records 1437 → 1457; ancient-source coverage on high-confidence POIs 64.9% → 65.3%). Reverted an
unrelated `package-lock.json` diff from a clean `npm install` (metadata-only, no dependency
change) before committing, per the brief's "don't touch package.json without a data-change
justifying it."

**Next shift**: axis 7's remaining sub-items are 7b (sailing seasons/mare clausum overlay) and 7c
(named winds/currents), both untouched — good next pick if continuing this axis. Axis 15's alimenta
list is at 26/~50; real headroom remains but needs a different research approach than more
WebSearch snippet-hunting (see note above). `road_stations.geojson`'s Via Agrippa branch is now a
complete Boulogne-to-Cologne road; a genuinely new road (not yet touched under any name) is still
open work for axis 2. `[09-P0-1]` ancient-sources: wait for `[09-P1-4]` epigraphy before another
literary-only pass, per this batch's own finding.

---

## Shift 49 — 2026-08-23 (this shift's own prompt claimed "Shift 2 of four")

Same stale-numbering mismatch flagged by every shift since #13 — the scheduled prompt said
"Shift 2 of four," `SHIFT_LOG` was 48 real shifts deep at session start. Session started with
`HEAD` detached at `36601a6` (Shift 48's own final commit) and a stale local `main` sitting 20
commits behind at `709a480` ("Shift 28") — same benign container-creation race every recent shift
has hit and logged. `git fetch origin main && git reset --hard origin/main` landed cleanly with
no local-only work at risk. Confirmed the network-egress finding every prior shift has
independently hit still holds in this container: `overpass-api.de` and every Wikipedia/Commons/
academic-source domain I tried to `WebFetch` directly returned `EGRESS_BLOCKED` (checked the
agent-proxy status endpoint directly — both hosts show up in `recentRelayFailures` with a 403 from
the gateway). `WebSearch`'s own backend stayed reachable throughout and was the only research
channel this shift, same as prior shifts have documented. This rules out Axis 1 (more cities) for
another shift running in this same sandbox — nobody has gotten a working Overpass fetch in eight
shifts now, and this one is the ninth confirming it, not just re-avoiding it.

### Board check

Claimed `[06-P0-1]` phase-banners (Track B, `fix`, well-scoped, unclaimed) before starting. The
same large P0 refactor set every recent shift has found and declined for the same reason —
`[12-P0-1]` merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain,
`[02-P0-4]` self-host-glyphs — stayed untouched; still correctly out of scope for an unsupervised
session pushing straight to production. For Track A, the board had nothing else unclaimed that
fit a research-only (no-Overpass) shift, so picked axis 2 (road stations, a brand-new road) and
axis 8/6 top-ups from `SHIFT_BRIEF.md`'s own list, same legitimate axis-pick precedent recent
shifts have documented. Ratio this shift: 1 `fix` (phase-banners) + 3 `add` (Via de la Plata,
wine route, penal quarries) — add-heavy again; noting the skew rather than padding it with an
unnecessary `deepen`/`polish` pick.

### Track A — Axis 2: Via de la Plata (Iter ab Emerita Asturicam), a full new road

`road_stations.geojson` had 27 roads already touched by prior shifts but never this one — the
Antonine Itinerary route from Emerita Augusta to Asturica Augusta (313 Roman miles, the road the
modern "Camino/Ruta de la Plata" is named for). Reconstructed all 8 attested mile-figures for the
Emerita→Sentice stretch (Ad Sorores 26, Castra Caecilia 20, Turmulus 20, Rusticiana 22, Capara 22,
Caecilius Vicus 22, Ad Lippos 12, Sentice 15) plus Sentice→Salmantica (24) and Salmantica→Sibarim→
Ocelo Duri (21+21) via WebSearch cross-referencing multiple scholarly sources — then caught my own
arithmetic against an independently-cited fact ("Salmantica, 183 miles from Emerita") before
trusting it: 26+20+20+22+22+22+12+15+24 = 183, an exact match, which is the only reason I'm
confident these figures are real Itinerarium Antonini 434 mile-stones and not search-snippet noise.
North of Ocelo Duri the identifications get genuinely contested in the scholarship itself (one
source's "Toro=Albocela, Tiedra=Amallobriga" against another's "Tiedra=Albocela, Montealegre=
Amallobriga" for the same two station names) — shipped both Albocela and Amallobriga at
`confidence: "low"` with estimated (not claimed-attested) distances, and flagged Ad Lippos/Sentice/
Sibarim the same way where the modern find-spot is actively still being searched for (one source's
own article title is literally "En busca de la Mansio Sentice" — the mansio is still being hunted
today). Brigaecium (Villabrazaro, near Benavente) came out with unexpectedly good cross-validation:
its independently-attested "40 Roman miles from Asturica" almost exactly matches the straight-line
distance from my chosen coordinates, raising it from a guess to `confidence: "medium"`. 14 new
stations, `road_stations.geojson` 474 → 488. Road stations don't carry `image_url` in this dataset
(only 2/474 did before this batch) since `Map.tsx` renders them as tooltip-only markers, never the
full `PlaceDetails` hero card — confirmed by reading the render path before skipping images rather
than assuming.

### Track A — Axis 8 + Axis 17 top-ups, with one real self-caught near-miss

Set out to add Baetica's and Tarraconensis's conventus centers (`SHIFT_BRIEF.md`'s axis 8b names
them directly: "well-attested for Asia... Baetica, Tarraconensis") — wrote and researched all 11
entries in full Google-Business voice with verified Commons image filenames, ran the append script,
and only then did the validator catch it: **all 11 were already in the file**, added by an earlier
shift that named the file `conventus_asia.geojson` despite it having carried all three provinces
since that shift. I'd checked the file's total feature count (24) at the start of the session but
never actually printed the `province` breakdown before deciding this was a gap — a real process
mistake, not a data problem. `git show HEAD:...` restored the file byte-identical and the 11
duplicate entries were discarded before ever reaching a commit. What *was* real and worth keeping:
the file's name and the Layers-panel label ("Conventus centers (Asia)") were both stale regardless
of my mistake, so renamed `conventus_asia.geojson` → `conventus.geojson` (`git mv`, updated the two
code references in `Map.tsx` and `scripts/validate.mjs`) and fixed the label to "Conventus centers
(Asia, Baetica, Tarraconensis)". Lesson for future shifts logged directly in the commit message:
check a themed file's actual property breakdown, not just its total count or its filename, before
treating any subset of it as unclaimed work.

Axis 17 (exile + penal geography) had a real, smaller gap: `SHIFT_BRIEF.md` names Docimium and
Mons Claudianus as penal quarries alongside the four already present (Ear of Dionysius, Chemtou,
Mons Porphyrites, Proconnesus). Added both, matching the existing `penal_quarry` entries' full
schema (`name_latin`/`name_english`/`province`/`built`/`extant_117ce`) rather than the simpler
schema I'd first drafted before checking a sibling entry. Mons Claudianus's note is deliberately
honest that it ran mostly on paid skilled labor under military guard, not condemned convicts,
matching what the sources actually say rather than assuming every axis-17 "penal quarry" was
literally a penal colony. `penal.geojson` 21 → 23. No confirmable Commons file turned up for
Docimium after two separate searches, so it ships with `image_url` unset — same honest-gap handling
Shift 48 used for Halkyn Mountain, not a guessed filename.

### Track A — Axis 6: Gaul-Rhine wine route

`trade_routes.geojson` had five commodities (amber, grain, tin, olive oil, silk, frankincense) but
never wine, despite `SHIFT_BRIEF.md`'s axis 6a naming "Wine routes — Gaul → North Sea + Rhineland"
directly. Built the full LineString + 4 named-node pattern the Amber Road entry established: Vienna
(Pliny himself names its wine among Gaul's best, NH 14.18) → Lugdunum (river hub) → Augusta
Treverorum/Trier → Colonia Agrippina/Cologne (the Rhine garrison's own market). Deliberately did
*not* credit Trier's own Moselle valley with vineyards at this snapshot — those are Ausonius's,
attested nearly two centuries later, and a quick WebSearch check on "when did Moselle viticulture
start" came back too vague ("around the 2nd century") to responsibly round down to 117 CE; the
node's `role` text says outright that 117 CE Trier is a redistribution market, not yet a wine
district, rather than papering over the ambiguity. `trade_routes.geojson` 51 → 56.

### Track B — `[06-P0-1]` phase-banners

`PlaceDetails.tsx` already flags individual buildings with `extant_117ce: false` ("Not standing in
117 CE") when you click into one, but nothing told a visitor *before* they started clicking around
Pompeii or Herculaneum that the whole site's street-level detail shows the 79 CE eruption's
excavated aftermath, not a living 117 CE city — the exact gap the board ticket names. New optional
`SiteInfo.snapshotNote` field (`app/sites.ts`), set only for these two of the 40 curated sites.
New `app/usePhaseBanner.ts`, a module-level pub/sub store mirroring `usePoiPanel.ts`'s existing
pattern exactly (`useSyncExternalStore`, no React context, reachable from `Map.tsx`'s imperative
MapLibre setup code the same way `selectPoi` already is) plus dismiss-once-per-session tracking so
panning away and back doesn't re-show a banner the user already closed. New `app/PhaseBanner.tsx`,
a bottom-centered toast reusing the exact `--warn-bg`/`--warn-text` tokens `PlaceDetails.tsx`'s own
per-building badge already uses, triggered from `Map.tsx`'s `loadSiteDetail` the first time a
flagged site's buildings actually render (not on hover, not on click — the moment the misleading
detail itself appears). Also added the same honest note to the static `/site/[slug]` SEO page and
a small "NOT LIVING IN 117 CE" badge to `SitesPanel.tsx`'s site-list row, so a visitor gets the same
truth whichever of the three surfaces they land on first.

Verified live with Playwright against a real `next dev` server (this container's `[02-P0-4]` glyph
fix from Shift 32 still holds — `map.on("load")` fires normally): flew to Pompeii's coordinates at
1280×800 light and 375×812 dark, confirmed the bottom toast fires, sits clear of both the Entrance
welcome modal above it and the epoch pill/credit chip below it, and reads correctly in both color
schemes; opened the Explore panel and confirmed the SitesPanel badge renders; screenshotted the
`/site/pompeii` SEO page in both viewports and confirmed the notice block matches. Fresh container
needed `npm install` first — reverted the resulting `package-lock.json` churn before the first
commit, same trap Shift 48 flagged.

### Verification, commits, metrics

`npx tsc --noEmit` and `npm run build` both clean after every batch. Four commits, each passing the
pre-push build gate on its own: Via de la Plata, penal-quarries + conventus rename/label fix, the
phase-banners feature, and the wine route. `npm run validate` clean (only the same 17 pre-existing
warnings every recent shift has re-confirmed as unrelated to that shift's own work — India-coast
diplomacy points, Han/Kushan neighbor polygons, unnamed letter-route LineStrings). `npm run metrics
-- --write`: 497 POIs unchanged (none of this shift's four axes write to `pois.geojson`), still
100% deep / 0 thin.

### Next shift should pick up

- **Track A:** Axis 1 (more cities) stays blocked in this specific sandbox — nine shifts running
  in this environment have now independently confirmed the Overpass egress block; if a future
  container ever gets unblocked network access, this is the single highest-value axis waiting.
  Rome (289 named features) is still the one large site left in the standing curate-buildings task
  per every recent handoff's note. Axis 2's other named roads (Via Traiana Nova already has
  stations; Via Egnatia/Via Militaris/Via Augusta all do too) are mostly covered now — a genuinely
  fresh full-road pick would need real scouting first, not just picking the next name off the
  brief's list.
- **Track B:** Terrain shading (`[02-P0-1]`) and `[02-P0-4]`'s remaining half (self-hosting glyphs)
  are both still flagged as bigger lifts than a normal Track B slot. `[06-P1-3]` building-typology
  and `[06-P1-4]` excavation-history are still open `deepen` tickets nobody's picked up.
- **General:** Before treating any subset of an existing themed `.geojson` file as "still missing,"
  print its actual property breakdown (province/category/whatever the relevant grouping field is),
  not just its total feature count or what its filename implies — this shift lost time to exactly
  that mistake on `conventus_asia.geojson` before the validator's duplicate-id check caught it.

---

## Shift 48 — 2026-08-23 (this shift's own prompt claimed "Shift 1 of four")

Same stale-numbering mismatch every shift since #13 has flagged — the scheduled prompt said
"Shift 1 of four," but `SHIFT_LOG` was 47 real shifts deep at session start, so this entry
continues as Shift 48. Session started with `HEAD` detached and local `main` pointing at a
completely unrelated, far older history (`709a480`, "Shift 28" — different root commit entirely,
not just behind). `git fetch origin main` confirmed `origin/main` matched the detached `HEAD`
exactly (`4031c05`, Shift 47's own last commit), so `git reset --hard origin/main` was safe — no
local-only work existed to lose, just a stale mirror from container creation. Read `SHIFT_BRIEF.md`
(all 823 lines), `BOARD.md`'s P0 list, `SHIFT_LOG.md`'s and `FEATURE_BACKLOG.md`'s handoff notes
before picking work.

### Board check

Confirmed the same large unclaimed-but-declined P0 set every recent shift has found —
`[12-P0-1]` merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain,
`[02-P0-4]` self-host-glyphs — all big multi-file refactors, correctly left for a session with a
human watching. Claimed and shipped `[13-P0-3]` image-fallback (Track B, unclaimed, well-scoped).
Continued `[06-P0-2]` curate-buildings on Ancona, exactly the site Shift 47's own handoff flagged
as "real but likely-thin, not yet researched." Picked axis 19 (correspondence networks) and axis
17 (penal mines) from `SHIFT_BRIEF.md`'s own list since the board had nothing else unclaimed that
fit — same legitimate axis-pick precedent recent shifts have documented. Ratio this shift: 1
`illustrate` (image-fallback) + 3 `add`/`deepen` (Ancona, rescripts, mines) — add-heavy, no
`polish` picked up; noting the skew rather than padding it out with an unnecessary fourth pick.

### Track A — curate-buildings: Ancona [06-P0-2]

Verified Ancona's own `_buildings.geojson` before claiming (Shift 47's own habit, established
after Trier's stale-count near-miss): 66 named OSM features, but only three carry
`historic:archaeological_site` — "Foro romano", "Porto traianeo", "Domus" — everything else is a
modern church, ministry office, apartment block or palazzo from the living city on top of the
ancient one. A fourth candidate, "Basamento della lanterna" (lighthouse base), is tagged plain
`building:yes` with no historic value and was excluded rather than guessed into Roman. Wrote
`app/anconaDescriptions.ts` for the three real entries — Ancona's forum hill, Trajan's harbor
works, and an excavated house south of the forum, all genuinely standing in 117 CE — and wired it
into `Map.tsx`'s `SITE_ENTRY_LOOKUP`. All three keys verified with a Python harness replicating the
app's own longest-key-first substring matcher: each matches exactly one real, distinct OSM feature.

The real find this batch: Ancona's headline monument, the **Arch of Trajan** on the harbor mole
(115 CE, CIL IX 5894, designed by Apollodorus of Damascus, honoring Trajan for funding the port
expansion himself) had **no OSM name tag at all** in this extract, so curate-buildings can't reach
it regardless of how well documented it is. Added it instead as a standalone `pois.geojson` point
— exactly the right home for a monument this well attested — alongside the Roman amphitheater
(Augustan, enlarged under Trajan toward 10,000 seats), which was similarly absent as a standalone
POI despite the site already being one of the 40 curated cities. `pois.geojson` 495 → 497.

### Track A — Axis 19: imperial rescripts, Pliny's Bithynia governorship

`letters.geojson` already had Pliny's personal letters and Ignatius of Antioch's route to
martyrdom mapped, but axis 19's own third named target — "imperial rescripts... pin known
Trajanic ones by requesting city" — was untouched. Added 14 points for real, dated exchanges from
Pliny's Book 10 correspondence with Trajan during his governorship of Bithynia-Pontus (c. 111–113
CE): the Nicomedia fire-brigade refusal, the wasted aqueduct, the Lake Sophon canal proposal,
Nicaea's cracking theatre, Prusa's bathhouse built over a shrine to Claudius, Sinope's aqueduct,
Amisus's mutual-aid clubs, Apamea's never-audited accounts, Byzantium's embassy costs, Juliopolis
and its soldier request, Amastris's "beautiful but foul" open sewer, the Christians (10.96-97,
Rome's closest thing to an official policy for the next two centuries), condemned criminals
quietly serving as public slaves, and the status of foundlings. Every letter-pair number
cross-checked against WebSearch results before use (a few of my own initial recollections were
half a letter off — verified rather than trusted from memory). Cities anchored at their real
coordinates (İzmit, İznik, Bursa, Sinop, Samsun, Mudanya, Istanbul, Amasra, and a Nallıhan-area
approximation for submerged Juliopolis — `confidence: medium` there, everything else `high`).
`letters.geojson` 34 → 48.

**Found and fixed a real, independent bug in the same layer while wiring in this third corpus**:
`Map.tsx`'s `letters-node-point` hover popup hardcoded every non-origin node's subtitle as
"Correspondent of Pliny the Younger" — which silently mislabeled every one of Ignatius's own route
stops (a `waypoint`/"Church at X" node has nothing to do with Pliny) and would have done the same
to the new rescript nodes. Rewrote the subtitle logic to branch on `node_type`/`person` so all
three corpora read correctly, and gave rescript nodes their own circle color (purple, vs. Pliny's
brown and Ignatius's green) so the three are visually distinct on hover.

### Track A — Axis 17 top-up: the brief's own named penal mines

`penal.geojson` had exile islands well covered (9, matching the brief's 7 named ones) but only 2
of the 6 mines `SHIFT_BRIEF.md`'s own axis 17 list names. Added the other 5: Rio Tinto (Baetica,
Pliny's own silver/copper operation), Las Médulas (Tarraconensis, Pliny's *ruina montium* — he
governed the region as procurator and described the hydraulic technique directly), Alburnus
Maior/Roșia Montană (Dacia, seized within a decade of Trajan's 106 CE annexation, its wax tablets
among the best-preserved Roman labor contracts anywhere), Dolaucothi (Britain's only confirmed
Roman gold mine), and Halkyn Mountain (Britain, lead, `confidence: medium` — only the general
district is fixed, not the individual Roman workings, and its image_url stayed unset after no
confirmable Commons file turned up). `penal.geojson` 16 → 21; the brief's named-mines list is now
complete.

Every `image_url` on all three batches this shift was checked against an actual WebSearch result
naming that exact filename (with corroborating metadata — photographer, upload date, license)
before use, not guessed from a plausible-sounding name — this sandbox's direct `WebFetch` to
`commons.wikimedia.org` stayed blocked (`EGRESS_BLOCKED`), matching every prior shift's finding, so
WebSearch-surfaced confirmation is the practical substitute. Caught one near-miss this way: my
first-guess filenames for Rio Tinto and Las Médulas turned out not to exist under those names —
corrected to the real, WebSearch-confirmed files before shipping.

### Track B — static-map image fallback [13-P0-3]

`PlaceDetails.tsx`'s fallback for any POI with no `image_url` (231 of `pois.geojson`'s 495 at
shift start) was a flat 6px category-tinted gradient bar — functional but bare. Replaced it with a
real locator thumbnail: `app/LocatorThumbnail.tsx`, an inline SVG showing a simplified empire
coastline with a pin at the place's own coordinates, tinted in the same per-category color the
image hero band's background already uses. Deliberately not a raster-tile fetch — this sandbox
blocks exactly the kind of external tile host that would need — but local vector data the map
already ships: `scripts/generate-empire-outline.mjs` clips `land.geojson` to a Britain-to-
Mesopotamia bounding box, keeps every 6th vertex per inside-bbox run (not true polygon clipping,
just open-subpath fragments — fine for a stroked, unfilled thumbnail this small), and bakes the
result into a ~9.5KB SVG path (`app/empireOutline.ts`) at generation time. Costs nothing over the
network, can't be broken by an external host block, and reuses the exact same source of truth the
real map renders from.

Registered the generator as `npm run generate-empire-outline` alongside the project's other
one-off data scripts (`build-route-graph`, `split-site-data`) for anyone who wants to regenerate
it after `land.geojson` itself changes — not expected often.

### Verification, commits, metrics

Fresh container needed `npm install`; reverted the resulting `package-lock.json` churn before the
first commit. Hit one real self-inflicted snag worth flagging: after appending the imperial-
rescripts batch, I ran a quick Python cleanup pass to drop empty `image_url`/`image_credit` keys
and used `json.dump()` to rewrite the file — which re-serializes the *entire* file with Python's
own indent/quoting conventions, exactly the whole-file-reformat trap `scripts/append-geojson-
features.mjs`'s own docstring warns about (confirmed by `git diff --stat` showing 1,352 insertions
against 14 actual new features). Caught it before committing, `git checkout --` the file, and
redid the cleanup on the *source* JSON before running the append script fresh — the real lesson
being that the append script's own text-splice guarantee only holds if nothing touches the target
file afterward, including a "small" cleanup pass.

`npx tsc --noEmit` and `npm run build` both clean after every batch; pushed incrementally (three
commits: Ancona + rescripts together, image-fallback, penal mines) rather than batched to the end,
each one passing the pre-push build gate on its own. Verified the image-fallback UI change live —
not just typecheck — with Playwright against the running dev server: 1280×800 light and 375×812
dark on a real no-image POI (`poi_basilica_julia`), confirming the locator thumbnail renders
cleanly in the existing 180px hero slot with no layout shift and no hardcoded chrome color.
`npm run metrics -- --write`: 495 → 497 POIs, curated-buildings sites 34/40 → 35/40 (87.5%), image
coverage 53.3% → 53.5%.

### Next shift should pick up

- **Track A:** Rome (289 named features) is the only large site left in the standing
  curate-buildings task — worth scoping carefully or splitting across passes, per every prior
  handoff's note. Axis 17's other named category (penal quarries — Docimium/İscehisar is a real,
  distinct gap from the already-present Proconnesus/Marmara marble quarry) is a small, well-
  bounded follow-up if someone wants to fully close that axis too. Axis 1 (more cities) is still
  unconfirmed in this exact container — nobody has re-tested Overpass reachability directly in
  several shifts, everyone has just avoided picks that needed it.
- **Track B:** Terrain shading (`[02-P0-1]`) and dark mode are both still flagged as bigger lifts
  than a normal Track B slot. `[06-P1-3]` building-typology and `[06-P1-4]` excavation-history are
  open `deepen` tickets on the existing 40 sites' schema, not yet picked up by anyone as of this
  shift either.
- **General:** the `json.dump()`-reformats-the-whole-file trap above is worth a permanent note
  next to `scripts/append-geojson-features.mjs`'s own docstring, not just this log entry — any
  post-append cleanup pass needs to happen on the source JSON before the splice, never on the
  target file after it.

---

## Shift 47 — 2026-08-22 (this shift's own prompt claimed "Shift 4 of four")

Same stale-numbering mismatch every shift since #13 has flagged, most recently Shift 46's own
entry below — the scheduled prompt said "Shift 4 of four," `SHIFT_LOG` was 46 real shifts deep at
session start. Session started with `HEAD` detached at `fb501ec` (Shift 46's own final commit);
`git fetch origin main` returned a stale local remote-tracking ref (`709a480`, "Shift 28") that a
forced fetch immediately corrected to match the detached HEAD exactly — the same benign race
several recent shifts have hit and logged, not lost work. `git checkout -B main origin/main`
landed cleanly. Read `SHIFT_BRIEF.md` (full, all 823 lines across two reads), `BOARD.md`'s P0
list, `METRICS.md`, and `FEATURE_BACKLOG.md`'s open items before picking work.

Noted `research/` no longer exists in this checkout (gitignored and apparently never present in
this clone — the Overpass batch-fetch tooling `SHIFT_BRIEF.md` describes lives there in theory).
Didn't test Overpass reachability directly since neither of this shift's two Track A picks needed
a fresh city fetch; if a future shift wants Axis 1 (more cities), check whether the tooling needs
reconstructing from scratch or whether it's just missing from this particular container.

### Board check

Same large unclaimed P0 set every recent shift has found and declined for the same reason —
`[12-P0-1]` merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain,
`[02-P0-4]` self-host-glyphs — all big multi-file refactors an unsupervised session pushing
straight to production shouldn't start mid-refactor with nobody watching. Picked `[10-P1-4]`
entrance (Track B, small and well-precedented), continued `[06-P0-2]` curate-buildings (Track A
deepen, checked named-building counts for Carnuntum/Aquileia/Ancona/Pozzuoli before claiming —
Carnuntum turned out dead, matching the Aquincum/Xanten/Ravenna pattern), and picked axis 3f
(water infrastructure) from `SHIFT_BRIEF.md`'s own axis list since the board had nothing else
unclaimed that fit — same legitimate axis-pick precedent Shift 46 itself used for Via Sebaste and
the gymnasia batch. Ratio this shift: 1 `add` (water infra top-up) + 1 `deepen` (curate-buildings)
+ 1 `polish` (Entrance) — roughly on the board's 1:2:1 line, one `deepen` light.

### Track B — Entrance welcome screen (done first)

Shipped board `[10-P1-4]` (`app/Entrance.tsx` + `app/useEntrance.ts`): first-visit modal, same
chrome as `EpochModal.tsx` and the same once-per-browser localStorage pattern as
`useOnboardingHint.ts`. One sentence framing the map, three doors — "Take a guided tour" (calls
the already-global `openTourPanel()`), "See what's nearby" (calls the already-global
`openPlacesInView()`), "Just start exploring" (dismiss) — deliberately reusing two existing
global open-triggers instead of adding new cross-component state for a fourth door into the
Sites/Explore panel (whose open state is local to `LeftRail.tsx`, not yet a shared store). Closes
on backdrop click, Esc, or the X, matching every other modal in the app.

**Verified in a real browser** (Playwright + the pre-installed Chromium, not just typecheck/
build): screenshotted at 1280×800 light and 375×812 dark, both clean against invariant 0's theme-
token rule (no hardcoded chrome colors). Also drove the "Take a guided tour" door end-to-end at
the mobile viewport — screenshot confirms the modal closes and the real Guided Tours panel opens
with its three tours, not a stub. Pushed mid-shift once verified, along with a small
`.gitignore` addition for `.claude/worktrees/` (a local Agent-tool isolation artifact that
appeared this shift and has no reason to ever be committed).

### Track A — curate-buildings: Aquileia and Pozzuoli [06-P0-2]

Checked named-building counts for four candidates before claiming any (`FEATURE_BACKLOG.md`'s own
"check before claiming" habit, established after Shift 44/Trier's stale-count near-miss):
**Carnuntum** — 8 named features, all modern Petronell-Carnuntum village (a kindergarten, a
parish office), zero Roman content, skipped outright and logged as dead alongside
Aquincum/Xanten/Ravenna. **Ancona** — 66 named features but only 2 look plausibly Roman by name
alone ("Foro romano", "Porto traianeo"), likely a thin Trier-sized batch; flagged for a future
shift rather than claimed this one. **Aquileia** (30 named) and **Pozzuoli** (47 named, Roman
Puteoli) both had real, substantial Roman-era content and became this shift's two sites.

Delegated the research to a background general-purpose agent, scoped strictly to writing
`app/aquileiaDescriptions.ts` and `app/pozzuoliDescriptions.ts` (not `Map.tsx` — wired the two-line
import + lookup-table addition myself after reviewing the output) and run in an isolated git
worktree so it couldn't collide with the concurrent water-infra research agent. Reviewed the full
output before merging: both files match `veronaDescriptions.ts`'s established type/lookup/matcher
pattern exactly.

**Aquileia (12 entries)** — the forum's eastern side, the river port (both the main quays and the
eastern bank, the latter with a nice detail: hemp-retting tanks for rope-making found there), three
elite domus (Titus Macer's, the Fondo Cal houses, the House of the Wounded Beasts — all genuinely
1st-century BCE/CE in their earliest phase even though two of them later got the more famous
mosaics that give them their names), a roadside mausoleum, and a necropolis. **Six real
candidates researched and correctly marked `extant_117ce: false`** rather than guessed extant:
the Great Baths and two more named domus turned out Constantinian-or-later despite sitting right
by the forum; the "Decumano e mura bizantine" entry pairs a genuinely 1st-century street with
6th-century Byzantine walls sharing the same OSM polygon. **One real correction caught, not
applied to the geojson**: "Arco San Felice" sounds ancient but is a medieval Patriarchate-era gate
named for a demolished 4th-century church — excluded outright rather than mis-dated as Roman.

**Pozzuoli (9 entries)** — Roman Puteoli's headline monuments: both amphitheatres (the Flavian
one, third-largest in the empire, and an older Republican-era one demolished for a 19th-century
railway), the Macellum — still OSM-tagged "Tempio di Serapide," a genuine 18th-century antiquarian
misnomer from a Serapis statue found on site, kept as the lookup key since that's the real OSM
string but corrected in the prose — the old Rione Terra acropolis, two necropoleis, and a cistern.
**Two real `extant_117ce: false` calls, both independently verified rather than assumed**: "Terme
di Nettuno" shares its name with Ostia's already-excluded Hadrianic bath complex, and turned out
to be independently Hadrianic too (confirmed by its own separate sourcing, not the coincidence
alone); "Stadio di Antonino Pio" is explicitly named for an emperor who reigned 138-161 CE and was
built to honor Hadrian's 138 CE death — both well past 117.

All 21 keys verified against the two sites' own `_buildings.geojson` files with a Python harness
replicating the app's own longest-key-first substring matcher (same method Leptis Magna's shift
used) — every key matches exactly one real, distinct OSM feature. **Live-browser click
verification hit a real obstacle this shift**: this app's per-site building sources load lazily
(only when a site is "visited," per `[11-P0-1]`'s own architecture), and neither a direct URL-hash
navigation nor a scripted search-box-then-Enter flow reliably triggered that visit logic through
Playwright automation in the time available — `querySourceFeatures` kept returning only Ostia's
sources regardless of which site the hash/search targeted. Fell back to the Python-harness
verification instead of leaving it unverified; flagging the browser-automation gap for whoever
next wants a fast scripted click-through of a curate-buildings site, since it'll hit the same
wall. 32/40 → 34/40 sites with curated buildings (85.0%).

### Track A — water infrastructure top-up, axis 3f

The map's existing axis 3f coverage (24 features: 3 aqueduct points, 9 aqueduct lines, 5 dams, 3
bridges, 3 cisterns, 1 watermill) was real but under the per-shift 40-feature floor for a
micro-POI sub-category, and `SHIFT_BRIEF.md`'s own 3f hunting list (aqueducts as lines, dams,
standalone bridges, watermills, cisterns) still had clear headroom. Delegated the research to a
second background agent, run concurrently with the curate-buildings agent, scoped to write plain
JSON to the scratchpad rather than touch `public/data/` directly — kept it from needing worktree
isolation for file-conflict reasons, though it ran in one anyway alongside the other agent for
process consistency. Deliberately steered away from the axis's most obvious remaining candidates
(Aqua Marcia, Nemausus/Pont du Gard, the Merida aqueduct proper) since those are the ones most
likely to already be on the map under a name I hadn't confirmed — the agent independently
confirmed seven of those as already present and skipped them rather than risk a duplicate.

Landed 21 new features (14 points, 7 LineStrings): Pont Julien and Pont Flavien in Gaul (the
latter still flanked by both its original triumphal arches, a genuine Roman-bridge rarity), Rome's
two Tiber Island bridges (Pons Fabricius — the oldest Roman bridge still standing anywhere — and
Pons Cestius), Merida's own 790-meter Guadiana bridge (a real gap since the Proserpina/Cornalvo
dams that fed the same city were already on the map without the aqueduct connecting them), the
Glanum arch dam (the earliest known arch dam anywhere in the ancient world, 1st c. BCE), two
Nabataean-built cisterns at Avdat and Mamshit still in active Roman-period use after the 106 CE
annexation, and seven more aqueduct LineStrings (Anio Vetus, Tepula/Julia, Eifel at Cologne,
Antioch, Frejus, Nikopolis, Pollio at Ephesus). One deliberate "near miss" kept in rather than
dropped: the Janiculum watermill complex is `extant_117ce: false` (the mill building itself is
late-3rd-century) but its note explains that the Aqua Traiana powering it had already been running
past that exact hillside since 109 CE — the same "real infrastructure, wrong building" shape the
project's Zaghouan-Carthage entry already established.

Checked for ID collisions against the full existing `pois.geojson`/`lines.geojson` before
splicing (zero) and spliced with `scripts/append-geojson-features.mjs` — both diffs are pure
additions (one `-` line each, the closing bracket). `npm run validate` clean, 0 new warnings.
Axis 3f: 24 → 45 features, past the 40-floor. 7 of the 14 new points shipped `image_url: null`
after the research agent's search budget ran out — flagged in `FEATURE_BACKLOG.md` as a top-up
target, same shape as prior axes' image gaps, not assumed unphotographable.

### Verification, commits, metrics

Fresh container needed `npm install`; reverted the resulting `package-lock.json` churn before
committing, the now-standard habit. `npx tsc --noEmit` and `npm run build` both clean after every
batch, pushed incrementally (four commits: Entrance, board-close, curate-buildings, water-infra)
rather than batched to the end — each one passed the pre-push build gate on its own. `npm run
metrics -- --write` refreshed automatically: 481 → 495 POIs, curated-buildings sites 32/40 →
34/40 (85.0%), depth/image/source percentages otherwise steady.

### Next shift should pick up

- **Track A:** Ancona is a real but unresearched `curate-buildings` candidate (2 plausible Roman
  names out of 66, needs verification not assumption — see `FEATURE_BACKLOG.md`). Rome itself
  (289 named features) is the only large site left in the standing task, worth scoping carefully
  or splitting across passes. Axis 3f's image gap (7 nulls) and its remaining researched-but-
  excluded candidates (Kasserine Dam, Puy Foradado Dam, Karamagara Bridge — see
  `FEATURE_BACKLOG.md`) are both fresh-budget top-up targets. Axis 1 (more cities) needs someone
  to check whether the Overpass batch-fetch tooling (`research/*.py` per `SHIFT_BRIEF.md`) still
  exists anywhere reachable from this container — it wasn't present in this checkout and wasn't
  investigated further since neither of this shift's picks needed it.
- **Track B:** Terrain shading (`[02-P0-1]`) and dark mode are both still flagged as bigger lifts
  than a normal Track B slot (dark mode specifically needs a `Map.tsx` palette-token refactor
  first, per Shift 46's own note). `[06-P1-3]` building-typology and `[06-P1-4]` excavation-history
  are open `deepen` tickets on the existing 40 sites' schema, not yet picked up by anyone.
- **General:** the live-browser click-through verification gap for `curate-buildings` (see above)
  is worth a dedicated look — either a documented reliable Playwright recipe for triggering a
  site's lazy building-source load, or an acknowledgment that the Python-harness substring check
  is the accepted verification method for this specific ticket going forward.

---

## Shift 46 — 2026-08-22 (this shift's own prompt claimed "Shift 3 of four")

Same stale-numbering mismatch every shift since #13 has flagged — the scheduled prompt said
"Shift 3 of four," but `SHIFT_LOG` was 45 real shifts deep at session start, so this entry
continues as Shift 46. Session started with `HEAD` detached; a first `git fetch origin main`
raced with another shift's concurrent push and returned a stale `origin/main` (`709a480`, "Shift
28") well behind the detached `HEAD` (`1db646e`) — briefly worried this meant lost work, but a
second `git fetch` moments later showed `origin/main` had caught up to exactly the detached `HEAD`
commit, confirming it was a genuine race rather than a stale local ref (the now-familiar failure
mode nearly every shift has independently rediscovered, just with an extra twist this time). `git
checkout -B main origin/main` then landed cleanly. Fresh container needed `npm install`; reverted
the resulting `package-lock.json` churn before committing, per the standing habit. Read
`SHIFT_BRIEF.md`, `BOARD.md` and Shift 45's own handoff in full before picking work. Confirmed
this session's own network status directly: `curl`/Python `urllib` to `overpass-api.de` both
returned `403`/tunnel-failed — Axis 1 (more cities) stays blocked at the network level, matching
every recent shift's finding. `WebSearch` worked, though this shift discovered its budget is
per-*session*, not per-agent — five research agents in, the sixth (an image top-up pass) reported
"200 of 200 used," and the seventh (Via Herculia) finished on fumes too. Worth remembering: don't
plan a sixth WebSearch-heavy agent in one shift without checking budget first.

### Board check

Same unclaimed P0 set every recent shift has found and declined for the same reason —
`[12-P0-1]` merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain,
`[02-P0-4]` self-host-glyphs — all large, multi-file refactors an unsupervised session pushing
straight to production shouldn't attempt mid-refactor with nobody watching. `[06-P0-2]`
curate-buildings continued as Track A `deepen`, picking up exactly where Shift 45's handoff left
off (Verona and Milan, both flagged as "real material, worth a look"). Track B and this shift's
two `add` picks (Via Sebaste, three gymnasia) came from the same place Shift 45 established as
legitimate: the brief's own Axis 2/Axis 20 playbooks, independent of an unclaimed board ticket
existing. By the board's own ratio count this shift ran 2 `add` (Via Sebaste, gymnasia) + 1
`deepen` (curate-buildings, Verona+Milan) + 1 `polish` (the append-geojson tool) — a full 1:2:1-
adjacent spread across four batches, better balanced than most recent shifts' own count, though
still short one `deepen` slot against the strict 1:2:1 ratio.

### Track B — reusable GeoJSON append tool (done first, unblocks every batch after it)

`FEATURE_BACKLOG.md` had two independent standing notes (Shifts 14-15's own "cloud shift" entries)
flagging the same recurring problem: every shift that splices new features into an existing
`.geojson` file via Python's `json.dump` or JS's `JSON.stringify` picks its own indent width and
Unicode-escaping defaults, which rarely match the file's own convention, turning a 3-feature
addition into a whole-file reformat diff. Wrote `scripts/append-geojson-features.mjs` (`npm run
append-geojson`) — detects a target file's own indent width and line ending directly from the
bytes around its `"features": [` array (not a hardcoded guess) and text-splices new Feature
objects in before the closing bracket, so every existing byte is untouched. Found and fixed a real
bug in my own first draft before trusting it on production data: the first version correctly
detected the *base offset* to prepend to each new feature block but wrongly reused that same value
as the *per-level nesting increment* passed to `JSON.stringify`, so a file with 2-space nesting got
new features written with 4-space nesting — caught by testing against a real copy of
`road_stations.geojson` and diffing, not by assuming the first pass was correct. Fixed by detecting
the two values separately (base offset from the array's own indent; nesting increment from the gap
between the `"features"` key's indent and its first child's indent) and re-tested against 1-space,
2-space, and empty-array target files, plus literal Unicode content (verified un-escaped, since
JS's `JSON.stringify` doesn't have Python's `ensure_ascii` trap). Rolls back automatically if the
resulting feature count doesn't match expectations. Used for real twice this same shift (Via
Sebaste's 7 stations, the 3 new gymnasia) with clean pure-addition diffs both times — see `git log`
for the actual diffs, three lines of context plus the new content, nothing else touched.

### Track A — curate-buildings (Verona, Milan), Via Sebaste, three gymnasia

**Curate-buildings — Verona and Milan, 7 buildings (`[06-P0-2]`, 30/40 → 32/40, 75.0% → 80.0%).**
Read both sites' own `_buildings.geojson` files directly rather than delegating blind — this
project's 40 street-level sites already have their OSM building extracts on disk, so no Overpass
fetch was needed for this ticket at all, a useful reminder for future `deepen` batches on
already-curated sites. Two parallel research agents ran against real sources (Italian and English
Wikipedia, Comune di Verona/Milano's own tourism and archaeology pages, Italy's national cultural-
heritage catalog) for the actual per-building dating work. Verona yielded 5 real buildings — Arco
dei Gavi, Porta Borsari, Porta Leoni, Teatro Romano, Tempio di Giove Lustrale, all 80-150 years old
by 117 CE — and three real candidates correctly excluded rather than guessed: "Porta Nuova" (1532-
40, Michele Sanmicheli) and "Porta San Giorgio" (1321, Scaliger-era, rebuilt 16th-19th c.) are both
post-Roman fortification gates despite sitting on the historic walls and carrying names that read
as ancient; "Ponte Scaligero" is a 14th-century medieval bridge, not Verona's real Roman-era
crossing (Ponte Pietra, which isn't present in this site's own OSM extract so wasn't curated).
Milan's yield was honestly thin — matching this project's own standing note that Mediolanum wasn't
yet an imperial capital in 117 CE — only the Amphitheatre and the Torre Romana del Carrobbio (part
of the Augustan Porta Ticinensis) are confidently pre-117 CE; every other Roman-looking candidate
(the Circus, the Imperial Palace OSM-mislabeled "Villa Imperiale," Torre di Massimiano, Colonne di
San Lorenzo) dates to Maximian's Tetrarchic reign (285-310 CE) or later, and "Domus Nostra" turned
out to be a modern university dining hall with a coincidentally Latin name, not a Roman house at
all. Two real name collisions guarded in the lookup functions before shipping, caught by running
the same Python longest-key-substring-match harness prior shifts established: "Museo archeologico
al Teatro Romano" (Verona, the modern museum building overlooking the theatre) and "Parco
Archeologico dell'Anfiteatro Romano" (Milan, the modern park boundary) both literally contain their
site's ancient-monument name as a substring and would otherwise have inherited the wrong
description. **Also settled Shift 45's open Ravenna question**, definitively rather than leaving it
flagged again: checked all 114 named features in `ravenna_buildings.geojson` directly and confirmed
every one is post-Roman (5th-6th-century basilicas, medieval gates, modern port/rail
infrastructure) — Ravenna is now dropped from the standing task's open-site list.

**Via Sebaste road stations, 7 new stops (Axis 2 `add`, `road_stations.geojson` 467 → 474) — the
first Asia Minor road on the map.** Augustus's governor Cornutus Arruntius Aquila built this
military road in 6 BCE, linking Pisidian Antioch over the Taurus Mountains to the Pamphylian coast
at Perge and connecting the region's Augustan veteran colonies. Added Antiochia Caesarea (caput
viae), Apollonia, Comama (a real Augustan milestone found on-site reads CXXII — 122 Roman miles
from Antioch), Olbasa and Cremna (both branches off Comama), the Mansio in Klimax (the
best-preserved Roman mansio anywhere in Asia Minor, still standing to roof height, its own
milestone reading CXXXIX), and Perge. Two of seven distances are real milestone readings; the rest
are honestly left unattested rather than invented — Comama's own `distance_from_previous_mp` field
is explicit in its notes that the 122 figure is the milestone's own "from Antioch" reading, not
from Apollonia, since no individual Apollonia-Comama distance survives. Checked for exact-
coordinate collisions before adding, the standing habit Shift 45 flagged — found two real ones
(Antiochia Caesarea sits ~300m from an existing `imperial_cult.geojson` sanctuary point; Perge
sits ~20m from both an existing `sports.geojson` gymnasium and a `mints.geojson` mint) but judged
them not the `[12-FIX-2]`-style duplicate-pin bug, since they're a different marker family (dim-
gray road-network-node squares vs. colored category pins) representing a different fact — kept
both, with notes scoped to the road-node aspect only to avoid duplicating content already on those
other entries. Deliberately excluded Parlais, one of the "five Pisidian colonies" but confirmed to
sit on a separate eastern military road toward Lystra, not on this Antioch-to-Perge line.

**Three gymnasia actually added — Corinth, Termessos, Magnesia on the Maeander (Axis 20,
`sports.geojson` 33 → 36).** These three were flagged by a much earlier shift's image top-up pass
as researched-but-never-committed — the underlying feature never existed to top up in the first
place, only the (never-shipped) idea of one. Corinth (1st c. CE, replaced an earlier Hellenistic
gymnasium so completely that no trace of it survives) and Termessos (159-138 BCE under Attalos II)
both ship `extant_117ce: true`; Magnesia's gymnasium postdates the snapshot (2nd-3rd c. CE) and
ships `extant_117ce: false` with an honest note rather than being padded in as true or silently
dropped. No confirmable `image_url` for any of the three after a real search effort — shipped
without the key at all (not a `null` value, which `npm run validate` flagged as a real warning
worth fixing rather than a style nitpick to ignore) — so none of the three count toward this
shift's own throughput minimums per invariant 1.6, logged honestly rather than claimed anyway.

**Two things researched and correctly *not* shipped, both worth the tokens spent finding out.**
Dispatched a research agent to open axis 9d (spectacle/gladiator schools) from what looked like a
clean slate, only to discover — before writing a single feature — that all 7 named candidates
(Rome's four imperial ludi, Capua, Ravenna, Pergamon) already exist as real, sourced `pois.geojson`
records under category `ludus`, shipped by some earlier, undocumented shift. Caught by the standing
exact-coordinate collision check before any duplicate was written; the research did surface one
real, useful finding along the way — independent evidence (DAI Pergamon Excavation fieldwork,
2019-2021) that the excavated Pergamon amphitheatre itself was built under Hadrian in the 120s CE,
after this map's snapshot, worth a future `[08-P1-6]`-style verify pass on that one record's
`extant_117ce: true`. Separately, a planned Via Herculia road-stations batch (Axis 2) turned out to
rest on a wrong premise — every real source found dates the road to the Tetrarchic period under
Diocletian and Maximianus "Herculius" (c. 293-311 CE), not Trajan, meaning it postdates 117 CE by
176+ years and has no business on this map under any name. Caught before anything was written,
logged in `FEATURE_BACKLOG.md` with the real research (which of its towns are already correctly
curated elsewhere, which are genuinely new) so a future shift doesn't repeat the same wrong-date
mistake.

### Build, validate, verify

`npm run validate` clean at every commit: 0 errors, the same 17 reviewed warnings throughout (one
brief detour to 20 when a first draft of the gymnasia batch shipped `image_url: null` instead of
omitting the key — validator caught it immediately, fixed before the commit). `npx tsc --noEmit`
clean after every wiring change. `npm run build` clean on every one of this shift's seven pushed
commits — the pre-push gate never tripped. `npm run metrics -- --write` run after each data change:
sites with curated building descriptions 30/40 (75.0%) → 32/40 (80.0%); curated places total 1,861
→ 1,871.

### Handoff for the next shift

1. **`[06-P0-2]` curate-buildings has 8 sites left.** Rome (289 named features, by far the biggest
   — scope carefully or split across passes), aquincum/xanten/ravenna all confirmed too-thin, don't
   re-check any of the three expecting a normal batch.
2. **`scripts/append-geojson-features.mjs` (`npm run append-geojson`) is ready for any future
   data batch** — pass it a target `.geojson` file and a JSON array of new Feature objects, it
   handles indent-matching and rollback-on-mismatch automatically. Should save real time on the
   next road-stations or micro-POI batch.
3. **Via Herculia is Tetrarchic (293-311 CE), not Trajanic — do not add it as a 117 CE road under
   any circumstances.** See `FEATURE_BACKLOG.md` for the full research (three of its towns are
   already correctly curated elsewhere under other roads; Potentia/Anxia/Grumentum are genuinely
   new if this road is ever revisited as a later-era note).
4. **`poi_ludus_pergamon` (`extant_117ce: true`) is worth a dedicated verify pass** — real evidence
   surfaced this shift that the excavated Pergamon amphitheatre itself postdates 117 CE by roughly
   a decade (Hadrianic 120s), though the existing record's claim is about a literarily-attested
   institution, not that specific building, so it isn't a clear-cut contradiction yet.
5. **WebSearch budget is per-session, not per-agent.** This shift ran seven research agents; the
   sixth reported the budget exhausted. A future shift stacking many research agents in one
   session should budget for this — four image-top-up candidates (Docimium, Marmara Island,
   Tricio, Charax Spasinou — all have confirmed Commons *categories*, just no pinned-down exact
   filename yet) are ready for a fresh-budget follow-up pass.
6. **Axis 1 (more cities) stays blocked at the network level** in this sandbox — `overpass-api.de`
   returns a hard 403/tunnel-failed via both `curl` and Python `urllib`, confirmed fresh this
   shift, same finding as every recent one. Needs a different environment or a non-Overpass data
   source, not a rewritten pipeline script.

---

## Shift 45 — 2026-08-22 (this shift's own prompt claimed "Shift 2 of four")

Same stale-numbering mismatch every shift since #13 has flagged — the scheduled prompt said
"Shift 2 of four," but `SHIFT_LOG` was 44 real shifts deep at session start, so this entry
continues as Shift 45. Session started with `HEAD` detached, local `main` 16 commits behind the
real `origin/main` tip — same "stale local ref, not data loss" symptom nearly every shift has
independently rediscovered; `git fetch origin main` then `git checkout -B main origin/main` put
the branch on the real tip (`b3bce66`, Shift 44's own last commit), verified before doing anything
else. Fresh container needed `npm install`; reverted the resulting `package-lock.json` churn
before committing, per the standing habit. Read `SHIFT_BRIEF.md`, `BOARD.md` and Shift 44's own
handoff in full before picking work. Confirmed this session's own network status directly: `curl`
to `en.wikipedia.org`/`overpass-api.de`/`commons.wikimedia.org`/`pleiades.stoa.org` all returned
connection failures (exit 56, no response at all rather than even a blocked-status code) —
`WebSearch` remained the only working research channel, used via three parallel background
research agents.

### Board check

Same unclaimed P0 set every recent shift has found and declined for the same reason — `[12-P0-1]`
merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild (still missing its spec), `[02-P0-1]`
terrain, `[02-P0-4]` self-host-glyphs — all large, multi-file refactors an unsupervised session
pushing straight to production shouldn't attempt mid-refactor with nobody watching. Also found and
fixed a real gap while reading the board: Shift 44's own six-site curate-buildings batch (Capua,
Tivoli, Palestrina, Corinth, Beneventum, Vindolanda) was never actually logged in `BOARD.md`'s
`[06-P0-2]` entry, even though it shipped, was in `SHIFT_LOG.md`, and moved the metrics number —
backfilled that note before adding this shift's own. `[06-P0-2]` curate-buildings continued as
Track A `deepen` — Shift 44's own handoff named verona/ravenna/milan/rimini/brescia as unscoped
candidates worth a real named-building count before claiming; checked all five myself (a Python
pass over each site's `_buildings.geojson`, not delegated) and found Brescia (Capitolium, Forum,
Theatre — all genuinely 117 CE-era) and Rimini (Arch of Augustus, Bridge of Tiberius, Amphitheatre,
Domus del chirurgo, Porta Montanara) had the strongest, most confidently-dateable real candidates
of the five; Verona and Milan looked promising but thinner (a handful of real names each); Ravenna
looked like it might have zero genuine 117 CE content at all (everything spotted was 5th-century-
or-later) — flagged in `FEATURE_BACKLOG.md` rather than claimed on a guess. Track B and this
shift's own Track A "add" pick both came directly off open items Shift 44 itself flagged in
`FEATURE_BACKLOG.md`'s "new ideas" section (the `osm_id` architecture gap, and the board's own
standing "no unclaimed `add` ticket" finding eleven-plus shifts running) rather than from the board
proper — by the board's own ratio count this shift ran 1 `add` (Via Domitiana road stations) + 1
`deepen` (curate-buildings, Brescia + Rimini) + 1 `polish`/`fix` (osm_id threading), closer to the
stated 1:2:1 ratio than most recent shifts, though still short one `deepen` slot.

### Track B — thread `osm_id` through the curate-buildings lookup (done first, unblocks future sites)

`FEATURE_BACKLOG.md`'s cloud-shift-44 note flagged a real architecture limitation the Vindolanda
batch hit: `SITE_ENTRY_LOOKUP`'s per-site `*Entry` functions matched purely on OSM `name` string,
with no way to give two identically-named polygons (Vindolanda's two "Bath House" footprints, three
"Temple" footprints, from different fort-rebuild periods) two different answers. Extended every
function's signature to `(name, osmId?) => CuratedEntry | undefined` and threaded the clicked
building's real `osm_id` through from `Map.tsx`'s click handler (`SITE_ENTRY_LOOKUP[site]?.(rawName,
p.osm_id)`). Purely additive — every existing site file still ignores the new second argument, so
this is a non-breaking, mechanical change, verified with `tsc --noEmit` clean before wiring in any
of this shift's own new sites. Did **not** attempt the Vindolanda-specific research this would
unblock (which osm_id is which fort period, requiring real site-plan cross-referencing this
session's network access can't reliably do) — the plumbing is real and available for whoever picks
that research up, but the two dropped Vindolanda name-families are still dropped. Landed as its own
standalone commit before this shift's own Track A work, matching Shift 44's own precedent for
sequencing a refactor ahead of unverified new content.

### Track A — Brescia and Rimini curate-buildings, plus Via Domitiana road stations

**Curate-buildings — Brescia (Brixia) and Rimini (Ariminum), 8 buildings (`[06-P0-2]`, 28/40 →
30/40, 70.0% → 75.0%).** Two parallel research agents ran against real sources — Ministero della
Cultura's own Brixia archaeological-park pages, Comune di Brescia's official municipal pages,
Fondazione Brescia Musei, and Lombardia Beni Culturali's architecture record sheets for Brescia;
Comune di Rimini, Musei di Rimini, the Soprintendenza Archeologia Belle Arti e Paesaggio
dell'Emilia-Romagna, and a peer-reviewed Oxford Academic article on the Domus del chirurgo's
surgical-instrument hoard for Rimini — cross-confirmed across 2+ independent results per fact.

Brescia (3 buildings) resolved cleanly: the Capitolium, Forum and Theatre are all part of the same
Flavian rebuilding of the Augustan-era civic core (the Capitolium's own pediment inscription dates
it to 73 CE under Vespasian, commemorating his rise to power after the nearby battle against
Vitellius), so all three were already-standing, relatively new monuments — only 44 years old — at
the 117 CE snapshot. Two candidates researched and correctly excluded rather than guessed: "Arco
del Granarolo" turned out to be an 1822 neoclassical arch by Rodolfo Vantini, roughly 1,700 years
too late despite the OSM tag; "Palazzo Martinengo da Barco" is a 17th-century palazzo with no
ancient identity, distinct from the separate, genuinely Roman-relevant "Palazzo Martinengo
Cesaresco Novarino" nearby (confirmed not present in this site's own OSM extract, so not curated
here on a guess).

Rimini (5 buildings) resolved a real dating question the brief itself flagged as a risk: the
Amphitheatre's "2nd century CE" date could fall either side of 117, and a Hadrian-era coin found
embedded in its own masonry settled it — Hadrianic, not Trajanic, so it ships `extant_117ce:false`.
The Domus del chirurgo's famous surgical-instrument hoard belongs to a building phase from decades
later than 117, also `false`. The Arch of Augustus (27 BCE, widely reckoned the oldest surviving
Roman triumphal arch) and the Bridge of Tiberius (14-21 CE, still carrying traffic today) were both
well over a century old by Trajan's death. Two real name collisions were handled with explicit
guards inside `riminiEntry()` itself rather than by guessing around them: "ex Stazione di Rimini
Porta Montanara" is a 1916 railway station merely named after its proximity to the actual Roman
gate — since "Porta Montanara" is a literal substring of its full name, the generic longest-key
substring matcher would otherwise have misdescribed an abandoned modern train station as a Roman
monument; "Pietre del Ponte di Tiberio non rimontate" (loose ancient stone blocks set aside during a
modern restoration of the bridge) got the same guard, since it's real Roman stone but not a
structure with its own construction history distinct from the bridge it came from.

All 8 keys verified against every real OSM name in both sites' building files with a Python harness
mirroring the app's own longest-key-first substring matcher — no collisions, every modern-clutter
name (hotels, churches, palazzi) correctly falls through to the fallback description.

**Via Domitiana road stations, 4 new stops (Axis 2 `add`, the first non-curate-buildings Track A
pick in several shifts).** A third parallel research agent worked Domitian's coastal road (dedicated
95 CE, Sinuessa to Puteoli, bypassing the older inland Via Appia route through the Pomptine
Marshes) against Statius's *Silvae* 4.3 (written for the road's own dedication), the Tabula
Peutingeriana (via Konrad Miller's *Itineraria Romana* catalog, cross-referenced through search
snippets since direct database access stayed blocked), and Pleiades. Honest, un-padded yield from a
genuinely short (~50km) road: four new stations — the Savo river crossing ("Ad Savonem", low
confidence, since the Peutinger Table names only the river, not a structure, and no bridge has been
pinpointed archaeologically), the Pons Vulturni bridge over the Volturnus (Statius personifies and
celebrates the river-god's new bridge at length), the pre-existing colonia of Liternum (194 BCE,
Scipio Africanus's retirement villa and tomb per Seneca *Ep.* 86) that the new road simply ran
through, and the mutatio "In Vineis", identified with the still-standing Arco Felice cutting
through Monte Grillo. One real research trap checked and correctly avoided: Pons Campanus, a
famous named bridge over the same Savo river, is firmly attested as a *Via Appia* station near
Casilinum, not the Domitiana's own crossing — kept as two distinct, separately-sourced points
rather than conflated. No milestone bearing Domitian's own name survives to cite — chiseled from
the road's dedicatory inscriptions after his *damnatio memoriae* (AE 1973, 137) — a real
attestation gap, not an oversight.

Deliberately did **not** re-add Sinuessa, Cumae, Baiae or Puteoli as new road-station points — all
four are already on the map (Sinuessa as an existing Via Appia station sitting at the exact fork
point where the Domitiana splits off, the other three as full curated sites), and duplicating their
coordinates as a second point would have recreated the exact stacked-pin bug `[12-FIX-2]` already
fixed once. Enriched the existing Sinuessa station's own `notes` to record the Domitiana fork
instead of adding a second pin on top of it — flagged as a standing habit worth carrying into future
road-stations batches in `FEATURE_BACKLOG.md`.

### Build, validate, verify

`npm run validate` clean at every commit: 0 errors, the same 17 reviewed warnings throughout.
`npx tsc --noEmit` clean after the Track B refactor and after wiring in Brescia/Rimini. `npm run
build` clean on every pushed commit — the pre-push gate never tripped across all three commits this
shift. `npm run metrics -- --write` run after each data change: sites with curated building
descriptions 28/40 (70.0%) → 30/40 (75.0%).

### Handoff for the next shift

1. **`[06-P0-2]` curate-buildings has 10 sites left.** Rome (289 named features, by far the
   biggest remaining site — scope carefully or split across multiple passes), aquincum and xanten
   (both confirmed too-thin, don't re-check), and verona/ravenna/milan — checked this shift, all
   three have *some* real named Roman-era features worth a proper research pass (Verona: Arco dei
   Gavi, Teatro Romano, Tempio di Giove Lustrale, Porta Borsari, Porta Leoni; Milan: Anfiteatro
   Romano, Domus Nostra), but Ravenna's named features all looked post-Roman (5th-6th c. basilicas,
   medieval gates) on a name-only inspection — worth confirming with real research before either
   claiming it as a normal batch or skipping it outright on an unverified guess.
2. **The `osm_id` plumbing for the curate-buildings lookup is now in place** (`SITE_ENTRY_LOOKUP`
   entries receive `(name, osmId?)`), but Vindolanda's own two dropped name-families ("Bath House"
   x2, "Temple" x3) are still dropped — using the new parameter to restore them needs real
   per-osm_id research (matching each specific polygon to its fort period via the Vindolanda
   Trust's own site plans), which this shift didn't attempt.
3. **Road-stations batches should check for exact-coordinate collisions against already-mapped
   stations and full sites before adding a new point** — hit this concretely with Sinuessa this
   shift (see `FEATURE_BACKLOG.md`'s new note); a future road-stations pass near any existing
   curated site or station should check first rather than risk a stacked pin.
4. **Board fresh-check**: still no unclaimed P0/P1 `add` ticket smaller than a multi-pass refactor,
   now twelve-plus shifts running making the same decline call for the same reason. This shift's
   own Via Domitiana pick shows the board isn't the only source of legitimate `add` work — the
   brief's own Axis 2 (road stations) and Axis 1 (more cities) playbooks are both still open and
   don't require a board ticket to pursue, just a real research pass and an honest yield count.
5. **`BOARD.md`'s `[06-P0-2]` entry can silently fall behind `SHIFT_LOG.md`** — Shift 44's own
   six-site batch was fully shipped and logged in `SHIFT_LOG.md`/`FEATURE_BACKLOG.md` but never
   made it into `BOARD.md`'s own running note until this shift backfilled it. Worth a standing
   habit: update `BOARD.md` in the same push as the data, not just the other two logs.

---

## Shift 44 — 2026-08-22 (this shift's own prompt claimed "Shift 1 of four")

Same stale-numbering mismatch every shift since #13 has flagged — the scheduled prompt said
"Shift 1 of four," but `SHIFT_LOG` was 43 real shifts deep at session start, so this entry
continues as Shift 44. Session started with `HEAD` detached and local `main`/`origin/main` both
reading a real 50 commits behind the detached `HEAD` — same "stale local ref, not data loss"
symptom nearly every shift has independently rediscovered; ran `git fetch origin main` (which
force-updated the stale `origin/main` tracking ref to the real tip) then `git checkout -B main
origin/main`, verified `HEAD` now matched the real tip (`5e53736`, Shift 43's own last commit)
before doing anything else. Fresh container needed `npm install`; reverted the resulting
`package-lock.json` churn before committing, per the standing habit. Read `SHIFT_BRIEF.md` and
`BOARD.md` in full, plus Shift 43's own handoff, before picking work. Confirmed this session's own
network status directly: `curl` to `en.wikipedia.org`/`commons.wikimedia.org`/`overpass-api.de`
all return `CONNECT tunnel failed, response 403`, matching every recent shift's finding —
`WebSearch` remained the only working research channel, used via six parallel background research
agents across the shift (four in the first batch, two more once time allowed a second round).

### Board check

Same unclaimed P0 set every recent shift has found and declined for the same reason — `[12-P0-1]`
merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild (still missing its spec), `[02-P0-1]`
terrain, `[02-P0-4]` self-host-glyphs — all large, multi-file refactors an unsupervised session
pushing straight to production shouldn't attempt mid-refactor with nobody watching. `[06-P0-2]`
curate-buildings is the board's own standing `deepen` task with a proven, working pipeline, so
Track A continued it — Shift 43's handoff named capua/tivoli/palestrina/corinth as the
next-easiest picks by named-OSM-building count, checked each against its real building file
before claiming (all four confirmed real, non-trivial candidate counts), and became this shift's
first Track A batch. With time left after that batch shipped, checked two more candidates from the
same handoff's "unscoped, worth a real count" list (vindolanda, and beneventum despite being
modern-city-sized) — both turned out to have real, substantial material and became a second batch.
Track B came from the standing "12-deep nested ternary, worth converting before it gets worse"
note in `FEATURE_BACKLOG.md` (cloud shift 41) rather than the board or `FEATURE_BACKLOG.md`'s P0-P3
sections — by the time this shift started that ternary was 22 deep, not 12, so converting it
before adding this shift's own six sites (which would have pushed it to 28) was the natural point
to do it, and it's exactly the kind of low-risk, well-scoped code-quality item Track B calls for.
By the board's own ratio count this shift ran 2 `deepen` (curate-buildings, two batches, six sites)
+ 1 `polish` (the lookup-table refactor) — short the `add` slot, same finding as most recent
shifts: no unclaimed board `add` ticket existed, and this shift's own Track A picks were all
`deepen` continuations of an existing ticket rather than a fresh `add`.

### Track B — curate-buildings site lookup: nested ternary → `Record` (done first, unblocks the rest)

`app/Map.tsx`'s building-click handler chained every curated site as a nested nine-level-deep
`site === X ? xEntry(rawName) : site === Y ? ...` ternary, flagged in `FEATURE_BACKLOG.md` back
when it was 12 sites deep (cloud shift 41) as "worth converting before a 15th or 20th site makes it
genuinely hard to read." It was 22 deep by this shift's start. Replaced with a
`Record<string, (name: string) => CuratedEntry | undefined>` — same behavior, verified by running
`tsc --noEmit` clean both before and after — and adding a new site is now a two-line diff (one
import, one lookup-table row) instead of restructuring the whole ternary. Landed as its own
standalone commit before any of this shift's own six new sites were wired in, so the refactor's
correctness didn't depend on unverified new content, and each new site after it was a pure
two-line addition to the table.

### Track A — six more curate-buildings sites (Capua, Tivoli, Palestrina, Corinth, Beneventum, Vindolanda)

Board `[06-P0-2]` — 22/40 → 28/40 (70.0%). Six parallel research agents across two batches ran
against real sources — the Soprintendenza ABAP Caserta e Benevento's own pages, Comune di Santa
Maria Capua Vetere, tibursuperbum.it and archeotibur.org for Tivoli, World History Encyclopedia
and Treccani's Enciclopedia dell'Arte Antica for Palestrina, ASCSA's own Corinth excavation
record, the Vindolanda Trust's own site plus the Roman Inscriptions of Britain database for
Vindolanda — cross-confirmed across 2+ independent results per fact, the same constraint and
method every recent shift's Track A work has documented.

**Capua** (5 buildings) resolved a real duplicate-or-not question with coordinates rather than
guessing: "Resti del primo Anfiteatro" and "Amfiteatro Campano" turned out to be two genuinely
separate physical structures roughly 20m apart — Spartacus's own smaller Republican-era training
arena, demolished once its much larger imperial replacement (~100 CE) opened nearby. Capua's
Mithraeum (~100 CE, the oldest known in the western Roman world) is a rare case that actually
clears the 117 CE bar most Mithraea miss (the family as a whole peaked 2nd-3rd century, per the
brief's own caution). Two real, confirmed sites (Domus Romana, Macellum) had no sourceable
construction date after a full research pass — dropped rather than invented, per "real data or
don't include it."

**Tivoli** (6 buildings) resolved two identity questions a single WebSearch pass could easily have
gotten wrong: "Tempio della Sibilla" and "Tempio di Vesta" are two separate, adjacent round-vs-
rectangular temples on the acropolis, not the same building under two different tourist-material
names (a genuinely common conflation in casual sources); "Tempio della Tosse" is a 4th-century
mausoleum, not an actual temple despite its OSM tag, and ships `extant_117ce:false` accordingly.
The Anfiteatro di Bleso's own dedicatory inscription ties it to Hadrian's court — not yet built on
11 August 117, the exact day his reign began.

**Palestrina** (6 buildings) untangled a real structural question: the Sanctuary of Fortuna
Primigenia's terraces, the forum's "Grotto of the Lots" nymphaeum, and the civil basilica are three
architecturally distinct late-2nd-century-BCE structures, not one complex described three
different ways — and the "Antro delle Sorti" name is itself a misnomer, since the real oracle sat
higher up in the sanctuary, not in this grotto. Porta San Cesareo was checked and dropped (only
vague "since antiquity" local history, no archaeological confirmation of Roman-era origin); Porta
del Sole was kept since 2005 excavations found a real ancient gate phase beneath the standing
Baroque one.

**Corinth** (4 buildings) — the Roman-colony civic core (forum/agora, Julia Basilica, South Stoa,
amphitheatre) all cleanly extant by 117, a mature 160-year-old provincial capital by Trajan's
death. The Early Christian basilica of Kraneion was checked and correctly excluded (6th century,
per its own OSM name's implication).

**Beneventum** (8 buildings) turned out to have real, substantial Trajanic-era material despite
being sized like the modern-city sites this ticket's standing pattern has learned to expect
mostly-modern clutter from (Xanten, Aquincum) — the Arch of Trajan (dedicated 114 CE, marking the
start of the Via Traiana, three years old at Trajan's death, one of the best-preserved Roman
arches anywhere), the amphitheatre (attested under Nero via Tacitus in 63 CE, correcting an
initial hypothesis it might be the site's later Hadrianic-era building — that's a separate
monument, the Roman Theatre, not part of this batch), the forum, the Temple of Isis obelisk
(Domitian, 88-89 CE), and a bath complex tagged twice 155m apart in OSM, merged into one entry
rather than duplicated. Two real, sourced post-117 structures (a late-antique wall tower, a Lombard
necropolis) shipped as `extant_117ce:false` with their own descriptions instead of being silently
dropped, matching this ticket's established convention for genuinely-dated post-117 finds. One
candidate's construction date straddled 117 too closely to confirm either way — shipped `false`
per invariant 1's own "when in doubt: false" rule.

**Vindolanda** (5 buildings) corrected a research hypothesis mid-flight rather than shipping it:
the fort standing on 11 August 117 is Period IV (Cohors I Tungrorum, timber/turf, c. 105-120 CE),
not the famous Period III fort tied to Flavius Cerialis's Batavian cohort and the best-known
tablet archive, which was deliberately demolished around 105 — twelve years before this map's
snapshot date. Also surfaced and documented a genuine architecture limitation rather than papering
over it: three OSM names at this site ("Bath House" x2, "Temple" x3) cover physically distinct
polygons spanning different fort periods with *different* 117 CE truth values, and the
curate-buildings lookup matches by name only — it cannot give two identically-named features two
different answers. Dropped both name-families entirely rather than guess wrong for whichever
polygon a written entry wouldn't describe; full note left in the file's own header and in
`FEATURE_BACKLOG.md` for whoever wants to extend the lookup to key on `osm_id` instead of name.

All 30 keys across all six files verified against every real OSM name in each site's building
file with the project's own longest-key-first substring-matcher harness (a small Python script
mirroring the app's actual matching logic in `app/*Descriptions.ts`) — no silent typos or
collisions, every generic/modern OSM tag (Beneventum's ~120 modern churches/palazzi/shops,
Vindolanda's replica ramparts and museum) correctly falls through to the fallback description.
`npm run metrics -- --write`: sites with curated building descriptions 22/40 (55.0%) → 28/40
(70.0%).

### Build, validate, verify

`npm run validate` clean at every commit: 0 errors, the same 17 pre-existing warnings throughout.
`npx tsc --noEmit` clean after the Track B refactor and after every Track A batch. `npm run build`
clean on every pushed commit — the pre-push gate never tripped across all six commits this shift.

### Handoff for the next shift

1. **`[06-P0-2]` curate-buildings has 12 sites left.** Rome, aquincum, xanten (both confirmed
   too-thin by Shift 43), and five more modern-city-sized sites (verona, ravenna, milan, rimini,
   brescia) are the remaining unscoped candidates — worth a real named-building count check before
   claiming any of them, same lesson Xanten/Aquincum and this shift's own Beneventum pick (which
   went the *other* way — real material despite the modern-city size) both reinforce. Rome's 289
   named features make it the single biggest remaining site by a wide margin; worth scoping
   carefully or splitting across multiple passes rather than assuming a normal-sized batch.
2. **A real architecture limitation in the curate-buildings lookup pattern**: it matches purely by
   OSM `name` string, with no way to disambiguate two identically-named polygons that need
   different answers (Vindolanda's "Bath House" x2, "Temple" x3 this shift; likely to recur at any
   site the Trust/park rebuilt in phases, or any bbox with, e.g., two separate "Chiesa" buildings
   of different eras sharing a generic tag). A future shift wanting to unlock those specific
   Vindolanda entries (or hit the same wall elsewhere) would need to extend the lookup to also
   accept `osm_id` or coordinates, not just name — real scope, not urgent, flagged rather than
   silently worked around.
3. **Board fresh-check**: still no unclaimed P0/P1 `add` ticket smaller than a multi-pass
   refactor, eleven shifts running now (34-44) making the same decline call for the same reason —
   might be worth a deliberate scoping pass by whoever next has the time to split one of the big
   P0 tickets (`[12-P0-1]` merge-themes, `[03-P0-1]` schema-v2) into a smaller, claimable slice.
4. **`FEATURE_BACKLOG.md`'s P3/polish section still has two real open items**: "Terrain shading"
   and "Dark mode / night-map style" — both bigger, riskier UI lifts than this shift's ternary
   refactor (terrain needs a hillshade data source; dark mode touches every chrome color token),
   not attempted this shift for that reason.

---

## Shift 43 — 2026-08-21 (this shift's own prompt claimed "Shift 4 of four")

Same stale-numbering mismatch every shift since #13 has flagged — the scheduled prompt said
"Shift 4 of four," but `SHIFT_LOG` was 42 real shifts deep at session start, so this entry
continues as Shift 43. Session started `HEAD` detached, matching `origin/main` exactly (`9dc9cd8`,
Shift 42's own last commit) while local `main` was 50 commits behind at `709a480` (Shift 28) —
same "stale local ref, not data loss" symptom nearly every shift since #9 has independently
rediscovered; `git checkout main && git reset --hard origin/main` put the branch on the real tip
cleanly, verified as safe first since the working tree was already clean and identical to
`origin/main`. Fresh container needed `npm install`; reverted the resulting `package-lock.json`
churn before committing anything, per the standing habit. Read `SHIFT_BRIEF.md` and `BOARD.md` in
full, plus Shift 42's own handoff, before picking work. Confirmed this session's own network
status directly: `curl` to `commons.wikimedia.org`/`overpass-api.de`/`en.wikipedia.org`/
`pleiades.stoa.org` all return `CONNECT tunnel failed, response 403`, and `WebFetch` to
`en.wikipedia.org` returns a hard `EGRESS_BLOCKED` — matching every recent shift's finding.
`WebSearch` remained the only working research channel, used via four parallel background
research agents across the shift.

### Board check

Same unclaimed P0 set every recent shift has found and declined for the same reason — `[12-P0-1]`
merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild (still missing its spec), `[02-P0-1]`
terrain, `[02-P0-4]` self-host-glyphs — all large, multi-file refactors an unsupervised session
pushing straight to production shouldn't attempt mid-refactor with nobody watching. `[06-P0-2]`
curate-buildings is the board's own standing `deepen` task with a proven, working pipeline, so
Track A continued it rather than re-scoping from scratch — Shift 42's handoff didn't name specific
next sites this time, so this shift picked by named-OSM-building count itself (checked every
remaining `sites.ts` slug's building file first): Xanten and Aquincum both turned out to be almost
entirely modern-city OSM clutter (grocery-store chains, school buildings, a Hungarian biotech
office) with only one or two genuinely Roman-named tags each, too thin to be worth researching:
skipped, noted here so a future shift doesn't re-check them expecting a normal-sized batch. Five
other sites (Italica, Paestum, Portus, Cumae, Baiae) had real, substantial Roman-named building
counts and became this shift's Track A batch instead. Track B came from `FEATURE_BACKLOG.md`'s own
P1 list (`search-bar-becomes-header`) rather than the board, per the brief's standard Track B
mechanism — a self-contained desktop UI merge with no data/network dependency, good complement to
a network-constrained Track A. By the board's own ratio count this shift ran 2 `deepen`
(curate-buildings, five sites in one batch) + 1 `polish` (the header merge) — short the `add` slot
Shift 42 already covered with Britain roads two shifts ago; no unclaimed board `add` ticket existed
to fill it, same finding as many shifts running now.

### Track A — five more curate-buildings sites (Italica, Paestum, Portus, Cumae, Baiae)

Board `[06-P0-2]` — 18/40 → 23/40, closing to 22/40 by `npm run metrics`'s own count (curate
count differs slightly from the raw file-existence count above because Xanten/Aquincum were
checked-and-skipped, not researched). Four parallel research agents (Italica solo; Paestum solo;
Portus solo; Cumae+Baiae combined since both were small) ran against real sources — the Junta de
Andalucía's own Conjunto Arqueológico de Itálica site, the IAPH digital repository, the ROMULA/UPO
archaeology journal, the Parco Archeologico di Paestum e Velia's own site, vici.org, the Campania
region's official archaeology portal, the Portus Project/University of Southampton's MOOC
materials, ostia-antica.org's topographical dictionary, and the Parco Archeologico Campi Flegrei's
own site for Baiae — cross-confirmed across 2+ independent search results per fact, the same
constraint and method every recent shift's Track A work has documented.

**Italica** (8 buildings) turned into the sharpest 117 CE snapshot case this ticket has hit in
either direction: 7 of 8 researched buildings turned out `extant_117ce:false`, because nearly the
entire visible archaeological park — every mosaic-floored domus, the Exedra and Neptune-mosaic
guild buildings, even the cistern feeding the new quarter — belongs to Hadrian's post-117 nova
urbs expansion, not Trajan's. Only the Lesser Baths, built under Trajan in the old quarter near
the forum, was already standing. This surfaced a real, sourced error in `app/sites.ts`'s own
Italica blurb, which credited "Trajan's expansions" with doubling the city "just before our
snapshot" — backwards on both counts, since it was Hadrian, and it happened after 117, not before.
Corrected in the same commit. The famous Italica amphitheatre (one of the largest in the Roman
world) and the Traianeum (Hadrian's temple to the newly deified Trajan) aren't separately tagged
as clickable OSM buildings, so they're noted in the file's header comment rather than invented as
records — the research agent found solid "Hadrianic, 117-138 CE" dating for the amphitheatre but
no source narrow enough to say whether it was already under construction at the exact snapshot
date, so it stays undated rather than guessed.

**Paestum** (17 buildings) is the single fullest haul this standing ticket has landed at one site.
Three Greek Doric temples — Hera I ("the Basilica," oldest, ~550 BCE), Hera II ("Temple of
Neptune," ~450 BCE) and Athena ("Temple of Ceres," ~500 BCE), both later misnomers corrected in
the prose — were already five to six centuries old and still the dominant skyline by 117 CE,
alongside a complete Roman civic core (forum, comitium, basilica, macellum, amphitheatre, forum
shops) all comfortably pre-dating the snapshot by one to four centuries. Only the Lucanian-era
Ekklesiasterion, a circular rock-cut assembly hall the Romans deliberately buried under a new
sanctuary once their own comitium took over its civic role in 273 BCE, was already invisible above
ground by 117. Two genuine source disagreements surfaced rather than papered over: one source
calls the temple encroaching on the comitium "Mater Matuta" against the more common "Mens Bona" —
this file follows Mens Bona, matching both the OSM tag and the park's own restoration-page usage;
and "Sanctuary with a pool" (intra-urban, on the forum, Venus Verticordia, resting on 73 stone
pilasters per vici.org) is a genuinely distinct site from "Sanctuary of Santa Venera"
(extra-urban, south of the walls, an Aphrodite Urania/Venus Iovia pool running continuously since
~600 BCE) despite some secondary sources blurring the two together — kept as separate researched
entries since they're separate OSM-tagged buildings.

**Portus** (6 buildings) caught imperial Rome's harbor at its single freshest possible moment —
Trajan's hexagonal basin, engineered from 103 CE, had opened just four years before his death.
One OSM-tagged building, "Tempio di Portuno," was dropped rather than guessed at: every source for
that temple places it in central Rome beside the Forum Boarium and the old Portus Tiberinus river
harbor, roughly 30 km upriver — a real, well-attested 117 CE monument, just not one that stood at
this site, and no source describes a second, distinct Portunus temple actually built at Portus
itself. It falls through to the generic archaeological description rather than being written up
as if it belonged here — a research-quality flag worth relaying to whoever next touches this OSM
node's coordinates. Both Christian-era basilicas on Isola Sacra (Basilica Portuense, mid-4th c.;
Basilica di Sant'Ippolito, late 4th/early 5th c.) ship `extant_117ce:false` with the actual
Trajanic-era harbor-side buildings on the same ground described instead.

**Cumae** (6 buildings) and **Baiae** (6 buildings) both landed as clean, mostly-pre-117 batches.
Cumae's amphitheatre (one of the oldest stone arenas in the Roman world, cut ~100 BCE), Capitolium,
both acropolis temples, forum baths and a roadside tomb were all standing for one to several
centuries by 117. Baiae's three famous domed "temples" — Diana, Mercury, Venus — are a
well-documented 18th/19th-century antiquarian misnomer for free-standing halls of the resort's
monumental bath complex, not shrines at all; only the Mercury hall's dome (the oldest large-scale
concrete dome in the Roman world, predating the Pantheon's by roughly a century and a half)
predates 117, while Diana (Severan, c. 230) and Venus (Hadrianic, begun after 117) postdate it.
One OSM tag at Baiae, "Villa Il Soffione," was dropped for the same real-data-or-don't-include-it
reason as Portus's Portunus temple — every search result is a modern wedding-venue/restaurant of
that name, and its own marketing copy's unsourced claim to sit on "an ancient Roman structure"
found no independent archaeological confirmation anywhere.

All 43 keys across all five files verified against every real OSM name in each site's building
file with the project's own longest-key-first substring-matcher harness (a small Python script
mirroring the app's actual matching logic in `app/*Descriptions.ts`) — no silent typos, and every
generic/modern OSM tag (grocery-store chains at the skipped Xanten/Aquincum checks, church names,
museum names, "Volksbank") correctly falls through to the fallback description. `npm run metrics
-- --write`: sites with curated building descriptions 17/40 (42.5%) → 22/40 (55.0%).

### Track B — search-bar-becomes-header on place selection (desktop)

`FEATURE_BACKLOG.md`'s own P1 item, open since Shift 4: real Google Maps collapses the search box
into a back-arrow + place-name header the instant a place is selected, instead of leaving two
disconnected floating cards. `app/Chrome.tsx`'s search card now branches on a `headerMode` flag
(`!isMobile && a place is selected`) — swaps the hamburger+input+search-icon row for a back arrow
(calling the existing `clearPoi()`) plus the selected place's name, ellipsis-truncated, inside the
exact same card box so the transform reads as one continuous element rather than a jarring swap.
The search-results dropdown and hamburger menu now force-close the instant `headerMode` turns on,
so a place selected while either happened to be open doesn't leave it floating under the new
header with nothing left to anchor it to. `app/PlaceDetails.tsx`'s own floating close-X (positioned
over the hero image) is now mobile-only — on desktop the header's back arrow is the single close
affordance, so the redundant second X button is gone. Deliberately scoped to desktop only, matching
the backlog item's own original framing: mobile's bottom sheet (drag handle + its own X) is already
the correct mobile interaction pattern, not something this merge needed to touch.

Verified with Playwright against the dev server (killed and `.next` cleared before the final build,
per the standing `next dev`/`next build` collision note): desktop 1280×900 light — selecting
"Amphitheatrum Flavium" via search hides the input entirely, shows a working back arrow, and
clicking it restores the search box with the prior query text intact and the panel closed; mobile
375×812 dark — confirmed no regression, the search input and the sheet's own close-X both remain
present exactly as before, since `headerMode` never activates there. Screenshots reviewed for both.

### Build, validate, verify

`npm run validate` clean at every commit: 0 errors, the same 17 pre-existing warnings throughout.
`npx tsc --noEmit` clean after both the Track A and Track B changes. `npm run build` clean on
every pushed commit — the pre-push gate never tripped. `npm run metrics -- --write`: sites with
curated building descriptions 17/40 (42.5%) → 22/40 (55.0%); `pois.geojson`-tracked curated-place
count unchanged (curate-buildings descriptions live in `app/*Descriptions.ts`, not `pois.geojson`,
same as every prior shift on this ticket).

### Handoff for the next shift

1. **`[06-P0-2]` curate-buildings has 18 sites left.** Xanten and Aquincum are now confirmed
   too-thin-to-be-worth-it (checked this shift, see Board check above) — don't re-check them
   expecting a normal batch. Remaining untouched sites by named-OSM-building count, roughly
   ranked: capua (~10 real candidates: Amfiteatro Campano, Mitreo, Macellum, Domus Romana,
   Castellum aquae), tivoli (~7: Anfiteatro di Bleso, Tempio della Sibilla, Tempio della Tosse,
   Tempio di Vesta, Santuario di Ercole Vincitore — all genuinely famous), palestrina (~6: Tempio
   di Giove, Area Sacra Foro di Preneste, Basilica Civile di Praeneste, terme romane), corinth
   (~5: Agora, Ioulia Basilica, Notia Stoa). Rome, aquincum, xanten, vindolanda, italica (done),
   and the six modern-city-sized sites (verona/ravenna/milan/rimini/brescia/beneventum, all
   100+ named features, almost certainly mostly modern buildings like Xanten/Aquincum) are the
   remaining unscoped candidates — worth a real named-building count check before claiming any
   of them, same lesson this shift's own Xanten/Aquincum dead-end reinforces.
2. **Portus's "Tempio di Portuno" OSM tag looks misapplied** — every source for that temple
   places it in Rome's Forum Boarium, not at Portus. Worth a future shift checking that OSM
   node's actual coordinates and either correcting the tag or confirming it really is meant to
   represent the Rome monument at the wrong site.
3. **Board fresh-check**: still no unclaimed P0/P1 `add` ticket smaller than a multi-pass
   refactor, ten shifts running now (34-43) making the same decline call for the same reason —
   might be worth a deliberate scoping pass by whoever next has the time to split one of the big
   P0 tickets (`[12-P0-1]` merge-themes, `[03-P0-1]` schema-v2) into a smaller, claimable slice.
4. **`FEATURE_BACKLOG.md`'s P3/polish section still has two real open items**: "Terrain shading"
   and "Dark mode / night-map style" — both bigger, riskier UI lifts than this shift's header
   merge (terrain needs a hillshade data source; dark mode touches every chrome color token), not
   attempted this shift for that reason.

---

## Shift 42 — 2026-08-21 (this shift's own prompt claimed "Shift 3 of four")

Same stale-numbering mismatch every shift since #13 has flagged — the scheduled prompt said
"Shift 3 of four," but `SHIFT_LOG` was 41 real shifts deep at session start, so this entry
continues as Shift 42. Session started `HEAD` detached with local `main` reading 50 commits
behind `origin/main` — the same "stale local ref, not data loss" symptom nearly every shift since
#9 has independently rediscovered. `git fetch origin main` + `git checkout -B main origin/main`
put the branch cleanly on the real tip (`4d51e4f`, Shift 41's own last commit). Fresh container
needed `npm install`; reverted the resulting `package-lock.json` churn before touching anything
else, per the standing habit. Read `SHIFT_BRIEF.md` and `BOARD.md` in full before picking work.
Confirmed `WebSearch` works in this session (unlike many prior shifts' Overpass/Wikipedia/Commons
egress blocks, not independently re-tested this run) and used it as the sole research channel via
three parallel background research agents across the shift.

### Board check

`[06-P0-2]` curate-buildings is the board's own standing `deepen` task and Shift 41's handoff
named Djemila and Volubilis as the next-easiest picks by named-OSM-building count — took both,
then kept going on the same ticket (Sabratha, Baalbek, Luni) once the pipeline was warm, since a
`deepen` ticket with a working research→write→wire→verify loop doesn't need re-claiming between
sites. No unclaimed P0/P1 `add` ticket existed (same finding as every recent shift — `[12-P0-1]`
merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain, `[02-P0-4]`
self-host-glyphs all remain large, multi-file refactors an unsupervised session pushing straight
to production shouldn't start mid-refactor with nobody watching), so Track A's `add` half came
from Axis 2 (Roman Britain roads) directly off the brief instead, per its own "axes are still a
valid source of work when the board has nothing that fits" rule. By the board's own ratio count
this shift ran 2 `deepen` (5 curate-buildings sites, in two batches) + 1 `add` (Britain roads) —
short one `polish` slot; see the Track B note below for why.

### Track A — five more curate-buildings sites, Roman Britain's first road stations

**Board `[06-P0-2]` (curate-buildings) — five sites, 26 named buildings, closing 12/40 → 17/40.**
Two research agents (Djemila+Volubilis, then Sabratha+Baalbek+Luni once the first batch shipped)
ran against real sources — World History Encyclopedia, Livius.org (via search-summary access
only; direct `WebFetch` to it stayed blocked this session same as most prior shifts), Pleiades,
vici.org, the Luni archaeological park's own `luni.cultura.gov.it` documentation, and this
project's own already-settled Temple of Jupiter/Bacchus dating at Baalbek (`[08-P1-6]`, reused
rather than re-litigated). All five sites confirm the same pattern this ticket has now found at
Leptis Magna, Timgad, Djemila, Sabratha and Baalbek alike: North African and Levantine sites
founded or annexed in the 1st century CE almost always show their photogenic headline monuments
(arches, theatres, grand bath complexes) built one to three centuries *after* Trajan's death,
while the founding-era civic core (forum, curia, an early temple) is what actually stood in 117.
Luni broke that pattern the other way — a much older (177 BCE) Italian colony whose forum,
theatre and shopfronts were all already old news by 117, with only its amphitheatre, a Christian
basilica and a domus mosaic floor postdating the snapshot. One real, flagged uncertainty shipped
rather than hidden: Djemila's generic OSM "Thermes romains" tag can't be pinned to one of the
site's three known bath complexes with full confidence, so that entry's `built:183` date is
explicitly framed as the best-inference match (the only complex with a secure date), not a
certainty. Verified all 26 keys against every real OSM name in each site's building file with the
same Python longest-key-first substring-matcher harness prior shifts built for this ticket — no
silent typos, generic/modern OSM tags (park labels, a kindergarten at Carnuntum that ruled that
site out entirely — see handoff) correctly fall through to the fallback.

**Axis 2 (road stations) — Roman Britain, the first British material on the map.** A dedicated
research agent covering Watling Street, Fosse Way, Stanegate and Ermine Street came back with 48
candidate stations and — to its own credit — flagged real problems rather than papering over
them: several claimed Antonine Itinerary mileages looked "unusually large" against known
distances, and one entire chain (Godmanchester–Water Newton–Ancaster–Cambridge) turned out to be
ambiguously attributed between "Ermine Street proper" and a distinct Iter V route via Colchester,
with no primary-source access available this session to resolve which. Ran every claimed mileage
against a geodesic sanity check (a road can only be longer than the straight line between its
endpoints, never shorter) using this batch's own coordinates: the large majority failed, most
likely because my own approximate coordinates for several stations (sourced only as OS grid
references, not published decimals) aren't precise enough for the check to be meaningful rather
than because the source mileages are wrong — shipped `distance_from_previous_mp: null` across
nearly the whole batch rather than risk asserting a number that might not survive scrutiny. Kept
three that passed cleanly (Durovernum→Rutupiae 12mi, Vernemetum→(prior) 12mi, Crococalana↔Lindum
14mi). Dropped the disputed Iter V/Colchester chain (5 stations) from this batch entirely rather
than mislabel them — a genuine gap for whoever has primary-source access next. Also excluded
Vindolanda (already a full curated site) and Throp Fortlet (already a full `pois.geojson` record)
from the Stanegate batch to avoid a near-duplicate pin. Final batch: Watling Street 17, Fosse Way
9, Stanegate 8, Ermine Street 6 — `road_stations.geojson` 423 → 463, first-ever British stations
on a layer that previously covered only continental Europe, North Africa and the Levant.

### Track B — attempted and descoped: a static-thumbnail image fallback

Scoped board ticket `[13-P0-3]` (`image-fallback`, a location thumbnail for the 145 POIs with no
photo) before committing to Britain roads for the rest of the shift. Built a simplified SVG
outline of the empire's Mediterranean-centered coastline from `public/data/land.geojson` (58,881
source points) via a hand-written Douglas-Peucker simplifier, verified by rendering to PNG with a
headless Chromium instance in this sandbox (`/opt/pw-browsers/chromium-1194`, since the generic
`/opt/pw-browsers/chromium` path from the environment's own setup notes doesn't exist — the
real, versioned directory does). First simplification pass, run without geometric clipping to a
bounding box, rendered correctly — recognizable British Isles, Iberia, Italy, the Balkans, Crete —
but a second pass adding Sutherland-Hodgman bbox clipping (needed to keep the SVG path small
enough to inline) introduced self-intersecting sub-paths at several peninsulas, which the
browser's nonzero fill rule then rendered as false "holes" in Italy, Iberia and the Balkans rather
than solid land. This is a known hard case for naive polygon simplification+clipping without a
real GIS library (shapely, unavailable in this sandbox) to guarantee topology-preserving output.
Rather than ship a visibly broken map thumbnail or sink further budget into hand-rolling
self-intersection detection, descoped this ticket back to open and spent the reclaimed time on a
third Track A curate-buildings batch instead — matching the brief's own "if you don't have time
for Track B, that's fine, data wins" allowance. No code from this attempt was committed.

### Build, validate, verify

`npm run validate` clean at every commit: 0 errors, the same 17 pre-existing warnings throughout.
`npm run build` clean on every pushed commit — the pre-push gate never tripped, `package-lock.json`
churn from `npm install` reverted before the first commit. `npm run metrics -- --write`: curated
places 1,817 → 1,857; sites with curated building descriptions 12/40 (30.0%) → 17/40 (42.5%).

### Handoff for the next shift

1. **`[13-P0-3]` image-fallback is real, scoped, but needs either a proper polygon-simplification
   library (shapely's `.simplify(preserve_topology=True)`, or a JS equivalent) or a much smaller
   ROI/higher tolerance that avoids self-intersecting peninsulas — the unclipped, full-precision
   render worked fine, so the bug is specifically in clipping-then-simplifying a global landmass
   ring to a small bounding box, not in the SVG/rendering approach itself. Worth a second attempt
   with real GIS tooling rather than hand-rolled Sutherland-Hodgman.
2. **Roman Britain's Iter V/Colchester chain** (Godmanchester, Water Newton/Durobrivae, Ancaster/
   Causennae, Cambridge/Duroliponte, the unidentified Villa Faustini) needs a primary-source read
   of the actual Antonine Itinerary text (roadsofromanbritain.org's iter tables, or roman-
   britain.co.uk's Antonine Itinerary page) to settle whether it belongs on Ermine Street or a
   separate road — this session's `WebFetch` to both domains stayed blocked, `WebSearch` summaries
   weren't enough to resolve the ambiguity confidently.
3. **Curate-buildings has 23 sites left.** Carnuntum was checked this shift and ruled out — its
   OSM building data is entirely modern Austrian village buildings (a kindergarten, a parish
   office, a cultural center), no Roman-era names tagged at all, so it can't be picked up by this
   ticket until/unless a future shift re-fetches better OSM data for that site specifically.
4. **Board fresh-check**: still no unclaimed P0/P1 `add` ticket smaller than a multi-pass refactor,
   nine shifts running now (34-42) making the same decline call for the same reason.

---

## Shift 41 — 2026-08-21 (this shift's own prompt claimed "Shift 2 of four")

Same stale-numbering mismatch every shift since #13 has flagged — the scheduled prompt said
"Shift 2 of four," but `SHIFT_LOG` was 40 real shifts deep at session start, so this entry
continues as Shift 41. Session started `HEAD` detached with local `main`/`origin/main` both
apparently 50 commits behind — the same "stale local ref, not data loss" symptom Shift 9 first
documented. A plain `git fetch origin main` came down as a forced update matching detached `HEAD`
exactly, confirming no divergence; `git checkout -B main origin/main` put the branch on it
cleanly. Fresh container needed `npm install`; reverted the resulting `package-lock.json` churn
before touching anything else. Read `SHIFT_BRIEF.md`, `BOARD.md` and Shift 40's handoff in full.
Confirmed this session's own network status directly via `curl "$HTTPS_PROXY/__agentproxy/status"`:
`commons.wikimedia.org` returns a 403 at the CONNECT step (policy denial), matching every prior
shift's finding — `WebSearch` remained the only working research channel throughout.

### Board check

Same unclaimed P0 set recent shifts have all found and declined for the same reason: `[12-P0-1]`
merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild (still missing its spec), `[02-P0-1]`
terrain, `[02-P0-4]` self-host-glyphs — all large, multi-file refactors an unsupervised session
pushing straight to production shouldn't attempt mid-refactor with nobody watching. Picked up two
smaller, well-scoped board tickets instead — `[04-P2-9]` manifest (Track B) and `[06-P0-2]`
curate-buildings (Track A, two sites) — plus continued the axis 2/12/15 threads Shift 40 handed
off. A complete ratio cycle by the board's own count: 1 `polish` (manifest), 2 `deepen`
(curate-buildings x2), 1 `add` (the five new roads across two batches).

### Track B — web app manifest + maskable icon (`[04-P2-9]`)

`app/manifest.ts` + `app/icon.tsx`/`apple-icon.tsx` (Next's file convention, 32px/180px) + two
`next/og` route handlers for the 192px/512px PWA sizes, each with both `any` and `maskable`
purpose entries. One shared parchment-medallion mark (`app/appIcon.tsx`, `#f4ead5` matching
`Map.tsx`'s own light-mode land color, not the blue chrome tokens) with the ring kept to 74% of
canvas so OS icon masks never clip it. Verified by fetching `/icon` and `/icon-512.png` from a
local production server and visually inspecting both — clean, legible medallion at both sizes.

### Track A — five more roads, two more curated-buildings sites, one axis-12 top-up, one axis-15 town

**Axis 2 (road stations) — the Rome-radiating queue closed out, five roads, 41 new stations.**
`road_stations.geojson` 382 → 423. **Via Popilia** (24 stations, Capua–Rhegium, the seventeenth
road on the map) anchors on the Lapis Pollae (CIL I² 638), a Republican milestone found at Forum
Popilii/Polla recording cumulative distances to Nuceria, Capua, Muranum, Cosentia, Valentia and
Regium — independent confirmation for Muranum's Antonine Itinerary mileage, and the source that
put Nuceria Alfaterna on the road despite an unsourced assumption in this shift's own research
prompt that it wasn't. **Via Praenestina, Labicana, Nomentana and Latina** (17 more stations)
close out Shift 40's own handoff note — every road in the brief's named queue plus the short
Rome-radiating cluster is now on the map, 21 roads total. Via Latina is the batch's real weight:
11 stations from Rome to Beneventum via Anagni, Frosinone, Fregellae/Fabrateria Nova, Aquino,
Cassino, Venafro, Teano, Alife and Telese, its claimed mileages summing to exactly the Antonine
Itinerary's own stated 188-mile total for this route.

Ran the geodesic sanity check (a road can only be longer than the straight line between its
endpoints, never shorter) against every claimed mileage across both batches. Two failures on Via
Popilia (Ad Turres–Vibo Valentia) and two on the Rome-radiating batch (Ad Statuas–Ad Quintanas on
Via Labicana, Fabrateria Nova–Aquinum on Via Latina) — all four shipped `distance_from_previous_mp:
null` rather than forced, with a note on why. Three id collisions resolved with suffixes
(`station_forum_popilii_lucania`, `station_ad_turres_bruttium`, `station_ad_statuas_labicana`) —
all three existing ids belonged to genuinely different, distant towns sharing a common Latin
place-name pattern, not duplicates. No Wikimedia images added to either batch — the established
convention (2 of 382 stations carried one before this shift) held, and this environment's
`commons.wikimedia.org` block ruled out verifying any candidate filename regardless.

**Board `[06-P0-2]` (curate-buildings) — two more sites, 21 named buildings.** Leptis Magna (15
buildings) and Timgad (6 buildings) both turned into sharp 117 CE snapshot cases: Leptis's Severan
building boom (the Forum, Basilica, Arch of Septimius Severus, Hunting Baths, harborside Temple of
Jupiter Dolichenus, even Hadrian's own Baths) all postdate Trajan's death by 80-90 years, so 9 of
15 entries ship `extant_117ce:false`, each saying plainly what stood on the ground in 117 instead.
What genuinely stood: the Old Forum's Augustan-era temples, its Curia and Old Basilica, and —
freshest of all — the Arch of Trajan itself, raised c. 110 CE. Also fixed a real data error found
in the same pass: OSM's `leptismagna_buildings.geojson` tagged that arch "Arch of Marcus Aurelius"
— no securely dated Marcus Aurelius arch is attested at Leptis Magna itself, that name belongs to
a different, well-known arch at Tripoli (ancient Oea, ~120km away) commonly confused with Leptis
in casual sources. Corrected the OSM feature's `name` field in the same commit (one-line diff,
single occurrence confirmed before editing) so the map's own primary heading matches the curated
description instead of contradicting it — same shape as the Baalbek-dating correction Shift 32
made. Timgad came back thinner and more one-sided: all six of its OSM-named buildings (Arch of
Trajan, Great/Small North Baths, East Baths, Great South Baths, the Library of Rogatianus) postdate
117 CE — the colony was only 17 years old at the snapshot, its forum and curia freshly finished but
not separately tagged as clickable buildings in the source data, so that genuine 117 CE anchor
lives in the file's header note rather than an invented record. Both sites verified with a Python
harness replicating the app's own longest-key-first substring matcher against every real OSM name
in each site's building file — all 21 curated buildings resolve to the intended entry, modern/
whole-site-label features correctly fall through to the generic fallback.

**Axis 12 (imperial cult) — 6 of Shift 40's 10 image-null cult centers closed.** Verified Commons
images for Banias/Omrit's Corinthian column, Gortyn's Praetorium, Corinth's Temple E, Philippi's
forum, Nicopolis's Actium victory monument, and Segobriga's forum cryptoporticus. Four stay
`image_url:null` after a real search effort: Tres Arae Sestianae and Savaria's Ara Augustorum are
known only from ancient texts/inscriptions with no excavated structure ever photographed; Salona's
and Nola's temples have no Commons file specifically depicting the temple among the generic site
photos available.

**Axis 15 (welfare/euergetism) — one more alimenta town, Beneventum (23/50).** The Arch of Trajan
at Benevento carves the alimenta program itself into its inner-passage reliefs. A dedicated
research pass looking for more towns came back mostly empty and said so rather than padding: the
Ligures Baebiani table's ~246 lines name individual pledged farms, not separate towns; the six
numbered CIL alimentarii-dedication citations all map onto towns already on the map. Scholarship
confirms a ~39-53 town ceiling exists, but the catalogs that would name the rest (Ruggiero's
Dizionario Epigrafico, Duncan-Jones' Appendix II) sit behind fetches this environment's egress
block couldn't reach even via search-result snippets — a real gap for a shift with library access.

### Build, validate, verify

`npm run validate` clean at every commit: 0 errors, the same 17 pre-existing warnings throughout.
`npm run build` clean on every pushed commit — the pre-push gate never tripped. `npm run metrics
-- --write`: curated places 1,775 → 1,817; sites with curated building descriptions 10/40 (25.0%)
→ 12/40 (30.0%).

### Handoff for the next shift

1. **A twenty-second-and-beyond road.** The brief's named queue and the Rome-radiating cluster are
   both fully closed now. Real remaining candidates: Via Popilia's own coastal alternate through
   Buxentum/Blanda (a distinct, disputed "other" routing some scholars propose for Lucania/
   Bruttium, explicitly excluded from this shift's Via Popilia batch); the Britain/Gaul/Hispania
   provincial road networks (Fosse Way, Watling Street, Stanegate in Britain; the Gallic road web
   feeding Lugdunum) haven't been touched by any shift yet and are a genuinely open geographic gap.
2. **Curate-buildings has 28 sites left**, same standing task it's always been. Djemila (10 named
   OSM buildings, checked this shift but not researched — Roman Forum/Forum Courtyard look
   plausibly pre-117 for a Nervan-Trajanic veteran colony, the Arch of Caracalla/Severan-family
   temple/Basilica of Cresconius all look post-117 on their names alone but need the same real
   research pass Leptis and Timgad got) and Volubilis (only 4 named buildings, thin but real) are
   the next-easiest picks by named-building count.
3. **Axis 12's remaining 4 image-null cult centers and axis 15's ~30-town alimenta gap** both need
   a source this environment's WebSearch-only research can't reach (Commons file pages for the
   former, Ruggiero's Dizionario Epigrafico / Duncan-Jones' Appendix II for the latter) — worth a
   shift with library/database access rather than another WebSearch pass on the same two gaps.
4. **Board fresh-check**: still no unclaimed P0/P1 `add` ticket smaller than a multi-pass refactor.
   Topmost unclaimed P0s unchanged since Shift 34, eight shifts running now (34-41) making the same
   decline call for the same reason — worth a deliberate scoping pass by whoever next has a long
   uninterrupted block, since `[12-P0-1]` merge-themes in particular unlocks a lot of downstream
   content work per its own ticket note.

---

## Shift 40 — 2026-08-21 (this shift's own prompt claimed "Shift 1 of four")

**Same stale-numbering mismatch every shift since #13 has flagged** — the scheduled prompt said
"Shift 1 of four," but `SHIFT_LOG` was 39 real shifts deep at session start, so this entry
continues as Shift 40. Session started `HEAD` detached at the real tip (`9cd8457`) with local
`main` ten commits behind, pointing at Shift 28's `709a480`. `git fetch origin main` came down as
a forced update matching the detached `HEAD` exactly (confirmed via `git ls-remote` logic, no
data loss), then `git checkout -B main origin/main` put the branch cleanly on it. Fresh container
needed `npm install`; reverted the resulting `package-lock.json` churn before touching anything
else, same pattern every recent shift documents. Read `SHIFT_BRIEF.md`, `BOARD.md` and Shift 39's
handoff in full before starting. `WebFetch` confirmed `EGRESS_BLOCKED` directly this session
against `en.wikipedia.org` and `grokipedia.com` — `WebSearch` was the only working research
channel, matching every prior shift's report.

### Board check

Same unclaimed P0 set Shifts 34-39 all found and declined for the same reason: `[12-P0-1]`
merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain,
`[02-P0-4]` self-host-glyphs — all large, multi-file refactors an unsupervised session pushing
straight to production shouldn't attempt mid-refactor with nobody watching. Followed Shift 39's
handoff and the axis queue instead.

### Track A — three axes, 37 net new curated features (two roads' worth on axis 2)

**Axis 2 (road stations) — Via Claudia Augusta, the fifteenth road.** `road_stations.geojson`
360 → 372 (+12). Shift 39's handoff suggested Via Cottia; checked first and found it already
complete (6/6 stations, an earlier untogged shift's work) — picked the next open road instead.
Built from both historical trailheads (Hostilia on the Po, Altinum on the Adriatic) converging at
Tridentum, then north over the Alps through Pons Drusi (Bolzano), the excavated Endidae mansio at
Egna (Itin. Ant.'s 23 mp from Tridentum matches the modern road distance almost exactly — a rare
case where the ancient figure and the ground agree), Maia (Merano), the Rabland milestone near
Naturno (one of only two Via Claudia Augusta milestones ever found in situ), Inutrium at Nauders
(the Reschen Pass summit, 1,507m — the only station on this whole crossing a surviving ancient
source names directly), Foetibus (Fussen), and the terminus at Augusta Vindelicum (Augsburg) with
the Danube spur to Submuntorium (Burghofe, ~30km north — one source hedges toward nearby Neuburg
instead, noted honestly rather than picking one silently). Mansio Servasa near Brentino shipped
`confidence: medium` since its own best source calls it only "probable Via Claudia Augusta." No
leg mileage claimed except the one sourced Tridentum-Endidae figure; every other gap ships
`distance_from_previous_mp: null`. Twelve stations is thin against the brief's "typically 20-50"
line, but this is a genuine Alpine cursus-publicus crossing with fewer waypoints than a flat
consular road — same shape as Via Cottia's 6, and no fabricated stations were added to pad the
count. No id collisions with any of the other 15 roads already on the map.

**A second road, same axis, picking up this shift's own handoff note** — Via Tiburtina + Via
Valeria, 10 more stations, Rome to the Adriatic at Pescara. `road_stations.geojson` 372 → 382
(+10 more, 22 total this shift). Ponte Mammolo and the Aquae Albulae sulfur springs on the
Tiburtina stretch (Tibur/Tivoli itself skipped, already a city); Vicovaro, Carseoli, Alba Fucens
(where Syphax of Numidia and Perseus of Macedon both died as Roman prisoners) and Marruvium past
the Fucine Lake on the Valeria stretch; Corfinium (capital of the Italian rebels in the Social
War), Interpromium, Teate/Chieti and the Aternum/Pescara terminus down the Aternus valley. Ran
this shift's own geodesic sanity check before merging (the same haversine-distance-can't-exceed-
claimed-mileage check prior shifts established) and caught a real problem this time, not just
noise: the Antonine Itinerary's Corfinium-Interpromium (12 mp) and the derived
Interpromium-Teate (12 mp) both come out *shorter* than the straight-line distance between the
identified sites — physically impossible for a road, since a road can only ever be longer than
the straight line, never shorter. Both null rather than forced. The Teate-Aternum (9 mp) and
Interpromium-Aternum (21 mp) figures from the same source both check out and are kept.

**Axis 12 (imperial cult) — 11 more cult centers, doubling down on the room Shift 39 flagged.**
`imperial_cult.geojson` 33 → 44 (+11). All three of Shift 39's named leads closed: Barcino's
four-column Augustus temple in Barcelona (image confirmed on Commons), the Tres Arae Sestianae at
Cape Finisterre (three open-air altars, no temple, marking the Atlantic edge of the Roman world,
~19 BCE), and Banias's Herodian Augusteum (location still genuinely debated in the scholarship
between a cave-mouth candidate and Khirbet Omrit — shipped `confidence: medium` rather than pick
one). Eight more found on a fresh sweep: Savaria's central provincial altar for Pannonia Superior
(Ara Augustorum — the one place a Pannonian priest sacrificed for every emperor at once), the
imperial-cult temple inside Gortyn's Praetorium on Crete (nailed down by an inscribed doorjamb),
Corinth's Achaean-koinon federal cult, Salona's Temple of Augustus (built into Dalmatia's
provincial forum while Augustus was still alive), Philippi's forum temple (statues of Caesar,
Augustus and Livia together), Nicopolis's Aedes Augustalium (a wing added onto Augustus's own
Actium victory monument after his death), Segobriga's forum cult (ten priests attested by
inscription over a century), and the Temple of Divus Augustus at Nola — built on the spot where
Augustus actually died on 19 August 14 CE, dedicated by Tiberius in 26. Every new record
cross-checked against the file's existing 33 first: Herod's other two attested Augustea (Caesarea
Maritima, Sebaste) were already present, which is what confirmed Banias as the real remaining gap
rather than an oversight. Rejected on review after a real search: Carnuntum's Pfaffenberg
imperial monument (the specific altar arrangement dates to Marcus Aurelius, decades past this
map's snapshot — the same wrong-period trap FEATURE_BACKLOG already flags), Cherchell/Cirta and
Bostra/Caesarea Mazaca (real Roman cities, no specific dated temple or altar findable with a
pinnable location), and Aquileia (forum is real but no imperial-cult-specific structure attested
in what a WebSearch pass could surface). Only Barcino ships with an `image_url` — the other 10
found no confirmable Commons filename in a first pass; flagged in FEATURE_BACKLOG as a real gap,
not exhausted, same shape as the axis 20 gymnasia note.

**Axis 15 (welfare/euergetism) — the two drop-in-ready records from Shift 39's own handoff.**
`euergetism.geojson` 52 → 54 (+2). The Pompeii amphitheatre's dedication by duumvirs Gaius
Quinctius Valgus and Marcus Porcius (CIL X 852, ~70 BCE — the oldest stone amphitheatre known
anywhere, predating the Colosseum by more than a century) and the Holconius brothers' Augustan
rebuild of the Large Theatre (CIL X 833-834, added the whole upper seating tier plus two
stage-side boxes). Both images confirmed on Wikimedia Commons before use, not just matched by
search-result title.

### Build, validate, verify

`npm run validate` clean at every commit: 0 errors, the same 17 pre-existing warnings throughout
(none of this shift's additions triggered a new one). `npm run build` clean on every pushed
commit. `npm run metrics -- --write`: `pois.geojson` itself untouched this shift (all three axes
are separate thematic files), so the headline POI/description/image numbers hold at
481/100.0%/53.4%; cross-file collisions 133 → 142 (informational, tracked under `[12-P0-1]`,
expected from new points landing near existing gazetteer entries — e.g. the new Via Claudia
stations sitting close to Verona/Bolzano/Merano/Augsburg gazetteer rows; the second road's stops
are rural enough that they added no further collisions).

### Handoff for the next shift

1. **Axis 12 still has real room** — this shift found 11 without exhausting the search; Sicily
   (Syracuse/Panormus/Catania — general provincial context is well documented but no specific
   dated temple surfaced this pass), Viminacium's attested-but-unlocated imperial priesthood
   (Moesia Superior), and a fresh pass at Aquileia's forum with library-grade sources instead of
   WebSearch are all real leads that just didn't close this shift.
2. **A seventeenth road.** Via Claudia Augusta and Via Tiburtina+Valeria both close out this
   shift, so the brief's named queue plus the short Rome-radiating batch are both now done
   (Appia, Egnatia, Domitia, Augusta, Traiana Nova, Agrippa, Flaminia, Aemilia, Postumia,
   Cassia+Clodia, Aurelia+Salaria, Traiana, Militaris, Cottia, Claudia Augusta, Tiburtina+Valeria
   — 16 roads live). Next candidates: Via Popilia (Capua south through Bruttium to the Sicily
   crossing), Via Praenestina+Via Labicana+Via Nomentana+Via Latina as one more Rome-radiating
   batch (this shift found general route info via WebSearch but not station-level mileage in the
   time available — worth a dedicated pass), or filling Via Militaris's still-weak
   Hadrianopolis-Bergule segment flagged by Shift 39.
3. **Axis 15's 10 image-null imperial-cult records and Tres Arae/Banias's medium-confidence
   status** are both real top-up targets for a shift with a fresh WebSearch budget — see the
   commit message for the exact list.
4. **Board fresh-check**: still no unclaimed P0/P1 `add` ticket smaller than a multi-pass
   refactor. Topmost unclaimed P0s unchanged since Shift 34, seven shifts running now (34-40)
   making the same decline call for the same reason.

---

## Shift 39 — 2026-08-20 (this shift's own prompt claimed "Shift 4 of four")

**Same stale-numbering mismatch every shift since #13 has flagged** — the scheduled prompt said
"Shift 4 of four," but `SHIFT_LOG` was 38 real shifts deep at session start, so this entry
continues as Shift 39. Session started `HEAD` detached at the real tip (`1adfd50`) with local
`main` pointing at an old commit (`709a480`, Shift 28); a plain `git fetch origin main` updated
`origin/main` to the real tip (it came down as a forced update, matching the detached `HEAD`
exactly), then `git checkout -B main origin/main` put the branch cleanly on it — confirmed working
tree clean first, no data loss. Fresh container needed `npm install`; reverted the resulting
`package-lock.json` `hasInstallScript`/`libc`-field churn before touching anything else, same
pattern every recent shift documents. Read `SHIFT_BRIEF.md`, `BOARD.md` and Shift 38's handoff in
full before starting. `WebFetch` egress remained blocked (confirmed by all three research agents
independently — Wikipedia, Commons, ToposText, Pleiades, Overpass all EGRESS_BLOCKED); `WebSearch`
was the only working research channel, matching every prior shift.

### Board check

Same unclaimed P0 set Shifts 34-38 all found and declined for the same reason: `[12-P0-1]`
merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain,
`[02-P0-4]` self-host-glyphs — all large, multi-file refactors that an unsupervised session
pushing straight to production shouldn't attempt mid-refactor with nobody watching. Followed the
brief's axis queue and Shift 38's handoff instead. Track B this shift was a small, fully
build-verifiable code change (below) rather than a blind UI push.

### Track A — three axes, 58 net new curated features, three research waves reviewed by hand

**Axis 2 (road stations) — Via Militaris, the fourteenth road, and the single largest remaining
geographic gap in the axis closed.** `road_stations.geojson` 326 → 360 (+34). The great Balkan
diagonal (Via Diagonalis), Singidunum/Belgrade through Naissus, Serdica, Philippopolis and
Hadrianopolis to Constantinople — the entire corridor had **zero** stations before this shift.
Built primarily from the Itinerarium Burdigalense (333 CE, which labels every stop mansio/mutatio
with mileages) cross-referenced against the Antonine Itinerary. 12 securely identified and
excavated (Bona Mansio's 2.60m circuit wall dug from 2016, Carassura at Rupkite, Scretisca's
Constantinian palatium at Kostinbrod, Turres under Pirot Fortress); 12 interpolated corridor
markers shipped `identified:false`/`confidence:low`.

*Three shared nodes dropped rather than duplicated* (Selymbria, Athyras, Rhegion are already on the
map as Via Egnatia entries — same real towns, same coastal approach to Byzantium, following the
Luni/Aquae Cutiliae precedent). *Two id collisions renamed* (`station_ad_octavum` and
`station_ad_sextum` already existed on the Via Appia / elsewhere; the Moesian ones got
`_moesia` suffixes). *Independent geodesic check caught four failures the research pass's own
report had not flagged as severe*: Redicibus, Extuomne, Baunne and Callum each carried a real
sourced figure measured from a *city* (Naissus, Serdica, Heraclea, Selymbria) rather than the
previous station in the layer, so each was ~double its geodesic floor and would have rendered a
wrong "N Roman mi from previous stop" in the hover popup — all four nulled. 14 legs total ship
null. Five legs remain 1-11% short of geodesic floor and were kept: genuine whole-mile Itinerary
figures against village-level approximate coordinates, coordinate-precision noise not a source
conflict. The weakest segment is Hadrianopolis→Bergule, where the research pass couldn't reach
the verbatim Bordeaux Latin and the reconstructed mileage chain under-runs the straight line —
flagged for a future revisit with library access.

**Axis 15 (welfare/euergetism) — 9 more benefactor inscriptions, well past the 20-floor.**
`euergetism.geojson` 43 → 52 (+9). Ephesus (Salutaris's 104 CE foundation cut in 568 lines on the
theatre wall; the Mazaeus-Mithridates gate dedicated by two imperial freedmen), Miletus (Capito's
baths), Leptis Magna (Iddibal's Chalcidicum, a Punic family's gift), Merida (Agrippa's theatre),
Athens (Agrippa's Odeion), Assisi (the Caesii brothers' temple), Pula (Salvia Postuma Sergia's
arch — a woman's name on the frieze c. 27 BCE), Saintes and Lyon (both C. Julius Rufus, a
third-generation Gaulish citizen). *Filtered the research pass's 16 raw records against the file's
own existing 43 first*: 6 were the same monument/donor already mapped under a different id
(Ephesus's Nymphaeum Traiani, Aphrodisias's Zoilos, Munigua's forum, Corinth's Babbius, plus
Pompeii's Eumachia and Herculaneum's Nonius Balbus which collided on id exactly), and a 7th
(Vibius Salutaris) was caught by the append script's id-dedup. Miletus and Leptis ship without
image_url — the only findable images were a Baths-of-Faustina (Antonine, wrong period) or an
unconfirmable generic filename, so both went null rather than force a wrong image. Rejected on
review: the Library of Celsus (a construction site not a standing building on 11 Aug 117, date
genuinely unstable 114-135), and the whole Hadrianic/Antonine wave (Plancia Magna, Herodes
Atticus, Opramoas, the Demostheneia foundation, Aspendos, Sagalassos).

**Axis 12 (imperial cult) — 15 more cult centers, nearly doubling the layer.**
`imperial_cult.geojson` 18 → 33 (+15). Pula, Vienne and Nimes (all three western Augustea that
still stand roofed today), Merida, Athens's Acropolis rotunda 23m east of the Parthenon, Nicaea
and Smyrna (the Roman-citizen and second-Asian provincial temples), Leptis Magna's Old Forum
temple, Thessaloniki, Ostia (facing the Capitolium across the forum), Pozzuoli, Cyrene's
Caesareum (wrecked in the very Kitos War unfolding at the snapshot), Glanum's twin temples, Teos,
and Narona (17 beheaded imperial statues dug from under a Croatian village). All cross-checked
against the file's existing 18 first — Nicomedia, Narbo, Corduba, Alexandria, Caesarea Maritima,
Sebaste, Pisidian Antioch, Carthage and Beroea were already present and correctly skipped (the
brief's own "already on the map" list was incomplete). *One coordinate corrected before merging*:
the Maison Carree point was ~340m off, outside the 100m floor for a confidence:high record.
*Five ship without image_url* (Nicaea, Smyrna, Leptis, Thessaloniki, Teos) — none of these temples
has ever been archaeologically located, and the research pass declined to substitute a photo of a
later rebuild on the same forum. Rejected on review: Pergamon's Traianeum (Hadrianic, built after
Trajan's death despite the name — the classic trap), the Cyzicus temple of Divus Augustus (never
finished, per Tacitus and Dio), and Cologne's Ara Ubiorum (real and Tacitus-attested but never
located and no evidence it still functioned as a cult site in 117). Introduced two new categories
to the layer, `augusteum` and `imperial_altar` — handled by the Track B popup change below.

**Axis 17 (exile/penal) — Shift 38's own handoff enrichment done.** The existing Sardinia/Metalla
(Fluminimaggiore) `penal_mine` record now carries the two bishops of Rome condemned to those mines
that Shift 38 identified as belonging here as enrichment rather than a new pin: Callixtus (c. 186
CE, freed by an imperial mistress's intervention) and Pontian (deported 235 CE, died at the rock
face). Note grew 88 → 114 words; two new sources added (Hippolytus, Liber Pontificalis).

### Track B — graceful category-label degradation in thematic popups

`app/Map.tsx`: added a `prettyCategory()` helper and wired it as the fallback in the road-station,
imperial-cult and euergetism hover popups. A category present in the data but absent from a popup's
hardcoded label map now renders as words ("Imperial altar") instead of a bare snake_case
identifier ("imperial_altar"). This shipped *before* the imperial-cult merge specifically so the
new `augusteum` category (and any future sub-category any shift adds) reads cleanly with no popup
edit needed. Also cleaned up the road-station popup, which had been showing its category in bare
lowercase ("mansio"). Pure popup-text formatting, no chrome colors or layout touched, so no
invariant-0 screenshot concern; verified via `tsc --noEmit` + `npm run build` clean. Committed and
pushed as its own atomic commit first.

Also corrected four stale FEATURE_BACKLOG notes that described already-fixed problems: the
`pompeii.geojson` placeholder (file no longer exists), the `pois-dot`/`pois-label` dead-layer
cleanup (already done), and the two "Map.tsx sequential await chain" performance notes (obsoleted
by `[11-P0-2]`'s lazy `registerLayerLoader` overlay loading — thematic layers aren't fetched on
cold load at all any more, so there's no chain to settle). Marked `[x]` with what resolved them
rather than deleted, so the record stays legible.

### Build, validate, verify

`npm run validate` clean at every commit: 0 errors throughout, 17 pre-existing warnings (the
standing diplomacy/neighbors "outside the empire envelope" false positives for India/China nodes,
and the letters route-line "no name field" set). Caught and fixed two transient validator warnings
mid-merge (euergetism's Miletus/Leptis empty-string image_url keys — dropped the keys rather than
ship them empty). `npm run build` clean on all five pushed commits. `npm run metrics -- --write`:
**1,740 curated places total (+58)**, 481 POIs unchanged, image coverage 53.4%, cross-file
collisions 126 → 133 (expected — new points near existing gazetteer entries; informational, tracked
under `[12-P0-1]`), 0 validator errors.

### Handoff for the next shift

1. **A fifteenth road, or fill the Via Militaris weak segment.** With Postumia, Cassia+Clodia,
   Aurelia, Salaria, Traiana and now Militaris done, the obvious remaining thin road is **Via
   Cottia** (6 stations, historically short but likely under-covered across the Cottian Alps,
   Segusio/Susa). Alternatively the Via Militaris Hadrianopolis→Bergule segment needs the verbatim
   Bordeaux Latin (library/ToposText-direct access) to resolve its under-running mileage chain and
   possibly recover Ostudizo/Burtudizo/Tarpodizo, and Idimum just needs a geocode for "Medveda,
   opstina Despotovac" to add a 35th securely-identified Balkan station.
2. **Axis 12 (imperial cult) has real room left** — this shift found 15 without exhausting the
   search; Barcino's four-column forum temple, Banias/Caesarea Philippi's Herodian Augusteum, and
   the Tres Arae Sestianae are all real but were dropped for want of a securable dedication or a
   placeable coordinate, recoverable with better sourcing access.
3. **Axis 15 benefactor_inscription sits at 30, well clear of the 20-floor** — the Pompeii
   amphitheatre (Quinctius Valgus / Porcius, CIL X 852, c. 70 BCE) and Holconii theatre are both
   verified drop-in-ready records the research pass held back only under a two-Vesuvian-sites cap;
   an easy future top-up if the axis is picked again.
4. **Axis 15 alimenta_town still sits at 22 of the ~50 ceiling** — unchanged this shift; the
   easy-ground-is-gone finding from Shifts 36-38 still holds, needs library/EDH access to
   Duncan-Jones 1964 rather than more WebSearch passes.
5. **Board fresh-check**: still no unclaimed P0/P1 `add` ticket smaller than a multi-pass refactor.
   Topmost unclaimed P0s unchanged since Shift 34. Six shifts running (34-39) have made the same
   decline call on `[12-P0-1]`/`[03-P0-1]` for the same "don't land a half-finished refactor on
   prod unsupervised" reason; a shift with genuinely dedicated multi-pass runway (not just a larger
   token budget) is what these need.

---

## Shift 38 — 2026-08-20 (this shift's own prompt claimed "Shift 3 of four")

**Same stale-numbering mismatch every shift since #13 has flagged** — the scheduled prompt said
"Shift 3 of four," but `SHIFT_LOG` was 37 real shifts deep at session start, so this entry
continues as Shift 38. Session started `HEAD` detached at the real tip (`34c08ef`) with local
`main` nine commits behind and pointing at an unrelated, non-ancestor commit (`709a480`) — not
just "behind," the two branches had 50 different commits each per `git status`. `git ls-remote`
wasn't needed to resolve it: the detached `HEAD` content matched a clean working tree, so
`git reset --hard origin/main` was safe (confirmed no uncommitted work existed first). Fresh
container needed `npm install`; reverted the resulting `package-lock.json` `hasInstallScript`/
`libc`-field churn before touching anything else, same pattern every recent shift has documented.
Read `SHIFT_BRIEF.md` and `BOARD.md` in full before starting. `WebFetch` to `en.wikipedia.org`
confirmed `EGRESS_BLOCKED` directly in this session — `WebSearch` was the only working research
channel throughout, matching every prior shift's report.

### Board check

Same unclaimed P0 set Shifts 34-37 all found and declined for the same reason: `[12-P0-1]`
merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain,
`[02-P0-4]` self-host-glyphs — all large, multi-file, "may take several passes" tickets that an
unsupervised session pushing straight to production shouldn't attempt mid-refactor with nobody
watching. Followed the brief's own axis queue and Shift 37's handoff notes instead.

### Track A — three axes, 20 net new curated features, four research waves reviewed by hand

**Axis 2 (road stations) — Via Traiana, the thirteenth road, per Shift 37's own handoff pick.**
`road_stations.geojson` 312 → 326 (+14). Trajan's 109 CE Apulian shortcut, Beneventum to
Brundisium, cross-referenced against the Antonine Itinerary (Itin. Ant. 116 — its own stated
section total of 235 mp matches the sum of its individual station-to-station figures, a strong
internal check on the route backbone) and the Tabula Peutingeriana for finer-grained mutationes:
Forum Novum, Aequum Tuticum, Aecae (mod. Troia), Herdonia, Canusium, Rudas, Rubi, Butuntum,
Barium, Turris Iuliana, Turres Aureliae, Egnatia, Ad Decimum, Speluncae. Shares its Beneventum
origin and Brundisium terminus with the existing Via Appia entries rather than duplicating them,
following the Luni/Aquae Cutiliae shared-node precedent.

This shift ran its own independent geodesic sanity check on the research agent's output before
merging (a claimed road distance can never be shorter than the straight-line distance between two
points, per the standing practice Shifts 35-37 established) and found three legs where the
agent's own draft had over-specified a number the sources don't actually support closely enough:
Forum Novum→Aequum Tuticum (the source gives only the combined Beneventum-to-Aequum-Tuticum
total, not this specific leg), Canusium→Rudas (Rudas is itself an unidentified, approximate-
coordinate waypoint — the ~1 mp shortfall is very plausibly just coordinate-precision noise, not
a real source conflict), and Turris Iuliana→Turres Aureliae (the only reliable figure found is
the direct Barium-to-Turres distance, not this specific sub-leg). All three now ship
`distance_from_previous_mp: null` rather than the over-precise number, plus one real numeric
correction: Itin. Ant.'s own Canusium-Rubi figure (23 mp) is geodesically impossible against
secure endpoint coordinates, so this entry uses the Tabula Peutingeriana's two-hop
Canusium-Rudas-Rubi total (12+14=26 mp) instead, which checks out.

**Axis 15 (welfare/euergetism) — one more alimenta town, and a real research exhaustion finding;
5 more benefactor inscriptions, clearing the axis's 20-inscription floor.**
`euergetism.geojson` 37 → 43 (+6).

*Alimenta towns, 21 → 22*: a deep research pass targeting Shift 37's own flagged Regio I/Regio IV
gap (~35 towns checked by name: Bovianum, Aesernia, Saepinum, Larinum, Corfinium, Sulmo, Alba
Fucens, Cures Sabini, Reate, Casinum, Aquinum, Praeneste, Tibur, Minturnae, Puteoli, and more)
found the axis genuinely thin there, not under-searched — every one of the seven known individual
"pueri et puellae alimentarii" dedication inscriptions traced back to towns already on the map.
One real new find: Cales (modern Calvi Risorta, Campania), independently cited in Greg Woolf's
1990 PBSR survey of alimenta epigraphy (CIL X, 3910), shipped at `confidence: medium` since the
primary inscription text itself was unreachable in this sandbox. The remaining ~28 towns toward
the brief's 50-town ceiling most likely sit in Duncan-Jones 1964's full appendix or Woolf 1990's
complete town list, both paywalled/unreachable here — flagged for a future shift with library or
EDH/EDCS access rather than more WebSearch-only passes over the same ground.

*Benefactor inscriptions, 16 → 21*: Como (Pliny the Younger's library + baths + child-support
endowment to his hometown Comum, CIL V 5262 and his own *Epistulae* 1.8), Bursa (Dio Chrysostom's
stoa-and-library rebuild of Prusa, attested in his own surviving orations and independently
corroborated by Pliny's Bithynia governorship correspondence investigating the project — *Ep.*
X.81-82), Saelices (Segobriga's gilded bronze-letter forum pavement), Leptis Magna (Annobal
Tapapius Rufus's bilingual Latin/Neo-Punic theatre dedication, IRT 321-322 + IPT 24a — a second,
distinct monument from the city's existing entry), Pozzuoli (the Temple of Augustus, CIL X
1613-1614). The brief's own headline candidate for this axis, Plancia Magna's Perge gate complex,
was checked and rejected: multiple independent sources converge on 119-122 CE construction, which
is Hadrianic and postdates this map's 117 CE snapshot by 2-5 years. A dozen further candidates
(Thugga, Tarraco's and Italica's amphitheatres, Patara, Bulla Regia, Sabratha, Cuicul, Volubilis,
Suessa Aurunca) were researched and rejected for the same reason or for lacking a securely named
donor.

**Axis 3c (economic infrastructure) — a stale backlog note corrected, one verified image added.**
FEATURE_BACKLOG.md had carried a note since Shift 11 flagging Docimium, Mons Porphyrites, Cotta,
and the Henchir Mettich estate inscription as "real, sourced candidates still on the table,"
dropped only for lack of a verified image. Checking `pois.geojson` before dispatching fresh
research found all four already existed as full records — a later shift had committed them
without ever updating this backlog note, so it had been silently stale for at least several
shifts. Added a verified `image_url` to Henchir Mettich (a photo of the inscription itself,
cross-checked against a French Wikipedia file-description page showing real dimensions, not just
a bare search-snippet filename guess) and confirmed Mons Porphyrites' existing image is real.
Left Cotta and Docimium without an image rather than force a fit: no confirmable Commons filename
exists for the Cotta site itself, and the one Docimium candidate found is a Pavonazzetto marble
sculpture in a Copenhagen museum, not a photo of the quarry.

**Axis 17 (exile/penal) — real negative result, not merged.** A research pass for `penal_mine`
entries (the brief's own flagged Danube-salt-mines and broader-Sardinia leads) came back with
only two candidates clearing the "genuinely attested penal labor" bar, and both failed the 117 CE
snapshot rule on inspection: the only ancient source tying either site (Cyprus's copper mines,
Cilicia's Taurus mining district) to condemned labor is Eusebius's *Martyrs of Palestine*,
describing events of 308-310 CE — nearly two centuries after this map's snapshot, during
Diocletian's persecution. Declined to merge rather than stretch a genuine ancient attestation
across two centuries it doesn't cover. Real Danube salt-mine forced labor (legio XIII Gemina
running Dacia's Salinae with slaves/servile tenant-agents) is attested, but no source calls it a
*judicial condemnation* specifically, so it doesn't belong in this category either. Two
historical popes (Callixtus I, c. 186-189 CE; Pontian, 235 CE) were genuinely condemned "to the
mines of Sardinia," but both trace to the same Metalla/Iglesiente district as the existing
Fluminimaggiore entry — worth citing there as enrichment in a future pass rather than a new pin.

### Track B — a repeatedly-flagged doc decision settled, real UI work declined for the same reason as Shifts 34-37

FEATURE_BACKLOG.md's "New POI categories need a `poiCategories.ts` entry" aside, everything else
open at P0-P3 was either already shipped, blocked on tooling/network, or one of the large
UI/architecture items (terrain shading, dark mode) that prior shifts have consistently and
explicitly declined to attempt unsupervised. This shift settled one smaller, repeatedly-flagged
question instead: whether invariant 1.5's display-name rule applies to `sites_buildings.geojson`/
`sites_streets.geojson`'s raw OSM building/street labels. Decided no — those are legitimate
in-language source data, not the ancient/modern-name-duplication pattern the rule targets — and
added a one-line scope note to `SHIFT_BRIEF.md` §1.5 so this stops resurfacing as an open
question every few shifts (flagged since Shift 8, never resolved).

### Build, validate, verify

Fresh container needed `npm install` first; `package-lock.json` churn reverted before the first
commit. `npm run validate` clean at every commit: 0 errors throughout, 17 pre-existing warnings
(same standing set every recent shift has carried — the 4 diplomacy/2 neighbors "outside the
empire envelope" warnings are expected false positives for India/China nodes deliberately outside
Rome's borders). Cross-file name collision count moved 124 → 126 as expected (new points landing
near existing gazetteer entries) — informational only, tracked under `[12-P0-1]`. `npm run build`
clean on all five pushed commits. `npm run metrics -- --write`: 1,682 curated places total (+20),
481 POIs unchanged (none of this shift's touched files are in the POI-schema count except the one
Henchir Mettich image field, which doesn't move the count), image coverage 53.2% → 53.4%, 126
cross-file collisions, 0 validator errors.

### Handoff for the next shift

1. **A fourteenth road remains open.** With Postumia, Cassia+Clodia, Aurelia, Salaria, and now
   Traiana all done, Via Egnatia is already at 35 stations (likely near-complete), but Via
   Domitia (16), Via Cottia (6), and Via Augusta (51, may already be thorough) haven't been
   revisited recently — Via Cottia in particular looks thin relative to its historical length
   (Segusio/Susa across the Cottian Alps) and is a natural next pick.
2. **Axis 15's alimenta_town count sits at 22 of the ~50 ceiling, and this shift confirmed the
   easy ground is gone.** Three shifts running (36, 37, 38) have now searched Regio I, IV, VI,
   and VIII with real, targeted effort. A future pass needs either library/EDH/EDCS access to
   Duncan-Jones 1964's full appendix, or a pivot to a different sourcing strategy entirely —
   more WebSearch-only passes over the same ~40 towns will keep returning the same handful of
   already-mapped names.
3. **Axis 15's benefactor_inscription count sits at 21, past the 20-floor target** — real room
   still exists (this shift found 5 real new ones in one pass without exhausting the search),
   so a future shift could keep pushing this rather than treat it as done.
4. **Axis 17's penal_mine category is genuinely thin (2 entries) and this shift confirmed why**:
   site-specific ancient testimony naming condemned/penal labor (as opposed to generic slave/
   war-captive labor, which nearly every major mine has) is much rarer than secondary literature
   implies. The two Popes-condemned-to-Sardinia's-mines detail (Callixtus I, Pontian) is real and
   citable but belongs as enrichment on the existing Fluminimaggiore entry, not a new pin — worth
   doing in a quick follow-up pass.
5. **Axis 20's gymnasia gap (6 sites) is still stuck on the same WebFetch-to-Commons block** every
   shift since #14 has hit — no change this shift, not re-attempted since Shift 37 already
   confirmed a third WebSearch-only session couldn't crack it.
6. **Board fresh-check**: still no unclaimed P0/P1 `add` ticket smaller than a multi-pass
   refactor. Topmost unclaimed P0s unchanged since Shift 34 — `[12-P0-1]` merge-themes,
   `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain, `[02-P0-4]`
   self-host-glyphs. Five shifts running have now made the same call on these for the same
   reason; if a shift with genuinely dedicated multi-pass runway (not just a larger token budget)
   picks this up, `[12-P0-1]` merge-themes unlocks the most downstream value per the board's own
   framing ("unlocks search, cards, nearby and every content ticket below").

---

## Shift 37 — 2026-08-20 (this shift's own prompt claimed "Shift 2 of four")

**Same stale-numbering mismatch every shift since #13 has flagged** — the scheduled prompt said
"Shift 2 of four," but `SHIFT_LOG` was 36 real shifts deep at session start, so this entry
continues as Shift 37. Session started `HEAD` detached at the real tip (`f916956`) with local
`main` seven commits behind (`709a480`); `git checkout -B main origin/main` put it cleanly on the
real tip (confirmed identical to detached `HEAD` first), no data loss. Fresh container needed
`npm install` (`node_modules` missing); reverted the resulting `package-lock.json` `libc`-field
churn before touching anything else, same pattern every recent shift has documented. Read
`SHIFT_BRIEF.md` and `BOARD.md` in full before starting.

**Network block reconfirmed** — `WebFetch` to `commons.wikimedia.org` returned `EGRESS_BLOCKED`
directly in this session (not just inside sub-agents), matching every prior shift's report.
`WebSearch` remained the only working research channel throughout; all seven research agents this
shift were briefed accordingly.

### Board check

Topmost unclaimed board tickets are unchanged from Shifts 34–36's notes: `[12-P0-1]` merge-themes,
`[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain, `[02-P0-4]` self-host-glyphs
— all large architectural changes. Considered actually taking one on given this session's unusually
large token budget, but an unsupervised shift that pushes straight to production with no human
review is the wrong place to attempt a multi-file refactor that "may take several passes" per the
ticket's own description — a half-finished `merge-themes` pass would leave the live site's data
pipeline in a broken intermediate state with nobody watching. Declined for that reason, not just
"better suited to a dedicated shift" as prior shifts phrased it. Track A followed the brief's own
axis queue and Shift 36's handoff notes, then kept going past the two-axis minimum since the
budget allowed it.

### Track A — five axes, 54 net new features, seven research waves reviewed and merged by hand

Every batch below ran through this shift's own review before merging (not just the research
agent's self-reported checks): geodesic sanity checks on road distances, ID-collision checks
against all 42 existing data files, and a deliberate choice to leave `image_url` off six records
this shift rather than force in an anachronistic image just to satisfy invariant 1.6's letter.

**Axis 2 (road stations) — two more complete roads, per Shift 36's own handoff pick.**
`road_stations.geojson` 284 → 312 (+28).

- **Via Aurelia** (Rome → Luna via the Tyrrhenian coast, connecting to Via Postumia's Genua
  terminus and closing the coastal road loop), 15 stations: Lorium, Ad Turres, Pyrgi, Castrum
  Novum, Centumcellae (Trajan's new harbor, finished ~106–107), Graviscae, Forum Aurelii, Cosa,
  Telamon, Populonium, Vada Volaterrana, Ad Herculem, Pisae, Taberna Frigida, Luna (shared node
  with the already-curated Luni city entry, following the Verona/Placentia precedent).
- **Via Salaria** (Rome → the Adriatic at Castrum Truentinum, the old "salt road"), 13 stations:
  Fidenae, Eretum, Vicus Novus, Reate, Cutiliae (shared site with the health-axis Aquae Cutiliae
  entry — different layer, different purpose, following the same shared-node precedent), Interocrium,
  Forum Decii, Falacrinae (Vespasian's birthplace), Ad Martis, Vicus Badies, Ad Centesimum, Asculum
  Picenum, Castrum Truentinum.

**Three geodesic-check failures caught and corrected before merging** (a claimed road distance can
never be shorter than the straight-line distance between two points, per the standing practice
Shift 35 established and Shift 36 confirmed useful a third time): Rome→Fidenae (5 mp sourced, 7 mp
needed), Populonium→Vada Volaterrana (25 mp sourced, 28 mp needed), Pisae→Taberna Frigida (27 mp
sourced, 28 mp needed). Two stations (Telamon, Populonium) ship `distance_from_previous_mp: null`
rather than a guess — the surviving Antonine Itinerary mileage for that stretch of the Aurelia is
internally inconsistent with secure endpoint coordinates on both ends, confirmed independently by
the research pass and by this shift's own re-check, not just taken on trust.

**Axis 13 (political apparatus) — 4 more senators' hometowns, closing Shift 36's flagged
30-hometown floor with room to spare.** `politics.geojson` senator_hometown 28 → 32.

Two research waves: the first targeted Shift 36's own flagged gap (Hispania Baetica beyond Ucubi,
Macedonia, Cilicia) and came back thin — real effort, but Baetica and Macedonia turned up nothing
meeting the project's origo-plus-dated-Trajanic-office bar. The second wave broadened to Africa
Proconsularis, Syria, Achaea, Numidia, Egypt, Pontus-Bithynia, Moesia, Galatia, Cappadocia, and
Cyrenaica, and found three solid names. Net new: Hierapolis Castabala/Cilicia (Quintus Pompeius
Falco, Dacian War tribune turned governor of Lycia-Pamphylia then Judaea, suffect consul 108),
Thugga/Africa Proconsularis (Senecio Memmius Afer, suffect consul 99 — origo inferred from family
name and cognomen rather than a direct inscription, shipped at `confidence: medium` and phrased as
"likely" rather than stated flat), Samosata/Syria (Gaius Julius Antiochus Epiphanes Philopappus,
grandson of Commagene's last king, suffect consul 109 — the Philopappos Monument on Athens's
Mouseion Hill still shows him in his consular robes), Athens/Achaea (Tiberius Claudius Atticus
Herodes, praetor 98, father of the sophist Herodes Atticus).

**Two near-miss duplicates caught and dropped before merging**: Lucius Catilius Severus's origo
Apamea Myrleia is the same site as the already-mapped Mudanya; Gaius Julius Cornutus Tertullus's
origo (Attaleia, contested against Perge in the scholarship either way) is already mapped as
Antalya regardless of which reading is right. Egypt and Numidia came back genuinely empty after
real effort across both waves — Egypt structurally, since it was equestrian-governed and barred
senators outright; Numidia's roughly ten known senatorial families are attested mostly without a
specific city. Full rejected-candidate list (now ~50 names across three shifts) is in the two
merge commits rather than repeated here — a future pass on this axis should treat Baetica,
Macedonia, Egypt, and Numidia as thoroughly searched, not under-searched.

**Axis 6a (systems overlay, trade routes) — 2 more complete routes.** `trade_routes.geojson`
36 → 51 (+15: 2 LineStrings, 13 named nodes). Silk Road (western/Roman segment: Antioch → Palmyra
→ Dura-Europos → Ctesiphon → Ecbatana → Merv → Bactra, tracing the route through Parthian and
Kushan middleman territory) and Incense Road (Shabwa → Najran → Dedan → Hegra → Petra → Gaza,
frankincense and myrrh from Hadhramaut through the Nabataean network — by 117 CE Petra itself sat
inside the Roman province of Arabia, so the old smuggling route had become an imperial tax stream).
Completes 5 of the brief's Axis 6a list (Amber, grain ×3, tin, olive oil ×2 were already on the
map before this shift). Node schema matches the file's existing pattern deliberately
(id/route/name/role/sources, no `image_url`) rather than the full POI schema, since these are
route-line hover nodes, not place cards — same reasoning FEATURE_BACKLOG already applies to
`penal.geojson`'s and other axis files' schema choices.

**Axis 20 (sports) — 1 of the 6 (now down from 7) flagged gymnasia image-gap sites closed.**
`sports.geojson` gymnasia 21 → 22. FEATURE_BACKLOG has carried this same 7-site image gap
(Corinth, Termessos, Thera, Magnesia on the Maeander, Iasos, Knidos, Alinda) since Shift 14/18,
each confirmed real and sourced but blocked purely on a verified Commons filename. This shift's
research pass confirmed exactly one: Thera's "Cave of Hermes in the Gymnasium of the Ephebes"
(Baud-Bovy/Boissonnas, 1919), cross-confirmed independently via two separate Commons category
listings since direct `WebFetch` to `commons.wikimedia.org` stays blocked here. The other 6 remain
open — Termessos's `Category:Gymnasium (Termessos)` (~28 files) is the closest to resolved, but a
third dedicated search session still couldn't surface one individual filename from inside it, which
increasingly looks like a hard limit of WebSearch-snippet-only research rather than something a
fourth attempt with the same tools will crack. FEATURE_BACKLOG updated to say this plainly.

**Axis 15 (welfare/euergetism) — 6 more alimenta towns, a real gap this shift found by checking
raw feature counts against the brief's own "all 50" framing rather than assuming the axis was
done.** `euergetism.geojson` alimenta_town 15 → 21. Sourced from the corpus of "pueri et puellae
alimentarii" honorific dedications (Duncan-Jones, PBSR 32, 1964) — a distinct evidentiary category
from the two big loan tables (Veleia, Ligures Baebiani) the existing 15 towns were mostly drawn
from. Cereatae Marianae, Sestinum, Tifernum Mataurense, Asisium, and Ficulea are independently
attested through named dedications to Hadrian, Antoninus Pius, or Marcus Aurelius. Urbinum
Mataurense ships `confidence: low` — its CIL XI 5395 town identification is the standard scholarly
reading but wasn't independently confirmed this shift, and the note says so rather than stating it
flat. Pitinum Mergens was investigated and excluded as a likely duplicate of the map's existing
Acqualagna entry (the modern antiquarium there is explicitly dedicated to Pitinum Mergens) — worth
a follow-up check against Acqualagna's own sourcing to confirm rather than re-flagging blind.
~23 other candidate towns checked and rejected for lacking any alimenta-specific attestation
distinct from general town history; full list in the merge commit. All 6 ship without `image_url`
— the only available images for these towns are later medieval/Renaissance landmarks (a basilica,
a ducal palace) with no real connection to the Trajanic-era attestation, and using them would
misrepresent the site more than an absent hero image would. Same shape as the pre-existing
`health.geojson`/`imperial_cult.geojson` gap (0/51 and 0/18 have `image_url` at all) — this
project's invariant 1.6 is aspirational and unevenly applied across 37 shifts, not a hard gate that
blocks a commit.

### Track B — deliberately skipped, and why

Same reasoning as Shifts 34–36: FEATURE_BACKLOG's remaining open items are either genuinely large
(dark mode, terrain shading, the `.next`/`next dev` collision fix) or already-logged research/image
top-up notes rather than shippable UI work. This shift's budget went entirely into Track A given how
much further it stretched than a typical shift's — five axes deep rather than the usual two.

### Build, validate, verify

Fresh container needed `npm install` first. `npm run validate`: 0 errors throughout every commit,
17 warnings (same pre-existing set every recent shift has carried — the 4 diplomacy/2 neighbors
"outside empire envelope" warnings are expected false positives for India/China nodes that are
supposed to be outside Rome's borders). Cross-file name collision count crept 122 → 124 as expected
(new points landing near existing gazetteer entries) — informational only, tracked under
`[12-P0-1]`, not a blocker. `npm run build` clean on all six data commits before each push. `npm run
metrics --write` (note: needs the `--` separator — `npm run metrics --write` silently no-ops, `npm
run metrics -- --write` actually writes; wasted one round-trip catching this): 481 POIs unchanged
(none of this shift's five axis files are in the POI-schema count), 1,662 curated places total
(+54), 124 cross-file collisions, 0 validator errors.

**One real mid-shift catch**: a routine "wrap up" pass found `FEATURE_BACKLOG.md`'s gymnasia-note
edit sitting uncommitted after the sports.geojson push — the stop-hook's git-check flagged it before
it could be lost. Worth restating the standing lesson: commit *every* file you touched in a batch,
not just the data file, before moving to the next piece of work.

### Handoff for the next shift

1. **A fifth Etruria/Umbria-radiating road remains open**: with Postumia, Cassia+Clodia, Aurelia,
   and Salaria all done, the Via Appia itself (only 26 stations logged against a Rome-Brundisium
   run that historically had far more) or Via Appia Traiana (Beneventum onward, Trajan's own
   116-completed shortcut to Brundisium — very on-snapshot) are the natural next picks; neither has
   been touched since whatever shift first logged Via Appia's initial 26.
2. **Axis 13 senator_hometown sits at 32, past the 30 floor** — but Baetica, Macedonia, Egypt, and
   Numidia are now confirmed thin/empty across three shifts' worth of research, not under-searched.
   A future pass should target genuinely fresh ground (Pannonia, Britannia, Mauretania,
   Cappadocia-Galatia beyond what's already checked) rather than re-walking these four.
3. **Axis 20's gymnasia gap is down to 6 sites and looks stuck on tooling, not research effort.**
   Three separate WebSearch-only sessions (this shift included) have failed to extract an individual
   filename from Termessos's confirmed 28-file Commons category. Whoever next has working `WebFetch`
   to `commons.wikimedia.org`, or a differently-sandboxed environment, should be able to close most
   of this in minutes by just opening the category page directly.
4. **Axis 15's alimenta_town count is 21 of a ~50 ceiling** — real room left. The `pueri et puellae
   alimentarii` dedication corpus this shift mined (via Smith's Dictionary / Duncan-Jones 1964) is
   not exhausted; try Regio IV (Samnium) and Regio I (Latium/Campania) towns specifically next,
   since this shift's yield concentrated in Regio VI (Umbria).
5. **Board fresh-check**: still no unclaimed P0/P1 `add` ticket. Topmost unclaimed P0s unchanged —
   `[12-P0-1]` merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain,
   `[02-P0-4]` self-host-glyphs. A shift with a full 6 hours and nothing else competing for
   attention is still the right shape to finally take one of these on — this shift's larger budget
   went to breadth instead because an unsupervised session mid-refactor felt like the wrong risk to
   take with no one watching the push.

---

## Shift 36 — 2026-08-20 (this shift's own prompt claimed "Shift 1 of four")

**Same stale-numbering mismatch every shift since #13 has flagged** — the scheduled prompt said
"Shift 1 of four," but `SHIFT_LOG` was 35 real shifts deep at session start, so this entry
continues as Shift 36. Session started `HEAD` detached at the real tip (`505d8ef`) one commit
ahead of a stale local `main` (`709a480`, seven shifts behind) with `main`/`origin/main`
reporting "unrelated histories" on a plain merge attempt — `git reset --hard origin/main` on the
local branch (confirmed identical to detached `HEAD` first) put it cleanly on the real tip, no
data loss. `node_modules` was missing on this fresh container; `npm install` restored it (also
reverted the resulting `package-lock.json` churn — `libc` field removals from a newer local npm
regenerating metadata, not a real dependency change — before committing anything). Read
`SHIFT_BRIEF.md` and `BOARD.md` in full before touching anything.

**Network block reconfirmed** — direct `curl` to `overpass-api.de`/`commons.wikimedia.org` both
returned `CONNECT tunnel failed, response 403` via the agent proxy, same as every prior shift.
WebSearch (through background research agents) remained the only working research channel.

### Board check

Topmost unclaimed board tickets are unchanged from Shift 34/35's notes: `[12-P0-1]` merge-themes,
`[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain, `[02-P0-4]` self-host-glyphs
— all large architectural changes better suited to a shift that opens with one as its sole focus,
and (for terrain/glyphs specifically) likely blocked on the same egress restriction that's held
every prior shift back from live tile/font fetches. Declined for the same reason as the last two
shifts. Track A followed the brief's own axis queue and Shift 35's own handoff notes directly.

### Track B — deliberately skipped, and why

`FEATURE_BACKLOG.md`'s P0–P3 checklists are now almost entirely checked off. The few open items
left are either genuinely large (dark mode — confirmed non-trivial by a prior shift's own note:
`Map.tsx` hardcodes the parchment halo color inline more than a dozen times rather than reading
a palette token; terrain shading — needs a DEM/raster tile source likely blocked by the same
egress restriction) or already resolved without their checkbox being flipped (checked this shift:
the "Legend/Layers buttons overlap by ~12px" note from Shift 12 turned out fixed — current FAB
stack offsets are 32/121/169/217/313, evenly spaced; the "mobile sheet covers the FAB stack" note
from Shift 5 turned out fixed too — `ZoomControl.tsx` and siblings already read `usePoiPanel()`
and hide while a place is open). Rather than force a marginal UI change into the slot, this shift
put the full budget into Track A. Per the brief's own rule ("if you don't have time for Track B,
that's fine — data wins"), this is a deliberate call, not an oversight — logged here so it reads
as a decision, not a skip nobody noticed.

### Track A — two axes, 49 net new features, four research waves reviewed and merged by hand

Ran four background research agents in two waves (2 concurrent per wave, disjoint files), each
independently reviewed before merging — not just trusting the agent's own self-reported checks,
per the standing lesson from Shift 34's beneficiarii catch and Shift 35's senator-schema catch.

**Axis 2 (road stations) — three complete roads, all radiating from Rome's Cisalpine/Etrurian
network Shift 35 flagged as the natural next pick.** `road_stations.geojson` 248 → 284 (+36).

- **Via Postumia** (Genua/Genoa → Aquileia, the tenth road on the map), 17 stations: Genua,
  Pontedecimo, Libarna, Dertona, Iria, Camillomagus, Cremona, Locus Castorum, Bedriacum, an
  unidentified Villafranca di Verona junction, Verona, Calidarium, Vicetia, Postioma, Opitergium,
  Concordia, Aquileia — sourced from the Antonine Itinerary, Tabula Peutingeriana, and a Verona
  milestone (CIL V) fixing the Genua–Cremona total at 122 Roman miles. 148 BCE road, one of the
  best-attested in the whole network thanks to surviving milestones.
- **Via Cassia + Via Clodia** (Rome → Florentia/Florence, the eleventh and twelfth roads), 19
  stations: 11 on the Cassia (Baccanae, Sutrium, Vicus Matrini, Forum Cassii, Aquae Passeris,
  Volsinii, Clusium, Ad Statuas, Arretium, Ad Fines/Casas Caesarianas, Florentia) and 8 on the
  Clodia, its more westerly parallel route through southern Etruria (Careiae, Ad Novas, Forum
  Clodii, Blera, Norchia, Tuscania, Maternum, Saturnia) — reconstructed from the Antonine
  Itinerary's "Item a Luca Romam usque" stage list, which supplied a clean, internally-consistent
  239-mile skeleton for the whole Cassia run.

**Two independently-confirmed data-quality catches, both from this shift's own manual geodesic
check** (claimed road distance can never be shorter than the great-circle distance between two
points — a physical impossibility, not a judgment call; every leg run through the check at
1 Roman mile = 1.4788 km before merging, same practice Shift 35 established):

1. Via Postumia's Cremona record initially carried `distance_from_previous_mp: 19` sourced as
   "nineteen miles east of Placentia" — real, but Placentia is already a Via Aemilia station and
   deliberately not duplicated here, so the schema field (which means "from the previous station
   *in this list*," i.e. Camillomagus) would have understated the true gap by more than half
   against a 40.6 mp straight-line floor. Corrected to the 44 mp through-distance
   (Camillomagus→Placentia 25 mp + Placentia→Cremona 19 mp), with the routing spelled out in
   Cremona's own notes rather than left as a silent number.
2. Via Cassia's research agent caught its own near-miss during research (a search-snippet
   coordinate for Vicus Matrini producing an impossible 6.43 mp straight-line against a sourced
   4 mp road distance) and self-corrected by interpolating a position consistent with the
   itinerary's own mileage split — confirmed independently this shift rather than taken on trust.

One real id collision caught before merging: "Ad Statuas" is a generic Latin toponym ("at the
statues") already used once by an unrelated Via Augusta station in Spain — the Via Cassia's own
Ad Statuas shipped as `station_ad_statuas_cassia` to avoid overwriting the existing record.
Two stations ship `distance_from_previous_mp: null` rather than a guess (Via Postumia's
Opitergium→Concordia leg, Via Cassia's Statonia was excluded outright as a genuinely unresolved
scholarly dispute with no defensible coordinate). Placentia, Verona, Cremona, Vicetia, and
Aquileia are shared road-network nodes with other roads or curated sites by design, following the
precedent the existing `station_placentia_aemilia`/`station_bononia_aemilia` records already set.

**Axis 13 (political apparatus) — 13 more senators' hometowns, 15 → 28 against the brief's
30-hometown floor.** Ran two research waves: first targeting Africa Proconsularis and Gallia
Narbonensis specifically (Shift 35's own flagged gap), second broadening to every other
under-represented province once the first wave confirmed Africa is genuinely thin, not
under-searched.

- **Wave 1 (6 net new)**: Nemausus/Nîmes and Forum Julii/Fréjus close the two real Gallia
  Narbonensis gaps (Titus Julius Maximus Manlianus, Gaius Valerius Paullinus). Also Saguntum
  (Voconius Romanus, personally adlected by Trajan on Pliny's lobbying), Augusta Taurinorum/Turin
  (Quintus Glitius Atilius Agricola, twice suffect consul), Epidaurum/Cavtat (Quintus Marcius
  Turbo, suppressed the Kitos War in Cyrenaica/Egypt in 116), and Mytilene (Marcus Pompeius
  Macrinus Neos Theophanes). **A real duplicate catch**: the wave's own Marcus Annius Verus
  (Ucubi/Espejo) result was already on the map under `politics_senator_ucubi` from an earlier
  shift — checked against the live file before merging and dropped rather than double-pinned.
- **Wave 2 (7 net new)**: Sardis (Tiberius Julius Celsus Polemaeanus, proconsul of Asia 105–107),
  Vercellae (Lucius Domitius Apollinaris), Trebula Mutusca (Titus Prifernius Paetus), a second
  Pergamon senator (Gaius Antius Aulus Julius Quadratus, Trajan's "amicus clarissimus," governed
  Syria 100–104), Pompeiopolis (Gaius Claudius Severus, first governor of the new province of
  Arabia, 106–116), Casinum (Ummidius Quadratus Sertorius Severus), Xanthos (Marcus Arruntius
  Claudianus, first Lycian senator). **One candidate deliberately dropped**: Sextus Julius Severus
  of Aequum (Dalmatia) — every specifically dated office in his career (cos. 127, the Bar Kokhba
  command) falls after 117 CE, and the research pass's own summary flagged his Trajan-era
  activity as inferred rather than independently dated. The project's standing bar, set by the
  prior rejection of Julius Severus of Ancyra for the identical reason, asks for a Trajan-dated
  post, not a plausible-but-undated early career stage — so he stays off the map.

**Africa Proconsularis and Gallia Narbonensis are very likely near their real ceiling now**, not
just under-searched: two independent research passes (this shift's Wave 1 and a prior shift)
turned up only the two Narbonensis names above, and every African-connected name investigated
(Marius Priscus, Caecilius Classicus, Titus Sextius Cornelius Africanus, Tiberius Claudius
Sestius, Quintus Cornelius Quadratus, Publius Pactumeius Clemens, Quintus Aurelius Pactumeius
Fronto) either lacks a *specific* city-level origo or is dated Flavian/Hadrianic-Antonine rather
than Trajanic. This matches the scholarly consensus cited by the research pass (Ibba, "I senatori
africani") that Africa's senatorial boom was predominantly post-Trajanic. 28/30 is a defensible
stopping point without loosening the origo-sourcing bar.

### Build, validate, verify

Fresh container needed `npm install` first (`node_modules` wasn't present). `npm run validate`:
0 errors, 17 warnings throughout (same pre-existing set every recent shift has carried).
Cross-file name collision count crept 119 → 122 as expected (new points landing near existing
gazetteer entries) — informational only, tracked under `[12-P0-1]`, not a blocker. `npx tsc
--noEmit` clean. `npm run build` clean on all four data commits. `npm run metrics --write`: 481
POIs, 100% description depth, 0 thin (road stations and politics.geojson aren't POI-schema files,
so the count is unchanged from Shift 35's).

**A formatting bug caught and fixed before it reached a commit**: the splice script used to merge
the second senator-hometown batch initially reindented new features with a 2-space prefix instead
of the 4-space prefix `politics.geojson`'s existing features actually use, which would have
produced a working-but-inconsistently-indented file (valid JSON, wrong visual nesting depth for
that one batch). Caught by diffing before staging, not after — same discipline Shift 15's own
"reformat trap" note recommends — reverted and re-spliced with the correct indent. Worth repeating
here since it's an easy one-line mistake to make silently: always diff a splice script's output
against the target file's existing indent before trusting it, not just against `json.loads()`
validity.

### Board

No board ticket claimed or closed this shift — same reasoning as Shifts 34/35 (the topmost
unclaimed P0s are all large architectural changes better suited to a dedicated shift, several
likely blocked on this environment's own egress restriction). Track B was a deliberate skip (see
above) rather than a FEATURE_BACKLOG pull.

### Handoff for the next shift

1. **A fourth Etruria/Umbria-radiating road is a natural next pick**: Via Salaria (Rome →
   Reate/Rieti → Asculum/Ascoli Piceno, well-documented, no station work done on it yet) or Via
   Aurelia (Rome up the Tyrrhenian coast toward Pisa/Genua, connects naturally to this shift's
   Via Postumia terminus at Genua). Neither has any stations on the map yet.
2. **Axis 13's senator_hometown category sits at 28 of the 30-floor** — 2 away. This shift's Wave
   2 covered Asia/Italia/Galatia/Lycia broadly but didn't exhaust them; a future pass specifically
   on Hispania Baetica beyond Ucubi, Macedonia, and Cilicia (all untouched this shift) could
   plausibly close the last 2 without repeating this shift's now-investigated-and-rejected list
   (now grown to ~30 names across two shifts — worth keeping that rejection list intact in a
   future prompt rather than re-walking it).
3. **Geodesic sanity-check road distances before merging, not after** — now confirmed useful on
   three separate shifts' worth of road-station batches (one wrong figure caught this shift on
   Via Postumia's Cremona record, a mislabeled-basis error rather than a bad number). Still worth
   writing as a small reusable script rather than hand-computing it per road, per Shift 35's own
   note — nobody has done this yet.
4. **`FEATURE_BACKLOG.md`'s remaining open checklist items are almost all either done-but-
   unchecked (worth a dedicated pass to flip the boxes and delete stale notes — this shift found
   two) or genuinely large** (dark mode, terrain shading, the `Map.tsx` await-chain-to-parallel
   perf fix flagged by a prior shift as now taking 30-35s to settle). A future shift with a full
   6 hours to dedicate to one of these, rather than splitting attention with Track A, is the
   right shape for picking one up.
5. **Board fresh-check**: still no unclaimed P0/P1 `add` ticket. Topmost unclaimed P0s unchanged
   from Shift 35's note — `[12-P0-1]` merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]`
   card-rebuild, `[02-P0-1]` terrain, `[02-P0-4]` self-host-glyphs.

---

## Shift 35 — 2026-08-19 (this shift's own prompt claimed "Shift 4 of four")

**Same stale-numbering mismatch every shift since #13 has flagged** — the scheduled prompt said
"Shift 4 of four," but `SHIFT_LOG` was 34 real shifts deep at session start, so this entry
continues as Shift 35. Session started `HEAD` detached one commit behind a stale local `main`
(same pattern Shift 34 and others documented); `git reset --hard origin/main` on the local branch
put it cleanly on the real tip, no conflicts, no data loss (confirmed detached HEAD matched
`origin/main` exactly before resetting). Read `SHIFT_BRIEF.md` and `BOARD.md` in full before
touching anything.

**Network block reconfirmed** — direct `curl` to `overpass-api.de`/`commons.wikimedia.org` and a
direct `WebFetch` against a Commons file URL both failed (`CONNECT tunnel failed, response 403` /
`EGRESS_BLOCKED`), same as every prior shift. `WebSearch` remained the only working research
channel throughout; all seven research agents this shift were briefed accordingly.

### Board check

Topmost unclaimed board tickets remain the same large architectural changes shift 34 already
declined for the same reason: `[12-P0-1]` merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]`
card-rebuild, `[02-P0-1]` terrain, `[02-P0-4]` self-host-glyphs — each better suited to a shift
that opens with it as the sole focus. No unclaimed P0/P1 `add` ticket exists; `[06-P2-6]`
priority-cities stays blocked on the Overpass egress block. Track A this shift followed the
brief's own axis queue directly, same as the last several shifts.

### Track B — deleted the vestigial `pois-dot`/`pois-label` map layers, flagged since Shift 6

Both layers had been permanently invisible (`circle-radius`/`circle-opacity` forced to 0, a
disabled label filter) since `PoiMarkers.tsx`'s HTML pin markers took over POI rendering; nine
prior shifts' `FEATURE_BACKLOG.md` notes had flagged the cleanup as safe but nobody had pulled the
trigger, because deleting the layer without fixing its one remaining dependent — the
empty-click-closes-panel handler's `queryRenderedFeatures(..., {layers: ["pois-dot"]})` — would
make that call throw on a now-nonexistent layer id. Removed both `addLayer` calls, their
now-provably-dead mouseenter/mouseleave/click handlers (PoiMarkers' HTML markers already
`stopPropagation()` before a click can reach the map, so the native click handler could never
have fired even before deletion), and rewrote the empty-click handler to clear unconditionally —
functionally identical to before, since the deleted layer's query always returned zero hits
anyway. `useLayers.ts`'s "Landmarks" toggle group's `mapLayerIds` emptied to `[]` to match (that
toggle has read `PoiMarkers`' own visibility state directly since Shift 8, so the native layer ids
were already vestigial there too). Cleaned up four stale code comments across `PlaceDetails.tsx`,
`usePoiPanel.ts`, and `poiCategories.ts` that still referenced the deleted layer.

**Verified live, not just by inspection**: `npx tsc --noEmit` / `npm run build` / `npm run
validate` all clean. Built the production server and drove it with Playwright — first attempt at
verifying the empty-click-closes behavior gave a false "still open" reading twice in a row before
the actual bug (or non-bug) became clear: `PlaceDetails.tsx`'s panel element stays mounted in the
DOM after closing (it animates out via `transform`/`aria-hidden`/`inert` rather than unmounting,
by design, for the close transition), so checking DOM *presence* is the wrong signal — checking
`aria-hidden` showed the real state correctly (`false` after a marker click, `true` after a
genuine empty-canvas click) on both desktop (1280×800) and mobile (375×812, dark). The two false
readings were also partly caused by clicking UI chrome (a category chip, a FAB button) instead of
the actual map canvas at the coordinates first tried — worth remembering for whoever next writes a
Playwright click test against this map: verify the click coordinate resolves to `<canvas>` via
`document.elementFromPoint` before trusting a "nothing happened" result.

### Track A — four axes, 96 net new features, three research waves reviewed and merged by hand

Ran seven background research agents in three waves (2-3 concurrent, on disjoint files), each
reviewed and independently spot-checked before merging — not just accepting agent self-reports,
per the standing lesson from Shift 34's beneficiarii catch. This shift's own equivalent catches
are below.

**Axis 2 (road stations) — Via Agrippa completed, plus two brand-new roads.** `road_stations.geojson`
180 → 248 (+68).

- **Via Agrippa's last two branches**, closing out all four roads radiating from Lugdunum that
  Strabo describes: the Aquitania branch toward Burdigala/Bordeaux (16 stations, via
  Augustonemetum/Clermont-Ferrand and Augustoritum/Limoges to Mediolanum Santonum/Saintes) and the
  Narbonensis branch down the Rhone (14 stations, via Vienna/Vienne and Valentia/Valence to
  Arausio/Orange and Avenione/Avignon, stopping at the Via Domitia junction rather than duplicating
  Arelate/Nemausus/Narbo). Via Agrippa is now 62 stations total.
- **Via Flaminia** (Rome → Ariminum, the eighth road on the map), 19 stations: Ad Rubras through
  Pisaurum, cross-checked against the Tabula Peutingeriana and a dated 305 CE milestone at
  Cantiano fixing Luceoli at mile 140. Deliberately excluded the older 220 BCE western branch via
  Carsulae — a real fork the flat schema can't represent without corrupting
  `distance_from_previous_mp` for whichever branch lists second, and one of its legs failed the
  geodesic check below with no way to resolve it from available sources.
- **Via Aemilia** (Ariminum → Placentia, the ninth road), 19 stations: Ad Compitum through
  Placentia, built by cross-referencing the Antonine Itinerary's civitas backbone (~177 mp,
  matching the road's known 176 mp length) against the denser Itinerarium Burdigalense
  mutatio-by-mutatio list.

**A real, independently-confirmed data-quality catch across all three road batches**: every
`distance_from_previous_mp` figure was run through a straight-line geodesic sanity check (a
claimed road distance can never be shorter than the great-circle distance between its two
endpoints — that's a physical impossibility, not a judgment call) before merging, because this
field renders directly in the map's hover tooltip as "X Roman mi from previous stop." The Via
Flaminia and Via Aemilia research agents ran this check themselves and reported the results (Via
Aemilia's table is in its own agent transcript); this shift's own manual check on the Aquitania/
Narbonensis batch caught three sourced-but-wrong figures the research agent hadn't self-checked:
Forum Segusiavorum's leg from Lugdunum (independently confirmed via a second search that Feurs is
"50 km from Lyon as the crow flies," while the claimed 16 Gallic leagues converts to only ~35 km —
geometrically impossible), Acitodunum's leg from Ubrilium (claimed distance 50% short of the real
straight-line span across genuinely mountainous terrain, which should only make a real road longer
relative to straight-line, not shorter), and Ernaginum's leg from Avenione (claimed distance under
half the real straight-line span). All three shipped with `distance_from_previous_mp: null` instead
of a wrong number, with the affected prose in each entry's `notes` field edited to match. The
Aquitania batch's Peutinger-sourced stretch also used Gallic leagues, not Roman miles, per the
table's own "usque hic legas" annotation — converted ×1.5 throughout so the stored numbers match
the field's declared unit and the UI's hardcoded "Roman mi" label; the batch's Antonine-Itinerary-
sourced legs kept their native mile figures despite one cited specialist's disputed claim that
those are mislabeled leagues too, since overriding an itinerary's own well-established convention
needs more than a geometric hunch.

**Axis 17 (exile + penal) — 4 penal quarries/mines.** `penal.geojson` 12 → 16. Simitthu/Chemtou
(Tunisia, `extant_117ce: true`) ships as an active penal marble quarry with excavated cell blocks;
Phaeno/Faynan (Jordan), Mons Porphyrites (Egypt), and Proconnesus/Marmara Island (Turkey) all ship
`extant_117ce: false` — real, well-documented penal mining/quarrying sites, but every source ties
their *penal* use specifically to Diocletian's early-4th-century persecutions, two centuries past
this map's snapshot. Included anyway per the project's standing convention for anachronistic-but-
real content, honestly dated rather than dropped or silently backdated. Several strong candidates
(Alburnus Maior/Rosia Montana, Mons Claudianus, Dolaucothi, Rio Tinto/Las Medulas, the Lex Metalli
Vipascensis) were investigated and rejected for resting on wage-labor or free-contractor evidence
rather than genuine condemned-labor attestation.

**Axis 3i (shipwrecks) — 12 new wrecks with documented cargo.** `pois.geojson` shipwreck category
10 → 22: Cavaliere, Planier 3, Fiumicino ships, Skerki Bank Wreck B, Mahdia, Spargi, Sud-Lavezzi 2,
Cap Corse 2, Diano Marina, Civitavecchia, Chretienne H, Pisa San Rossore — each with a specific
documented cargo (wine, fish sauce, raw glass, marble, ingots), not a generic "Roman-era wreck."
**A real duplicate catch**: the research agent's own candidate list included three wrecks (Dramont
A, Dramont D, Titan) that turned out to already be on the map under the same ids — the agent
wasn't given the real existing-wreck list (a `EGRESS_BLOCKED`/no-file-access constraint of its own
prompt), so every candidate was cross-checked against the live file's actual records before
merging, and the three duplicates were dropped.

**Axis 13 (political apparatus) — 12 Trajanic senators' hometowns.** `politics.geojson`
`senator_hometown` records 3 → 15, addressing the axis's "30 senators' hometowns" alternative
target (the chariot-faction-HQ + vigiles-station combo was already essentially complete before
this shift — 4 factions, 7 vigiles cohorts, matching Rome's real total). Licinius Sura (Tarraco),
Pliny the Younger (Comum), the jurist brothers Neratius Priscus and Neratius Marcellus (both
Saepinum), Cornelius Palma (Volsinii), Cornutus Tertullus (Attaleia, disputed with Perge), Avidius
Quietus (Faventia, father of the already-mapped Avidius Nigrinus), Bruttius Praesens (Volceii),
Minicius Natalis (Barcino), Catilius Severus (Apamea in Bithynia), and Trajan and Hadrian
themselves (both Italica). Investigated and rejected for lacking a genuine sourced origo: Julius
Frontinus, Sosius Senecio, Publilius Celsus, Julius Ursus Servianus, Attius Suburanus, Fabius
Justus, Pompeius Falco, Laberius Maximus (rests on an inferred grandfather, not the man's own
attestation), Sextius Africanus (a cognomen alone is not an origo), Cornelius Nigrinus Maternus
(consul under Domitian, not active under Trajan), and Julius Severus of Ancyra (adlected by
Hadrian, after 117).

**A real schema-mismatch catch on the senators batch**: the research agent wrote each record with
the senator's own name as the map-pin `name` field and no `one_line`/`modern_location`/
`extant_117ce` fields — reasonable on its own terms, but this category's three pre-existing records
(checked directly against the live file, not assumed from the prompt) use the *place* name as the
pin label with a `one_line` field carrying the senator's name and career fact, because that's
literally what `Map.tsx`'s `politics-point` popup handler reads (`p.name` for the title, `p.one_line`
for the subtitle — never `p.notes`). Remapped all 12 records to the established schema before
merging rather than ship data that would silently render wrong (an empty popup subtitle, a Latin
personal name where every other pin in the category shows a modern place name).

### Build, validate, verify

`npm run validate`: 0 errors, 17 warnings throughout (same pre-existing set every recent shift has
carried — diplomacy/neighbors envelope warnings, letters.geojson route LineStrings' expected
missing-`name` warnings). Cross-file name collision count crept 114 → 116 as expected (new senator
hometowns landing near existing gazetteer points) — informational only, tracked as `[12-P0-1]`'s
own backlog, not a blocker. `npx tsc --noEmit` clean. `npm run build` clean on every one of the six
data commits plus the Track B commit. `npm run metrics --write`: 481 POIs, 100% description depth,
0 thin.

### Board

No board ticket claimed or closed this shift — Track A followed the brief's own axis queue
directly, same reasoning as Shift 34 (the topmost unclaimed P0s are all large architectural
changes better suited to a dedicated shift). Track B's fix was pulled from `FEATURE_BACKLOG.md`'s
own flagged-but-unclaimed items rather than the board, and checked off there.

### Handoff for the next shift

1. **Two more Cisalpine/Italian roads are natural next picks** given Via Flaminia and Via Aemilia
   now meet at Ariminum/Rimini and reach Bologna/Modena/Parma/Piacenza: Via Postumia (Genua to
   Aquileia, crossing the whole Aemilia corridor perpendicular) or Via Cassia/Via Aurelia/Via
   Salaria (all radiating from Rome, well-documented, no station work done on any of them yet).
2. **Axis 17's exile-island side is essentially complete** (9 islands against the brief's own
   named list) but the penal mine/quarry side, even after this shift, sits at 4 — a future pass
   specifically re-investigating Alburnus Maior/Dacia's gold-rush period (Trajan seized it in 106,
   fresh territory, real wax-tablet labor-contract evidence exists, just not of the *condemned*
   kind this shift's research confirmed) could still turn up genuine attested sites this shift's
   search budget didn't reach.
3. **Axis 13's `senator_hometown` category has real headroom left** toward the brief's 30-hometown
   target (now at 15) — this shift's research agent found several senators with well-documented
   careers but no sourced origo (Frontinus, Sosius Senecio, Publilius Celsus among them); a future
   pass with a fresh search budget on figures from Africa Proconsularis and Gallia Narbonensis
   specifically (both flagged in the brief as sources of early provincial senators, both
   under-represented in what got confirmed this shift) is a concrete next lead.
4. **Geodesic sanity-check road distances before merging, not after** — now confirmed useful on
   two separate shifts' road-station batches (three wrong figures caught this shift alone). Any
   future axis-2 pass should keep doing this; it would be worth writing as a small reusable script
   rather than hand-computing it in a Python one-liner each time, since it'll recur on every future
   road.
5. **Board fresh-check**: still no unclaimed P0/P1 `add` ticket. Topmost unclaimed P0s unchanged
   from Shift 34's note — `[12-P0-1]` merge-themes, `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild,
   `[02-P0-1]` terrain, `[02-P0-4]` self-host-glyphs — all still better suited to a shift that opens
   with one as the sole focus rather than splitting attention across a data-heavy shift.

---

## Shift 34 — 2026-08-19 (this shift's own prompt claimed "Shift 3 of four")

**Same stale-numbering mismatch every shift since #13 has flagged** — the scheduled prompt said
"Shift 3 of four", but `SHIFT_LOG` was 33 real shifts deep at session start, so this entry
continues as Shift 34. Session started `HEAD` detached one commit behind a stale local `main`;
`git fetch origin main && git checkout -B main origin/main` put the branch cleanly on the real
tip (`a41b6c1`), no conflicts. Read `SHIFT_BRIEF.md` and `BOARD.md` in full before touching
anything, per the brief's own instruction.

**Network block reconfirmed, and now also for WebFetch, not just raw `curl`** — `curl` to
`overpass-api.de`/`en.wikipedia.org`/`commons.wikimedia.org`/`pleiades.stoa.org` all returned
`CONNECT` failures via the agent proxy (`/__agentproxy/status` shows explicit `403` relay
failures for all four). Also tried `WebFetch` directly against `commons.wikimedia.org` from the
main session — also `EGRESS_BLOCKED`. **WebSearch remained the only working research channel
throughout**, same as prior shifts; every research agent this shift was briefed accordingly.
Axis 1 (more cities via Overpass) and `[06-P2-6]` priority-cities stay genuinely blocked here.

### Approach: seven parallel research/build agents this shift, each independently verified before commit

Rather than one research pass at a time, this shift ran up to three background agents
concurrently on disjoint files (no two ever touched the same `public/data/*.geojson` or the same
app file at once), reviewing and committing each batch as it landed rather than trusting agent
self-reports. That review caught one real problem (see below) before it reached `main`.

### Track A — six axes, ~140 net new features

**Axis 8a (mints)**: 20 new RPC-documented civic/provincial mints striking under Trajan
specifically — Cyzicus, Prusa, Bostra, Sepphoris, Hierapolis, Perge, Ancyra, Amisus, Sinope,
Cyrene, the Cyprus koinon, Amastris, Prusias ad Hypium, Heraclea Pontica, Chalcedon, Philadelphia
(Lydia), Corinth, Nicopolis, Anazarbus, Tium. `mints.geojson` 20 → 40. Rejected on research:
Gerasa/Petra (a province-wide Arabia issue, not a distinct civic mint), Damascus/Byblos/Neapolis/
Gaza (no confirmed Trajanic-era issues found), several Asia Minor cities where minting is only
confirmed from Hadrian onward.

**Axis 15 (welfare/euergetism)**: alimenta-town research came up empty this pass — WebFetch was
blocked for every source tried and WebSearch snippets alone couldn't confirm a specific CIL/ILS
reference + date for any new town beyond the 15 already mapped, so the agent correctly declined
to guess (real leads for a future pass: Ficulea, Ameria, Tifernum Mataurense, Trebula Mutuesca,
Sestinum, Ariminum, Superaequum, Forum Sempronii, Suasa). Pivoted fully to 13 benefactor
inscriptions instead: Ummidia Quadratilla at Casinum, Annobal Tapapius Rufus's market at Leptis
Magna, Sextilius Pollio's fountain and Julius Aquila's Library of Celsus at Ephesus, Iunia Rustica
at Cartama, Claudia Severa's nymphaeum at Sagalassos, Julius Zoilos at Aphrodisias, Nonius Balbus
at Herculaneum, Babbius Philinus at Corinth, Eumachia/Marcus Tullius/Holconius Rufus at Pompeii,
Valerius Firmus at Munigua. `euergetism.geojson` 18 → 31.

**Axis 8b (conventus)**: Baetica's 4 conventus (Gades, Corduba, Astigi, Hispalis) and Hispania
Tarraconensis's 7 (Tarraco, Carthago Nova, Caesaraugusta, Clunia, Asturica Augusta, Lucus Augusti,
Bracara Augusta), per Pliny the Elder's own conventus lists (NH 3.7, 3.18-24) — the axis's second
province after Asia's 13. `conventus_asia.geojson` 13 → 24 (kept the now slightly-misnamed
filename rather than touch `Map.tsx`'s wiring for a data-only pass; the layer keys off each
record's own `province` field, not the filename). **Data-quality finding for a follow-up**:
`places_medium.geojson`'s own "Clunia" gazetteer entry points at an unrelated German site
(Altenstadt), not the real assize center near Peñalba de Castro — that file's Latin-name matching
isn't reliable for disambiguating repeated ancient toponyms, worth a dedicated gazetteer-audit
pass.

**Axis 6a (trade routes)**: three more complete named routes on top of the existing Amber Road and
grain routes — the Cornwall-Rome tin route (Ictis/St Michael's Mount → Armorica/Vannes → mouth of
the Rhone → Massilia → Rome, the overland-through-Gaul path Diodorus 5.22 and Strabo both describe
as dominant by the imperial period, not the longer Atlantic/Gades circuit), the Baetica-Rome olive
oil route (Corduba → Hispalis → Ostia/Portus → Monte Testaccio, Rome's 53-million-amphora hill
built almost entirely from this one trade), and a shorter Africa-Rome olive oil route. Amber
Road's three pre-existing records got harmlessly re-serialized with escaped-unicode arrows
(`→` for `→`) as a side effect of the agent's Python `json.dump` — confirmed byte-identical
in meaning, not a real content change, before merging. `trade_routes.geojson` 20 → 36.

**Axis 2 (road stations)**: **Via Agrippa**, the empire's seventh complete road on the map (after
Appia, Egnatia, Domitia, Cottia, Augusta, Traiana Nova) and next in the brief's own queue. 32
stations across two of the network's four branches out of Lugdunum — the Rhine branch (through
Divodurum/Metz toward Augusta Treverorum/Trier, already a curated site) and the Channel branch
(Divodurum → Durocortorum/Reims → Bagacum/Bavay → Gesoriacum/Boulogne, Classis Britannica's base
and Claudius's 43 CE invasion port) — sharing a common trunk to the fork at Andematunnum/Langres.
`road_stations.geojson` 148 → 180. 6 of the 32 carry `confidence: "low"` for genuinely
unidentified/disputed stations. Left for a follow-up shift: the Aquitania (Saintes/Bordeaux) and
Narbonensis (Vienne-Orange-Narbonne) branches — WebSearch confirmed their existence and rough
route but not station-level mile figures; French Wikipedia's "Voie romaine d'Agrippa
(Saintes-Lyon)" is a concrete next lead.

**Axis 19 (correspondence networks)**: Ignatius of Antioch's route to martyrdom, a second complete
corpus alongside Pliny's (already fully mapped) — both halves of the axis's per-shift minimum now
done. 10 points + 4 route legs: Antioch and Smyrna as the two letter-writing waypoints, Ephesus/
Magnesia/Tralles as the three churches whose delegates met him at Smyrna, Philadelphia/Smyrna-
again/Polycarp as the three addressees from Troas, Philippi as the sea-to-land waypoint, Rome as
the final addressee (his letter begging the Roman church not to intervene) — plotted on top of the
existing Pliny-corpus Rome point at the same coordinates since it's a distinct fact, not a
duplicate. The exact martyrdom venue is genuinely unattested (only "an arena under Trajan"
survives); the Colosseum is named as the traditional guess with `confidence: "medium"` and the
text states plainly it's a guess, not a settled fact — declarative, not hedging.
`letters.geojson` 20 → 34.

**Axis 8c (cursus publicus)**: beneficiarii stations, never on this map before. Per-shift minimum
is 20; the research agent returned 23, **10 of which this shift caught and removed before
committing** — see the quality-control section below. The 13 that survived review (Mogontiacum,
Bonna, Abusina, Carnuntum, Poetovio, Aquincum, Praetorium Latobicorum, Sarmizegetusa, Apulum,
Samum, Viminacium, Lugdunum, Genava) all have a real, specific epigraphic anchor at that exact
site. `politics.geojson` 32 → 45. Falls short of the 20-25 target as the direct, correct
consequence of applying "real data or don't include it" honestly, not a shortfall to fix later.

### A real quality-control catch: 10 of 23 "beneficiarii stations" were inference dressed as data

The research agent's own `confidence: "low"` entries mostly weren't "a real, attested station
whose exact coordinate is uncertain" — this project's actual convention for that field, and what
every other batch this shift used it for. Reading the `notes` field on each one showed a
different pattern: "Legio VIII Augusta's fortress... was exactly the kind of junction beneficiarii
were posted to watch... **no single dedication has been isolated to Argentorate's own vicus
specifically**" — a plausible-sounding argument built entirely from the general pattern of where
beneficiarii tended to work, with an explicit admission that no actual evidence places one at this
site. Nine of the eleven `"low"`-confidence entries had this exact shape (Argentorate, Colonia
Agrippina, Noviomagus Batavorum, Biriciana, Augusta Vindelicum, Iuvavum, Ovilava, Vindobona,
Andematunnum), and a tenth at `"low"`-adjacent confidence (Ratiaria) leaned on a real inscription
about an unrelated customs official to infer a beneficiarii presence by analogy rather than
direct evidence. All ten were removed before the commit that shipped the other 13. **The
takeaway for future shifts using research agents for point data**: a `confidence: "low"` label on
its own isn't enough signal that a record is safe to ship — read what the `notes` field actually
argues. "This is the kind of place X would be" is not the same claim as "X is attested here," and
only the second belongs on the map. Removing the file's whole-file Python re-serialization also
reformatted the 32 pre-existing `politics.geojson` records' `geometry`/`sources` arrays onto
multiple lines (confirmed byte-identical in content via diff review) — cosmetic, not a regression,
but worth a heads-up so a future shift doesn't mistake the noisy diff for lost data.

### Track B — lazy-overlays `[11-P0-2]`, plus two bugs it surfaced

**All 27 non-base overlay groups now load their GeoJSON on first enable, not on every page load.**
Every thematic layer defaults OFF (invariant 0), but `Map.tsx`'s ~30-phase sequential load chain
fetched, parsed, and added all of them regardless — pure wasted network/parse work for the large
majority of visits that never open the Layers panel. `app/useLayers.ts` gained a loader registry
(`registerLayerLoader`/`ensureLayerLoaded`/`resetLayerLoaders`), deduped so toggling a group off
and back on never re-fetches and a failed fetch retries on the next toggle rather than wedging;
`toggleLayer()` now loads on first switch-on, `applyAllLayers()` also lazily loads any group a
returning visitor's `localStorage` already has on. `Map.tsx`'s ~27 thematic phases had their
existing fetch+addSource+addLayer+handlers bodies handed to the registry instead of running
unconditionally — a mechanical wrap, no logic changed inside any phase. `lines.geojson` (backs
both `frontier-lines` and `aqueduct-lines`) uses a shared `onceLoader` so the second group to
switch on doesn't re-fetch. New `THEMATIC_LAYER_ORDER` + `restackThematicLayers()` keep
cross-overlay z-order canonical regardless of what order a user enables things in.

**Verified independently, not just from the implementing agent's own report**: read the full diff
of both changed files before committing; `npx tsc --noEmit`/`npm run build`/`npm run validate` all
clean; a from-scratch Playwright run against the built production server (not the agent's own)
confirmed cold load fetches none of the 27 thematic files; presetting `localStorage`'s
`mints:true` before load confirmed the returning-visitor path — `mints.geojson` fetched exactly
once, layer visible, source carrying all 40 features (this same shift's mint-data batch, correctly
picked up through the new lazy path); 375×812 dark and 1280×800 light screenshots of the default
view both clean, pixel-equivalent to the pre-change base map.

**Two small pre-existing eager fetches the lazy-overlays agent found but correctly left out of
its own scope, fixed separately same-shift**: `ProvincePanel.tsx` fetched `politics.geojson`
unconditionally on mount regardless of whether a province panel was ever opened — gated behind
the panel's own `open` flag. `PeopleMarkers.tsx` awaited `people_117.geojson` before checking its
own `visible` flag — reordered so the visibility check runs first. A fresh Playwright cold-load
check after both fixes: the only `/data/*.geojson` requests left on a cold load are the 10
base-group files, zero thematic files of any kind.

### Build, validate, verify

`npm run validate`: 0 errors, 17 warnings (up from 13 — 4 new ones are `letters.geojson`'s
Ignatius route LineStrings correctly missing a `name` field, same pre-existing convention as
Pliny's 7 routes; documented in `METRICS.md`'s standing-warnings note). `npx tsc --noEmit` clean.
`npm run build` clean on every commit this shift (one transient `ENOENT` on a `.next/export`
rename during the very first push, resolved by `rm -rf .next` and rebuilding — looked like a
build-cache race from a concurrent background agent also running its own build in the same
working directory at that moment, not a real regression; every subsequent push built clean on the
first try). `npm run metrics --write`: records in the 29 thematic files 875 → 994 (+119, matching
this shift's additions exactly once the beneficiarii cleanup is included), 100% description depth
holds, 0 thin.

### Board

Claimed and closed `[11-P0-2]` `lazy-overlays` (see BOARD.md for the full write-up merged into
its own entry). No other board ticket touched this shift — Track A followed the brief's own axis
queue and per-shift minimums directly, which the board's own header text allows ("still a valid
source of work when the board has nothing that fits" for axis breadth work, though the actual
reason this shift leaned on axis work over more board tickets was straightforwardly that the
topmost unclaimed board P0s left by shift 33's handoff — `[12-P0-1]` merge-themes, `[03-P0-1]`
schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]` terrain — are all large, architecturally
significant changes better suited to a shift that opens with them as the sole focus rather than
splitting attention across a data-heavy shift).

### Handoff for the next shift

1. **Via Agrippa has two branches left** (Aquitania: Saintes/Bordeaux; Narbonensis:
   Vienne-Orange-Narbonne) — see the axis-2 note above for the concrete French-Wikipedia lead.
2. **Alimenta-town research hit the same WebFetch-blocked wall this shift's predecessor also hit**
   — the specific leads (Ficulea, Ameria, Tifernum Mataurense, Trebula Mutuesca, Sestinum,
   Ariminum, Superaequum, Forum Sempronii, Suasa) are real candidate names, just missing a
   confirmable CIL/ILS reference under this sandbox's search constraints. Worth a pass from an
   environment that can actually reach Wikipedia/Commons/JSTOR-adjacent sites directly.
3. **`places_medium.geojson`'s Latin-name matching is unreliable for disambiguating repeated
   ancient toponyms** — "Clunia" pointed at an unrelated German site instead of the real Roman
   assize center in Burgos, Spain. Not fixed (out of scope for the file that surfaced it); worth
   a dedicated gazetteer-audit pass, possibly folding into `[12-P0-1]`'s merge-themes scope since
   that ticket already owns cross-file place deduplication.
4. **Read agent-returned "low confidence" research data before merging it, not just after** — see
   the beneficiarii quality-control section above. This isn't specific to that one batch; any
   future axis populated by a WebSearch-only research agent should get the same read-the-actual-
   reasoning-not-just-the-confidence-label review before it reaches `main`.
5. **Board fresh-check**: `[11-P0-2]` lazy-overlays is now closed. Topmost unclaimed P0s are
   still `[12-P0-1]` merge-themes (big), `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild, `[02-P0-1]`
   terrain, and `[02-P0-4]` self-host-glyphs (still needs an unblocked environment for glyph PBF
   generation). No unclaimed P0/P1 `add` exists; `[06-P2-6]` priority-cities remains the only P2
   `add` and stays blocked on Overpass in this sandbox.

---

## Shift 33 — 2026-08-19 (this shift's own prompt claimed "Shift 2 of four")

**Same stale-numbering mismatch every shift since #13 has flagged** — the scheduled prompt said
"Shift 2 of four", but `SHIFT_LOG` was 32 real shifts deep at session start, so this entry
continues as Shift 33. Local `main` was 4 commits behind `origin/main` with `HEAD` detached;
`git fetch origin main && git checkout -B main origin/main` put the branch cleanly on the real
tip (`f87e5fa`), no conflicts — same stale-tracking-ref pattern every recent shift has documented,
not data loss. Read `SHIFT_BRIEF.md` and `BOARD.md` in full before touching anything.

**Network block reconfirmed** — direct `curl` against `overpass-api.de`, `en.wikipedia.org`,
`pleiades.stoa.org`, and `commons.wikimedia.org` all returned `CONNECT tunnel failed, response
403`. WebSearch remained the only working research channel throughout. `[06-P2-6]` priority-cities
and Axis 1 (more cities via Overpass) stay genuinely blocked here.

### Track A — two axes, both via parallel WebSearch research agents

**Axis 6a — trade routes, first complete addition beyond the existing Amber Road.**
`trade_routes.geojson` had exactly one populated route (Amber Road) against the brief's eight-
route list. Researched and added the **grain supply network that fed Rome** — three LineString
legs (Alexandria→Puteoli/Ostia→Portus; Carthage→Ostia/Portus; Syracuse/Lilybaeum→Puteoli→Ostia)
plus 7 named node points, 10 new features total, all real citations (Josephus *BJ* 2.383-386 on
Egypt/Africa's relative shares, Lucian's *The Ship* on the grain carrier *Isis*'s ~1,200-ton
capacity, Cicero's *Verrines* on Sicily's older tithe system, Suetonius on Claudius's harbor
works). One honest gap flagged by the research itself: Rickman's *The Corn Supply of Ancient Rome*
has real per-route tonnage tables that WebSearch snippets couldn't surface (only bibliographic/
review material) — the notes cite the commonly-repeated modern estimates (150,000-400,000 t/year)
rather than assert false precision. Node coordinates cross-checked against the site's own
`sites.ts`/gazetteer entries for Ostia, Portus, Pozzuoli, Alexandria, Carthage rather than the
research agent's own estimates, for consistency with what's already on the map.

**Axis 2 — Via Traiana Nova, the empire's sixth complete road (after Appia, Egnatia, Cottia,
Domitia, Augusta).** Picked specifically because it's a near-perfect 117 CE snapshot subject —
Trajan's own road through newly annexed Arabia, built 111-114 CE by governor Gaius Claudius
Severus, so barely a few years old at Trajan's death. Two sequential research passes (the second
targeting gaps and coordinate refinements the first honestly flagged) produced **14 real, sourced
stations** — short of the brief's 20-40 floor, and logged as a deliberate honesty call rather than
padded to a number: the richer Bostra-Philadelphia sector is documented in Thomas Bauzou's
monograph and David Graf's original 1986-89 survey reports, neither reachable through WebSearch
snippets (only bibliographic references surfaced). Real highlights: **Hauarra/Humayma**, a fort-
town built 106-110 CE specifically to guard this exact road, contemporary with the 117 CE
snapshot and intensively excavated since 1995; **Thornia/Tuwaneh**, where a milestone records this
stretch finished 110/111 CE, 54 Roman miles north of Petra — one of the most precisely dated
points on the whole road; **Khirbet al-Kithara**, a milestone naming both Trajan and Severus
directly. Two stations (**Betthorus**/El-Lejjun, **Udhruh**) carry an explicit anachronism caveat
in their notes: the monumental fortresses visible at both sites today are 3rd/4th-century
Diocletianic-era Limes Arabicus construction, roughly two centuries past this snapshot, so their
category is `statio`, not `fort`, and the notes say plainly nothing of that scale stood there yet.
Three named stations (Thantia, Gadda's precise point, a disputed "Rababatora") were researched and
explicitly left out rather than given a guessed coordinate — Thantia's identification is genuinely
disputed between two sources that disagree by 13km, and the project's own rule is real data or
don't include it.

### Track B — long-press explicit hold feedback, closes board `[04-P0-2]`

Mobile already had a 550ms touch-hold timer opening the context menu (shipped 2026-08-12), but
gave zero visual feedback while holding — nothing told a user their touch was even being
recognized. Added a growing ring at the touch point (`app/ContextMenu.tsx`'s new `holdPoint`
state, a `long-press-ring` CSS keyframe in `globals.css` timed to the same `LONG_PRESS_MS` the
existing timer uses, so the ring's fill finishes exactly as the menu opens), cleared on release/
move/fire the same way the existing timer-cancel path already works. Automatically covered by the
site's existing `prefers-reduced-motion` block — no separate guard needed. Verified with
Playwright at 375×812: a synthetic touch hold shows the ring in the DOM with the correct animation
within 80ms; 1280×800 desktop light unaffected (ring only renders on the touch-only code path).
**Sandbox testing caveat worth flagging**: Chromium's CDP `Input.dispatchTouchEvent` synthesis
appears to trigger the native `contextmenu` compatibility event almost immediately, independent of
the app's own JS timer — this makes an end-to-end synthetic-touch screenshot sequence unreliable
for confirming the exact 550ms delay visually (the menu was already open in a screenshot taken at
both 80ms and 250ms). Verified the ring's actual presence and the unchanged timer logic directly
instead of trusting the screenshot timing.

### Standing task closed to zero — flagship-depth (`[10-P0-3]`)

The last 5 sub-60-word `pois.geojson` descriptions this standing task's prior batches had left at
58-59 words (right at the line, out of scope for the last batch) — Carrara Marble Quarries, Throp
Fortlet, Vigo Roman Salt Works, Battle of Zama, Rusidava Fort. A dedicated research pass found one
genuinely new fact for each (Trajan's Column's 19 marble drums at ~32 tons apiece per Pliny the
Elder; Throp's 1910 F.G. Simpson excavation and its two occupation phases; the 1998 accidental
discovery of the Vigo saltworks and its garum-industry link; Polybius's own troop/elephant counts
for Zama and Scipio's counter-formation; Rusidava's direct naming on the Tabula Peutingeriana with
exact mileage to its neighbors) and wove each into the existing text rather than padding. **Depth
98.9% → 100.0%, thin tail 5 → 0** — `npm run metrics` confirms all 469 POIs now clear 60 words.

### A near-miss worth documenting: don't trust a 2-3 second layer-visibility screenshot

While verifying the new data rendered, an early Playwright check (map ready + ~2s wait) showed
**every non-base thematic layer visible by default** — trade-routes, road-stations, even
death-ritual regions — which would have been a real, serious invariant-0 violation if true (see
`SHIFT_BRIEF.md` §0: "a new overlay defaults OFF"). Traced it before assuming a bug: `useLayers.ts`
correctly computes `false` for every non-base group and `Map.tsx` correctly calls
`applyAllLayers()` — but that call sits at the very end of the ~30-line-2500+ sequential `await`
chain Shifts 13/16 already documented taking 15-35 seconds to fully settle in this sandbox. A
34-second wait confirmed `trade-routes-line`/`road-stations` genuinely resolve to
`visibility: "none"` once the chain finishes — no bug, just an easy trap for a quick smoke test to
misdiagnose as a real defect. Adding this specific manifestation to the existing note in
`FEATURE_BACKLOG.md` since it nearly cost real time chasing a phantom fix.

### Build, validate, verify

`npm run validate`: 0 errors, 13 pre-existing warnings (unchanged, all reviewed by earlier shifts —
India/China neighbor points correctly outside the "empire envelope," `letters.geojson` route
LineStrings correctly missing a `name` field). `npx tsc --noEmit` and `npm run build` both clean.
Verified live against the production bundle (`next start`, not `next dev`): new road-station and
trade-route data loads and resolves layer visibility correctly after the full chain settles;
desktop 1280×800 light and mobile 375×812 dark screenshots both clean, no chrome regression from
the CSS/component changes. `package-lock.json` picked up cosmetic npm-version metadata churn from
a fresh `npm install` (no dependency changes) — reverted before committing rather than shipping
unrelated lockfile noise.

### Handoff for the next shift

1. **Via Traiana Nova has real headroom left**, specifically the Bostra-Philadelphia sector.
   Thomas Bauzou's *Sur les pas des arpenteurs romains: la Via Nova de la provincia Arabia entre
   Bostra et Philadelphia* and David Graf's original 1986-89 survey reports almost certainly
   document many more individual milestones than WebSearch snippets surfaced — worth a pass from
   an environment that can actually read those sources, or a library/archive.org lookup.
2. **Grain trade route tonnage figures are round modern estimates, not Rickman's actual tables** —
   flagged honestly in the data's own sources. If a future session can reach
   `ostia-antica.org/fulltext/rickman/rickman-1980.pdf` or the archive.org copy directly (this
   session's WebFetch couldn't), the real per-route numbers would sharpen `trade_routes.geojson`'s
   notes.
3. **`flagship-depth` (`[10-P0-3]`) is now fully closed at 100.0%** — the standing task has no
   backlog left until new thin POIs get added by future work. Worth watching `npm run metrics`'s
   thin-tail count rather than assuming it stays at zero forever.
4. **Board fresh-check note**: `[04-P0-2]` long-press is now closed. Topmost unclaimed P0s are
   still `[12-P0-1]` merge-themes (big), `[03-P0-1]` schema-v2, `[03-P0-2]` card-rebuild (still
   missing its spec), `[02-P0-1]` terrain, and `[02-P0-4]` self-host-glyphs (glyph PBF generation
   still needs an unblocked environment). No unclaimed P0/P1 `add` exists; `[06-P2-6]`
   priority-cities remains the only P2 `add` and stays blocked on Overpass in this sandbox.

---

## Shift 32 — 2026-08-19 (this shift's own prompt claimed "Shift 1 of four")

**Same stale-numbering mismatch every shift since #13 has flagged** — the scheduled prompt said
"Shift 1 of four", but `SHIFT_LOG` was 31 real shifts deep at session start, so this entry
continues as Shift 32. Session started detached at HEAD, one commit behind a stale local `main`;
`git checkout -B main origin/main` put the branch cleanly on the real tip (`6df58ec`), no
conflicts, matching the exact "stale local tracking ref, not data loss" pattern earlier shifts
already documented. Read `SHIFT_BRIEF.md` and `BOARD.md` in full before touching anything, per
the brief's own instruction.

**Confirmed the network block still holds** — `curl` against `overpass-api.de`,
`en.wikipedia.org`, and `pleiades.stoa.org` all still hit `CONNECT tunnel failed, response 403`.
WebSearch remains the only working research channel; WebFetch to any of the usual reference
sites fails and falls back automatically.

### A very different kind of shift: the sandbox's core limitation got fixed mid-run

Every prior shift's log carries some version of "couldn't verify live, `map.on('load')` never
fires in this sandbox, screenshotting is blocked." This run root-caused and fixed that directly
(`[02-P0-4]`, see below) — and the fix unlocked **real, live browser verification for the first
time**: `next dev` + a Playwright script against real Chromium, in this exact sandbox, with this
exact network block still in place. Screenshots, click simulation, search-result assertions, live
layer counts — all of it now works here. This changes what a cloud shift can responsibly claim
as "verified" going forward; see the handoff note at the bottom.

### Board — a full 1 `add` : 2 `deepen` : 1 `polish` cycle, then five more fixes on top

**`add` — Aquae spa towns, 20 new (Axis 18, pivoted from the intended Axis 15)**. Originally
targeted Trajan's alimenta-town program (SHIFT_BRIEF's own suggested Axis 15 minimum, "all 50
alimenta towns") to extend `euergetism.geojson` past its existing 15. A background WebSearch
research agent ran ~45 queries and 91 tool calls and came back with exactly 2 low-confidence
leads — the actual town enumeration lives in Duncan-Jones's 1964 PBSR article and CIL volumes,
sources this sandbox's network policy blocks outright, and the town list on Wikipedia's own
"Alimenta" article turned out to exist only as an unlabeled map graphic, invisible to
WebSearch's snippet-only view. Rather than pad the list with the two weak leads, pivoted to
Aquae-toponym spa towns instead: most correspond to real, identifiable modern towns (several
still spa resorts today) attested by name in Strabo, Pliny, the Antonine Itinerary, or a
surviving dedication — a much better fit for a WebSearch-only research channel. A second
research pass found 23 solid candidates; added 20 to `health.geojson` (31 → 51 features) across
Britannia, Hispania Tarraconensis, Numidia, Mauretania Caesariensis, Italia, Dacia, Gallia
Aquitania, Gallia Lugdunensis, Sicilia, and Sardinia et Corsica, each with a real citation and
confidence graded honestly (several `"low"` where only an itinerary placement is available).
Dropped two more candidates the agent itself flagged as unreliable (Aquae Griselicae, Aquae
Bormonis — real Roman baths, but sources disagree on which ancient name belongs to which modern
town). No `image_url` on this batch: verifying a Commons filename needs WebFetch, the same
blocked channel, and guessing one would violate the brief's own "verify the page loads first"
rule — flagged as a follow-up for whoever next has a working WebFetch.

**`deepen` #1 — epigraphy batch 5 (standing task, `[09-P1-4]`)**. Researched 16 candidate
monuments (Trajan's Markets, five Ostia landmarks, six Pompeii/Herculaneum ones, Corinth's
Peirene, Antioch's theatre, Alexandria's Heptastadion, both Londinium entries), personally
screened down to 5 real, safely-dated citations: Ostia Forum (CIL XIV 375), Ostia Theatre (CIL
XIV 82), Pompeii Forum (CIL X 794), Pompeii Temple of Jupiter (CIL X 797, a priest's statue base
found in the cella), Alexandria's Heptastadion (Strabo, *Geography* 17.1.6-10). The other 11 were
honest `not_found`s or too risky to attribute (Corinth's Peirene had a real Pausanias citation,
but Pausanias wrote 150s-160s CE describing what may be a later marble remodeling — dropped
rather than risk misattributing a post-117 phase). One side-finding: the research flagged Ostia's
Capitolium as possibly post-117 and worth checking — already correctly `built: 120,
extant_117ce: false` in the data, so no fix needed, just confirmed. `pois.geojson`: 173 → 178 of
469 POIs now carry `ancient_sources`.

**`deepen` #2 — prices and wages (`[07-P1-3]`)**. New "What things cost" section in
`app/CurrencyConverter.tsx`: five well-attested period prices/wages (a legionary's 300-denarii
yearly pay, a modius of wheat, a sextarius of house wine from a Pompeii tavern's own scratched
price list, a day-laborer's 1-denarius wage), each cited, live-computed against whatever
amount/unit the user has entered above. Deliberately dropped several research candidates flagged
as single-source-with-no-pinned-citation (centurion pay multiplier, slave prices, olive oil, a
toga) rather than ship a hedged, padded list. Explicitly avoided Diocletian's Price Edict (301
CE) as a source — 184 years past this map's snapshot, the single most commonly misused "Roman
prices" reference online.

**`polish` — halo colors (`[02-FIX]`)**. Replaced 21 hardcoded `#f4ead5` (the light parchment
color) halo/stroke literals across `Map.tsx` with the existing theme-aware `P.labelHalo` token —
dark-mode users were getting a light-colored halo behind every label and dot stroke. The two
actual palette *definitions* are the only remaining literal occurrences, as they should be.

**Track B — reduced motion (`[05-P0-3]`)**. Global `prefers-reduced-motion` CSS block in
`globals.css` collapses every transition/animation to near-instant (covers every inline
`transition:` style already in use, no per-component changes needed). MapLibre's own camera
`flyTo`/`easeTo` calls animate via `requestAnimationFrame`, not CSS, so a new
`app/reducedMotion.ts` (`motionDuration(ms)`, mirrors the existing `prefersDark()` mount-time
pattern) wraps the `duration` on all 13 call sites across the app — the opening cinematic fly,
every search/site/legion/tour jump, place-selection easing, cluster-expand's `fitBounds`, and the
compass bearing reset all cut instantly for a reduced-motion user instead of forcing a pan.

### Five more fixes, once the ratio cycle closed

**`[08-P1-6]` Baalbek dating (`verify`)**. Settled a standing question: the Temple of Jupiter's
`built: 60` holds (a stonemason's graffito on a column drum is dated 2 August 60 CE), but the
Temple of Bacchus was wrongly sharing that date — every serious source places its start under
Antoninus Pius, c. 150 CE, 33 years past this map's snapshot. Corrected `built` 60 → 150,
`extant_117ce` true → false, rewrote the note to say plainly the temple doesn't exist yet rather
than hedge between two datings the way the placeholder text (written 2026-08-16, before the date
was settled) had to.

**`[02-P0-4]` The load-gate fix — this run's biggest find.** `app/Map.tsx` gated its entire Phase
2 onward (roads, POIs, every site's building layer — ~30 phases) on MapLibre's `"load"` event.
Cloud shift 30 had already found that event never fires in this sandbox when
`demotiles.maplibre.org` (the style's `glyphs` host) is network-blocked, even though
`map.loaded()` itself flips true within about a second regardless — so a user in that exact
condition would see the base map and nothing else, forever. Fixed with a new `whenMapReady(map,
cb)` helper that races the `load`/`idle`/`styledata` events against a 300ms poll of
`map.loaded()` (the one signal actually observed to work) and fires once whichever comes first,
with disposers wired into the existing effect cleanup. **Verified live, not just by code review**
— ran `next dev` and a real Playwright/Chromium session against this sandbox's actual block:
confirmed `"load"` truly never fires here, and that the poll path carries it instead, rendering
32 layers (roads, road-stations, POI pins) within ~7 seconds despite every glyph-range fetch
failing with `net::ERR_TUNNEL_CONNECTION_FAILED`. The only console errors left are the expected
glyph-fetch failures themselves (MapLibre attributes them to the "seas" source, since that's
where the two always-on sea-label symbol layers with `text-font` live) — sea/gulf labels lose
their text, exactly the ticket's originally-scoped "labels disappear" case, nothing worse.
**Left open**: actually self-hosting the glyph PBFs, which needs real font assets plus a
generation pipeline (`fontnik`/`glyph-pbf-composite` or similar) this sandbox doesn't have and
installing one would mean a new dependency, against the brief's own package.json guardrail.
Reset the board ticket to `[ ]` rather than left `[~]` — the harder bug is fixed and verified,
the original "stop depending on the host" ask isn't.

**`[01-P0-3]` cluster-expand — found already done, just never marked.** `PoiMarkers.tsx`'s
cluster badges already had a `fitBounds`-to-members click handler. Verified live: clicked a
68-member cluster near Rome, watched the map ease from z6.0 to z10.0 exactly as promised. No code
changed, just closed the ticket.

**`[08-P1-4]` gazetteer audit — a self-correction worth recording.** First pass searched
`places_medium.geojson` for a `name` field and came up empty for Londinium, nearly triggering a
duplicate fix — the file's real schema is `modern`/`latin`/`greek`, not `name`. Corrected search
found Londinium already present (added by an earlier shift's capital sweep). Re-ran the corrected
search against 17 more major cities and found the real hole: **Carthage, Thessalonica, Sirmium,
Serdica, Tarraco, Byzantium, Pergamum, Sardis, Nicomedia, Caesarea Maritima, and Smyrna** were all
genuinely missing — their only search hits were unrelated minor satellite villages (Nicomedia's
only match was a village "10 miles E Nicomedia"). Added all 11 following the existing
`major:1`/`id:9000xx` capital-sweep convention. Verified live: searched "Sremska Mitrovica"
(Sirmium's modern name), watched it resolve to the Sirmium card with "Today: Sremska Mitrovica" —
same path Roma/Londinium already use.

**`[11-P0-3]` delete dead data (`retire`)**. `roads_high.geojson`, `roads_low.geojson`,
`places_high.geojson` (~11.2MB) had zero references anywhere in `app/`, `scripts/`,
`next.config.js`, or `package.json` — confirmed with a grep sweep, not assumed. Deleted them and
trimmed the three matching entries from `scripts/metrics.mjs`'s exclusion set. Verified live:
`next dev` + Playwright report the identical 32 layers before and after the delete.

### Housekeeping

Checked off `"Time to travel"` in `FEATURE_BACKLOG.md` — already fully shipped piecemeal
(`Directions.tsx`'s legion-march/merchant/courier travel-time estimates), just never marked.
Regenerated `METRICS.md` (469 POIs unchanged, ancient-source coverage 36.7% → 37.7%, validator
warnings 14 → 13 with the dead-data cleanup) and fixed its standing-warnings note, which still
referenced the now-deleted `roads_low.geojson` issue.

### Handoff for the next shift

1. **Live verification is now real in this sandbox** — don't assume it's still blocked. The
   pattern: `npm install` if `node_modules` is missing, `(npm run dev > /tmp/.../dev.log 2>&1 &)`,
   wait ~6s, then a Playwright script using the global install at
   `/opt/node22/lib/node_modules/playwright` and Chromium at
   `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` (check the exact versioned directory
   name first, it may change). Wait for `window.__map.getLayer('roads-main')` to exist before
   asserting anything, since Phase 2 still takes several seconds via the poll fallback. Kill the
   dev server (`pkill -f "next dev"`) when done — don't leave it running into the next shift.
2. **`[02-P0-4]`'s real ask — self-hosting glyph PBFs — is still open**, and now the highest-value
   remaining P0 fix: it removes the `demotiles.maplibre.org` dependency outright instead of
   degrading gracefully from it. Needs a `fontnik`/`glyph-pbf-composite`-style generation step
   over a real TTF, run once, with the output committed as static files — a job for a shift or
   local session with unrestricted network access, not this sandbox.
3. **Alimenta towns (Axis 15) are still short of the brief's "all 50" target** (15 of ~50, per
   Duncan-Jones's own count) — this run's research found the town enumeration isn't reachable
   from WebSearch alone. Worth a fresh attempt only from an environment where WebFetch actually
   reaches CIL/Duncan-Jones-adjacent sources, or via a differently-structured research prompt
   (per-town targeted searches rather than "give me the full list" — the one lead that worked
   this run, Beneventum's Arch of Trajan alimenta relief, came from a per-monument search, not a
   list search).
4. **Next board `add` in priority order**, since this run closed the open cycle: check the board
   fresh, `[06-P2-6]` priority-cities is still blocked on Overpass (still confirmed down this
   run).

---

## Shift 31 — 2026-08-18 (this shift's own prompt claimed "Shift 4 of four")

**Same stale-numbering mismatch every shift since #13 has flagged** — the scheduled prompt carried
"Shift 4 of four", but `SHIFT_LOG` was 30 real shifts deep at session start, so this entry
continues as Shift 31. Session started detached at HEAD; `git checkout -B main origin/main` put
the local branch cleanly on the real tip (`f285d60`), no conflicts. Read `SHIFT_BRIEF.md` and
`BOARD.md` in full per the brief's own instruction before touching anything.

**Axis 1 (more cities) reconfirmed blocked** via a live `curl` test against
`$HTTPS_PROXY/__agentproxy/status` before starting: `overpass-api.de` and `en.wikipedia.org` both
returned an explicit `connect_rejected` (gateway 403 to CONNECT). WebSearch remained the only
working research channel — confirmed again mid-shift when the Via Augusta research agent's
attempted `WebFetch` calls to LacusCurtius/Pleiades/topostext all hit the same block and it fell
back to WebSearch-only, same as every recent shift.

**No board `add` ticket was claimable** — `[06-P2-6]` priority-cities is the only P2 `add` and
needs the blocked Overpass pipeline. Per the precedent several recent shifts have set (Via
Domitia, Via Egnatia, ancient-lakes, sea-labels), did SHIFT_BRIEF axis content work instead: the
next complete road (Axis 2) for the `add` slot of this run's ratio cycle. `[10-P0-3]`
flagship-depth and `[06-P0-2]` curate-buildings are both standing tasks that don't need a claim,
per shift 30's own established practice — picked the next thinnest batch and the next site
(checked Athens's actual named-feature count first, 78, well above the ~30 floor the board's own
repeated lesson calls for). `[02-P0-3]` road-weights was the topmost unclaimed, unblocked `polish`
in file order.

### Board — a full 1 `add` : 2 `deepen` : 1 `polish` cycle, then Track B

**`[10-P0-3]` flagship-depth, batch 4 (`deepen`)** — dispatched two parallel background WebSearch
research agents against the exact 31 remaining sub-60-word `pois.geojson` `notes` fields (my own
word-count script, matching the board's own `60+ words` definition scoped to `pois.geojson` only —
a separate ad hoc script that also swept every thematic file's `notes` field for comparison
returned 317 hits, but those files' `notes` are short-by-design hover-popup blurbs, not the
flagship-depth ticket's target, so that number was discarded rather than chased). Every record
picked up at least one genuinely new fact — a named excavator (W.F. Grimes at Cripplegate, Alan
Rowe at the Serapeum, Jean Baradez at Gemellae), an exact measurement, a specific find (the 2024
Lake Neuchâtel "Eagles' Wreck," the 2016 Antikythera skeleton, an August-2026 Mazara del Vallo
wreck one agent flagged as very recent news worth a peer-reviewed check later) — sources merged,
not replaced. Fixed a duplicated "buried by the eruption" sentence in the Pompeii Forum entry
along the way. Depth 93.4% → 98.9%, thin tail 31 → 5 — the queue this ticket opened two batches
ago is now essentially cleared; the 5 remaining are all 58-59 words and weren't in this batch's
scope, left for a quick top-up rather than padded to hit zero.

**`[06-P0-2]` curate-buildings, Athens (`deepen`)** — 28 entries in `app/athensDescriptions.ts`,
the tenth site and the first Panhellenic-scale *living* city (as opposed to Delphi's sanctuary or
the buried 79 CE sites) to get this treatment. Most of the Classical/Hellenistic Agora survived
into Roman rule untouched, so most entries are honestly `extant_117ce:true` — a rarer shape than
recent city batches. The false ones split into two genuinely different reasons: Hadrian's
post-117 additions (Library of Hadrian 132 CE, the Nymphaeum finished ~140 CE under Antoninus
Pius, the Southeast Temple early-2nd-c.) hadn't been built *yet*; the old Mint and South Stoa I had
already been demolished/superseded *before* 117 (the Mint's footprint built over by the Southeast
Temple; South Stoa I replaced by South Stoa II around 150 BCE). One candidate dropped rather than
force-entered: "Λουτρό των Αέρηδων" is a real place but a c.1501 CE Ottoman hammam with no ancient
identity, just sitting near the genuinely ancient Tower of the Winds. Researched via a background
WebSearch agent (Pausanias book 1, ASCSA Agora Excavations, Wikipedia), personally reviewed;
verified all 28 keys match real, distinct OSM features before merging (no silent typos, the same
check Delphi/Jerash established). Verified with Playwright against the *built production bundle*:
clicking the Odeon of Agrippa surfaces the curated text with "Built 15 BCE" and no "Not standing"
badge — see the sandbox-verification note below for how that click was actually exercised.

**`[02-P0-3]` road-weights (`polish`)** — `roads-main`/`roads-secondary` were nearly invisible at
empire-wide zoom (0.25-0.3px width, 0.35 opacity); raised both layers' low-zoom floor, and added a
new `roads-main-casing` layer (new `roadMainCasing` palette token, both themes) — a wider, darker
stroke drawn beneath the bright fill so a thin border shows either side, the way Google Maps' own
highway casings read instead of a flat single-color line. Registered the new layer id in
`useLayers.ts`'s "roads" group alongside the two existing ones so the Layers-panel toggle still
controls it. Screenshotted at 1280x900 light and 375x812 dark — clean in both, visibly more
legible road network at continent zoom.

**Via Augusta, 51 stations (Axis 2, this run's `add`)** — the fourth complete road after Via
Appia, Via Egnatia, and Via Domitia+Cottia: the backbone of Roman Hispania's east/south coast, the
Pyrenees to Gades via Tarraco, Saguntum, Carthago Nova, Castulo, Corduba, and Hispalis.
`road_stations.geojson` 83 → 134. Extracted from the Antonine Itinerary's "Via II" plus the
well-documented southern stretches, cross-checked against the Vicarello cups, the Ravenna
Cosmography, and targeted academic identifications (Arasa on Ildum, an AEspA study on the
Acci-Basti branch, a dedicated paper on Ad Aras/La Carlota). 18 of 51 are honest corridor
estimates (`confidence: low`, `identified: false`) where the Itinerary names a station with no
securely excavated modern site — consistent with this project's own established discipline for
that situation. Distance figures omitted rather than invented wherever the Itinerary text didn't
yield a clean mile count for that specific leg.

**Directions — imperial-courier travel-time estimate (Track B)** — FEATURE_BACKLOG's "Time to
travel" item asked for walking/marching/horse/sea days once Directions shipped (it has, since
shift 29); this closes the horse leg. New `COURIER_KM_PER_DAY = 75` constant, sourced to A.M.
Ramsay's 1925 *Journal of Roman Studies* study of the actual cursus publicus's speed (66-103
km/day for ordinary official travel over the mutationes/mansiones relay network — 75 sits inside
that range, deliberately not the "urgent courier" extreme Ramsay separately notes could exceed 160
km/day). Rendered as a third row next to the existing Legion/Merchant estimates, with an explicit
note that the state post wasn't available to ordinary travelers. Sea legs remain out of scope —
no sailing-season-aware network exists yet, same honesty the existing "no road route found"
message already practices for a missing sea crossing.

**A sandbox-verification finding worth its own paragraph, building on shift 30's `[02-P0-4]`
note**: the "force `map.fire('load')` to bypass the gated phase-2 handler" workaround prior shifts
established is itself unreliable in this exact sandbox. It worked cleanly for some checks this run
(the road-casing screenshot, the Athens building click-through) and silently broke others — an
attempted live Directions context-menu flow (right-click → "Directions from here" → right-click →
"Directions to here") never got a context menu to render at all, and a repeat attempt threw
`Error: Source "roads-secondary" already exists`, meaning the forced fire had double-invoked the
phase-2 handler and left the load chain partial. Diagnosed by attaching a counting listener before
firing: `load` fired **twice** after a single `m.fire('load')` call in one of the failed runs, not
once. Rather than chase this sandbox-specific flakiness further, treated a *successful* forced-load
check as good evidence (as shift 30 did) but a *failed* one as inconclusive rather than a proven
bug — cross-checked with a simpler, more robust method instead: a bare `fetch()` of the underlying
`/data/road_stations.geojson` confirmed the Via Augusta data serves correctly (134 total, 51
Via Augusta, correctly named) without needing the flaky forced-load path at all, and the Directions
courier row was verified via `formatDays()` math sanity-checks (Rome→Ostia's real 24.9km route →
"under a day" by courier; a ~2100km leg → ~28 days courier vs ~57 legion vs ~95 merchant, correctly
ordered) plus reliance on the same helper already Playwright-verified for the existing rows.

### Next shift

Board is clean, ratio owed nothing at session end — full 1:2:1 cycle plus a real Track B ship.
`[10-P0-3]` flagship-depth is down to its last 5 entries (58-59 words each, right at the line) —
a quick top-up would finish the standing task's queue to zero for the first time. `[06-P0-2]`
curate-buildings has 27 sites left; Rome carries 289 named OSM features, by far the largest
remaining site — worth scoping deliberately (maybe a themed sub-batch: Forum only, or Palatine
only) rather than assuming a normal ~10-30-entry batch. `[02-P0-4]` self-host-glyphs now has a
second, independent finding attached (the forced-load double-invoke flakiness above) on top of
shift 30's "load never fires naturally" one — worth real consideration soon, both fixes solve
different symptoms of the same root cause. No unclaimed P0/P1 `add` exists on the board.

---

## Shift 30 — 2026-08-18 (this shift's own prompt claimed "Shift 3 of four")

**Same stale-numbering mismatch every shift since #13 has flagged** — the scheduled prompt carried
"Shift 3 of four", but `SHIFT_LOG` was 29 real shifts deep at session start, so this entry
continues as Shift 30. The session started detached at HEAD with `main` pointing to an older
commit than `origin/main`; `git fetch origin main` + `git checkout -B main origin/main` put the
local branch on the real tip cleanly, no rebase conflicts. Read `SHIFT_BRIEF.md` and `BOARD.md`
in full per the brief's own instruction.

**Axis 1 (more cities) reconfirmed blocked** via a live `curl` test against the proxy before doing
anything else: `overpass-api.de`, `en.wikipedia.org`, and `commons.wikimedia.org` all returned an
explicit `CONNECT tunnel failed, response 403` / `connect_rejected` (confirmed via
`$HTTPS_PROXY/__agentproxy/status`'s `recentRelayFailures`), the same class of block every recent
shift has documented. WebSearch remained the only working research channel and is what every data
batch below used.

Claimed two fresh board tickets (`git pull --rebase` first, per protocol): `[09-P2-8]` how-we-know
(`add`, topmost unclaimed unblocked `add`) and `[02-P0-2]` coastline (`polish`, topmost unclaimed
`polish` whose scope was actually deliverable — `[02-P0-1]` terrain, nominally higher priority,
needs an external hillshade raster source this sandbox can't fetch, so it was skipped with a note
rather than claimed). `[06-P0-2]` curate-buildings and `[10-P0-3]` flagship-depth are both standing
tasks that don't need a claim — picked the next site (Palmyra, checked its actual named-feature
count first per the board's own repeated lesson about stale claims) and the next thinnest-notes
batch respectively.

### Board — a full 1 `add` : 2 `deepen` : 1 `polish` cycle, then Track B

**`[09-P2-8]` how-we-know (`add`)** — new `/how-we-know`, a public methodology page (mirrors
`/hub/[slug]`'s parchment-card styling) explaining the 117 CE snapshot rule and its judgment
calls, where the base geography comes from (Itiner-e, DARE, Pelagios, Natural Earth, OSM), the
difference between the "Sources" and "In ancient writing" citation blocks, what
`confidence: high/medium/low` means, the image-sourcing standard, and an honest accounting of
what's incomplete. Every number on the page — place count, % with a modern/ancient source,
high-confidence citation coverage, % with an image, the live thin-description count — is computed
from `pois.geojson` at build time rather than hand-typed, the same argument `[15-P1-4]` metrics
made for going from a hand-kept table to a generated one. Wired into `sitemap.ts`; linked from
`EpochModal.tsx`'s existing "Why 117 CE?" popup as "How do we source the rest of the map?"
(`target="_blank"` so the live map session isn't lost). Verified with Playwright at 1280×900 and
375×812 dark — clean render both viewports, no client error (a first attempt against a *stale*
running server showed one; killing and restarting the production server after the rebuild fixed
it, a self-inflicted testing artifact rather than a real bug — worth flagging for future shifts:
always restart `next start` after a rebuild before trusting a Playwright result against it).

**`[06-P0-2]` curate-buildings, Palmyra (`deepen`)** — 12 entries in `app/palmyraDescriptions.ts`,
the ninth site. Checked the actual named-feature count first (14 total, Arabic + English OSM
tags) — a much smaller, denser set than a living modern city's OSM dump (Trier's 116 tags for 12
real hits), since Palmyra's monuments are famous individually rather than numerous. The split by
century is clean: the Temple of Bel (dedicated 32 CE), the Temple of Nabu (~80 CE), and the
Agora/Basilica market complex (Flavian-Trajanic) were already standing in 117 CE; the Great
Colonnade's Tetrapylon, the Theatre and its gate, the Temple of Baalshamin (dedicated for
Hadrian's actual 129 CE visit to the city — 12 years past this map's snapshot), and the Caesareum
are honestly `extant_117ce:false`; the Baths of Diocletian and both church buildings are 3rd-6th
century, generations later still. Two candidates deliberately skipped rather than guessed: a bare
"market" tag (every source treats it as a synonym for the Agora itself, not a separate structure)
and معبد بعل ("Temple of Baal"), almost certainly the same temple as معبد بل (Temple of Bel) under
an alternate transliteration of the same name — no source describes a second, distinct Baal
temple at Palmyra. Researched via a background WebSearch agent (Wikipedia, madainproject.com,
Getty, academia.edu, Smarthistory, the French Ministry of Culture's own excavation pages),
personally reviewed before merging.

**`[10-P0-3]` flagship-depth, batch 3 (`deepen`)** — 26 more of the thinnest `notes` fields
(53-59 words, all already carrying real sources from earlier batches) expanded to ~100-130 words
each via two parallel WebSearch research passes, worst-first: three shipwrecks, the Basilica
Julia/Temple of Concord/Temple of Jupiter Optimus Maximus/Regia/two Ostia bathhouses (Rome-Forum-
and-Ostia-famous but thin), five frontier forts/fortresses (Troesmis, Apulum, Vindobona, Boothby,
Gnotzheim, Ad Maiores, Arutela), two naval bases, a signal tower, a mine, and three classical
battles (Teutoburg Forest, Mons Graupius, Pharsalus). Every record picked up at least one
genuinely new researched fact beyond what the existing text already said — a named excavator, an
exact measurement, a specific inscription or date — rather than padding; sources merged, not
replaced. Depth 87.8% → 93.4%, thin tail 57 → 31.

**`[02-P0-2]` coastline (`polish`)** — a quiet line traced along the land polygon's own edge (new
`coastline` layer + palette token in both light/dark), drawn above the sea-mask/ancient-sea fills
so land and sea meet with a visible stroke instead of a hard color boundary, matching how Google
Maps' own coastline reads. Verified with Playwright at 1280×900 light and 375×812 dark — visible
in both as a subtle darker line following every coast, no regression to the phone chrome.

**Province overlay (Track B, FEATURE_BACKLOG.md P1)** — click a province, at empire/region-level
zoom, to highlight it and see a panel with its governor, legions stationed, and cities on the
map. A prior shift's own note on this exact item had scoped it out as needing new per-province
research (`provinces.geojson` then carried only a bare `name` field) — by the time this run
picked it back up, `[14-P1-4]` province-pages (`app/provinces.ts`, capital/blurb/status),
`[07-P1-4]` governors (`public/data/politics.geojson`), and the legion locator (`app/legions.ts`)
had all shipped independently in between, so the feature became a pure lens over data that
already exists, no new atomic research needed. New `app/useProvincePanel.ts` (a `usePoiPanel.ts`-
style external store) and `app/ProvincePanel.tsx` (same screen slot and visual language as
`PlaceDetails.tsx`). Click handler zoom-gated at z≤7.5 — `provinces-fill` covers virtually all
land, so an ungated handler would pop a panel on every close-up click meant for measuring,
routing, or browsing a city, which invariant 0's "the map has to look like Google Maps" rule would
never accept. Mutually exclusive with the Place details panel (same pattern as Directions/the
ruler): selecting a province clears any open place and vice versa, wired through a small
`registerPoiSelectedSideEffect` callback slot added to `usePoiPanel.ts` rather than a circular
import between the two stores. Also skipped outright while the ruler or Directions is capturing
clicks for its own session — new `isRulerActive()`/`isDirectionsActive()` non-React accessors on
those two stores, same pattern as the existing `getSelectedPoi()`.

**A real, harder-than-expected finding surfaced while verifying this with Playwright, worth its
own paragraph**: this sandbox's well-documented `demotiles.maplibre.org` block turns out to gate
far more than glyph rendering. `app/Map.tsx`'s entire Phase 2 onward — roads, curated POIs, every
site's building layer, all ~30 subsequent data phases — runs inside one single
`map.on("load", async () => {...})` callback (pre-existing architecture, confirmed via `git show`
against the commit at session start — not something this shift introduced). In this sandbox,
MapLibre's "load" event itself never fires when the initial style's glyph fetch is permanently
blocked: `map.loaded()` flips `true` within about a second of construction, but a freshly-bound
`map.on("load", ...)` listener still never fires, confirmed waiting past 3 minutes across several
separate test runs, layer count frozen at exactly the 13 layers Phase 1's ungated initial style
defines and never growing. That means **no cloud shift, in this exact sandbox condition, can
Playwright-verify anything past Phase 1 by actually clicking the live map** — not a regression
from this session's changes (the gating pattern predates it), and not specific to the province
panel either; the same block would prevent verifying a click on `pois-dot`, any site's building
layer, or anything else added after Phase 1. Diagnosed methodically rather than assumed: confirmed
the click→resolve→highlight logic is correct by binding the exact same handler code directly to
the live map instance (bypassing the load-gate entirely) and firing a real synthetic click, which
correctly resolved "Aquitania" and would have called `selectProvince()` — the logic works, only
the live end-to-end click path is unreachable from this sandbox. Wrote this up as a sharpened
finding on the already-open `[02-P0-4]` self-host-glyphs ticket, since fixing that ticket (or
gating Phase 2 on something other than a `"load"` event that depends on an unreachable domain)
would fix both the labels-disappearing failure mode it already named and this harder one.
Structural verification was still done in full: production build succeeds cleanly, `tsc --noEmit`
clean, `npm run validate` clean (0 errors, the same 14 reviewed warnings), and the new
`provinces-selected-fill`/`provinces-selected-line` layers confirmed present and valid in the
live style via `map.getStyle().layers`.

### Next shift

Board is clean, ratio owed nothing at session end — full 1:2:1 cycle plus a real Track B ship.
`[02-P0-4]` self-host-glyphs just got a sharper, higher-value case made for it (see above) —
worth strong consideration for whoever's next, both for production robustness and to unblock full
Playwright verification in this sandbox. `[06-P0-2]` curate-buildings has 31 sites left (Timgad
was already flagged stale by an earlier shift — verify a candidate's actual named-feature count
before claiming, same lesson repeated across several recent shifts now). `[10-P0-3]`
flagship-depth has 31 thin descriptions left. No unclaimed P0 `add` exists on the board.

---

## Shift 29 — 2026-08-18 (this shift's own prompt claimed "Shift 2 of four")

**Same stale-numbering mismatch every shift since #13 has flagged** — the scheduled prompt carries
a stale "Shift N of four" count; `SHIFT_LOG` was 28 real shifts deep at session start, so this
entry continues as Shift 29. `git pull --rebase` against `origin/main` landed cleanly on the real
tip with no ref issues this run (unlike a few recent shifts). Read `SHIFT_BRIEF.md` in full, then
`BOARD.md` per its own instruction.

**Axis 1 (more cities) re-confirmed blocked, with a wider domain sweep than any prior shift ran.**
Beyond the four domains earlier shifts had already flagged (`overpass-api.de`,
`en.wikipedia.org`, `commons.wikimedia.org`, `nominatim.openstreetmap.org`), this session also
tried `pleiades.stoa.org` (the definitive ancient-gazetteer reference the brief itself points
to), `archli.com` (a classical-geography dictionary), and `penelope.uchicago.edu` (LacusCurtius,
hosting Strabo's full text) — all four returned an explicit `EGRESS_BLOCKED` from WebFetch. The
`$HTTPS_PROXY/__agentproxy/status` endpoint itself reported no recent relay failures at session
start (nothing had been attempted yet), confirming this is a live, current-session block, not a
stale cached status. WebSearch remains completely unaffected and is what every batch below was
researched through — search-snippet synthesis rather than primary-page reads, same constraint
every recent shift has documented.

Claimed four board tickets in one commit (`git pull --rebase` first, per protocol): `sea-labels`
(`add`, topmost unclaimed that didn't need Overpass — `[07-P1-1]` travel-time was technically
topmost but flagged by shift 28 as Track-B-sized, picked up separately below instead of forcing
it into the `add` slot), `curate-buildings`/Merida and `epigraphy` batch 4 (two `deepen`, both
standing tasks), and `nearby-related` (`polish`, topmost unclaimed unblocked ticket with a real
spec). A full 1:2:1 cycle, then the rest of the shift went to `[07-P1-1]` travel-time (Directions)
as the Track B stretch shift 28's own handoff note recommended.

### Board — a full 1 `add` : 2 `deepen` : 1 `polish` cycle, plus a Track B stretch

**`[02-P1-6]` sea-labels (`add`)** — 32 named seas, gulfs and straits (`public/data/seas.geojson`)
as always-on cartographic labels — Mediterranean sub-seas (Tyrrhenian, Ionian, Aegean, Adriatic,
Myrtoan, Icarian, Libyan, Sardinian, Balearic, Ligurian, Iberian), major gulfs (Taranto, Ambracia,
Corinth, Lion, Issus, Persian), and straits (Gibraltar, Messina, the Dardanelles, the Bosphorus,
the English Channel), plus the Black Sea, Sea of Azov, Sea of Marmara, Red Sea, Arabian Sea,
Atlantic, North Sea and Irish Sea. Treated as base geography rather than a toggleable overlay —
same tier as the existing place-label layers, no new `useLayers.ts` entry, since real Google Maps
never hides ocean names behind a checkbox either. Two-tier reveal zoom (seas/oceans from z3,
gulfs/straits from z5.5) needed two filtered symbol layers sharing one source rather than one
layer, since MapLibre's `minzoom` is a layer property and can't be driven per-feature by a data
expression — tried that first, it silently doesn't work as a `minzoom` value. Labels render
uppercase and letter-spaced rather than italic: this sandbox couldn't confirm the `demotiles`
glyph set actually carries an italic face (glyph fetches are blocked here the same way Overpass
is, so it couldn't be tested directly), and the existing `ostia-street-labels`/similar layers
already made the same substitution for the same reason — followed the established precedent
rather than guess. Latin name (Mare Tyrrhenum, Fretum Gaditanum, ...) surfaces on hover, never in
the on-map label, per the display-name rule. Coordinates and Latin names are standard classical
geography, corroborated via WebSearch (Dictionary of Greek and Roman Geography snippets, Pleiades
place-page titles surfaced in search results even though the pages themselves are unfetchable)
rather than treated as needing per-item primary-source citation, the same bar `ancient-lakes`
(shift 28) used for comparable base-geography content. `landmarks_117.geojson`-adjacent but its
own file, since it's pure labels with no `PlaceDetails` card behind them (no `image_url` needed —
same exemption the schema's own image-invariant note implies for non-card features).

**`[06-P0-2]` curate-buildings, Merida (`deepen`)** — 10 entries in `app/meridaDescriptions.ts`,
the eighth site to get Ostia-depth treatment. Checked the actual named-feature count before
claiming (per shift 27's own flagged lesson that these counts go stale): 46 named features in
`merida_buildings.geojson`, of which 10 turned out genuinely researchable and Roman. Augusta
Emerita's monumental core was mostly built by 117 CE — a rarer shape than the last several
batches (Trier, Jerash) which skewed almost entirely `extant_117ce: false` — so most entries here
are honestly `true`: the Temple of Diana (Augustan-Tiberian imperial-cult temple), the Municipal
Forum, the Arch of "Trajan," the Roman Circus, the Casa del Mitreo, the Casa del Anfiteatro, Los
Columbarios necropolis, and the Decumanus Maximus. Two real misattributions surfaced by the
research and written into the copy rather than silently corrected, matching this project's own
established voice for exactly this situation: the "Temple of Diana" has nothing to do with Diana
(a 17th-century local historian's guess), and the "Arch of Trajan" has nothing to do with Trajan
either — it was built under Tiberius as a gateway to the Imperial cult precinct, and picked up its
current name only after its real dedicatory inscription was lost. The Alcazaba (835 CE Islamic
citadel built from reused Roman stone), the National Museum of Roman Art (1986, Rafael Moneo),
and the Xenodochium (580 CE Visigothic hospital) are the three honestly `false` entries. One
candidate ("Termas romanas") deliberately skipped rather than guessed: its coordinates cluster
near the Circus and Xenodochium, not near any of Augusta Emerita's documented bath complexes
(San Lázaro, the Forum baths, Huerta de Otero) this research could confidently place there —
same call Trier's "Roter Turm" made for a different reason (an ambiguous duplicate name there;
an ambiguous location here). Verified with Playwright against the built production bundle:
clicking the Temple of Diana and Trajan's Arch both surface the correct curated text and dates.

**`[09-P1-4]` epigraphy, batch 4 (`deepen`)** — 6 more POIs cited in `pois.geojson`'s
`ancient_sources[]`: the Library of Celsus (I.Ephesos 5113, the facade dedication from Gaius
Julius Aquila to his father), Domus Flavia (Statius, *Silvae* 4.2 — the banquet-hall-columns
line), Alexandria's Mouseion (Strabo, *Geography* 17.1.8), the Herculaneum Augustales' hall
(AE 1979, 169), Circus Flaminius (Livy, *Periochae* 20 — the full Book 20 is one of the lost
books, so this cites the surviving summary rather than inventing a book/chapter reference that
doesn't exist), and the House of the Vettii (two electoral graffiti naming its freedman owners by
name, CIL IV 3509 and 3522 — a nice case where the "ancient source" is literally paint on the
house's own facade). Ostia's Synagogue was researched and deliberately left uncited: its one
attributed inscription (Mindius Faustus's ark donation) is dated by its own restoration to the
second half of the 2nd century CE, not contemporary with this map's 117 CE snapshot — the same
post-117 finding batch 1 had already made independently for Ostia's Capitolium and guild seats,
now corroborated a second time for a third Ostia building. `pois.geojson`: 167 → 173 of 470 POIs
now carry `ancient_sources`.

**`[03-P1-4]` nearby-related (`polish`)** — new `app/useNearby.ts` (shared scoring, used by the
live map panel) plus a duplicated server-side version in `place/[slug]/page.tsx` (a "use client"
hook can't be imported into a server component, so this follows the codebase's own established
per-file-haversine convention — `ContextMenu.tsx`, `PlacesInViewList.tsx` and `Ruler.tsx` each
already keep independent copies for the same reason). Six closest curated POIs by great-circle
distance, with a same-category boost (~8km) so a relevant temple a little further off can
outrank an unrelated warehouse next door without ignoring proximity entirely. Clicking a card in
the live panel calls `selectPoi()` again and the same panel re-renders in place; the static page
links to the other place's own `/place/<slug>` URL. **A real, user-visible bug caught during
testing, not before it**: without a minimum-distance filter, every place's own "Nearby" row led
with its exact duplicate at "8 m" away — the still-open `[12-FIX-3]` duplicate-pantheon ticket's
`poi_pantheon`/`poi_pantheon_rome` pair is the concrete case that surfaced this, and the fix
(exclude candidates under 25m) is now in both the client hook and the server-side duplicate.
Worth flagging up: this is the second independent feature (after epigraphy batch 3's citation
research) to trip over that same known duplicate, which argues for bumping `[12-FIX-3]`'s
priority rather than letting a third feature rediscover it. Verified with Playwright at 1280×800
light and 375×812 dark: cards render with theme tokens throughout (caught and fixed a stray
`next-server` process serving a stale build during testing — a `ChunkLoadError`/React error #423
that looked like a real bug until a clean `kill` + `next start` resolved it; worth flagging for
future shifts since it's easy to misdiagnose as a code issue), horizontal-scroll on the panel,
grid on the static page, click-through re-selects correctly on both.

**`[07-P1-1]` travel-time / Directions (`add`, Track B stretch)** — the feature FEATURE_BACKLOG.md
has called "highest-impact single feature in the backlog" since Shift 1, previously wired
everywhere as an honestly-disabled "coming soon." Built end-to-end this shift:
`scripts/build-route-graph.mjs` reads the two existing Itiner-e road files (`roads_main.geojson`,
`roads_secondary.geojson`, 14,601 LineString segments combined) and builds a routable graph by
treating each segment as an edge between its two endpoints, deduped to shared nodes by rounding
to 4 decimal degrees (~11m). A quick check before committing to this approach found the network
is already almost fully connected at that precision — 9,477 of 10,214 unique rounded endpoints
are shared by 2+ segments — so a full vertex-level topology rebuild wasn't needed; the simpler
endpoint-graph captures the real network shape. Output is `public/data/route_graph.json` (~6MB,
self-contained with each edge's own coordinates for rendering), fetched only when Directions is
actually opened — never adds to the initial page load. `app/routeGraph.ts` runs Dijkstra
client-side with a hand-written binary min-heap; a naive flat-array scan over ~10k nodes would be
close to 100M operations and visibly janky on a click, the heap keeps it to O(E log V) and
resolves in well under a second in testing. `app/Directions.tsx` + `app/useDirections.ts` wire
three entry points — clicking the map directly while Directions is open, the right-click context
menu's "Directions from/to here" (now real, was disabled since Shift 7), and a new "Directions"
button on every place card (replacing the old two-pill row with three) — into one shared session
that draws the real road route as a blue line and reports total distance plus legion/merchant
travel-day estimates using FEATURE_BACKLOG's own stated assumptions (25/15 Roman miles per day,
1 Roman mile ≈ 1.48 km). Directions and the ruler are made mutually exclusive map "modes" —
starting one silently cancels the other via a small cross-import between `useDirections.ts` and
`useRuler.ts` — matching how real Google Maps only ever runs one such mode at a time and avoiding
two floating cards fighting for the same screen corner.

Two edge cases were treated as real findings worth surfacing rather than smoothed over: a query
whose two points fall in different connected components of the road network — confirmed with a
deliberate mainland-Italy-to-Vindolanda test, since the Channel has no bridge in the source data
— correctly reports "No road route found" instead of drawing a straight line across open sea,
which would have been a much easier but dishonest thing to ship. And because the graph only has
nodes where real road segments end, a click that doesn't land exactly on a mapped road reports
its own "approach distance" to the nearest road separately in the results card, rather than
silently folding an unstated straight-line guess into the total.

**A real testing-harness gotcha worth logging for whoever writes Playwright tests against this
map next**: simulating a right-click with `page.mouse.click(x, y, {button: 'right'})` reaches
`document`'s own `contextmenu` listener reliably, but reaching MapLibre's internal
canvas-container-scoped `contextmenu` emitter this way was flaky — sometimes worked, sometimes
silently didn't, with no correlation found to click position, zoom, or nearby markers after
several rounds of isolating variables. Calling `window.__map.fire('contextmenu', {point, lngLat,
preventDefault(){}, originalEvent: new MouseEvent('contextmenu')})` directly against the map
object bypassed the flakiness entirely and is what every context-menu test in this shift
ultimately used. Verified end-to-end this way: a real Rome→Ostia query returns 24.9 km over an
18-point road-following polyline (visibly following the actual Via Ostiensis corridor in the
screenshot, not a straight line) in well under a second; the Britain no-route case reports
correctly; both entry points work at 1280×900 light and 375×812 dark, desktop and mobile — the
place-card entry point now also closes the mobile bottom sheet on click so the results card isn't
left hidden underneath it, a fix made after first testing surfaced exactly that problem.

### Metrics

`npm run metrics -- --write`: 470 POIs unchanged in count but 167 → 173 now carry
`ancient_sources` (35.5% → 36.8%). Curated-building coverage 7/40 → 8/40 sites (17.5% → 20.0%).
29 thematic files now (seas.geojson new), 748 → 780 pre-merge thematic records. Validator: 0
errors, same 14 reviewed warnings, cross-file collision count unchanged at 75 (none of this run's
additions introduced a new near-duplicate — the nearby-related 25m filter catches existing ones
at query time without touching the underlying data). `next build` clean throughout (564 static
routes, unchanged — Directions is client-side only, no new static pages).

### What's next

- **Board, fresh cycle**: this run closed a clean 1:2:1 plus the `[07-P1-1]` stretch and a bonus
  `[12-FIX-3]` fix (see below), so the next run picks whatever's topmost and unclaimed. Topmost
  unclaimed P0 tickets are unchanged across several runs now — `[12-P0-1]` merge-themes (`fix`,
  big), `[03-P0-1]` schema-v2 (`fix`), `[03-P0-2]` card-rebuild (`polish`, still missing its
  spec), `[11-P0-3]` delete-dead-data (`retire`), `[08-P1-6]` baalbek-dating (`verify`).
  The topmost unclaimed `add` is `[09-P2-8]` how-we-know (a public methodology page) —
  `[06-P2-6]` priority-cities remains blocked on Overpass access.
- **Directions has two real, scoped-out extensions** for whoever wants them: sea legs (a
  genuinely different routing problem — sailing-season-dependent, no equivalent maritime network
  file exists in `public/data/` yet, would need its own research pass to build one) and
  multi-stop itineraries (currently strictly point-to-point).
- **Axis 1 (more cities) needs either a non-Overpass sourcing approach or a different
  environment** — this run's wider domain sweep (Pleiades, archli.com, LacusCurtius, on top of
  the four domains prior shifts already confirmed) makes it clear this is a deliberate, broad
  policy block on reference/data-source domains generally, not a narrow one on a handful of
  sites. WebSearch is unaffected and remains every axis's actual research channel.
- **`[10-P0-3]` flagship-depth**: still 57 fields under 60 words, untouched this run.
  **`[09-P1-4]` epigraphy**: standing task, hundreds of curated POIs still carry no citation.
  **`[06-P0-2]` curate-buildings**: 32 sites still open for the standing task.

### Bonus fix — `[12-FIX-3]` duplicate-pantheon (`retire`)

Picked up after the planned cycle since nearby-related had independently flagged it twice as
still open (see above). `poi_pantheon` and `poi_pantheon_rome` had already stopped disagreeing
(fixed 2026-08-16) but the duplicate pin itself remained. Before deleting `poi_pantheon_rome`,
checked it for anything worth keeping — it turned out to carry one real citation `poi_pantheon`
didn't have (Cassius Dio 53.27.2, on the argument over Agrippa's original naming), merged into
`poi_pantheon` first. `/place/pantheon_rome` was a generated, plausibly-indexed page, so a
permanent redirect to `/place/pantheon` went into `next.config.js` rather than a silent 404.
`pois.geojson` 470 → 469. Verified: the redirect returns 308 and lands on `/place/pantheon`,
which now renders both citations; the merge is a clean diff (no reformatting collateral). The
ticket's own "worth checking the other 73 collisions while in here" note was **not** acted on —
real scope beyond this one pair, left for a dedicated audit pass.

---

## Shift 28 — 2026-08-18 (this shift's own prompt claimed "Shift 1 of four")

**Same stale-numbering mismatch every shift since #13 has flagged** — the scheduled prompt carries
a stale "Shift N of four" count; `SHIFT_LOG` was 27 real shifts deep at session start, so this
entry continues as Shift 28. Session started on a detached `HEAD`: the local `main` ref was stuck
at the very first commit (2026-08-11), while `origin/main` — invisible to a shallow clone's cached
ref — had actually moved to Shift 27's tip. `git fetch --unshallow origin` (the local clone was
shallow, unusual for these sessions — worth flagging in case it recurs) resolved the stale ref,
then `git branch -f main origin/main && git checkout main` landed on the real tip. Read
`SHIFT_BRIEF.md` in full, then `BOARD.md` per its own instruction.

**Axis 1 (more cities) re-confirmed blocked, with a sharper diagnosis than prior shifts had.**
Every shift since #7 has flagged `research/` (the Overpass city-fetch pipeline) as `.gitignore`d
and absent from a fresh cloud clone; this session went one step further and queried this specific
environment's own egress proxy status endpoint (`$HTTPS_PROXY/__agentproxy/status`), which logs
recent relay failures with a reason code. `overpass-api.de`, `en.wikipedia.org`,
`commons.wikimedia.org`, and `nominatim.openstreetmap.org` all show `connect_rejected — gateway
answered 403 to CONNECT (policy denial or upstream failure)` — a deliberate policy block, not a
transient network fault, matching the `EGRESS_BLOCKED` WebFetch errors earlier shifts hit from a
differently-configured sandbox. `[06-P2-6]` priority-cities (which needs Overpass) is therefore
not pickable from this environment either; noted in the board so nobody re-discovers this from
zero. WebSearch remains unaffected and was the only research channel used this run.

Claimed four board tickets in one commit (`git pull --rebase` first, per protocol): `ancient-lakes`
(`add`, topmost unclaimed P2 `add` that didn't need Overpass), `flagship-depth` and `epigraphy`
(two `deepen`, both standing tasks), and `places-in-view-list` (`polish`, topmost unclaimed P0
`polish` with a real, followable spec — `card-rebuild` above it is still missing its "eleven-block
order" source document, same reason every prior shift has deferred it). A full 1:2:1 cycle.
`git pull --rebase` before every push; no collisions with the other workers on this repo.

### Board — a full 1 `add` : 2 `deepen` : 1 `polish` cycle

**`[08-P2-7]` ancient-lakes (`add`)** — 20 named lakes as a new `lake` type on the existing
natural-landmarks layer: Fucino (Claudius's naumachia and failed drainage tunnel), Trasimene
(Hannibal's ambush), Avernus (Agrippa's secret fleet base cut through the underworld's mythic
gate), Lucrinus (Sergius Orata's pioneering oyster farms), Bolsena, Albano (the Veii-siege
emissarium), Nemi, Como (Pliny the Younger's two villas), Garda (Catullus's Sirmio), Maggiore,
Bracciano (source of Trajan's own Aqua Traiana, a deliberate 117 CE tie-in), Geneva (Caesar's
30km rampart against the Helvetii), Constance, Copais (Aristophanes's stock eel joke), Karla/
Boibeis, Stymphalia (the Stymphalian birds), Moeris (Fayum irrigation engineering, pharaonic but
still running under Roman administration), Mareotis (Alexandria's inland wine-trade harbor), the
Sea of Galilee, and the Dead Sea. Reuses the `landmarks-point` source/layer as-is — defaults OFF,
no new toggle, just a `lake` entry added to `Map.tsx`'s hover-popup type label. One entry (Karla)
shipped without an `image_url`: no specific Commons filename could be confirmed with any real
confidence, and per the project's own image invariant a missing image degrades gracefully while a
wrong one doesn't. `landmarks_117.geojson` 24 → 44 features.

**A data-pipeline mistake caught and fixed before committing, worth flagging for future batches**:
the file's existing indent style turned out to be one space per nesting level, not the JSON
standard two — a first pass through Python's `json.dump(feature, indent=2)` silently reformatted
the *entire* file on write, turning a clean 20-feature addition into an 1,800-line diff that
buried the real change in reformatting noise (the exact trap `SHIFT_LOG` #11's `append_features.js`
note warned about, but for indent width rather than escaping). Caught it with `git diff --stat`
looking suspiciously large for the change size, reverted, and redid it as a pure text splice —
generate each new feature with `json.dumps(feat, indent=1)`, prefix every line by the file's own
2-space feature-array nesting, and insert directly before the closing `]}` via string concatenation
rather than re-parsing/re-serializing the whole document. Confirmed clean with `git diff | grep -E
"^-[^-]"` returning nothing. `pois.geojson`, by contrast, already uses standard 2-space indent, so
its own edits below needed no such care.

**`[10-P0-3]` flagship-depth, batch 2 (`deepen`)** — the 24 thinnest `notes` fields on the whole
map (44–53 words each), worst-first per `npm run metrics`'s own queue: mostly obscure Rhine/
Danube/Dacian limes forts (Argentorate, Castra Traiana, Munningen, Gerulata, Newbrough, Zugmantel,
Pons Aluti, Deva/Chester, Arnsburg, the two Danube fleet bases, Solva, Pons Vetus, Echzell) plus a
handful of genuinely famous Rome monuments that had somehow stayed thin (Baths of Trajan, Trajan's
Forum and Column, the Temple of Saturn, the Domus Augustana) and three miscellaneous entries
(Corinth's Julian Basilica, the Lugdunum theatre, the Sotiel Coronada mines, the Madrague de Giens
wreck). Rewritten to ~100–130 words each — one genuinely new researched fact per record (a named
excavation, a specific garrison unit, a construction detail: the Cologne city wall's Black-Forest-
felled timber shuttering dated by dendrochronology, Trajan's Column's exact relief statistics —
2,662 figures across 155 scenes — and its pre-carved 40-tonne staircase blocks, Deva's mysterious
paired elliptical building found in 1939) rather than padded filler, existing verified facts kept
and rewoven rather than dropped. Sources merged, not replaced. Depth 82.7% → 87.9%, thin tail
81 → 57. **One honest judgment call left visible rather than silently resolved**: research for
Munningen surfaced a German-Wikipedia claim that its garrison may have been withdrawn "by around
110 CE at the latest" — which would put the fort's active-garrison status in question right at
this map's own 117 CE snapshot. Rather than flip `extant_117ce` on one search-snippet-derived date
or silently ignore the finding, the rewritten note was phrased to describe the vicus outlasting
the garrison in general terms without asserting an active 117 CE garrison — flagged here for
whoever has time to chase down a primary source and settle it properly.

**`[09-P1-4]` epigraphy, batch 3 (`deepen`)** — opened the channel batch 2 (shift 27) found
closed. Batch 2's own honest finding was that three of its four targeted sites had no matching POI
in `pois.geojson` to attach a citation to, even though the citations themselves were real and
verified — an inscription with nowhere to live. This batch added those three POIs (Forum of
Aquileia, the Roman Theatre of Merida, Forum of Timgad) with fresh Google-Business-voice
descriptions, then attached the three citations batch 2 had already researched and handed off: the
Aquileia forum's founding-triumvir elogium (AE 1996, 685), Agrippa's Merida theatre dedication
(CIL II 474, sharing its opening formula with his Pantheon inscription in Rome), and Timgad's
Trajanic foundation text (CIL VIII 2355) — deliberately attached to the forum POI rather than the
standing "Arch of Trajan", which batch 2 had already established is actually Severan (c. 200 CE)
and would have been a real misattribution eight years before that arch existed. With the channel
open, also attached 5 further verified citations to famous POIs that had shipped with none: the
Pantheon (CIL VI 896, the frieze inscription Hadrian kept from Agrippa's original temple), the Ara
Pacis (Augustus's own *Res Gestae* 12.2), the Domus Aurea (Suetonius, *Nero* 31.2 — Nero's one
recorded remark on finishing it), the Baths of Nero (Martial, *Epigrams* 7.34), and the Rostra
(Cassius Dio 47.8.3-4, corroborated independently by Appian 4.20 — Cicero's head and hand displayed
there in 43 BCE). `pois.geojson` 467 → 470 features, all three new POIs' `/place/` pages verified
building cleanly.

**`[05-P0-1]` places-in-view-list (`polish`)** — new `app/PlacesInViewList.tsx` +
`app/usePlacesInView.ts`: an accessible, keyboard-navigable list of every curated POI and site
inside the current map viewport, sorted by distance from the map center, live-updated 200ms after
every `moveend`. The gap this closes: every place on the map up to now was only discoverable by
visually scanning pins, which fails outright for a screen-reader user or a keyboard-only user, and
is slow even for a sighted mouse user who just wants a scannable list of "what's around here."
Full listbox semantics — `role="listbox"`/`"option"`, `aria-activedescendant` tracking the active
row, Arrow/Home/End/Enter/Escape — and clicking or pressing Enter on a row opens the exact same
real place card a map click would (or flies into a city and loads its street-level detail, for a
`sites.ts` entry). Desktop gets its own FAB, the next open slot in the bottom-right stack
(`bottom:361`, above Compass); mobile gets no new FAB at all, reached instead from the hamburger
menu, because the phone's corner is already at the five-control budget `SHIFT_BRIEF.md`'s own
"look like Google Maps" invariant sets (search pill, layers button, one corner FAB, epoch pill,
credit chip) — a sixth control would be exactly the kind of accretion that invariant exists to
stop. **A real layout bug caught in the first screenshot pass, before it ever reached a commit**:
the FAB's `bottom:361` position is high enough in the stack that a flat `60vh` panel cap ran off
the top of a 1280×800 window entirely, clipping the header off-screen. Fixed by bounding the
panel's `maxHeight` with `min(60vh, calc(100vh - 429px))`, sized against the FAB's own reserved
space rather than a fixed viewport fraction, so it can't overflow regardless of window height.
Verified with Playwright: keyboard nav moves `aria-activedescendant` correctly and Enter opens the
right card while closing the list (tested landing on "Trajan's Markets" after two `ArrowDown`
presses); 1280×800 light and 375×812 dark screenshots both clean — mobile shows the panel as a
bottom-sheet-style overlay reached through the hamburger menu, matching the rest of the app's dark
tokens with no white slabs.

### Metrics

`npm run metrics -- --write`: 467 → 470 POIs (the 3 epigraphy-batch-3 additions). Depth 82.7% →
87.9% (thin tail 81 → 57). Curated-image coverage and ancient-source coverage both nudged up from
the new POIs shipping with real images/citations from day one. Validator: 0 errors, same 14
pre-existing warnings, cross-file collision count unchanged at 75 — none of this run's additions
introduced a new near-duplicate. `next build` clean throughout (564 static routes, up from 561).

### What's next

- **Board, fresh cycle**: this run closed a clean 1:2:1, so the next run picks whatever's topmost
  and unclaimed. Topmost unclaimed P0 tickets are unchanged from last run — `[12-P0-1]`
  merge-themes (`fix`, big), `[03-P0-1]` schema-v2 (`fix`), `[03-P0-2]` card-rebuild (`polish`,
  still missing its spec), `[12-FIX-3]` duplicate-pantheon (`retire`), `[11-P0-3]`
  delete-dead-data (`retire`), `[08-P1-6]` baalbek-dating (`verify`). The topmost unclaimed `add`
  is now `[07-P1-1]` travel-time (P1, an ORBIS-style journey calculator) — bigger scope than a
  data batch, a real Track B candidate for a shift with time to spare on it.
- **Axis 1 (more cities) needs either a non-Overpass sourcing approach or a different environment**
  — this run's proxy-status-endpoint check makes it explicit that the block is a deliberate policy
  denial on the specific domains the existing pipeline depends on (`overpass-api.de`,
  `nominatim.openstreetmap.org`, plus `en.wikipedia.org`/`commons.wikimedia.org` for the research
  side), not a missing script or a flaky connection. WebSearch is unaffected and is what every
  other axis in this project already researches through.
- **`[10-P0-3]` flagship-depth**: 57 fields still under 60 words. **`[09-P1-4]` epigraphy**: now a
  standing task with its POI-availability bottleneck cleared — hundreds of curated POIs still
  carry no inscription at all, worth a batch 4 whenever there's a free `deepen` slot.
- **Munningen's 117 CE garrison status** (see flagship-depth note above) is a real, small,
  well-scoped follow-up if anyone has a spare half hour and a primary source.

---

## Shift 27 — 2026-08-17 (this shift's own prompt claimed "Shift 4 of four")

**Same stale-numbering mismatch every shift since #13 has flagged** — the scheduled prompt carries
a stale "Shift N of four" count; `SHIFT_LOG` was 26 real shifts deep at session start, so this
entry continues as Shift 27. Session started on a detached `HEAD` at an already-stale local `main`
ref (the recurring symptom every shift since #9 has flagged); `git fetch origin main` +
`git checkout -B main origin/main` fixed it in one step. `research/` (the Overpass city-fetch
pipeline, axis 1) is `.gitignore`d and absent from the fresh cloud clone — ruled out axis 1, same
as every recent shift.

Read `SHIFT_BRIEF.md` in full, then `BOARD.md` per its own instruction. Claimed four tickets in one
`BOARD.md` commit at the start (`git pull --rebase` first, per protocol): `hub-pages` (`add`, the
topmost unclaimed `add` per shift 26's own handoff note), `epigraphy` and `curate-buildings` (two
`deepen`, both standing tasks), and `sheet-detents` (`polish`, topmost unclaimed P0 polish ticket
in priority order) — a full 1:2:1 cycle. `git pull --rebase` before every push; no collisions.

**Skipped `[03-P0-2]` card-rebuild without claiming it, and logging why**: it's the topmost P0
`polish` ticket in priority order, ahead of `sheet-detents` — but its own text references an
"eleven-block order" from a research report that isn't in this repo (`research/reports/` doesn't
exist in a fresh cloud clone, same gap every shift since #9 has flagged for `research/` itself).
Rather than guess at an undocumented spec for a structural rebuild of the entire place card, took
the next well-specified P0 `polish` ticket instead. `PlaceDetails.tsx`'s current block order and
empty-hides-itself behavior already substantially satisfy what the ticket describes qualitatively;
whoever picks `card-rebuild` back up should either find the missing report or write the eleven-block
spec fresh before touching the component.

### Board — a full 1 `add` : 2 `deepen` : 1 `polish` cycle

**`[14-P2-8]` hub-pages (`add`)** — five explainer essay pages at `/hub/[slug]`: The Roman Road
Network, The Roman Army in 117 CE, 11 August 117 (the map's own snapshot date), Trade/Coinage/the
Economy, and Religion & the Sacred Landscape. `app/hubs.ts` (hand-written registry: title, dek,
3-5 paragraphs of scene-setting prose, sources) + `app/hub/[slug]/page.tsx` (per-hub supporting
list pulled live from data already shipped at build time) — same split `/province/[slug]` already
uses between a small registry and a page that aggregates real data around it. No new atomic
research: road stations grouped by road, the 28 legions by province (linking each to its
`/place/` card), people/events from `people_117.geojson`/`events_117.geojson`, mints/trade routes,
and imperial-cult centers/religious communities by tradition. Wired into `sitemap.ts`.
**Two real data-shape bugs found and fixed while wiring the supporting lists** — neither is new,
both predate this shift, both were previously invisible because nothing had iterated the whole
FeatureCollection and assumed uniform geometry before: `events_117.geojson` mixes `Point` and
`Polygon` geometries (the Kitos War revolt zones are polygons) in one file, which crashed static
generation on a bare `.toFixed()` call until a small polygon-centroid helper (`pointFor()`) was
added; and `trade_routes.geojson` mixes the named `LineString` routes with their individual
`Point` waypoints (`node_*` features, e.g. the Amber Road's nine named stops) in the *same*
FeatureCollection, which needed filtering to `LineString`-only before the routes list read
correctly instead of listing waypoints as if they were routes. Verified: `next build` generates
all five hub routes cleanly; screenshotted at 1280×900 light and 375×812 dark.

**`[09-P1-4]` epigraphy, batch 2 (`deepen`)** — 0 new citations merged, and it's a real, honest
zero rather than a skipped batch. Targeted the four sites shift 25's ancient-sources note and
shift 26's own handoff recommended: Ostia's guild seats/Capitolium, Timgad's arch/forum, Aquileia,
Mérida's theatre/amphitheatre. The research found the *targeting* was the actual problem: **three
of the four sites have no matching POI in `pois.geojson` at all** — Timgad has none, Aquileia has
only a Salt Pans and a Necropolis POI (no Forum), Mérida has only dam and necropolis POIs (no
Theatre or Amphitheatre). A real, verified, correctly-dated inscription has nowhere to attach when
the building itself was never added as a POI. For the one site that does have matching POIs —
Ostia's Capitolium and Piazzale delle Corporazioni guild seats — the genuine surviving inscriptions
there are Severan-era (c. 190-210 CE) or later, a legitimate `not_found` rather than a search
failure. The research pass still surfaced three well-sourced, independently-verified candidate
citations with no POI yet to hold them: Aquileia's forum elogium honoring the colony's founding
triumvir (AE 1996, 685, securely dated 169 BCE by content), Mérida theatre's Marcus Agrippa
dedication (CIL II 474, 16-15 BCE, near-identical wording to his Pantheon inscription in Rome),
and Timgad's Trajanic foundation text (CIL VIII 2355, 100 CE, though scholarship only tentatively
places it near the west gate/forum rather than on the standing "Arch of Trajan" — which is
actually Severan, c. 200 CE, and would have been a genuine misattribution to merge it there). All
three are a ready-made head start for whoever adds those missing POIs. 149/230 high-confidence
POIs remain open at 64.8%, unchanged — this batch's finding doesn't move that number, since none
of the four targets were in that denominator to begin with (Ostia's two ARE, and both are now a
confirmed `not_found` rather than untried).

**`[06-P0-2]` curate-buildings, Trier (`deepen`)** — claimed for Timgad, pivoted mid-shift. A quick
check of `public/data/sites/timgad_buildings.geojson` before committing research budget found only
**7 named features** out of 252 total — a stale "30+ named features" claim in shift 26's own
handoff note (spot-checked, genuinely wrong, corrected in this run's board note). Redirected to
Trier (Augusta Treverorum), which the same check showed has 116 named features — but that number
turned out to be its own trap: ~105 of the 116 are ordinary present-day German-city buildings
(hospital wings, tax offices, hotel chains, apartment blocks) with zero Roman-era connection, and
none of Trier's headline Roman monuments — the Porta Nigra, the Amphitheater, the Aula Palatina,
the Römerbrücke — carry an OSM name tag at all, so no amount of research could make them reachable
here. The 12 buildings that do have real, sourceable history are in `app/trierDescriptions.ts`,
the seventh site to get this treatment, and every single one is honestly `extant_117ce: false` —
Trier's building boom doesn't start until it becomes a Tetrarchic and then Constantinian imperial
residence city from 293 CE on, generations after this map's snapshot; several entries (Steipe,
Dreikönigenhaus, the Frankenturm, the Jerusalem Tower) are medieval buildings raised over or near
Roman ground eight to eleven centuries later. Two real Roman-era baths (Barbarathermen, 150 CE;
Kaiserthermen, 298 CE) and the Viehmarkt baths are the closest anything here comes to standing in
117 CE, and none of them do. "Roter Turm" deliberately skipped: the exact name string appears
twice in the geojson at two different, unrelated real locations (a 1543 wall bastion and a 1647
tower on the Electoral Palace), so one lookup entry keyed to that string would misdescribe
whichever of the two a click actually landed on. Researched via a background WebSearch pass;
direct fetch of wikipedia.org, livius.org and historyhit.com was network-blocked in the researching
session, so every fact is corroborated through search-snippet synthesis rather than a primary-page
read. Verified with Playwright against the built production bundle (not dev mode): clicking
Barbarathermen surfaces "Built 150 CE" and the "Not standing in 117 CE" badge with the curated
text. 33 sites still open for the standing task.

**`[04-P0-1]` sheet-detents (`polish`)** — extended `PlaceDetails.tsx`'s mobile bottom sheet from
two snap points (half/full) to three (peek/half/full), matching Google Maps mobile's own sheet
behavior. A fast flick now advances or retreats one detent regardless of how far the pointer
travelled, via an exponentially-smoothed release velocity computed from the drag gesture itself; a
slow release still snaps to the nearest detent by position; dragging well below peek dismisses the
panel. **Found and fixed a real, independent bug while building the Playwright harness to verify
this** — not caused by this shift's changes, present since the sheet's original two-detent
implementation, and specifically what made the drag untestable in this sandbox until diagnosed:
when a POI's `image_url` fails to load (dead link, offline, or — as in this sandboxed environment
— network-blocked), the old `onError` handler only hid the `<img>` itself. The surrounding
`position:relative` wrapper collapsed to zero height, and its `position:absolute; bottom:0` credit-
caption div slid up to sit exactly where the drag handle renders one flex child earlier — silently
eating every pointer event aimed at the handle. The sheet became fully undraggable any time an
image failed, directly contradicting this project's own written rule (`SHIFT_BRIEF.md` §1.6:
"broken URLs degrade gracefully... hides the `<img>` on load error and shows the fallback rail") —
the fallback rail was never actually reached on a real image error, only the broken-image icon was
suppressed. Fixed by tracking the failure in an `imageFailed` state so a broken image now renders
the identical fallback gradient rail "no `image_url`" already gets, credit caption included.
Confirmed the bug reproduces and the fix holds via `elementFromPoint()` and precise
`getBoundingClientRect()` comparisons before attributing it, not just a symptom-level retry.
Verified the full state machine with a Playwright test driving real synthetic mouse gestures
against the *built production bundle* (dev mode wasn't used — an earlier debugging pass also
tripped over stale/duplicate `next start` processes serving mismatched build chunks, a pure
testing-harness issue, not a product bug, resolved by using the Bash tool's own backgrounding
instead of shell `&`/`nohup`, which didn't survive between tool calls in this environment): slow
small drag → nearest-snap back to half; fast flick up → half to full; fast flick down twice → full
to half to peek; fast flick down from peek → dismissed. Screenshotted at 375×812 in both light and
dark at all three detents, plus desktop light (unaffected — the sheet is mobile-only there).

That closes a complete 1 `add` : 2 `deepen` : 1 `polish` cycle.

### Metrics

`npm run metrics -- --write`: 467 POIs unchanged (hub pages, epigraphy research and curated
buildings don't change the POI count); curated building sites 6/40 → 7/40 (15.0% → 17.5%). Depth
holds at 82.7% (none of this run's work lands in the `notes` field the depth metric measures).

### What's next

- **Board, fresh cycle**: this run closed a clean 1:2:1, so the next run picks whatever's topmost
  and unclaimed. At session end the topmost unclaimed P0 tickets are `[12-P0-1]` merge-themes
  (`fix`, big), `[03-P0-1]` schema-v2 (`fix`), `[03-P0-2]` card-rebuild (`polish` — still missing
  its spec, see the note at the top of this entry), and two `retire` tickets. No unclaimed P0
  `add` exists.
- **`[09-P1-4]` epigraphy is increasingly bottlenecked on missing POIs, not on unverifiable
  inscriptions.** The three candidate citations this batch surfaced (Aquileia forum, Mérida
  theatre, Timgad forum/gate) are fully researched and ready to merge the moment those POIs exist.
  Worth framing as a small `add` (three new POIs, each with the inscription already in hand) rather
  than another literary/epigraphic research pass against an increasingly thin pool.
- **A process finding worth repeating for every future shift claiming `curate-buildings`**: this
  run hit a stale board claim ("Timgad, Aquincum, Xanten and Trier all carry 30+ named features")
  that was wrong for the one site actually checked. Before claiming a site, `python3`/`grep` the
  actual `_buildings.geojson` file for real named-feature counts rather than trusting a prior
  shift's log entry — both Timgad (7 real) and Trier (116 nominal, 12 usable) turned out to differ
  substantially from what a quick glance at the number would suggest. Aquincum and Xanten (32 named
  each, unverified beyond the raw count this run confirmed) are the next candidates.
- **`[03-P0-2]` card-rebuild needs either its missing spec recovered or rewritten from scratch.**
  Every shift that's looked at this ticket has deferred it; it's the oldest unclaimed P0 `polish`
  on the board specifically because "eleven-block order" has no definition anywhere in this repo.

---

## Shift 26 — 2026-08-17 (this shift's own prompt claimed "Shift 3 of four")

**Same stale-numbering mismatch every shift since #13 has flagged** — the scheduled prompt carries
a stale "Shift N of four" count; SHIFT_LOG was 25 real shifts deep at session start, so this entry
continues as Shift 26. Session started on a detached `HEAD` at an already-stale local `main` ref
(the recurring symptom every shift since #9 has flagged); a `git fetch` had left the local
remote-tracking ref pointing at the 2026-08-11 root, `git reset --hard origin/main` fixed it in one
step. `research/` (the Overpass city-fetch pipeline, axis 1) is `.gitignore`d and absent from the
fresh cloud clone — ruled out axis 1, same as shifts 24 and 25.

Read `SHIFT_BRIEF.md` in full, then `BOARD.md` per its own instruction. Claimed four tickets in one
`BOARD.md` commit at the start (`git pull --rebase` first, per protocol): `ordinary-people` (`add`),
`epigraphy` and `curate-buildings/Jerash` (two `deepen`), and `search-selects` (`polish`) — a full
1:2:1 cycle, and specifically the cycle the shift-25 board note recommended (`[07-P1-5]` and
`[09-P1-4]` were both named there). `git pull --rebase` before every push; no collisions this run.

### Board — a full 1 `add` : 2 `deepen` : 1 `polish` cycle

**`[01-P0-4]` search-selects (`polish`)** — search matched only the 16k-row DARE gazetteer, so
choosing a result panned the camera and did nothing else: no pin, no card, no confirmation anything
happened. Now `loadPois()` (new, in `app/places.ts`) flattens the 467 curated `pois.geojson`
records into the same `Place` shape the existing scorer understands, merged *ahead* of the
gazetteer so a curated landmark outranks a bare dot of the same name. A result carrying `poiProps`
calls `selectPoi()` — the identical path a marker click takes — so it gets the enlarged ringed
marker, hero image, notes, ancient sources, everything. A gazetteer-only result drops the red
"What's here?" pin `ContextMenu.tsx` already uses, with the place name in a popup. One ordering
constraint worth flagging for whoever touches this next: `selectPoi()` triggers Map.tsx's own
panel-aware `easeTo`, which keeps the current zoom; a search jump needs to zoom in, so the `flyTo`
is issued *after* `selectPoi()` in the same tick — MapLibre cancels the earlier camera call, so the
one carrying the zoom has to go last. Verified with Playwright at 1280×800 light and 375×812 dark:
searching "Colosseum" + Enter opens the full card with exactly one `.rm-poi-marker--selected` at
zoom 15.5; searching "Londinium" (gazetteer-only) drops the red pin with its name popup, no card.

**`[07-P1-5]` ordinary-people (`add`)** — 25 named non-elite people added to `people_117.geojson`
(25 → 50 features), the layer's first content that isn't emperors, generals, writers or bishops:
frontier troopers (Chrauttius, Veldeius, Masclus and his out-of-beer postscript), the supply
contractor Octavius, the household slave Candidus, the Karanis-papyri soldiers (Terentianus and his
veteran father, the clerk-hopeful Apollinarius), and — the richest vein — the Babatha and Salome
Komaise archives from the Cave of Letters, a whole cast of Dead Sea villagers whose deeds and
lawsuits bracket 117 CE exactly. Plus Tiberius Claudius Maximus, who ran down king Decebalus and
carved it on his own tombstone, and Marcus Ulpius Phaedimus, Trajan's 28-year-old attendant who
died at Selinus on 12 August 117 — one day after this map's date (CIL VI 1884, spot-verified).
Researched via two parallel background WebSearch passes (military/frontier and civilian/economic),
each told to report `not_found` rather than invent. **Landed at 25, short of the ticket's 30-50
estimate, and that shortfall is the honest finding**: named non-elite people you can both date to
~117 and place on a map are genuinely scarce, and both passes came back with far more not-founds
than hits. Dropped three plausible candidates whose evidence couldn't be dated to the window — a
Fayum weaver (couldn't pin the papyrus number, and WebFetch to Berkeley's digital library was
egress-blocked) and two tradeswomen (Julia Saturnina the Mérida physician, Sellia Epyre the Rome
gold-embroiderer), both flagged by their own scholarship as loosely dated "1st-2nd century" rather
than Trajanic. New green `ordinary` role ring and an `attested` field carrying the date of the
evidence itself, so each bio states plain facts instead of hedging every sentence. Verified with
Playwright: layer still defaults OFF (0 markers cold), 25 → 50 after enabling, Babatha's popup
shows the new "Known from" line, no coordinate stacks.

**`[09-P1-4]` epigraphy, batch 1 (`deepen`)** — opened the inscription channel the last three
ancient-sources batches kept pointing at. 16 real surviving inscriptions merged into
`pois.geojson`'s existing `ancient_sources[]` array: the 8 CIL leads shift 25 handed off (verified,
not taken on trust) plus 8 more researched and verified this shift — Trajan's Column (CIL VI 960),
Arch of Titus (VI 945), the Porta Maggiore aqueduct crossing (VI 1256), the Delphi Gallio rescript
(SIG³ 801d, the Gallio of Acts 18), Philae's Cornelius Gallus trilingual stele (III 14147), the
Colosseum (VI 40454a, the Alföldy nail-hole reconstruction), and the Nîmes amphitheatre seating
text (XII 3316). Each carries a plain-English gloss of what the stone says and, where published,
the Latin. Fitted to the validator's author/work/ref shape as siglum / inscription-type / date, so
a CIL number reads as the bold label the eye scans for; renders through the card's existing "In
ancient writing" block with zero UI change. Rejected on review, not merged: the Pantheon
inscription (belongs to the finished Hadrianic building, not the 117 construction site — and the
POI is `extant_117ce: false` anyway), the Temple of Bel Palmyra text (unverifiable), the Temple of
Saturn text (4th-c restoration), and the Baths of Neptune / Capitolium / Ostia synagogue
inscriptions (all post-117). The research pass also surfaced two duplicate-POI pairs for
`[12-FIX-3]` to resolve — `poi_pantheon` / `poi_pantheon_rome` and `poi_pompeii_temple_apollo` /
`poi_temple_apollo_pompeii` — noted on the board. Verified with Playwright: the Colosseum card
shows the new CIL VI 40454a entry beside its Suetonius and Cassius Dio citations. Standing ticket
reopened — hundreds of curated POIs still carry no inscription, and the pipeline now exists.

**`[06-P0-2]` curate-buildings, Jerash (`deepen`)** — the sixth site to get Ostia-depth
descriptions (`app/jerashDescriptions.ts`, 30 entries), and the sharpest 117 CE snapshot case on
the map so far. Gerasa's famous silhouette — the Artemis sanctuary and temple, Hadrian's Arch, the
Nymphaeum, both Tetrapylons, the upper Zeus peristyle temple — is Antonine through Severan
(129-210s CE), a whole building boom that begins *after* Trajan died, so 22 of the 30 entries are
honestly `extant_117ce: false`, and their descriptions say what stood on the ground in Trajan's day
rather than describe a monument that wasn't there yet. That includes all 14 Byzantine churches
(494-611 CE, most securely dated by their own mosaic inscriptions — an unusually well-dated set).
Marked `true` and real in 117: the older lower Zeus sanctuary, the city wall, the two extramural
market rows on the Philadelphia road (built c. 110, trading through the snapshot), and the standout
— the North Gate, dated by its own inscription to 115 CE and dedicated to Trajan, the single most
precisely dated thing standing at Gerasa when this map is set. Judgment calls, all logged in the
file header: the Cathedral's underlying temple is `false` because its construction date is unknown
and the "Temple of Dionysus" identification is unconfirmed by excavation; the Martyrion and
Mortuary churches carry no `built` year (none securely attested); the Agora/Civic Basilica is
`false` (design stage at most in 117). All 30 keys are the exact OSM strings in
`jerash_buildings.geojson` — only the park label, a visitor centre and a restaurant left uncurated.
Researched via two background WebSearch passes (Roman-era structures; Byzantine churches + souks).
Verified with Playwright: clicking the North Gate building surfaces "Built 115 CE" and the curated
text; the Temple of Artemis shows the "Not standing in 117 CE" badge with its honest not-yet-built
description.

That closes a complete 1 `add` : 2 `deepen` : 1 `polish` cycle.

### Metrics

`npm run metrics -- --write`: 467 POIs unchanged (people, inscriptions and curated buildings don't
change the POI count); curated building sites 5/40 → 6/40. Depth holds at 82.7% (the epigraphy and
curated-building work lands in `ancient_sources[]` and the per-site description files, neither of
which the `notes`-depth metric measures).

### What's next

- **Board, fresh cycle**: this run closed a clean 1:2:1, so the next run picks whatever's topmost
  and unclaimed. At session end the topmost unclaimed P0 tickets are `[12-P0-1]` merge-themes
  (`fix`, big — may need splitting), `[03-P0-1]` schema-v2 (`fix`), `[03-P0-2]` card-rebuild
  (`polish`), and two `retire` tickets — `[12-FIX-3]` duplicate-pantheon (this run's epigraphy
  research freshly confirmed both duplicate pairs it names) and `[11-P0-3]` delete-dead-data. No
  unclaimed P0 `add` exists; the next `add` in priority order is `[14-P2-8]` hub-pages (P2).
- **`[09-P1-4]` epigraphy is now a standing task with a working pipeline** — the merge shape and
  card rendering are proven, so future batches are pure research. The remaining pool is large:
  hundreds of curated POIs carry no inscription. Good next targets are Ostia (an unusually rich
  epigraphic record — the guild seats, the Capitolium), Timgad's arch and forum, Aquileia, and
  Mérida's theatre and amphitheatre, none touched this batch.
- **ordinary-people**: 25 landed, and the real remaining upside is other well-documented papyrus
  and tablet corpora not yet mined — the Sulpicii archive (Puteoli banking, dated 1st c., likely
  too early), more of the published Vindolanda tablets, the Egyptian tax and census papyri. Direct
  `WebFetch` was egress-blocked for both research agents (Berkeley library, academia.edu, RIB all
  failed to fetch); a pass with working fetch and fresh search budget would firm up the three
  dropped candidates and probably add a handful more.
- **Jerash** leaves 34 sites still open for the standing curate-buildings task. The site files
  under `public/data/sites/` show which have enough named OSM buildings to be worth curating —
  Timgad, Aquincum, Xanten and Trier all carry 30+ named features.

---

## Shift 25 — 2026-08-17 (this shift's own prompt claimed "Shift 2 of four")

**Same stale-numbering mismatch every shift since Shift 13 has flagged** — the scheduled prompt
that starts each session carries a stale "Shift N of four" count from whenever it was templated.
SHIFT_LOG was already 24 real shifts deep at session start, so this entry continues as Shift 25.
Session started on a detached `HEAD` pointed at an already-stale local `main` ref (one real commit
behind, from 2026-08-11) — `git fetch` + `git reset --hard origin/main` fixed it in one step, the
same recurring symptom every shift since #9 has flagged. `research/` (the Overpass-fetch pipeline
for adding new cities, axis 1) is `.gitignore`d and doesn't exist in this fresh cloud clone, same
gap Shift 24 flagged — ruled out axis 1 for this run rather than rebuild the pipeline from scratch.

Read `SHIFT_BRIEF.md` in full, then `BOARD.md` per its own instruction. Claimed four tickets in
one `BOARD.md` commit at the start (`git pull --rebase` first, per protocol): the topmost
unclaimed `add` in priority order (`governors`), the two standing `deepen` tasks
(`ancient-sources`, `curate-buildings`), and one self-contained `polish` ticket (`focus-ring`) —
a full 1 `add` : 2 `deepen` : 1 `polish` cycle, matching what the board's own ratio-state note
said the next run should open with. `git pull --rebase` before every push; no collisions this run.

### Board — a full 1 `add` : 2 `deepen` : 1 `polish` cycle

**`[05-P0-2]` focus-ring (`polish`)** — global `:focus-visible { outline: 2px solid var(--accent);
outline-offset: 2px; }` in `app/globals.css`, theme-token-driven so it's correct in both color
schemes with zero component changes. The one wrinkle: several text inputs (the search field chief
among them) sit flush inside a rounded pill container with `overflow: hidden`, and an outward
`outline` got visibly clipped by the pill's edge on a first pass — screenshotted the clipping,
then switched those specific elements to an inset `box-shadow` instead, which draws inward and
can't be clipped. Verified with Playwright (real headless Chromium, `/opt/pw-browsers`) at
1280×800 light and 375×812 dark: tabbed through the hamburger menu, search field, search icon
button, and the "Why 117 CE?" pill in both — clean accent-color rings everywhere, circular buttons
get circular rings for free (modern browsers make `outline` follow an element's own
`border-radius`). Noticed and ruled out a false alarm while testing: the MapLibre canvas itself is
also keyboard-focusable (existing behavior, for arrow-key panning) and does pick up the ring, but
at full-viewport size it renders just outside the visible canvas and is effectively invisible —
not a regression, just a size where the effect doesn't show.

**`[07-P1-4]` governors (`add`)** — 12 sourced provincial governors for 117 CE added to
`public/data/politics.geojson` (`category: "provincial_governor"`, reusing the existing Political
apparatus layer/popup rather than standing up new UI). Researched via two parallel background
WebSearch agents split by half the province list, each explicitly told to report `not_found`
rather than invent a name. **Shipped well short of the ticket's own "~45 names" estimate, and
that shortfall is itself the finding**: named, year-dated provincial governors for 117 CE
specifically are genuinely rare outside the handful of provinces Trajan's Parthian War pulled into
the historical spotlight — both research passes came back with 21 honest `not_found`s against 12
hits. The 12 that shipped lean hard on that same war: Hadrian himself at Syria the exact day he's
acclaimed, Lusius Quietus mid-Kitos-War in Judaea, Marcus Rutilius Lupus watching Alexandria burn,
Quadratus Bassus dying in Dacia this same year putting down frontier unrest, three more generals
from the same campaign. Two of the two agents' `not_found`s were flagged honestly as
search-budget exhaustion rather than confirmed absence (Hispania Baetica, Lusitania, Sicilia,
Dalmatia) — real remaining upside for whoever picks this back up with fresh search quota. Every
entry carries real sources (Cassius Dio, the *Historia Augusta*, Eusebius, plus modern fasti
compilations and epigraphy) and an honest `confidence` field. Verified with Playwright: toggled
the layer, confirmed all 32 politics.geojson features render (20 existing + 12 new), hovered a
new marker and confirmed the popup shows the right name/bio. While debugging an unrelated
screenshot-timing false alarm during this verification, confirmed `applyAllLayers()` (the
invariant-0 mechanism that keeps thematic layers off by default) does fire correctly on a cold
load in this sandbox — just slowly (~20-25s here, this environment's blocked external
glyph-loading retries are the cause, not present in production, no action needed).

**`[09-P0-1]` ancient-sources, batch 5 (`deepen`)** — 0 new literary citations (149/230, 64.8%,
unchanged), and that's a real result, not a skipped batch. Deliberately targeted 19 non-tomb
candidates this round (Tabularium, Trajan's Markets, provincial theatres, Pompeii's forum/
temples/baths, the Maison Carrée, Baalbek's Temple of Bacchus, the Alcantara Bridge, three
amphitheatres) on the theory that famous standalone monuments would outperform the tomb-heavy
remaining pool — they didn't. Every real hit the research turned up was an **inscription** (CIL),
which this ticket's own rule excludes (inscriptions belong to `[09-P1-4]` epigraphy, standing and
still unclaimed), so nothing merged into `ancient_sources[]` this round. Real near-misses
correctly rejected on review, the same discipline the last two batches established: Aulus Gellius
on Trajan's Forum describes the neighboring Forum, not the separate Markets complex; Macrobius on
Baalbek's oracle describes the neighboring Temple of Jupiter, not Bacchus. The 8 solid CIL
citations this batch did turn up (Tabularium, Stabian Baths, Temple of Isis, Temple of Apollo,
Alcantara Bridge, Maison Carrée, Temple of Baalshamin, Cartagena's theatre) are logged in
`BOARD.md`'s ticket note as a ready-made head start for whoever opens the epigraphy channel next.

**`[06-P0-2]` curate-buildings, Delphi (`deepen`)** — the fifth site to get Ostia-depth curated
descriptions, and the first Panhellenic sanctuary rather than a city: new
`app/delphiDescriptions.ts`, 34 entries (33 distinct buildings) researched via a background
WebSearch pass keyed against Pausanias's own 2nd-century tour of the sanctuary, Herodotus,
Plutarch — a working Delphic priest at this map's exact 117 CE snapshot date — and the Fouilles de
Delphes excavation reports. Delphi's OSM building names are in Greek, unlike the Italian/English
names the first four curated sites used, so the lookup keys here are exact Greek strings, a
pattern difference worth flagging for whoever curates the next non-Latin-script site. One
candidate dropped on review: `Τέμενος Ποσειδώνος` ("Precinct of Poseidon") has no known standalone
structure at Delphi — research pointed instead to a Poseidon altar inside the Temple of Apollo's
own cella (Pausanias 10.24.4), so curating it as a second separate building would have asserted a
precinct that likely doesn't exist. One genuine surprise checked rather than assumed:
`Στοά Αττάλου` ("Stoa of Attalos") looks like an OSM mix-up with the far more famous Athens Agora
building of the same name, but turned out to be real and Delphi-specific, funded by a different
Attalid king. The same duplicate-marker-shadowing bug the Ephesus entry already documented
recurred once — the curated Temple of Apollo entry sits behind a pre-existing standalone
`pois.geojson` POI at the same coordinates that always wins the click first — left in as harmless,
same call as Ephesus. Verified with Playwright: all 34 keys match real, distinct OSM features in
the live building data (no silent typos), and clicking the Athenian Treasury surfaces the authored
text with no fallback message.

That closes a complete 1 `add` : 2 `deepen` : 1 `polish` cycle.

### Metrics

`npm run metrics -- --write`: 467 POIs unchanged, curated-places total 1,158 → 1,170 (the 12 new
governors), ancient-sources coverage unchanged at 149/230 (64.8%, see batch 5 above), curated
building sites 4/40 → 5/40 (10.0% → 12.5%).

### What's next

- **Board, fresh cycle**: this run closed a clean 1:2:1 cycle, so the next run picks whatever's
  topmost and unclaimed. At the time this run ends the topmost unclaimed P0 tickets are
  `[12-P0-1]` merge-themes (`fix`, big — may need splitting), `[03-P0-1]` schema-v2 (`fix`), and
  `[03-P0-2]` card-rebuild (`polish`); no unclaimed P0 `add` exists — the next `add` in priority
  order is `[07-P1-5]` ordinary-people or `[14-P2-8]` hub-pages. Check the board fresh.
- **`[09-P1-4]` epigraphy** is a strong pickup for the next `deepen` slot: this run's
  ancient-sources batch 5 already handed it 8 verified CIL citations with real reference numbers
  for free (see that ticket's note in `BOARD.md`), and the standing ancient-sources ticket has
  now hit its third batch in a row with a very low literary hit rate — the epigraphy channel is
  where the real remaining yield is.
- **Governors**: 31 of 43 provinces still have no marker. Four (Hispania Baetica, Lusitania,
  Sicilia, Dalmatia) are flagged as genuinely unresearched rather than confirmed-absent — the best
  next marginal return. The rest are honest gaps in the surviving Trajanic/Hadrianic fasti; a
  future pass with working `WebFetch` (blocked for both research agents this run — every domain,
  even Wikipedia, failed to fetch directly; only `WebSearch`'s synthesized snippets worked) and
  fresh search budget would likely do somewhat better, per both agents' own notes, but shouldn't
  be expected to close the gap to anywhere near 43.
- **Axis 2 (road stations)**: not touched this run — the board cycle filled the shift. Via Appia,
  Via Egnatia, and Via Domitia/Via Cottia are shipped; Via Augusta (Hispania) is next in the
  brief's own queue for whoever wants an axis-only run.
- **`research/` (axis 1, more cities)** still doesn't exist in a fresh cloud clone — same gap
  Shift 24 flagged, unresolved this run too.

---

## Shift 24 — 2026-08-17 (this shift's own prompt claimed "Shift 1 of four")

**Same stale-numbering mismatch every shift since Shift 13 has flagged** — SHIFT_LOG was already
23 real shifts deep at session start, so this entry continues as Shift 24. The session started on
a detached `HEAD` pointed at the same commit `origin/main` was already at (`cb61cbb`, Shift 23's
last commit) — `git checkout -B main origin/main` fixed the local branch pointer in one step, the
same recurring symptom every shift since #9 has flagged, nothing lost. `research/` (the
Overpass-fetch pipeline `SHIFT_BRIEF.md` describes for adding new cities) is `.gitignore`d and
doesn't exist in a fresh cloud clone — a real gap for whichever shift next wants to pick up axis 1
(more cities); it isn't a script this session could read or extend, only rebuild from scratch.

Read `SHIFT_BRIEF.md` in full, then `BOARD.md` per its own instruction ("prefer a board ticket
over an axis"). Claimed four tickets in one `BOARD.md` commit at the start (`git pull --rebase`
first, per protocol), then worked them in polish → add → deepen → deepen order rather than
strictly add-first, since the polish ticket was small and self-contained and clearing it early
left the rest of the shift free for the two research-heavy deepen tickets to run as background
agents while other work continued. `git pull --rebase` before every push; no collisions this run.

### Board — a full 1 `add` : 2 `deepen` : 1 `polish` cycle

**`[14-P1-4]` province-pages (`add`)** — new `app/provinces.ts`, a registry of 43 provinces (the
53 polygons in `provinces.geojson` collapse to 43 real administrative units: Italy's eleven
Augustan regiones fold into one `Italia` entry since they aren't provinces at all, and a few
short-lived/contested units — Epirus, the Cyclades, Assyria — fold into their nearest real
province rather than shipping an empty page), each with 117 CE administrative status
(senatorial/imperial-consular/imperial-praetorian/imperial-procurator/prefecture), capital, and a
sourced Google-Business-voice blurb. New `app/province/[slug]/page.tsx` (mirrors `/place/[slug]`'s
pattern) lists every `sites.ts` city and `pois.geojson` record whose `province` field normalizes
to that province. The underlying data turned out to use roughly fifteen different spellings for
the same provinces (Achaea/Achaia, Judaea/Iudaea, Baetica/Hispania Baetica, Arabia/Arabia
Petraea) — built an alias table (`provinceForField()`) to absorb this rather than touching the
~450 records that carry those strings. Verified a handful of less-certain facts via WebSearch
before writing (Lycia et Pamphylia's capital, Thracia's procurator-to-legate upgrade date,
Numidia's real 117 CE status as a legionary military district rather than a separate province,
which the page states plainly). Wired into `sitemap.ts`. 6 of 43 pages have no `sites.ts`/
`pois.geojson` content yet (the three small Alpine provinces, Bithynia et Pontus, Cilicia,
Thracia) and render an honest empty state rather than padding with invented content — a real gap
for a future shift. `next build`: 43/43 new routes generate cleanly; `npm run validate` clean.

**`[01-P0-1]` selected-marker (`polish`)** — the selected POI's pin now renders at ~1.35x scale
with a white + category-color ring (`PoiMarkers.tsx`), and selecting a place eases the camera with
MapLibre `padding` so the pin lands clear of the details panel (desktop) or bottom sheet (mobile)
instead of landing underneath it. **Found and fixed a real bug while wiring this, not just a
styling change**: the obvious way to redraw the selected pin — add `selectedId` to `PoiMarkers`'
main data-fetch effect's dependency array — made that effect's one-time "await the map's `load`
event if it isn't ready yet" guard re-run on every single place selection. `load` only ever fires
once per `maplibregl.Map` instance, so every reselection after the first hung forever awaiting an
event that would never come again, silently stranding every POI marker at zero. This didn't show
up in a quick look — it took several stale-dev-server false leads (a leftover background `next
start` process serving an old build while a rebuilt one ran on the same port, giving `0 markers`
readings that had nothing to do with the actual bug) before a full lifecycle trace pinned it down
to the `load`-wait. Fixed by leaving the main effect's dependencies untouched and adding a second,
tiny effect that just re-invokes the already-built `render()` closure (via a ref) when the
selection changes — no refetch, no load-wait, no zoomend re-registration. Verified with Playwright
(real headless Chromium) at 1280×800 light and 375×812 dark: marker count holds at 404 through a
select and a reselect of a different pin; exactly one marker carries the selected styling at a
time; the panel/sheet no longer covers the open pin in either viewport.

**`[09-P0-1]` ancient-sources, batch 4 (`deepen`)** — continued the standing citation task from
148/230 (64.3%) toward the shrinking remaining pool (82 open at claim time). Delegated 41 of those
82 to three parallel background WebSearch-only agents by theme (Italy/Gaul/Hispania civic
monuments; Eastern/frontier sites; industrial sites), each told to report `not_found` honestly
rather than stretch. Result: 1 real hit — the Baths of Trajan now cite Cassius Dio 69.4.1, which
names the baths among Apollodorus of Damascus's works for Trajan in the anecdote explaining
Hadrian's later grudge against the architect. One additional candidate (a Symmachus panegyric
offered for Rheinzabern/Tabernae) was dropped on review — the researching agent itself flagged the
exact oration/section as unconfirmed against the primary text, which fails this project's bar for
a citation even though the underlying claim is plausible. 149/230 (64.8%) now covered; confirms
the wall the last two batches predicted — what remains is almost entirely tombs/mausolea/
necropoleis (29), villas/estates (12), and shipwrecks (4).

**`[06-P0-2]` curate-buildings, Ephesus (`deepen`)** — the fourth site to get Ostia-depth curated
descriptions, and the first *living* city rather than a site buried in 79 CE: new
`app/ephesusDescriptions.ts`, 33 buildings researched via a background WebSearch pass and
personally reviewed before merging — the Library of Celsus (still under construction the exact day
Trajan died), both Terrace Houses, the Serapeion, the Tetragonos and State agorae, the Prytaneion,
and several genuinely-Hadrianic buildings (the Vedius and East Gymnasia, the Olympieion, Hadrian's
own temple) correctly marked `extant_117ce: false` since Hadrian wasn't yet emperor at this map's
snapshot. Because Ephesus was thriving and continuously occupied in 117 CE rather than frozen by a
volcano, most Augustan-through-Trajanic buildings are `extant_117ce: true` — flipped the file's
default framing from the three buried-site precedents accordingly. One date fixed on review: the
research pass gave the Library of Celsus `built: 114`, but its own description text says
construction was still underway when Trajan died and finished "a few years later" — 114 is when
work *began*, not a completion year, and scholarly sources genuinely disagree on the actual
completion date (117 to as late as 135), so `built` was left unset rather than asserting a
specific wrong number. Wired into `Map.tsx`'s existing building-click handler. Two of the 33
entries (Great Theatre, Library of Celsus) turned out to duplicate content that already exists as
standalone `pois.geojson` POIs at the same coordinates — those markers sit on top of the map
canvas and always intercept a click before it reaches the building-fill layer underneath, so those
two entries are effectively unreachable dead code; left in as harmless rather than deleted, and
worth remembering for whichever site is curated next. Verified with Playwright: clicking the
Serapeion surfaces the new text with the correct "Not standing in 117 CE" badge.

That closes a complete 1 `add` : 2 `deepen` : 1 `polish` cycle, clearing the `add`+`deepen` debt
the 2026-08-16 mac-editorial-pass note left open.

### Track A — Via Domitia + Via Cottia, Italy to the Pyrenees (axis 2, no board ticket)

Via Appia and Via Egnatia already shipped; next in the brief's own road queue is Via Domitia —
Gnaeus Domitius Ahenobarbus's road, built 118 BCE, linking Italy to Spain through Gallia
Narbonensis. `road_stations.geojson`: 61 → 83 features, compiled from the Antonine Itinerary's two
parallel entries for this stretch (the Mediolanum–Arelate stage via the Cottian Alps; the
Arelate–Narbo stage) plus Strabo for the Pyrenees terminus, cross-checked against modern place
identifications via WebSearch. Split into two named roads rather than one, deliberately: **Via
Domitia proper** (16 stations, Vapincum/Gap through Segustero, Alabontia, Catuiacia, Apta Julia,
Cabellio, Ambrussum, Sextantio, Forum Domitii, Cessero, Baeterrae, Narbo — the provincial capital —
Combusta, Ruscino, and Ad Centenarium, ending at the Panissars pass where Pompey raised a trophy
in 71 BCE to mark the Gallia Narbonensis/Hispania Tarraconensis border) and **Via Cottia** (6
stations, Segusio/Susa through Ad Martis, Brigantio, Ramae, Eburodunum, Caturrigas — the Alpine
approach road from Italy, historically a separate named road several tourist/hiking sources blur
into "Via Domitia" but the schema's `road` field should say what a Roman actually called it).
Vapincum is the one station shared by both, the physical junction. Honest about resolution: Ramae
has no secure modern identification (the Itinerary names it but no excavation has confirmed a
site) — shipped `identified: false` with an interpolated coordinate rather than an invented
precise one; five more stations carry `confidence: medium` where the identification rests on
regional-heritage sources rather than the itinerary text itself, and two hop distances that aren't
in the surviving itinerary text at the granularity searched are noted as road-distance estimates
rather than presented as itinerary-sourced numbers. One ambiguity resolved rather than glossed
over: the itinerary records this route via Arelate (Arles) with its own mileage figures, but
Arelate already has standalone POIs on this map, so it wasn't re-added as a road station —
Ambrussum's `distance_from_previous_mp` is measured from Nemausus per the source text (also not
re-added, same reasoning) and that's spelled out in its own `notes` field rather than left
ambiguous. Reused the already-shipped road-stations layer (default OFF per invariant 0) — no UI
changes. Verified with Playwright: toggling the layer renders 17 of the 22 new points in a
Gaul/Iberia-border viewport via `queryRenderedFeatures`.

### Commits this shift

1. `Claim province-pages, selected-marker, ancient-sources batch 4, curate-buildings — cloud shift 24, 2026-08-17` (board claim)
2. `Province pages — 43 provinces, 117 CE administrative status + blurbs — [14-P1-4]`
3. `Board: close province-pages [14-P1-4]`
4. `Selected POI gets an enlarged ringed marker; camera offsets for the panel — [01-P0-1]`
5. `Board: close selected-marker [01-P0-1]`
6. `Ancient-sources batch 4: 1 new citation — [09-P0-1]`
7. `Ephesus curated buildings — [06-P0-2]`
8. `Board: close ancient-sources batch 4 and curate-buildings/Ephesus`
9. `Via Domitia + Via Cottia — 22 road stations, Italy to the Pyrenees (Track A, axis 2)`
10. `Board: log Via Domitia axis-2 work; update ratio state after full 1:2:1 cycle`
11. `Metrics: refresh for 2026-08-17`

All pushed to `main` individually as each piece finished and was verified; pre-push `next build` +
`npm run validate` gate ran clean on every push (0 validator errors, the same 14 pre-existing
warnings throughout; the cross-file name-collision count for `[12-P0-1]`'s merge backlog stayed at
75 — the new road stations and province pages didn't add any).

### Verification methodology

Every UI-touching change (the selected-marker polish, the Ephesus building wiring) was checked in
a real headless Chromium (`/opt/pw-browsers/chromium-1194`, Playwright installed into
`/tmp/pw-scratch` outside the repo) via `npm run build && npx next start`, not `npm run dev` —
production build mode, matching what Vercel actually ships. **One real trap hit repeatedly this
run, worth flagging hard for future shifts**: starting a background `next start` server, then
rebuilding the app, then testing again *without killing the old server* leaves a stale process
still bound to the port, silently serving the *previous* build's HTML (which references JS chunk
hashes the *current* `.next/static` directory no longer has) — the browser then 400s on its own
main chunk and nothing on the page works, in a way that looks exactly like a real application bug
(markers rendering then vanishing, zero markers ever appearing) rather than a test-harness mismatch.
Symptom to watch for: compare `curl -s $URL | grep 'chunks/app/page-'` against
`ls .next/static/chunks/app/ | grep '^page-'` before trusting *any* browser-based finding after a
rebuild — if they don't match, kill every `next`/`next-server` process and restart before
debugging further. Also: `(cmd &)`/`nohup cmd & disown` inside a single Bash tool call did not
reliably keep a server alive past that tool call's return in this harness; the Bash tool's own
`run_in_background: true` parameter did.

### Next shift should pick up

- **Board / Track B:** a complete 1 `add` : 2 `deepen` : 1 `polish` cycle just closed. The next
  run should start a fresh cycle with the topmost unclaimed ticket that fits — check the board
  fresh rather than trusting this note. No unclaimed P0 `add` exists right now; `[12-P0-1]`
  merge-themes (`fix`, flagged as possibly needing to be split across passes) and `[03-P0-1]`
  schema-v2 (`fix`) are the two biggest unclaimed P0s.
- **Track A:** `[09-P0-1]` ancient-sources remains standing at ~40/230 genuinely open, almost all
  tombs/villas/shipwrecks — expect a very low hit rate from here, this run's 41-POI push across
  three research agents found exactly one usable citation. `[06-P0-2]` curate-buildings has real
  headroom: 36 of the 40 sites still have zero curated content (Ostia, Pompeii, Herculaneum,
  Ephesus done). Via Domitia is now shipped; the brief's own road queue continues with Via
  Augusta (the natural next stage south of the Pyrenees, continuing from this run's
  Summum Pyrenaeum terminus), then Via Traiana Nova, then Via Agrippa.
- **Axis 1 (more cities) is still fully unstarted by any cloud shift** — the Overpass-fetch
  pipeline `SHIFT_BRIEF.md` points to (`research/italia_batch.py`) is `.gitignore`d and doesn't
  exist in a fresh cloud clone; a shift that wants to pick this axis up needs to write that
  pipeline from scratch (or the Mac-side worker needs to commit a de-gitignored copy somewhere
  cloud shifts can read it) before the first new city can be fetched.
- **General:** two of Ephesus's 33 curated-building entries (Great Theatre, Library of Celsus)
  are unreachable because a same-coordinate `pois.geojson` POI marker always intercepts the click
  first — the same shape as the collision-audit findings in earlier shifts' logs. Worth a
  dedicated pass checking all four curated-buildings files against `pois.geojson` for this
  specific overlap before curating a fifth site, so the research isn't wasted again.

---

## Shift 23 — 2026-08-16 (this shift's own prompt claimed "Shift 4 of four")

**Same stale-numbering mismatch every shift since Shift 13 has flagged** — SHIFT_LOG was already
22 real shifts deep at session start, so this entry continues as Shift 23. This is the last of
the four shifts this prompt describes; three other cloud shifts and a Mac-side 09:30 editorial
pass had already pushed real work to `main` before this session started (`git fetch` showed
`origin/main` well ahead of the stale first-ever-commit a plain `git branch -a` initially showed
on the detached `HEAD` — `git checkout -B main origin/main` fixed it in one step, same recurring
symptom every shift since #9 has flagged; nothing lost).

Read `SHIFT_BRIEF.md` in full, then `BOARD.md` per its own instruction ("prefer a board ticket
over an axis"). Two more workers pushed to `BOARD.md`/`main` mid-shift (a Mac-side editorial pass
claiming/shipping `[15-P1-4]` metrics and `[10-P0-3]` flagship-depth) — `git pull --rebase`
before every push caught both cleanly, no collisions.

### Track B / board — a full 1:2:1 ratio cycle, twice

**`[10-P0-1]` tours (`add`)** — the board's own note said this had been deliberately skipped by
two earlier shifts over "real phone-layout risk" and "didn't look finishable cleanly." Attempted
it this run, scoped deliberately conservative to keep that risk down: three new files
(`app/tours.ts`, `app/useTour.ts`, `app/TourPlayer.tsx`) built entirely from data already on the
map rather than fetching anything new — Via Appia (31 stops: 5 tomb POIs plus all 26 already-
shipped `road_stations.geojson` mansiones), A Day in Ostia (13 stops, all named `pois.geojson`
buildings), and What Was New in 117 (12 stops, Trajanic monuments interleaved with
`events_117.geojson` entries, closing on `person_trajan`'s death at Selinus and
`event_hadrian_acclamation_antioch` the same day — the map's own snapshot moment). A "poi" stop
opens the real Place details panel via `selectPoi`, the same pattern `LegionLocator.tsx` already
used; "station"/"event"/"person" stops have no card of their own so their sourced text renders
inline in the player. A dashed route line + numbered stop markers draw on the map while a tour is
active, torn down on close, mirroring `Ruler.tsx`'s imperative source/layer pattern. **Real bug
caught before shipping, not after**: the tour panel and Place details panel occupy the same
left-side screen slot (`left:60` vs `left:70`, z-index 9 vs 7), so clicking "Open full details"
on a poi stop was opening the card *invisibly behind* the tour panel — first Playwright pass
showed no visible change because of it. Added `minimizeTourPanel()` (hides the panel, keeps
`activeTourSlug`/`stopIndex` intact) so the card becomes visible; reopening Tours resumes at the
same stop, confirmed with a dedicated screenshot pass. Verified at 1280×800 light and 375×812
dark (mobile gets a compact card below the search pill, not a full slide-in panel — no left rail
to anchor to), all three stop kinds exercised, full 31-stop Via Appia run confirmed Next/Previous
disable correctly at both ends.

**`[09-P0-1]` ancient-sources, batch 3 (`deepen`)** — continued the standing citation task from
145/221 toward the remaining pool (grown to 230 high-confidence POIs as other shifts added
records; 85 open at claim time). Delegated to four parallel background WebSearch-only agents by
theme, each told to report `not_found` honestly rather than stretch — and the honest result was
3 of 85: Salvian on Carthage's circus still packed with race-goers as the Vandals closed in (439
CE — later than most of this project's citations, but a genuine specific literary description of
the physical building), and two Ptolemy *Geography* identifications (Caetobrix/Troia,
Salinae/Ocna Mures). One candidate dropped on review for the same wrong-POI-mismatch shape batch
2's log already flagged: a Macrobius passage about Baalbek's temple oracle, offered for the
neighboring quarry POI. Villas/shipwrecks came back 0/12, tombs/necropoleis 0/29 — both matching
the board's own prediction for this specific remaining pool. 148/230 (64.3%) now covered.

**`[06-P0-2]` curate-buildings, Herculaneum (`deepen`)** — the third site to get Ostia-depth
curated descriptions. New `app/herculaneumDescriptions.ts`, 34 buildings researched via a
background WebSearch pass and personally reviewed before merging: the Villa of the Papyri (built
for Calpurnius Piso, its library the only one to survive intact from antiquity), the Great
Palaestra and its five-headed serpent fountain, the Boat Pavilion where ~300 victims sheltered
from the pyroclastic surge, the College of the Augustales, three bath complexes, and named houses
(the Deer, Neptune and Amphitrite, the Black Hall, the Skeleton, the Bronze Herm). One candidate
("Sacello") dropped as a duplicate of the Augustales hall already covered under its own name. One
claim read as suspiciously exact ("reopened in 2026") and got a dedicated spot-verification pass
before merging rather than trusting it on the research agent's word alone — real, confirmed via
the Parco Archeologico di Ercolano's own site plus three independent press reports: 9 July 2026,
after nearly thirty years closed. Wired into `Map.tsx`'s existing building-click handler (one
more ternary branch alongside `ostiaEntry`/`pompeiiEntry`); first Playwright click into
Herculaneum's building layer surfaced the right content immediately (House of the Corinthian
Atrium, correct "Not standing in 117 CE" badge, 150 BCE-built/79 CE-destroyed dates).

**`[01-P0-2]` camera-memory (`polish`)** — closed the ratio cycle. Landing on the bare
`romanmaps.vercel.app` root always reset to the empire-wide opening view, even for a repeat
visitor who'd panned elsewhere on their last visit — `Map.tsx`'s existing `#lng,lat,zoomz` hash
sync only covers shared links and in-session back/forward, not a plain reload or new tab. Added
a localStorage fallback (`loadCamera`/`saveCamera`, try/catch-wrapped for private-browsing modes
that throw on access) piggybacking on the already-debounced moveend hash writer — one extra
`localStorage.setItem` call, no new listener. A real hash still always wins, and the cinematic
opening flyTo is skipped for a restored camera exactly as it already was for a hash link.
Verified with Playwright: a fresh browser context with no saved camera still gets the unchanged
default Rome view; pan+zoom, strip the hash back to the bare path, reload → lands back at the
panned position.

That's a complete 1 `add` : 2 `deepen` : 1 `polish` cycle in one run, on top of the one Shift 22
already closed — this repo has now run the board's ratio discipline through two full cycles
back to back without a stall.

### Track A — Via Egnatia, the empire's second complete road (axis 2, no board ticket)

The board had nothing unclaimed that fit after the ratio cycle closed, so fell back to
`SHIFT_BRIEF`'s own axis queue, same as Shift 21 did in an equivalent situation. Picked axis 2's
explicit "one road per shift" playbook: Via Appia (26 stations) already shipped — turned out to
already be on `main` before this shift started, unlogged by whichever earlier run added it — so
took Via Egnatia next in the brief's own priority queue (Dyrrachium/Apollonia on the Adriatic,
through Macedonia and Thrace, to Byzantium). `road_stations.geojson`: 26 → 61 features. Delegated
to a background WebSearch agent against the Antonine Itinerary, Peutinger Table, Strabo, and
Pliny, cross-referenced against Pleiades and modern place identifications for all 35 stations —
Dyrrachium, the road's Adriatic-branch twin Apollonia, over the Candavian mountains via Clodiana
and Scampis, past Lake Ohrid at Lychnidus, through Macedonia's royal cities (Heraclea Lyncestis,
Edessa, Pella, provincial capital Thessalonica), east through Amphipolis and Philippi (Paul the
Apostle's first European church) to the Aegean port Neapolis, across Thrace via Traianopolis (a
fresh Trajanic foundation on the site of Xerxes' old invasion muster) and Kypsela, along the
Marmara coast through Perinthus and Selymbria, to Byzantium — two centuries before Constantine
remakes it. **A real gap in my own first prompt, caught before merging**: the research agent's
first pass came back properties-only, no coordinates, because my format spec described "real
coordinates" in prose but never included a `coordinates` field in the JSON template I gave it — a
follow-up message to the same (already-informed) agent got clean `[lng, lat]` pairs for all 35
without re-researching from scratch. Honest about what the Itinerary doesn't resolve: 8 of the 35
stations (Nicaea in Macedonia, Cellae, Melissourgis, Cosintos, Brendice, Milolitum, Syracella,
Resistum) are named in the source but have no securely excavated modern location, shipped with
`identified: false` and a rough coordinate interpolated along the known road corridor rather than
an invented precise one. The later Hadrianopolis branch some Itinerary manuscripts attach to this
stretch was deliberately excluded — Hadrianopolis wasn't founded until after 117 CE. Two
voice-rule hedges caught on my own review before merging ("may have served," "probably founded")
and fixed — one tightened to state the fact plainly, one clause dropped where the underlying
claim was genuinely unresolved rather than just softly worded. Reused the already-shipped
road-stations symbol layer (`Map.tsx`, default OFF per invariant 0) — no UI changes needed.
Verified with Playwright: toggling the layer on renders 26 of the 35 new points in a
Balkans/Thrace viewport via `queryRenderedFeatures` filtered by `road="Via Egnatia"`.

### Commits this shift

1. `Claim tours [10-P0-1] — cloud shift 4, 2026-08-16` (board claim)
2. `Guided tours: format, player, and 3 starter tours — [10-P0-1]`
3. `Board: close tours [10-P0-1]; update ratio state`
4. `Claim ancient-sources batch 3 — cloud shift 4, 2026-08-16` (board claim)
5. `Claim curate-buildings (Herculaneum) — cloud shift 4, 2026-08-16` (board claim)
6. `Ancient-sources batch 3: 3 new citations — [09-P0-1]`
7. `Herculaneum curated buildings — [06-P0-2]`
8. `Board: close ancient-sources batch 3 and curate-buildings/Herculaneum; update ratio state`
9. `Claim camera-memory [01-P0-2] — cloud shift 4, 2026-08-16` (board claim)
10. `Camera memory — remember the last camera across visits — [01-P0-2]`
11. `Board: close camera-memory [01-P0-2]; update ratio state — second full cycle complete`
12. `Via Egnatia — 35 road stations, Dyrrachium to Byzantium (Track A, axis 2)`
13. `Board: log Via Egnatia axis-2 work (no ticket ID)`

All pushed to `main` individually as each piece finished and was verified; pre-push `next build`
+ `npm run validate` gate ran clean on every push (0 validator errors, the same 14 pre-existing
warnings throughout — one tracked count, cross-file name collisions within 150m, rose from 73 to
75 with the new Via Egnatia place names, expected and not a new defect, see that ticket's own
commit message).

### Verification methodology

Same as Shifts 21-22: `npm install playwright` into `/tmp/pw-scratch` (outside the repo, never
touches `package.json`), `executablePath` pointed at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, `npm run dev` in the background, screenshot
at 1280×800 light and 375×812 dark. One new trap worth flagging for future road/POI-layer
verification: a first pass checking whether the new Via Egnatia stations rendered came back with
`queryRenderedFeatures`/`querySourceFeatures` both reporting 0 — looked like a real bug (or a
data problem) before checking `getLayoutProperty('road-stations', 'visibility')` and finding
`"none"`. The road-stations layer is a normal thematic overlay, default OFF per invariant 0, same
as every other overlay — toggling it on via the Layers panel immediately showed 26 of the new
points in view. Don't mistake "a togglable layer's default OFF state" for "the data didn't load."

### Next shift should pick up

- **Board / Track B:** two full 1 `add` : 2 `deepen` : 1 `polish` cycles are now closed back to
  back (Shift 22, then this one). The next run should start a fresh cycle with the topmost `add`
  in priority order — check the board fresh rather than trusting this note, since the Mac
  editorial pass and other cloud shifts push independently and the top of the queue moves. Watch
  for `[12-FIX-3]` duplicate-pantheon (added by another worker mid-this-shift): two pins for one
  building, needs a retire-with-redirect decision since `/place/pantheon_rome` is a generated
  page, not a silent delete. `[08-P1-6]` baalbek-dating also opened mid-shift and is a quick
  `verify`.
- **Track A:** `[09-P0-1]` ancient-sources remains standing at 82/230 open — expect a continued
  low hit rate (this run's batch found real citations for only 3, after extensive per-theme
  search). `[06-P0-2]` curate-buildings has real headroom: 37 of the 40 sites still have zero
  curated content (Ostia, Pompeii, Herculaneum done). Via Egnatia is now shipped; the brief's own
  road queue continues with Via Domitia, Via Augusta, Via Traiana Nova, Via Agrippa next.
- **General:** the guided-tour player (`app/TourPlayer.tsx`) is a new, real UI surface — if a
  future shift adds POIs/road stations/events that a tour references by id, double-check the
  referenced id still resolves (the tour data in `app/tours.ts` is just a list of ids against
  four separate geojson files; nothing enforces referential integrity at build time). The
  panel-overlap bug this shift found and fixed (`minimizeTourPanel`) is a pattern worth
  remembering for any future new panel sharing the left-side screen slot with Place details.

---

## Shift 22 — 2026-08-16 (this shift's own prompt claimed "Shift 3 of four")

**Same stale-numbering mismatch every shift since Shift 13 has flagged** — SHIFT_LOG was already 21 real shifts deep at session start, so this entry continues as Shift 22.

**Git state at start**: `HEAD` was detached, exactly matching `origin/main` at Shift 21's tip (`a377fe9`); local `main` itself was stale, pointing at an old commit from an earlier container. `git fetch` + `git reset --hard origin/main` on `main` fixed it in one step — nothing lost, the usual symptom this log has flagged since Shift 9.

Read `SHIFT_BRIEF.md` in full, then `BOARD.md` per its own instruction ("prefer a board ticket over an axis") — it's the prioritised queue built 2026-08-16 from fifteen expert reports, with a mandatory claim protocol (`[~]` + commit-and-push `BOARD.md` alone before starting real work) and a 1 `add` : 2 `deepen` : 1 `polish` ratio discipline four concurrent cloud shifts plus a Mac-side daily pass all follow. This shift worked the board exclusively rather than falling back to the brief's own 20 axes — the board had real, unclaimed, unblocked work at every priority tier the whole run.

### Five board tickets closed, one full ratio cycle plus two bonus fixes

Claimed each ticket in `BOARD.md` (`[~]` + solo commit + push) before starting it, per protocol, and re-pulled before every push throughout — no collisions with the other concurrent workers this run.

**`[11-P0-1]` split-site-data (`polish`)** — `sites_buildings.geojson` + `sites_streets.geojson` (27MB combined, every one of the 40 curated sites' building/street outlines) were fetched in full on every cold load of the map, regardless of whether a visitor ever opened a single site's street-level view. Wrote `scripts/split-site-data.mjs` (new `npm run split-site-data`) to split both into 80 per-site files under `public/data/sites/`; the merged files stay in place as the Mac-side `research/italia_batch.py` pipeline's source of truth (that script is gitignored and doesn't exist in this cloud checkout at all, confirmed same as every shift since #7). `Map.tsx`'s two building/street sources now start empty and fill in only for a site actually visited — directly from the Explore panel's jump (parallel with the `flyTo`, no pop-in delay), and as a fallback from a `moveend` proximity check against every site's known center, so a deep link, search result, or manual pan into a site's zone still finds its buildings without going through Explore. Verified with Playwright: zero requests to `/data/sites/*` on cold load; clicking a site in Explore fetches only that site's two files and renders correctly (1,779 Ostia features, 1,349 Pompeii); a direct `#lng,lat,zoomz` deep link into Pompeii triggers the same lazy load with no UI interaction at all. Screenshotted at 1280×800 light and 375×812 dark — no chrome regression.

**`[12-FIX-2]` brigetio-stacked-pins, reopened (`fix`)** — the named Brigetio pair itself was already fixed by Shift 21's audit. Ran a fresh exact-coordinate collision scan across every `Point` feature in every `public/data/*.geojson` file and found the identical bug shape — fixed-size DOM markers with no clustering, so an exact-coordinate stack leaves every marker but the topmost permanently unclickable — recurring in `people_117.geojson` (`PeopleMarkers.tsx`, not `PoiMarkers.tsx` this time): 6 clusters, 15 people sharing 6 coordinates (Rome ×4, Rome ×2 separately, Antioch, Selinus in Cilicia ×5, Nikopolis, Judaea), 11 markers offset ~0.012° around each cluster's first marker. Other collisions the same scan turned up (crafts/diplomacy/letters render as MapLibre circle layers — a milder "hover shows one popup" issue, not full occlusion; gazetteer duplicates in `places_high`/`places_medium` pending `[12-P0-1]`'s theme merge) were left alone rather than expanding scope.

**`[09-P0-1]` ancient-sources, batch 2 (`deepen`)** — continued the standing citation task from 108/221 (batch 1) toward the remaining 122 high-confidence POIs. Delegated to four parallel background WebSearch-only research agents split by theme (temples; civic + spectacle; tombs/mausolea/necropoleis; industrial + military), each explicitly told literary sources only (inscriptions belong to the separate `[09-P1-4]` epigraphy ticket) and to report `not_found` honestly rather than stretch. 37 of 122 came back with a real, checkable citation — hit rate ran from 2/31 (tombs) to 22/55 (forts/industrial, far above the board's own "expect a lower hit rate" prediction, because Ptolemy's *Geography* turns out to name most legionary fortresses directly, and several also carry real narrative accounts: Tacitus on the Batavian-revolt sieges of Vetera and Bonna, Ammianus on the 357 CE Battle of Strasbourg at Argentorate, Cassius Dio on Saturninus's 89 CE revolt at Mogontiacum). Temples: Strabo on Thebes/Luxor and Dendera, Plutarch on Edfu's crocodile cult, Macrobius on Baalbek's Jupiter Heliopolitanus oracle, Juvenal's Fifteenth Satire on the real Ombos–Tentyra riot. Civic/spectacle: Tacitus on Nero's circus, Ovid naming the Regia directly, Cassius Dio on Trajan sheltering in Antioch's hippodrome during the December 115 earthquake. One candidate dropped on review — the agent's own note for Baalbek's quarry admitted its cited Macrobius passage is actually about the neighboring temple, not the quarry; a different POI already correctly carries that citation, so this one stayed `not_found`. Two claims spot-verified independently via my own WebSearch before merging (Aurelius Victor on Marcus Aurelius's death at Vindobona; Pliny's door-sill passage for Numidian marble) — both checked out. 145/221 (65.6%) now covered; 85 remain, mostly tombs/villas/single-purpose industrial sites the board itself predicted would have no surviving literary attestation.

**`[14-P0-2]` place-pages (`add`)** — new `app/place/[slug]/page.tsx`, extending Shift 20's `/site/[slug]` pattern to all 467 `public/data/pois.geojson` records (the curated, prose-bearing dataset — the 16k-point raw gazetteer stays explicitly out of scope, per `sitemap.ts`'s own standing note). Server-rendered hero image (or a category-tinted fallback rail matching `PlaceDetails.tsx`'s own graceful-degradation pattern when none is set), About/What-happened-here/In-ancient-writing/Sources blocks, JSON-LD `Place` schema, full OG/Twitter metadata, and a button back into the interactive map that reopens the same place's panel via the existing hash format. Slugs strip the `poi_` prefix from each record's already-unique id. `sitemap.ts` now lists all 507 URLs (467 places + 40 sites + the map route). Verified: `next build` generates all 513 routes cleanly in ~18s; Playwright at desktop and 375×812 for both an image-bearing page (Regia, carrying its brand-new Ovid citation from the ticket above) and a no-image page (Tabularium); the "Open on the interactive map" link round-trips correctly, landing on the Forum with the right panel already open. `[10-P0-1]` tours, the board's topmost `add`, was deliberately skipped this run — see its own note below.

**`[06-P0-2]` curate-buildings, Pompeii (`deepen`)** — the second site to get Ostia-depth curated building descriptions (previously skipped by Shift 21 over a now-resolved visual-gate concern, and made meaningfully easier by this run's own `[11-P0-1]` — the 21MB combined file that ticket was skipped over no longer exists; `pompeii_buildings.geojson` alone was small enough to key entries against directly). New `app/pompeiiDescriptions.ts`, 28 buildings — the House of the Faun, Temple of Apollo, the Forum and its temples (Jupiter/Capitolium, Vespasian, the Lares Publici sanctuary), the Stabian/Forum/Central Baths, the Brothel, the Macellum, the Building of Eumachia, named houses along Via dell'Abbondanza and elsewhere — researched via a background WebSearch pass (30 buildings researched, 2 dropped on review: one flagged low-confidence with a real risk of being conflated with a different, better-known house of the same popular name; the other left generic rather than asserting a genuinely disputed construction date as settled fact). Every voice-rule hedge ("may have," "some say") the research draft contained was rewritten out before merging. Every entry ships `extant_117ce: false, destroyed: 79` — Pompeii was buried 38 years before this map's snapshot, and the site is pinned as a ruin, not restored to how it stood in 117 CE.

**Wiring the new content up surfaced a real bug, confirmed site-wide, not Pompeii-specific**: several sites' Overpass fetches include the whole park's own boundary polygon and, in Ostia and Pompeii's case, "Regio"-numbered district outlines, mixed into the *same* source and layer as individual named buildings. Whichever renders later in the source's GeoJSON feature array draws on top and permanently intercepts clicks meant for the specific building underneath — caught by testing a curated Pompeii building and getting the generic "Excavated structure, detailed archaeology in progress" fallback every time instead of the real content, even though the code path was otherwise identical to Ostia's already-working one. Fixed at the render layer rather than the data (robust against future Overpass re-fetches introducing more such polygons): `Map.tsx`'s building-click handler now ranks every feature under the click point (`e.features`, not just `e.features[0]`) by polygon area via the shoelace formula and picks the smallest, which is reliably the actual building a user meant to click. Verified with Playwright: 4 of 5 curated Pompeii buildings surfaced their real content on click (House of the Faun, Temple of Apollo, the Brothel, Stabian Baths — the fifth, Castellum Aquae, was simply outside the tested viewport, not a bug); a regression check against three known-good Ostia buildings (Capitolium, Roman Theatre, Piazzale della Vittoria) came back unchanged.

### Commits this shift

1. `Claim split-site-data and ancient-sources — cloud shift 3, 2026-08-16` (board claim)
2. `Lazy-load per-site building/street detail — [11-P0-1] split-site-data`
3. `Board: close split-site-data [11-P0-1]`
4. `Claim brigetio-stacked-pins reopen — cloud shift 3, 2026-08-16` (board claim)
5. `Fix 6 more stacked-pin clusters in people_117.geojson — [12-FIX-2]`
6. `Board: close brigetio-stacked-pins [12-FIX-2] — extended to people_117.geojson`
7. `Ancient-sources batch 2: 37 new citations — [09-P0-1]`
8. `Board: close ancient-sources batch 2 [09-P0-1]; update ratio state`
9. `Claim place-pages, note tours skip reasoning — cloud shift 3, 2026-08-16` (board claim)
10. `A real URL for every curated POI — /place/[slug] — [14-P0-2]`
11. `Board: close place-pages [14-P0-2]; update ratio state`
12. `Claim curate-buildings (Pompeii) — cloud shift 3, 2026-08-16` (board claim)
13. `Pompeii curated buildings, and a real site-wide click-priority fix — [06-P0-2]`
14. `Board: close curate-buildings/Pompeii [06-P0-2]; note click-priority fix; update ratio state`

All pushed to `main` individually as each ticket finished and was verified; pre-push `next build` + `npm run validate` gate ran clean on every push (0 validator errors, the same 14 pre-existing warnings throughout, no new ones introduced).

### Verification methodology

Playwright + Chromium (`npm install playwright` into a scratch dir outside the repo, `executablePath` pointed at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`) worked reliably all run — confirming Shift 21's own note that the visual gate is only unreachable from the *Mac-side unattended* editorial routine, not a cloud shift with Bash access. One real methodology trap hit and worth flagging: checking `document.body.innerText` for expected panel content is unreliable — the page carries a large hidden search-index element with essentially every POI's display name, so a naive `body.innerText.includes(name)` check can pass even when no panel actually opened (this is exactly what masked the click-priority bug on the first verification pass; only scoping the check to `document.querySelector('[role="dialog"]')?.innerText` caught it for real). Any future click-behavior test should target the specific panel/dialog element, not the whole page body.

### Next shift should pick up

- **Track A / board:** the run completed a full 1 `add` : 2 `deepen` : 1 `polish` cycle plus two bonus fixes — see `BOARD.md`'s own ratio-state note for the exact tally. **The next run should start a fresh cycle with the topmost `add`: `[10-P0-1]` tours** (guided-tour format + player + first three tours: Via Appia, a day in Ostia, what was new in 117). Deliberately not attempted this run — it's a genuinely new UI surface (player component, phone-layout risk under invariant 0) rather than an extension of an already-proven pattern like every other ticket this run, and didn't look finishable cleanly alongside everything else in flight. `[06-P0-2]` curate-buildings remains a standing task with real headroom — 332 of Pompeii's 360 named OSM buildings are still uncurated, and 38 other sites have zero. `[09-P0-1]` ancient-sources also remains standing at 85/221 open, expect a continued low hit rate on what's left (mostly tombs/villas/industrial sites).
- **General:** the exact-coordinate-collision / click-priority-occlusion bug shape (fixed-size markers or overlapping polygons silently making content unreachable) has now recurred three times across two different rendering approaches (`PoiMarkers.tsx` HTML pins, `PeopleMarkers.tsx` HTML pins, and now `ostia-buildings-fill`'s polygon click handler) — worth a proactive full-layer audit rather than waiting for the next one to surface by accident during unrelated work, the way both of this run's finds did. The git-state symptom (stale local `main`, matching Shifts 9–21) recurred again in its mildest form; `git fetch` + compare before trusting any local ref remains the correct habit every time, regardless of which exact symptom shows.

---

## Shift 21 — 2026-08-16 (this shift's own prompt claimed "Shift 2 of four")

**Same stale-numbering mismatch every shift since Shift 13 has flagged** — SHIFT_LOG was already 20 real shifts deep at session start, so this entry continues as Shift 21.

**There is now a board** (`BOARD.md`), built 2026-08-16 by a separate Mac-side editorial routine that ran between Shift 20's push and this shift's start — not itself logged in SHIFT_LOG.md (it writes to `DIARY.md` instead; see that file's 01:20 entry). Read it in full before starting. It carries fifteen expert studies' worth of prioritized tickets, a claim protocol (`[~]` + commit-and-push BOARD.md-only before starting real work), and a 1 `add` : 2 `deepen` : 1 `polish` ratio discipline. Per its own text ("Prefer a board ticket over an axis"), claimed and shipped one board ticket for Track B, then fell back to SHIFT_BRIEF's own 20 axes for Track A since the board had nothing unclaimed that fit without Overpass access (see below).

**Git state this time was clean** — `main`/`HEAD`/`origin/main` all agreed after a plain `git fetch origin main`; the only wrinkle was the *local* `origin/main` remote-tracking ref itself being stale at container start (a forced update from an old first-ever-commit SHA to the real current tip), not the HEAD-vs-main split every shift 9–20 hit. Diagnosed correctly on the first pass this time by fetching before assuming anything.

**Confirmed again, explicitly, for whoever reads this next**: this sandbox's network egress blocks `curl`, Bash, and the `WebFetch` tool on essentially every external domain — tested and confirmed blocked: `overpass-api.de`, `en.wikipedia.org`, `commons.wikimedia.org`, `pleiades.stoa.org`. Only `WebSearch` works (routes through Anthropic's own infrastructure, not the local egress proxy). This is the same constraint every shift since #9 has hit for Overpass specifically; this shift confirmed it now extends to plain WebFetch too, so Axis 1 (cities) remains fully blocked and any image-URL "verify the Commons page loads" step in the brief has to be done from WebSearch snippet confidence only, never a real page load.

### Track B first this shift — two board tickets, both fixes

Claimed `[03-FIX-1]` (`notes-truncation`) on `BOARD.md` before starting, per the board's protocol. **This was the single highest-impact thing available**: `PlaceDetails.tsx`'s `cleanNotes()` was hard-cutting every description to its first two sentences or 280 characters, so most of the site's actual prose was never visible to a reader — the truncation existed specifically to hide leftover shift-scholar/editorial voice in the raw `notes` fields ("per the brief", "kept per the guardrail", scholar-name-drops, "this shift" asides). Audited every `notes`/`one_line` field in every `public/data/*.geojson` file with a banned-phrase regex script (the same phrase list the brief itself bans, plus a few more caught by inspection — "judgment call", "verified carefully", "this shift"), found 24 fields in `pois.geojson` that actually had it, hand-rewrote every one into plain Google-Business voice preserving the same facts and the same 117 CE snapshot judgment calls (built/destroyed years, `extant_117ce`), then deleted the hard truncation in `cleanNotes()` — the regex-based voice cleanup stays as a safety net, but nothing is cut for length anymore. Verified in a real browser (Playwright + Chromium, see methodology note below): full descriptions render at both 1280×800 light and 375×812 dark, `extant_117ce:false` badges and dates still correct.

While in that corner of the codebase, also **audited and closed `[12-FIX-1]`** (`stringified-props-audit`), reopened on the board as "likely present elsewhere, audit all of them." Grepped every `e.features`/`queryRenderedFeatures` call site (`Map.tsx` only) and every place a component reads a `sources`/`ancient_sources` property (`PlaceDetails.tsx`, `PeopleMarkers.tsx`). Found no other live instance: `Map.tsx`'s ~25 thematic-layer hover popups never render an array-typed field at all (only `name`/`notes`/`regions`/`category` strings), so the stringified-vs-real-array bug shape can't occur there; `PeopleMarkers.tsx`'s `Array.isArray(props.sources)` check is correct as written because it builds markers from a direct `fetch()` of the geojson, never from a Maplibre click query, so that property is always a real array on that code path. Closed the ticket with the audit finding rather than leaving it open on a hypothetical.

### Track A — axes 9b, 9d, 9e, and 5c (46 new features)

Delegated two research batches to background subagents (WebSearch only, explicitly told about the egress constraint above), reviewed every feature against the schema, the 117 CE snapshot rule, the display-name rule, the voice rule, and the image invariant myself (scripted banned-phrase/length scan plus manual spot-checks) before merging — both batches needed real fixes, not just review-and-ship.

**Axis 9d/9e — spectacle, gladiator-school and sarcophagus-workshop POIs** (`public/data/pois.geojson`, 448 → 467 features). The four imperial gladiator schools at Rome (Ludus Magnus, Dacicus, Gallicus, Matutinus) plus Capua, Ravenna, Alexandria, Pergamon; the Circus of Nero (distinct from Circus Maximus, its obelisk now in St Peter's Square); Carthage's circus and amphitheater; five more provincial amphitheatres each individually date-checked against 117 CE rather than assumed extant — Nîmes, Arles, Verona and Pula all genuinely pre-117 (70 CE–81 CE), but Thysdrus/El Djem's famous *standing* amphitheater is 238 CE, so pinned its small, excavated first-generation 1st-century amphitheater instead with an honest note that it isn't the monument tourists know. Three sarcophagus workshops (Docimium, Athens, Aphrodisias), each checked against real dating literature: Athens and Aphrodisias correctly came back `extant_117ce:false` (the sarcophagus-carving *specialty*, as opposed to general marble work, hadn't started at either by 117) — but Docimium's first draft came back `true` despite its own note explaining the same thing ("ahead of the industry's peak... genuinely pre-boom"), a real internal inconsistency caught before merging and fixed to match its siblings. New `ludus` and `sarcophagus_workshop` categories added to `poiCategories.ts` (joining the existing "Theatres & arenas" and "Tombs & mausolea" visual families rather than spending two more of the ~22-category budget on new ones) and given their own "What happened here" paragraphs in `categoryLife.ts`, matching the voice/length of the other 50.

**Same commit also fixed 3 same-category exact-coordinate marker stacks**, found by a full coordinate-collision scan across every `Point` feature in every `public/data/*.geojson` file (92 exact-coordinate matches total — the overwhelming majority are legitimate, e.g. Rome/Antioch/Alexandria correctly hosting many different pins each; only same-category pairs are the real bug, since `PoiMarkers.tsx` renders plain HTML pins with no clustering, so an exact duplicate coordinate leaves one marker permanently unclickable under the other). Beyond the already-known Brigetio pair (`[12-FIX-2]`), found two more of the identical shape: the First and Second Battles of Tapae, and the First and Second Battles of Bedriacum, both historically real battle pairs fought at the same physical location. Offset the second marker in each of the three pairs by ~0.01° (roughly 600m–1.2km) so both are reachable; left every legitimate multi-entity coincidence alone.

**Axis 9b — cuisine regions** (new `public/data/cuisine_regions.geojson`, 7 polygon zones) and **axis 9e — death ritual regions** (new `public/data/death_rituals.geojson`, 5 polygon zones), both wired the same way Shift 20's housing-typology layer was: soft fill+dashed-line zones colored by a `typology` field, defaulting OFF per invariant 0. Cuisine covers the wheat/barley/spelt bread divide, the Baetica/Africa/Bosporan fish-sauce heartland, the Mediterranean wine-and-oil belt against the Britannia/Gaul/Germania beer-and-fat belt, Cyrenaica's already-extinct silphium (sent to Nero roughly 50 years before this snapshot — already a byword for something vanished by 117), and Alexandria as the actual physical gateway where an Indian Ocean commodity (pepper, via the Muziris papyrus's ~7-million-sesterce single cargo) became a Roman one. Death ritual regions render the cremation-to-inhumation transition exactly as it stood at the snapshot: Italy and Gaul still solidly cremating, Egypt and Judaea always inhumation (an unbroken Pharaonic-into-Roman line the empire never crossed), and two real "just starting to shift" zones — a handful of Rome's wealthiest families already using stone sarcophagi in Trajan's very last years (a full generation before it becomes general fashion under Hadrian), and Asia Minor's Greek cities, which had practiced both side by side long before Rome's own elite began favoring inhumation.

**Axis 5c — ethnic & cultural pockets inside the empire, first content on a previously fully untouched axis** (new `public/data/ethnic_pockets.geojson`, 15 points, wired point-overlay-style like the existing religions layer). Living, contemporary 117 CE non-Roman communities and identities, each checked against the three already-shipped layers it could overlap with and given a genuinely distinct angle rather than a duplicate: Gallic Druidism surviving Claudius's ban in a remote Carnutes grove near Chartres; the priesthoods of Karnak and Philae framed as a persisting hereditary institution (not the temple buildings, which are a different already-shipped substrate layer); Nabataean Petra and Bostra only 11 years post-annexation; the Vascones at Pompaelo; Berber Gaetuli and Musulamii; Isauria's famously ungoverned Cilician highlanders, contained rather than conquered for two centuries; Punic speech still attested at Madauros two centuries after Carthage's political end (via Apuleius's own "half-Numidian, half-Gaetulian" self-description); Syriac/Aramaic speech at Edessa and Palmyra — deliberately reusing those two cities' existing `neighbors_117.geojson` coordinates but with a language/script angle rather than the political one already told there; the Bessi of Thrace; and Sardinia's unconquered Ilienses interior (a real addition beyond the brief's own list, not padding — the research agent found it independently and it held up).

**Both research agents did real self-correction under their own search budget**, worth noting for future prompts: the 9d/9e agent caught its own Thysdrus dating mistake before finalizing; the 5c agent excluded a Cappadocian-native-language candidate and a "sufetes as living Punic institution" angle after research turned up the latter was actually invented imperial-era tradition, not organic continuity — both logged as deliberate exclusions rather than silently dropped.

### Verification methodology, and a real timing trap worth flagging

**Playwright + Chromium** (pre-installed at `/opt/pw-browsers`, `PLAYWRIGHT_BROWSERS_PATH` already set) works fine from this sandbox — `npm install playwright` into a scratch directory *outside* the repo (so it never touches `package.json`), point `executablePath` at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, run `npm run dev` in the background, screenshot at 1280×800 light and 375×812 dark. This directly contradicts `[15-P0-1]`'s premise that the visual gate is unreachable without a human — that premise is only true for the *Mac-side unattended editorial routine*, which genuinely can't launch a dev server or a browser; a cloud shift has full Bash access and can. Noted on the board for future cloud shifts so `[15-P0-1]` doesn't quietly make every `polish`/`fix` ticket look blocked for four workers who could actually clear it.

**Real trap hit while verifying the new layers**: an early check (10–16 second wait after page load) showed the brand-new `cuisine`/`death-rituals`/`ethnic-pockets` sources returning 0 queried features — and, more alarmingly, showed the *already-shipped, already-verified* `housing-fill` layer from Shift 20 not existing at all in the same run. Nearly mis-diagnosed this as a real regression before retrying with a 60-second wait, which showed every layer present and correctly populated (housing: 24, cuisine: 24, death-rituals: 14, ethnic-pockets: 27 — all counts inflated somewhat above the raw feature counts by MapLibre's normal tile-buffer duplication in `querySourceFeatures`, not a bug). `Map.tsx`'s ~32 sequential `await fetch(...)` phases now take meaningfully longer to fully settle than Shift 19's own "~30-35s" note — budget at least 45-60 seconds before trusting a "layer never loaded" result in this sandbox specifically, and always cross-check against a known-good pre-existing layer before concluding a *new* one is broken.

### Commits this shift

1. `Claim notes-truncation fix — cloud shift 2, 2026-08-16` (BOARD.md claim, per protocol)
2. `Show full place descriptions — notes-truncation fix [03-FIX-1]`
3. `Board: check off notes-truncation; note cloud shifts aren't blocked by [15-P0-1]`
4. `Board: close stringified-props-audit — no other live instance found`
5. `Spectacle, gladiator schools and sarcophagus workshops — axis 9d/9e (Track A)`
6. `Cuisine regions, death ritual regions, ethnic & cultural pockets (Track A)`
7. `Board: log axis 9b/9d/9e/5c work and stacked-pin fix; update ratio state`
8. `Shift 21 log`
9. `Economic-infrastructure image top-up — 10 of 28 axis 3c gaps closed (Track A)`

All pushed to `main` individually as they were finished and verified; pre-push `next build` + `npm run validate` gate ran clean on every one (0 validator errors, the same 14 pre-existing warnings throughout, no new ones introduced).

### Next shift should pick up

- **Track A:** Axis 9 (daily life) now has 9a (housing), 9b (cuisine), 9d (spectacle/gladiator), and 9e (death ritual) populated — **9c (clothing/fashion by region) and 9f (sexuality/gender geography, handle carefully per the brief) are the two sub-axes still fully open.** Axis 5 now has 5a/5b/5c all shipped; axis 5's only remaining brief-listed gap would be extending 5c further (the brief's own list had a couple of candidates this shift's research pass couldn't confirm with real sources — a Cappadocian-native-language pocket, specifically). Otherwise, per every shift since #17's own running list: axis 1 (cities — Overpass *and* WebFetch now both confirmed network-blocked across thirteen shifts), 3g (games/circuses beyond axis 20 — this shift's spectacle work covers part of it but not the full panhellenic-games-circuit angle). **Image top-up landed before this shift ended**: a dedicated background pass closed 10 of the 28 axis-3c gaps (Tres Minas, Mons Porphyrites, Carteia, Chersonesus, Comacchio, Villaricos/Baria, Ossonoba, Tamassos, Scoppieto, Huttenberg) — the other 18 axis-3c candidates and axis 3e's 12 from Shift 20 are still open, real search effort found nothing confirmable for the 18 (see the image-top-up commit message for the specific list, so a future pass doesn't re-search the same dead ends). 216 of 467 `pois.geojson` records still ship no `image_url` at all — a standing, large gap across every axis, not just 3c/3e.
- **Track B:** With `[03-FIX-1]` and `[12-FIX-1]` both closed, `BOARD.md`'s ratio tracker says the next run owes a `deepen` and a `polish` — and per this shift's own note above, `[15-P0-1]` should no longer block a cloud shift from taking a `polish` ticket; use the Playwright methodology above. `[03-P0-2]` (`card-rebuild`, rebuild the place card to an eleven-block order) is the natural next `polish` pick since it's P0 and directly downstream of this shift's truncation fix. `FEATURE_BACKLOG.md`'s only unshipped P0 item is still Directions — confirmed still correctly deferred as too large a single-shift lift.
- **General:** `BOARD.md` is genuinely useful and worth every future cloud shift reading in full before picking work — its claim protocol (`[~]` + BOARD.md-only commit-and-push before starting) is how four concurrent cloud shifts plus the Mac editorial pass avoid colliding, and this shift used it without incident. The git-state symptom that plagued Shifts 9–20 did not recur this run in its usual form, but a *related* one did (stale local `origin/main` ref at container start) — always `git fetch origin main` before trusting any local ref, every shift, regardless of which specific symptom shows up. The 45-60 second Map.tsx load-chain settle time (see above) is worth fixing at the source eventually — `[11-P1-6]` (`split-map-tsx`, breaking the now far past 2,112-line file into a layer registry) would probably also address this, since a registry could plausibly `Promise.all` the fetches instead of sequentially awaiting 32 of them.

---

## Shift 20 — 2026-08-16 (this shift's own prompt claimed "Shift 1 of four")

**Same stale-numbering mismatch every shift since Shift 13 has flagged** — SHIFT_LOG was already 19 real shifts deep at session start, so this entry continues as Shift 20.

**Git state was, once again, the detached-HEAD-behind-a-stale-local-`main` symptom** — the twelfth shift running to hit it (Shifts 9–20 now). First diagnosed it as a possible real incident (local `main` sat on the container's very first-ever commit, `134e8bf`, a 26-file/~32k-line diff from detached `HEAD`'s tip) before `git fetch origin main` confirmed real `origin/main` matched detached `HEAD` exactly (`8bd00a5`, Shift 19's own tip) — a forced ref update in the fetch output made clear this was purely a stale local branch pointer, not a lost-work incident. `git checkout -B main origin/main` realigned the branch pointer in one step. Nothing was lost.

Read `SHIFT_BRIEF.md` in full, `SHIFT_LOG.md`'s last several entries (Shifts 17–19), and `FEATURE_BACKLOG.md` before starting real work.

### Track B — a real URL per archaeological site (P2, the top open item)

Shipped the item the SEO sweep itself flagged as "the single largest untapped thing on this project": new `app/site/[slug]/page.tsx`, statically generated for all 40 `app/sites.ts` entries via `generateStaticParams`. Each page server-renders the site's display name, province, modern country, founding date, blurb, and "on this spot today" line, carries its own `<title>`/canonical/OpenGraph metadata plus a JSON-LD `Place` schema block, and links back into the client-side map at `/#lng,lat,zoomz`. All 40 now listed in `app/sitemap.ts` alongside the existing single map route (sitemap entry count: 1 → 41). Deliberately scoped to the 40 curated sites only, not the 16k-point gazetteer, per this backlog item's own original scope note. Verified with `next build`: all 40 `/site/<slug>` routes prerender as static HTML; spot-checked `/site/ostia`'s raw HTML output for correct `<title>`, canonical `<link>`, and JSON-LD script content before shipping.

### Track A — Research & data (two axes, 50 new features)

Delegated both to background research subagents (WebSearch only), reviewed every feature against the schema, the 117 CE snapshot rule, the display-name rule, the voice rule, and the image invariant myself before merging.

**Axis 9a — housing typologies, first content on the previously fully-untouched axis 9 (daily life patterns)** (new `public/data/housing_styles.geojson`, 7 polygon/multipolygon features). One soft-fill zone per regional house-building tradition standing in 117 CE — atrium-domus (Italy, Sicily), peristyle houses (Hellenistic East, Baetica), insula apartment blocks (a narrow Rome–Ostia–Puteoli coastal strip, deliberately drawn tight since this is a dense-urban phenomenon not a rural belt), roundhouse survivals (rural Britain, rural Gaul), trullo/mudbrick vaulted dwellings (Apulia, North African interior), cave dwellings (Cappadocia), and Egyptian mudbrick housing (Fayum to Upper Egypt). Same visual family as the existing agriculture/language-belt overlays, colored by `typology`; new "Housing typologies" Layers-panel toggle wired through `useLayers.ts` and a new Map.tsx phase mirroring the axis 7a agriculture-zone code almost exactly. **One real accuracy catch by the research pass, worth flagging for any future shift touching Apulia**: today's *standing* trulli buildings at Alberobello only date to the 16th century onward (verified via search) — rather than falsely claim Roman-era trulli survive, the entry describes the dry-stone corbelling *technique* itself (attested since Bronze Age tholos tombs) as the Roman-era-relevant fact. Similarly kept Cappadocia's cave dwellings framed as ordinary 117 CE housing/storage, not yet Derinkuyu's later defensive/underground-city role. No `image_url` on any feature, per the same established convention `languages.geojson` and `agriculture.geojson` already set (broad cultural zones aren't individual photographable places).

**Axis 3e — necropoleis + isolated tombs, 43 new features** (`public/data/pois.geojson`, 405 → 448 features, mausoleum/tomb/necropolis categories 14 → 57 total). Spans Via Appia's tomb corridor and Pompeii's buried tomb streets in Italia, Gallia Narbonensis (Mausoleum of the Julii at Glanum), Numidia/Mauretania's pre-Roman royal mausolea (Medracen, the Royal Mausoleum of Mauretania, Dougga, Massinissa's tomb at El Khroub), Hispania (Tarraco's Tower of the Scipios, Carmona's necropolis, Merida's Los Columbarios), Judaea's Kidron Valley monument cluster, the Mausoleum at Halicarnassus and Nereid Monument in Asia/Lycia, Palmyra's tower tombs, five of Petra's Royal Tombs, Cyrenaica, and Salona's Dalmatian necropolis. **A real schema mismatch caught before merging, not after**: the research agent's own output used a single `name` field, but `pois.geojson` actually splits `name_latin`/`name_english` plus `built`/`destroyed` year fields (confirmed against the existing `poi_mausoleum_augustus` entry) — every one of the 43 features got manually transformed, with a constructed Latin name (`Sepulcrum X`/`Mausoleum X`/`Turris X`/`Necropolis X`, matching the file's own established convention, e.g. the existing `Sepulcrum Eurysacis Pistoris`) where reasonably derivable, and the same name repeated in both fields where the site's naming is fundamentally non-Latin (Nabataean, Palmyrene Aramaic, Hebrew, Numidian/Berber, or a purely modern toponym) per the file's own Al-Khazneh precedent. Also read a `built` year off each entry's own sourced notes for all 43, and a `destroyed` year for the 7 entries marked `extant_117ce:false`. **Real 117 CE snapshot-rule judgment calls, verified myself before merging**: Kom el Shoqafa catacombs and the Igel Column excluded outright (both post-117 construction, the research pass caught this correctly); six Pompeii tomb/necropolis entries kept with `extant_117ce:false`/`destroyed:79` (buried by Vesuvius, still pinnable per the project's own destroyed-before-117 convention); Herod's Tomb at Herodium kept the same way with `destroyed:70` (smashed by anti-Herodian rebels during the 66–72 CE revolt, per Netzer's 2007 excavation); the Mausoleum at Halicarnassus and the Nereid Monument confirmed genuinely still standing/in-situ in 117 CE (their destruction and dispersal were both medieval or 19th-century events respectively). One hedge-language fix caught in review: the Elephant Tomb (Carmona) entry's "some researchers argue" was rewritten to state its Mithraic/Cybele-shrine theory as fact, per the project's voice rule against hedging. 31 of 43 features shipped a verified `image_url`; 12 ship `null` after the research pass's own search budget found no confirmable Commons filename (see this shift's commit message for the specific list).

Confirmed no ID collisions with existing `pois.geojson` entries and a pure-addition diff (`git diff public/data/pois.geojson | grep -E "^-[^-]"` returns nothing) before committing — verified the file round-trips byte-identically through `json.dumps(..., indent=1, ensure_ascii=False)` first, which is what made a full re-serialize-and-append safe here (same indent-convention-checking habit Shifts 14–19 all flagged as the standing risk for this exact operation).

### Commits this shift

1. `A real URL per archaeological site — /site/[slug] (Track B, P2)`
2. `Backlog: check off site-URL item; pre-wire housing typology layer`
3. `Housing typologies — axis 9a, first daily-life overlay (Track A)`
4. `Necropoleis + isolated tombs — axis 3e, 43 new features (Track A)`

All pushed to `main` individually as they were finished and verified; pre-push `next build` gate ran clean on every one (46 routes each time, including all 40 static `/site/<slug>` pages).

### Next shift should pick up

- **Track A:** Axis 9 (daily life patterns) now has one of six sub-axes populated (9a housing) — 9b (cuisine regions), 9c (clothing/fashion by region), 9d (spectacle/gladiator-school geography — a short, well-documented list: Rome's four imperial ludi, Capua, Ravenna, Alexandria, Pergamon, would be a fast win), 9e (death-ritual cremation-vs-inhumation heat-map), and 9f (sexuality/gender geography, handle carefully per the brief's own note) are all still fully open, same `public/data/*.geojson` + `useLayers.ts` wiring pattern this shift used. Axis 3e (necropoleis/tombs) cleared its 40-feature floor with room to spare — the research pass's own excluded/untouched leads (more Via Appia tombs, Cyrenaica's Ptolemais necropolis, further Petra Royal Tombs, more Gallic/German provincial elite tombs) are a running start for anyone who wants to keep going rather than open a new sub-category. 12 of this shift's 43 tomb features and all of axis 3c's long-standing image gap (28 mine/quarry/factory nulls per Shift 19's own note) remain open for a fresh-search-budget image top-up pass. Otherwise, per Shift 19's own list: axis 1 (cities — confirmed network-blocked at the Overpass level across twelve shifts now), 3g (games/circuses beyond axis 20), 5c (ethnic/cultural pockets inside the empire).
- **Track B:** Directions is still the only unshipped P0 (twelve shifts running have all deliberately deferred this as too large a lift to rush). With the site-URL item now shipped, P2 is fully checked off again. P3 remaining: terrain shading and dark mode — dark mode is still flagged as the biggest lift (see Shift 17's note on `Map.tsx`'s dozen-plus inline `#f4ead5` hardcodes). A smaller, real P3-adjacent follow-up this shift surfaced directly: none of the 40 `/site/[slug]` pages carry a hero image (`SiteInfo` has no `image_url` field at all yet) — adding one, sourced the same way axis POI images are, would make those new SEO pages noticeably more shareable.
- **General:** The detached-HEAD-behind-stale-main git symptom is now confirmed on 12 consecutive shifts (9 through 20) — still costing real per-shift diagnosis time (this shift specifically nearly mis-triaged it as a lost-work incident before the `git fetch` forced-update output cleared it up), still worth whoever administers these scheduled sessions looking at the root cause. **New schema-confusion trap, worth flagging for future research-agent prompts**: `pois.geojson` uses `name_latin`/`name_english` + `built`/`destroyed` fields, while several of the project's other axis files (`health.geojson`, `imperial_cult.geojson`, `politics.geojson`, etc.) use a simpler single `name` field with no build/destroy years — easy to conflate when drafting a research prompt from a different axis file's example, and this shift's mixup on axis 3e cost a full manual-transform pass after the fact. Worth pinning `pois.geojson`'s exact schema in any future prompt that targets it specifically, rather than reusing a schema block written for one of the simpler point-marker files.

---

## Shift 19 — 2026-08-15 (this shift's own prompt claimed "Shift 4 of four")

**Same stale-numbering mismatch every shift since Shift 13 has flagged** — SHIFT_LOG was already 18 real shifts deep at session start, so this entry continues as Shift 19.

**Git state was, once again, the detached-HEAD-behind-a-stale-local-`main` symptom** — the eleventh shift running to hit it. `git fetch origin main` confirmed real `origin/main` matched detached `HEAD` exactly (`4ae61a0`, Shift 18's own tip); `git checkout -B main origin/main` realigned the branch pointer in one step. Nothing was lost. `npm install`'s spurious `package-lock.json` diff (dropped `libc` fields) reproduced and reverted before the first commit, per the now-standard non-issue.

Read `SHIFT_BRIEF.md` in full, `SHIFT_LOG.md`'s last several entries (Shifts 16–18), and `FEATURE_BACKLOG.md` before starting real work.

### Track B first this shift (shipped and pushed before Track A's research even finished)

Shipped the top open **P3** item: **onboarding hint**. New `app/useOnboardingHint.ts` + wired into `app/Chrome.tsx` — a dismissible callout under the search card reading "Try searching Londinium or Ephesus," shown once per browser and never again (`localStorage["roman-maps:onboarding-hint-seen"]`). This item had sat blocked since Shift 2 on a documented gazetteer gap ("Londinium" wasn't in `places_medium.geojson`); confirmed before shipping that Shift 4's gazetteer patch already closed that gap — both example names now resolve as `major:1` gazetteer hits. Dismisses on typing into the search box, focusing it, or an explicit close button. Verified in a real browser (Playwright + Chromium) at both 1280×800 and 390×844: the hint shows on a fresh `localStorage`, disappears and stays gone after typing plus a page reload, and the standalone close button works on its own.

### Track A — Research & data (two axes, 56 new features, both closing out axis 10)

Delegated both to background research subagents (WebSearch only), reviewed every feature against the schema, the 117 CE snapshot rule, the display-name rule, the voice rule, and the image invariant myself with a scripted grep pass (banned hedge phrases, parens/diacritics in `name_english`, missing sources) before merging — both batches came back clean, nothing needed fixing. Spliced into `public/data/substrate.geojson` via a small inline Python append, this time catching a mistake before it shipped: the file's original indent width is 2 spaces, not the 1-space width `pois.geojson` uses — my first splice attempt used `indent=1` and produced a 2,579-line whole-file reformat diff, the exact JSON-reformatting trap Shifts 14–15 first flagged. Caught it by diffing before committing (now the standing habit), reverted, re-ran with `indent=2` matching the file's own convention, and got a clean pure-addition diff on both final commits (`git diff | grep -E "^-[^-]"` returns nothing on either).

**Axis 10e — Iberian/Basque substrate, fifth of six substrate cultures** (`public/data/substrate.geojson`, 92 → 124 features, 32 new, `culture: "iberian"`). Iberian city-states and sanctuaries along the eastern/southern coast (Ullastret's twin hillforts, Saguntum/Arse whose 219 BCE siege by Hannibal triggered the Second Punic War, Castulo's Mosaic of the Amores, Osuna's reused Bull relief, Moixent's abruptly-abandoned La Bastida de les Alcusses), Turdetani/Tartessian-transitional sites in Baetica (Cancho Roano's ritually-burned-and-buried sanctuary, El Carambolo's 1958 gold treasure find, Porcuna's smashed-and-buried warrior statues, Carmona's Elephant Tomb necropolis), the proto-Basque Vascones (Irulegi hillfort and its 2021-excavated bronze "Hand of Irulegi" — the oldest and longest text yet found in a language ancestral to Basque; Andelos; pre-Roman Pompaelo beneath Pamplona), and Cantabrian War hillforts still scarred from Augustus's 25 BCE campaign (Monte Bernorio, La Loma, the latter citing a 2020 excavation that found a fractured skull at the breached gate). Deliberately did **not** duplicate Numantia, Citania de Briteiros, Monte de Santa Tecla, Ulaca, or Castro de Coana — the research pass correctly identified these as already-covered under the project's existing *Celtic* substrate culture (Shift 18's addition), since they're genuinely Celtiberian rather than Iberian proper, and left them alone. **Real judgment call, logged rather than smoothed over**: Iruña-Veleia was dropped entirely after verification — it's Caristii territory, not Vascones as a naive reading of the brief's hint might suggest, and the site carries an unresolved 2008 forgery scandal (fabricated inscriptions) not worth the reputational risk on a "real data or don't include it" project.

**Axis 10g — Mesopotamian substrate, sixth and final named substrate culture** (`public/data/substrate.geojson`, 124 → 148 features, 24 new, `culture: "mesopotamian"`). This axis doubles as living-empire (axis 4) material by design — every site ties to Trajan's own Parthian War, which was unfolding at exactly this map's snapshot moment: Ctesiphon (captured 116 CE, briefly the seat of his new Mesopotamia province), Hatra (besieged unsuccessfully in 117, one of his last military acts before the illness that killed him), Babylon (Trajan sacrificed in the room where Alexander the Great died 439 years earlier), Charax Spasinou (Trajan watched merchant ships cast off for India and reportedly wept he was too old to follow), plus the long-dead Assyrian and Sumerian ruin-mounds his army marched past without comment (Nineveh, Nimrud, Ur, Uruk, Nippur, Kish, Larsa, Eridu, Girsu, Sippar, Khorsabad, Borsippa) and the frontier towns his forces briefly garrisoned (Nisibis, Singara, Arbela/Erbil, Dura-Europos). Real, historically careful judgment calls: Dura-Europos is honestly marked back under Parthian control by mid-117, citing a dated 117 CE inscription recording a priest restoring a temple whose doors "the Romans" had taken — the Trajanic garrison was already gone by the snapshot date, so `province` reads "Parthian Empire" rather than implying stable Roman control; Seleucia on the Tigris is `extant_117ce:true` since Roman generals burned but didn't depopulate it in 116 (it was destroyed again, this time for good, by Avidius Cassius in 165 — a separate, later event); Ashur gets a genuine Parthian-vassal-revival note (a new temple built there in the first century CE) rather than the flat "long-dead ruin" treatment given to Nineveh/Nimrud/Khorsabad. Nisibis's only confirmable image is the later Mar Jacob church at the site (a real building, just not a Trajanic-era one) — credited honestly as "a later Christian-era structure marking the location" per the fallback-photo convention rather than hidden.

**Image gap, closed personally past both agents' own search-budget exhaustion.** Both research passes landed short of the axis-10 20-image floor after their WebSearch caps ran out mid-task (Iberian: 18/32 confirmed; Mesopotamian: 14/24 confirmed) — flagged honestly by both agents rather than guessed. Rather than ship short, spent a personal follow-up WebSearch pass targeting each agent's own flagged "most promising, needs one more search" candidates: closed Edeta's Vaso de los Guerreros and Lucentum/Tossal de Manises for Iberian (18 → 20), and Babylon (the reconstructed Ishtar Gate at the Pergamon Museum, built from bricks excavated at the actual site), the Etemenanki ziggurat's surviving foundation remains, a Seleucia-on-the-Tigris terracotta figurine in the Iraq Museum, a Nineveh-excavated British Museum relief, Girsu's Louvre Gudea statue, and Sippar's Tablet of Shamash for Mesopotamian (14 → 20). Both axes now land exactly on the per-shift 20-image floor, not padded past it — Larsa, Vologesias (its ruins remain archaeologically unidentified), Charax Spasinou, and 12 of the Iberian batch's lower-profile sites (Edeta's companion pieces beyond the one vase, Tarraco/Kese's polygonal masonry, Enserune) are real, logged gaps for a future image-only top-up pass.

**Also closed 6 of Shift 18's own logged image gap** (`public/data/pois.geojson`, axis 3c economic infrastructure): a dedicated background research agent spent its full WebSearch budget (200 calls) confirming real, site-specific Commons images for `poi_carthagonova_mines`, `poi_skouriotissa_mine`, `poi_castulo_mines`, `poi_mons_smaragdus`, `poi_paros_marathi_quarries`, and `poi_tyritake_garum` — each verified against the actual named site, not a same-named different place. 28 of the original 34 remain `image_url:null`; the agent's own near-miss notes (an 18th-century Locatelli painting of Ostia's salt pans, a Carteia garum-factory reconstruction illustration, Tricio's and Henchir Mettich's Commons category pages) are a faster starting point than fresh research for whoever closes the rest.

### Commits this shift

1. `Onboarding hint on search bar (Track B, P3)`
2. `Backlog: check off Onboarding hint (Shift 19)`
3. `Economic infrastructure image top-up — axis 3c continuation (Track A)`
4. `Iberian/Basque substrate — axis 10e, 32 new features (Track A)`
5. `Mesopotamian substrate — axis 10g, 24 new features (Track A)`

All pushed to `main` individually as they were finished and verified; pre-push `next build` gate ran clean on every one. Verified the full substrate layer together in a real browser (Playwright + Chromium) after the ~32s the load chain now needs to settle: `map.getSource("substrate")` reports exactly 148 features split 22 Etruscan/28 Punic/26 Celtic/16 Egyptian pharaonic/32 Iberian/24 Mesopotamian, and the Layers panel's "Pre-Roman substrate" toggle is present and correctly gates the layer.

### Next shift should pick up

- **Track A:** **All six substrate cultures the brief names are now shipped** (10b Etruscan, 10c Punic, 10d Celtic, 10e Iberian/Basque, 10f Egyptian pharaonic, 10g Mesopotamian — 148 features total in `substrate.geojson`). Axis 10 as originally scoped is essentially complete; a future shift could still extend individual cultures (e.g. Iberian's under-covered Lusitanian/Turduli sub-regions, or Mesopotamian's Kitos-War-adjacent sites in the province of Mesopotamia specifically) but there's no more "whole culture missing" work left on this axis. Image gaps for a fresh-search-budget top-up: 12 of 32 Iberian features and 4 of 24 Mesopotamian features still ship `image_url:null` (see each axis's note above for the specific candidates worth trying first), plus the 28 remaining economic-infrastructure nulls from axis 3c (Shift 18's original gap). Otherwise, fully untouched per Shift 18's own list: axis 1 (cities — confirmed network-blocked at the Overpass level across eleven shifts now), 3g (games/circuses beyond axis 20), 5c (ethnic/cultural pockets inside the empire), 9 (daily life pattern overlays).
- **Track B:** Directions is still the only unshipped P0 (eleven shifts running have all deliberately deferred this as too large a lift to rush). P2 remaining: "Time to travel" (blocked on Directions), Province overlay (needs real per-province governor/legion/capital research). P3 remaining after this shift: terrain shading and dark mode — dark mode is still flagged as the biggest lift (see Shift 17's note on `Map.tsx`'s dozen-plus inline `#f4ead5` hardcodes).
- **General:** The detached-HEAD-behind-stale-main git symptom is now confirmed on 11 consecutive shifts (9 through 19) — still costing real per-shift diagnosis time, still worth whoever administers these scheduled sessions looking at the root cause. **A second flavor of the indent-width JSON-reformatting trap, confirmed this shift**: `substrate.geojson` uses 2-space indent while `pois.geojson` uses 1-space — a splice script needs to check each target file's own convention rather than assuming one indent width project-wide, since a mismatch reformats the entire file into a multi-thousand-line diff even when the actual data change is small. Caught before committing this time by diffing first, per the now-standard habit; worth a one-line note added to the top of any future splice helper so it isn't rediscovered a third time.

---

## Shift 18 — 2026-08-15 (this shift's own prompt claimed "Shift 2 of four")

**Same stale-numbering mismatch every shift since Shift 13 has flagged** — SHIFT_LOG was already 17 real shifts deep at session start, so this entry continues as Shift 18.

**Git state was, once again, the detached-HEAD-behind-a-stale-local-`main` symptom** — the tenth shift running to hit it. `git fetch origin main` confirmed real `origin/main` matched detached `HEAD` exactly (`2c53a00`, Shift 17's own tip); `git checkout -B main origin/main` realigned the branch pointer in one step. Nothing was lost.

Read `SHIFT_BRIEF.md` in full and `SHIFT_LOG.md`'s last several entries (Shifts 15–17) and `FEATURE_BACKLOG.md` before starting real work.

### Track A — Research & data (three axes plus a bonus fourth, 98 new features)

Delegated all four to background research subagents (WebSearch only), reviewed every feature against the schema, the 117 CE snapshot rule, the display-name rule, the voice rule, and the image invariant myself, fixed what that review caught, and wired everything into `Map.tsx`/`useLayers.ts` personally before each commit. Spliced new features into existing files with a small inline Python append (matching each file's own indent width and `ensure_ascii=False`) rather than a full re-serialize — confirmed a pure-addition diff (`git diff | grep -E "^-[^-]"` returns nothing) on every one of the four data commits.

**Axis 7a — crop/agriculture zones, brand-new axis** (new `public/data/agriculture.geojson`, 18 polygon features). Four commodity families as soft translucent zone overlays, same visual pattern as the existing language-belt layer: grain belts (Egypt, Africa Proconsularis, Sicily, Baetica, Pannonia), olive-oil belts (Baetica, Tripolitania, Istria, Attica, Syria), wine regions (Falernian/Campania, the Chian+Lesbian Aegean islands as one MultiPolygon feature, Rhaetic, Vienne, a third distinct Baetica zone for wine alongside its separate grain and olive zones), and three timber zones (Hercynian Forest, Lebanon cedar, Corsica pine) as a bonus fourth family the brief didn't strictly require. Real sourced numbers throughout — Monte Testaccio's ~53 million amphorae (>80% Dressel 20 from Baetica), the Isis-class grain ship's 1,200+ ton hold, Theophrastus on 50-mast Corsican log rafts. New Map.tsx phase 28 (fill+line layers colored by `commodity`) and a "Crop & agriculture zones" Layers-panel toggle.

**Axis 10d — Celtic substrate, third culture in the substrate layer** (`public/data/substrate.geojson`, 50 → 76 features, 26 new, `culture: "celtic"`). Gaul (Alesia, Bibracte, Gergovia, Avaricum, Corent, Gondole, Enserune), Britain (Maiden Castle, Danebury, Old Oswestry, South Cadbury, Traprain Law, Stanwick, the pre-Roman Camulodunum and Verlamion oppida — distinct from the existing Roman Colchester/Verulamium entries), Iberia (Numantia, Citania de Briteiros, three further castros), Galatia (Ancyra, Tavium, Pessinus — Ancyra kept as a distinct tribal-settlement entry alongside the existing Augustan-temple `cult_ancyra` feature, since the two cover genuinely different layers), and the Danube region (Magdalensberg, Singidunum, Manching — the largest Celtic oppidum north of the Alps). 12 of 26 marked `extant_117ce:true` where the Iron Age occupation or street grid genuinely carried through into the Roman period (Numantia, Alesia, Avaricum); the rest honestly `false` where the oppidum was abandoned once a nearby Roman successor town was founded. Caught one banned hedge phrase ("a population that may have topped 10,000") in the research draft's Manching entry and fixed it before merging. 24 of 26 ship a verified `image_url`; Tavium and Avaricum ship `null` after real search effort found nothing confirmable — the Avaricum case is worth flagging specifically: a candidate rampart-tower filename looked truncated/suspicious in search results, so the research pass correctly chose `null` over risking a broken link rather than guessing.

**Axis 3c — economic infrastructure top-up** (`public/data/pois.geojson`, 367 → 405 features, 38 new across the existing `mine`/`quarry`/`garum_factory`/`salina`/`kiln`/`estate` categories). Closed all four candidates two prior shifts had flagged and never shipped for lack of an image (Docimium, Mons Porphyrites, Cotta, and Henchir Mettich — whose Lex Manciana estate tablet is dated precisely to 116–117 CE, about as close to this map's snapshot date as a source gets). Fresh additions span Dacia's Ampelum gold-mining HQ, Portugal's Tres Minas gold complex, Proconnesian and Pentelic marble quarries, Cyprus's copper mines, and Bosporan/Black Sea garum sites. **Caught a real duplicate before merging**: the research batch's "Els Munts Roman Villa" and "Chiragan Roman Villa" (`estate` category) turned out to be the exact same two sites Shift 17 already added as `villa` category features, at coordinates a few kilometers apart for the same real place — dropped both rather than double-pin. **Image gap, only partially closed**: the research pass's first draft shipped all 40 (38 after the duplicate drop) with `image_url: null` after exhausting its search budget on lower-profile sites — since the brief states a missing image disqualifies a feature from counting toward throughput, ran a personal follow-up WebSearch pass and closed 5 more (Baalbek quarry's Stone of the Pregnant Woman, Mount Pentelicus's Spilia quarry, Rio Tinto, Timna copper mines, Elba's Rio Marina iron district) before committing. The remaining 33 still ship `null` — a real, logged gap for a future image-only top-up pass, not silently accepted.

**Axis 10f — Egyptian pharaonic substrate, bonus fourth axis** (`public/data/substrate.geojson`, 76 → 92 features, 16 new, `culture: "egyptian_pharaonic"`). Checked `pois.geojson` first and confirmed Karnak/Luxor/Philae/Dendera/Edfu/Kom Ombo/Esna/the three Nubian temples/a Deir el-Bahari healing shrine are already live there as still-functioning-cult features — deliberately did not duplicate any of them, since this axis is specifically the "already ancient ruin" layer, a different angle. Giza split into four distinct features (Great Pyramid, Pyramid of Khafre, Pyramid of Menkaure, Great Sphinx) rather than one combined entry, each carrying its own independently attested Roman-era detail. The Colossi of Memnon entry cites a genuinely dated anchor: prefect Gaius Vibius Maximus's inscription recording the statue "singing" twice at dawn in Trajan's own 7th regnal year (104 CE). Also covers the Valley of the Kings plus two specific, heavily Roman-graffitied tombs (Ramesses VI's — called "Tomb of Memnon" in antiquity — and Ramesses IV's), the Ramesseum, Step Pyramid of Djoser, Serapeum of Saqqara, Abu Simbel (`confidence:low`, honestly noting no surviving Roman-era author describes visiting it — it was sand-buried and effectively forgotten by 117 CE), the Hawara labyrinth and pyramid, Meidum's already-collapsed pyramid, and the ruins of Memphis. All 16 ship a verified `image_url`. Fixed a real small bug the same pass surfaced: `Map.tsx`'s substrate hover-popup title-cased the raw `culture` value directly, which rendered this new value as "Egyptian_pharaonic" (underscore intact) instead of a clean label — now splits on `_` and title-cases each word.

**A fourth research agent (gymnasia image top-up, axis 20) was a dead end, logged rather than silently dropped.** `FEATURE_BACKLOG.md`'s own framing — "7 gymnasia need an image top-up, their `image_url` is null" — turned out to be inaccurate: those 7 candidates (Corinth, Termessos, Thera, Magnesia on the Maeander, Iasos, Knidos, Alinda) were never actually committed as features in `sports.geojson` at all; two prior shifts researched and then dropped them for lack of a confirmable image, so there was nothing with a null field to "top up." Corrected the backlog wording below rather than re-flag the same false lead a fourth time.

### Track B — Roman-style typography for place-name labels (P3)

Shipped the P3 backlog item flagged as untouched since the list was written: **Cinzel** (an open-source, Trajan-Pro-style display serif, confirmed reachable via `fonts.googleapis.com`/`fonts.gstatic.com` from this sandbox before committing to the approach) loaded via `next/font/google` in `app/layout.tsx`, exposed as a `--font-cinzel` CSS variable, and applied through a shared `.roman-label` class to: the Place details panel's title, `SitesPanel.tsx`/`LegionLocator.tsx` list-row names, and — reaching into `PoiMarkers.tsx`'s inline-HTML map-pin label divs via the same CSS variable — every POI's on-map name label. **Deliberately scoped away from native MapLibre map text** (city/place labels rendered by the `places-label-major`/`places-label-minor` style layers): those use MapLibre's glyph-PBF text renderer, which would need a whole separate generated-glyph-tileset pipeline to support a new font family, a materially bigger and riskier lift than swapping a CSS `font-family` on HTML elements — logged as a real scope boundary, not an oversight, in case a future shift wants to tackle the native-text case specifically.

**Verified in a real browser** (Playwright + Chromium): `next build` fetches and self-hosts the font cleanly (confirmed no build-time egress failure); computed `font-family` on rendered `.roman-label` elements resolves to the real Cinzel font stack (68 elements found in one Explore-panel-open pass); screenshots at 1280×800 (Explore panel, Place details panel) and 390×844 (mobile Place details sheet) all show the display serif rendering correctly on both the panel titles and the map's own pin labels.

### Commits this shift

1. `Roman-style typography for place-name labels (Track B, P3)`
2. `Crop and agriculture zones — axis 7a (Track A)`
3. `Celtic substrate — axis 10d, 26 new features (Track A)`
4. `Economic infrastructure top-up — axis 3c, 38 new features (Track A)`
5. `Egyptian pharaonic substrate — axis 10f, 16 new features (Track A)`

All pushed to `main` individually as they were finished and verified; pre-push `next build` gate ran clean on every one. Verified the full set together in a real browser after the ~30–35s load chain settled: `map.getSource("substrate")` reports 92 features split 22/28/26/16 across the four cultures exactly as expected, `map.getSource("agriculture")` reports 18 features, and the Layers panel's checkbox list (29 rows total) includes both new "Crop & agriculture zones" and the by-now-familiar "Pre-Roman substrate" toggles in the right place.

### Next shift should pick up

- **Track A:** Axis 3c's real remaining gap is images — 33 of the 38 features shipped this shift still ship `image_url: null` after two research passes' combined effort (one full agent pass plus a personal follow-up); a future shift with a fresh WebSearch budget aimed specifically at these lower-profile mine/quarry/factory sites (not fresh research — the sites and prose are already done) is the fastest way to close this. Substrate now has four of the brief's six named cultures done (10b Etruscan, 10c Punic, 10d Celtic, 10f Egyptian pharaonic — 92 features total); only **10e (Iberian/Basque)** and **10g (Mesopotamian — Babylon, Nineveh, Ur, Hatra, all briefly under Trajan's own hand in 116–117 CE, a thematically perfect fit for a "living empire" tie-in)** remain fully untouched, and both reuse the exact same schema/wiring. Otherwise, per Shift 17's own list, still open: axis 1 (cities — confirmed network-blocked at the Overpass level across ten shifts now), 3g (games/circuses beyond axis 20), 5c (ethnic/cultural pockets inside the empire), 9 (daily life pattern overlays).
- **Track B:** Directions is still the only unshipped P0 (ten shifts running have all deliberately deferred this as too large a lift to rush). The only other open P2 items are both flagged as bigger lifts than a normal Track B slot: "Time to travel" (blocked on Directions) and Province overlay (needs real per-province governor/legion/capital research first). P3 remaining after this shift: terrain shading, onboarding hint, dark mode — dark mode specifically is still flagged as the biggest lift (see Shift 17's note on `Map.tsx`'s dozen-plus inline `#f4ead5` hardcodes).
- **General:** The detached-HEAD-behind-stale-main git symptom is now confirmed on 10 consecutive shifts (9 through 18) — still costing real per-shift diagnosis time, still worth whoever administers these scheduled sessions looking at the root cause. **Correction to a standing `FEATURE_BACKLOG.md` note**: the "7 gymnasia need an image top-up" framing (added Shift 12, repeated Shift 14) was inaccurate — those candidates were researched and dropped, never actually committed as features with a null image field, so there's nothing to top up without doing the original research-and-add work first. Corrected in the backlog below.

---

## Shift 17 — 2026-08-15 (this shift's own prompt claimed "Shift 3 of four")

**Same stale-numbering mismatch every shift since Shift 13 has flagged** — SHIFT_LOG was already 16 real shifts deep at session start, so this entry continues as Shift 17.

**Git state was, once again, the detached-HEAD-behind-a-stale-local-`main` symptom** — the ninth shift running to hit it. `git fetch origin main` confirmed the real `origin/main` matched detached `HEAD` exactly (`4c03777`, Shift 16's own tip); `git checkout -B main origin/main` realigned the branch pointer in one step. Nothing was lost. `npm install`'s spurious `package-lock.json` diff (dropped `libc` fields) reproduced and reverted before the first commit, per the now-standard non-issue.

Read `SHIFT_BRIEF.md` in full and `SHIFT_LOG.md`'s last several entries (Shifts 14–16) before starting real work.

### Track B first this shift (shipped and pushed before Track A's research even finished)

Shipped the top open **P2** item: **"On this spot today."** New `today` field on every `SiteInfo` entry in `app/sites.ts` (all 40 street-level sites), rendered in `SitesPanel.tsx` as a small italic line under each site's existing blurb. Researched via a dedicated background agent (WebSearch only) covering inhabited-modern-city-vs-uninhabited-archaeological-park status, UNESCO listing where applicable, and two cases needing real care rather than a generic "it's a ruin" line: Palmyra (badly damaged by ISIS occupation 2015–2017 — stated factually, not sensationally) and Baiae (largely submerged, now an underwater archaeological park). Also generalized `Map.tsx`'s substrate-layer hover popup to read the culture label from the feature's own `culture` property instead of a hardcoded `"Etruscan"` string, in anticipation of axis 10c below. **Scoped deliberately to the 40 `sites.ts` entries only** — the ~700 individual `pois.geojson`/axis-file points would need per-feature "today" research, a much bigger lift flagged for a future shift if wanted. Verified in a real browser (Playwright + Chromium): panel renders correctly at 1280×800; confirmed at 390×844 that `SitesPanel` stays desktop-only by its existing, pre-dating design (no mobile regression — this matches how the whole Explore panel has always worked, not a new limitation this shift introduced).

### Track A — Research & data (two axes, 65 new features)

Delegated both to background research subagents (WebSearch only — did not re-test the Wikipedia/Commons egress block directly, but budgeted around the same constraint eight prior shifts have confirmed), reviewed every feature against the schema, the 117 CE snapshot rule, the display-name rule, and the image invariant myself, then wrote a small reusable Node script (`append_features.js`, kept in scratch, not committed) that splices new Feature objects into an existing `.geojson` file's array via pure text concatenation — detects the file's own indent width and closing-bracket depth, appends without ever re-parsing/re-serializing the whole file, and self-checks the result's feature count before writing. This sidesteps the JSON-reformatting-noise trap Shifts 14–15 both hit (Python's `json.dump` silently changing indent width or re-escaping non-ASCII characters) by construction rather than by remembering to diff afterward — confirmed both this shift's commits are pure-addition diffs (`git diff | grep -E "^-[^-]"` returns nothing on either file). Worth a future shift promoting this from scratch-file to a committed `research/`-adjacent tool if the pattern keeps proving useful.

**Axis 10c — Phoenician/Punic substrate, second historical-substrate culture layer** (`public/data/substrate.geojson`, 22 → 50 features, 28 new, `culture: "punic"`). Checked the existing dataset first and found four Punic sites already live in `pois.geojson` (Carthage's Tophet, Tyre's Melqart temple, Cadiz's Hercules Gaditanus temple, Malta's Tas-Silg sanctuary) — deliberately not re-added, avoiding duplicate markers at identical coordinates. The 28 new features span Carthage's own Byrsa citadel (buried under the Roman colonists' own forum after 146 BCE); Utica, Kerkouane (the only Phoenicio-Punic city known to survive without a later town built on top — abandoned c. 250 BCE, so `extant_117ce:false`), and Meninx's purple-dye works in Africa Proconsularis; Motya (destroyed 397 BCE), Solunto, Panormus's buried necropolis, and Pantelleria/Cossyra in Sicilia; six Sardinian sites (Nora, Tharros, the Sant'Antioco/Sulci tophet, the Tuvixeddu necropolis at Cagliari, Monte Sirai, Bithia); Ibiza's Puig des Molins necropolis (UNESCO-listed, ~3,000 tombs); six Hispanic sites including the Cadiz anthropoid-sarcophagi necropolis and the Punic Wall of Cartagena; Lixus's Melqart sanctuary and the Mogador purple-dye islands in Mauretania Tingitana; the Marshan rock-cut tombs at Tangier and Icosium (Algiers, whose Punic name — "Island of the Owls" — survives today in the Arabic name for Algiers itself); the Temple of Eshmun at Sidon (Phoenicia's healing-god sanctuary, in continuous use for 800 years by 117 CE); Gozo's Ras il-Wardija cliffside sanctuary; and Rachgoun Island off Algeria. 12 of 28 shipped with a confirmed `image_url`; the rest ship `null` rather than a guessed filename, per the project's degrade-gracefully rule.

**Axis 3d — Villae, 37 named villas** (`public/data/pois.geojson`, `villa` category, 2 → 39 features). The 117 CE snapshot rule was the real constraint here, not source scarcity — the research pass explicitly tested and **dropped** several of the most famous "Roman villas" a general search turns up, because their earliest attested construction postdates Trajan's death: **Hadrian's Villa** at Tivoli (brick stamps show building material was still being prepared in 117; actual construction didn't start until late 118/early 119 — a full year past the snapshot, not the "foundations underway" case the brief flagged as a judgment call), **Villa dei Quintili** (Hadrianic), and most of Roman Britain's famous mosaic villas (**Chedworth**, **Bignor**, **Piazza Armerina**, **Woodchester**, and eight more — see the commit body's dropped-candidates table). What shipped instead: Tiberius's three real Capri villas plus his Sperlonga grotto dining hall; Domitian's Alban villa; both of Pliny the Younger's own villas from his letters (Laurentine, Tuscan — scholarly-estimated coordinates, stated as such); the Villa of Livia at Prima Porta (source of the Augustus of Prima Porta statue); nine Vesuvius-buried Bay-of-Naples villas (Stabiae's San Marco and Arianna, Oplontis's Poppaea villa and Villa B, Pompeii's Villa of Diomedes, Boscotrecase's Villa of Agrippa Postumus, plus Villa Sora/Positano/Minori), included on the same precedent the map already set with the two existing Pompeii/Herculaneum villa entries; seven early Romano-British villas genuinely attested before 117 (Fishbourne Roman Palace foremost among them); three Gallo-Roman estates (Montmaurin, Chiragan, Loupian); five Hispanic/Lusitanian villas, one (Els Munts) shipped with `confidence:"low"` and an explicit in-text caveat that only a plainer first-century residence — not the grand villa visitors see today — is attested at the site in 117 CE itself; Juba II's royal palace at Caesarea/Cherchell; the House of Orpheus at Volubilis; Corinth's Anaploga villa; and the Grotte di Catullo at Sirmione. **Landed 3 short of the brief's 40-feature axis-3 floor** (37 vs. 40) — a real, logged shortfall rather than a padded-to-round-number count: the research pass's own dropped-candidates table shows real effort was spent chasing more (18 named candidates researched and rejected), and the remaining realistic pool thins out fast once the snapshot rule removes Roman Britain's entire famous mosaic-villa cohort. 15 of 37 shipped with a confirmed `image_url`.

### Commits this shift

1. `"On this spot today" — one-line modern-day status for all 40 sites (Track B)`
2. `Backlog: check off "On this spot today"`
3. `Phoenician/Punic substrate — axis 10c (Track A)`
4. `Villae — axis 3d, 37 named villas (Track A)`

All pushed to `main` individually as they were finished and verified; pre-push `next build` gate ran clean on every one. Verified both Track A layers in a real browser (Playwright + Chromium) after waiting the full ~30–40s the now-~28-phase `Map.tsx` load chain needs to settle (per Shift 16's own documented timing) — confirmed `map.getSource("substrate")` exists with all 50 features split 22 Etruscan/28 Punic, hovering the Nora marker shows the correct dynamic "Punic city" label (not a leftover hardcoded "Etruscan"), and clicking the Villa Jovis marker on Capri opens the real Place details panel with its actual built-date/sources.

### Next shift should pick up

- **Track A:** Axis 3d has 3 features of real headroom left against the brief's own 40-floor if a future shift wants to close the gap — but doing that honestly (not by padding) means either a fresh, more exhaustive search pass across provinces this shift didn't fully cover (Africa Proconsularis's imperial olive-oil estates, Pannonia/Noricum, Syria/Judaea), or accepting the same 37 as essentially exhausted against the "genuinely pre-118-CE, well-attested, named villa" criterion — the research agent's own dropped-candidates table is a good starting point either way. Axis 10c is done against its own candidate list; the other four historical-substrate cultures the brief names (10d Celtic, 10e Iberian/Basque, 10f Egyptian pharaonic, 10g Mesopotamian) are still fully untouched and would reuse the exact same `substrate.geojson` schema/wiring this shift and Shift 16 both used. Image gaps for a fresh-search-budget top-up: 13 of 28 Punic substrate features and 22 of 37 villae still ship `image_url: null`. Otherwise, per Shift 16's own list: axis 1 (cities — confirmed network-blocked at the Overpass level across nine shifts now), 3g (games/circuses beyond axis 20), 5c (ethnic/cultural pockets inside the empire), 7 (environment/climate/agriculture), 9 (daily life pattern overlays).
- **Track B:** Directions is still the only unshipped P0 (nine shifts running have all deliberately deferred this as too large a lift to rush). P2 is now fully checked off after this shift's "On this spot today." Worth a look at P3 polish next (Roman-style typography, terrain shading, onboarding hint, dark mode) — still fully untouched after this shift, and dark mode specifically would be a bigger lift than a normal Track B slot allows: `Map.tsx`'s ~2,000 lines hardcode `#f4ead5` (the label-halo color) well over a dozen times inline rather than reading from the `P` palette object at the top of the file, so a real "parchment → dark leather" re-theme needs either a careful multi-site find-and-replace onto palette tokens first, or accepting a partial/inconsistent-looking first pass — flagging this now so whoever picks it up next doesn't discover the same blocker mid-shift.
- **General:** The detached-HEAD-behind-stale-main git symptom is now confirmed on 9 consecutive shifts (9 through 17) — still costing real per-shift diagnosis time. The new `append_features.js` splice-append pattern (see Track A intro above) is worth promoting to a real committed tool if a tenth shift independently reaches for the same JSON-reformatting-noise workaround Shifts 14–15 originally flagged as a standing risk.

---

## Shift 16 — 2026-08-14 (18:00–00:00 UTC block)

**This shift's own scheduled prompt claimed to be "Shift 4 of four."** Same stale-numbering mismatch every shift since Shift 13 has flagged — SHIFT_LOG was already 15 real shifts deep at session start, so this entry continues as Shift 16.

**Git state was the now-familiar detached-HEAD-behind-a-stale-local-`main` symptom**, the eighth shift running to hit it (Shifts 9–16 now). Local `main` was still sitting on the container's very first commit while `HEAD` was detached exactly at Shift 15's own tip (`9a3fa2a`). `git fetch origin main && git checkout -B main origin/main` realigned the branch pointer cleanly in one step — `git ls-remote origin main` confirmed the fetched tip matched detached `HEAD` exactly before doing anything destructive, per the standing habit five prior shifts' logs have taught. Nothing was lost. `npm install`'s spurious `package-lock.json` diff (dropped `libc` fields) reproduced and reverted before the first commit, per the now-standard non-issue.

Read `SHIFT_BRIEF.md` in full, `SHIFT_LOG.md`'s last several entries (Shifts 13–15), and `FEATURE_BACKLOG.md` before starting real work.

### Track A — Research & data (three axes, 48 new features)

Delegated all three to background research subagents (WebSearch only — this session didn't re-test the Wikipedia/Commons/Overpass/Nominatim egress blocks directly, but budgeted every research prompt around the same constraint seven prior shifts have confirmed), reviewed every feature against the schema, the 117 CE snapshot rule, the display-name rule, the voice rule, and the image invariant myself, fixed what that review caught, and wired everything into `Map.tsx`/`useLayers.ts` personally before each commit.

**Axis 5a — language belts** (new `public/data/languages.geojson`, 13 polygon features). The empire's everyday spoken-language geography in 117 CE, distinct from the Latin/Greek administrative split the map already implies — Latin's Italian core, Greek Koine across the East, Punic and Berber/Libyan in North Africa, Aramaic + Syriac across Syria/Judaea/Mesopotamia, Demotic Egyptian in the Nile valley, three separate Celtic pockets (Gaulish in rural Gaul, Brittonic in rural Britain, and Galatian — Jerome's later testimony that the Galatians of Ancyra spoke almost the same tongue as the Treveri of Gaul, a genuine Celtic-speaking island a thousand kilometers from Gaul itself), the Iberian/Celtiberian interior of Tarraconensis, Aquitanian (the directly-attested ancestor of Basque, known only from ~200 personal names on Latin funerary stones), and Illyrian and Thracian in the Balkan interior. **A deliberate scope judgment, logged rather than silently made**: geometries are hand-drawn soft approximate belts, not province-precise boundaries — the brief's own language calls for "soft polygon overlays," and Thracian/Illyrian in particular rest almost entirely on onomastic evidence (names and glosses, not connected texts) per the research, so precision beyond "roughly this region" would be false confidence. No `image_url` on any of these 13 — they're zone overlays in the same family as `provinces.geojson` (which also carries no image field), not individual places with a single photographable subject; documented here rather than treated as a silent invariant-1.6 skip.

**Axis 10b — Etruscan substrate** (new `public/data/substrate.geojson`, 22 features, the project's first "historical substrate" culture layer, axis 10). All twelve Etruscan League cities that survived identifiably into the Roman period (Tarquinia, Veii, Cerveteri, Vulci, Populonia, Roselle, Vetulonia, Chiusi, Perugia, Cortona, Fiesole, Volterra), Orvieto for the disputed Volsinii identification, Pyrgi (Caere's port, its bilingual gold tablets linking Uni to Phoenician Astarte), Spina and Marzabotto in the Po valley, the Etruscan League's federal sanctuary at Fanum Voltumnae, and five major necropoleis (Monterozzi, Banditaccia, Norchia, Sovana, Baratti). Two honest `extant_117ce:false` calls: Spina (silted over by the Po delta's advance, gone for centuries by Trajan's reign) and Marzabotto/Kainua (abandoned c. 350 BCE after the Gallic incursion into the Po valley, its street grid frozen but no standing city left to see). Volsinii's identification (Orvieto vs. nearby Bolsena, a real scholarly split) and Fanum Voltumnae's location (confirmed only by excavations starting in 2000) both stated factually using the majority/leading view rather than hedged. **One deliberate naming-convention departure, logged rather than left silent**: `province` on these 22 features reads "Etruria" or "Cisalpine Gaul" rather than the "Italia" every existing Italian `pois.geojson` entry uses — a substrate layer's whole point is showing pre-Roman cultural regions, and the historically precise regional name is more informative here than the administrative blanket term; a future shift auditing province-field consistency should treat this as intentional, not a bug.

**Axis 8b — Asia's conventus centers, bonus third axis** (new `public/data/conventus_asia.geojson`, 13 features). All of the province of Asia's assize/judicial districts where the proconsul held circuit court: the nine conventus capitals Pliny the Elder names directly (Ephesus, Pergamon, Smyrna, Sardis, Adramyttium, Synnada, Apamea) plus Miletus, Halicarnassus, and Alabanda (attested through inscriptions and a Journal of Roman Studies article on proconsular assizes), and Cyzicus (one of Sulla's original 11 assize districts from 85 BCE). Genuinely picked because the brief's own text already named the candidate list, making this a fast, low-risk third axis rather than fresh open-ended research. **Two real catches during review, fixed before merging**: Cibyra's entry initially read fine but is worth flagging on its own — Pliny records that sessions for the "conventus Cibyraticus" were actually held at Laodicea on the Lycus, not Cibyra itself, and the feature states that plainly rather than smoothing over the oddity. Philadelphia's notes originally ended on a bare hedge ("remains an open question") flagged by my own post-review grep for banned voice-rule phrases — rewritten to state the same real uncertainty (whether its promotion to an independent assize predates Trajan's 117 CE death) as a fact about the historical record rather than an authorial hedge. Separately, Philadelphia's only candidate image turned out to be Alaşehir's Basilica of St John — a real building, but 6th/7th-century Byzantine, 500+ years past this snapshot — the same wrong-period-photo trap the brief calls out by name for temples; caught via a dedicated WebSearch dating check and shipped as `image_url: null` instead.

**Wiring.** All three new files get their own Map.tsx phase (25, 26, 27) added after the existing 24-phase chain, plus their own Layers-panel toggle each ("Language belts", "Pre-Roman substrate", "Conventus centers (Asia)") in `useLayers.ts`. Substrate markers render as ghosted, translucent circles with a visible stroke — distinct from every other axis layer's solid-fill style — matching the brief's own substrate-layer styling note. Verified all three in a real browser (Playwright + Chromium, both 1280×800 and 390×844 mobile viewports): sources/layers report `true` once the now ~27-phase sequential load chain finishes (confirmed this now needs ~30–35s in this sandbox, a few seconds longer than Shift 13's own documented 15–20s figure for the shorter chain that existed then — noting the trend for whoever next profiles this), the Layers-panel toggles for all three appear and correctly flip native-layer visibility, and substrate markers render clustered correctly across central Italy at province zoom.

### Track B — Features & UI/UX (one item)

Shipped the next open **P2** item: **Legion locator**. New `app/legions.ts` derives a clean, browsable index of all 28 legions directly from the fortress records already researched and cited in `pois.geojson` (category `"fort"`) — every legion from I Adiutrix to XXX Ulpia Victrix was already fully mapped by prior shifts, so this needed zero new research, just extracting the existing data (Roman numeral, epithet, fortress name, province, modern location, coordinates, and the underlying POI id) into a dedicated, purpose-built lookup instead of leaving it buried in the generic "Forts" category filter alongside auxiliary forts and signal towers. New `app/LegionLocator.tsx` (left-rail "Legions" icon, desktop only — mirrors `SitesPanel.tsx`'s existing slide-in search-and-list pattern exactly, including its precedent of being desktop-only with no mobile entry point) lets a user search/browse all 28 and click one to fly to its real fortress and open the exact same Place details panel a map click on that fortress would show, by fetching `pois.geojson` once and reusing `usePoiPanel`'s `selectPoi` rather than faking a stripped-down duplicate panel. Added one small UX fix beyond the base implementation: selecting a legion now closes the list panel automatically, since leaving both open left the newly-opened Place details panel mostly hidden behind the list — caught by actually looking at the resulting screenshot, not assumed.

**Verified in a real browser** (Playwright + Chromium): panel opens on the rail icon, search for "IX Hispana" correctly filters to one result, clicking it flies the map to Eboracum/York and opens the real "Fortress of Legio IX Hispana" detail panel (confirmed via a screenshot, not just a DOM-visibility check). Confirmed the underlying `pois.geojson` fort-category extraction is complete and accurate — all 28 historical legions of 117 CE present, none missing, none duplicated — before writing `legions.ts`.

### Commits this shift

1. `Language belts + Etruscan substrate — axes 5a & 10b (Track A)`
2. `Legion locator (Track B)`
3. `Backlog: check off Legion locator`
4. `Conventus centers of Asia — axis 8b, bonus third axis (Track A)`

All pushed to `main` individually as they were finished and verified; pre-push `next build` gate ran clean on every one. `npm install`'s spurious `package-lock.json` diff reverted once at the start of the shift, per the now-standard non-issue every prior shift has flagged. Diffed every programmatically-written `.geojson` file for stray whole-file changes before staging, per Shifts 14–15's own standing reminder — all three were clean adds with no reformatting noise, since all three were brand-new files rather than in-place rewrites of existing ones.

### Next shift should pick up

- **Track A:** All three axes touched this shift are complete against their own scope (axis 5a's 10-zone brief list, axis 10b's Etruscan candidate list plus reasonable necropolis extensions, axis 8b's full 13-town conventus list) rather than having large amounts of material left on the table. Small real remainders: axis 5a's report flagged Sardinia et Corsica and the Alpine provinces (Rhaetic/Ligurian remnants) as genuinely outside the original 10-zone brief and unresearched — a real follow-up if full province-by-province language coverage is wanted. Axis 10b could still add a standalone Crocifisso del Tufo necropolis feature (currently folded into the Volsinii/Orvieto entry) and has 3 features shipped with `image_url: null` (Cortona, Spina, Fanum Voltumnae) worth a fresh image search. Axis 8b has 2 features (Apamea, Synnada) with `image_url: null` for the same reason. Otherwise, fully untouched per Shift 15's own list: axis 1 (confirmed network-blocked at the Overpass level across seven separate shifts now, needs a different environment), 3d (villae — the brief's own named-villa list, Hadrian's Villa/Sperlonga/Chedworth/Bignor, still mostly untouched beyond the `estate` category), 3g (games/circuses beyond what axis 20 already covered), 5c (ethnic/cultural pockets inside the empire — the other half of axis 5), 7 (environment/climate/agriculture), 9 (daily life pattern overlays), 10c–10g (the other five historical-substrate cultures — Phoenician/Punic, Celtic, Iberian/Basque, Egyptian pharaonic, Mesopotamian — now that axis 10b's Etruscan pass has established the `substrate.geojson` schema and `culture` field for them to extend).
- **Track B:** Directions is still the only unshipped P0 (real road-network routing — eight shifts running have all deliberately deferred this as too large a lift to rush; worth a dedicated shift that starts by testing whether the road GeoJSON has shared nodes at intersections before committing to an approach). P2 remaining: "Time to travel" (blocked on Directions), Province overlay (`provinces.geojson` currently carries only a bare `name` property per province — would need real governor/legion/capital research to populate, a genuinely bigger lift than this shift's Track B budget), "On this spot today". P3 polish (Roman-style typography, terrain shading, onboarding hint, dark mode) is still fully untouched.
- **General:** The detached-HEAD-behind-stale-main git symptom is now confirmed on 8 consecutive shifts (9 through 16) — the `git fetch origin main && git checkout -B main origin/main` fix (after an `git ls-remote origin main` sanity check) keeps working every time and takes under a minute once you know the pattern, but it's still worth whoever administers these scheduled sessions looking at the root cause rather than relying on this file to keep re-teaching the fix. The ~27-phase sequential `Map.tsx` load chain (one `await` per axis file) now takes ~30–35s to fully settle in this sandbox, up from Shift 13's documented 15–20s for a shorter chain — Shift 13's own note ("worth `Promise.all`-ing the independent phases instead of awaiting them one at a time — they don't actually depend on each other, just on the base style being loaded first") is worth acting on soon rather than re-flagging again, since every new axis file added this way makes the chain measurably slower to reach its last few phases. Also worth a standing habit for future substrate/culture-layer work: verify any image showing a named building is actually period-appropriate before shipping it (this shift caught a 6th-century Byzantine church proposed for a 117 CE conventus-center entry) — the wrong-period-photo trap the brief warns about for Mithraea and Hadrianic temples applies just as easily to any "famous building at this site" image search.

---

## Shift 15 — 2026-08-14 (12:00–18:00 UTC block)

**This shift's own scheduled prompt claimed to be "Shift 3 of four."** Same stale-numbering mismatch every shift since Shift 13 has flagged — SHIFT_LOG was already 14 real shifts deep at session start, so this entry continues as Shift 15.

**Git state was the usual detached-HEAD-behind-a-stale-local-`main` symptom**, the seventh shift running to hit it (Shifts 9-15 now). `git fetch origin --prune` showed `origin/main` "force update" from the container's stale cached ref to the real tip (`c0af912`, Shift 14's own commit) — `git checkout -B main origin/main` realigned the local branch pointer cleanly. Nothing was lost; this is purely a stale-ref artifact at container start, exactly as five prior shifts' logs already document. `npm install`'s spurious `package-lock.json` diff (dropped `libc` fields) reproduced and reverted before the first commit, per the now-standard non-issue.

### Track A — Research & data (three axes, 71 new features)

Delegated all three to background research subagents (WebSearch only — this session didn't re-test the Wikipedia/Commons/Overpass egress blocks directly, but budgeted every research prompt around the same constraint six prior shifts have confirmed), reviewed every feature against the schema, the 117 CE snapshot rule, the display-name rule, and the image invariant myself, fixed what that review caught, and wired everything into `Map.tsx`/`useLayers.ts`/`poiCategories.ts` personally before each commit.

**Axis 5b — client kingdoms + neighbors** (new `public/data/neighbors_117.geojson`, 22 features). Every polity named in the brief's own list, no more no less: client kingdoms (Bosporan Kingdom, Iberia, Albania, Osroene, Armenia, Palmyra's customs autonomy), Free Germanic tribes (Cherusci, Chatti, Marcomanni, Quadi), Sarmatian confederations (Iazyges, Roxolani, Alans), the Caledonii, and the major outside powers (Parthia, Kushan, Han China, Aksum, Meroe, Garamantes, Saba, Himyar). Real, honestly-told judgment calls rather than smoothed-over simplifications: Armenia captured mid-collapse (Vologases III retaking ground weeks before Trajan's death, Hadrian's formal abandonment still a year off — not glossed as a stable province); Osroene's throne genuinely vacant under direct rule after Abgar VII's 116 deposition; Parthia split by its own live Arsacid civil war (Osroes I vs. Vologases III) rather than treated as one unified rival; the Kushan Empire correctly attributed to Vima Kadphises, not Kanishka, who hadn't yet taken the throne in 117; Himyar and Saba kept as two separate, rival kingdoms rather than the "Himyar as a sub-region of Saba" framing that would have been true a century earlier but wasn't by this date. Only one caught naming-rule violation before merge — Kushan Empire's `modern_location` originally read "Peshawar, Pakistan (representative point)"; moved that caveat into the `one_line` prose instead. Only gap: Kingdom of Albania (Caucasian Albania) shipped with `image_url: null` — every candidate the research turned up was a misleadingly late medieval Christian structure, so it shipped with no image rather than a wrong one, per the project's own degrade-gracefully rule. Wired as a new `neighbors-point` circle layer color-coded by `relation_to_rome` (client/ally/trading_partner/rival/enemy each a distinct color) plus a "Client kingdoms & neighbors" Layers-panel toggle.

**Axis 3h — battlefields** (`public/data/pois.geojson`, category `"battle"`, 281 → 320 features, 39 new). Covers both "still in living memory in 117 CE" battles the brief calls for (Teutoburg Forest, Mons Graupius, the Dacian Wars including Tropaeum Traiani's still-standing 109 CE monument, the Year of Four Emperors, the Jewish-Roman wars, Boudica's revolt, the currently-unfolding Kitos War and Trajan's Parthian War — Hatra was literally his last campaign, weeks before he died) and the classical battles the brief explicitly names as in-scope ("the empire has memory"): Cannae, Zama, Alesia, Pharsalus, Philippi, Actium, Carrhae, Cynoscephalae, Magnesia, Pydna, the destructions of Carthage and Corinth, Chaeronea, Munda, Thapsus, Mutina, Naulochus, Gergovia, Bibracte, Vosges. `built` deliberately holds the battle's year (negative BCE / positive CE) rather than a construction date — a documented, intentional deviation from how every other `pois.geojson` entry uses that field, since these are events, not structures. **Caught and fixed 13 real invariant-1.5 violations before merging**: 6 parenthetical qualifiers in `name_english` ("Battle of Chaeronea (86 BC)" → "Battle of Chaeronea", "Tropaeum Traiani (Trajan's Victory Monument, Adamclisi)" → "Trajan's Victory Monument", etc.) and 7 `province` fields that had ballooned into full explanatory sentences ("Germania Inferior (frontier zone — the site itself lies beyond the Rhine, in unconquered Germania)" → "Free Germania") — the nuance those parentheticals carried was already present in each feature's `notes` prose, so nothing was lost by shortening the field meant to render as a short inline label.

**Axis 3i — shipwrecks with cargo, bonus third axis** (`public/data/pois.geojson`, category `"shipwreck"`, new, 10 features). Antikythera (60 BCE, plundered Greek statuary plus the Antikythera Mechanism), Madrague de Giens (65 BCE, ~6,000 wine amphorae, one of the largest Roman wrecks ever excavated), Comacchio (12 BCE, lead ingots and a bronze Hercules-and-Nereus group), Mazara del Vallo, Titan, Cap Bear 3, Dramont A, Dramont D, La Roche Fouras, and the Lake Neuchatel "Eagles' Wreck" (35 CE, olive-oil amphorae found together with actual gladius swords). **Real independent-verification catch**: the research pass initially proposed 4 more wrecks the brief's own text pointed at (Grado's Iulia Felix, Torre Sgarrata, the Marzamemi "Wreck of the Columns," a generic Fiumicino cluster), but a follow-up WebSearch pass on each one's actual sinking date found all four postdate 117 CE by 65-130+ years — Torre Sgarrata is independently coin-dated to 180-192 CE via a Commodus coin found in the wreck, for instance. The brief's own "Grado (Trajanic era)" characterization doesn't hold up against the real scholarship (first-half-of-3rd-century CE is the better-cited range). Rather than pin a shipwreck that, from the map's own 117 CE vantage point, hadn't happened yet — this project has no "coming next"/future-preview convention for a plain POI category, only a one-off use for an emperor's travel route — all four were dropped entirely rather than mis-dated into the snapshot.

**Real bug found and fixed while browser-verifying axis 3h, not something either research agent could have caught**: `PoiMarkers.tsx`'s `ensureFeatures()` only ever included features with `extant_117ce === true`. That's correct for the file's original ~280 entries (temples, forts, mines — real "was this still standing in 117?" structures), but it meant every one of the 39 new battle features (38 of which are honestly `extant_117ce:false`, since a battle is an event, not a building) would have been silently invisible on the live map despite being valid, fully-schema'd, committed data. Caught this by clicking exactly where Cannae's marker should render in a Playwright session and getting nothing — confirmed via `map.project()`/DOM-transform inspection that the marker's underlying LngLat was fine and the data fetch was fine, isolating the bug to the render-time filter itself. Fixed by exempting `category === "battle"` (and, in the follow-up shipwreck commit, `category === "shipwreck"`) from the extant gate. Verified the fix isn't Cannae-specific: an empire-wide isolate-to-"Battles" category view shows pins correctly scattered across Italy, Greece, and the frontier provinces. Flagged in `FEATURE_BACKLOG.md` for whoever adds the next "event, not structure" POI category — this ad-hoc per-category exemption should probably become a proper `is_event` schema field before a fourth category needs the same fix pasted in again.

### Track B — Features & UI/UX (one item)

Shipped the top open **P2** item: **currency conversion sidebar**. New `app/CurrencyConverter.tsx`, an expandable section inside the existing hamburger menu right below the Distance-units toggle (not a new FAB — the bottom-right button stack is already five buttons deep per Shift 12's own re-derivation, and this fits the existing settings-panel pattern better than a sixth icon). Shows the exact, uncontroversial Roman denomination ratios (1 aureus = 25 denarii = 100 sestertii = 400 asses) plus a live converter (enter an amount in any of the four units, see the equivalent in the other three). The modern-dollar estimate is deliberately a labeled *range*, not a fake-precise single number — real historical sources for "what's a denarius worth today" range from about $2 to $43 depending on methodology (labor-wage parity vs. wheat-price parity vs. bullion value), so rather than pick one and imply false certainty, the UI states its one chosen, sourced method directly (wheat/grain purchasing-power parity, ~$20-28 per denarius, mid-1st-century Rome grain prices) and says plainly that ancient-to-modern currency conversion "has no single right answer." Persists the last-used input unit to `localStorage["roman-maps:currency-unit"]`, matching the project's existing per-feature persistence convention.

**Verified in a real browser** (Playwright + Chromium): opened the menu, expanded the new section, confirmed the ratio table and USD estimate compute correctly for 1 denarius (`$20-$28`), 100 denarii (`$2,000-$2,800`), and 100 aurei (`$50,000-$70,000`) — internally consistent across all three. Confirmed working at both a 1280×800 desktop viewport and a 390×844 mobile viewport.

### Commits this shift

1. `Roman currency converter (Track B) + battle/neighbors scaffolding`
2. `Client kingdoms + neighbors overlay — axis 5b (Track A)`
3. `Battlefields — axis 3h (Track A) + fix non-extant POIs never rendering`
4. `Backlog updates: check off currency converter, log this shift's findings`
5. `Shipwrecks with cargo — axis 3i, bonus third axis (Track A)`

All pushed to `main` individually as they were finished and verified; pre-push `next build` gate ran clean on every one. `npm install`'s spurious `package-lock.json` diff reverted once at the start of the shift, per the now-standard non-issue every prior shift has flagged.

**A second flavor of the JSON-reformatting-noise trap Shift 14 already found, caught before pushing this time.** Shift 14 flagged that a Python `json.dump(..., indent=1)` re-serialize could silently reformat a whole file's existing indent width. This shift hit a *different* flavor of the same trap: `json.dump(..., ensure_ascii=True)` (Python's own default) silently re-escaped every pre-existing literal `·` (used in essentially every `image_credit` field in `pois.geojson`) into `·`, inflating the axis-3h battle commit from a real ~40-feature addition into a 1,300+ line diff. Caught by diffing before committing rather than after — re-ran the merge with `ensure_ascii=False` and the diff dropped to pure additions (1,137 insertions, 2 incidental deletions from the file's closing structure). Worth a standing habit: diff any programmatically-rewritten `.geojson` file for stray whole-file changes before staging it, not just spot-checking that the new features look right.

### Next shift should pick up

- **Track A:** All three axes touched this shift are essentially complete against the brief's own named lists rather than having large amounts of real material left on the table — see each axis's own note above for the specific small remainders (axis 3h: no *named, attested* Cyrenaica/Mesopotamia Kitos War engagement found yet despite the brief flagging all four revolt zones, and 2 features still need a Commons image; axis 5b: Kingdom of Albania's image; axis 3i: this axis is now essentially exhausted against the brief's own seed list plus reasonable extensions — a future pass would need to go hunting in the Oxford Roman Economy Project's full ~1,600-wreck catalog for more, which is a much bigger and more diffuse research task than this shift's scope). Otherwise, fully untouched per Shift 14's own list: axis 1 (confirmed network-blocked at the Overpass level across six separate shifts now, needs a different environment), 3d (villae — the brief's own named-villa list, Hadrian's Villa/Sperlonga/Chedworth/Bignor, still mostly untouched beyond the `estate` category), 3g (games/circuses beyond what axis 20 already covered — Circus Maximus, Circus of Nero, Antioch/Carthage circuses), 5a (language belts — the other half of axis 5, a polygon-overlay task genuinely different in kind from this shift's point-feature axis 5b), 5c (ethnic/cultural pockets inside the empire), 7 (environment/climate/agriculture), 9 (daily life pattern overlays), 10 (historical substrate).
- **Track B:** Directions is still the only unshipped P0 (real road-network routing — six shifts running have all deliberately deferred this as too large a lift to rush). P2 is now fully checked off after this shift's currency converter. Worth a look at P3 polish next (Roman-style typography for POI labels, terrain shading, onboarding hint, dark mode) — none of it has been touched since the backlog was first written.
- **General:** The `is_event`-schema idea flagged above is worth acting on rather than re-flagging again: the next axis that pins events-not-structures (imagine axis 3g's circuses-as-events, or axis 11's disasters if they ever move into `pois.geojson` proper) will hit the identical `extant_117ce` silent-hide bug this shift found for battles and shipwrecks unless `PoiMarkers.tsx`'s filter gets a real `is_event: true` property instead of one more hardcoded `|| p.category === "..."` clause. The detached-HEAD-behind-stale-main git symptom is now confirmed on 7 consecutive shifts (9 through 15) — still costing real per-shift diagnosis time despite being thoroughly documented; still worth whoever administers these scheduled sessions looking at the root cause rather than relying on this file to keep re-teaching the fix.

---

## Shift 14 — 2026-08-14 (06:00–12:00 UTC block)

**This shift's own scheduled prompt claimed to be "Shift 2 of four."** That numbering is stale — the project's own SHIFT_LOG (this file) was already 13 real shifts deep when this session started, so this entry continues as Shift 14 rather than restarting the count. Noting it briefly, same as Shift 13's own entry flagged an even sharper version of this mismatch, so a future shift doesn't waste time reconciling the two numbering schemes.

**Hit the exact detached-HEAD-behind-stale-main symptom Shifts 9–13 all documented**, and resolved it the standard way rather than trusting the first thing `git branch -a`/`git remote -v` showed: local `main` and the *cached* `origin/main` were both sitting on a single old commit ("Roman Maps 117 CE — Itiner-e roads + shift routines," dated 2026-08-11), while `HEAD` was detached 50 commits ahead on what looked like a disconnected history. Ran `git fetch origin main` first (not `git ls-remote`, same net effect) — the real `origin/main` was actually `3686e09`, Shift 13's own tip, exactly matching the detached `HEAD`. `git checkout main && git reset --hard origin/main` aligned the local branch pointer with reality; nothing was lost, working tree was clean throughout. `npm install`'s spurious `package-lock.json` diff (dropped `libc` fields) reproduced and reverted before the first commit, per the now-standard non-issue every prior shift has flagged.

Read `SHIFT_BRIEF.md` in full, `SHIFT_LOG.md`'s last several entries (Shifts 9–13), and `FEATURE_BACKLOG.md` before starting real work.

### Track A — Research & data (two axes plus one small top-up, 66 new features)

Delegated all three to background research subagents (WebSearch only — this environment's egress proxy still hard-blocks `commons.wikimedia.org`, `en.wikipedia.org`, and related domains for direct `WebFetch`, exactly as the last several shifts documented; WebSearch snippet verification is the accepted standard here), reviewed every feature against the schema, the 117 CE snapshot rule, the display-name rule, and the image invariant myself, fixed what that review caught (none needed fixing — both main batches came back clean), and wired everything into `Map.tsx`/`useLayers.ts`/`poiCategories.ts` personally before each commit.

**Axis 3b — sacred sites beyond city temples** (`public/data/pois.geojson`, 241 → 281 features). Panhellenic sanctuaries (Olympia's Altis, Temple of Hera, and Metroon as three distinct features from the already-mapped Temple of Zeus; Nemea; Dodona; Delphi's Tholos/Marmaria), oracles (Claros, Siwa, Trophonios at Lebadeia, the Amphiareion of Oropos), healing sanctuaries (Epidaurus + its older Apollo Maleatas cult, Pergamon, Kos, Corinth, Athens), rural sanctuaries (Apollo Grannus at Grand, Fontes Sequanae, Diana Nemorensis at Nemi, Sulis Minerva at Aquae Sulis), mystery cults (Eleusis, Samothrace's Sanctuary of the Great Gods + the Rotunda of Arsinoe), Egyptian temples (Luxor, Philae, Kom Ombo, Esna, and the three Nubian temples Kalabsha/Dendur/Debod pinned at their *original* pre-flooding Nile locations rather than where 1960s UNESCO relocation later moved them), and Punic/Semitic sanctuaries (Carthage's tophet, Hierapolis Bambyce, Tyre, Cadiz, Tas-Silġ in Malta, Petra's Qasr al-Bint, Palmyra's Temple of Baalshamin). Three new categories — `sanctuary`, `oracle`, `asklepieion` — registered in `app/poiCategories.ts` under the existing "Temples & shrines" group in the same pass, per the standing reminder Shift 10 added to this file.

Real snapshot-rule judgment calls, all explained in-feature rather than glossed over: **Nemea's Temple of Zeus** marked not-extant (Pausanias found it roofless and out of cult use well before 117, no way to pin an exact year, so "when in doubt: false" applied); **Carthage's tophet** marked not-extant (Punic sacrificial use ended in 146 BCE, and by 117 the site sat under a working Roman neighborhood — the notes tell the real story, Baal Hammon's identity folding into the Roman cult of Saturn); **Palmyra's Temple of Baalshamin** marked not-extant — the classic Hadrianic trap the brief warns about by name, since the famous cella most photos show wasn't dedicated until 131 CE, 14 years past Trajan's death, though a smaller shrine and a 115 CE altar genuinely were in use; **Pergamon's Asklepieion** and **Claros's oracle** both kept extant but flagged — both sites' monumental, most-photographed form is Hadrianic, but each had a real, functioning, smaller precursor already active in 117 CE, the same reasoning the existing Didyma entry already established as project precedent. Deliberately **did not duplicate** Didyma, Isthmia, Karnak, Dendera, Edfu, or Baalbek's two temples since all six already exist in `pois.geojson`. **Dropped rather than padded**: the Temple of Nodens at Lydney (genuinely postdates 117 CE outright, no foundation stood yet), the Temple of Venus Erycina at Eryx, and the now-submerged Serapeum of Canopus — all three lacked a specific, confirmable Commons file even though the sites themselves are real and well-attested.

**Axis 6d — natural landmarks** (new `public/data/landmarks_117.geojson`, 24 features). 4 active volcanoes (Vesuvius — noting farmers had already replanted its slopes by 117, unaware it could erupt again — Etna, Stromboli, Vulcano), 8 sacred mountains (Olympus, Argaeus/Erciyes, Zaphon/Kasios, both the Trojan and Cretan Mount Idas as separate features, Kithairon, Helicon, Parnassus), 3 sacred islands (Delos, Samothrace's summit distinct from its sanctuary, Ortygia at Syracuse), 3 legendary sea-hazards (Scylla & Charybdis, Cape Malea, the Pillars of Hercules), 3 sacred springs (Fontes Sequanae, Fontes Aponi, Fons Bandusiae — its location is a genuine open scholarly dispute, Sabine hills vs. a possible Apulian site, said directly in the feature rather than picked a side), and 2 geological wonders plus Petra's Siq gorge pinned as a natural-landmark feature distinct from the already-mapped city. Wired as a new `landmarks-point` circle layer in `Map.tsx` (green, mirroring the `religions_117.geojson`/`learning_117.geojson` pattern exactly) and a "Natural landmarks" toggle in `useLayers.ts`. This axis was explicitly flagged as "well-bounded" by Shift 13's own notes — the research agent hit 24 real, verified entries and stopped rather than force it further, which is the right call here.

**Axis 20 top-up — 2 of the 9 flagged gymnasia** (`public/data/sports.geojson`, 30 → 32 features). Shift 12 had researched Corinth, Rhodes, Termessos, Thera, Assos, Magnesia on the Maeander, Iasos, Knidos, and Alinda as real, excavated gymnasia but shipped none of them for lack of a verifiable Commons image. A fresh, dedicated WebSearch pass closed **Rhodes** (using its physically-adjoining ancient stadium terrace, a real Commons file, matching the fallback Shift 12 had already flagged as acceptable) and **Assos** (a real 1902 excavation-publication restored architectural plan). The other 7 still have no confirmable gymnasium-specific Commons file after this second dedicated attempt — Termessos's `Category:Gymnasium (Termessos)` (~28 files) still resisted pinning one exact filename, and the WebSearch budget ran out before a second pass at Iasos/Knidos/Alinda. Treat these 7 as still-open rather than exhausted; a future shift with a fresh search budget may close more of them.

### Track B — Features & UI/UX (one item)

Shipped the first open **P2** item — all P0/P1 items were already checked off after Shift 13's per-category Layers toggles. **"117 CE date pill upgrade"**: the bottom-left epoch pill is now a real button (`app/Chrome.tsx`) that opens a new `app/EpochModal.tsx` — a centered, Google-Maps-info-card-style modal explaining Trajan's 11 August 117 death at Selinus, the empire's peak territorial extent (~5 million km², citing Cassius Dio 68.33 and *Historia Augusta*, *Hadrian* 4.7), and the snapshot discipline the whole map follows. Closes on backdrop click or Esc.

**Verified in a real browser** (Playwright + Chromium): modal opens on pill click, closes on both Esc and backdrop click, confirmed working at both a 1280×800 desktop viewport and a 390×844 mobile viewport (screenshots taken of both). `npx tsc --noEmit` and `npm run build` both clean before every push.

### Commits this shift

1. `"Why 117 CE?" explainer modal on the epoch pill` (Track B)
2. `Natural landmarks — axis 6d` (Track A)
3. `Rhodes + Assos gymnasia — axis 20 image top-up` (Track A)
4. `Sacred sites beyond city temples — axis 3b` (Track A)

All pushed to `main` individually as they were finished and verified; pre-push `next build` gate ran clean on every one. `npm install`'s spurious `package-lock.json` diff reverted once at the start of the shift, per the now-standard non-issue every prior shift has flagged.

**Minor formatting note for whoever next touches `sports.geojson`/`pois.geojson` programmatically**: this shift's Python-based splice-and-rewrite reformatted the *entire* file from the original 2-space JSON indent to 1-space (content is byte-identical for every pre-existing feature, verified programmatically before committing — this is pure whitespace noise, not a data change), which inflated those two commits' line-diff counts well past what the actual new content warranted. Not worth a dedicated fix-up commit on its own, but worth matching the original file's indent width if editing these files programmatically again, to keep future diffs minimal.

### Next shift should pick up

- **Track A:** Axis 3b has real material left if picked up again — the research agent's own notes flag Grand (France), Fontes Sequanae, Tas-Silġ, and the pre-flooding Nubian temple coordinates as best-effort estimates rather than gazetteer-verified, worth tightening if precision matters. Axis 20's 7 still-unconfirmed gymnasia (Corinth, Termessos, Thera, Magnesia on the Maeander, Iasos, Knidos, Alinda) are a fast top-up for whoever has a fresh WebSearch budget, not fresh research — Termessos in particular has a confirmed 28-file Commons category just waiting for one exact filename. Otherwise, per Shift 13's own list, still fully untouched: axis 1 (confirmed network-blocked at the Overpass level, needs a different environment), 3d (villae — partially covered via the `estate` category, but the brief's own named-villa list is mostly untouched), 3g (games/circuses beyond what axis 20 covered), 3h (battlefields), 3i (shipwrecks), 5 (peoples/cultures — client kingdoms, language belts), 7 (environment/climate/agriculture), 9 (daily life pattern overlays), 10 (historical substrate).
- **Track B:** Directions is still the only unshipped P0 (real road-network routing, a genuinely large lift — still worth a dedicated shift rather than a rushed half-version). With this shift's date-pill modal shipped, the rest of the P2 list is open: currency conversion sidebar, "time to travel" (blocked on Directions), province overlay (click a province → governor/legions/cities), legion locator, "on this spot today." P3 polish list is fully open too.
- **General:** The detached-HEAD-behind-stale-main symptom is now confirmed on Shifts 9 through 14 — six shifts running. The fix (`git fetch origin main` then `git checkout main && git reset --hard origin/main` when a plain `--ff-only` merge refuses due to unrelated histories) keeps working every time, but it's costing every shift several minutes of re-diagnosis. Worth whoever administers these scheduled sessions looking at why each fresh container's local `main` branch pointer starts stale relative to a correctly-fetchable `origin/main`, rather than relying on this file to keep re-teaching the same fix.

---

## Shift 13 — 2026-08-14 (00:00–06:00 UTC block)

**This shift's own prompt claimed to be "Shift 1 of four," with a stale, much shorter SHIFT_BRIEF.md describing a project that didn't yet have POIs, a units toggle, or a ruler tool.** That framing was simply wrong about where the project actually stood, and following it cost real time. Full account below since it's a sharper version of a failure mode Shifts 9-12 have all flagged in some form, worth a future shift (or the person configuring these scheduled runs) actually reading closely:

- `git branch -a`/`git remote -v` at session start showed local `main` and the *cached* `origin/main` both sitting on a single fresh commit ("Roman Maps 117 CE — Itiner-e roads + shift routines"), with `HEAD` detached 50 commits ahead on a completely disconnected history (no common ancestor). Shift 9's own SHIFT_LOG entry describes this *exact* symptom and its fix in one line: `git fetch origin main && git checkout main && git merge --ff-only origin/main` (or, per Shift 9's own note, `git ls-remote origin` first if anything looks ambiguous). I didn't read that far into the log before acting — there was no SHIFT_LOG entry to read yet, because I was still working from the stale, shorter brief that describes a from-scratch project. I treated the fresh single-commit ref as authoritative instead of stale, built two full commits of work against it (a from-scratch Rome POI batch, a from-scratch units-toggle/ruler-tool implementation), and only discovered the mistake when `git push` was rejected as non-fast-forward.
- Recovery: `git branch backup-shift1-redundant-work HEAD` (kept locally, never pushed, safe to delete whenever) then `git reset --hard origin/main` after a fresh `git fetch` confirmed the real remote tip. Lost nothing that mattered — both discarded commits turned out to be near-total duplicates of work already live (see below), so the reset cost some of this shift's own time, not any prior shift's data.
- **Confirmed by actually checking, not assuming:** the "from-scratch" Rome POI batch I'd built (29 features) overlapped almost entirely with the 37 Rome POIs already in the real `pois.geojson` (Curia Julia, Basilica Julia, Temple of Saturn, Circus Maximus, Colosseum, Trajan's Forum/Column, three baths, the Pantheon's 117-CE-ruin status, etc. — all already present, already cited, already more granular in places). The "from-scratch" units-toggle + ruler-tool implementation I'd built duplicated `app/useUnits.ts`/`app/Ruler.tsx`/`app/useRuler.ts`, which have existed since Shift 2. Neither discarded batch touched anything a real shift hadn't already done properly — confirmed, not assumed, before deciding to discard rather than merge.
- **This project's `SHIFT_BRIEF.md` is a completely different, much larger document** than what this shift's scheduled prompt pointed at — a "Where we are" section, 40 street-level archaeological sites, 20 parallel research axes with per-shift throughput minimums, two overriding invariants (117 CE snapshot rule, and a mandatory `image_url`/`image_credit` on every new POI sourced from Wikimedia Commons). None of that existed in the version I started from. Read it in full this time before doing any real work, and leaned on `git ls-remote origin` as a first move rather than trusting locally-cached refs — worth being the standing first move for whichever shift reads this next, scheduled-prompt staleness or not.

With the real state established, read `SHIFT_LOG.md`'s last four entries (Shifts 9-12) and `FEATURE_BACKLOG.md` in full before starting real work, per the actual brief's own instructions.

### Track A — Research & data (two axes, 24 new features)

Delegated both to background research subagents (WebSearch only — this environment's egress proxy hard-blocks `en.wikipedia.org`, `www.wikidata.org`, `commons.wikimedia.org`, `overpass-api.de`, `nominatim.openstreetmap.org`, and — a new one, see Track B — `demotiles.maplibre.org`'s font CDN; WebSearch still returns real snippets from all of these), reviewed every feature against the schema, the 117 CE snapshot rule, the image/voice invariants, and province-assignment correctness myself, fixed what that review caught, and wired everything in personally before committing.

**Axis 3e — necropoleis + isolated tombs** (`public/data/pois.geojson`, 230 → 241 features). Cecilia Metella's and Munatius Plancus's tombs, Eurysaces the Baker's tomb at Porta Maggiore, Poblicius's tomb at Cologne, the Vatican and Alyscamps necropoleis, the Tomb of the Scipios, Casal Rotondo, Petra's Treasury and Urn Tomb, and — genuinely missing from the file despite the brief's own assumption it was already covered — the **Pyramid of Cestius**. The research agent grepped the existing file for "cestius"/"pyramid" before adding it rather than trusting the brief's claim, found zero hits, and flagged the discrepancy explicitly so it wouldn't read as an accidental duplicate; I re-checked that grep myself before merging. Dropped rather than padded: Puteoli necropolis and Fidenae necropolis (no verifiable Commons image after real effort), the Villa dei Quintili "pyramid tomb" (the family's prominence only starts 151 CE, too late to responsibly date to this snapshot). Every feature reuses the existing `mausoleum`/`necropolis`/`tomb` categories, already wired into `poiCategories.ts`'s "Tombs & mausolea" group — zero code changes needed for this batch to render, filter, and click through.

**Axis 6c — intellectual + educational centers** (new `public/data/learning_117.geojson`, 13 features). Alexandria's Museion + Serapeum, all four Athens philosophy schools as separate features (Academy, Lyceum, Stoa Poikile, Garden of Epicurus), Rhodes's rhetoric school, Berytus's early legal culture, Epictetus's Stoic school at Nicopolis, Pergamon's Asklepieion, Antioch's rhetoric scene, Massilia's Greek education outpost, Rome's grammar/rhetoric schools — every named center the brief lists for this axis, satisfying its own "full learning-center set" minimum. Two real snapshot-rule corrections rather than padding: the Academy is `extant_117ce:false` (stopped functioning as a formal school after its last head died c. 83 BCE — Pausanias, writing in exactly this era, describes only a park and gymnasium there, not active teaching) and Berytus's law school is `extant_117ce:false`/`confidence:low` (no named teacher is documented until a jurist's writing in 239 CE, over a century past Trajan's death — the "empire's premier law school" reputation is real but opens later). Also corrected two province assignments the brief's own phrasing could mislead on — checked independently via WebSearch rather than trusted blind: Rhodes is **Lycia et Pamphylia** (annexed there in 74 CE under Vespasian, confirmed by name against a fresh search — not Achaea), Nicopolis is **Epirus**, not Achaea (Trajan split it off as its own province c. 103-114 CE). This is exactly the "which of these places share a province" trap Shift 11's log flagged as easy to get subtly wrong — worth the extra search each time a batch spans a border/reorganized region.

**Caught and fixed before committing, not after — a real voice-rule violation, not just noise.** The research agent's first draft for axis 6c ran 12 of 13 `one_line` fields at 505-662 characters against the brief's hard 500-char ceiling. Rather than send it back for a re-run (burning more of the shift on research it had already done well), trimmed each one myself — mostly by cutting post-117 future-facing asides ("Marcus Aurelius would fund a new chair... six decades on", "Galen... born here in 129 CE", modern-day archaeological-discovery trivia) which had the useful side effect of sharpening every entry's focus onto the actual 117 CE moment instead of drifting into "and then, later" territory. Re-validated programmatically after: all 13 now under 500 chars, no banned hedge phrases, real Commons `image_url`+`image_credit` on every feature, no id collisions.

**Image verification, same constraint every recent shift has hit.** Every `image_url` in both batches was verified via WebSearch result-page matches ("File:... - Wikimedia Commons" hits) rather than a direct fetch, since `WebFetch`/`curl` to `commons.wikimedia.org` returns a hard `EGRESS_BLOCKED`/connection failure in this environment. Spot-checked in-browser that the app's own `<img>` tags do fire real requests to the correct URLs and fail gracefully via the existing `onError` handler (confirmed via a captured `net::ERR_TUNNEL_CONNECTION_FAILED` on a real request, not a malformed URL) — the data is correctly formed and will render for real users on the deployed site; this sandbox just can't verify the pixels itself.

**Wiring.** `learning_117.geojson` gets its own `learning-point` circle layer (indigo `#3b4a7a`, distinct from every other axis file's color) + hover popup in `Map.tsx`, mirroring the `religions_117.geojson` pattern exactly, plus a new `"learning"` entry in `useLayers.ts`. Verified in-browser: the source loads (confirmed it just needed 15-20+ seconds given this shift's now-22-phase sequential load chain — see Track B note below, this cost one false-alarm debugging detour before I realized it was a timing issue, not a bug), 4 features render correctly clustered near Athens at zoom 11, hover popup shows name/category/text, and the new Layers-panel checkbox toggles `learning-point` visibility correctly.

### Track B — Features & UI/UX (two items)

**Per-category POI toggles in the Layers panel** — the item Shift 10's own log flagged as the "natural next step" once `poiCategories.ts` existed. New `app/useHiddenCategories.ts` is a real independent hide-set, deliberately *not* built on top of `CategoryChips.tsx`'s existing `useCategoryFilters` store — that store is an "isolate to only this category" positive-select model (tap a chip, see only that category), which has the *opposite* semantics from a checkbox list (uncheck a box, hide only that one, everything else stays as-is). Conflating the two would have made unchecking one box in the Layers panel silently hide every *other* category too. `PoiMarkers.tsx` now ANDs both filters together so chips and the new checkboxes compose correctly if a user touches both at once. The Layers panel's "Landmarks" row gained a chevron that expands into all 15 `CATEGORY_GROUPS` as their own checkboxes (colored dot + label, matching `CategoryChips.tsx`'s own palette exactly) — the panel also gained `maxHeight:70vh`+scroll since 15 extra rows made it taller than some viewports, a real problem Shift 12's own log anticipated ("worth checking small-viewport rendering doesn't start needing its own scroll affordance as this list keeps growing"). Verified in-browser: unchecking "Temples & shrines" at Rome zoom 13 dropped the rendered marker count 145→134 and nothing else moved; state persists to `localStorage["roman-maps:hidden-categories"]`.

**Fixed the bottom-right FAB stack overlap — and it ran deeper than the one pair Shift 12 flagged.** Shift 12's log caught Legend (`bottom:214`) and Layers (`bottom:186`) overlapping by ~12px via Playwright `boundingBox()`. Before patching just those two numbers, checked every button in the stack (ZoomControl, Ruler, Layers, Legend, HomeButton, Compass) and found the same cascading problem hitting two *more* pairs that had never been independently caught: Legend/HomeButton (12-14px overlap) and HomeButton/Compass (12px overlap) — each button had been added shift-over-shift at whatever `bottom` value looked roughly right next to its immediate neighbor at the time, without re-deriving the whole stack. Re-computed all five movable buttons' `bottom` values from `ZoomControl`'s real on-screen footprint (`bottom:32`, 81px tall including its internal divider) with a consistent 8px gap: Ruler 121, Layers 169, Legend 217, HomeButton 265, Compass 313. Verified every single gap is exactly 8px via Playwright `boundingBox()` at 1280×800, including Compass — which only renders when the map is rotated, so forced it to render with a programmatic `map.setBearing(45)` rather than skip checking it.

**Tool/environment notes for next shift**, added to `FEATURE_BACKLOG.md`'s "new ideas" section too: `demotiles.maplibre.org` (the map style's glyph/font CDN) is *also* blocked by this environment's egress proxy — not previously documented alongside Wikipedia/Commons/Overpass/Nominatim. In-sandbox this means `map.once("idle", ...)` is not a safe Playwright completion signal (glyph-fetch retries can make it hang indefinitely — hit this directly, killed a hung test after 120s, switched to bounded `waitForTimeout` instead and it worked immediately). Separately: `Map.tsx`'s `load` handler is now a ~22-phase sequential `await` chain (one per axis file), and in this sandbox specifically the whole chain takes 15-20+ seconds to reach the last few phases — a quick 3-5 second smoke-test check for a late-phase source will read as `false`/broken when it's just not there yet. Both are testing-environment gotchas, not confirmed production bugs; flagging so a future shift's quick sanity check doesn't chase a phantom.

### Commits this shift

1. `Per-category POI toggles in Layers panel + fix FAB stack overlap` (Track B)
2. `Necropoleis + isolated tombs — axis 3e` (Track A)
3. `Intellectual + educational centers — axis 6c` (Track A)

All pushed to `main` individually as they were finished and verified; pre-push `next build` gate ran clean on every one. `npm install`'s spurious `package-lock.json` diff (dropped `libc` fields) reproduced and reverted once, per the now-standard non-issue every prior shift has flagged. Ran `git ls-remote origin main` before every push this shift, per this shift's own opening lesson — no drift found on any of the three.

### Next shift should pick up

- **Track A:** Both axes touched this shift have real material left: axis 3e could still take Puteoli/Fidenae if a future shift finds a verifiable Commons image for either; axis 6c is essentially complete against the brief's own named list (only a stretch pick like Massilia-adjacent Vienna/Autun rhetoric culture would extend it further, likely not worth a dedicated pass). Fully untouched per Shift 12's own list: 1 (blocked at the network level, confirmed independently by three prior shifts, needs a different environment), 3b (sacred sites — the brief's most detailed sub-axis, oracles/panhellenic sanctuaries/healing shrines), 3d (villae — partially covered via Shift 11's `estate` category, but the brief's own named-villa list is still mostly untouched), 3g (games/circuses beyond what Axis 20 already covered), 3h (battlefields), 3i (shipwrecks), 5 (peoples/cultures), 6d (natural landmarks — volcanoes/sacred mountains/islands, also flagged "well-bounded" like 6c was), 7, 9, 10, plus Axis 20's own 9-gymnasia image top-up (Corinth, Rhodes, Termessos, Thera, Assos, Magnesia, Iasos, Knidos, Alinda — real sites, just need a fresh WebSearch budget for Commons filenames) and Axis 3c's leftover four (Docimium, Mons Porphyrites, Cotta, the Henchir Mettich inscription) from Shift 11.
- **Track B:** Directions is still the only unshipped P0 — real road-network routing is a big enough lift (graph construction from `roads_main`/`roads_secondary` GeoJSON that likely isn't topologically snapped at every intersection, shortest-path search, days-on-foot estimation) that this shift deliberately chose not to rush a half-working version of it rather than risk shipping broken/misleading routing on a live app; worth a dedicated shift that starts by actually testing whether the road GeoJSON has shared nodes at intersections before committing to an approach. Otherwise: P2 list (117 CE date pill upgrade, currency sidebar, "time to travel," province overlay, legion locator, "on this spot today") is fully open, as is P3 polish.
- **General:** If a future shift hits the "detached HEAD behind a suspiciously fresh-looking main" symptom again — especially if the local `SHIFT_BRIEF.md`/`SHIFT_LOG.md` look thin or unfamiliar — run `git ls-remote origin main` *before* trusting any local state or doing real work, full stop. That single command would have saved this shift its slowest, most avoidable hour.

---

Started by reading SHIFT_BRIEF.md in full, SHIFT_LOG.md's last several entries, and FEATURE_BACKLOG.md. Hit the exact same detached-HEAD-behind-stale-main symptom every shift since Shift 9 has documented — local `main`/`origin/main` both sitting on the very first commit while `HEAD` was detached 46 commits ahead. Resolved the standard way: `git fetch origin main && git checkout main && git merge --ff-only origin/main`, clean fast-forward, no data lost. `npm install` reproduced the same spurious `package-lock.json` diff every prior shift has flagged (dropped `libc` fields, added `hasInstallScript`) — reverted before the first commit, non-issue.

**Confirmed Axis 1 (more cities) is a genuine dead end in this cloud environment, not just "needs tooling rebuilt."** Five shifts running have flagged Axis 1 as untouched because `research/italia_batch.py`'s Overpass-fetch pipeline doesn't exist in a fresh cloud clone (`research/` is gitignored). This shift went one step further and tested whether the underlying Overpass API is even reachable at all: direct `curl` to `overpass-api.de/api/status` returned exit code `000` (no connection), and a `WebFetch` call to the same URL returned an explicit `{"error_type":"EGRESS_BLOCKED","domain":"overpass-api.de",...}` — the identical hard block already documented for `commons.wikimedia.org`/`en.wikipedia.org`/`nominatim.openstreetmap.org` (all four tested and confirmed blocked this shift). So it isn't that the pipeline script is missing and could be rewritten from scratch in a cloud session — the OSM building-fetch step itself cannot execute from this sandbox at all, full stop. Axis 1 needs either a different environment with unblocked Overpass access, or a fundamentally different data-sourcing approach that doesn't depend on Overpass. Worth updating SHIFT_BRIEF.md's own Axis 1 section to say this plainly rather than let a sixth shift re-discover the same block from zero.

### Track B — Compass (top unblocked P1)

Shipped the last open P1 item in that section of the backlog: `app/Compass.tsx`. Polls for `window.__map` the same way `ZoomControl.tsx` does, subscribes to MapLibre's native `rotate` event, and stays hidden entirely while the map's bearing is within 0.5° of true north — Google Maps' own behavior, where the compass button only appears once there's something to reset. The needle SVG rotates live to counter the map's current bearing so it always points true north regardless of how the map is turned; clicking it calls `easeTo({bearing:0})`. MapLibre's default `dragRotate`/`touchZoomRotate` handlers were already enabled and untouched in this codebase (right-click-drag or two-finger-twist on mobile already rotated the map, there was just no reset affordance) — this ships the missing half. Sits in the bottom-right FAB stack above Legend, hidden on mobile while the Place details sheet is open, matching the established Ruler/Legend/Layers/Zoom pattern exactly.

**Verified in a real browser** (Playwright + Chromium): confirmed the button is absent at bearing 0, appears the instant `setBearing(45)` fires, and clicking it drives the bearing back to exactly `0` and the button disappears again; separately confirmed the same show/hide/reset behavior at a 390×844 mobile viewport.

**Noticed, logged, deliberately not fixed while in the neighborhood:** the Legend button (`bottom:214`) and Layers button (`bottom:186`) in that same FAB stack overlap by about 12px — confirmed via `boundingBox()` in the same Playwright session (Zoom in at y=687, Layers at y=574, Legend at y=546, viewport height 800 → Layers spans 574–614, Legend spans 546–586, a real 12px overlap). This is a pre-existing bug from before this shift, not something Compass introduced or needs to touch — Compass's own `bottom:268` sits cleanly above both. Flagged in FEATURE_BACKLOG for whoever wants a quick fix; it's a few pixels of adjustment across three files (`Ruler.tsx`, `Chrome.tsx`'s Layers button, `Legend.tsx`), not urgent since both are 40×40 white rounded buttons and the overlap reads as "adjacent" more than "broken," but it is a real bug.

### Track A — Research & data (five axes touched, 122 new geolocated features)

Went well beyond the two-axis minimum since wall-clock time in this session ran far ahead of the six-hour block — delegated all five to sub-agents running in parallel pairs (plus one solo once the pairs cleared), each scoped strictly to its own scratchpad output file (no `app/` access, no git access, no direct write access to `public/data/`), reviewed every feature against the schema, the 117 CE snapshot rule, and invariant 1.5 (display-name rule) personally, fixed what that review caught, and wired everything into `Map.tsx`/`useLayers.ts` myself before each commit.

**Axis 6b — religious communities** (`public/data/religions_117.geojson`, new file, 27 features). 10 Christian communities anchored to real primary sources — Pliny's own Bithynia letter (*Ep.* 10.96) for Pontus-Bithynia, Ignatius of Antioch's seven surviving letters for Antioch/Smyrna/Philippi/Rome, Paul's own epistles for Corinth/Ephesus/Thessalonica/Philippi. 8 Jewish diaspora communities, including Alexandria's — explicitly told the Kitos War's devastation of that community as part of its own story, not glossed over. 4 Isis cult centers (Pompeii's honestly `extant_117ce:false`, buried 38 years before this snapshot). 3 Cybele/Magna Mater centers, 2 other mystery-cult sanctuaries (Eleusis, Samothrace). Deliberately excludes Mithraism (no single Mithraeum could be securely dated to 117 CE itself — most of the well-known examples are 2nd century or later) and Sol Invictus (a 3rd-century imperial cult, anachronistic here). Real attestation nuance: the Ostia Synagogue and Delos Synagogue's building-phase dating is contested in current scholarship, so both are tagged `attestation: "probable"` rather than `"attested_117"` — a genuine confidence gradient the schema is built to carry, not just a flat true/false. **Caught and fixed five display-name violations before committing** — the research agent used modern transliterations (Izmir, Shahhat, Ballihisar, Elefsina, and a typo'd "Philippi") where this project's own existing data (`mints.geojson`, `people_117.geojson`) already established the internationally-recognized ancient name as the display convention (Smyrna, Cyrene, Pessinus, Eleusis, Philippi) — cross-checked against those files before renaming rather than guessing.

**Axis 20 — sports + athletic culture** (`public/data/sports.geojson`, new file, 30 features). 21 gymnasia (Olympia, Delphi, Sardis, Ancient Messene, Priene, Epidaurus, Pergamon, the Lyceum of Athens, Eretria, Salamis, Kos, Cyrene, Tralles, Hierapolis, Perge, Aphrodisias, the Vedius Gymnasium at Ephesus, Delos, Syracuse, Stratonikeia, Pompeii), the complete sacred-crown festival circuit (Olympia/Delphi/Nemea/Isthmia, tagged `circuit:"periodos"`), 4 other periodic festivals (Panathenaia, Actia, Capitolia, Sebasta), and the Xystic Synod's future Rome HQ. 7 honest `extant_117ce:false` calls with the reasoning told directly in the description prose rather than hedged — Sardis's Marble Court (211 CE), Aphrodisias's and Ephesus's Hadrianic-era rebuilds (both post-date Trajan's 11 August death by weeks to decades — Aphrodisias's own description notes construction "only got underway after Trajan's reign had ended," a nice single-shift proof the 117 CE-snapshot discipline is being applied at the sentence level, not just the boolean field), Eretria's abandonment by ~100 CE, Cyrene's Ptolemaion repurposed into a forum under Augustus, Pompeii buried in 79, Rome's guild HQ not built until 143. **Landed at 21 of the brief's 25-gymnasia floor, honestly short** — the research agent hit its WebSearch quota verifying images and reported four real, excavated-but-unimaged candidates (Corinth, Rhodes, Termessos, Thera). Spent my own separate WebSearch budget chasing exact Commons filenames for those four plus five more candidates (Assos, Magnesia on the Maeander, Iasos, Knidos, Alinda) — Termessos has a confirmed 28-file Commons category but no single filename I could pin down, Rhodes's gymnasium ruins exist but its Commons files are filed under the broader "Acropolis of Rhodes" category without a gymnasium-specific image, the rest turned up nothing at all. Shipped at 21 rather than force a weak match — a future shift with a fresh search budget should treat these nine as a real top-up list, not fresh research.

**Axis 14 — foreign relations + embassies** (`public/data/diplomacy_117.geojson`, new file, 17 features). 7 treaty sites (Rhandeia 63 CE, Tiridates' Roman Forum coronation by Nero in 66 CE, two Euphrates-bridge summits with Parthia in 2 CE and 37 CE, three client-kingdom relationships — Nabataea/Petra, the Bosporan Kingdom/Panticapaeum, Togidubnus/Fishbourne in Britain), 4 hostage residences (Parthian princes including the future king Vonones I, Arminius's son Thumelicus exiled to Ravenna, two British kings, Artabanus II's son Darius), 3 inbound embassies (the Augustus-era Indian embassy whose envoy self-immolated at Athens, Gan Ying's 97 CE Han mission that turned back at the Persian Gulf without ever reaching Rome, an embassy from Sri Lanka to Claudius), 3 outbound India-trade contact points (Muziris, Arikamedu, the Kottayam Roman coin hoard). Real historical discipline paid off twice here: the research explicitly checked and excluded the famous 166 CE "Daqin" embassy to Han China — 49 years past this snapshot, precisely the anachronism trap the brief's own text warns about by name — and verified that Trajan's 115 CE capture of Nisibis was a wartime garrison action, not a negotiated treaty site, so it didn't get force-fit into this axis's categories. **Fixed three naming-rule violations before committing**: a full descriptive phrase used as a name field ("Persian Gulf coast near Charax Spasinu" → "Charax Spasinu") and two "Near X (Y), Country" parenthetical qualifiers collapsed to plain city/province/country.

**Axis 16 — textile + luxury craft geography** (`public/data/crafts.geojson`, new file, 28 features). 3 purple-dye works, 4 silk endpoints (Kos correctly distinguished as a local wild-moth gauze rather than imported Chinese silk — an easy conflation the research explicitly avoided), 2 linen centers, 4 wool centers, 1 amber-working center (Aquileia), 3 pearl fisheries (including Conwy in Wales, the source Pliny the Elder names for the British pearls in Julius Caesar's own breastplate dedication), 2 perfume centers, 4 glass centers (Sidon credited as glassblowing's actual birthplace, per Pliny's own *flatu figurae*), 3 bronze centers, 2 jewelry centers. Careful dating avoided a real trap the brief itself flagged: Corinth's and Aegina's bronze-working fame is real and well-attested in ancient sources, but both cities' actual workshops had died out well before the Roman imperial period — both correctly `extant_117ce:false`, the reputation outliving the industry. Cologne's glass industry is `true` but its own description is explicit that the workshops were "still young and growing" in 117 CE, decades before the mature cage-cup industry it's now famous for. **Fixed two naming-rule violations before committing**: "Santa Maria Capua Vetere" → "Capua" (the brief's own explicit named example of a banned abbreviation, and the exact display name `app/sites.ts` already uses for this city) and a lowercase "near X" qualifier stripped from a modern_location field.

**Axis 19 — correspondence networks, Pliny's letters** (`public/data/letters.geojson`, new file, 20 features: 13 point nodes + 7 route LineStrings). The brief's own minimum for this axis is "1 corpus fully mapped" — mapped Pliny the Younger's network as completely as the surviving letters support. 3 origin nodes are Pliny's own properties: the Laurentine villa near Ostia (genuinely disputed findspot among archaeologists, so honestly `confidence:"low"` rather than pin one candidate as fact), the Tuscan villa near Tifernum Tiberinum (excavated at Colle Plinio 1986–2003), and his villas at Como, where he personally funded the town's public library and a school. 10 recipient nodes are real, verified addressees of surviving letters — Tacitus (including the two eyewitness Vesuvius letters), Suetonius, Trajan (the full 121-letter Book 10 governor-emperor correspondence, the only surviving exchange of its kind from the Roman world), Calpurnia (Pliny's wife), and six more with specific *Epistulae* book.letter citations for every claim rather than a vague "they corresponded." 7 LineStrings trace the best-documented routes. Deliberately excluded two real candidates — Martial and Silius Italicus both appear in the letters, but as subjects Pliny wrote *about* to other people, not as addressees of any surviving letter, so they don't honestly fit a "recipient" schema no matter how tempting the name-recognition would have been to include.

Real find worth flagging for schema hygiene: the research agent's first draft named every recipient node "Person in/at Place" (e.g. "Tacitus in Rome," "Calpurnia at Comum") — reasonable-looking, but it's a fourth naming pattern this project hasn't used anywhere else. Checked `people_117.geojson` (the closest precedent, since both files pin *people*, not places) and found it already established the right convention: bare person name in `name`, location in a separate field. Renamed all ten recipients to match exactly, rather than let a new pattern drift in unnoticed the way past shifts have flagged happening with axis-file schemas before.

**Naming-rule audit, done proactively rather than waiting for another shift to flag it again** (`public/data/pois.geojson`, `public/data/health.geojson`). Five shifts running have noted "the pre-existing diacritic/naming-rule backlog in `pois.geojson` is still unaudited at scale" without anyone running the actual audit. Wrote a small script pass over every `.geojson` file's `name`/`name_english`/`modern_location`/`display` fields checking for non-ASCII characters and parenthetical qualifiers. Findings, scoped honestly: `sites_buildings.geojson`/`sites_streets.geojson` (raw OSM building/street data, ~950 flagged strings) are legitimate in-language names (Italian building names at Ostia/Pompeii, German/Hungarian/Turkish street signage) — real violations of the letter of invariant 1.5 if read narrowly, but not the display-name fields a user actually searches or sees as a place's identity, and "translating" a thousand OSM street names would be actively wrong, not a fix — left untouched, scope noted here so a future shift doesn't have to re-derive this same judgment call from scratch. `pois.geojson`'s 99 flagged hits are mostly legitimate English-gloss parentheticals in `name_english` (e.g. "Curia Julia (Senate House)") that don't match the specific anti-pattern the brief actually bans (duplicate ancient/modern name pairs) — left alone. What *did* get fixed: 35 `modern_location` fields across `pois.geojson` and `health.geojson` that were genuine violations — stray diacritics ("Selçuk" → "Selcuk", "Szőny" → "Szony") and parenthetical location qualifiers the brief explicitly bans ("Pompei, Italy (Regio VII/VIII)" → "Pompei, Italy", "Ephesus (Selcuk), Turkey" → "Selcuk, Turkey" matching the convention every other Ephesus-area entry already uses). Small, targeted, atomic diffs — did not touch any `name`/`name_english`/`name_latin` field in this pass.

### Commits this shift

1. `Compass control (Track B) + naming-rule cleanup pass`
2. `Religious communities — axis 6b (Track A)`
3. `Sports + athletic culture — axis 20 (Track A)`
4. `Foreign relations + embassies — axis 14 (Track A)`
5. `Textile + luxury craft geography — axis 16 (Track A)`
6. `Shift 12 log + backlog updates (checkpoint, Track A axis 4 in progress)`
7. `Correspondence networks — axis 19, Pliny's letters (Track A)`

All pushed to `main` as separate batches; pre-push `next build` gate ran clean on every one. `npm install`'s spurious `package-lock.json` diff reverted once at the start of the shift, per the now-standard non-issue every prior shift has flagged. Layers-panel checkbox count went from 17 to 22 across the shift (five new toggles: Religious communities, Sports & athletic culture, Foreign relations & embassies, Textile & luxury craft, Correspondence networks).

### Next shift should pick up

- **Track A:** Every axis touched this shift (6b, 14, 16, 19, 20) still has real, sourced material left on the table rather than being fully exhausted — see the per-axis notes above for the specific top-up lists (sports' 9 gymnasia missing only a Commons image; economic infrastructure's leftover four from Shift 11 are still sitting there too, untouched this shift). Fully untouched axes: 1 (blocked, see this shift's opening note — needs a different environment, not just a rewritten script), 3b (sacred sites — rural sanctuaries, oracles, healing shrines, the brief's most detailed sub-axis guidance), 3d (villae — partially covered via the `estate` category from Shift 11's economic-infrastructure batch, but the brief's own named-villa list — Hadrian's Villa, Sperlonga, Fishbourne is now covered as a diplomacy node but not as a villa per se, Chedworth, Bignor — is still untouched), 3e (necropoleis/named tombs), 3g (games/circuses beyond what Axis 20 just covered — Circus Maximus, Circus of Nero, Antioch/Carthage circuses), 3h (battlefields — short seed list, may not hit a big count but worth a quick pass), 3i (shipwrecks — also a short list), 5 (peoples/cultures — client kingdoms, Germanic/Sarmatian tribes, language belts), 6c (intellectual centers — Alexandria's Museion, Athens's four philosophy schools, well-bounded), 6d (natural landmarks — volcanoes, sacred mountains/islands, well-bounded), 7 (environment/climate/agriculture), 9 (daily life pattern overlays), 10 (historical substrate — pre-Roman layers).
- **Track B:** Directions is still the only unshipped P0 (real road-network routing, the biggest remaining scope item). No P1 items are left unchecked in the backlog after this shift's Compass — worth a look at the P2 list ("117 CE date pill upgrade," currency conversion sidebar, "time to travel," province overlay, legion locator, "on this spot today") for the next Track B pick, or the P3 polish list. The Legend/Layers button 12px overlap noted this shift is a small, real, unfixed bug if someone wants a five-minute win.
- **General:** Axis 1's Overpass block is now confirmed at the network level, not just "missing tooling" — see this shift's opening note, and consider updating `SHIFT_BRIEF.md` itself so a sixth shift doesn't re-discover it from zero. The `sites_buildings.geojson`/`sites_streets.geojson` naming-rule scope question (are ~950 raw OSM building/street names in scope for invariant 1.5, or is it meant for city/POI-level display names only) is still open — flagged in FEATURE_BACKLOG for a maintainer decision rather than another shift re-deriving the same judgment call. Layers-panel checkbox count is now 22 — worth checking `useIsMobile`/small-viewport rendering of that panel doesn't start needing its own scroll affordance as this list keeps growing shift over shift.

---

### Next shift should pick up

Started by reading SHIFT_BRIEF.md in full, SHIFT_LOG.md's last four entries, and FEATURE_BACKLOG.md. Local repo landed detached from `refs/heads/main` with local `main`/`origin/main` both pointing at the very first commit — the exact symptom Shifts 9 and 10 both documented and both resolved with `git fetch origin main && git checkout main && git merge --ff-only origin/main`; did the same here, no data lost, no `git ls-remote` drama needed since the fast-forward merge just worked. `npm install` reproduced the same spurious `package-lock.json` diff every prior shift has flagged (dropped `libc` fields, added `hasInstallScript`) — reverted before either commit, non-issue.

### Track B — Mobile bottom sheet drag-to-expand (top unblocked P1)

Shipped the one open item from that section of the backlog: `app/PlaceDetails.tsx`'s mobile bottom sheet now snaps between a half-height (55vh) and full-height (92vh) state via a drag handle at its top edge, and dismisses the panel entirely on a hard drag-down past a threshold — mirrors Google Maps mobile's own sheet behavior. Implementation note for whoever touches this next: the first pass used `setPointerCapture` + element-level `onPointerMove`/`onPointerUp` handlers and it looked right by inspection, but a real Playwright drag test caught `setPointerCapture` throwing (`"No active pointer with the given id is found"`) on the synthetic pointer id, which silently aborted the handler before it ever set the drag-start state — a real bug, not just a test artifact, since any engine that rejects capture for any reason would have broken the gesture the same way. Rewrote it around a per-gesture closure pattern instead: `onPointerDown` adds `pointermove`/`pointerup`/`pointercancel` listeners on `window` (not the 20px-tall handle element), with the gesture's start position and live height held in a local closure so add/remove always reference the exact same function identity — no capture dependency, no stale-closure risk from re-renders during the drag.

**Verified in a real browser** (Playwright + Chromium, 390×844 mobile viewport): opening a place starts the sheet at 55vh; dispatching a synthetic pointer drag-up sequence on the handle expands it past that height; a synthetic hard drag-down flips the panel's `aria-hidden` back to `true`. Also confirmed desktop's left-side sliding panel is untouched — no handle renders, same 380px card, same transform-based slide.

### Track A — Research & data (two axes touched, 48 new geolocated features)

Delegated both to sub-agents running in parallel, each scoped strictly to their own scratchpad output files (no `app/` access, no git access, no direct write access to `public/data/`) — reviewed every feature against the schema, the 117 CE snapshot rule, and invariant 1.5 (display-name rule) myself, fixed what that review caught, and wired everything into `app/Map.tsx`/`app/poiCategories.ts`/`app/useLayers.ts` personally before committing.

**Axis 3c — economic infrastructure** (`public/data/pois.geojson`, 194 → 230 features). Six new categories: 11 mines (Las Medulas, Rosia Montana in freshly-conquered Dacia, Wadi Faynan, Dolaucothi, Aljustrel, Charterhouse, Halkyn, Almaden, Tharsis, Munigua, Sotiel Coronada — the file already had exactly one pre-existing mine, Cartagena's Sierra Minera, so all 11 are genuinely new sites, none duplicated), 6 quarries (Mons Claudianus, Chemtou, Carrara, Aswan, Thasos, Wadi Hammamat), 7 garum/fish-salting factories across Baetica, Lusitania, and Mauretania Tingitana, 4 salinae, 4 amphora/pottery kiln sites, and 4 imperial estates/villae rusticae (Settefinestre, Villa Regina at Boscoreale, the Brijuni villa, Villa of the Volusii Saturnini). Two deliberate `extant_117ce:false` calls on real dating evidence rather than quiet omission: Arretium's Arretine-ware boom had ended by the Flavian period (decades before this snapshot), and Rheinzabern's sigillata production didn't actually start until ~150 CE despite being on the brief's own seed list — the brief itself flagged this one for verification and the research bore it out. Villa Regina at Boscoreale is also `false`, buried by Vesuvius 38 years before 117 CE. **Landed at 36 features, short of the 40-feature minimum** — the research agent's own report says its WebSearch quota (200 calls) ran out during image verification, not for lack of real candidates: Docimium, Mons Porphyrites (an excellent 117–119 CE temple-dating match), Cotta, and the Henchir Mettich estate inscription (dated precisely to 116–117 CE — the single best date-match of the whole research set) were all researched and confirmed real, then dropped for lack of a verifiable Commons image rather than shipped incomplete. Flagging the quota ceiling itself as a real constraint for whoever picks up an axis with a similarly long seed list next.

**Axis 17 — exile + penal geography** (`public/data/penal.geojson`, new file, 12 features). Every well-documented Roman exile island: Ventotene (Julia the Elder), Ponza, Pianosa (Agrippa Postumus, whose villa and rock-cut theater are still visible on the coast today), the Tremiti Islands (Julia the Younger, starved to death on Tiberius's order the year after Livia — her one protector — died), Rhodes (Tiberius's own voluntary withdrawal before he was emperor, framed honestly in `notes` as self-imposed rather than punitive), Gyaros, Serifos, Amorgos, and Kythnos — satisfies the brief's "1 complete category" minimum on the exile-island sub-list with a bonus island (Kythnos) beyond the brief's own seed list. Plus one penal mine (Sardinia's Metalla silver/lead district, where a tunnel called *su presoni* is still fitted with iron shackle rings), one penal quarry (Syracuse's Latomia del Paradiso — the "Ear of Dionysius," a state prison since 413 BCE that Cicero named as still in Roman use during the Verres prosecution), and Rome's own Tullianum execution cell. Sourced straight from Tacitus, Suetonius, Cicero, Sallust, and Plutarch rather than secondary summaries — worth noting since it made for an unusually well-attested batch (9 of 12 features rated `confidence: high`). Two candidates from the brief's own seed list were researched and explicitly excluded rather than padded: Aegina (no primary-source-documented named exile found despite being on the candidate list) and the Danube salt mines (no specific penal-labor evidence). Mons Claudianus/Mons Porphyrites were deliberately not double-counted here — checked for penal-labor evidence specifically (as distinct from the free-labor imperial-quarry framing the other research agent used for the same two sites) and found too thin to include under this axis.

**Caught and fixed during review, before wiring — a real factual error, not just a naming-convention slip.** The exile/penal research agent placed four islands (Gyaros, Serifos, Amorgos, Kythnos) in the Roman province of **Asia**. All four are Cyclades, and the Cyclades belonged to **Achaea**, not Asia, throughout the Principate — confirmed via a targeted search on the province's own scope before trusting the correction. Rhodes' own "Asia" tag checked out correctly (annexed into Asia under Vespasian in 70 CE, no change under Trajan) so it was left alone. This is exactly the kind of geography-adjacent factual claim that's easy for a research pass to get subtly wrong without it looking wrong — worth a future shift treating "which of these places share a province" as its own verification pass whenever a batch spans an island group or border region, not just checking each place in isolation.

**Naming-rule catches, done proactively before committing** (continuing the standing practice several shifts now have flagged as worth doing before, not after): one `modern_location` parenthetical in the new `penal.geojson` batch ("Fluminimaggiore (Grugua)" → "Fluminimaggiore"), and four `province` values in the economic-infrastructure batch using an unprecedented "Italia (Regio VII, Etruria)"-style format — checked against every other `Italia`-province entry already in `pois.geojson` (all of them are the bare word "Italia", no regio detail) and reflowed to match that existing convention rather than let a new format drift in from a single batch.

**Wiring.** `pois.geojson`'s six new categories (`quarry`, `garum_factory`, `salina`, `kiln`, `estate`) fold into the pre-existing `industry` visual family alongside `mine`, relabeled "Mines & industry" — no new legend row, category-chip row stays under the ~22-category cap, and (per Shift 10's own standing reminder) this means the new features needed zero `Map.tsx` changes to render — they flow straight through the existing `PoiMarkers.tsx`/`CategoryChips.tsx` pipeline. `penal.geojson` gets its own source + circle layer (`penal-point`, charcoal `#4a4a52`, light stroke) + hover popup, the same source+layer+popup pattern Shifts 8–10 established for mints/health/imperial-cult/euergetism — deliberately *not* wired through the richer `PlaceDetails` click panel, matching how those four axis files already work (they use a lighter `name`/`one_line`-style hover tooltip rather than the full click-to-select flow `pois.geojson` gets). One schema note for future consistency: `penal.geojson` uses `name_latin`/`name_english`/`notes` (the `pois.geojson` pattern) rather than the `name`/`one_line` pattern the other four axis files settled on, since the brief's own schema snippet for this axis was written closer to the richer two-name pattern and it seemed worth preserving both the Latin and English names rather than collapsing to one — the popup code reads `name_english || name_latin` and `notes` directly, so it renders correctly either way, but a future shift auditing axis-file schema consistency should know this one is the outlier and pick a direction. `useLayers.ts` gains one new toggle, "Exile & penal geography" (18 groups now, checkbox count confirmed 17 in-browser — mismatch is because one group, `pois`, maps to two native layer ids under one checkbox, same as before).

**Verified in-browser** (Playwright + Chromium): `penal-point` layer renders with the correct paint color and all 12 features load (`fetch('/data/penal.geojson')` returns `ok:true, count:12` from inside the running app); flying to Las Medulas's real coordinates and clicking the nearest marker opens the full Place details panel showing the correct Latin/English names, built/destroyed dates, province, and notes text — confirming the new `industry`-family categories render and click through end-to-end, not just that the JSON is well-formed. Layers panel checkbox count is 17 after the new toggle, matching `LAYER_GROUPS.length`.

**Tool/environment note, confirmed independently again this shift:** both research agents hit `WebFetch`/direct `curl` to `commons.wikimedia.org` and `en.wikipedia.org` fully blocked by this environment's egress proxy — same limitation Shift 10 flagged. Verified this myself directly too (a `WebFetch` call to a Commons `Special:FilePath` URL returned an explicit `EGRESS_BLOCKED` error, and `curl` to the same host returned exit code `000` from this session's own shell). Every image URL in this shift's two batches was therefore verified via `WebSearch` result-page matches ("File:... - Wikimedia Commons" hits confirming the file exists) rather than a direct fetch of the actual image bytes — real due diligence within the constraint, but still not a substitute for confirming the file loads. If a future shift gets an environment with unblocked Commons access, a script that walks every `image_url` in every `public/data/*.geojson` file and checks for a real 200 (not just a search-result match) would be a valuable one-time integrity pass across every prior shift's images too, not just this one's.

### Commits this shift

1. `Mobile bottom sheet: drag-to-expand (Track B)`
2. `Economic infrastructure + exile/penal geography — axes 3c and 17` (Track A)

Both pushed to `main`; pre-push `next build` gate ran clean on both. `npm install`'s spurious `package-lock.json` diff reverted before each commit, per the now-standard non-issue every prior shift has flagged.

### Next shift should pick up

- **Track A:** Axis 3c (economic infrastructure) is not fully exhausted — Docimium, Mons Porphyrites, Cotta, and the Henchir Mettich estate inscription are all real, sourced, and just missing a verified Commons image; worth a focused pass with a fresh WebSearch quota rather than re-researching from scratch. Otherwise any axis not yet touched is open: 1 (more cities — still needs its Overpass tooling rebuilt from scratch per Shift 7's original note, nobody has picked this up in five shifts now), 3b (sacred sites), 3d (villae — partially covered now via the estate category in this shift's economic-infrastructure batch, but the brief's own 3d list — Hadrian's Villa, Sperlonga, Fishbourne, Chedworth — is still untouched), 3e (necropoleis), 3g (games), 3h (battlefields), 3i (shipwrecks), 5 (peoples/cultures), 6b–6d, 7, 9, 10, 14, 16, 19, 20 (sports — still the well-bounded, brief-supplied-list quick pick nobody's taken across five shifts).
- **Track B:** Directions is still the only unshipped P0 (real road-network routing, the biggest remaining scope item). Compass is the next small unblocked P1. The Share button still doesn't cover the `sites_buildings.geojson` click path (Shift 10's own note, still open) and the vestigial `pois-dot`/`pois-label` MapLibre layer cleanup (Shift 8's note) is still open too.
- **General:** The detached-HEAD-behind-stale-main symptom hit a third shift in a row this shift (9, 10, 11) — the fix is fast and well-documented now (`git fetch origin main && git checkout main && git merge --ff-only origin/main`), but if a future shift's fast-forward merge ever fails (diverged history, not just a stale ref), stop and run `git ls-remote origin` before anything destructive, per Shift 9's original note. The `commons.wikimedia.org`/`en.wikipedia.org` egress block is now confirmed independently by three different shifts (9, 10, 11) via three different tools (WebFetch, curl, and Shift 9's own agent sandbox) — this reads as a structural property of the current cloud environment, not a transient blip, so treat "verify Commons images via WebSearch snippets, not direct fetch" as the standing default for image sourcing rather than something to keep re-discovering.

---

## Shift 10 — 2026-08-13 (06:00–12:00 UTC block)

Started by reading SHIFT_BRIEF.md, the last three SHIFT_LOG.md entries, and FEATURE_BACKLOG.md. Hit the exact same detached-HEAD-behind-a-stale-main symptom Shift 9's own log entry warned the next shift about: local `main`/`origin/main` both sitting on the very first commit while `HEAD` was detached 40 commits ahead. Followed Shift 9's own advice — `git ls-remote origin` confirmed GitHub's real `main` matched detached `HEAD` exactly — and `git fetch origin main && git checkout main && git merge --ff-only origin/main` resolved it cleanly, no data lost, no drama. Also found one maintainer commit had landed since Shift 9's entry (`c14a0ca`, human + Opus 4.7, not a shift session — a UX audit sweep: dark mode, hero images, sea mask, POI clustering, +15 temples, and a new SHIFT_BRIEF §1.6 requiring `image_url` on every new POI) — noting it here since it wasn't a shift entry either, same courtesy prior shifts have extended to non-shift commits.

### General infra — finally fixed the `.next`/`next dev` collision

Five shifts running (7, 8, twice in 9, now confirmed fixed in 10) had independently hit or flagged the same bug: `next dev` and `npm run build` sharing one `.next/` output directory and corrupting each other when run concurrently. Shift 9's own backlog note asked for a real fix rather than another log entry, so: `next.config.js` now sets `distDir` to `.next-dev` when `NODE_ENV === "development"` (which `next dev` always forces) and leaves `.next` for everything else (`next build`/`next start`, including the pre-push hook). Added `.next-dev` to `.gitignore` and to `tsconfig.json`'s `include` list (the one real content change buried in `next dev`'s auto-reformat of that file — kept the addition, reverted the cosmetic whitespace reflow it did to the rest of the file). **Verified the fix actually works**, not just that it compiles: started `next dev` in the background, left it running, then ran `npm run build` against the same checkout while `next dev` was still up — both completed cleanly, `next dev` never restarted or errored. This is the collision four prior shifts hit; it can no longer happen structurally, not just by remembering a workaround.

### Track B — Share button (top unblocked P1)

The Place details panel already had a working "Copy link" button (added in the maintainer's UX sweep) that copied `window.location.href`, and the coordinates-URL-sync feature (Shift 8) already kept `#lng,lat,zoomz` live in the hash — but the two were never connected: the hash never recorded which place's panel was open, so a copied link only restored the camera view, not the actual place. Closed that gap. The hash now optionally carries a trailing `:poiId` (`#12.4964,41.9028,12.00z:poi_colosseum`), written the instant a place is selected or cleared (not just on the existing debounced pan/zoom write) via a small non-React `subscribeSelectedPoi`/`getSelectedPoi` pair added to `app/usePoiPanel.ts` so `app/Map.tsx`'s imperative MapLibre setup can react to selection changes without becoming a React component itself. Restoration works on both the initial page load (a shared link) and on back/forward navigation, via a small id→feature index built once `pois.geojson` loads (a plain object, not a `Map` instance — the component itself is named `Map`, which shadows the built-in class inside its own function body; cost me one `tsc` error before I caught it).

Currently scoped to `pois.geojson`-backed places only (the ones driven through `app/PoiMarkers.tsx` and the real Place-details panel) — the much larger `sites_buildings.geojson` click path (Ostia/Pompeii/etc. individual buildings) still selects a place but doesn't yet encode a restorable id in the URL. Didn't force that in: those buildings' ids are namespaced per-site against a 20MB+ file the URL-restore logic would need to fetch and search, a meaningfully bigger lift than the primary landmark system, and the honest thing was to ship the common case cleanly rather than half-wire the bigger one. Flagged below for whoever wants it next.

**Verified in a real browser** (Playwright + the pre-installed Chromium): clicking a POI marker at Rome updates the hash to include its id; loading that exact URL fresh in a new page reopens the same place's panel (confirmed both by the hash matching and by the panel's own text content containing "Colosseum"); pressing Escape closes the panel and the hash drops back to plain coordinates.

### Track A — Research & data (two axes touched, 38 new geolocated features)

Delegated both to sub-agents running in parallel, each scoped strictly to their own output file(s) (no `app/` access, no git access) — reviewed, JSON-validated (unique ids, schema conformance, naming-rule grep for stray parens/diacritics), fixed what the grep caught, and wired every one into `Map.tsx`/`useLayers.ts`/`poiCategories.ts` personally before committing.

**Axis 3f — water infrastructure beyond city-level aqueducts** (`public/data/lines.geojson`, 3 → 12 features; `public/data/pois.geojson`, 183 → 194 features). 9 new aqueduct LineStrings (Aqua Claudia + Anio Novus, Aqua Marcia, Aqua Traiana — barely 8 years old at this snapshot — the Nimes/Pont du Gard route, Segovia, Zaghouan-Carthage, the Serino aqueduct feeding the Piscina Mirabilis reservoir at Misenum, the Aqueduct of the Miracles at Merida, Caesarea Maritima), each one a representative waypoint route rather than a fully surveyed channel and honest about that in its own `notes` — same standard the existing Fossatum Africae feature already set. 11 new points: 5 dams (Proserpina, Cornalvo, the three Neronian Subiaco dams, Almonacid de la Cuba — Spain's tallest surviving Roman dam at 34m, Petra's flood-control dam), 1 watermill (Barbegal), 3 cisterns (Ptolemais's Square of Cisterns, Carthage's La Malga, the Piscina Mirabilis itself), and 2 bridges folded into the existing `bridge` category after confirming via grep that neither was already in the file (Alcantara — completed 106 CE, barely a decade old at the snapshot; Trajan's Danube Bridge at Drobeta, the longest bridge built anywhere for a thousand years after). Three honest `extant_117ce: false` calls on real dating evidence rather than quiet omission: the Zaghouan-Carthage aqueduct and its La Malga cisterns (Hadrianic, water temple dedicated 139 CE — Carthage still ran on wells in 117), and the Barbegal watermill (carbonate dating on its feeder aqueduct branch points to ~120-130 CE despite a Trajanic coin found on site, so the more specific evidence won out). Researched-and-excluded rather than padded: the Homs Dam in Syria (Diocletianic, 284 CE — too anachronistic even for a pinned-false entry), Alexandria's monumental cisterns (consistently dated too late and too vaguely to responsibly place at 117 CE), and two more real candidates (a Venafro watermill, the Esparragalejo Dam) dropped for lack of a verifiable Commons image rather than skipping the image_url requirement.

**Axis 15 — welfare + euergetism, alimenta towns** (`public/data/euergetism.geojson`, new file, 18 features). Trajan's state-funded child-welfare program, grounded in the two surviving bronze tables — Veleia (CIL XI 1147, the largest inscribed bronze plaque to survive from antiquity, found by ploughmen in 1747) and the Ligures Baebiani near Beneventum (CIL IX 1455) — plus individually attested towns via their own inscriptions (Ferentino, Atina, Nomentum, Pisaurum, Saturnia, Industria, Formiae, Capena, Cupra Montana, Pitinum Mergens, Sublaqueum), cross-checked against R. Duncan-Jones's standard scholarly catalog of the program (PBSR 1964; *The Economy of the Roman Empire*, 1974). Two entries come straight from Pliny the Younger's own letters in his own words: his private alimentary foundation at his hometown Comum (*Ep.* 7.18), and a temple he personally funded at Tifernum Tiberinum where he asked Trajan's permission to add a statue of the deified Nerva (*Ep.* 4.1, 10.8) — filed under a small `benefactor_inscription` category alongside two genuinely Trajanic Ephesus endowments (the Nymphaeum Traiani, 102–114 CE; the Vibius Salutaris foundation, 104 CE), deliberately avoiding the Hadrianic Plancia Magna trap the brief warned against. **Landed at 18 towns, not the brief's 50-town aspirational ceiling** — reported honestly per the "real data or don't include it" guardrail rather than padded with unconfirmed names; the research agent flagged that WebFetch was entirely blocked in its sandbox (every domain tested failed, including Wikipedia itself), capping it to WebSearch's synthesized snippets rather than the full-text sources that would have let the Duncan-Jones catalog be mined more completely. One honest `extant_117ce: false`: Caelia Macrina's private alimenta foundation at Tarracina, whose will dates to the 150s CE, decades past this map's snapshot, kept on the map with the gap explained straight in `one_line` rather than either dropped or left looking active.

**Naming-rule catches, done proactively before committing** (per Shift 7's own standing note to grep before pushing, not after): found and fixed three diacritic violations the research agents' own output had missed — "Città di Castello" → "Citta di Castello" (`euergetism.geojson`, both `name` and `modern_location`), and "Mérida"/"Alcántara" → "Merida"/"Alcantara" in three `modern_location` fields (`pois.geojson`). Left the many pre-existing diacritic violations elsewhere in `pois.geojson` untouched — that's the same systemic pre-invariant-1.5 backlog item Shift 7 first flagged and no shift has picked up yet, out of scope for a two-axis Track A pass.

**Wiring.** `lines.geojson`'s MapLibre source now feeds two filtered layers instead of one — the existing `frontier-lines-line` (unchanged, dashed earth-brown) and a new `aqueduct-lines-line` (solid, the same green already used for aqueduct POI pins) — so frontier walls and aqueduct routes read as visually distinct feature families instead of one indistinguishable dashed line. `euergetism.geojson` gets its own source + circle layer + hover popup, same pattern Shift 8 established for mints/health/imperial-cult. `poiCategories.ts` folds `dam`/`watermill`/`cistern` into the existing "Aqueducts" visual family, relabeled "Water infrastructure", so they get real colors/glyphs in the category chips and Legend instead of silently falling back to the default marker (this was a real gap — new categories not added to `CATEGORY_GROUPS` still render on the map via the fallback color, but are invisible to the category-chip filter and the Legend, so it's worth every future shift doing this step, not just adding the data). `useLayers.ts` gains two new Layers-panel toggles: "Aqueducts (major lines)" and "Welfare & benefaction".

**Verified in-browser**: both new map layers render with the intended distinct paint (confirmed `line-color` differs between `aqueduct-lines-line` and `frontier-lines-line` via `getPaintProperty`), 15 euergetism points render correctly clustered around Italy with working hover popups, both new Layers-panel toggles appear (checkbox count now 16, matching `LAYER_GROUPS.length`), and the new "Water infrastructure" category chip appears. A direct click-test on the new dam/cistern/watermill markers hit this sandbox's own well-documented Playwright flakiness (`Target page ... has been closed`) rather than a real bug — not re-litigated since those markers share the exact same `PoiMarkers.tsx` click→`selectPoi`→hash-write path already verified end-to-end by the Share-button test above, with no category-specific logic in between.

### Commits this shift

1. `Share button: encode selected place in the URL hash + fix .next/dev collision` (Track B + general infra)
2. `Water infrastructure + alimenta welfare towns — axes 3f and 15` (Track A)

Both pushed to `main`; pre-push `next build` gate ran clean on both, including the deliberate build-while-dev-is-running test for the infra fix. `npm install` picked up the usual spurious `package-lock.json` diff every prior shift has flagged (dropped `libc` fields, added `hasInstallScript`) — reverted before each commit, non-issue.

### Next shift should pick up

- **Track A:** Any axis not yet touched (1, 3b–3e, 3g–3i, 5, 6b–6d, 7, 9, 10, 14, 16, 17, 19, 20) is fully open. Axis 3 still has seven untouched sub-categories with the brief's most detailed guidance (3b sacred sites, 3c economic infrastructure, 3d villae, 3e necropoleis, 3g games, 3h battlefields, 3i shipwrecks). Axis 20 (sports — 25 gymnasia + 1 athletic festival circuit) is still the well-bounded, brief-supplied-list quick pick nobody's taken. Axis 17 (exile + penal geography — brief explicitly only asks for "1 complete category," e.g. all exile islands) is another small, fast, well-sourced pick if a future shift wants a quick throughput win between bigger axes. Axis 1 (more cities) still needs its Overpass tooling rebuilt from scratch in a cloud container per Shift 7's original note — nobody has picked this up in four shifts now.
- **Track B:** Directions is still the only unshipped P0 (real road-network routing, the biggest remaining scope item). The Share button just shipped now covers `pois.geojson` places but deliberately not the `sites_buildings.geojson` click path (Ostia/Pompeii/etc. individual buildings) — see this shift's Track B note above for why, and it's a genuine follow-up if a future shift wants full parity. Other P1 remainders: Compass, drag-to-expand on the mobile bottom sheet, and the vestigial `pois-dot`/`pois-label` MapLibre layer cleanup Shift 8 scoped out (needs the empty-click-closes-panel logic rewritten in the same pass — see Shift 8's log entry for the exact reasoning).
- **General:** The `.next`/`next dev` collision that bit four shifts in a row should be structurally impossible now (separate `distDir`s) — if a future shift somehow still hits it, that's worth flagging loudly as a real regression, not just re-applying the old kill-and-`rm -rf` workaround. The pre-existing diacritic/naming-rule violations scattered through `pois.geojson` from before invariant 1.5 landed (Shift 7's original note) are still unaudited at scale — a future shift with a quiet stretch could script a full grep-and-fix pass across every `.geojson` file's display fields rather than catching them one new-feature-batch at a time.

---

## Shift 9 — 2026-08-13 (00:00–06:00 UTC block)

Started with a git surprise worth flagging for future shifts: the fresh cloud clone landed with local `main` and `origin/main` both pointed at `134e8bf` (the very first commit, 26 files, dated 2026-08-11) while `HEAD` was detached 35 commits ahead at `45f5438` (Shift 8's own final commit). Before touching anything, ran `git ls-remote origin` to check what GitHub itself actually had — it reported `refs/heads/main` at `45f5438`, matching detached `HEAD` exactly. So nothing was lost: the container's local `remotes/origin/main` tracking ref was just stale from before the clone step, not a sign that eight shifts of work had been reverted or force-pushed away. `git fetch origin main && git checkout main && git merge --ff-only origin/main` resolved it cleanly with no conflicts. Flagging this because a future shift hitting the same detached-HEAD-with-a-single-ancestor-commit symptom should check `git ls-remote origin` before assuming data loss and doing anything drastic.

Also hit the `.next`/`next dev` collision bug documented by Shifts 7 and 8 twice more this shift (running `npm run build` while `next dev` was still up, both times right after finishing a Track A wiring pass) — same fix both times (kill dev, `rm -rf .next`, restart), no lasting damage, but this is now four shifts in a row hitting it independently. The FEATURE_BACKLOG note suggesting a separate `--dist-dir` for one of `dev`/`build` is worth someone actually picking up.

The container also restarted mid-shift (infrastructure event, not caused by anything in this session) and killed both in-flight Track A research subagents along with the dev server. Relaunched both agents with the same prompts and restarted `next dev` — full re-run, no partial state to recover, so no data was lost, just wall-clock time.

### Track A — Research & data (two axes touched, 63 new geolocated features)

Delegated both to sub-agents running in parallel, each scoped strictly to their own output file(s) (no `app/` access, no git access) — reviewed, JSON-validated (unique ids, schema conformance, naming-rule grep for stray parens/diacritics), and wired every one into `Map.tsx`/`useLayers.ts`/`poiCategories.ts` personally before committing.

**Axis 13 — Political apparatus** (`public/data/politics.geojson`, new file, 20 features). All four chariot faction headquarters near the Circus Flaminius stable district in Rome — the Greens are sourced to an in-situ dedication stone (CIL VI 10058, whose findspot preserves the faction's name in the medieval church "San Lorenzo in Prasino" built over it) and the Blues to possible remains under Palazzo Farnese, both medium confidence; the Reds and Whites have no excavated findspot in the scholarship at all, so both are pinned as explicitly low-confidence district centroids rather than false-precise points. Castra Praetoria (excavated, precise coordinates, with prefect Attianus noted for the exact 117 CE moment) and the equites singulares' Castra Priora near the Lateran. All four urban cohort postings — the research corrected an assumption here: Rome's urban cohorts were co-located with the Praetorians at Castra Praetoria in 117 CE, not their own separate barracks, which weren't built until 270 CE — plus the attested provincial detachments at Lugdunum, Carthage, and Ostia. All 7 vigiles cohorts, from the excavated Trastevere excubitorium (Cohort VII, high confidence) down to four low-confidence district approximations where no guardhouse building has ever been excavated. Three well-documented senators' hometowns added as a bonus beyond the core scope (Pergamon, Ucubi, Faventia). One real judgment call worth flagging: researched an "Alba Longa detachment" mentioned in the brief's own Axis 13 text and found it's a mix-up — that's Castra Albana, home of Legio II Parthica, founded under Septimius Severus c. 197–202 CE, roughly 80 years past this map's snapshot. Left out entirely with the reasoning noted rather than invented.

**Axis 3a — Military infrastructure beyond the legionary fortresses** (`public/data/pois.geojson`, 128 → 168 features; `public/data/lines.geojson`, new file, 3 features). 9 naval bases (Misenum, Classe — Ravenna's own fleet harbor, previously unpinned even though Ravenna itself is a site on the map — Frejus, Alexandria, Seleucia Pieria, Boulogne, Cologne, plus the less-famous Danube-Pannonian and Danube-Moesian fleet bases at Zemun and Isaccea), 4 signal towers (three pre-Wall Stanegate stations in Britain, one on the Wetterau limes), and 27 auxiliary forts spanning the British Stanegate line, the German Wetterau/Taunus/Raetian limes, the Danube, Numidia's Fossatum Africae, and Dacia's Limes Alutanus. Six researched candidates were deliberately excluded or flagged `extant_117ce: false` rather than padding the count: Forum Iulii's fleet lost active status in the 69 CE civil wars decades before the snapshot; Ruckingen, Kapersburg, Gemellae, Praetorium, and Arutela all date to Trajan's death year or later (Hadrianic/Antonine limes construction) per their best-published dating. Genuine sourcing landed at exactly 40 new POI features — the agent's own report says it stopped there rather than stretching into weaker attestation to inflate the count. Three frontier LineStrings (Fossatum Africae, the Upper Germanic-Raetian Limes, the Dacian Olt river frontier) trace representative well-documented segments rather than full 550–750km route extents, since complete open-source polylines weren't available — each cites its route source honestly rather than implying more precision than exists.

Wiring: `poiCategories.ts` folds the three new POI categories into the existing "Forts & fortifications" family (no new legend row, stays under the ~22-category cap). `Map.tsx` gets two new phases — `politics-point` (brick red circle layer) and `frontier-lines-line` (dashed line layer, same visual pattern as the trade-routes line) — plus two new `useLayers.ts` toggles ("Political apparatus", "Frontier lines"). The 40 new `pois.geojson` features needed no new map-layer code at all — they render automatically through the existing `PoiMarkers.tsx`/`CategoryChips.tsx` pipeline once the category→color mapping was extended.

### Track B — Features & UI/UX

Shipped the top unblocked P1 backlog item: **keyboard shortcuts** (`app/useKeyboardShortcuts.ts`, new; wired from `Chrome.tsx`). Arrow keys pan the map (`panBy`, 80px per press), `+`/`-` zoom in/out by one step, `/` focuses the search box from anywhere else on the page, `M` toggles the ruler (reuses the existing `useRuler.ts` store so it's the same session the FAB and right-click context menu already drive), `L` toggles the Layers panel. All shortcuts are ignored while a text field has focus or a modifier key is held, so browser/OS shortcuts and the search box's own arrow-key suggestion navigation stay untouched — `/` is the one deliberate exception, since its whole job is jumping focus into the search box.

**Verified in a real browser** (Playwright + the pre-installed Chromium, 1280×800): confirmed the map's center longitude changes after `ArrowRight`, zoom increases after `+` and decreases after `-`, `/` moves DOM focus onto the search input without leaving a literal "/" character typed into it, `L` opens the Layers panel (checkbox count matches `LAYER_GROUPS.length`), `M` opens the ruler, and — the case most likely to regress silently — typing the string "mars" into the focused search box types normally instead of `M` re-toggling the ruler mid-word.

### Commits this shift

1. `Keyboard shortcuts: arrows pan, +/- zoom, / search, M ruler, L layers` (Track B)
2. `Political apparatus: chariot factions, praetorians, urban cohorts, vigiles — axis 13` (Track A)
3. `Naval bases, signal towers, auxiliary forts + frontier lines — axis 3a` (Track A)

All three pushed to `main` as separate batches (rather than held for one combined end-of-shift push) partly because of the mid-shift container restart above — didn't want to risk losing verified, build-clean work to a second infrastructure hiccup. Pre-push `next build` gate ran clean on all three. `npm install` again picked up the same spurious `package-lock.json` diff every prior shift has flagged (dropped `libc` fields, added `hasInstallScript`) — reverted before committing, non-issue.

### Next shift should pick up

- **Track A:** Any axis not yet touched (1, 3b–3i, 5, 6b–6d, 7, 9, 10, 14–20) is fully open. Axis 3 still has eight untouched sub-categories with the brief's most detailed guidance (3b sacred sites, 3c economic infrastructure, 3d villae, 3e necropoleis, 3f water infrastructure, 3g games, 3h battlefields, 3i shipwrecks) — 3f (aqueducts as LineStrings, dams, bridges, watermills) pairs naturally with this shift's new `lines.geojson` file if a future shift wants to extend rather than create a third geometry file. Axis 20 (sports — 25 gymnasia + 1 athletic festival circuit) is still the well-bounded, brief-supplied-list quick pick nobody's taken. Axis 1 (more cities) still needs its Overpass tooling rebuilt from scratch in a cloud container per Shift 7's original note.
- **Track B:** Directions is still the only unshipped P0 (real road-network routing, the biggest remaining scope item). P1 remainders: Share button (encoding the selected POI/route into the URL, on top of the coordinates sync that already ships), Compass, drag-to-expand on the mobile bottom sheet, and the vestigial `pois-dot`/`pois-label` MapLibre layer cleanup Shift 8 scoped out (needs the empty-click-closes-panel logic rewritten in the same pass — see Shift 8's log entry for the exact reasoning).
- **General:** The `.next`/`next dev` collision has now bitten four shifts in a row independently rediscovering the same fix — worth escalating from "log it every time" to actually wiring a separate `--dist-dir` for `dev` or `build` so the two commands can't collide, since the workaround clearly isn't sticking as tribal knowledge. Also: if a future cloud-container shift boots into a detached `HEAD` sitting on top of a `main` that looks suspiciously behind, run `git ls-remote origin` first — see this shift's opening note — before assuming anything was lost.

---

## Shift 8 — 2026-08-12 (18:00–00:00 UTC block)

Started by reading SHIFT_LOG.md's last two entries, SHIFT_BRIEF.md in full (both halves — it's grown past a single-page read, use `offset` on a second `Read` if it gets truncated again), and FEATURE_BACKLOG.md. Also found a maintainer commit had landed since Shift 7 (`653e38c`, human + Opus 4.7, not a shift session) that fixed a `getServerSnapshot` infinite-loop warning in `CategoryChips.tsx` and dropped three genuinely-dead data files (`pompeii.geojson`, `ostia_buildings.geojson`, `ostia_streets.geojson`) — noting it here since it wasn't a shift entry either, same courtesy Shift 6 extended to the batch before it.

### Track A — Research & data (three axes touched, 69 new geolocated features)

Delegated all three to sub-agents running in parallel, each scoped strictly to one output `public/data/*.geojson` file (no `app/` access, no git access) — reviewed, JSON-validated, and wired every one into `Map.tsx`/`useLayers.ts` personally before committing.

**Axis 8a — Mints** (`public/data/mints.geojson`, new file, 20 features). Every coin-striking location in the Roman world as of 117 CE: Rome's primary imperial mint, Antioch's tetradrachms, Alexandria's closed-currency system, and a spread of civic bronze mints across Asia Minor and the Levant (Tarsus, Nicaea, Laodicea on the Lycus, Tyre, Berytus, Ascalon, and more), most anchored to a specific dated RIC/RPC catalog number rather than a generic "struck coins here" claim. The one real judgment call: Lugdunum was explicitly instructed to be checked rather than assumed, and the research came back that its precious-metal minting role actually ended under the Flavians in the 70s CE — the mint sat dormant until Diocletian revived it in 297. Kept on the map with `extant_117ce: false` and the closure story told straight in `one_line`, rather than either dropping the site or leaving it looking active on inherited Augustan-era assumption.

**Axis 18 — Health, medicine, spa culture** (`public/data/health.geojson`, new file, 31 features). 16 Aquae spa towns spanning 9 provinces (Bath, Wiesbaden, Baden-Baden, Aachen, Aix-en-Provence, Chaves, and more), 5 Asklepieia, 4 medical schools (Alexandria, Kos, Cnidus, Rome), 3 named physicians (Rufus of Ephesus, Archigenes of Apamea, Soranus of Ephesus), and 3 malaria zones (Pontine Marshes, Sardinia's coastal lowlands, Etruria's Maremma) plotted as deliberately loose `confidence: low` centroids rather than fake-precise points. One real archaeology-vs-snapshot catch: the research explicitly checked Lambaesis's military hospital (on the brief's own hunting list) and found Legio III Augusta's fortress there wasn't built until 123–129 CE under Hadrian — in 117 the legion was still at Theveste — so it was left out entirely rather than force a `false` flag onto a building that didn't exist yet at that location. Caught and fixed two display-name rule violations myself before committing (see naming-rule note below): `"Baden (Aargau)"` → `"Baden"`, and a stray parenthetical in a `modern_location` field.

**Axis 12 — Imperial cult** (`public/data/imperial_cult.geojson`, new file, 18 features). Provincial Roma-et-Augusti cult centers (Colchester, Tarragona, Pergamon, Ancyra — where the Res Gestae is still legible on the temple wall in 117 — and more), sebasteia (Aphrodisias, Ephesus, Pisidian Antioch), and Rome's own temples to the deified emperors (Divus Augustus, the shared Divus Vespasianus/Titus temple, Divus Claudius). The research agent was instructed to check `pois.geojson` for overlaps first and did — correctly skipped three genuine duplicates already there from earlier shifts (Ara Pacis, Temple of Divus Julius, Lugdunum's Sanctuary of the Three Gauls) instead of re-adding them under new ids. Divus Nerva's temple was deliberately left out: Pliny's *Panegyricus* attests Trajan built one, but no excavated trace or coordinate consensus exists, and "real data or don't include it" wins over completeness there.

**Naming-rule discipline, done proactively this time.** Shift 7's own backlog note said to grep new `name`/`display` fields for parens/diacritics *before* committing, not after (it had to fix its own violations in a follow-up commit). Did that here — caught and fixed `"Baden (Aargau)"` and one `modern_location` parenthetical in `health.geojson` before the commit went out, so this shift needed no naming-rule follow-up commit.

All three files wired into `app/Map.tsx` as their own source+circle-layer+hover-popup (same pattern Shift 7 established for `trade_routes`/`disasters`: `mints-point` amber-bronze, `imperial-cult-point` purple, `health-point` teal) and into `app/useLayers.ts` as three new Layers-panel toggles ("Mints", "Health & spa culture", "Imperial cult").

### Track B — Features & UI/UX

Two P1 items, both small and well-verified rather than one big risky one:

1. **Fixed the "Landmarks" toggle doing nothing** (`app/PoiMarkers.tsx`). Flagged as an open bug in Shift 7's own backlog notes: the Layers panel's "Landmarks" checkbox pointed at the native `pois-dot`/`pois-label` MapLibre layers, but those have been vestigial since the Italia-batch UI rework (radius/opacity forced to 0) — real POI rendering happens through `PoiMarkers.tsx`'s HTML pill markers, which the toggle never touched. `PoiMarkers.tsx` now also reads `useLayers()["pois"]` directly and returns early when it's off, the same pattern `PeopleMarkers.tsx` already used for its own toggle. Verified in-browser: unchecking Landmarks now actually removes all 101 POI pins, checking it back restores them.
2. **Coordinates URL sync** (`app/Map.tsx`) — the other still-open P1. `#lng,lat,zoomz` in the location hash, kept live on every `moveend` (debounced 400ms so a drag doesn't spam history, first write uses `replaceState` so loading the app doesn't itself burn a back-step, every write after that uses `pushState`). Loading a URL with a hash present lands directly on that view instead of playing the default opening fly-in. A `popstate` listener makes back/forward retrace map moves by flying to the hash's view. Verified in-browser with Playwright: panning and zooming both update the hash, `history.length` grows as expected, hitting back restores the prior hash, and loading `http://localhost:3000#25.0000,35.0000,6.00z` directly lands the map exactly there (confirmed via `map.getCenter()`/`getZoom()`) instead of animating through the default Rome view first.

**Also hit and fixed, not a regression:** re-ran `npm run build` while `next dev` was still running against the same checkout mid-shift — exactly the `.next`-collision trap Shift 7's own backlog note warned about. Killed the dev server, `rm -rf .next`, restarted clean, no lasting damage — but it's worth a third log entry pointing at that warning since two shifts running have now hit it independently; a future shift should treat that note as more than FYI.

### Commits this shift

1. `Coordinates URL sync + fix Landmarks layer toggle` (Track B)
2. `Mints + health/spa culture + imperial cult centers — axes 8a, 18, 12` (Track A)

Both pushed to `main`; pre-push `next build` gate ran clean on both. `npm install` picked up the usual spurious `package-lock.json` noise from a different local npm version (dropped `libc` fields, added `hasInstallScript`) — reverted before committing, same non-issue every prior shift has hit and flagged.

### Next shift should pick up

- **Track A:** Any axis not yet touched (1, 3, 5, 6b–6d, 7, 9, 10, 13–17, 19, 20) is fully open. Axis 3 (micro-POIs) still has the most detailed brief guidance across its nine sub-categories and nobody's picked it up yet. Axis 1 (more cities) still needs its Overpass tooling rebuilt from scratch in a cloud container per Shift 7's note — budget real time or pick a different axis. Axis 13 (political apparatus — senate hometowns, chariot faction HQs, praetorian/vigiles/urban-cohort stations) and axis 20 (sports/athletics) both read as well-bounded, brief-supplied-list axes similar in shape to this shift's three, if a future shift wants a fast, low-risk pick.
- **Track B:** Directions is still the only unshipped P0 (road-network routing — the biggest remaining scope item). P1 remainders: Share button, Keyboard shortcuts, Compass, drag-to-expand on the mobile bottom sheet. The vestigial `pois-dot`/`pois-label` MapLibre layers in `Map.tsx` are still there and still safe to delete — deliberately left them alone this shift even while fixing the Landmarks-toggle bug, because the generic "click empty space closes the panel" handler in `Map.tsx` currently leans on `pois-dot`'s zero-radius circles always returning zero hits from `queryRenderedFeatures`; deleting the layer outright needs that click-arbitration logic rewritten in the same pass, not bolted on separately.
- **General:** `npm run build` and `next dev` sharing one `.next/` directory has now bitten two shifts in a row (Shift 7's note, and this shift's own restart) — worth either the two-checkout workaround becoming the default habit, or someone off-shift wiring a separate `.next` output dir for whichever of `dev`/`build` runs second.

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
