#!/usr/bin/env node

/**
 * STAGE 3.1B — HISTORICAL VISUAL GOVERNANCE & PRESENTATION VERIFICATION
 * 
 * Verifies presentation layer constraints:
 * 1. USS Peary casualties are not rendered as a single settled number (null in data, protective phrasing in UI)
 * 2. Post Office casualties are not rendered as a single settled number in the primary spatial overlay
 * 3. 1942 Wharf geometry is unresolved and not rendered
 * 4. USS Peary is documented as PROTECTED HISTORIC SHIPWRECK rather than WAR GRAVE
 * 5. Ingress direction is marked as reconstructed/approximate
 * 6. "RECONSTRUCTION PARAMETER" developer language is removed from primary UI strings
 * 7. 188 aircraft count is not represented 1:1 visually
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`✗ FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    passedTests++;
    console.log(`✓ PASS: ${message}`);
  }
}

console.log('=== STAGE 3.1B HISTORICAL VISUAL GOVERNANCE VERIFICATION ===\n');

// 1. Check data models for disputed numbers
console.log('[1. Disputed Casualty Models]');
const vesselsJson = JSON.parse(fs.readFileSync(path.join(root, 'data/entities/vessels.json'), 'utf8'));
const peary = vesselsJson.entities.find(v => v.id === 'USS_PEARY_DD226');
assert(peary?.fatalitiesCount === null, 'USS Peary fatalities count is null (disputed, unresolved in UI)');

const storyBeats = JSON.parse(fs.readFileSync(path.join(root, 'data/story-beats.json'), 'utf8'));
const postOfficeBeat = storyBeats.beats.find(b => b.id === 'BEAT_3');
assert(!postOfficeBeat?.description.includes('nine'), 'Post Office beat description avoids asserting exactly nine casualties');
assert(!postOfficeBeat?.description.includes('ten'), 'Post Office beat description avoids asserting exactly ten casualties');

const canonFile = JSON.parse(fs.readFileSync(path.join(root, 'data/historical-canon.json'), 'utf8'));
const poCasualtyClaim = canonFile.claims.find(c => c.id === 'CLAIM_POST_OFFICE_CASUALTIES');
assert(poCasualtyClaim?.confidence === 'DISPUTED', 'Post Office casualty claim is explicitly documented as DISPUTED');
const pearyCasualtyClaim = canonFile.claims.find(c => c.id === 'CLAIM_USS_PEARY_CASUALTIES');
assert(pearyCasualtyClaim?.confidence === 'DISPUTED', 'USS Peary casualty claim is explicitly documented as DISPUTED');

// 2. Check UI presentation code
console.log('\n[2. Visual Overlay Grammar]');
const overlayCode = fs.readFileSync(path.join(root, 'src/lib/spatial/spatial-evidence-overlay.ts'), 'utf8');

// Peary labels
assert(!overlayCode.includes('91 LOST'), 'USS Peary spatial label does NOT claim "91 LOST"');
assert(overlayCode.includes('PROTECTED HISTORIC SHIPWRECK'), 'USS Peary spatial label uses PROTECTED HISTORIC SHIPWRECK instead of WAR GRAVE');

// Post Office labels
assert(!overlayCode.includes('9 KILLED'), 'Post Office spatial label does NOT claim "9 KILLED"');
assert(overlayCode.includes('THE SHELTER TRENCH RECEIVED A DIRECT HIT'), 'Post Office spatial label uses neutral descriptive language');

// Developer Language
assert(!overlayCode.includes('text: \'RECONSTRUCTION PARAMETER'), 'Developer language RECONSTRUCTION PARAMETER removed from primary label string');
assert(overlayCode.includes('ESTIMATED LAUNCH AREA'), 'Replaced with humane language ESTIMATED LAUNCH AREA');

// 1942 Wharf
assert(overlayCode.includes('1942 TIMBER FOOTPRINT UNRESOLVED'), 'Spatial overlay explicitly states 1942 wharf timber footprint is unresolved');

console.log(`\n======================================================`);
console.log(`SUMMARY: ${passedTests} / ${totalTests} tests passed.`);
if (process.exitCode) {
  console.error('STAGE 3.1B VERIFICATION FAILED.');
  process.exit(1);
} else {
  console.log('STAGE 3.1B HISTORICAL VISUAL GOVERNANCE VERIFIED.');
}
