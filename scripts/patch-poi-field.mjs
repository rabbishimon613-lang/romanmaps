#!/usr/bin/env node
/**
 * Patch a single property onto existing Feature(s) in a GeoJSON file by id, without
 * re-serializing the whole file (same anti-reformat-noise rationale as
 * append-geojson-features.mjs — see that file's header comment).
 *
 * Finds each target feature's properties object by its "id" field, then does a targeted
 * string-level insertion of the new key right after the opening `"properties": {` (or after
 * the id field) rather than parsing+rewriting the whole file. Refuses if the id already has
 * that key set (use a different tool to overwrite).
 *
 * Usage:
 *   node scripts/patch-poi-field.mjs <target.geojson> <patches.json>
 *
 * <patches.json> is a JSON array of { id, field, value } objects, e.g.:
 *   [{ "id": "poi_foo", "field": "ancient_sources", "value": [{"author":"Strabo", ...}] }]
 */
import { readFileSync, writeFileSync } from "node:fs";

const [, , targetPath, patchesPath] = process.argv;
if (!targetPath || !patchesPath) {
  console.error("Usage: node scripts/patch-poi-field.mjs <target.geojson> <patches.json>");
  process.exit(1);
}

let raw = readFileSync(targetPath, "utf8");
const patches = JSON.parse(readFileSync(patchesPath, "utf8"));

for (const { id, field, value } of patches) {
  const idNeedle = `"id": "${id}"`;
  const idIdx = raw.indexOf(idNeedle);
  if (idIdx === -1) {
    const idNeedle2 = `"id":"${id}"`;
    const idIdx2 = raw.indexOf(idNeedle2);
    if (idIdx2 === -1) {
      throw new Error(`id not found: ${id}`);
    }
  }
  const realIdx = idIdx !== -1 ? idIdx : raw.indexOf(`"id":"${id}"`);
  const useSpace = idIdx !== -1;
  const insertAfter = realIdx + (useSpace ? idNeedle.length : `"id":"${id}"`.length);

  // Check the field doesn't already exist within this feature's properties block (look ahead
  // to the next "id": as a rough feature boundary).
  const nextIdIdx = raw.indexOf(useSpace ? `"id": "` : `"id":"`, insertAfter);
  const featureSlice = raw.slice(insertAfter, nextIdIdx === -1 ? raw.length : nextIdIdx);
  const fieldNeedle = useSpace ? `"${field}": ` : `"${field}":`;
  if (featureSlice.includes(`"${field}"`)) {
    console.error(`Skipping ${id}: "${field}" already present`);
    continue;
  }

  const valueStr = JSON.stringify(value, null, useSpace ? 1 : 0);
  const insertion = useSpace ? `, "${field}": ${valueStr}` : `,"${field}":${valueStr}`;
  raw = raw.slice(0, insertAfter) + insertion + raw.slice(insertAfter);
  console.error(`Patched ${id}.${field}`);
}

writeFileSync(targetPath, raw);
console.error("Done.");
