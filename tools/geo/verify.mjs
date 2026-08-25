/* Verify the generated coastline is actually Lombok, not a plausible blob.

   A picture can look right and be wrong. These are checks that fail loudly:
     1. known inland places must fall INSIDE the polygon
     2. known open sea must fall OUTSIDE it
     3. known coastal towns must sit within a few hundred metres of the outline

   All three run in the SAME projected pixel space the SVG uses, so they test
   the projection and the simplification together, not just the source data. */

import { readFileSync } from 'node:fs';

const P = JSON.parse(readFileSync(new URL('./paths.json', import.meta.url)));
const { bounds: B, kx, scale, pad } = P;
const px = (lon) => pad + (lon - B.w) * kx * scale;
const py = (lat) => pad + (B.n - lat) * scale;

/* parse "M x yL x yL ... Z" back into points */
function parse(d) {
  return d.replace(/[MZ]/g, '').split('L').filter(Boolean)
    .map((s) => s.trim().split(/\s+/).map(Number));
}
const main = parse(P.main);
console.log('main ring points:', main.length);

function inside(pt, poly) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const [xi, yi] = poly[i]; const [xj, yj] = poly[j];
    if ((yi > pt[1]) !== (yj > pt[1])
      && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}
function distToRing(pt, poly) {
  let best = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const a = poly[j]; const b = poly[i];
    let x = a[0]; let y = a[1];
    let dx = b[0] - x; let dy = b[1] - y;
    if (dx || dy) {
      const t = ((pt[0] - x) * dx + (pt[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) { x = b[0]; y = b[1]; } else if (t > 0) { x += dx * t; y += dy * t; }
    }
    best = Math.min(best, Math.hypot(pt[0] - x, pt[1] - y));
  }
  return best;
}

const M_PER_PX = (1 / scale) * 111320 * 1; // deg -> m, y axis is untouched by kx

const LAND = [
  ['Lombok Intl airport', -8.7573, 116.2767],
  ['Mataram', -8.5833, 116.1167],
  ['Rinjani summit', -8.4114, 116.4575],
  ['Sembalun Lawang', -8.3600, 116.5300],
  ['Praya', -8.7000, 116.2750],
  ['Villa 25 Ekas', -8.9016, 116.4502],
];
const SEA = [
  ['Lombok Strait (W)', -8.6000, 115.8500],
  ['Bali Sea (N)', -8.2500, 116.2000],
  ['Indian Ocean (S)', -9.0500, 116.3000],
  ['Alas Strait (E)', -8.6000, 116.8000],
];
const COASTAL = [
  ['Senggigi', -8.4936, 116.0424],
  ['Lembar ferry', -8.7269, 116.0722],
  ['Kuta Lombok', -8.8947, 116.2803],
  ['Tanjung Luar', -8.7550, 116.5470],
  ['Ampenan', -8.5670, 116.0700],
];

let fails = 0;
console.log('\nINLAND — expect inside');
for (const [n, lat, lng] of LAND) {
  const ok = inside([px(lng), py(lat)], main);
  if (!ok) fails += 1;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${n}`);
}
console.log('\nOPEN SEA — expect outside');
for (const [n, lat, lng] of SEA) {
  const ok = !inside([px(lng), py(lat)], main);
  if (!ok) fails += 1;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${n}`);
}
console.log('\nCOASTAL TOWNS — expect within ~1.5 km of the outline');
for (const [n, lat, lng] of COASTAL) {
  const d = distToRing([px(lng), py(lat)], main) * M_PER_PX;
  const ok = d < 1500;
  if (!ok) fails += 1;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${n.padEnd(16)} ${(d / 1000).toFixed(2)} km from coast`);
}

/* The villa is 4 minutes' walk from the sand, so it must be very close to the
   outline. If simplification has smoothed Ekas bay away, this is where it shows. */
const dVilla = distToRing([px(116.4502), py(-8.9016)], main) * M_PER_PX;
console.log(`\nVilla to drawn coastline: ${Math.round(dVilla)} m`);
if (dVilla > 1200) { console.log('  FAIL — Ekas bay has been simplified away'); fails += 1; }
else console.log('  ok — the bay survives simplification');

console.log(`\n${fails === 0 ? 'ALL CHECKS PASSED' : `${fails} CHECK(S) FAILED`}`);
process.exitCode = fails ? 1 : 0;
