#!/usr/bin/env node
/**
 * Splice image_url/image_credit/image_alt onto existing pois.geojson records by id, without
 * re-serializing the file (same pure-text-splice principle as append-geojson-features.mjs).
 * Only touches records that currently have no image_url key at all.
 *
 * Usage:
 *   node scripts/apply-image-topup.mjs public/data/pois.geojson topup.json
 *
 * topup.json: JSON array of {id, image_url, image_credit, image_alt?}
 */
import { readFileSync, writeFileSync } from "node:fs";

const [, , targetPath, topupPath] = process.argv;
if (!targetPath || !topupPath) {
  console.error("Usage: node scripts/apply-image-topup.mjs <target.geojson> <topup.json>");
  process.exit(1);
}

const raw = readFileSync(targetPath, "utf8");
const items = JSON.parse(readFileSync(topupPath, "utf8"));

let text = raw;
let applied = 0;
const skipped = [];

for (const item of items) {
  const { id, image_url, image_credit, image_alt } = item;
  if (!id || !image_url || !image_credit) {
    skipped.push(`${id || "?"}: missing required field`);
    continue;
  }
  const idNeedle = `"id": "${id}",`;
  const idIdx = text.indexOf(idNeedle);
  if (idIdx === -1) {
    skipped.push(`${id}: id not found`);
    continue;
  }
  // Find the end of this record's properties block (next "}," at the properties-close depth) —
  // simpler: find the "confidence" line within a bounded window after the id, since every poi
  // record has one and it's reliably the last scalar key before image_url/sources tail fields.
  const windowEnd = text.indexOf('"id": "', idIdx + idNeedle.length);
  const searchWindow = text.slice(idIdx, windowEnd === -1 ? text.length : windowEnd);
  const confMatch = searchWindow.match(/( *)"confidence": "(high|medium|low)"(,?)/);
  if (!confMatch) {
    skipped.push(`${id}: no confidence field found nearby`);
    continue;
  }
  if (text.indexOf('"image_url"', idIdx) !== -1 && text.indexOf('"image_url"', idIdx) < (windowEnd === -1 ? text.length : windowEnd)) {
    skipped.push(`${id}: already has image_url`);
    continue;
  }
  const indent = confMatch[1];
  const alreadyHasComma = confMatch[3] === ",";
  const nl = text.includes("\r\n") ? "\r\n" : "\n";
  const escape = (s) => JSON.stringify(s);
  const confAbsIdx = idIdx + confMatch.index + confMatch[0].length;
  // confidence isn't always the record's last property — a record that already has
  // ancient_sources (or any other field) after it needs a trailing comma on this insertion,
  // but one right before the closing "}" would itself be invalid JSON. Decide by looking at
  // the next non-whitespace character after the splice point: a `"` means another property
  // follows (need the comma), a `}` means this was the last property (must not add one).
  const rest = text.slice(confAbsIdx);
  const nextNonWs = rest.match(/\S/);
  const needsTrailingComma = !!nextNonWs && nextNonWs[0] !== "}";
  let insertion = `${alreadyHasComma ? "" : ","}${nl}${indent}"image_url": ${escape(image_url)},${nl}${indent}"image_credit": ${escape(image_credit)}`;
  if (image_alt) insertion += `,${nl}${indent}"image_alt": ${escape(image_alt)}`;
  if (needsTrailingComma) insertion += ",";
  text = text.slice(0, confAbsIdx) + insertion + rest;
  applied++;
}

// Validate JSON still parses and feature count is unchanged.
const before = JSON.parse(raw).features.length;
const after = JSON.parse(text).features.length;
if (after !== before) {
  console.error(`Feature count changed (${before} -> ${after}) — refusing to write.`);
  process.exit(1);
}

writeFileSync(targetPath, text, "utf8");
console.log(`${targetPath}: applied ${applied}/${items.length}. Skipped: ${skipped.length}`);
for (const s of skipped) console.log(`  skip: ${s}`);
