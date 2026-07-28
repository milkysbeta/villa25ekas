import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Price from '../components/Price.jsx';
import SurfForecast from '../components/SurfForecast.jsx';
import { UNITS, POWER, PRICING, buyoutRate, whatsappLink } from '../data/villa.js';

/* IMAGE SLOTS — drop files into site/public/ with these names and they appear.
   Nothing else needs changing. */
const HERO = '/hero.jpg';
const POOL = '/pool.jpg';

export default function Home() {
  const { t } = useTranslation();
  const cheapest = Math.min(...UNITS.map((u) => u.rate));

  return (
    <>
      {/* ---- hero ---------------------------------------------------------- */}
      <section className="relative flex min-h-[86dvh] items-end overflow-hidden bg-(--color-ink)">
        <div className="absolute inset-0 bg-cover bg-center"
             style={{ backgroundImage: `url(${HERO})` }} aria-hidden="true" />
        <div className="absolute inset-0 bg-(--color-ink)/55" aria-hidden="true" />
        <div className="absolute inset-0" aria-hidden="true"
             style={{ background: 'linear-gradient(to top, rgba(18,16,12,.92) 0%, rgba(18,16,12,.1) 55%)' }} />

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 lg:px-8 lg:pb-28">
          <p className="label text-(--color-bronze-lit)">{t('home.eyebrow')}</p>
          <h1 className="mt-5 max-w-3xl whitespace-pre-line text-4xl leading-[1.06] text-(--color-text-inv) sm:text-6xl lg:text-7xl">
            {t('home.headline')}
          </h1>
          <p className="mt-7 max-w-xl text-lg text-(--color-text-inv-s)">{t('home.sub')}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/stay"
                  className="label rounded-xs bg-(--color-bronze) px-8 py-4 font-semibold text-white transition-colors hover:bg-(--color-bronze-dim)">
              {t('home.cta')}
            </Link>
            <p className="label text-(--color-text-inv-s)">
              {t('stay.from')} <Price amount={cheapest} /> / {t('common.night')}
            </p>
          </div>
        </div>
      </section>

      {/* ---- off-grid, stated in numbers ----------------------------------- */}
      <section className="bg-(--color-ink) px-5 pb-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 border-t border-(--color-ink-line) pt-16 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="label text-(--color-bronze-lit)">{t('sustainability.title')}</p>
            <h2 className="mt-4 text-3xl text-(--color-text-inv) sm:text-4xl">
              The whole place runs on sunlight
            </h2>
            <p className="mt-6 max-w-md text-(--color-text-inv-s)">
              {t('sustainability.intro')}
            </p>
            <Link to="/off-grid"
                  className="label mt-8 inline-block border-b border-(--color-bronze-lit) pb-1 text-(--color-bronze-lit)">
              How it works
            </Link>
          </div>

          <dl className="grid grid-cols-2 gap-px self-start bg-(--color-ink-line) sm:grid-cols-3">
            {[
              [`${POWER.panelKwTotal}`, 'kW of solar'],
              [`${POWER.batteryKwh}`, 'kWh of battery'],
              [`${POWER.inverterKw}`, 'kW inverter'],
            ].map(([value, label]) => (
              <div key={label} className="bg-(--color-ink) p-7">
                <dd className="font-(family-name:--font-display) text-5xl text-(--color-bronze-lit) tabular-nums">
                  {value}
                </dd>
                <dt className="label mt-3 text-(--color-text-inv-s)">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- the rooms ----------------------------------------------------- */}
      <section className="bg-(--color-sand) px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="label text-(--color-bronze)">{t('stay.title')}</p>
          <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl">{t('stay.intro')}</h2>

          <ul className="mt-14 grid gap-8 md:grid-cols-3">
            {UNITS.map((unit) => (
              <li key={unit.id} className="flex flex-col border-t border-(--color-sand-line) pt-6">
                {/* IMAGE SLOT — site/public/units/{id}.jpg */}
                <div className="mb-6 aspect-4/3 w-full bg-(--color-sand-deep) bg-cover bg-center"
                     style={{ backgroundImage: `url(/units/${unit.id}.jpg)` }} />
                <h3 className="text-2xl">{unit.name}</h3>
                <p className="mt-3 flex-1 text-(--color-text-soft)">{unit.blurb}</p>
                <p className="mt-5">
                  <Price amount={unit.rate} className="font-(family-name:--font-display) text-xl" />
                  <span className="label ml-2 text-(--color-text-mute)">/ {t('common.night')}</span>
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-16 flex flex-col gap-5 border-t border-(--color-sand-line) pt-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl">{t('stay.buyout')}</h3>
              <p className="mt-2 text-(--color-text-soft)">{t('stay.buyoutNote')}</p>
            </div>
            <p>
              <Price amount={buyoutRate()} className="font-(family-name:--font-display) text-2xl" />
              <span className="label ml-2 text-(--color-text-mute)">/ {t('common.night')}</span>
            </p>
          </div>

          {PRICING.introductory && (
            <p className="label mt-8 text-(--color-text-mute)">{t('stay.introRates')}</p>
          )}
        </div>
      </section>

      {/* ---- surf ---------------------------------------------------------- */}
      <section className="bg-(--color-ink) px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div>
              <p className="label text-(--color-bronze-lit)">{t('surf.title')}</p>
              <h2 className="mt-4 text-3xl text-(--color-text-inv) sm:text-4xl">{t('surf.intro')}</h2>
              <Link to="/surf"
                    className="label mt-8 inline-block border-b border-(--color-bronze-lit) pb-1 text-(--color-bronze-lit)">
                The breaks
              </Link>
            </div>
            <div>
              <p className="label mb-5 text-(--color-text-inv-s)">{t('surf.forecast')}</p>
              <SurfForecast days={5} />
            </div>
          </div>
        </div>
      </section>

      {/* ---- closing ------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-(--color-ink) px-5 py-32 lg:px-8">
        <div className="absolute inset-0 bg-cover bg-center opacity-35"
             style={{ backgroundImage: `url(${POOL})` }} aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-3xl text-(--color-text-inv) sm:text-5xl">
            Come and see it for yourself
          </h2>
          <p className="mt-6 text-(--color-text-inv-s)">{t('contact.intro')}</p>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"
             className="label mt-10 inline-block rounded-xs bg-(--color-bronze) px-8 py-4 font-semibold text-white transition-colors hover:bg-(--color-bronze-dim)">
            {t('contact.whatsapp')}
          </a>
        </div>
      </section>
    </>
  );
}
