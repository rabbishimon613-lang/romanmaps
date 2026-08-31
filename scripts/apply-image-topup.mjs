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

// Fallback anchor for records with no `confidence` field: locate `"sources": [...]` (string-aware
// bracket counting, since a source string could in principle contain a literal "[" or "]") and
// return the indentation to reuse plus whether a trailing comma already follows the array.
function findSourcesArrayEnd(window) {
  const startMatch = window.match(/( *)"sources":\s*\[/);
  if (!startMatch) return null;
  const indent = startMatch[1];
  let i = startMatch.index + startMatch[0].length - 1; // position of the opening '['
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (; i < window.length; i++) {
    const ch = window[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) {
        const endIdx = i + 1;
        const rest = window.slice(endIdx);
        const hasComma = /^\s*,/.test(rest);
        return { indent, endIdx, hasComma };
      }
    }
  }
  return null;
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
  // simpler: find the "confidence" line within a bounded window after the id, since most records
  // have one and it's reliably the last scalar key before image_url/sources tail fields. A
  // schema variant without `confidence` (seen in conventus.geojson/people_117.geojson) falls
  // back to anchoring right after the `sources` array's closing bracket instead.
  const windowEnd = text.indexOf('"id": "', idIdx + idNeedle.length);
  const searchWindow = text.slice(idIdx, windowEnd === -1 ? text.length : windowEnd);
  if (text.indexOf('"image_url"', idIdx) !== -1 && text.indexOf('"image_url"', idIdx) < (windowEnd === -1 ? text.length : windowEnd)) {
    skipped.push(`${id}: already has image_url`);
    continue;
  }
  const confMatch = searchWindow.match(/( *)"confidence": "(high|medium|low)"(,?)/);
  const nl = text.includes("\r\n") ? "\r\n" : "\n";
  const escape = (s) => JSON.stringify(s);
  let indent;
  let alreadyHasComma;
  let confAbsIdx;
  if (confMatch) {
    indent = confMatch[1];
    alreadyHasComma = confMatch[3] === ",";
    confAbsIdx = idIdx + confMatch.index + confMatch[0].length;
  } else {
    const anchor = findSourcesArrayEnd(searchWindow);
    if (!anchor) {
      skipped.push(`${id}: no confidence field or sources array found nearby`);
      continue;
    }
    indent = anchor.indent;
    alreadyHasComma = anchor.hasComma;
    confAbsIdx = idIdx + anchor.endIdx;
  }
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
