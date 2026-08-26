import { useContext } from 'react';
import { Currency, CurrencySet } from '../lib/context.js';
import { CURRENCIES } from '../lib/currency.js';

/* ============================================================================
   Currency picker

   This used to sit in the header, on every page. Most of the site has no money
   on it at all — the surf forecast, the map, the journal — so it was a control
   that did nothing visible nine times out of ten, taking up room in a bar that
   was being made thinner.

   It now appears next to the prices it changes, which is also where somebody
   looks when they want to change one.

   The choice itself is still global and still remembered, so switching on the
   stay page and then opening availability shows the same currency. Only the
   control moved.
   ========================================================================= */
export default function CurrencyPicker({ className = '', label = 'Show prices in' }) {
  const currency = useContext(Currency);
  const setCurrency = useContext(CurrencySet);
  const id = `currency-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <label htmlFor={id} className="label-sm text-(--color-text-soft)">
        {label}
      </label>
      <select
        id={id}
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="cursor-pointer rounded-xs border border-(--color-line-lit) px-3 py-3 text-[14px] uppercase tracking-[0.1em] text-(--color-text) hover:border-(--color-bronze)"
        /* Inline, because the Tailwind opacity form of this
           (`bg-(--color-ink)/45`) is not emitted into the stylesheet in this
           project and the control ends up fully transparent. */
        style={{ backgroundColor: 'color-mix(in oklab, var(--color-ink) 55%, transparent)' }}
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c} className="bg-(--color-ink)">{c}</option>
        ))}
      </select>
    </div>
  );
}
