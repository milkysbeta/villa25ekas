/* ============================================================================
   Currency

   Prices are set and shown in IDR. On top of that we show an approximate
   converted price in the visitor's own currency — guessed from their browser,
   overridable by hand, remembered afterwards.

   Rates come from a free public endpoint with no key. If it fails we simply
   show nothing rather than a wrong number: a stale conversion on a villa site
   is worse than no conversion at all.
   ========================================================================= */

export const CURRENCIES = ['IDR', 'NZD', 'AUD', 'EUR', 'GBP', 'USD'];

const STORE_KEY = 'v25-currency';
const RATE_KEY = 'v25-rates';
const RATE_TTL = 12 * 60 * 60 * 1000; // twelve hours

/* Browser language → the currency that visitor most likely thinks in.
   Deliberately coarse: it is a helpful default, not a claim about anybody. */
const LOCALE_MAP = {
  'en-NZ': 'NZD', 'en-AU': 'AUD', 'en-GB': 'GBP', 'en-US': 'USD',
  'en-SG': 'USD', 'de': 'EUR', 'fr': 'EUR', 'nl': 'EUR', 'es': 'EUR',
  'it': 'EUR', 'pt': 'EUR', 'id': 'IDR',
};

export function guessCurrency() {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved && CURRENCIES.includes(saved)) return saved;
  } catch { /* private browsing */ }

  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const raw of langs) {
    if (!raw) continue;
    const tag = raw.trim();
    if (LOCALE_MAP[tag]) return LOCALE_MAP[tag];
    const base = tag.split('-')[0];
    if (LOCALE_MAP[base]) return LOCALE_MAP[base];
  }
  return 'IDR';
}

export function rememberCurrency(code) {
  try { localStorage.setItem(STORE_KEY, code); } catch { /* ignore */ }
}

/* Fetch IDR→* rates, cached in localStorage for twelve hours. */
export async function loadRates() {
  try {
    const raw = localStorage.getItem(RATE_KEY);
    if (raw) {
      const cached = JSON.parse(raw);
      if (Date.now() - cached.at < RATE_TTL && cached.rates) return cached.rates;
    }
  } catch { /* fall through and refetch */ }

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/IDR');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.result !== 'success' || !json.rates) throw new Error('bad payload');
    try {
      localStorage.setItem(RATE_KEY, JSON.stringify({ at: Date.now(), rates: json.rates }));
    } catch { /* ignore */ }
    return json.rates;
  } catch {
    return null; // show IDR only
  }
}

export function formatIdr(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(amount);
}

/* Converted prices are approximate, so we round them to something that looks
   approximate. A villa quoted at "NZD $164.83" reads like a mistake. */
export function formatConverted(idrAmount, code, rates) {
  if (!rates || code === 'IDR' || !rates[code]) return null;
  const value = idrAmount * rates[code];
  const rounded = value >= 100 ? Math.round(value / 5) * 5 : Math.round(value);
  return new Intl.NumberFormat('en', {
    style: 'currency', currency: code, maximumFractionDigits: 0,
  }).format(rounded);
}
