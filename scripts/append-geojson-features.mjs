#!/usr/bin/env node
/**
 * Append new GeoJSON Feature objects to an existing FeatureCollection file with a
 * pure-addition diff — no whole-file reformat noise.
 *
 * Why this exists: every shift that has added features by loading a file into Python/JS,
 * splicing the array, and re-serializing with `json.dump`/`JSON.stringify` has hit the same
 * trap — the re-serializer picks its own indent width and ASCII-escaping defaults, which
 * rarely match the file's existing convention (`pois.geojson` uses 1-space indent and literal
 * UTF-8 punctuation like "·"; `substrate.geojson` uses 2-space). The result is a diff that
 * touches every line of the file instead of just the new features, which is slow to review
 * and risks silently mangling unrelated content. Flagged independently in FEATURE_BACKLOG.md
 * by at least three shifts (see "cloud shift 14/15/16" notes) as worth fixing once.
 *
 * This script never re-serializes the file. It detects the indent width used right before the
 * file's closing `]}` (or `] }`), formats each new feature at that same width, and text-splices
 * the new features in just before the closing bracket — so every byte of the existing file is
 * untouched and the git diff is exactly the new lines.
 *
 * Usage:
 *   node scripts/append-geojson-features.mjs <target.geojson> <new-features.json>
 *
 * <new-features.json> must be a JSON array of Feature objects (or a single Feature object).
 * Validates each feature has `type: "Feature"`, a `geometry`, and `properties` before writing.
 */

import { readFileSync, writeFileSync } from "node:fs";

const [, , targetPath, newFeaturesPath] = process.argv;

if (!targetPath || !newFeaturesPath) {
  console.error("Usage: node scripts/append-geojson-features.mjs <target.geojson> <new-features.json>");
  process.exit(1);
}

const raw = readFileSync(targetPath, "utf8");
const parsed = JSON.parse(readFileSync(newFeaturesPath, "utf8"));
const newFeatures = Array.isArray(parsed) ? parsed : [parsed];

if (newFeatures.length === 0) {
  console.error("No features to add — refusing to touch the target file.");
  process.exit(1);
}

for (const [i, f] of newFeatures.entries()) {
  if (f.type !== "Feature") throw new Error(`Feature ${i}: missing type:"Feature"`);
  if (!f.geometry || !f.geometry.type || !f.geometry.coordinates) {
    throw new Error(`Feature ${i} (${f.properties?.id ?? f.properties?.name ?? "?"}): missing/invalid geometry`);
  }
  if (!f.properties || typeof f.properties !== "object") {
    throw new Error(`Feature ${i}: missing properties object`);
  }
}

// Find the last feature's closing brace inside the top-level "features" array, then find the
// array's own closing "]" that follows it. Splicing happens right before that "]".
const featuresKeyIdx = raw.indexOf('"features"');
if (featuresKeyIdx === -1) throw new Error(`${targetPath}: no top-level "features" key found`);

const arrayOpenIdx = raw.indexOf("[", featuresKeyIdx);
if (arrayOpenIdx === -1) throw new Error(`${targetPath}: "features" is not an array`);

// Walk bracket depth from the array's opening "[" to find its matching closing "]", so we
// don't get fooled by nested brackets inside feature geometries/properties.
let depth = 0;
let arrayCloseIdx = -1;
for (let i = arrayOpenIdx; i < raw.length; i++) {
  const c = raw[i];
  if (c === "[") depth++;
  else if (c === "]") {
    depth--;
    if (depth === 0) {
      arrayCloseIdx = i;
      break;
    }
  }
}
if (arrayCloseIdx === -1) throw new Error(`${targetPath}: could not find matching "]" for "features" array`);

const beforeClose = raw.slice(0, arrayCloseIdx);
const afterClose = raw.slice(arrayCloseIdx);

// Detect indent width + line ending from the whitespace immediately preceding the closing "]".
const trailingWsMatch = beforeClose.match(/\n([ \t]*)$/);
const closingIndent = trailingWsMatch ? trailingWsMatch[1] : "";
// A feature's own indent (the "{" that opens each array element) is one level deeper than the
// array's own closing-bracket indent, in every file this repo uses (bracket-per-line style).
// Detect the actual indent unit from the file itself: the "features" key's own indent vs. the
// indent of the "{" right after "[" tells us how many spaces one nesting level costs here.
const featuresKeyLineMatch = raw.slice(0, featuresKeyIdx).match(/\n([ \t]*)$/);
const featuresKeyIndent = featuresKeyLineMatch ? featuresKeyLineMatch[1] : "";
const afterOpenMatch = raw.slice(arrayOpenIdx + 1).match(/^\r?\n([ \t]+)/);
const featureIndent = afterOpenMatch ? afterOpenMatch[1] : closingIndent + " ";
const usesCRLF = raw.includes("\r\n");
const nl = usesCRLF ? "\r\n" : "\n";
// Per-level increment (what JSON.stringify's own `space` arg should be) — the gap between the
// "features" key's indent and its array items' indent. Falls back to 2 if detection is odd
// (e.g. the file was minified or uses tabs at a width this regex doesn't expect).
const indentUnit =
  featureIndent.length > featuresKeyIndent.length ? featureIndent.slice(featuresKeyIndent.length) : "  ";

function indentJson(value, blockIndent) {
  // JSON.stringify's own pretty-printer nests correctly relative to indentUnit but starts every
  // line at column 0; prefixing every line (including the first) with blockIndent reproduces
  // this file's own per-feature block shape without re-indenting anything else in the file.
  const pretty = JSON.stringify(value, null, indentUnit);
  return pretty
    .split("\n")
    .map((line) => blockIndent + line)
    .join(nl);
}

// Does the array already have at least one feature? If so we need a leading comma + newline.
// (Every target file this script is meant for already has content — an empty `"features": []`
// falls back to a single indent level past the array's own closing-bracket indent.)
const arrayHasContent = /\S/.test(raw.slice(arrayOpenIdx + 1, arrayCloseIdx));
const effectiveFeatureIndent = arrayHasContent ? featureIndent : closingIndent + indentUnit;

const newBlocks = newFeatures.map((f) => indentJson(f, effectiveFeatureIndent)).join("," + nl);

// Strip any trailing whitespace/newline right before the closing bracket in beforeClose so we
// control exactly what separates the last existing feature (or the array's own "[") from the
// new ones.
const beforeCloseTrimmed = beforeClose.replace(/[ \t\r\n]+$/, "");

const result = arrayHasContent
  ? beforeCloseTrimmed + "," + nl + newBlocks + nl + closingIndent + afterClose
  : beforeCloseTrimmed + nl + newBlocks + nl + closingIndent + afterClose;

writeFileSync(targetPath, result, "utf8");

// Sanity check: the result must still be valid JSON with featureCount growing by exactly
// newFeatures.length.
const before = JSON.parse(raw).features.length;
const after = JSON.parse(result).features.length;
if (after !== before + newFeatures.length) {
  writeFileSync(targetPath, raw, "utf8"); // roll back
  throw new Error(
    `Feature count mismatch after splice (expected ${before + newFeatures.length}, got ${after}) — rolled back, file untouched.`
  );
}

console.log(`${targetPath}: ${before} -> ${after} features (+${newFeatures.length}). Byte-identical elsewhere.`);
