import { useTranslation } from 'react-i18next';
import Price from '../components/Price.jsx';
import { UNITS, PRICING, buyoutRate, whatsappLink } from '../data/villa.js';

export default function Stay() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
      <p className="label text-(--color-bronze)">{t('stay.title')}</p>
      <h1 className="mt-4 max-w-2xl text-4xl sm:text-5xl">{t('stay.intro')}</h1>

      <ul className="mt-16 flex flex-col gap-20">
        {UNITS.map((unit, i) => (
          <li key={unit.id} className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {/* IMAGE SLOT — site/public/units/{id}.jpg */}
            <div
              className={`aspect-4/3 bg-(--color-sand-deep) bg-cover bg-center ${i % 2 ? 'lg:order-2' : ''}`}
              style={{ backgroundImage: `url(/units/${unit.id}.jpg)` }}
            />
            <div className="self-center">
              {unit.count > 1 && (
                <p className="label text-(--color-bronze)">{unit.count} rooms</p>
              )}
              <h2 className="mt-3 text-3xl">{unit.name}</h2>
              <p className="mt-5 text-(--color-text-soft)">{unit.blurb}</p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {unit.features.map((f) => (
                  <li
                    key={f}
                    className="label rounded-xs border border-(--color-sand-line) px-3 py-1.5 text-(--color-text-mute)"
                  >
                    {f}
                  </li>
                ))}
              </ul>

              {unit.restricted && (
                <p className="mt-6 border-l-2 border-(--color-bronze) pl-4 text-sm text-(--color-text-soft)">
                  Available when the owners are away, and in blocks of two or three
                  weeks when they are here.
                </p>
              )}

              <p className="mt-8">
                <Price amount={unit.rate} className="font-(family-name:--font-display) text-3xl" />
                <span className="label ml-2 text-(--color-text-mute)">/ {t('common.night')}</span>
              </p>

              <a
                href={whatsappLink(`Enquiry — ${unit.name}, Villa 25 Ekas`)}
                target="_blank"
                rel="noopener noreferrer"
                className="label mt-6 inline-block rounded-xs bg-(--color-bronze) px-7 py-3.5 font-semibold text-white transition-colors hover:bg-(--color-bronze-dim)"
              >
                Enquire about this
              </a>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-24 border-t border-(--color-sand-line) pt-10">
        <h2 className="text-3xl">{t('stay.buyout')}</h2>
        <p className="mt-4 max-w-xl text-(--color-text-soft)">
          {t('stay.buyoutNote')} {Math.round(PRICING.buyoutDiscount * 100)}% off the
          combined rate, and the same discount on stays of three weeks or more.
        </p>
        <p className="mt-6">
          <Price amount={buyoutRate()} className="font-(family-name:--font-display) text-3xl" />
          <span className="label ml-2 text-(--color-text-mute)">/ {t('common.night')}</span>
        </p>
      </div>

      {PRICING.introductory && (
        <p className="label mt-12 text-(--color-text-mute)">{t('stay.introRates')}</p>
      )}
    </section>
  );
}
