/* The badge is a raster file until a transparent PNG or SVG arrives.
   Until then this typographic lockup stands in — it is closer to right than a
   logo with black baked into its background sitting on a photograph. */
export default function Logo({ className = '', stacked = true, tone = 'light' }) {
  const ink = tone === 'light' ? 'text-(--color-text-inv)' : 'text-(--color-text)';
  const accent = tone === 'light' ? 'text-(--color-bronze-lit)' : 'text-(--color-bronze)';

  if (!stacked) {
    return (
      <span className={`inline-flex items-baseline gap-2.5 ${className}`}>
        <span className={`font-(family-name:--font-display) text-[13px] uppercase tracking-[0.4em] ${ink}`}>
          Villa
        </span>
        <span className={`font-(family-name:--font-display) text-[26px] leading-none ${accent}`}>25</span>
        <span className={`font-(family-name:--font-display) text-[13px] uppercase tracking-[0.4em] ${ink}`}>
          Ekas
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span className={`font-(family-name:--font-display) text-[15px] uppercase tracking-[0.42em] indent-[0.42em] ${ink}`}>
        Villa
      </span>
      <span className={`font-(family-name:--font-display) my-1.5 text-[52px] leading-none ${accent}`}>25</span>
      <span className={`font-(family-name:--font-display) text-[15px] uppercase tracking-[0.42em] indent-[0.42em] ${ink}`}>
        Ekas
      </span>
    </span>
  );
}
