import { useTranslation } from 'react-i18next';
import SurfForecast from '../components/SurfForecast.jsx';
import { BREAKS } from '../data/villa.js';

export default function Surf() {
  const { t } = useTranslation();

  return (
    <>
      <section className="bg-(--color-ink) px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="label text-(--color-bronze-lit)">{t('surf.title')}</p>
          <h1 className="mt-4 max-w-2xl text-4xl text-(--color-text-inv) sm:text-5xl">
            {t('surf.intro')}
          </h1>

          <div className="mt-16">
            <p className="label mb-5 text-(--color-text-inv-s)">{t('surf.forecast')}</p>
            <SurfForecast days={5} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <h2 className="text-3xl">The breaks</h2>
        <ul className="mt-10 grid gap-px bg-(--color-sand-line) sm:grid-cols-2 lg:grid-cols-4">
          {BREAKS.map((b) => (
            <li key={b.id} className="bg-(--color-sand) p-7">
              <h3 className="text-2xl">{b.name}</h3>
              {b.note && <p className="mt-3 text-(--color-text-soft)">{b.note}</p>}
            </li>
          ))}
        </ul>
        <p className="label mt-10 text-(--color-text-mute)">
          Swell direction, tide and season detail to follow
        </p>
      </section>
    </>
  );
}
