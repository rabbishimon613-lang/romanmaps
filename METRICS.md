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

## 2026-09-04

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 1405 | the curated place canon |
| Records in the 33 thematic files | 1801 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **3,206** | |
| Description of 60+ words | 1405 · **100.0%** | measured on `notes`; 0 still thin |
| Has an image | 887 · **63.1%** | `pois.geojson` only — see below for the thematic files |
| Has an image — thematic files | 1118 · **62.1%** | the 33 files this metric used to skip entirely |
| Has an image — all curated places | 2005 · **62.5%** | `pois.geojson` + thematic files combined |
| Has an ancient source | 551 · **39.2%** | |
| — of `confidence: high` POIs | 492 / 595 · **82.7%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 53 / 60 · **88.3%** | covers 1339/1405 POIs · missing: beneficiarii_station, bath, harbor, domus, vicus, gymnasium, courier_post |
| Sites with curated building descriptions | 36 / 40 · **90.0%** | ancona, aquileia, athens, baalbek, baiae, beneventum, brixia, capua, corinth, cumae, delphi, djemila, ephesus, herculaneum, italica, jerash, leptisMagna, luni, merida, milan, ostia, paestum, palestrina, palmyra, pompeii, portus, pozzuoli, rimini, rome, sabratha, timgad, tivoli, trier, verona, vindolanda, volubilis (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 7 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 205 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## 2026-09-03

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 1405 | the curated place canon |
| Records in the 33 thematic files | 1788 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **3,193** | |
| Description of 60+ words | 1365 · **97.2%** | measured on `notes`; 40 still thin |
| Has an image | 839 · **59.7%** | `pois.geojson` only — see below for the thematic files |
| Has an image — thematic files | 1102 · **61.6%** | the 33 files this metric used to skip entirely |
| Has an image — all curated places | 1941 · **60.8%** | `pois.geojson` + thematic files combined |
| Has an ancient source | 551 · **39.2%** | |
| — of `confidence: high` POIs | 492 / 595 · **82.7%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 53 / 60 · **88.3%** | covers 1339/1405 POIs · missing: beneficiarii_station, bath, harbor, domus, vicus, gymnasium, courier_post |
| Sites with curated building descriptions | 36 / 40 · **90.0%** | ancona, aquileia, athens, baalbek, baiae, beneventum, brixia, capua, corinth, cumae, delphi, djemila, ephesus, herculaneum, italica, jerash, leptisMagna, luni, merida, milan, ostia, paestum, palestrina, palmyra, pompeii, portus, pozzuoli, rimini, rome, sabratha, timgad, tivoli, trier, verona, vindolanda, volubilis (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 7 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 199 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## 2026-09-02

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 1356 | the curated place canon |
| Records in the 33 thematic files | 1715 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **3,071** | |
| Description of 60+ words | 1329 · **98.0%** | measured on `notes`; 27 still thin |
| Has an image | 816 · **60.2%** | `pois.geojson` only — see below for the thematic files |
| Has an image — thematic files | 1069 · **62.3%** | the 33 files this metric used to skip entirely |
| Has an image — all curated places | 1885 · **61.4%** | `pois.geojson` + thematic files combined |
| Has an ancient source | 545 · **40.2%** | |
| — of `confidence: high` POIs | 489 / 569 · **85.9%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 53 / 60 · **88.3%** | covers 1290/1356 POIs · missing: beneficiarii_station, bath, harbor, domus, vicus, gymnasium, courier_post |
| Sites with curated building descriptions | 36 / 40 · **90.0%** | ancona, aquileia, athens, baalbek, baiae, beneventum, brixia, capua, corinth, cumae, delphi, djemila, ephesus, herculaneum, italica, jerash, leptisMagna, luni, merida, milan, ostia, paestum, palestrina, palmyra, pompeii, portus, pozzuoli, rimini, rome, sabratha, timgad, tivoli, trier, verona, vindolanda, volubilis (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 7 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 190 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## 2026-09-01

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 1236 | the curated place canon |
| Records in the 33 thematic files | 1688 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **2,924** | |
| Description of 60+ words | 1210 · **97.9%** | measured on `notes`; 26 still thin |
| Has an image | 769 · **62.2%** | `pois.geojson` only — see below for the thematic files |
| Has an image — thematic files | 1058 · **62.7%** | the 33 files this metric used to skip entirely |
| Has an image — all curated places | 1827 · **62.5%** | `pois.geojson` + thematic files combined |
| Has an ancient source | 486 · **39.3%** | |
| — of `confidence: high` POIs | 431 / 534 · **80.7%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 53 / 60 · **88.3%** | covers 1170/1236 POIs · missing: beneficiarii_station, bath, harbor, domus, vicus, gymnasium, courier_post |
| Sites with curated building descriptions | 36 / 40 · **90.0%** | ancona, aquileia, athens, baalbek, baiae, beneventum, brixia, capua, corinth, cumae, delphi, djemila, ephesus, herculaneum, italica, jerash, leptisMagna, luni, merida, milan, ostia, paestum, palestrina, palmyra, pompeii, portus, pozzuoli, rimini, rome, sabratha, timgad, tivoli, trier, verona, vindolanda, volubilis (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 7 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 190 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## 2026-08-31

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 1235 | the curated place canon |
| Records in the 33 thematic files | 1682 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **2,917** | |
| Description of 60+ words | 1209 · **97.9%** | measured on `notes`; 26 still thin |
| Has an image | 734 · **59.4%** | `pois.geojson` only — see below for the thematic files |
| Has an image — thematic files | 978 · **58.1%** | the 33 files this metric used to skip entirely |
| Has an image — all curated places | 1712 · **58.7%** | `pois.geojson` + thematic files combined |
| Has an ancient source | 486 · **39.4%** | |
| — of `confidence: high` POIs | 431 / 534 · **80.7%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 53 / 60 · **88.3%** | covers 1169/1235 POIs · missing: beneficiarii_station, bath, harbor, domus, vicus, gymnasium, courier_post |
| Sites with curated building descriptions | 36 / 40 · **90.0%** | ancona, aquileia, athens, baalbek, baiae, beneventum, brixia, capua, corinth, cumae, delphi, djemila, ephesus, herculaneum, italica, jerash, leptisMagna, luni, merida, milan, ostia, paestum, palestrina, palmyra, pompeii, portus, pozzuoli, rimini, rome, sabratha, timgad, tivoli, trier, verona, vindolanda, volubilis (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 7 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 190 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## 2026-08-30

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 1223 | the curated place canon |
| Records in the 33 thematic files | 1679 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **2,902** | |
| Description of 60+ words | 1197 · **97.9%** | measured on `notes`; 26 still thin |
| Has an image | 734 · **60.0%** | |
| Has an ancient source | 486 · **39.7%** | |
| — of `confidence: high` POIs | 431 / 527 · **81.8%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 53 / 60 · **88.3%** | covers 1158/1223 POIs · missing: beneficiarii_station, bath, harbor, domus, vicus, gymnasium, courier_post |
| Sites with curated building descriptions | 36 / 40 · **90.0%** | ancona, aquileia, athens, baalbek, baiae, beneventum, brixia, capua, corinth, cumae, delphi, djemila, ephesus, herculaneum, italica, jerash, leptisMagna, luni, merida, milan, ostia, paestum, palestrina, palmyra, pompeii, portus, pozzuoli, rimini, rome, sabratha, timgad, tivoli, trier, verona, vindolanda, volubilis (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 18 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 189 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## 2026-08-29

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 1108 | the curated place canon |
| Records in the 33 thematic files | 1516 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **2,624** | |
| Description of 60+ words | 1082 · **97.7%** | measured on `notes`; 26 still thin |
| Has an image | 678 · **61.2%** | |
| Has an ancient source | 487 · **44.0%** | |
| — of `confidence: high` POIs | 432 / 472 · **91.5%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 53 / 60 · **88.3%** | covers 1043/1108 POIs · missing: beneficiarii_station, bath, harbor, domus, vicus, gymnasium, courier_post |
| Sites with curated building descriptions | 36 / 40 · **90.0%** | ancona, aquileia, athens, baalbek, baiae, beneventum, brixia, capua, corinth, cumae, delphi, djemila, ephesus, herculaneum, italica, jerash, leptisMagna, luni, merida, milan, ostia, paestum, palestrina, palmyra, pompeii, portus, pozzuoli, rimini, rome, sabratha, timgad, tivoli, trier, verona, vindolanda, volubilis (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 17 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 148 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## 2026-08-28

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 1051 | the curated place canon |
| Records in the 33 thematic files | 1501 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **2,552** | |
| Description of 60+ words | 1025 · **97.5%** | measured on `notes`; 26 still thin |
| Has an image | 638 · **60.7%** | |
| Has an ancient source | 388 · **36.9%** | |
| — of `confidence: high` POIs | 333 / 458 · **72.7%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 53 / 58 · **91.4%** | covers 1009/1051 POIs · missing: bath, harbor, domus, vicus, gymnasium |
| Sites with curated building descriptions | 36 / 40 · **90.0%** | ancona, aquileia, athens, baalbek, baiae, beneventum, brixia, capua, corinth, cumae, delphi, djemila, ephesus, herculaneum, italica, jerash, leptisMagna, luni, merida, milan, ostia, paestum, palestrina, palmyra, pompeii, portus, pozzuoli, rimini, rome, sabratha, timgad, tivoli, trier, verona, vindolanda, volubilis (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 17 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 145 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## 2026-08-27

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 1015 | the curated place canon |
| Records in the 33 thematic files | 1501 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **2,516** | |
| Description of 60+ words | 990 · **97.5%** | measured on `notes`; 25 still thin |
| Has an image | 593 · **58.4%** | |
| Has an ancient source | 321 · **31.6%** | |
| — of `confidence: high` POIs | 266 / 447 · **59.5%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 53 / 58 · **91.4%** | covers 973/1015 POIs · missing: bath, harbor, domus, vicus, gymnasium |
| Sites with curated building descriptions | 36 / 40 · **90.0%** | ancona, aquileia, athens, baalbek, baiae, beneventum, brixia, capua, corinth, cumae, delphi, djemila, ephesus, herculaneum, italica, jerash, leptisMagna, luni, merida, milan, ostia, paestum, palestrina, palmyra, pompeii, portus, pozzuoli, rimini, rome, sabratha, timgad, tivoli, trier, verona, vindolanda, volubilis (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 17 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 145 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## 2026-08-26

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 930 | the curated place canon |
| Records in the 31 thematic files | 1487 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **2,417** | |
| Description of 60+ words | 919 · **98.8%** | measured on `notes`; 11 still thin |
| Has an image | 526 · **56.6%** | |
| Has an ancient source | 275 · **29.6%** | |
| — of `confidence: high` POIs | 231 / 432 · **53.5%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 53 / 56 · **94.6%** | covers 909/930 POIs · missing: bath, harbor, vicus |
| Sites with curated building descriptions | 36 / 40 · **90.0%** | ancona, aquileia, athens, baalbek, baiae, beneventum, brixia, capua, corinth, cumae, delphi, djemila, ephesus, herculaneum, italica, jerash, leptisMagna, luni, merida, milan, ostia, paestum, palestrina, palmyra, pompeii, portus, pozzuoli, rimini, rome, sabratha, timgad, tivoli, trier, verona, vindolanda, volubilis (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 17 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 145 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## 2026-08-25

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 707 | the curated place canon |
| Records in the 31 thematic files | 1480 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **2,187** | |
| Description of 60+ words | 707 · **100.0%** | measured on `notes`; 0 still thin |
| Has an image | 430 · **60.8%** | |
| Has an ancient source | 234 · **33.1%** | |
| — of `confidence: high` POIs | 208 / 332 · **62.7%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 53 / 53 · **100.0%** | covers 707/707 POIs |
| Sites with curated building descriptions | 35 / 40 · **87.5%** | ancona, aquileia, athens, baalbek, baiae, beneventum, brixia, capua, corinth, cumae, delphi, djemila, ephesus, herculaneum, italica, jerash, leptisMagna, luni, merida, milan, ostia, paestum, palestrina, palmyra, pompeii, portus, pozzuoli, rimini, sabratha, timgad, tivoli, trier, verona, vindolanda, volubilis (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 17 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 145 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## 2026-08-24

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 576 | the curated place canon |
| Records in the 31 thematic files | 1480 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **2,056** | |
| Description of 60+ words | 576 · **100.0%** | measured on `notes`; 0 still thin |
| Has an image | 352 · **61.1%** | |
| Has an ancient source | 220 · **38.2%** | |
| — of `confidence: high` POIs | 198 / 283 · **70.0%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 52 / 52 · **100.0%** | covers 576/576 POIs |
| Sites with curated building descriptions | 35 / 40 · **87.5%** | ancona, aquileia, athens, baalbek, baiae, beneventum, brixia, capua, corinth, cumae, delphi, djemila, ephesus, herculaneum, italica, jerash, leptisMagna, luni, merida, milan, ostia, paestum, palestrina, palmyra, pompeii, portus, pozzuoli, rimini, sabratha, timgad, tivoli, trier, verona, vindolanda, volubilis (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 17 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 145 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; blocked by `[15-P0-1]` |

## 2026-08-23

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 497 | the curated place canon |
| Records in the 29 thematic files | 1457 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **1,954** | |
| Description of 60+ words | 497 · **100.0%** | measured on `notes`; 0 still thin |
| Has an image | 266 · **53.5%** | |
| Has an ancient source | 181 · **36.4%** | |
| — of `confidence: high` POIs | 162 / 248 · **65.3%** | the target set for `[09-P0-1]` |
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
| 2026-08-23 | 497 | 100.0% | 53.5% | 36.4% | 0 errors |
| 2026-08-24 | 576 | 100.0% | 61.1% | 38.2% | 0 errors |
| 2026-08-25 | 707 | 100.0% | 60.8% | 33.1% | 0 errors |
| 2026-08-26 | 930 | 98.8% | 56.6% | 29.6% | 0 errors |
| 2026-08-27 | 1015 | 97.5% | 58.4% | 31.6% | 0 errors |
| 2026-08-28 | 1051 | 97.5% | 60.7% | 36.9% | 0 errors |
| 2026-08-29 | 1108 | 97.7% | 61.2% | 44.0% | 0 errors |
| 2026-08-30 | 1223 | 97.9% | 60.0% | 39.7% | 0 errors |
| 2026-08-31 | 1235 | 97.9% | 59.4% | 39.4% | 0 errors |
| 2026-09-01 | 1236 | 97.9% | 62.2% | 39.3% | 0 errors |
| 2026-09-02 | 1356 | 98.0% | 60.2% | 40.2% | 0 errors |
| 2026-09-03 | 1405 | 97.2% | 59.7% | 39.2% | 0 errors |
| 2026-09-04 | 1405 | 100.0% | 63.1% | 39.2% | 0 errors |
