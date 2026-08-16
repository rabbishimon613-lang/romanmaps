#!/usr/bin/env node
// Splits the merged public/data/sites_buildings.geojson + sites_streets.geojson (written by the
// Mac-side research/italia_batch.py pipeline, which is gitignored and not present in every
// checkout) into one pair of files per site under public/data/sites/<slug>_{buildings,streets}
// .geojson. Map.tsx fetches those per-site files on demand instead of the ~27MB merged pair on
// every cold load — see board ticket [11-P0-1].
//
// Run this after italia_batch.py (or any future <region>_batch.py sibling) appends a new site to
// the merged files, before committing — the merged files stay the pipeline's source of truth,
// the per-site files are a derived build artifact checked in for the client to fetch.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "public", "data");
const OUT_DIR = join(DATA_DIR, "sites");

function splitOne(mergedPath, suffix) {
  const merged = JSON.parse(readFileSync(mergedPath, "utf8"));
  const bySite = new Map();
  for (const feat of merged.features) {
    const site = feat.properties?.site || "unknown";
    if (!bySite.has(site)) bySite.set(site, []);
    bySite.get(site).push(feat);
  }
  for (const [slug, features] of bySite) {
    const fc = { type: "FeatureCollection", features };
    writeFileSync(join(OUT_DIR, `${slug}_${suffix}.geojson`), JSON.stringify(fc));
  }
  return bySite.size;
}

mkdirSync(OUT_DIR, { recursive: true });
const nB = splitOne(join(DATA_DIR, "sites_buildings.geojson"), "buildings");
const nS = splitOne(join(DATA_DIR, "sites_streets.geojson"), "streets");
console.log(`Split into ${nB} site building files and ${nS} site street files under ${OUT_DIR}`);
