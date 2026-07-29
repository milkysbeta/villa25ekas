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
   ========================================================================= */

/* Five stars, filled proportionally by a clipped overlay — the same trick the
   builder uses, which is what lets a 3.5 render as three and a half. */
function Stars({ value }) {
  const pct = (value / 5) * 100;
  return (
    <span
      className="relative inline-block whitespace-nowrap text-[13px] leading-none tracking-[0.14em] text-(--color-bronze)/25"
      title={`${value} out of 5`}
      role="img"
      aria-label={`${value} out of 5`}
    >
      ★★★★★
      <span
        className="absolute left-0 top-0 overflow-hidden whitespace-nowrap text-(--color-bronze-lit)"
        style={{ width: `${pct}%` }}
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
      background:
        'linear-gradient(90deg, transparent, var(--color-bronze), transparent)',
      opacity: 0.55,
    }}
  />
);

const Label = ({ children }) => (
  <span className="-mb-1 text-[9px] uppercase leading-none tracking-[0.24em] text-(--color-text-mute)">
    {children}
  </span>
);

export default function SurfForecast({ days = 5 }) {
  const [state, setState] = useState({ status: 'loading', data: null });

  useEffect(() => {
    let alive = true;
    getForecast({ lat: CONTACT.coords.lat, lng: CONTACT.coords.lng, days })
      .then((data) => alive && setState({ status: 'ok', data }))
      .catch(() => alive && setState({ status: 'error', data: null }));
    return () => { alive = false; };
  }, [days]);

  /* The forecast is fetched, so it arrives after first paint. Without
     something holding its place the page grows when it lands — and on the
     holding page, where the photograph is sized to the container, that makes
     the whole background visibly jump and rescale.

     So the skeleton is not decoration: it is the same grid, the same number of
     rows, at the same sizes, so the space is already the right shape before
     any data exists. Nothing moves when the real thing replaces it. */
  if (state.status !== 'ok') {
    const failed = state.status === 'error';
    return (
      <div>
        <div className="grid grid-cols-5" aria-hidden={!failed}>
          {Array.from({ length: days }).map((_, i) => (
            <div
              key={i}
              className={`relative flex min-w-0 flex-col items-center gap-1.5 px-1 py-3 ${
                failed ? 'opacity-30' : 'animate-pulse'
              }`}
            >
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[8%] bottom-[8%] w-px"
                  style={{
                    background:
                      'linear-gradient(180deg, transparent, color-mix(in srgb, var(--color-bronze) 18%, transparent), transparent)',
                  }}
                />
              )}
              {/* heights mirror the real rows exactly, in the same order */}
              <span className="h-[13px] w-10 rounded-xs bg-(--color-text-mute)/20" />
              <span className="h-[9.5px] w-9 rounded-xs bg-(--color-text-mute)/12" />
              <span className="my-0.5 h-[13px] w-14 rounded-xs bg-(--color-text-mute)/15" />
              <Rule />
              <span className="h-[9px] w-8 rounded-xs bg-(--color-text-mute)/12" />
              <span className="h-[29px] w-12 rounded-xs bg-(--color-text-mute)/18" />
              <span className="h-[11px] w-9 rounded-xs bg-(--color-text-mute)/12" />
              <span className="h-[9px] w-9 rounded-xs bg-(--color-text-mute)/12" />
              <span className="h-[13px] w-7 rounded-xs bg-(--color-text-mute)/12" />
              <span className="my-0.5 h-6 w-6 rounded-full bg-(--color-text-mute)/15" />
              <span className="h-[19px] w-9 rounded-xs bg-(--color-text-mute)/18" />
              <span className="h-[10px] w-10 rounded-xs bg-(--color-text-mute)/12" />
              <span className="h-[9px] w-8 rounded-xs bg-(--color-text-mute)/12" />
              <span className="h-[13px] w-11 rounded-xs bg-(--color-text-mute)/12" />
            </div>
          ))}
        </div>

        <p
          className="mt-3.5 pt-2.5 text-right text-[8px] uppercase tracking-[0.18em] text-(--color-text-mute)"
          style={{
            borderTop: '1px solid transparent',
            borderImage:
              'linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-bronze) 32%, transparent), transparent) 1',
          }}
        >
          {failed ? 'Forecast unavailable just now' : 'Reading the swell…'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-5">
        {state.data.map((d, i) => {
          const day = new Date(d.date + 'T00:00:00');
          const today = i === 0;

          return (
            <div
              key={d.date}
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
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[8%] bottom-[8%] w-px"
                  style={{
                    background:
                      'linear-gradient(180deg, transparent, color-mix(in srgb, var(--color-bronze) 30%, transparent), transparent)',
                  }}
                />
              )}

              {/* day */}
              <span className="font-(family-name:--font-display) text-[13px] font-medium uppercase leading-none tracking-[0.16em] text-(--color-bronze-lit)">
                {today ? 'Today' : day.toLocaleDateString('en-NZ', { weekday: 'short' })}
              </span>

              {/* date */}
              <span className="-mt-0.5 text-[9.5px] uppercase tracking-[0.16em] text-(--color-text-mute)">
                {day.getDate()} {day.toLocaleDateString('en-NZ', { month: 'short' })}
              </span>

              {/* rating */}
              <Stars value={d.rating} />

              <Rule />

              {/* swell height + direction */}
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
                <span className="text-[10px] tracking-[0.14em] text-(--color-text-soft)">
                  {compass(d.swellDir) || '–'}
                </span>
              </span>

              {/* period */}
              <Label>Period</Label>
              <span className="text-[12px] tracking-[0.06em] tabular-nums text-(--color-text-soft)">
                {d.periodS != null ? `${Math.round(d.periodS)}s` : '–'}
              </span>

              {/* sky */}
              <WeatherIcon code={d.code} className="my-0.5 h-6 w-6 text-(--color-bronze-lit)" />

              {/* temperature */}
              <span className="font-(family-name:--font-display) text-[19px] font-medium leading-none tabular-nums text-(--color-text)">
                {d.tempMax != null ? `${Math.round(d.tempMax)}°` : '–'}
              </span>
              <span className="-mt-1 text-[10px] tracking-[0.06em] text-(--color-text-mute)">
                {d.tempMin != null ? `${Math.round(d.tempMin)}° low` : ''}
              </span>

              {/* wind */}
              <Label>Wind</Label>
              <span className="text-[12px] tracking-[0.06em] tabular-nums text-(--color-text-soft)">
                {d.windKmh != null ? `${Math.round(d.windKmh)} ${compass(d.windDir)}` : '–'}
              </span>
            </div>
          );
        })}
      </div>

      <p
        className="mt-3.5 pt-2.5 text-right text-[8px] uppercase tracking-[0.18em] text-(--color-text-mute)"
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
    </div>
  );
}
