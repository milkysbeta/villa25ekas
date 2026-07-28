import { useTranslation } from 'react-i18next';
import { CONTACT, TRANSFER } from '../data/villa.js';
import { formatIdr } from '../lib/currency.js';

const MAPS = `https://www.google.com/maps/search/?api=1&query=${CONTACT.coords.lat},${CONTACT.coords.lng}`;

/* Three routes in, presented so they can be compared rather than just listed.
   Operators and prices are still with the owners — anything unknown says so
   rather than guessing, because a wrong ferry price strands somebody. */
const ROUTES = [
  {
    key: 'fly',
    name: 'Fly',
    best: 'Quickest, and usually cheapest once you count the time.',
    detail: 'Into Lombok International (LOP), then about an hour and a half by road.',
    known: true,
  },
  {
    key: 'fast',
    name: 'Fast boat',
    best: 'Best if you are travelling with a quiver and heavy bags.',
    detail: 'Operator, price and crossing time to be confirmed.',
    known: false,
  },
  {
    key: 'slow',
    name: 'Slow boat',
    best: 'Cheapest, and the only option if you are bringing a motorbike.',
    detail: 'Operator, price and crossing time to be confirmed.',
    known: false,
  },
];

export default function GettingHere() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
      <p className="label text-(--color-bronze)">{t('gettingHere.title')}</p>
      <h1 className="mt-4 max-w-2xl text-4xl sm:text-5xl">{t('gettingHere.intro')}</h1>

      {/* IMAGE SLOT — the hand-illustrated map.
          site/public/map.png, ideally 2400px wide on a sand or transparent ground. */}
      <div
        className="mt-14 aspect-16/9 w-full bg-(--color-sand-deep) bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/map.png)' }}
      />

      <a
        href={MAPS}
        target="_blank"
        rel="noopener noreferrer"
        className="label mt-6 inline-block border-b border-(--color-bronze) pb-1 text-(--color-bronze)"
      >
        {t('gettingHere.openInMaps')}
      </a>

      <ul className="mt-20 grid gap-px bg-(--color-sand-line) lg:grid-cols-3">
        {ROUTES.map((r) => (
          <li key={r.key} className="bg-(--color-sand) p-8">
            <h2 className="text-2xl">{r.name}</h2>
            <p className="mt-3 text-(--color-text-soft)">{r.best}</p>
            <p className={`mt-4 text-sm ${r.known ? 'text-(--color-text-mute)' : 'text-(--color-alert)'}`}>
              {r.detail}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-20 border-t border-(--color-sand-line) pt-10">
        <h2 className="text-3xl">Airport transfers</h2>
        <p className="mt-4 max-w-xl text-(--color-text-soft)">
          {TRANSFER.airport.name} is {TRANSFER.airport.km} km away — between one and one
          and a half hours, depending on the road. We will arrange a driver to meet you.
        </p>
        <p className="mt-6 font-(family-name:--font-display) text-3xl tabular-nums">
          {formatIdr(TRANSFER.priceIdr)}
        </p>
        <p className="label mt-2 text-(--color-text-mute)">per vehicle, each way</p>
      </div>
    </section>
  );
}
