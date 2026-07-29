/* ============================================================================
   Weather icons — ported verbatim from the widget builder in
   "Weather Widget/surf-widget-editor.html".

   Same geometry, same 1.3 stroke weight, same WMO code mapping. Drawn rather
   than pulled from an icon set so they share a line weight with everything
   else on the page.
   ========================================================================= */

const WMO = {
  0: 'clear', 1: 'mostly', 2: 'partly', 3: 'cloud', 45: 'fog', 48: 'fog',
  51: 'drizzle', 53: 'drizzle', 55: 'drizzle', 56: 'drizzle', 57: 'drizzle',
  61: 'rain', 63: 'rain', 65: 'rain', 66: 'rain', 67: 'rain',
  71: 'snow', 73: 'snow', 75: 'snow', 77: 'snow', 85: 'snow', 86: 'snow',
  80: 'showers', 81: 'showers', 82: 'rain', 95: 'storm', 96: 'storm', 99: 'storm',
};

const CLOUD_D =
  'M7.2 17.4h9.4a3.1 3.1 0 0 0 .2-6.2 4.5 4.5 0 0 0-8.6-1.1 3.2 3.2 0 0 0-1 7.3z';

const Cloud = ({ raised = false }) =>
  raised ? (
    <g transform="translate(0,-2.6)"><path d={CLOUD_D} /></g>
  ) : (
    <path d={CLOUD_D} />
  );

/* Sun with eight rays, built the same way the widget builds it. */
function Sun({ cx, cy, r }) {
  const L = r + 1.6;
  const M = r + 3.4;
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return `M${(cx + Math.cos(a) * L).toFixed(1)} ${(cy + Math.sin(a) * L).toFixed(1)}L${(cx + Math.cos(a) * M).toFixed(1)} ${(cy + Math.sin(a) * M).toFixed(1)}`;
  }).join('');
  return (
    <>
      <circle cx={cx} cy={cy} r={r} />
      <path d={rays} />
    </>
  );
}

const SHAPES = {
  clear:   <Sun cx={12} cy={12} r={4} />,
  mostly:  <><Sun cx={9.5} cy={9.5} r={3.1} /><Cloud /></>,
  partly:  <><Sun cx={8.5} cy={8} r={2.8} /><Cloud /></>,
  cloud:   <Cloud />,
  fog:     <><Cloud raised /><path d="M5.5 17h13M7.5 20h9" /></>,
  drizzle: <><Cloud raised /><path d="M9 17.2v1.6M12 17.6v1.9M15 17.2v1.6" /></>,
  rain:    <><Cloud raised /><path d="M8.6 16.8L7.6 20M12 16.8L11 20M15.4 16.8L14.4 20" /></>,
  showers: <><Cloud raised /><path d="M9 16.8L7.4 20.4M14.4 16.8L12.8 20.4" /><Sun cx={17.6} cy={6.4} r={2.1} /></>,
  snow:    <><Cloud raised /><path d="M9 18.6h.01M12 20h.01M15 18.6h.01M9 20.4h.01M15 20.4h.01" /></>,
  storm:   <><Cloud raised /><path d="M13 15.6l-3 3.6h2.6l-1.4 3.2" /></>,
};

export default function WeatherIcon({ code, className = '' }) {
  const shape = SHAPES[WMO[code] ?? 'cloud'];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {shape}
    </svg>
  );
}

/* Swell direction arrow. The widget rotates a single glyph; same here. */
export function DirArrow({ deg, className = '' }) {
  if (deg == null) return null;
  return (
    <span
      className={`block shrink-0 ${className}`}
      style={{ transform: `rotate(${deg}deg)` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
           strokeLinecap="round" strokeLinejoin="round" className="block h-full w-full">
        <path d="M12 4v16M12 20l-4.5-5M12 20l4.5-5" />
      </svg>
    </span>
  );
}
