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
      {/* text-soft rather than text-mute. This is 14 px and it is a price, so
          it has to be readable, and both the stay and availability pages now
          put it on a transparent pane over a photograph, where text-mute
          measures 2.68:1 against 4.96 for text-soft. */}
      {converted && (
        <span className="ml-2 text-sm text-(--color-text-soft) tabular-nums">≈ {converted}</span>
      )}
    </span>
  );
}
