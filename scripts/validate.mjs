#!/usr/bin/env node
/**
 * Data validator for public/data — report 12, finding F3.
 *
 * Nothing has ever checked that a feature added by a shift has the fields the map and the
 * place card expect. In a pipeline where four cloud shifts and a Mac routine all write to the
 * same GeoJSON, and where the drive this repo lives on is known to drop writes under load, a
 * silent corruption can sit in the data for days. This is the gate.
 *
 * Two severities:
 *   ERROR   — the file is broken or a feature would break the map. Exits 1. Blocks the push.
 *   WARN    — worth a human's attention but not a stop-the-line problem. Exits 0.
 *
 * Usage:
 *   node scripts/validate.mjs            # everything, including the multi-MB base layers
 *   node scripts/validate.mjs --quick    # skip files over 1.5MB (roads, sites, gazetteer)
 *   node scripts/validate.mjs --strict   # warnings are fatal too
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = "public/data";
const QUICK = process.argv.includes("--quick");
const STRICT = process.argv.includes("--strict");
const DUPES = process.argv.includes("--duplicates");
const BIG_FILE_BYTES = 1_500_000;

const CONFIDENCE = new Set(["high", "medium", "low"]);

/** Roughly the empire plus a margin. Outside this a coordinate is probably a sign flip or a
 * lat/lng swap, but Britannia's north and Egypt's south sit near the edges, so it warns. */
const EMPIRE_BOX = { lngMin: -20, lngMax: 70, latMin: 10, latMax: 62 };

/** Which schema profile each file is held to. Anything not listed gets `structural`.
 * `poi` is the full place schema; `themed` is the shared shape the thematic point files
 * converged on (id + a name + sources), pending the merge in [12-P0-1]. */
const PROFILES = {
  "pois.geojson": "poi",
  "conventus_asia.geojson": "themed",
  "crafts.geojson": "themed",
  "diplomacy_117.geojson": "themed",
  "euergetism.geojson": "themed",
  "health.geojson": "themed",
  "imperial_cult.geojson": "themed",
  "landmarks_117.geojson": "themed",
  "learning_117.geojson": "themed",
  "letters.geojson": "themed",
  "lines.geojson": "themed",
  "mints.geojson": "themed",
  "neighbors_117.geojson": "themed",
  "penal.geojson": "themed",
  "politics.geojson": "themed",
  "religions_117.geojson": "themed",
  "road_stations.geojson": "themed",
  "sports.geojson": "themed",
  "substrate.geojson": "themed",
  "disasters.geojson": "themed",
  "events_117.geojson": "themed",
  "people_117.geojson": "themed",
  "trade_routes.geojson": "themed",
  "agriculture.geojson": "themed",
  "housing_styles.geojson": "themed",
  "languages.geojson": "themed",
};

const errors = [];
const warns = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warns.push(`${file}: ${msg}`);

/** Every [lng, lat] pair in a geometry, however deeply nested the coordinate array is. */
function* eachPosition(coords) {
  if (!Array.isArray(coords)) return;
  if (typeof coords[0] === "number") {
    yield coords;
    return;
  }
  for (const c of coords) yield* eachPosition(c);
}

function normaliseName(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

/** Metres between two [lng, lat] points. Only ever used on near-identical pairs, so the
 * equirectangular approximation is more than accurate enough. */
function metresBetween(a, b) {
  const R = 6371000;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = (((b[0] - a[0]) * Math.PI) / 180) * Math.cos(((a[1] + b[1]) / 2 * Math.PI) / 180);
  return Math.hypot(dLat, dLng) * R;
}

function featureLabel(f, i) {
  const p = f.properties || {};
  return p.id || p.name || p.name_latin || p.name_english || `feature #${i}`;
}

// ── per-feature checks ────────────────────────────────────────────────────────────────────

function checkGeometry(file, f, i, profile) {
  const label = featureLabel(f, i);
  const g = f.geometry;
  if (!g || typeof g !== "object") {
    err(file, `${label} — no geometry`);
    return null;
  }
  if (!g.type) {
    err(file, `${label} — geometry has no type`);
    return null;
  }
  let first = null;
  let n = 0;
  for (const pos of eachPosition(g.coordinates)) {
    n++;
    if (!first) first = pos;
    const [lng, lat] = pos;
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      err(file, `${label} — non-finite coordinate [${lng}, ${lat}]`);
      return null;
    }
    if (Math.abs(lng) > 180 || Math.abs(lat) > 90) {
      err(file, `${label} — coordinate off the globe [${lng}, ${lat}]`);
      return null;
    }
  }
  if (n === 0) {
    // An empty geometry in a curated file is a broken pin. In the base geography it is an
    // empty row from the source extract: it draws nothing and hurts nobody.
    if (profile === "structural") warn(file, `${label} — geometry has no coordinates`);
    else err(file, `${label} — geometry has no coordinates`);
    return null;
  }
  // Only curated records get the envelope check. land/rivers/lakes are worldwide Natural Earth
  // extracts and are supposed to have coordinates in the Pacific.
  if (first && profile !== "structural") {
    const [lng, lat] = first;
    const out =
      lng < EMPIRE_BOX.lngMin || lng > EMPIRE_BOX.lngMax || lat < EMPIRE_BOX.latMin || lat > EMPIRE_BOX.latMax;
    if (out) warn(file, `${label} — sits outside the empire envelope at [${lng}, ${lat}]; check for a lat/lng swap`);
  }
  return first;
}

function checkSources(file, label, p) {
  if (!("sources" in p)) {
    err(file, `${label} — no sources`);
    return;
  }
  const s = p.sources;
  if (!Array.isArray(s)) {
    err(file, `${label} — sources is not an array`);
    return;
  }
  if (s.length === 0) err(file, `${label} — sources is empty`);
  if (s.some((x) => typeof x !== "string" || !x.trim())) err(file, `${label} — sources contains a blank entry`);
}

function checkConfidence(file, label, p, required) {
  if (p.confidence === undefined || p.confidence === null) {
    if (required) err(file, `${label} — no confidence`);
    return;
  }
  if (!CONFIDENCE.has(p.confidence)) {
    err(file, `${label} — confidence "${p.confidence}" is not one of high|medium|low`);
  }
}

function checkImage(file, label, p) {
  if (!("image_url" in p)) return;
  const u = p.image_url;
  if (u === null || u === "") {
    warn(file, `${label} — image_url key present but empty; drop the key instead so the card falls back cleanly`);
    return;
  }
  if (typeof u !== "string" || !/^https?:\/\//.test(u)) {
    err(file, `${label} — image_url is not a URL: ${JSON.stringify(u)}`);
    return;
  }
  if (!p.image_credit) warn(file, `${label} — image_url with no image_credit (licence attribution)`);
}

/** `ancient_sources[]` — report 09's flagship field. Objects, never bare strings, because the
 * card renders author/work/ref/quote as separate pieces. */
function checkAncientSources(file, label, p) {
  if (!("ancient_sources" in p)) return;
  const list = p.ancient_sources;
  if (!Array.isArray(list)) {
    err(file, `${label} — ancient_sources is not an array`);
    return;
  }
  list.forEach((s, i) => {
    const at = `${label} — ancient_sources[${i}]`;
    if (!s || typeof s !== "object" || Array.isArray(s)) {
      err(file, `${at} is not an object`);
      return;
    }
    for (const k of ["author", "work", "ref"]) {
      if (!s[k] || typeof s[k] !== "string" || !s[k].trim()) err(file, `${at} — missing ${k}`);
    }
    if (s.quote !== undefined && (typeof s.quote !== "string" || !s.quote.trim())) {
      err(file, `${at} — quote present but blank`);
    }
    for (const k of Object.keys(s)) {
      if (!["author", "work", "ref", "quote", "translation_source", "note"].includes(k)) {
        warn(file, `${at} — unexpected key "${k}"`);
      }
    }
  });
}

function checkPoi(file, f, i) {
  const p = f.properties || {};
  const label = featureLabel(f, i);
  for (const k of ["id", "category", "province", "modern_location"]) {
    if (!p[k] || typeof p[k] !== "string" || !p[k].trim()) err(file, `${label} — missing ${k}`);
  }
  if (!p.name_latin && !p.name_english) err(file, `${label} — no name_latin and no name_english`);
  if (!p.notes || String(p.notes).trim().length < 20) err(file, `${label} — notes missing or too short to be a description`);
  if (p.extant_117ce !== true && p.extant_117ce !== false) err(file, `${label} — extant_117ce is not a boolean`);
  // null is the "unknown / still standing" convention on both fields, so it has to be excluded
  // explicitly — Number(null) is 0, which would read as the year nothing.
  const year = (v) => (v === null || v === undefined || v === "" ? null : Number(v));
  for (const k of ["built", "destroyed"]) {
    const y = year(p[k]);
    if (y !== null && !Number.isFinite(y)) err(file, `${label} — ${k} "${p[k]}" is not a year`);
  }
  const built = year(p.built);
  const destroyed = year(p.destroyed);
  if (Number.isFinite(built) && Number.isFinite(destroyed) && destroyed < built) {
    err(file, `${label} — destroyed (${p.destroyed}) is before built (${p.built})`);
  }
  checkSources(file, label, p);
  checkConfidence(file, label, p, true);
  checkImage(file, label, p);
  checkAncientSources(file, label, p);
}

function checkThemed(file, f, i) {
  const p = f.properties || {};
  const label = featureLabel(f, i);
  if (!p.id || typeof p.id !== "string") err(file, `${label} — missing id`);
  // Warn, not error: the pre-merge thematic files predate any schema and several carry their
  // identity in other fields (letters.geojson routes name themselves with from/to). Tightened
  // to an error once [12-P0-1] folds them into pois.geojson.
  if (!p.name && !p.name_latin && !p.name_english) warn(file, `${label} — no name field`);
  checkSources(file, label, p);
  checkConfidence(file, label, p, false);
  checkImage(file, label, p);
  checkAncientSources(file, label, p);
}

// ── run ───────────────────────────────────────────────────────────────────────────────────

const files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".geojson") || f.endsWith(".json")).sort();

/** Every named point across the small curated files, for the cross-file duplicate sweep.
 * Two records for one place is the failure mode report 12 F4 predicts once the thematic
 * files merge, and it is cheaper to see it now than after the merge. */
const points = [];
let checked = 0;
let skipped = 0;

for (const name of files) {
  const path = join(DATA_DIR, name);
  const size = statSync(path).size;
  if (QUICK && size > BIG_FILE_BYTES) {
    skipped++;
    continue;
  }

  let doc;
  try {
    doc = JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    err(name, `does not parse as JSON — ${e.message}`);
    continue;
  }
  checked++;

  // sites_index.json and friends are plain objects, not FeatureCollections.
  if (!doc || doc.type !== "FeatureCollection") continue;
  if (!Array.isArray(doc.features)) {
    err(name, "FeatureCollection has no features array");
    continue;
  }

  const profile = PROFILES[name] || "structural";
  const seenIds = new Map();
  const seenNameCoord = new Map();

  doc.features.forEach((f, i) => {
    const first = checkGeometry(name, f, i, profile);
    const p = f.properties || {};
    const label = featureLabel(f, i);

    if (p.id) {
      if (seenIds.has(p.id)) err(name, `duplicate id "${p.id}" (features #${seenIds.get(p.id)} and #${i})`);
      else seenIds.set(p.id, i);
    }

    if (profile === "poi") checkPoi(name, f, i);
    else if (profile === "themed") checkThemed(name, f, i);

    if (!first) return;

    // Same name at the same spot inside pois.geojson is always a mistake. The thematic files
    // are exempt: crafts.geojson deliberately stacks linen, glass and silk on one Alexandria,
    // and the distinguishing field is `craft`, not the name.
    // Both names go into the key. Two battles at Tapae and two legions at Brigetio share a
    // name_latin and a coordinate and are still different records; only a match on the English
    // name too means the same thing has been entered twice.
    if (profile === "poi") {
      const n = normaliseName(`${p.name_latin || ""}|${p.name_english || p.name || ""}`);
      const key = `${n}@${first[0].toFixed(4)},${first[1].toFixed(4)}`;
      if (n) {
        if (seenNameCoord.has(key)) err(name, `${label} — duplicates "${seenNameCoord.get(key)}" (same name, same coordinate)`);
        else seenNameCoord.set(key, label);
      }
    }

    if (profile !== "structural" && f.geometry.type === "Point") {
      const n = normaliseName(p.name || p.name_latin || p.name_english);
      if (n.length >= 4) points.push({ file: name, label, n, pos: first });
    }
  });
}

// Cross-file near-duplicates: same name within 150 m, different file. Report 12's F4 predicts
// these and the merge in [12-P0-1] has to resolve every one, so the useful output here is the
// count. The full list is behind --duplicates so it can't drown the rest of the report.
const byName = new Map();
for (const pt of points) {
  if (!byName.has(pt.n)) byName.set(pt.n, []);
  byName.get(pt.n).push(pt);
}
const collisions = [];
for (const [, group] of byName) {
  if (group.length < 2) continue;
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const a = group[i];
      const b = group[j];
      if (a.file === b.file) continue;
      if (metresBetween(a.pos, b.pos) <= 150) {
        collisions.push(`"${a.label}" in ${a.file} and "${b.label}" in ${b.file}`);
      }
    }
  }
}

// ── report ────────────────────────────────────────────────────────────────────────────────

const MAX_SHOWN = 40;
const show = (list, tag) => {
  list.slice(0, MAX_SHOWN).forEach((m) => console.log(`  ${tag} ${m}`));
  if (list.length > MAX_SHOWN) console.log(`  ${tag} …and ${list.length - MAX_SHOWN} more`);
};

console.log(`[validate] ${checked} file(s) checked${skipped ? `, ${skipped} large file(s) skipped (--quick)` : ""}`);
if (collisions.length) {
  console.log(
    `[validate] ${collisions.length} cross-file name collision(s) within 150m — the merge backlog for [12-P0-1]${
      DUPES ? ":" : ". Re-run with --duplicates to list them."
    }`
  );
  if (DUPES) collisions.forEach((c) => console.log(`  dup   ${c}`));
}
if (warns.length) {
  console.log(`[validate] ${warns.length} warning(s):`);
  show(warns, "warn ");
}
if (errors.length) {
  console.log(`[validate] ${errors.length} error(s):`);
  show(errors, "ERROR");
  process.exit(1);
}
if (STRICT && warns.length) {
  console.log("[validate] --strict: warnings are fatal.");
  process.exit(1);
}
console.log(`[validate] clean${warns.length ? ` (${warns.length} warning(s) above)` : ""}.`);
