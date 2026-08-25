/* Pull the real coastline of Lombok (and its islets) from OpenStreetMap.

   OSM stores coastline as open `natural=coastline` ways that must be stitched
   end-to-end into closed rings. Direction is meaningful: land is on the LEFT
   of the way direction, so a correctly stitched island ring runs anticlockwise
   in lat/lng — which becomes clockwise once y is flipped for SVG. */

const BBOX = { s: -9.10, w: 115.70, n: -8.05, e: 116.95 };

const q = `
[out:json][timeout:180];
(
  way["natural"="coastline"](${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});
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
if (!res.ok) {
  console.error('Overpass failed:', res.status, (await res.text()).slice(0, 400));
  process.exit(1);
}
const data = await res.json();
const ways = data.elements.filter((e) => e.type === 'way' && e.geometry?.length);
console.log('coastline ways:', ways.length);

/* -- stitch ------------------------------------------------------------- */
const key = (p) => `${p.lat.toFixed(7)},${p.lon.toFixed(7)}`;
const byStart = new Map();
for (const w of ways) {
  const k = key(w.geometry[0]);
  if (!byStart.has(k)) byStart.set(k, []);
  byStart.get(k).push(w);
}

const used = new Set();
const rings = [];
for (const w of ways) {
  if (used.has(w.id)) continue;
  let ring = [...w.geometry];
  used.add(w.id);
  for (;;) {
    const tail = key(ring[ring.length - 1]);
    if (tail === key(ring[0]) && ring.length > 3) break;      // closed
    const cands = (byStart.get(tail) ?? []).filter((c) => !used.has(c.id));
    if (!cands.length) break;                                  // open chain
    const next = cands[0];
    used.add(next.id);
    ring = ring.concat(next.geometry.slice(1));
  }
  rings.push(ring);
}
console.log('rings stitched:', rings.length);

/* -- measure ------------------------------------------------------------- */
function area(r) {                       // shoelace, in square degrees
  let a = 0;
  for (let i = 0, j = r.length - 1; i < r.length; j = i, i += 1) {
    a += (r[j].lon + r[i].lon) * (r[j].lat - r[i].lat);
  }
  return a / 2;
}
const measured = rings
  .map((r) => ({ r, a: Math.abs(area(r)), closed: key(r[0]) === key(r[r.length - 1]), n: r.length }))
  .sort((x, y) => y.a - x.a);

console.log('\nlargest rings:');
for (const m of measured.slice(0, 12)) {
  const lats = m.r.map((p) => p.lat);
  const lons = m.r.map((p) => p.lon);
  console.log(
    `  area ${m.a.toExponential(3)}  pts ${String(m.n).padStart(6)}  closed ${m.closed}`
    + `  lat ${Math.min(...lats).toFixed(3)}..${Math.max(...lats).toFixed(3)}`
    + `  lng ${Math.min(...lons).toFixed(3)}..${Math.max(...lons).toFixed(3)}`,
  );
}

const { writeFileSync } = await import('node:fs');
writeFileSync(
  new URL('./rings.json', import.meta.url),
  JSON.stringify(measured.map((m) => ({ a: m.a, closed: m.closed, pts: m.r.map((p) => [p.lon, p.lat]) }))),
);
console.log('\nwrote rings.json');
