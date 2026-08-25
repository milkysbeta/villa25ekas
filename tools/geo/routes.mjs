/* Real driving routes, not decorative curves.

   The three ways in are currently drawn as quadratic beziers bowed by a
   hand-picked number of pixels. They look like routes and mean nothing. OSRM
   returns the actual road geometry AND the actual distance and duration, so
   the drawn line follows the road a guest will really be on — and we get to
   check the drive times the site quotes against something. */

import { readFileSync, writeFileSync } from 'node:fs';

const P = JSON.parse(readFileSync(new URL('./paths.json', import.meta.url)));
const { bounds: B, kx, scale, pad } = P;
const px = (lon) => pad + (lon - B.w) * kx * scale;
const py = (lat) => pad + (B.n - lat) * scale;

const VILLA = { lat: -8.901637, lng: 116.450203 };

const FROM = [
  { id: 'fly',  name: 'Lombok Intl airport', lat: -8.7573, lng: 116.2767, quoted: '1 to 1.5 hrs, 35 km' },
  { id: 'slow', name: 'Lembar ferry',        lat: -8.7269, lng: 116.0722, quoted: 'about 2 hrs' },
  { id: 'fast', name: 'Senggigi',            lat: -8.4936, lng: 116.0424, quoted: '1 hr 20, 79 km' },
];

const out = {};
for (const f of FROM) {
  const url = `https://router.project-osrm.org/route/v1/driving/`
    + `${f.lng},${f.lat};${VILLA.lng},${VILLA.lat}`
    + `?overview=full&geometries=geojson&alternatives=false&steps=false`;
  const r = await fetch(url, { headers: { 'User-Agent': 'villa25ekas-site/0.1' } });
  if (!r.ok) { console.log(`${f.id}: HTTP ${r.status}`); continue; }
  const j = await r.json();
  if (j.code !== 'Ok') { console.log(`${f.id}: ${j.code}`); continue; }

  const leg = j.routes[0];
  const coords = leg.geometry.coordinates;          // [lon, lat]
  const km = leg.distance / 1000;
  const mins = leg.duration / 60;

  /* OSRM's duration assumes free-flowing traffic and legal speed limits.
     Lombok's south-east roads deliver neither, so this is a floor. */
  console.log(
    `${f.id.padEnd(5)} ${f.name.padEnd(22)} ${km.toFixed(1).padStart(6)} km  `
    + `${Math.round(mins).toString().padStart(4)} min (OSRM, optimistic)   site says: ${f.quoted}`,
  );

  /* simplify in pixel space, same as the coastline */
  const proj = coords.map(([lon, lat]) => [px(lon), py(lat)]);
  const simp = simplify(proj, 1.1);
  const r1 = (n) => Math.round(n * 10) / 10;
  let d = `M${r1(simp[0][0])} ${r1(simp[0][1])}`;
  for (let i = 1; i < simp.length; i += 1) d += `L${r1(simp[i][0])} ${r1(simp[i][1])}`;

  out[f.id] = { d, km: +km.toFixed(1), mins: Math.round(mins), pts: simp.length, raw: coords.length };
  console.log(`      path ${coords.length} -> ${simp.length} pts, ${(d.length / 1024).toFixed(1)} kB`);
}

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
      let x = a[0]; let y = a[1];
      let dx = b[0] - x; let dy = b[1] - y;
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

writeFileSync(new URL('./routes.json', import.meta.url), JSON.stringify(out));
console.log('\nwrote routes.json');
