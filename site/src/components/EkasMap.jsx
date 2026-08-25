import { useEffect, useRef, useState } from 'react';
import { CONTACT } from '../data/villa.js';
import {
  ISLAND, island, COAST, ISLETS, CRATER_LAKE, PEAK, ROAD,
  BAY, bay, BAY_COAST,
} from '../data/lombok-geo.js';

/* ============================================================================
   Lombok, drawn from real geometry rather than by hand.

   The villa is in EAST Lombok — Jerowaru district, Kabupaten Lombok Timur.

   No Leaflet, no Mapbox, no tile server: a tiled map means an API key, a
   third-party request on every page load, and a rectangle of somebody else's
   grey fighting everything around it. This is an SVG in the site's own tokens,
   so it themes with the page and costs nothing to serve.

   WHAT CHANGED. This used to draw the island as a chain of bezier curves and
   the three arrival routes as arcs bowed by a hand-picked pixel count. It
   looked like a map and said nothing true. The coastline is now the real one
   from OpenStreetMap and the routes are the real roads from OSRM. See
   tools/geo/ for how it is generated and verified.

   TWO VIEWS, because one map cannot do both jobs. At island scale — the scale
   you need to understand a transfer from the airport — Ekas Bay is nine pixels
   wide and every surf break lands on the same dot. So the bay gets its own
   view at 15 m per pixel. Each has its own projection and its own project()
   function, so a marker cannot be plotted with the wrong one.
   ========================================================================= */

/* Positions audited against the real coastline. Three were wrong when it went
   in: the beach break was 1.5 km inland, Ekas village was 400 m out to sea,
   and Inside Ekas was on a hillside. Each is now either an OSM node or a point
   checked to be on the correct side of the water. */
const PLACES = [
  /* -- the villa, on both views -- */
  {
    id: 'villa', name: 'Villa 25 Ekas', kind: 'villa', views: ['island', 'bay'],
    lat: -8.901637, lng: 116.450203,
  },

  /* -- the bay -- */
  {
    id: 'beach', name: 'The beach break', kind: 'surf', views: ['bay'],
    /* the actual nearest sand to the villa: 295 m, the four-minute walk */
    lat: -8.90006, lng: 116.44804, note: '4 min walk',
  },
  {
    id: 'inside', name: 'Inside Ekas', kind: 'surf', views: ['bay'],
    lat: -8.91017, lng: 116.43612,
  },
  {
    id: 'outside', name: 'Outside Ekas', kind: 'surf', views: ['bay'],
    lat: -8.9380, lng: 116.4150, note: 'by boat',
  },
  {
    id: 'kura', name: 'Kura Kura', kind: 'surf', views: ['bay'],
    lat: -8.9270, lng: 116.4760, note: 'by boat',
  },
  {
    id: 'village', name: 'Ekas village', kind: 'near', views: ['bay'],
    /* OSM has this as Kwangrundun. 1.23 km, which is the 1.1 km the
       property's own listing quotes. */
    lat: -8.90034, lng: 116.46135, note: '1.2 km',
  },
  {
    id: 'kalian', name: 'Pantai Kaliantan', kind: 'near', views: ['bay'],
    /* OSM's node sits 612 m inland, so this is snapped to the sand. 4.7 km,
       against the 5 km in the listing. */
    lat: -8.89787, lng: 116.49285, note: '4.7 km',
  },

  /* -- the island -- */
  {
    id: 'airport', name: 'Lombok Intl', kind: 'gate', views: ['island'],
    lat: -8.7573, lng: 116.2767, note: `${ROAD.fly.km} km`,
  },
  {
    id: 'lembar', name: 'Lembar ferry', kind: 'gate', views: ['island'],
    lat: -8.7269, lng: 116.0722, note: `${ROAD.slow.km} km`,
  },
  {
    id: 'senggigi', name: 'Senggigi', kind: 'gate', views: ['island'],
    lat: -8.4936, lng: 116.0424, note: `${ROAD.fast.km} km`,
  },
  { id: 'kuta', name: 'Kuta', kind: 'trip', views: ['island'], lat: -8.8947, lng: 116.2803 },
  { id: 'selong', name: 'Selong Belanak', kind: 'trip', views: ['island'], lat: -8.8756, lng: 116.1408 },
  { id: 'pink', name: 'Pink Beach', kind: 'trip', views: ['island'], lat: -8.8447, lng: 116.5928 },
  { id: 'luar', name: 'Tanjung Luar', kind: 'trip', views: ['island'], lat: -8.7550, lng: 116.5470 },
  { id: 'mataram', name: 'Mataram', kind: 'trip', views: ['island'], lat: -8.5833, lng: 116.1167 },
];

const KINDS = {
  villa: { label: 'The villa', fill: 'var(--color-bronze-lit)' },
  surf: { label: 'Surf', fill: 'var(--color-reef)' },
  near: { label: 'Nearby', fill: 'var(--color-text-mute)' },
  trip: { label: 'Towns and day trips', fill: 'var(--color-text-soft)' },
  gate: { label: 'Ways in', fill: 'var(--color-bronze)' },
};

/* OSRM's durations assume free-flowing traffic and legal speed limits, and the
   roads into the south-east deliver neither — so the times shown are the ones
   the owners quote, with OSRM's distance beside them as the hard number. */
const ROUTES = [
  { id: 'fly', from: 'airport', label: 'Fly', time: '1–1.5 hrs', road: ROAD.fly },
  { id: 'slow', from: 'lembar', label: 'Slow boat', time: 'about 2 hrs', road: ROAD.slow },
  { id: 'fast', from: 'senggigi', label: 'Fast boat', time: '1 hr 20', road: ROAD.fast },
];

const VIEWS = {
  island: {
    label: 'The island',
    box: ISLAND,
    project: island,
    blurb: 'Where Ekas is, and the road in from each of the three ways you can arrive.',
  },
  bay: {
    label: 'Ekas Bay',
    box: BAY,
    project: bay,
    blurb: 'The bay itself. The breaks, the village, and the walk to the sand.',
  },
};

/* ----------------------------------------------------------------------------
   Label de-collision.

   In the bay view several places sit within a few pixels of each other, so
   labels land on top of one another. Hand-tuning offsets is whack-a-mole — move
   one and another collides. Instead: put each label on the side its dot faces,
   sort each column by height, and push each one down until it clears the one
   above. Deterministic, and it stays correct when a coordinate is corrected.
   ------------------------------------------------------------------------- */
const GAP = 30;

function layout(view) {
  const { project, box } = VIEWS[view];
  const out = new Map();

  for (const side of ['left', 'right']) {
    const group = PLACES
      .filter((p) => p.views.includes(view))
      .map((p) => ({ p, ...project(p.lat, p.lng) }))
      .filter((it) => (it.x < box.w * 0.5) === (side === 'left'))
      .sort((a, b) => a.y - b.y);

    let lastY = -Infinity;
    for (const it of group) {
      const y = Math.max(it.y, lastY + GAP);
      lastY = y;
      out.set(it.p.id, {
        side,
        x: side === 'left' ? it.x - 14 : it.x + 14,
        y: y + 5,
        dot: { x: it.x, y: it.y },
      });
    }
  }
  return out;
}

const LABELS = { island: layout('island'), bay: layout('bay') };

/** A scale bar that means something: pick the roundest distance that lands
    between 120 and 240 px at this view's resolution. */
function scaleBar(box) {
  const options = [1, 2, 5, 10, 20, 50, 100];
  const km = options.find((k) => {
    const w = (k * 1000) / box.mPerPx;
    return w >= 120 && w <= 240;
  }) ?? 10;
  return { km, w: (km * 1000) / box.mPerPx };
}

export default function EkasMap({ className = '' }) {
  const [view, setView] = useState('island');
  const [hot, setHot] = useState(null);

  /* The label layout is computed in viewBox units, but whether those units are
     big enough to read depends entirely on how wide the map ends up on screen.
     On a 375 px phone the whole island renders 333 px across, every label
     overlaps its neighbours and half of them hang off the edge.

     So below 640 px the map stops trying to label itself and numbers the dots
     instead, with a key underneath. That is what a printed map does when it
     runs out of room, and it beats a pile of unreadable text. */
  const wrap = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    /* Measured on mount and on resize rather than with a ResizeObserver.
       The observer is the tidier tool, but it does not fire in every embedded
       browser — including the one this was tested in — and a map that silently
       never switches modes is worse than one that misses a container-only
       resize. This element is full-width in the content column, so a window
       resize is the only thing that actually changes it. */
    const measure = () => setWidth(wrap.current?.clientWidth ?? 0);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const compact = width > 0 && width < 640;

  const V = VIEWS[view];
  const box = V.box;
  const labels = LABELS[view];
  const bar = scaleBar(box);
  const villa = V.project(-8.901637, 116.450203);
  const peak = island(PEAK.lat, PEAK.lng);

  const mapsUrl =
    `https://www.google.com/maps/search/?api=1&query=${CONTACT.coords.lat},${CONTACT.coords.lng}`;

  return (
    <figure className={`m-0 ${className}`}>
      {/* view switch */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-px border border-(--color-line-lit) bg-(--color-line)">
          {Object.entries(VIEWS).map(([key, v]) => (
            <button
              key={key}
              type="button"
              onClick={() => { setView(key); setHot(null); }}
              aria-pressed={view === key}
              className={`px-5 py-2.5 text-[13px] uppercase tracking-[0.14em] transition-colors ${
                view === key
                  ? 'bg-(--color-bronze) text-(--color-ink)'
                  : 'bg-(--color-ink) text-(--color-text-soft) hover:text-(--color-text)'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <p className="text-[15px] text-(--color-text-soft)">{V.blurb}</p>
      </div>

      <div ref={wrap} className="relative overflow-hidden border border-(--color-line) bg-(--color-ink)">
        <svg
          viewBox={`0 0 ${box.w} ${box.h}`}
          className="block h-auto w-full"
          role="img"
          aria-label={
            view === 'island'
              ? 'Map of Lombok showing Villa 25 Ekas in East Lombok and the roads in from the airport, Lembar ferry and Senggigi'
              : 'Map of Ekas Bay showing Villa 25 Ekas, the surf breaks, the village and the beach'
          }
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

          <rect width={box.w} height={box.h} fill="var(--color-ink)" />
          <rect width={box.w} height={box.h} fill="url(#swell)" />

          {view === 'island' ? (
            <>
              <path d={COAST} fill="url(#land)" stroke="var(--color-bronze)" strokeWidth="1.4" />
              {ISLETS.map((d) => (
                <path key={d.slice(0, 24)} d={d} fill="url(#land)"
                  stroke="var(--color-bronze)" strokeWidth="1" />
              ))}
              {CRATER_LAKE && (
                <path d={CRATER_LAKE} fill="var(--color-ink)"
                  stroke="var(--color-reef)" strokeWidth="1" opacity="0.8" />
              )}

              {/* Rinjani. Everyone who has heard of Lombok has heard of it, and
                  it orients the reader instantly: volcano north, villa in the
                  far south-east corner, and the drive is the gap between. */}
              <g opacity="0.85">
                <path
                  d={`M${peak.x - 11} ${peak.y + 8} L${peak.x} ${peak.y - 9} L${peak.x + 11} ${peak.y + 8} Z`}
                  fill="none" stroke="var(--color-text-mute)" strokeWidth="1.3"
                />
              </g>

              {/* the three roads in — real geometry, not decoration */}
              {ROUTES.map((r) => {
                const dim = hot && hot !== r.id;
                const on = hot === r.id;
                return (
                  <path
                    key={r.id}
                    d={r.road.d}
                    fill="none"
                    stroke={on ? 'var(--color-bronze-lit)' : 'var(--color-bronze)'}
                    strokeWidth={on ? 3.4 : 1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={dim ? 0.12 : on ? 1 : 0.55}
                    style={{ transition: 'opacity .2s, stroke-width .2s' }}
                  />
                );
              })}
            </>
          ) : (
            /* The bay view crops the island, so the coastline runs off every
               edge. Stroked open paths rather than a filled ring — a fill would
               have to close across open water and cut a false straight edge. */
            BAY_COAST.map((d) => (
              <path key={d.slice(0, 24)} d={d} fill="none"
                stroke="var(--color-bronze)" strokeWidth="1.6" strokeLinejoin="round" />
            ))
          )}

          {/* Leader lines only. Everything with text in it lives in the HTML
              overlay below — see the note there. */}
          {!compact && PLACES.filter((p) => p.views.includes(view)).map((p) => {
            const { x, y } = V.project(p.lat, p.lng);
            const slot = labels.get(p.id);
            if (!slot || Math.abs(slot.y - 5 - y) < 4) return null;
            const dim = hot && p.kind !== 'villa'
              && p.id !== ROUTES.find((r) => r.id === hot)?.from;
            return (
              <polyline
                key={p.id}
                points={`${x},${y} ${slot.x + (slot.side === 'left' ? 6 : -6)},${slot.y - 5}`}
                fill="none"
                stroke={KINDS[p.kind].fill}
                strokeWidth="1"
                opacity={dim ? 0.1 : 0.45}
                style={{ transition: 'opacity .2s' }}
              />
            );
          })}

          {/* the villa's glow sits under its dot, and is decorative, so it can
              stay in the SVG and scale with the drawing */}
          <circle cx={villa.x} cy={villa.y} r="32" fill="url(#glow)" />

          {/* scale bar rule — the map claims to be accurate, so it carries one.
              The number that goes with it is in the overlay. */}
          <g transform={`translate(${box.pad + 6}, ${box.h - box.pad - 6})`}>
            <line x1="0" y1="0" x2={bar.w} y2="0"
              stroke="var(--color-text-soft)" strokeWidth="1.6" />
            <line x1="0" y1="-5" x2="0" y2="5" stroke="var(--color-text-soft)" strokeWidth="1.6" />
            <line x1={bar.w} y1="-5" x2={bar.w} y2="5"
              stroke="var(--color-text-soft)" strokeWidth="1.6" />
          </g>
        </svg>

        {/* ------------------------------------------------------------------
            Labels and dots as HTML, laid over the drawing.

            They used to be SVG <text>, which scales with the viewBox: at 1000
            units wide rendered into a 333 px phone, a 15 px label came out at
            5 px and the dots were under two pixels across. Everything else on
            this site has a 13 px floor and the map was quietly breaking it.

            As HTML they are sized in CSS, so they stay legible at every width,
            pick up the site's own type, and can be read by a screen reader in
            document order. Positions are percentages of the same box the SVG
            uses, so the two cannot drift apart.
            ------------------------------------------------------------------ */}
        <div className="pointer-events-none absolute inset-0">
          {PLACES.filter((p) => p.views.includes(view)).map((p, i) => {
            const { x, y } = V.project(p.lat, p.lng);
            const slot = labels.get(p.id);
            const left = slot?.side === 'left';
            const isVilla = p.kind === 'villa';
            const dim = hot && !isVilla
              && p.id !== ROUTES.find((r) => r.id === hot)?.from;
            const size = isVilla ? 15 : p.kind === 'near' ? 9 : 11;

            return (
              /* inset-0 matters: the children position themselves with
                 percentages, and a bare `absolute` wrapper shrinks to fit its
                 content, so those percentages would resolve against a box of
                 almost no width and stack every marker at the origin. */
              <div
                key={p.id}
                className="absolute inset-0 transition-opacity duration-200"
                style={{ opacity: dim ? 0.25 : 1 }}
              >
                {/* the dot — replaced by the numbered badge in compact mode */}
                {!compact && (
                  <span
                    className="absolute rounded-full ring-2 ring-(--color-ink)"
                    style={{
                      left: `${(x / box.w) * 100}%`,
                      top: `${(y / box.h) * 100}%`,
                      width: size,
                      height: size,
                      background: KINDS[p.kind].fill,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )}
                {/* Wide: the name beside the dot. Narrow: its number in the
                    key, centred on the dot. */}
                {compact ? (
                  <span
                    className="absolute grid place-items-center rounded-full text-[11px] font-semibold text-(--color-ink)"
                    style={{
                      left: `${(x / box.w) * 100}%`,
                      top: `${(y / box.h) * 100}%`,
                      width: 17,
                      height: 17,
                      background: KINDS[p.kind].fill,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {i + 1}
                  </span>
                ) : (
                  <span
                    className={`absolute whitespace-nowrap ${
                      isVilla
                        ? 'text-[15px] font-semibold text-(--color-text) sm:text-base'
                        : 'text-[13px] text-(--color-text-soft)'
                    }`}
                    style={{
                      left: `${((slot ? slot.x : x + 12) / box.w) * 100}%`,
                      top: `${((slot ? slot.y - 5 : y) / box.h) * 100}%`,
                      transform: `translate(${left ? '-100%' : '0'}, -50%)`,
                      textShadow: '0 1px 3px var(--color-ink), 0 0 8px var(--color-ink)',
                    }}
                  >
                    {p.name}
                    {p.note && (
                      <span className="ml-1.5 text-[13px] text-(--color-text-mute)">{p.note}</span>
                    )}
                  </span>
                )}
              </div>
            );
          })}

          {/* Rinjani, on the island view only, and only when there is room */}
          {view === 'island' && !compact && (
            <span
              className="absolute whitespace-nowrap text-[13px] text-(--color-text-mute)"
              style={{
                left: `${(peak.x / box.w) * 100}%`,
                top: `${((peak.y + 26) / box.h) * 100}%`,
                transform: 'translate(-50%, -50%)',
                textShadow: '0 1px 3px var(--color-ink)',
              }}
            >
              {PEAK.name}
              <span className="ml-1.5">{PEAK.ele.toLocaleString()} m</span>
            </span>
          )}

          <span
            className="absolute text-[13px] whitespace-nowrap text-(--color-text-soft)"
            style={{
              left: `${((box.pad + 6 + bar.w / 2) / box.w) * 100}%`,
              top: `${((box.h - box.pad - 20) / box.h) * 100}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {bar.km} km
          </span>
        </div>

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
        {/* The key for the numbered dots. Only when the map is too narrow to
            label itself — above that the names are already on the drawing. */}
        {compact && (
          <ol className="grid grid-cols-1 gap-x-6 gap-y-2 min-[430px]:grid-cols-2">
            {PLACES.filter((p) => p.views.includes(view)).map((p, i) => (
              <li key={p.id} className="flex items-baseline gap-2.5">
                <span
                  className="grid h-[17px] w-[17px] shrink-0 place-items-center rounded-full text-[11px] font-semibold text-(--color-ink)"
                  style={{ background: KINDS[p.kind].fill }}
                >
                  {i + 1}
                </span>
                <span className="text-[13px] text-(--color-text-soft)">
                  {p.name}
                  {p.note && (
                    <span className="ml-1.5 text-(--color-text-mute)">{p.note}</span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        )}

        {view === 'island' && (
          <div className="flex flex-wrap gap-2">
            {ROUTES.map((r) => (
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
                <span className="ml-2 text-(--color-text-mute)">
                  {r.road.km} km · {r.time}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
          {Object.entries(KINDS)
            .filter(([key]) => PLACES.some((p) => p.kind === key && p.views.includes(view)))
            .map(([key, k]) => (
              <span key={key} className="flex items-center gap-2.5">
                <span className="block h-2.5 w-2.5 rounded-full" style={{ background: k.fill }} />
                <span className="text-[13px] text-(--color-text-soft)">{k.label}</span>
              </span>
            ))}
        </div>

        <p className="text-[13px] text-(--color-text-mute)">
          Coastline and places from{' '}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-(--color-bronze-lit)">
            OpenStreetMap
          </a>
          {' '}contributors. Roads and distances from{' '}
          <a href="https://project-osrm.org/" target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-(--color-bronze-lit)">
            OSRM
          </a>
          . Break positions are approximate — everything else is surveyed.
        </p>
      </figcaption>
    </figure>
  );
}
