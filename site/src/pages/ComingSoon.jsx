import SurfForecast from '../components/SurfForecast.jsx';
import { CONTACT, whatsappLink, POWER } from '../data/villa.js';
import { IMAGES, LOGO } from '../data/images.js';

const HERO = IMAGES.hero.src;

export default function ComingSoon() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-(--color-ink)">
      {/* photograph */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO})` }}
        aria-hidden="true"
      />
      {/* Two overlays rather than one: a flat wash to knock the whole image
          back, and a bottom-weighted gradient so the contact block stays
          readable regardless of what is in the lower third of the photo. */}
      <div className="absolute inset-0 bg-(--color-ink)/62" aria-hidden="true" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(18,16,12,.55) 0%, rgba(18,16,12,.15) 35%, rgba(18,16,12,.85) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="horizon absolute inset-x-0 top-0 z-20" />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
        <img src={LOGO} alt="Villa 25 Ekas" width="120" height="120" className="h-28 w-auto object-contain" />

        <p className="label mt-14 text-(--color-bronze-lit)">Opening 2026</p>

        <h1 className="mt-5 text-4xl leading-[1.08] text-(--color-text) sm:text-6xl">
          Your perfect getaway
        </h1>

        <p className="mt-6 max-w-md text-lg text-(--color-text-soft)">
          Five rooms above Ekas Bay, Lombok. Run on sunlight, built from local
          timber, four minutes from the sand.
        </p>

        {/* The off-grid spec, stated plainly. Most villas claiming to be "eco"
            have one panel on the roof; this is a genuinely large system and
            saying the numbers out loud is the proof. */}
        <dl className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {[
            [`${POWER.panelKwTotal} kW`, 'of solar'],
            [`${POWER.batteryKwh} kWh`, 'of battery'],
            ['0', 'grid'],
          ].map(([value, label]) => (
            <div key={label}>
              <dd className="font-(family-name:--font-display) text-3xl text-(--color-bronze-lit) tabular-nums">
                {value}
              </dd>
              <dt className="label mt-1 text-(--color-text-soft)">{label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="label rounded-xs bg-(--color-bronze) px-7 py-4 font-semibold text-white transition-colors hover:bg-(--color-bronze-dim)"
          >
            Enquire on WhatsApp
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="label rounded-xs border border-(--color-line) px-7 py-4 text-(--color-text) transition-colors hover:border-(--color-bronze-lit) hover:text-(--color-bronze-lit)"
          >
            {CONTACT.email}
          </a>
        </div>

        <p className="label mt-8 text-(--color-text-soft)">{CONTACT.location}</p>

        {/* Small, and below the contact details on purpose — it proves the site
            is alive without competing with the reason people are here. */}
        <div className="mt-20 w-full border-t border-(--color-line) pt-10">
          <p className="label mb-5 text-(--color-bronze-lit)">The swell this week</p>
          <SurfForecast days={5} compact />
        </div>

        <a
          href={`https://instagram.com/${CONTACT.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="label mt-12 text-(--color-text-soft) underline-offset-4 transition-colors hover:text-(--color-bronze-lit) hover:underline"
        >
          @{CONTACT.instagram}
        </a>
      </div>
    </div>
  );
}
