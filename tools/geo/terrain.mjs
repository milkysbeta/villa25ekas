import { readFileSync, writeFileSync } from 'node:fs';

const P = JSON.parse(readFileSync(new URL('./paths.json', import.meta.url)));
const { bounds: B, kx, scale, pad } = P;
const px = (lon) => pad + (lon - B.w) * kx * scale;
const py = (lat) => pad + (B.n - lat) * scale;
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

const q = `
[out:json][timeout:120];
(
  node["natural"="peak"](if: t["ele"] > 1800)(-8.60,116.25,-8.25,116.65);
  nwr["natural"="water"]["name"~"Segara Anak",i](-8.50,116.35,-8.35,116.50);
);
out geom;
`;

const res = await fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  body: `data=${encodeURIComponent(q)}`,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'villa25ekas-site/0.1 (map research; milkysbeta@gmail.com)',
    Accept: '*/*',
  },
});
const data = await res.json();

const peaks = [];
let lake = null;
for (const e of data.elements) {
  const t = e.tags ?? {};
  if (e.type === 'node' && t.natural === 'peak') {
    peaks.push({ name: t.name ?? '(unnamed)', ele: t.ele ? Number(t.ele) : null, lat: e.lat, lng: e.lon });
  }
  const geom = e.geometry ?? (e.members?.flatMap((m) => m.geometry ?? []) ?? []);
  if (t.natural === 'water' && geom.length) {
    const proj = geom.map((g) => [px(g.lon), py(g.lat)]);
    const s = simplify(proj, 0.8);
    const d = `M${s.map((p) => `${r1(p[0])} ${r1(p[1])}`).join('L')}Z`;
    if (!lake || s.length > lake.n) lake = { d, n: s.length, raw: geom.length };
  }
}

console.log('peaks above 1800 m:');
for (const p of peaks.sort((a, b) => (b.ele ?? 0) - (a.ele ?? 0))) {
  console.log(`  ${String(p.name).padEnd(26)} ${String(p.ele ?? '?').padStart(5)} m  ${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}  svg ${r1(px(p.lng))}, ${r1(py(p.lat))}`);
}
if (lake) console.log(`\nSegara Anak: ${lake.raw} -> ${lake.n} pts, ${(lake.d.length / 1024).toFixed(1)} kB`);

writeFileSync(new URL('./terrain.json', import.meta.url), JSON.stringify({
  peaks: peaks.map((p) => ({ ...p, x: r1(px(p.lng)), y: r1(py(p.lat)) })),
  lake: lake?.d ?? null,
}));
console.log('wrote terrain.json');
