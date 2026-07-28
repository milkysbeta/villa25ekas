import { useEffect, useState } from 'react';
import { getForecast, compass } from '../lib/forecast.js';
import { CONTACT } from '../data/villa.js';

/* Five bars rather than five stars — stars on a surf site look like a review
   score, and this is a measurement, not an opinion. */
function Rating({ value }) {
  return (
    <div className="flex gap-[3px]" role="img" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, value - n + 1));
        return (
          <span key={n} className="relative block h-[3px] w-4 overflow-hidden bg-(--color-ink-line)">
            <span
              className="absolute inset-y-0 left-0 bg-(--color-bronze-lit)"
              style={{ width: `${fill * 100}%` }}
            />
          </span>
        );
      })}
    </div>
  );
}

export default function SurfForecast({ days = 5, compact = false }) {
  const [state, setState] = useState({ status: 'loading', data: null });

  useEffect(() => {
    let alive = true;
    getForecast({ lat: CONTACT.coords.lat, lng: CONTACT.coords.lng, days })
      .then((data) => alive && setState({ status: 'ok', data }))
      .catch(() => alive && setState({ status: 'error', data: null }));
    return () => { alive = false; };
  }, [days]);

  if (state.status === 'loading') {
    return (
      <p className="label text-(--color-text-inv-s)">Reading the swell…</p>
    );
  }

  if (state.status === 'error') {
    return (
      <p className="label text-(--color-text-inv-s)">
        Forecast unavailable just now
      </p>
    );
  }

  return (
    <div>
      <ul className={`grid gap-px bg-(--color-ink-line) ${
        compact ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
      }`}>
        {state.data.map((d) => {
          const day = new Date(d.date + 'T00:00:00');
          return (
            <li key={d.date} className="bg-(--color-ink) p-4">
              <p className="label text-(--color-bronze-lit)">
                {day.toLocaleDateString('en-NZ', { weekday: 'short' })}
              </p>
              <p className="mt-3 font-(family-name:--font-display) text-3xl text-(--color-text-inv) tabular-nums">
                {d.swellM != null ? d.swellM.toFixed(1) : '–'}
                <span className="ml-1 text-sm text-(--color-text-inv-s)">m</span>
              </p>
              <div className="mt-3">
                <Rating value={d.rating} />
              </div>
              <dl className="mt-4 space-y-1 text-[13px] text-(--color-text-inv-s) tabular-nums">
                <div className="flex justify-between gap-3">
                  <dt>Period</dt>
                  <dd>{d.periodS != null ? `${Math.round(d.periodS)}s` : '–'}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Swell</dt>
                  <dd>{compass(d.swellDir) || '–'}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Wind</dt>
                  <dd>
                    {d.windKmh != null ? `${Math.round(d.windKmh)} ` : '– '}
                    {compass(d.windDir)}
                  </dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
      <p className="label mt-4 text-(--color-text-inv-s)">
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
