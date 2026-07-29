import { useContext, useEffect, useState } from 'react';
import { Currency } from '../lib/context.js';
import { formatIdr, formatConverted, loadRates } from '../lib/currency.js';

/* IDR is always the real price. The converted figure sits alongside it, marked
   approximate, and disappears entirely if the rate lookup fails — a stale
   conversion on a villa site is worse than none at all. */
export default function Price({ amount, className = '' }) {
  const currency = useContext(Currency);
  const [rates, setRates] = useState(null);

  useEffect(() => {
    let alive = true;
    loadRates().then((r) => alive && setRates(r));
    return () => { alive = false; };
  }, []);

  const converted = formatConverted(amount, currency, rates);

  return (
    <span className={className}>
      <span className="tabular-nums">{formatIdr(amount)}</span>
      {converted && (
        <span className="ml-2 text-sm text-(--color-text-mute) tabular-nums">≈ {converted}</span>
      )}
    </span>
  );
}
