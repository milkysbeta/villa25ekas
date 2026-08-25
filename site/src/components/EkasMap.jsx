import { useState } from 'react';
import { CONTACT } from '../data/villa.js';

/* ============================================================================
   Southern Lombok, drawn rather than tiled.

   No Leaflet, no Mapbox, no tile server: a tiled map means an API key, a
   third-party request on every page load, and a rectangle of somebody else's
   grey that fights everything around it. This is an SVG in the site's own
   tokens, so it themes with the rest of the page and costs one HTTP request of
   nothing.

   The MARKERS are placed from real latitude and longitude, projected into the
   viewBox — so the relative positions and distances are honest. The COASTLINE
   is a simplified hand-drawn shape, clearly illustrative rather than survey
   grade. That is the right split: a guest needs to know Kuta is an hour west
   and the break is at the bottom of the garden, not the exact shape of a
   headland.
   ========================================================================= */

/* Bounding box for southern Lombok. */
const BOUNDS = { north: -8.42, south: -8.98, west: 115.98, east: 116.66 };
const W = 1000;
const H = 620;

const px = (lng) => ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * W;
const py = (lat) => ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * H;

const PLACES = [
  { id: 'villa',    name: 'Villa 25 Ekas', lat: -8.9016, lng: 116.4502, kind: 'villa' },
  { id: 'inside',   name: 'Inside Ekas',   lat: -8.9105, lng: 116.4380, kind: 'surf' },
  { id: 'outside',  name: 'Outside Ekas',  lat: -8.9330, lng: 116.4180, kind: 'surf' },
  { id: 'beach',    name: 'Beach break',   lat: -8.8930, lng: 116.4610, kind: 'surf' },
  { id: 'kura',     name: 'Kura Kura',     lat: -8.9240, lng: 116.4720, kind: 'surf' },
  { id: 'pink',     name: 'Pink Beach',    lat: -8.8447, lng: 116.5928, kind: 'trip' },
  { id: 'kuta',     name: 'Kuta',          lat: -8.8947, lng: 116.2803, kind: 'trip', note: '1 hr' },
  { id: 'selong',   name: 'Selong Belanak',lat: -8.8756, lng: 116.1408, kind: 'trip', note: '1.5 hrs' },
  { id: 'airport',  name: 'Lombok Intl',   lat: -8.7573, lng: 116.2767, kind: 'gate', note: '1–1.5 hrs' },
  { id: 'lembar',   name: 'Lembar ferry',  lat: -8.7269, lng: 116.0722, kind: 'gate', note: '~2 hrs' },
  { id: 'senggigi', name: 'Senggigi',      lat: -8.4936, lng: 116.0424, kind: 'gate', note: '1 hr 20' },
];

const KINDS = {
  villa: { label: 'The villa',  fill: 'var(--color-bronze-lit)' },
  surf:  { label: 'Surf',       fill: 'var(--color-reef)' },
  trip:  { label: 'Day trips',  fill: 'var(--color-text-soft)' },
  gate:  { label: 'Arriving',   fill: 'var(--color-bronze)' },
};

/* Simplified southern Lombok. Traced loosely so the south coast, the Ekas
   peninsula and its bay read correctly; not accurate enough to navigate by,
   which is the point of drawing it rather than tiling it. */
const COAST =
  'M 40 90 C 120 40, 250 30, 360 60 C 450 84, 520 70, 600 96 '
  + 'C 690 126, 760 118, 830 150 C 900 182, 940 240, 928 300 '
  + 'C 918 352, 872 372, 846 410 C 820 448, 836 486, 800 512 '
  + 'C 762 540, 716 512, 690 470 C 668 434, 640 420, 606 436 '
  + 'C 566 456, 540 500, 496 512 C 446 526, 400 498, 356 476 '
  + 'C 300 448, 250 452, 196 436 C 132 416, 74 382, 48 320 '
  + 'C 22 258, 8 150, 40 90 Z';

/* Ekas bay — the notch the villa sits above. */
const BAY =
  'M 700 462 C 726 440, 758 442, 782 462 C 800 478, 792 502, 768 508 '
  + 'C 740 514, 712 496, 700 476 Z';

export default function EkasMap({ className = '' }) {
  const [active, setActive] = useState(null);

  const mapsUrl =
    `https://www.google.com/maps/search/?api=1&query=${CONTACT.coords.lat},${CONTACT.coords.lng}`;

  return (
    <figure className={`m-0 ${className}`}>
      <div className="relative overflow-hidden border border-(--color-line) bg-(--color-ink)">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full"
          role="img"
          aria-label="Illustrated map of southern Lombok showing Villa 25 Ekas, the surf breaks, day trips and the ways in"
        >
          <defs>
            {/* faint contour texture for the sea */}
            <pattern id="swell" width="26" height="26" patternUnits="userSpaceOnUse">
              <path
                d="M0 20 Q 6.5 14, 13 20 T 26 20"
                fill="none"
                stroke="var(--color-reef)"
                strokeWidth="0.9"
                opacity="0.16"
              />
            </pattern>
            <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-raise)" />
              <stop offset="100%" stopColor="var(--color-shell)" />
            </linearGradient>
          </defs>

          <rect width={W} height={H} fill="var(--color-ink)" />
          <rect width={W} height={H} fill="url(#swell)" />

          <path d={COAST} fill="url(#land)" stroke="var(--color-bronze)" strokeWidth="1.4" opacity="0.95" />
          <path d={BAY} fill="var(--color-ink)" stroke="var(--color-reef)" strokeWidth="1.2" opacity="0.9" />

          {/* the road down from the airport — the journey most guests make */}
          <path
            d={`M ${px(116.2767)} ${py(-8.7573)} C ${px(116.34)} ${py(-8.80)}, ${px(116.40)} ${py(-8.84)}, ${px(116.4502)} ${py(-8.9016)}`}
            fill="none"
            stroke="var(--color-bronze)"
            strokeWidth="1.6"
            strokeDasharray="7 7"
            opacity="0.55"
          />

          {PLACES.map((p) => {
            const x = px(p.lng);
            const y = py(p.lat);
            const isVilla = p.kind === 'villa';
            const on = active === p.id;
            const r = isVilla ? 9 : 5;
            /* Labels flip to the left near the right edge so they never run off. */
            const flip = x > W * 0.74;

            return (
              <g
                key={p.id}
                onMouseEnter={() => setActive(p.id)}
                onMouseLeave={() => setActive(null)}
                style={{ cursor: 'default' }}
              >
                {isVilla && (
                  <circle cx={x} cy={y} r="20" fill="var(--color-bronze-lit)" opacity="0.14" />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill={KINDS[p.kind].fill}
                  stroke="var(--color-ink)"
                  strokeWidth="2"
                />
                <text
                  x={flip ? x - r - 9 : x + r + 9}
                  y={y + 4.5}
                  textAnchor={flip ? 'end' : 'start'}
                  fontSize={isVilla ? 20 : 16}
                  fontWeight={isVilla ? 600 : 400}
                  fill={isVilla || on ? 'var(--color-text)' : 'var(--color-text-soft)'}
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
          className="label absolute bottom-4 right-4 rounded-xs border border-(--color-line-lit) bg-(--color-ink)/85 px-4 py-2.5 text-(--color-text) backdrop-blur transition-colors hover:border-(--color-bronze) hover:text-(--color-bronze-lit)"
        >
          Open in Google Maps
        </a>
      </div>

      <figcaption className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-2">
        {Object.entries(KINDS).map(([key, k]) => (
          <span key={key} className="flex items-center gap-2.5">
            <span className="block h-2.5 w-2.5 rounded-full" style={{ background: k.fill }} />
            <span className="text-[13px] text-(--color-text-soft)">{k.label}</span>
          </span>
        ))}
        <span className="text-[13px] text-(--color-text-mute)">
          Positions are real; the coastline is drawn.
        </span>
      </figcaption>
    </figure>
  );
}
