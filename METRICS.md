# Roman Maps — metrics

Depth and coverage, recorded by the daily editorial pass. Ticket `[15-P1-4]`.
Everything here is measured off `public/data/` and `app/`, never estimated. Regenerate with:

```bash
npm run metrics
```

That prints today's table, the history row, and the thinnest fifteen descriptions — the work
queue sitting behind the depth number. Add `--write` to rewrite this file in place; a second
run on the same day replaces that day's section and row rather than stacking a duplicate.

The numbers moved between the first hand-counted table and the first generated one because the
data grew (448 → 467 POIs) while it was being counted by hand. That is the whole argument for
the script.

## The standing validator warnings, and why they stay

Kept here rather than inside a dated section, because the dated sections are regenerated and
this reasoning would be destroyed each time. Four India trade contacts and two neighbouring
powers (Kushan, Han) sit outside the empire envelope because that is the point of them. Eleven
`letters.geojson` routes are LineStrings that name themselves through `from`/`to` rather than a
`name` field — seven from Pliny's corpus, four added 2026-08-19 by cloud shift 34 for Ignatius of
Antioch's route, same convention. (The former `roads_low.geojson` empty-geometry warning is gone
along with the file — deleted 2026-08-19 under `[11-P0-3]`, it was dead weight with zero code
references.)

---

## 2026-08-23

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 497 | the curated place canon |
| Records in the 29 thematic files | 1437 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **1,934** | |
| Description of 60+ words | 497 · **100.0%** | measured on `notes`; 0 still thin |
| Has an image | 266 · **53.5%** | |
| Has an ancient source | 178 · **35.8%** | |
| — of `confidence: high` POIs | 161 / 248 · **64.9%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 52 / 52 · **100.0%** | covers 497/497 POIs |
| Sites with curated building descriptions | 35 / 40 · **87.5%** | ancona, aquileia, athens, baalbek, baiae, beneventum, brixia, capua, corinth, cumae, delphi, djemila, ephesus, herculaneum, italica, jerash, leptisMagna, luni, merida, milan, ostia, paestum, palestrina, palmyra, pompeii, portus, pozzuoli, rimini, sabratha, timgad, tivoli, trier, verona, vindolanda, volubilis (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 17 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 145 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## 2026-08-22

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 495 | the curated place canon |
| Records in the 29 thematic files | 1397 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **1,892** | |
| Description of 60+ words | 495 · **100.0%** | measured on `notes`; 0 still thin |
| Has an image | 264 · **53.3%** | |
| Has an ancient source | 177 · **35.8%** | |
| — of `confidence: high` POIs | 160 / 246 · **65.0%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 52 / 52 · **100.0%** | covers 495/495 POIs |
| Sites with curated building descriptions | 34 / 40 · **85.0%** | aquileia, athens, baalbek, baiae, beneventum, brixia, capua, corinth, cumae, delphi, djemila, ephesus, herculaneum, italica, jerash, leptisMagna, luni, merida, milan, ostia, paestum, palestrina, palmyra, pompeii, portus, pozzuoli, rimini, sabratha, timgad, tivoli, trier, verona, vindolanda, volubilis (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 17 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 144 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## 2026-08-21

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 481 | the curated place canon |
| Records in the 29 thematic files | 1376 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **1,857** | |
| Description of 60+ words | 481 · **100.0%** | measured on `notes`; 0 still thin |
| Has an image | 257 · **53.4%** | |
| Has an ancient source | 177 · **36.8%** | |
| — of `confidence: high` POIs | 160 / 238 · **67.2%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 52 / 52 · **100.0%** | covers 481/481 POIs |
| Sites with curated building descriptions | 22 / 40 · **55.0%** | athens, baalbek, baiae, cumae, delphi, djemila, ephesus, herculaneum, italica, jerash, leptisMagna, luni, merida, ostia, paestum, palmyra, pompeii, portus, sabratha, timgad, trier, volubilis (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 17 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 142 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## 2026-08-20

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 481 | the curated place canon |
| Records in the 29 thematic files | 1259 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **1,740** | |
| Description of 60+ words | 481 · **100.0%** | measured on `notes`; 0 still thin |
| Has an image | 257 · **53.4%** | |
| Has an ancient source | 177 · **36.8%** | |
| — of `confidence: high` POIs | 160 / 238 · **67.2%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 52 / 52 · **100.0%** | covers 481/481 POIs |
| Sites with curated building descriptions | 10 / 40 · **25.0%** | athens, delphi, ephesus, herculaneum, jerash, merida, ostia, palmyra, pompeii, trier (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 17 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 133 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## 2026-08-19

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 481 | the curated place canon |
| Records in the 29 thematic files | 1078 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **1,559** | |
| Description of 60+ words | 481 · **100.0%** | measured on `notes`; 0 still thin |
| Has an image | 256 · **53.2%** | |
| Has an ancient source | 177 · **36.8%** | |
| — of `confidence: high` POIs | 160 / 238 · **67.2%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 52 / 52 · **100.0%** | covers 481/481 POIs |
| Sites with curated building descriptions | 10 / 40 · **25.0%** | athens, delphi, ephesus, herculaneum, jerash, merida, ostia, palmyra, pompeii, trier (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 17 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 116 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## 2026-08-18

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 469 | the curated place canon |
| Records in the 29 thematic files | 831 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **1,300** | |
| Description of 60+ words | 464 · **98.9%** | measured on `notes`; 5 still thin |
| Has an image | 253 · **53.9%** | |
| Has an ancient source | 172 · **36.7%** | |
| — of `confidence: high` POIs | 158 / 230 · **68.7%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 52 / 52 · **100.0%** | covers 469/469 POIs |
| Sites with curated building descriptions | 10 / 40 · **25.0%** | athens, delphi, ephesus, herculaneum, jerash, merida, ostia, palmyra, pompeii, trier (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 14 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 76 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## 2026-08-17

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 467 | the curated place canon |
| Records in the 28 thematic files | 728 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **1,195** | |
| Description of 60+ words | 386 · **82.7%** | measured on `notes`; 81 still thin |
| Has an image | 251 · **53.7%** | |
| Has an ancient source | 159 · **34.0%** | |
| — of `confidence: high` POIs | 158 / 230 · **68.7%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 52 / 52 · **100.0%** | covers 467/467 POIs |
| Sites with curated building descriptions | 7 / 40 · **17.5%** | delphi, ephesus, herculaneum, jerash, ostia, pompeii, trier (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 14 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 75 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## 2026-08-16

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 467 | the curated place canon |
| Records in the 28 thematic files | 634 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **1,101** | |
| Description of 60+ words | 386 · **82.7%** | measured on `notes`; 81 still thin |
| Has an image | 251 · **53.7%** | |
| Has an ancient source | 145 · **31.0%** | |
| — of `confidence: high` POIs | 145 / 230 · **63.0%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 52 / 52 · **100.0%** | covers 467/467 POIs |
| Sites with curated building descriptions | 2 / 40 · **5.0%** | ostia, pompeii (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 14 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 73 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## History

| Date | POIs | 60+ words | Image | Ancient source | Validator |
|---|---:|---:|---:|---:|---:|
| 2026-08-16 | 467 | 82.7% | 53.7% | 31.0% | 0 errors |
| 2026-08-17 | 467 | 82.7% | 53.7% | 34.0% | 0 errors |
| 2026-08-18 | 469 | 98.9% | 53.9% | 36.7% | 0 errors |
| 2026-08-19 | 481 | 100.0% | 53.2% | 36.8% | 0 errors |
| 2026-08-20 | 481 | 100.0% | 53.4% | 36.8% | 0 errors |
| 2026-08-21 | 481 | 100.0% | 53.4% | 36.8% | 0 errors |
| 2026-08-22 | 495 | 100.0% | 53.3% | 35.8% | 0 errors |
| 2026-08-23 | 497 | 100.0% | 53.5% | 35.8% | 0 errors |
