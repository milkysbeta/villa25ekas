import { useEffect, useState } from 'react';
import { getForecast, compass } from '../lib/forecast.js';
import { CONTACT } from '../data/villa.js';
import WeatherIcon, { DirArrow } from './WeatherIcon.jsx';

/* ============================================================================
   Five-day forecast

   Layout follows the widget builder exactly — a centred vertical stack per day,
   hairline dividers between columns, today highlighted, and the same row order:

     day · date · rating · rule · swell + direction · period · icon · temp · wind

   The gold-on-black treatment from the builder is replaced with the site's own
   tokens, so it stays in step when the colour board lands.

   LAYOUT STABILITY. The data is fetched, so it arrives after the page has
   painted. If the loading state were any other shape, the page would grow when
   the forecast landed — and on the holding page, where the photograph is sized
   to its container, that makes the whole background visibly jump and rescale.

   So the loading state is not an approximation of the real thing. It IS the
   real thing: the same component, with empty values, made invisible. Identical
   height by construction rather than by matching numbers up by hand. The word
   "Loading weather" is then laid over the top, positioned absolutely so it
   cannot affect the height either.
   ========================================================================= */

/* Five stars, filled proportionally by a clipped overlay — the same trick the
   builder uses, which is what lets a 3.5 render as three and a half. */
function Stars({ value }) {
  return (
    <span
      className="relative inline-block whitespace-nowrap text-[13px] leading-none tracking-[0.14em] text-(--color-bronze)/25"
      role="img"
      aria-label={`${value} out of 5`}
    >
      ★★★★★
      <span
        className="absolute left-0 top-0 overflow-hidden whitespace-nowrap text-(--color-bronze-lit)"
        style={{ width: `${(value / 5) * 100}%` }}
        aria-hidden="true"
      >
        ★★★★★
      </span>
    </span>
  );
}

const Rule = () => (
  <span
    aria-hidden="true"
    className="my-0.5 h-px w-[26px]"
    style={{
      background: 'linear-gradient(90deg, transparent, var(--color-bronze), transparent)',
      opacity: 0.55,
    }}
  />
);

const Label = ({ children }) => (
  <span className="-mb-1 text-[13px] uppercase leading-none tracking-[0.24em] text-(--color-text-mute)">
    {children}
  </span>
);

function DayCard({ d, index }) {
  const day = new Date(d.date + 'T00:00:00');
  const today = index === 0;

  return (
    <div
      className={`relative flex min-w-0 flex-col items-center gap-1.5 px-1 py-3 text-center ${
        today ? 'rounded-lg' : ''
      }`}
      style={
        today
          ? {
              background:
                'linear-gradient(180deg, color-mix(in srgb, var(--color-bronze) 10%, transparent), transparent 70%)',
            }
          : undefined
      }
    >
      {/* hairline between days, fading out top and bottom */}
      {index > 0 && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-[8%] bottom-[8%] w-px"
          style={{
            background:
              'linear-gradient(180deg, transparent, color-mix(in srgb, var(--color-bronze) 30%, transparent), transparent)',
          }}
        />
      )}

      <span className="font-(family-name:--font-display) text-[13px] font-medium uppercase leading-none tracking-[0.16em] text-(--color-bronze-lit)">
        {today ? 'Today' : day.toLocaleDateString('en-NZ', { weekday: 'short' })}
      </span>

      <span className="-mt-0.5 text-[13px] uppercase tracking-[0.16em] text-(--color-text-mute)">
        {day.getDate()} {day.toLocaleDateString('en-NZ', { month: 'short' })}
      </span>

      <Stars value={d.rating} />

      <Rule />

      <Label>Swell</Label>
      <span className="font-(family-name:--font-display) text-[26px] font-medium leading-[1.1] tabular-nums text-(--color-text)">
        {d.swellM != null ? d.swellM.toFixed(1) : '–'}
        <span className="ml-px text-[13px] opacity-80">m</span>
      </span>
      <span className="mt-px flex items-center justify-center gap-1 leading-none">
        <DirArrow
          deg={d.swellDir != null ? (d.swellDir + 180) % 360 : null}
          className="h-2.5 w-2.5 text-(--color-bronze-lit)"
        />
        <span className="text-[13px] tracking-[0.14em] text-(--color-text-soft)">
          {compass(d.swellDir) || '–'}
        </span>
      </span>

      <Label>Period</Label>
      <span className="text-[13px] tracking-[0.06em] tabular-nums text-(--color-text-soft)">
        {d.periodS != null ? `${Math.round(d.periodS)}s` : '–'}
      </span>

      <WeatherIcon code={d.code} className="my-0.5 h-12 w-12 text-(--color-bronze-lit)" />

      <span className="font-(family-name:--font-display) text-[19px] font-medium leading-none tabular-nums text-(--color-text)">
        {d.tempMax != null ? `${Math.round(d.tempMax)}°` : '–'}
      </span>
      <span className="-mt-1 text-[13px] tracking-[0.06em] text-(--color-text-mute)">
        {d.tempMin != null ? `${Math.round(d.tempMin)}° low` : '–'}
      </span>

      <Label>Wind</Label>
      <span className="text-[13px] tracking-[0.06em] tabular-nums text-(--color-text-soft)">
        {d.windKmh != null ? `${Math.round(d.windKmh)} ${compass(d.windDir)}` : '–'}
      </span>
    </div>
  );
}

const Credit = () => (
  <p
    className="mt-3.5 pt-2.5 text-right text-[13px] uppercase tracking-[0.18em] text-(--color-text-mute)"
    style={{
      borderTop: '1px solid transparent',
      borderImage:
        'linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-bronze) 32%, transparent), transparent) 1',
    }}
  >
    Forecast{' '}
    <a
      href="https://open-meteo.com"
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-4 hover:text-(--color-bronze-lit)"
    >
      Open-Meteo
    </a>
  </p>
);

/** Empty days, dated from today, so the hidden copy is the right width too. */
function blankDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const dt = new Date();
    dt.setDate(dt.getDate() + i);
    return {
      date: dt.toISOString().slice(0, 10),
      swellM: null, periodS: null, swellDir: null,
      windKmh: null, windDir: null,
      tempMax: null, tempMin: null, code: null, rating: 0,
    };
  });
}

export default function SurfForecast({ days = 5 }) {
  const [state, setState] = useState({ status: 'loading', data: null });

  useEffect(() => {
    let alive = true;
    getForecast({ lat: CONTACT.coords.lat, lng: CONTACT.coords.lng, days })
      .then((data) => alive && setState({ status: 'ok', data }))
      .catch(() => alive && setState({ status: 'error', data: null }));
    return () => { alive = false; };
  }, [days]);

  const ready = state.status === 'ok';
  const rows = ready ? state.data : blankDays(days);

  return (
    <div className="relative">
      {/* `invisible` is visibility:hidden, which still occupies its space —
          unlike `hidden`, which would collapse it and reintroduce the jump. */}
      <div className={ready ? undefined : 'invisible'} aria-hidden={!ready}>
        <div className="grid grid-cols-5">
          {rows.map((d, i) => (
            <DayCard key={d.date} d={d} index={i} />
          ))}
        </div>
        <Credit />
      </div>

      {!ready && (
        <p
          className="absolute inset-0 flex items-center justify-center text-[13px] uppercase tracking-[0.24em] text-(--color-text-mute)"
          role="status"
        >
          {state.status === 'error' ? 'Forecast unavailable just now' : 'Loading weather'}
        </p>
      )}
    </div>
  );
}
