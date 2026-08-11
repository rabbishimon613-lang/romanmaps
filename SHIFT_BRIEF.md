# Roman Maps — Shift Brief

**The project.** Roman Maps is a Google-Maps-style web app of the Roman Empire at its peak (**117 CE**, Trajan's death — maximum territorial extent). One frozen snapshot in time, not a timeline. Live at https://romanmaps.vercel.app. Stack: Next.js + MapLibre GL, deployed on Vercel, data as GeoJSON in `public/data/`.

**The current map has** land polygons (Natural Earth), coastlines, provinces (dashed), rivers, lakes, and roads from Klokantech / DARE / Pelagios. What it's MISSING: POIs — bathhouses, temples, amphitheaters, ports, aqueducts, forts, mansiones, lighthouses, mines. And the road network is thin outside the West.

**Your job as a shift.** You're one of four rotating 6-hour research shifts (00/06/12/18 UTC). You are a real researcher. Not a summarizer. You go deep — Pliny, Strabo, Tacitus, epigraphy, archaeological reports, Pleiades, Trismegistos, ToposText, DARE, Barrington-Atlas-cited works. You verify. You cite. You produce **data that goes on the map**, not blog posts.

## Two tracks — split your shift between them

Every shift does **both**: (A) research + data, (B) feature work. Roughly 60/40 or 70/30 depending on the backlog.

### Track A — Research & data

1. **Open SHIFT_LOG.md**, read the last 2–3 shifts. Do NOT redo their work. Pick up where they left off.
2. **Pick a bounded scope** — one province, one city, one road (via), one POI category in one region. Small enough to actually finish in a shift.
3. **Research deeply.** Use WebSearch/WebFetch. Cross-reference at least 2 sources per POI. When in doubt, mark `confidence: "low"` — don't drop, don't fake.
4. **Produce GeoJSON.** Add features to `public/data/pois.geojson` (create if missing — schema below). Every feature: real coords (WGS84), Latin + modern name, category, sources, confidence.
5. **Wire the layer** in `app/Map.tsx` if not already there (once one shift adds POIs, subsequent shifts just append features).

### Track B — Features & UI/UX

We are **cloning Google Maps' UI/UX** so people know how to use it instantly. Study the current Google Maps web + mobile app. Copy interactions, chrome, panel styling, animations. **Except Street View** — Street View is a separate future project, do NOT build it, do NOT stub it.

**Read `FEATURE_BACKLOG.md`.** Pick the top unblocked item, ship it, check it off. Keep the diff atomic and the visual style consistent with what's live.

Priorities beyond Google-Maps parity:
- **Ruler tool** — click points, live distance in the current unit (Google Maps has this hidden; we surface it up front).
- **Units toggle (mi ⇄ km)** — persisted in `localStorage`, all distances react.

### End of shift

6. **Commit and push** to `main`. Vercel auto-deploys.
7. **Log your shift** at the top of SHIFT_LOG.md: what you added under each track, sources, decisions, what's next.
8. **Update `FEATURE_BACKLOG.md`** — check off shipped items, add new ideas you spotted mid-shift.

## POI GeoJSON schema

```json
{
  "type": "Feature",
  "geometry": {"type": "Point", "coordinates": [LNG, LAT]},
  "properties": {
    "id": "poi_<slug>",
    "category": "bathhouse|temple|amphitheater|forum|basilica|port|lighthouse|aqueduct|fort|mansio|mine|theater|library|arch",
    "name_latin": "Thermae Caracallae",
    "name_english": "Baths of Caracalla",
    "province": "Italia",
    "modern_location": "Rome, Italy",
    "built": -25,
    "destroyed": null,
    "extant_117ce": true,
    "notes": "Free-form. 1–3 sentences. Historical significance.",
    "sources": ["Pliny NH 36.24", "https://pleiades.stoa.org/places/XXXX"],
    "confidence": "high|medium|low"
  }
}
```

`extant_117ce: true` means it existed at Trajan's death. If a POI was built later (e.g., Baths of Caracalla, 216 CE), set `extant_117ce: false` and it will be filtered out. Log why you kept the record anyway (e.g., "commissioned by Trajan, opened later").

## Guardrails

- **117 CE snapshot.** If it wasn't standing in 117 CE, `extant_117ce: false`. No timeline scrubber, no post-117 rebuilds passed off as originals.
- **Real data or don't include it.** Coord accuracy: prefer archaeologically-attested to within 100m. If you only have "somewhere in this valley," record it with `confidence: "low"` and a wider coord tolerance note in `notes`.
- **Latin names first.** Anglicized names go in `name_english`. Both should be present.
- **Small, atomic commits.** One commit per logical batch (e.g., "Add 12 amphitheaters in Hispania"). Push at the end of the shift.
- **Never delete another shift's work.** Correct with a follow-up commit if wrong; note the correction in SHIFT_LOG.md.
- **Don't touch** the deploy config, `package.json` deps, or the visual style unless a data change requires it.
- **If the repo isn't set up yet**, still do the research and produce the GeoJSON. It will get integrated later.

## Priority queue (start here if there's no prior shift log)

1. Rome itself — every landmark inside the Aurelian Walls that existed in 117 CE (Forum Romanum, Pantheon-of-Agrippa era, Circus Maximus, Trajan's Forum, aqueducts inside the city, temples on the Capitoline, Palatine).
2. Ostia — port infrastructure.
3. Pompeii & Herculaneum (destroyed 79 CE, so `extant_117ce: false` — but geographically pin them; they're part of the story).
4. Provincial capitals: Lugdunum, Carthago Nova, Alexandria, Antiochia, Ephesus, Corinth, Londinium, Colonia Agrippinensis.
5. The three great baths of Rome (Nero, Titus, Trajan — Trajan's opened 109 CE, so definitely `extant_117ce: true`).
6. Amphitheaters — Colosseum, Verona, Nîmes, El Djem, Pula, Pozzuoli.
7. Legionary fortresses — one per legion (28 legions in 117 CE).

## Deliverables checklist (end of shift)

- [ ] SHIFT_LOG.md entry at top, dated, listing what was added
- [ ] pois.geojson updated with new features
- [ ] Sources cited in each feature
- [ ] Committed and pushed to `main`
- [ ] No regressions in the base map (spot-check https://romanmaps.vercel.app deploys clean)
