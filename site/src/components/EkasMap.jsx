import { useState } from 'react';
import { CONTACT } from '../data/villa.js';

/* ============================================================================
   Lombok, drawn rather than tiled.

   The villa is in EAST Lombok — Jerowaru district, Kabupaten Lombok Timur.
   The map reaches across to the west coast only because the ways in do.

   No Leaflet, no Mapbox, no tile server: a tiled map means an API key, a
   third-party request on every page load, and a rectangle of somebody else's
   grey fighting everything around it. This is an SVG in the site's own tokens,
   so it themes with the page and costs nothing.

   MARKERS are placed from real latitude and longitude projected into the
   viewBox, so relative positions and distances are honest. The COASTLINE is
   drawn — clearly illustrative, and the caption says so. That is the right
   split: a guest needs to know Kuta is an hour west and the break is at the
   bottom of the garden, not the exact shape of a headland.

   Hovering a route in the key lifts that route and dims the others, which is
   the one thing this can do that a printed map cannot.
   ========================================================================= */

const BOUNDS = { north: -8.42, south: -8.99, west: 115.96, east: 116.68 };
const W = 1000;
const H = 640;

const px = (lng) => ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * W;
const py = (lat) => ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * H;

const PLACES = [
  /* the villa */
  { id: 'villa',   name: 'Villa 25 Ekas',  lat: -8.9016, lng: 116.4502, kind: 'villa', lead: [98, -30] },

  /* surf */
  { id: 'inside',  name: 'Inside Ekas',    lat: -8.9105, lng: 116.4380, kind: 'surf', lead: [-120, 26] },
  { id: 'outside', name: 'Outside Ekas',   lat: -8.9380, lng: 116.4150, kind: 'surf', lead: [-118, 18] },
  { id: 'beach',   name: 'Beach break',    lat: -8.8930, lng: 116.4640, kind: 'surf', lead: [118, 24] },
  { id: 'kura',    name: 'Kura Kura',      lat: -8.9270, lng: 116.4760, kind: 'surf', lead: [92, 34] },
  { id: 'kite',    name: 'Kite surfing',   lat: -8.8790, lng: 116.4890, kind: 'surf', lead: [64, -62] },

  /* nearby, distances from the property's own listing */
  { id: 'village', name: 'Ekas village',   lat: -8.8916, lng: 116.4460, kind: 'near', note: '1.1 km', lead: [-130, -14] },
  { id: 'kalian',  name: 'Pantai Kaliantan', lat: -8.8867, lng: 116.5122, kind: 'near', note: '5 km', lead: [64, 74] },
  { id: 'kopi',    name: 'Gubuk Kopi',     lat: -8.8600, lng: 116.4180, kind: 'near', note: '7 km', lead: [-150, -8] },
  { id: 'mangrove',name: 'Mangrove park',  lat: -8.8100, lng: 116.4900, kind: 'near', note: '13 km' },

  /* day trips */
  { id: 'pink',    name: 'Pink Beach',     lat: -8.8447, lng: 116.5928, kind: 'trip', lead: [30, -40] },
  { id: 'kuta',    name: 'Kuta',           lat: -8.8947, lng: 116.2803, kind: 'trip', note: '1 hr' },
  { id: 'selong',  name: 'Selong Belanak', lat: -8.8756, lng: 116.1408, kind: 'trip', note: '1.5 hrs' },

  /* ways in */
  { id: 'airport', name: 'Lombok Intl',    lat: -8.7573, lng: 116.2767, kind: 'gate', note: '35 km · 1–1.5 hrs' },
  { id: 'lembar',  name: 'Lembar ferry',   lat: -8.7269, lng: 116.0722, kind: 'gate', note: 'slow boat · ~2 hrs' },
  { id: 'senggigi',name: 'Senggigi',       lat: -8.4936, lng: 116.0424, kind: 'gate', note: 'fast boat · 1 hr 20' },
];

const KINDS = {
  villa: { label: 'The villa', fill: 'var(--color-bronze-lit)' },
  surf:  { label: 'Surf',      fill: 'var(--color-reef)' },
  near:  { label: 'Nearby',    fill: 'var(--color-text-mute)' },
  trip:  { label: 'Day trips', fill: 'var(--color-text-soft)' },
  gate:  { label: 'Ways in',   fill: 'var(--color-bronze)' },
};

/* The road each arrival takes, as a gentle curve rather than a straight line —
   nothing on Lombok is a straight line. */
const ROUTE_PATHS = [
  { id: 'fly',      from: 'airport',  label: 'Fly · 1–1.5 hrs',   bend: -55 },
  { id: 'slow',     from: 'lembar',   label: 'Slow boat · ~2 hrs', bend: 80 },
  { id: 'fast',     from: 'senggigi', label: 'Fast boat · 1 hr 20', bend: -130 },
];

const at = (id) => {
  const p = PLACES.find((x) => x.id === id);
  return { x: px(p.lng), y: py(p.lat) };
};

/** A quadratic curve between two points, bowed by `bend` pixels. */
function curve(a, b, bend) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * bend;
  const cy = my + (dx / len) * bend;
  return `M ${a.x} ${a.y} Q ${cx} ${cy}, ${b.x} ${b.y}`;
}

/* Simplified Lombok: the west coast, the south bays, and the Ekas peninsula
   with its bay. Drawn to read correctly, not to navigate by. */
const COAST =
  'M 30 60 C 90 20, 190 8, 290 34 C 372 56, 430 44, 500 66 '
  + 'C 578 90, 646 82, 716 112 C 796 146, 872 176, 918 236 '
  + 'C 958 290, 950 350, 916 392 C 884 432, 838 438, 812 472 '
  + 'C 788 504, 800 546, 760 570 C 716 596, 668 562, 646 518 '
  + 'C 628 482, 596 470, 562 490 C 522 514, 500 558, 452 566 '
  + 'C 404 574, 366 540, 322 516 C 268 486, 214 490, 162 470 '
  + 'C 100 446, 46 404, 24 340 C 2 274, -2 118, 30 60 Z';

/* The bay the villa sits above. */
const BAY =
  'M 648 512 C 676 486, 716 484, 744 506 C 768 524, 762 556, 734 566 '
  + 'C 700 578, 662 552, 648 528 Z';

/* ----------------------------------------------------------------------------
   Label de-collision.

   Around the bay eight places sit inside ninety pixels, so labels land on top
   of each other. Hand-tuning offsets turned into whack-a-mole — move one and
   another collides — so the spread is computed instead: take the labels on
   each side, sort them by height, then push each down until it clears the one
   above by a minimum gap. Deterministic, and it stays correct when a place is
   added or a coordinate is corrected.
   ------------------------------------------------------------------------- */
const GAP = 26;

function layout() {
  const out = new Map();

  for (const side of ['left', 'right']) {
    const group = PLACES
      .filter((p) => p.lead && (p.lead[0] < 0) === (side === 'left'))
      .map((p) => ({
        id: p.id,
        x: px(p.lng) + p.lead[0],
        y: py(p.lat) + p.lead[1],
      }))
      .sort((a, b) => a.y - b.y);

    let lastY = -Infinity;
    for (const item of group) {
      const y = Math.max(item.y, lastY + GAP);
      lastY = y;
      out.set(item.id, { x: item.x, y });
    }
  }
  return out;
}

const LABEL_AT = layout();

export default function EkasMap({ className = '' }) {
  const [hot, setHot] = useState(null);   // hovered route id
  const villa = at('villa');

  const mapsUrl =
    `https://www.google.com/maps/search/?api=1&query=${CONTACT.coords.lat},${CONTACT.coords.lng}`;

  return (
    <figure className={`m-0 ${className}`}>
      <div className="relative overflow-hidden border border-(--color-line) bg-(--color-ink)">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full"
          role="img"
          aria-label="Illustrated map of Lombok showing Villa 25 Ekas in East Lombok, the surf breaks, day trips and the three ways in"
        >
          <defs>
            <pattern id="swell" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M0 21 Q 7 15, 14 21 T 28 21" fill="none"
                stroke="var(--color-reef)" strokeWidth="0.9" opacity="0.15" />
            </pattern>
            <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-raise)" />
              <stop offset="100%" stopColor="var(--color-shell)" />
            </linearGradient>
            <radialGradient id="glow">
              <stop offset="0%" stopColor="var(--color-bronze-lit)" stopOpacity="0.34" />
              <stop offset="100%" stopColor="var(--color-bronze-lit)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width={W} height={H} fill="var(--color-ink)" />
          <rect width={W} height={H} fill="url(#swell)" />

          <path d={COAST} fill="url(#land)" stroke="var(--color-bronze)" strokeWidth="1.5" opacity="0.95" />
          <path d={BAY} fill="var(--color-ink)" stroke="var(--color-reef)" strokeWidth="1.2" opacity="0.85" />

          {/* the three journeys */}
          {ROUTE_PATHS.map((r) => {
            const dim = hot && hot !== r.id;
            const on = hot === r.id;
            return (
              <path
                key={r.id}
                d={curve(at(r.from), villa, r.bend)}
                fill="none"
                stroke={on ? 'var(--color-bronze-lit)' : 'var(--color-bronze)'}
                strokeWidth={on ? 3 : 1.7}
                strokeDasharray="8 8"
                strokeLinecap="round"
                opacity={dim ? 0.14 : on ? 1 : 0.5}
                style={{ transition: 'opacity .2s, stroke-width .2s' }}
              />
            );
          })}

          {PLACES.map((p) => {
            const x = px(p.lng);
            const y = py(p.lat);
            const isVilla = p.kind === 'villa';
            const dim = hot && !isVilla && p.id !== ROUTE_PATHS.find((r) => r.id === hot)?.from;
            const r = isVilla ? 9 : p.kind === 'near' ? 4 : 5.5;

            /* Around the bay, eight places sit inside ninety pixels of each
               other, so automatic placement piles the labels on top of one
               another. Those get an explicit offset and a leader line back to
               the dot — the standard fix, and it reads as deliberate. */
            const slot = LABEL_AT.get(p.id);
            const lx = slot ? slot.x : null;
            const ly = slot ? slot.y : null;
            const left = p.lead ? p.lead[0] < 0 : x > W * 0.72;

            const tx = p.lead ? lx : left ? x - r - 9 : x + r + 9;
            const ty = p.lead ? ly : y + 4.5;

            return (
              <g key={p.id} opacity={dim ? 0.28 : 1} style={{ transition: 'opacity .2s' }}>
                {isVilla && <circle cx={x} cy={y} r="34" fill="url(#glow)" />}

                {p.lead && (
                  <polyline
                    points={`${x + (left ? -r - 2 : r + 2)},${y} ${tx + (left ? 7 : -7)},${ty - 4} ${tx + (left ? 3 : -3)},${ty - 4}`}
                    fill="none"
                    stroke={KINDS[p.kind].fill}
                    strokeWidth="1"
                    opacity="0.5"
                  />
                )}

                <circle cx={x} cy={y} r={r} fill={KINDS[p.kind].fill}
                  stroke="var(--color-ink)" strokeWidth="2" />

                <text
                  x={tx}
                  y={ty}
                  textAnchor={left ? 'end' : 'start'}
                  fontSize={isVilla ? 21 : p.kind === 'near' ? 14 : 16}
                  fontWeight={isVilla ? 600 : 400}
                  fill={isVilla ? 'var(--color-text)' : 'var(--color-text-soft)'}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {p.name}
                  {p.note && (
                    <tspan fill="var(--color-text-mute)" fontSize="13">{`  ${p.note}`}</tspan>
                  )}
                </text>
              </g>
            );
          })}
        </svg>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 rounded-xs border border-(--color-line-lit) bg-(--color-ink)/85 px-4 py-2.5 text-[13px] uppercase tracking-[0.14em] text-(--color-text) backdrop-blur transition-colors hover:border-(--color-bronze) hover:text-(--color-bronze-lit)"
        >
          Open in Google Maps
        </a>
      </div>

      <figcaption className="mt-5 flex flex-col gap-4">
        {/* hovering a route lifts it on the map */}
        <div className="flex flex-wrap gap-2">
          {ROUTE_PATHS.map((r) => (
            <button
              key={r.id}
              type="button"
              onMouseEnter={() => setHot(r.id)}
              onMouseLeave={() => setHot(null)}
              onFocus={() => setHot(r.id)}
              onBlur={() => setHot(null)}
              className={`rounded-xs border px-3.5 py-2 text-[13px] transition-colors ${
                hot === r.id
                  ? 'border-(--color-bronze) text-(--color-bronze-lit)'
                  : 'border-(--color-line-lit) text-(--color-text-soft) hover:text-(--color-text)'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
          {Object.entries(KINDS).map(([key, k]) => (
            <span key={key} className="flex items-center gap-2.5">
              <span className="block h-2.5 w-2.5 rounded-full" style={{ background: k.fill }} />
              <span className="text-[13px] text-(--color-text-soft)">{k.label}</span>
            </span>
          ))}
          <span className="text-[13px] text-(--color-text-mute)">
            Positions are real; the coastline is drawn.
          </span>
        </div>
      </figcaption>
    </figure>
  );
}
