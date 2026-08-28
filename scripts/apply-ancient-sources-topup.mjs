#!/usr/bin/env node
/**
 * Splice ancient_sources[] onto existing pois.geojson records by id, without re-serializing
 * the file (same pure-text-splice principle as apply-image-topup.mjs). Only touches records
 * that currently have no ancient_sources key. Inserts after whichever of image_alt /
 * image_credit / image_url / confidence appears last in the record (properties' effective
 * tail), matching this file's existing key ordering convention.
 *
 * Usage:
 *   node scripts/apply-ancient-sources-topup.mjs public/data/pois.geojson topup.json
 *
 * topup.json: JSON array of {id, ancient_sources: [{author, work, ref, note}, ...]}
 */
import { readFileSync, writeFileSync } from "node:fs";

const [, , targetPath, topupPath] = process.argv;
if (!targetPath || !topupPath) {
  console.error("Usage: node scripts/apply-ancient-sources-topup.mjs <target.geojson> <topup.json>");
  process.exit(1);
}

const raw = readFileSync(targetPath, "utf8");
const items = JSON.parse(readFileSync(topupPath, "utf8"));

let text = raw;
let applied = 0;
const skipped = [];

for (const item of items) {
  const { id, ancient_sources } = item;
  if (!id || !Array.isArray(ancient_sources) || ancient_sources.length === 0) {
    skipped.push(`${id || "?"}: missing required field`);
    continue;
  }
  const idNeedle = `"id": "${id}",`;
  const idIdx = text.indexOf(idNeedle);
  if (idIdx === -1) {
    skipped.push(`${id}: id not found`);
    continue;
  }
  const windowEnd = text.indexOf('"id": "', idIdx + idNeedle.length);
  const windowEndAbs = windowEnd === -1 ? text.length : windowEnd;
  const searchWindow = text.slice(idIdx, windowEndAbs);

  if (/"ancient_sources"\s*:/.test(searchWindow)) {
    skipped.push(`${id}: already has ancient_sources`);
    continue;
  }

  const tailRe = /( *)"(image_alt|image_credit|image_url|confidence)": "(?:[^"\\]|\\.)*"(,?)/g;
  let m,
    last = null;
  while ((m = tailRe.exec(searchWindow)) !== null) last = m;
  if (!last) {
    skipped.push(`${id}: no anchor field found nearby`);
    continue;
  }

  const indent = last[1];
  const alreadyHasComma = last[3] === ",";
  const nl = text.includes("\r\n") ? "\r\n" : "\n";
  const body = JSON.stringify(ancient_sources, null, 2)
    .split("\n")
    .map((line, i) => (i === 0 ? line : indent + line))
    .join(nl);
  const insertion = `${alreadyHasComma ? "" : ","}${nl}${indent}"ancient_sources": ${body}`;
  const anchorAbsIdx = idIdx + last.index + last[0].length;
  text = text.slice(0, anchorAbsIdx) + insertion + text.slice(anchorAbsIdx);
  applied++;
}

const before = JSON.parse(raw).features.length;
const after = JSON.parse(text).features.length;
if (after !== before) {
  console.error(`Feature count changed (${before} -> ${after}) — refusing to write.`);
  process.exit(1);
}

writeFileSync(targetPath, text, "utf8");
console.log(`${targetPath}: applied ${applied}/${items.length}. Skipped: ${skipped.length}`);
for (const s of skipped) console.log(`  skip: ${s}`);
