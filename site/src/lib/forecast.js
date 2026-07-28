/* ============================================================================
   Surf forecast

   Ported from the widget builder in "Weather Widget/surf-widget-editor.html".
   Same two Open-Meteo endpoints, same rating maths — free, no API key, no
   attribution obligation beyond a link back, which we honour in the footer.

   Kept as a plain module rather than a component so the admin portal can reuse
   the rating function when flagging good swells.
   ========================================================================= */

const MARINE = 'https://marine-api.open-meteo.com/v1/marine';
const WEATHER = 'https://api.open-meteo.com/v1/forecast';

/* Rating, 0–5 in half steps.
   Size counts for 55%, period 45%, then wind knocks it down. A big sloppy
   swell and a small clean one can score the same, which is about right. */
export function rate(heightM, periodS, windKmh, { hMax = 3, windPenalty = 0.55 } = {}) {
  if (heightM == null) return 0;
  const size = clamp01(heightM / hMax);
  const per = clamp01(((periodS ?? 8) - 5) / 9);
  const wind = windKmh == null ? 0 : clamp01((windKmh - 15) / 30);
  const raw = (size * 0.55 + per * 0.45) * (1 - wind * windPenalty);
  return Math.max(0, Math.min(5, Math.round(raw * 5 * 2) / 2));
}

const clamp01 = (n) => Math.max(0, Math.min(1, n));

export function compass(deg) {
  if (deg == null) return '';
  const points = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return points[Math.round(deg / 22.5) % 16];
}

/**
 * Fetch a forecast for one point.
 * @returns {Promise<Array<{date,swellM,periodS,swellDir,windKmh,windDir,tempMax,tempMin,code,rating}>>}
 */
export async function getForecast({ lat, lng, days = 5 }) {
  const qs = `latitude=${lat}&longitude=${lng}&timezone=auto&forecast_days=${days}`;

  const [marine, weather] = await Promise.all([
    json(`${MARINE}?${qs}&daily=swell_wave_height_max,swell_wave_direction_dominant,swell_wave_period_max`),
    json(`${WEATHER}?${qs}&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant`),
  ]);

  const m = marine.daily;
  const w = weather.daily;

  return m.time.map((date, i) => {
    const swellM = m.swell_wave_height_max?.[i] ?? null;
    const periodS = m.swell_wave_period_max?.[i] ?? null;
    const windKmh = w.wind_speed_10m_max?.[i] ?? null;
    return {
      date,
      swellM,
      periodS,
      swellDir: m.swell_wave_direction_dominant?.[i] ?? null,
      windKmh,
      windDir: w.wind_direction_10m_dominant?.[i] ?? null,
      tempMax: w.temperature_2m_max?.[i] ?? null,
      tempMin: w.temperature_2m_min?.[i] ?? null,
      code: w.weather_code?.[i] ?? null,
      rating: rate(swellM, periodS, windKmh),
    };
  });
}

async function json(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
