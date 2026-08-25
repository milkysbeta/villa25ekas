/* Turn the stitched OSM rings into SVG path data for the site.

   Two things matter here and they pull against each other:
     - the island must be the real shape, not an impression of one
     - 16,315 points is a 400 kB path nobody should download to look at a map

   Douglas-Peucker in PROJECTED pixel space resolves it: tolerance is then in
   the units the reader actually sees, so the simplification is as coarse as it
   can be without changing the drawing. */

import { readFileSync, writeFileSync } from 'node:fs';

const rings = JSON.parse(readFileSync(new URL('./rings.json', import.meta.url)));

/* -- what counts as Lombok ------------------------------------------------ */
const LOMBOK = { s: -8.99, w: 115.80, n: -8.19, e: 116.76 };
const inside = ([lon, lat]) => lat > LOMBOK.s && lat < LOMBOK.n && lon > LOMBOK.w && lon < LOMBOK.e;

const keep = rings.filter((r) => r.closed && r.pts.every(inside) && r.a > 2e-5);
console.log('rings kept:', keep.length, '(largest first)');

/* -- projection ----------------------------------------------------------- */
/* Equirectangular with the x axis scaled by cos(mean latitude). Over 0.8 deg
   this is within a pixel of Mercator and does not distort the island. */
const all = keep.flatMap((r) => r.pts);
const lats = all.map((p) => p[1]);
const lons = all.map((p) => p[0]);
const B = {
  s: Math.min(...lats), n: Math.max(...lats), w: Math.min(...lons), e: Math.max(...lons),
};
const kx = Math.cos(((B.s + B.n) / 2) * Math.PI / 180);

const PAD = 26;
const W = 1000;
const spanX = (B.e - B.w) * kx;
const spanY = B.n - B.s;
const scale = (W - PAD * 2) / spanX;
const H = Math.round(spanY * scale + PAD * 2);

const px = (lon) => PAD + (lon - B.w) * kx * scale;
const py = (lat) => PAD + (B.n - lat) * scale;

console.log(`bounds  lat ${B.s.toFixed(4)}..${B.n.toFixed(4)}  lng ${B.w.toFixed(4)}..${B.e.toFixed(4)}`);
console.log(`viewBox 0 0 ${W} ${H}   (1 px ~= ${(1 / scale * 111.32 * 1000).toFixed(0)} m)`);

/* -- Douglas-Peucker ------------------------------------------------------ */
function segDist(p, a, b) {
  let x = a[0]; let y = a[1];
  let dx = b[0] - x; let dy = b[1] - y;
  if (dx !== 0 || dy !== 0) {
    const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) { x = b[0]; y = b[1]; } else if (t > 0) { x += dx * t; y += dy * t; }
  }
  dx = p[0] - x; dy = p[1] - y;
  return dx * dx + dy * dy;
}
function dp(pts, tol2) {
  if (pts.length < 3) return pts;
  const keepIdx = new Uint8Array(pts.length);
  keepIdx[0] = 1; keepIdx[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [lo, hi] = stack.pop();
    let far = 0; let idx = -1;
    for (let i = lo + 1; i < hi; i += 1) {
      const d = segDist(pts[i], pts[lo], pts[hi]);
      if (d > far) { far = d; idx = i; }
    }
    if (far > tol2 && idx > 0) {
      keepIdx[idx] = 1;
      stack.push([lo, idx], [idx, hi]);
    }
  }
  return pts.filter((_, i) => keepIdx[i]);
}

/* -- emit ----------------------------------------------------------------- */
const r1 = (n) => Math.round(n * 10) / 10;

function toPath(ptsLL, tol) {
  const proj = ptsLL.map(([lon, lat]) => [px(lon), py(lat)]);
  const simp = dp(proj, tol * tol);
  let d = `M${r1(simp[0][0])} ${r1(simp[0][1])}`;
  for (let i = 1; i < simp.length; i += 1) d += `L${r1(simp[i][0])} ${r1(simp[i][1])}`;
  return { d: `${d}Z`, before: ptsLL.length, after: simp.length };
}

/* The main island carries the detail budget; the islets are small enough that
   a tighter tolerance costs almost nothing and stops them turning into
   triangles. */
const out = [];
keep.forEach((r, i) => {
  const tol = i === 0 ? 0.55 : 0.3;
  const p = toPath(r.pts, tol);
  out.push(p);
  if (i < 8 || p.after > 40) {
    const la = r.pts.map((x) => x[1]); const lo = r.pts.map((x) => x[0]);
    console.log(
      `  ${String(i).padStart(2)}  ${String(p.before).padStart(6)} -> ${String(p.after).padStart(5)} pts`
      + `  ${(p.d.length / 1024).toFixed(1)} kB`
      + `  lat ${Math.min(...la).toFixed(3)}..${Math.max(...la).toFixed(3)}`
      + ` lng ${Math.min(...lo).toFixed(3)}..${Math.max(...lo).toFixed(3)}`,
    );
  }
});

const total = out.reduce((s, p) => s + p.d.length, 0);
console.log(`\ntotal path data: ${(total / 1024).toFixed(1)} kB across ${out.length} rings`);

writeFileSync(new URL('./paths.json', import.meta.url), JSON.stringify({
  W, H, bounds: B, kx, scale, pad: PAD,
  main: out[0].d,
  islets: out.slice(1).map((p) => p.d),
}, null, 0));
console.log('wrote paths.json');
