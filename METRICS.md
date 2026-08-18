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
powers (Kushan, Han) sit outside the empire envelope because that is the point of them. Seven
`letters.geojson` routes are LineStrings that name themselves through `from`/`to` rather than a
`name` field. One feature in `roads_low.geojson` has an empty geometry; that file is already
queued for deletion under `[11-P0-3]`.

---

## 2026-08-18

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 470 | the curated place canon |
| Records in the 28 thematic files | 748 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **1,218** | |
| Description of 60+ words | 413 · **87.9%** | measured on `notes`; 57 still thin |
| Has an image | 254 · **54.0%** | |
| Has an ancient source | 167 · **35.5%** | |
| — of `confidence: high` POIs | 159 / 231 · **68.8%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 52 / 52 · **100.0%** | covers 470/470 POIs |
| Sites with curated building descriptions | 7 / 40 · **17.5%** | delphi, ephesus, herculaneum, jerash, ostia, pompeii, trier (`[06-P0-2]`, standing) |
| Validator errors | **0** | |
| Validator warnings | 14 | reviewed; see the standing-warnings note |
| Cross-file name collisions (<150 m) | 75 | the dedupe backlog `[12-P0-1]` has to resolve |
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
| 2026-08-18 | 470 | 87.9% | 54.0% | 35.5% | 0 errors |
