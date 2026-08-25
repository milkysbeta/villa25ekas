# Map geometry

`site/src/data/lombok-geo.js` is generated, not written. These scripts make it.

The map used to draw Lombok as a chain of bezier curves and the three arrival
routes as arcs bowed by a hand-picked number of pixels. It looked like a map
and told the reader nothing true — and once the coastline became real, three
markers turned out to be in the wrong place entirely: the beach break was
1.5 km inland and Ekas village was 400 m out to sea.

## Running it

In order, from the repo root:

```bash
node tools/geo/coast.mjs
```

Then `gen.mjs`, `routes.mjs`, `terrain.mjs`, and finally `emit.mjs`, which
writes the module. `verify.mjs` and `places.mjs` are checks, not steps.

| script | what it does |
| --- | --- |
| `coast.mjs` | Fetches `natural=coastline` ways from Overpass and stitches them into closed rings. OSM stores coastline as open ways that only become an island when joined end to end. Writes `rings.json`. |
| `gen.mjs` | Projects and simplifies. Douglas–Peucker runs in **projected pixel space**, so the tolerance is in the units the reader actually sees. 16,315 points become 1,836 — about 107 m per pixel. Writes `paths.json`. |
| `routes.mjs` | Asks OSRM for real driving routes from the airport, Lembar and Senggigi. Returns road geometry *and* real distances. Writes `routes.json`. |
| `terrain.mjs` | Peaks above 1,800 m and the Segara Anak crater lake. Writes `terrain.json`. |
| `emit.mjs` | Writes `site/src/data/lombok-geo.js` — two projections, island and bay. |
| `verify.mjs` | The check that matters. See below. |
| `places.mjs` | Audits marker coordinates against the real coastline. |

## Verification

`verify.mjs` is the reason to trust the output. A map can look right and be
wrong, so it asserts things that fail loudly:

- known inland places fall **inside** the polygon
- known open sea falls **outside** it
- five coastal towns sit within 1.5 km of the drawn outline
- the villa sits within 1.2 km of the coast

Last run: all passed. Coastal towns came in between 90 m and 270 m of the
outline, and the villa landed 293 m from the sea — which is the four-minute
walk the site claims, arrived at independently.

Run it after any change to the tolerance in `gen.mjs`. Raising the tolerance
to shave kilobytes will eventually smooth Ekas Bay away, and that check is
what catches it.

## Attribution

Coastline and place data © OpenStreetMap contributors, [ODbL](https://www.openstreetmap.org/copyright).
Routing by [OSRM](https://project-osrm.org/). Both are credited in the map's caption.

Overpass returns HTTP 406 without a real `User-Agent`, which is why every
script sets one.

## Known gaps

- **The kite spot is not on the map.** Its recorded position was 625 m inland,
  and snapping it to water moved it 1.2 km east onto Kaliantan, which is a
  guess rather than a fact. Left off until John says where it actually is.
- **Break positions are approximate.** Inside, Outside and Kura Kura are in the
  right water on the right side of the bay, but they are not surveyed. OSM has
  no surf nodes for Ekas — the nearest are at Gerupuk, 9 km away.
