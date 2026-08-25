import { CONTACT, TRANSFER } from '../data/villa.js';
import { ROUTES, ROUTES_CAVEAT } from '../data/content.js';
import EkasMap from '../components/EkasMap.jsx';
import { formatIdr } from '../lib/currency.js';

const MAPS = `https://www.google.com/maps/search/?api=1&query=${CONTACT.coords.lat},${CONTACT.coords.lng}`;

/* John asked for the three ways in to be comparable — "fast boat if you have
   lots of boards and heavy luggage, slow boat if you are bringing a bike, or
   fly, cheaper, quicker" — so they sit side by side rather than in a list.

   Routes whose price and duration are still unknown say so in the alert colour
   rather than guessing. A wrong ferry price strands somebody. */
export default function Journey() {
  return (
    <section id="journey" className="bg-(--color-ink) px-5 py-28 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label text-(--color-bronze-lit)">Getting here</p>
            <h2 className="mt-6 max-w-2xl text-[clamp(2.1rem,4.4vw,3.6rem)]">
              It takes a bit of doing
            </h2>
          </div>
          <p className="max-w-sm text-(--color-text-soft)">
            That is rather the point. The road in is the reason the bay is still
            quiet, and the last twenty minutes are the best part of the trip.
          </p>
        </div>

        <EkasMap className="mt-14" />

        <ul className="mt-14 grid gap-px border border-(--color-line) bg-(--color-line) sm:grid-cols-2 lg:grid-cols-4">
          {ROUTES.map((r, i) => (
            <li key={r.id} className="bg-(--color-raise) p-8 lg:p-9">
              <span className="idx">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 text-2xl">{r.name}</h3>
              <p className="mt-4 text-[15.5px] text-(--color-text-soft)">{r.best}</p>

              <dl className="mt-5 flex flex-col gap-1.5">
                {r.legs.map((leg) => (
                  <div key={leg.label} className="flex items-baseline gap-3">
                    <dt className="w-20 shrink-0 text-[13px] uppercase tracking-[0.12em] text-(--color-text-mute)">
                      {leg.label}
                    </dt>
                    <dd className="text-[14px] text-(--color-text-soft)">{leg.detail}</dd>
                  </div>
                ))}
              </dl>

              {r.price && (
                <p className="mt-4 text-[15px] text-(--color-bronze-lit)">{r.price}</p>
              )}
              {r.note && (
                <p className="mt-2 text-[13px] text-(--color-text-mute)">{r.note}</p>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-6 text-[14px] text-(--color-text-mute)">{ROUTES_CAVEAT}</p>

        <div className="mt-10 flex flex-col gap-6 border border-(--color-line) bg-(--color-raise) p-8 sm:flex-row sm:items-center sm:justify-between lg:p-10">
          <div>
            <h3 className="text-2xl">We will meet you at the airport</h3>
            <p className="mt-3 max-w-lg text-(--color-text-soft)">
              {TRANSFER.airport.name} is {TRANSFER.airport.km} km away — an hour
              to an hour and a half, depending on the road.
            </p>
          </div>
          <div className="shrink-0 sm:text-right">
            <p className="font-(family-name:--font-display) text-3xl tabular-nums">
              {formatIdr(TRANSFER.priceIdr)}
            </p>
            <p className="mt-1 text-[14px] text-(--color-text-soft)">
              per vehicle, each way
            </p>
          </div>
        </div>

        <a
          href={MAPS}
          target="_blank"
          rel="noopener noreferrer"
          className="label btn btn-line mt-10 inline-block"
        >
          Open in Google Maps
        </a>
      </div>
    </section>
  );
}
