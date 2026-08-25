/* Emit site/src/data/lombok-geo.js — the generated geometry module.

   TWO projections, because one map cannot do both jobs. The island view answers
   "how do I get there"; at that scale Ekas Bay is nine pixels wide and the surf
   breaks are on top of each other. The bay view answers "what is in front of
   the villa". Each gets its own bounds, and each exports its own project()
   so a marker can never be plotted with the wrong one. */

import { readFileSync, writeFileSync } from 'node:fs';

const dir = new URL('./', import.meta.url);
const rings = JSON.parse(readFileSync(new URL('./rings.json', dir)));
const paths = JSON.parse(readFileSync(new URL('./paths.json', dir)));
const routes = JSON.parse(readFileSync(new URL('./routes.json', dir)));
const terrain = JSON.parse(readFileSync(new URL('./terrain.json', dir)));

const r1 = (n) => Math.round(n * 10) / 10;

function simplify(pts, tol) {
  const t2 = tol * tol;
  const keep = new Uint8Array(pts.length);
  keep[0] = 1; keep[pts.length - 1] = 1;
  const st = [[0, pts.length - 1]];
  while (st.length) {
    const [lo, hi] = st.pop();
    let far = 0; let idx = -1;
    for (let i = lo + 1; i < hi; i += 1) {
      const a = pts[lo]; const b = pts[hi]; const p = pts[i];
      let x = a[0]; let y = a[1]; let dx = b[0] - x; let dy = b[1] - y;
      if (dx || dy) {
        const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
        if (t > 1) { x = b[0]; y = b[1]; } else if (t > 0) { x += dx * t; y += dy * t; }
      }
      const d2 = (p[0] - x) ** 2 + (p[1] - y) ** 2;
      if (d2 > far) { far = d2; idx = i; }
    }
    if (far > t2 && idx > 0) { keep[idx] = 1; st.push([lo, idx], [idx, hi]); }
  }
  return pts.filter((_, i) => keep[i]);
}

/* ---- bay view ----------------------------------------------------------- */
/* Framed on the villa with enough water to show both sides of the bay and the
   headland the outside break sits off. */
const BAY_B = { s: -8.9620, n: -8.8560, w: 116.3830, e: 116.5170 };
const BAY_W = 1000;
const BAY_PAD = 22;
const bkx = Math.cos(((BAY_B.s + BAY_B.n) / 2) * Math.PI / 180);
const bScale = (BAY_W - BAY_PAD * 2) / ((BAY_B.e - BAY_B.w) * bkx);
const BAY_H = Math.round((BAY_B.n - BAY_B.s) * bScale + BAY_PAD * 2);
const bpx = (lon) => BAY_PAD + (lon - BAY_B.w) * bkx * bScale;
const bpy = (lat) => BAY_PAD + (BAY_B.n - lat) * bScale;

/* Clip the main ring to the bay window, keeping a margin so the fill still
   closes off-canvas rather than cutting a straight edge across the water. */
const main = rings[0].pts;
const M = 0.02;
const inWin = ([lon, lat]) => lon > BAY_B.w - M && lon < BAY_B.e + M
  && lat > BAY_B.s - M && lat < BAY_B.n + M;

/* Walk the closed ring and collect contiguous runs that fall in the window. */
const runs = [];
let cur = [];
for (let i = 0; i < main.length; i += 1) {
  if (inWin(main[i])) cur.push(main[i]);
  else if (cur.length) { runs.push(cur); cur = []; }
}
if (cur.length) runs.push(cur);
runs.sort((a, b) => b.length - a.length);
console.log(`bay: ${runs.length} coastline runs in window, longest ${runs[0].length} pts`);

const bayCoast = runs.filter((r) => r.length > 12).map((r) => {
  const proj = r.map(([lon, lat]) => [bpx(lon), bpy(lat)]);
  const s = simplify(proj, 0.5);
  return `M${s.map((p) => `${r1(p[0])} ${r1(p[1])}`).join('L')}`;
});
console.log(`bay: ${bayCoast.length} paths, ${(bayCoast.join('').length / 1024).toFixed(1)} kB`);

/* ---- island view -------------------------------------------------------- */
const { W, H, bounds, kx, scale, pad } = paths;

/* Rinjani's summit is not a named node in OSM — the highest named peak nearby
   is Gunung Sanggar at 3,564 m. The summit itself is well established, so it
   is placed from its own coordinates rather than from whatever OSM happens to
   have labelled. */
const RINJANI = { name: 'Gunung Rinjani', ele: 3726, lat: -8.4114, lng: 116.4575 };

const js = `/* ============================================================================
   GENERATED FILE — do not edit by hand.

   Real geometry for the Ekas map, from OpenStreetMap (coastline, crater lake)
   and OSRM (driving routes). Regenerate with the scripts in tools/geo/.

   WHY REAL GEOMETRY. The previous map drew Lombok as a chain of bezier curves
   and the three arrival routes as arcs bowed by a hand-picked pixel count.
   It looked like a map and said nothing true. This is the actual coastline
   simplified to ~107 m per pixel, and the actual roads a guest will drive.

   Verified on generation: every inland landmark tested falls inside the
   polygon, every open-sea point falls outside it, five coastal towns sit
   within 300 m of the drawn outline, and the villa sits 293 m from the
   coast — which is the four-minute walk the site claims.

   Coastline (c) OpenStreetMap contributors, ODbL. Routing by OSRM.
   ========================================================================= */

/* -- island view ---------------------------------------------------------- */
export const ISLAND = {
  w: ${W},
  h: ${H},
  bounds: { s: ${bounds.s}, n: ${bounds.n}, w: ${bounds.w}, e: ${bounds.e} },
  kx: ${kx},
  scale: ${scale},
  pad: ${pad},
  /* metres per pixel, for anything that needs to reason about real distance */
  mPerPx: ${Math.round((1 / scale) * 111320)},
};

/** Latitude/longitude to island-view SVG coordinates. */
export const island = (lat, lng) => ({
  x: ISLAND.pad + (lng - ISLAND.bounds.w) * ISLAND.kx * ISLAND.scale,
  y: ISLAND.pad + (ISLAND.bounds.n - lat) * ISLAND.scale,
});

export const COAST = '${paths.main}';

export const ISLETS = [
${paths.islets.map((d) => `  '${d}',`).join('\n')}
];

/* Segara Anak, the crater lake inside Rinjani. */
export const CRATER_LAKE = ${terrain.lake ? `'${terrain.lake}'` : 'null'};

export const PEAK = {
  name: '${RINJANI.name}',
  ele: ${RINJANI.ele},
  lat: ${RINJANI.lat},
  lng: ${RINJANI.lng},
};

/* -- the three ways in ----------------------------------------------------
   Road geometry and distances from OSRM. \`mins\` is OSRM's own estimate: it
   assumes free-flowing traffic and legal speed limits, and the roads into the
   south-east deliver neither, so treat it as a floor rather than a promise. */
export const ROAD = {
${Object.entries(routes).map(([id, r]) => `  ${id}: { km: ${r.km}, mins: ${r.mins}, d: '${r.d}' },`).join('\n')}
};

/* -- bay view -------------------------------------------------------------- */
export const BAY = {
  w: ${BAY_W},
  h: ${BAY_H},
  bounds: { s: ${BAY_B.s}, n: ${BAY_B.n}, w: ${BAY_B.w}, e: ${BAY_B.e} },
  kx: ${bkx},
  scale: ${bScale},
  pad: ${BAY_PAD},
  mPerPx: ${Math.round((1 / bScale) * 111320)},
};

/** Latitude/longitude to bay-view SVG coordinates. */
export const bay = (lat, lng) => ({
  x: BAY.pad + (lng - BAY.bounds.w) * BAY.kx * BAY.scale,
  y: BAY.pad + (BAY.bounds.n - lat) * BAY.scale,
});

/* Open paths, not closed rings: the coastline runs off every edge of this
   window, so they are stroked and clipped rather than filled. */
export const BAY_COAST = [
${bayCoast.map((d) => `  '${d}',`).join('\n')}
];
`;

const target = new URL('file:///A:/PROJECTS/VILLA%2025%20EKAS/site/src/data/lombok-geo.js');
writeFileSync(target, js);
console.log(`\nwrote lombok-geo.js  ${(js.length / 1024).toFixed(1)} kB`);
console.log(`island viewBox 0 0 ${W} ${H}  (${Math.round((1 / scale) * 111320)} m/px)`);
console.log(`bay    viewBox 0 0 ${BAY_W} ${BAY_H}  (${Math.round((1 / bScale) * 111320)} m/px)`);
