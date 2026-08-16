# Roman Maps — metrics

Depth and coverage, recorded by the daily editorial pass. Ticket `[15-P1-4]`.
Everything here is measured off `public/data/`, not estimated. Regenerate with:

```bash
npm run validate
```

…for the data-health line, and by counting `pois.geojson` for the rest.

---

## 2026-08-16

| Measure | Value | Notes |
|---|---:|---|
| POIs in `pois.geojson` | 448 | the curated place canon |
| Records in the 25 thematic files | 607 | pre-merge; not searchable or card-able yet (`[12-P0-1]`) |
| **Curated places, total** | **1,055** | |
| Description of 60+ words | 345 · **77.0%** | measured on `notes` |
| Has an image | 232 · **51.8%** | was 303 keys, 71 of them empty and now dropped |
| Has an ancient source | 108 · **24.1%** | new field this run |
| — of `confidence: high` POIs | 108 / 221 · **48.9%** | the target set for `[09-P0-1]` |
| Categories with a "what happened here" paragraph | 50 / 50 · **100%** | covers all 448 POIs |
| Validator errors | **0** | |
| Validator warnings | 14 | all reviewed and legitimate; see below |
| Cross-file name collisions (<150 m) | 73 | the dedupe backlog `[12-P0-1]` has to resolve |
| Cold-load LCP | not measured | needs a dev server; see `[15-P1-5]` |

**The 14 standing warnings, and why they stay.** Four India trade contacts and two neighbouring
powers (Kushan, Han) sit outside the empire envelope because that is the point of them. Seven
`letters.geojson` routes are LineStrings that name themselves through `from`/`to` rather than a
`name` field. One feature in `roads_low.geojson` has an empty geometry; that file is already
queued for deletion under `[11-P0-3]`.

## History

| Date | POIs | 60+ words | Image | Ancient source | Validator |
|---|---:|---:|---:|---:|---:|
| 2026-08-16 | 448 | 77.0% | 51.8% | 24.1% | 0 errors |
