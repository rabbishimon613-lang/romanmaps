#!/usr/bin/env node
/**
 * Depth and coverage metrics for METRICS.md — ticket [15-P1-4], report 15.
 *
 * METRICS.md existed before this script, but it was hand-counted, and a hand-counted number
 * is a number that quietly stops being recounted. The owner's complaint about this project
 * was that it feels empty; these are the figures that say whether that is getting better,
 * so they have to be cheap enough to regenerate every single run.
 *
 * Everything here is measured off public/data and app/, never estimated.
 *
 * Usage:
 *   node scripts/metrics.mjs            # print today's table to stdout
 *   node scripts/metrics.mjs --write    # also rewrite METRICS.md (today's section + history)
 *   node scripts/metrics.mjs --json     # machine-readable, for a future dashboard
 *
 * Cold-load LCP is deliberately absent: it needs a running dev server, which the unattended
 * Mac pass cannot start ([15-P0-1]). A cloud shift that measures it should paste it into the
 * "measured by hand" line rather than teach this script to lie about it.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = "public/data";
const WRITE = process.argv.includes("--write");
const JSON_OUT = process.argv.includes("--json");

/** The date the run is recorded under. Passed in by the routine so a run that straddles
 * midnight still files under the day it belongs to. */
const dateArg = process.argv.find((a) => /^--date=/.test(a));
const TODAY = dateArg ? dateArg.split("=")[1] : new Date().toISOString().slice(0, 10);

/** A "real description" is 60 words or more. Below that it is a caption, not a description —
 * the threshold report 10 sets for its middle "label" depth. */
const DEEP_WORDS = 60;

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));
const words = (s) => (typeof s === "string" ? s.trim().split(/\s+/).filter(Boolean).length : 0);
const pct = (n, d) => (d === 0 ? 0 : (n / d) * 100);
const fmtPct = (n, d) => `${n} · **${pct(n, d).toFixed(1)}%**`;

/** The thematic point files — everything with features that are places but are not yet in
 * pois.geojson. Identified the same way the validator does it: by exclusion, so a new
 * thematic file added by a shift is counted the run it lands, without editing this list. */
const NOT_THEMATIC = new Set([
  "pois.geojson",
  "land.geojson",
  "ancient_sea.geojson",
  "provinces.geojson",
  "places_medium.geojson",
  "roads_main.geojson",
  "roads_secondary.geojson",
  "sites_buildings.geojson",
  "sites_streets.geojson",
  "10m_lakes.geojson",
  "10m_rivers_lake_centerlines.geojson",
]);

function collectPoiMetrics() {
  const pois = readJson(join(DATA_DIR, "pois.geojson")).features;
  const props = pois.map((f) => f.properties || {});

  const deep = props.filter((p) => words(p.notes) >= DEEP_WORDS);
  const withImage = props.filter((p) => typeof p.image_url === "string" && p.image_url.trim());
  const withAncient = props.filter((p) => Array.isArray(p.ancient_sources) && p.ancient_sources.length);
  const high = props.filter((p) => p.confidence === "high");
  const highWithAncient = high.filter((p) => Array.isArray(p.ancient_sources) && p.ancient_sources.length);

  /** The thin tail, which is the actual work queue behind the depth number. */
  const thin = props
    .filter((p) => words(p.notes) < DEEP_WORDS)
    .map((p) => ({ id: p.id, name: p.name_english || p.name_latin, category: p.category, words: words(p.notes) }))
    .sort((a, b) => a.words - b.words);

  const byCategory = {};
  for (const p of props) byCategory[p.category] = (byCategory[p.category] || 0) + 1;

  return { total: pois.length, deep: deep.length, withImage: withImage.length, withAncient: withAncient.length, high: high.length, highWithAncient: highWithAncient.length, thin, byCategory };
}

function collectThematicCount() {
  let records = 0;
  let files = 0;
  for (const name of readdirSync(DATA_DIR)) {
    if (!name.endsWith(".geojson") || NOT_THEMATIC.has(name)) continue;
    if (statSync(join(DATA_DIR, name)).isDirectory()) continue;
    try {
      const fc = readJson(join(DATA_DIR, name));
      if (!Array.isArray(fc.features)) continue;
      records += fc.features.length;
      files += 1;
    } catch {
      /* the validator is what reports an unreadable file; metrics just skips it */
    }
  }
  return { records, files };
}

/** How many POI categories have a "What happened here" paragraph, and — the number that
 * actually matters — how many POIs that leaves uncovered. */
function collectCategoryLife(byCategory) {
  let src;
  try {
    src = readFileSync("app/categoryLife.ts", "utf8");
  } catch {
    return null;
  }
  const written = new Set();
  for (const m of src.matchAll(/^\s{2}(?:"([a-z0-9_]+)"|([a-z0-9_]+)):\s*[`"']/gim)) {
    written.add(m[1] || m[2]);
  }
  const categories = Object.keys(byCategory);
  const covered = categories.filter((c) => written.has(c));
  const poisCovered = covered.reduce((n, c) => n + byCategory[c], 0);
  const poisTotal = Object.values(byCategory).reduce((a, b) => a + b, 0);
  const missing = categories.filter((c) => !written.has(c)).sort((a, b) => byCategory[b] - byCategory[a]);
  return { categories: categories.length, covered: covered.length, poisCovered, poisTotal, missing };
}

/** Sites with a per-site building file, and how many of those have curated descriptions. */
function collectSiteCuration() {
  let siteFiles = 0;
  try {
    siteFiles = readdirSync(join(DATA_DIR, "sites")).filter((f) => f.endsWith("_buildings.geojson")).length;
  } catch {
    /* pre-[11-P0-1] tree */
  }
  const curated = readdirSync("app").filter((f) => /Descriptions\.ts$/.test(f));
  return { siteFiles, curated: curated.length, curatedNames: curated.map((f) => f.replace(/Descriptions\.ts$/, "")) };
}

/** Shell out to the validator rather than reimplementing it — one definition of "clean". */
function collectValidator() {
  let out = "";
  try {
    out = execFileSync("node", ["scripts/validate.mjs"], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  } catch (e) {
    out = `${e.stdout || ""}${e.stderr || ""}`;
  }
  const errors = /(\d+) error\(s\)/.exec(out);
  const warnings = /(\d+) warning\(s\)/.exec(out);
  const collisions = /(\d+) cross-file name collision/.exec(out);
  return {
    errors: errors ? Number(errors[1]) : 0,
    warnings: warnings ? Number(warnings[1]) : 0,
    collisions: collisions ? Number(collisions[1]) : 0,
  };
}

const poi = collectPoiMetrics();
const thematic = collectThematicCount();
const life = collectCategoryLife(poi.byCategory);
const sites = collectSiteCuration();
const validator = collectValidator();

if (JSON_OUT) {
  console.log(JSON.stringify({ date: TODAY, poi: { ...poi, thin: poi.thin.length }, thematic, life, sites, validator }, null, 2));
  process.exit(0);
}

const section = [
  `## ${TODAY}`,
  ``,
  `| Measure | Value | Notes |`,
  `|---|---:|---|`,
  `| POIs in \`pois.geojson\` | ${poi.total} | the curated place canon |`,
  `| Records in the ${thematic.files} thematic files | ${thematic.records} | pre-merge; not searchable or card-able yet (\`[12-P0-1]\`) |`,
  `| **Curated places, total** | **${(poi.total + thematic.records).toLocaleString("en-US")}** | |`,
  `| Description of ${DEEP_WORDS}+ words | ${fmtPct(poi.deep, poi.total)} | measured on \`notes\`; ${poi.thin.length} still thin |`,
  `| Has an image | ${fmtPct(poi.withImage, poi.total)} | |`,
  `| Has an ancient source | ${fmtPct(poi.withAncient, poi.total)} | |`,
  `| — of \`confidence: high\` POIs | ${poi.highWithAncient} / ${poi.high} · **${pct(poi.highWithAncient, poi.high).toFixed(1)}%** | the target set for \`[09-P0-1]\` |`,
  life
    ? `| Categories with a "what happened here" paragraph | ${life.covered} / ${life.categories} · **${pct(life.covered, life.categories).toFixed(1)}%** | covers ${life.poisCovered}/${life.poisTotal} POIs${life.missing.length ? ` · missing: ${life.missing.join(", ")}` : ""} |`
    : `| Categories with a "what happened here" paragraph | — | \`app/categoryLife.ts\` not found |`,
  `| Sites with curated building descriptions | ${sites.curated} / ${sites.siteFiles} · **${pct(sites.curated, sites.siteFiles).toFixed(1)}%** | ${sites.curatedNames.join(", ")} (\`[06-P0-2]\`, standing) |`,
  `| Validator errors | **${validator.errors}** | |`,
  `| Validator warnings | ${validator.warnings} | reviewed; see the standing-warnings note |`,
  `| Cross-file name collisions (<150 m) | ${validator.collisions} | the dedupe backlog \`[12-P0-1]\` has to resolve |`,
  `| Cold-load LCP | not measured | needs a dev server; blocked by \`[15-P0-1]\` |`,
].join("\n");

const historyRow = `| ${TODAY} | ${poi.total} | ${pct(poi.deep, poi.total).toFixed(1)}% | ${pct(poi.withImage, poi.total).toFixed(1)}% | ${pct(poi.withAncient, poi.total).toFixed(1)}% | ${validator.errors} errors |`;

if (!WRITE) {
  console.log(section);
  console.log(`\nHistory row:\n${historyRow}`);
  console.log(`\nThinnest 15 descriptions (the work queue behind the depth number):`);
  for (const t of poi.thin.slice(0, 15)) console.log(`  ${String(t.words).padStart(3)}w  ${t.id}  ${t.name} (${t.category})`);
  process.exit(0);
}

/* Rewrite METRICS.md: replace today's section if it already exists, else insert it above the
 * previous one, and add today's history row (replacing a same-day row on a re-run). */
const path = "METRICS.md";
let md = readFileSync(path, "utf8");

const [head, historyPart = ""] = md.split(/\n## History\n/);
let body = head;

const todayHeading = new RegExp(`\\n## ${TODAY}\\n[\\s\\S]*?(?=\\n## \\d{4}-\\d{2}-\\d{2}\\n|$)`);
if (todayHeading.test(body)) {
  body = body.replace(todayHeading, `\n${section}\n`);
} else {
  const firstDated = /\n## \d{4}-\d{2}-\d{2}\n/.exec(body);
  if (firstDated) {
    body = `${body.slice(0, firstDated.index)}\n${section}\n${body.slice(firstDated.index)}`;
  } else {
    body = `${body.trimEnd()}\n\n${section}\n`;
  }
}

let history = historyPart;
const rowRe = new RegExp(`^\\| ${TODAY} \\|.*$`, "m");
if (rowRe.test(history)) history = history.replace(rowRe, historyRow);
else history = `${history.trimEnd()}\n${historyRow}\n`;

writeFileSync(path, `${body.trimEnd()}\n\n## History\n${history.startsWith("\n") ? history : `\n${history}`}`.replace(/\n{3,}/g, "\n\n"));
console.log(`[metrics] METRICS.md updated for ${TODAY} — ${poi.total} POIs, ${pct(poi.deep, poi.total).toFixed(1)}% deep, ${poi.thin.length} thin.`);
