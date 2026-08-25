/* Fix the marker coordinates.

   The breaks and the village were placed by eye against a drawn coastline. Now
   that the coastline is real, three of them are visibly wrong: the beach break
   is 1.5 km inland, the village is 400 m out to sea. This finds real positions:
     - named places from OSM
     - the beach break from the actual nearest sand to the villa
     - the surf breaks nudged to sit in water rather than on a hillside */

import { readFileSync } from 'node:fs';

const rings = JSON.parse(readFileSync(new URL('./rings.json', import.meta.url)));
const main = rings[0].pts;                              // [lon, lat]

const R = 6371000;
const rad = (d) => (d * Math.PI) / 180;
const metres = (a, b) => {
  const dLat = rad(b[1] - a[1]); const dLng = rad(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
const inside = (pt, poly) => {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const [xi, yi] = poly[i]; const [xj, yj] = poly[j];
    if ((yi > pt[1]) !== (yj > pt[1])
      && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
};
const nearestCoast = (lat, lng) => {
  let best = null; let bd = Infinity;
  for (const p of main) {
    const d = metres([lng, lat], p);
    if (d < bd) { bd = d; best = p; }
  }
  return { lat: best[1], lng: best[0], d: bd };
};

const VILLA = { lat: -8.901637, lng: 116.450203 };

/* -- 1. the beach the villa walks to ------------------------------------- */
const sand = nearestCoast(VILLA.lat, VILLA.lng);
console.log(`nearest sand to the villa: ${sand.lat.toFixed(5)}, ${sand.lng.toFixed(5)}  (${Math.round(sand.d)} m)`);

/* -- 2. named places from OSM -------------------------------------------- */
const q = `
[out:json][timeout:90];
(
  node["place"~"village|hamlet|town"](-8.96,116.38,-8.84,116.55);
  nwr["natural"="beach"](-8.96,116.38,-8.84,116.55);
  nwr["sport"="surfing"](-8.98,116.36,-8.84,116.56);
);
out center tags;
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

console.log('\nnamed places nearby:');
for (const e of data.elements) {
  const t = e.tags ?? {};
  const lat = e.lat ?? e.center?.lat; const lng = e.lon ?? e.center?.lon;
  if (!lat || !t.name) continue;
  const d = metres([VILLA.lng, VILLA.lat], [lng, lat]);
  console.log(
    `  ${(t.name).padEnd(26)} ${(t.place ?? t.natural ?? t.sport ?? '').padEnd(9)}`
    + ` ${lat.toFixed(5)}, ${lng.toFixed(5)}  ${(d / 1000).toFixed(2)} km`,
  );
}

/* -- 3. audit the existing markers --------------------------------------- */
console.log('\naudit of current markers:');
const CUR = [
  ['inside', 'Inside Ekas', -8.9105, 116.4380],
  ['outside', 'Outside Ekas', -8.9380, 116.4150],
  ['beach', 'Beach break', -8.8930, 116.4640],
  ['kura', 'Kura Kura', -8.9270, 116.4760],
  ['kite', 'Kite surfing', -8.8790, 116.4890],
  ['village', 'Ekas village', -8.8916, 116.4460],
  ['kalian', 'Pantai Kaliantan', -8.8867, 116.5122],
];
for (const [, name, lat, lng] of CUR) {
  const onLand = inside([lng, lat], main);
  const c = nearestCoast(lat, lng);
  const want = name.includes('village') ? 'land' : name.includes('Kaliantan') ? 'coast' : 'water';
  let verdict = 'ok';
  if (want === 'water' && onLand) verdict = `WRONG — ${Math.round(c.d)} m inland`;
  if (want === 'land' && !onLand) verdict = `WRONG — ${Math.round(c.d)} m offshore`;
  console.log(`  ${name.padEnd(18)} ${onLand ? 'land ' : 'water'}  ${verdict}`);
}
