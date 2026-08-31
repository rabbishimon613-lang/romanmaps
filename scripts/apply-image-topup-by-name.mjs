#!/usr/bin/env node
/**
 * Same splice principle as apply-image-topup.mjs, but anchors the insertion point on the
 * record's "name" field instead of "confidence" — for thematic files (trade_routes.geojson and
 * similar) whose schema has no confidence field. Only touches records with no image_url key.
 *
 * Usage:
 *   node scripts/apply-image-topup-by-name.mjs public/data/trade_routes.geojson topup.json
 */
import { readFileSync, writeFileSync } from "node:fs";

const [, , targetPath, topupPath] = process.argv;
if (!targetPath || !topupPath) {
  console.error("Usage: node scripts/apply-image-topup-by-name.mjs <target.geojson> <topup.json>");
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
  const windowEnd = text.indexOf('"id": "', idIdx + idNeedle.length);
  const boundedEnd = windowEnd === -1 ? text.length : windowEnd;
  const searchWindow = text.slice(idIdx, boundedEnd);
  if (searchWindow.includes('"image_url"')) {
    skipped.push(`${id}: already has image_url`);
    continue;
  }
  const nameMatch = searchWindow.match(/( *)"name": "(?:[^"\\]|\\.)*"(,?)/);
  if (!nameMatch) {
    skipped.push(`${id}: no name field found nearby`);
    continue;
  }
  const indent = nameMatch[1];
  const alreadyHasComma = nameMatch[2] === ",";
  const nl = text.includes("\r\n") ? "\r\n" : "\n";
  const escape = (s) => JSON.stringify(s);
  const anchorAbsIdx = idIdx + nameMatch.index + nameMatch[0].length;
  const rest = text.slice(anchorAbsIdx);
  const nextNonWs = rest.match(/\S/);
  const needsTrailingComma = !!nextNonWs && nextNonWs[0] !== "}";
  let insertion = `${alreadyHasComma ? "" : ","}${nl}${indent}"image_url": ${escape(image_url)},${nl}${indent}"image_credit": ${escape(image_credit)}`;
  if (image_alt) insertion += `,${nl}${indent}"image_alt": ${escape(image_alt)}`;
  if (needsTrailingComma) insertion += ",";
  text = text.slice(0, anchorAbsIdx) + insertion + rest;
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
