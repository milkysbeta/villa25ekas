import Price from '../components/Price.jsx';
import { UNITS, PRICING, buyoutRate, whatsappLink, AMENITIES, HOUSE_RULES, STAY_TIMES } from '../data/villa.js';
import { NEIGHBOUR, BUILDING, POSITIONING } from '../data/content.js';
import { IMAGES } from '../data/images.js';

export default function Stay() {
  return (
    <section id="stay" className="bg-(--color-ink) px-5 py-28 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label text-(--color-bronze-lit)">The rooms</p>
            <h2 className="mt-6 max-w-2xl text-[clamp(2.1rem,4.4vw,3.6rem)]">
              Five rooms,
              <br />
              two pools, one bay
            </h2>
          </div>
          {/* John's positioning line, 25 Aug 2026. It sits here, above the
              rates, because it is the sentence that makes the rates make
              sense. */}
          <p className="max-w-sm text-(--color-text-soft)">{POSITIONING}</p>
        </div>

        <ul className="mt-16 grid gap-8 lg:grid-cols-3">
          {UNITS.map((unit) => {
            const img = IMAGES[unit.id];
            return (
              <li
                key={unit.id}
                className="group flex flex-col border border-(--color-line) bg-(--color-raise) transition-colors hover:border-(--color-line-lit)"
              >
                <div
                  className="aspect-4/3 w-full bg-(--color-plate) bg-cover bg-center"
                  style={{ backgroundImage: `url(${img.src})` }}
                  role="img"
                  aria-label={img.alt}
                />
                <div className="flex flex-1 flex-col p-7 lg:p-8">
                  {unit.count > 1 && (
                    <p className="label-sm text-(--color-bronze)">{unit.count} rooms</p>
                  )}
                  <h3 className="mt-2 text-2xl">{unit.name}</h3>
                  <p className="mt-4 flex-1 text-[15.5px] text-(--color-text-soft)">
                    {unit.blurb}
                  </p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {unit.features.map((f) => (
                      <li
                        key={f}
                        className="label-sm border border-(--color-line-lit) px-2.5 py-1.5 text-(--color-text-mute)"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 flex items-end justify-between gap-4 border-t border-(--color-line) pt-6">
                    <p>
                      <Price
                        amount={unit.rate}
                        className="font-(family-name:--font-display) text-2xl"
                      />
                      <span className="label-sm ml-1.5 text-(--color-text-mute)">/ night</span>
                    </p>
                    <a
                      href={whatsappLink(`Enquiry — ${unit.name}, Villa 25 Ekas`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label-sm shrink-0 border-b border-(--color-bronze) pb-1 text-(--color-bronze-lit)"
                    >
                      Enquire
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* whole-property buyout */}
        <div className="mt-10 flex flex-col gap-6 border border-(--color-line) bg-(--color-raise) p-8 sm:flex-row sm:items-center sm:justify-between lg:p-10">
          <div>
            <h3 className="text-2xl">Take the whole place</h3>
            {/* No standard discount. Alison's decision (05), and John confirmed
                it on 25 Aug 2026 — "no discounts for bigger bookings". A rate is
                quoted per enquiry rather than published, so a special price
                stays a choice rather than an expectation. */}
            <p className="mt-3 max-w-lg text-(--color-text-soft)">
              {PRICING.buyoutDiscount > 0
                ? `Every room, both pools, the run of the property — `
                  + `${Math.round(PRICING.buyoutDiscount * 100)}% off the combined rate.`
                : 'Every room, both pools, and the run of the property. Tell us '
                  + 'your dates and how many of you there are, and we will come '
                  + 'back with a price.'}
            </p>
          </div>
          <div className="shrink-0 sm:text-right">
            {PRICING.buyoutDiscount > 0 ? (
              <>
                <Price amount={buyoutRate()} className="font-(family-name:--font-display) text-3xl" />
                <p className="label-sm mt-1 text-(--color-text-mute)">per night</p>
              </>
            ) : (
              <a
                href={whatsappLink('Villa 25 Ekas — enquiry about taking the whole property')}
                target="_blank"
                rel="noopener noreferrer"
                className="label btn btn-solid whitespace-nowrap"
              >
                Ask for a price
              </a>
            )}
          </div>
        </div>

        {/* How the place is actually built and what it is like to be in it —
            John's words, 25 Aug 2026. After the rooms rather than before them,
            so the rates come first and this is what confirms them. */}
        <div className="mt-16 border-t border-(--color-line) pt-12">
          <h3 className="max-w-xl text-[clamp(1.7rem,3.2vw,2.4rem)] font-normal">
            Built for the light,
            <br />
            and for the shade
          </h3>
          <ul className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {BUILDING.map((b) => (
              <li key={b.id}>
                <p className="label border-b border-(--color-line-lit) pb-3 text-(--color-bronze)">
                  {b.title}
                </p>
                <p className="mt-4 text-[15.5px] leading-relaxed text-(--color-text-soft)">
                  {b.body}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* The villa next door. Alison: "The neighbouring villa not our" — so it
            is described as a neighbour, and nothing is promised on their behalf
            while question 09 (who invoices) is still open. */}
        {NEIGHBOUR.show && (
          <div className="mt-10 border-t border-(--color-line) pt-10">
            <h3 className="text-2xl">{NEIGHBOUR.heading}</h3>
            <p className="mt-3 max-w-xl text-(--color-text-soft)">{NEIGHBOUR.body}</p>
            <a
              href={whatsappLink('Villa 25 Ekas — enquiry for a larger group')}
              target="_blank"
              rel="noopener noreferrer"
              className="label btn btn-line mt-6 inline-block"
            >
              Ask about a larger group
            </a>
          </div>
        )}

        {/* Amenities and rules, from the property's own Booking.com listing —
            so these are confirmed rather than assumed. Stated plainly, because
            every one of them is better read before booking than discovered on
            arrival. */}
        <div className="mt-16 grid gap-12 border-t border-(--color-line) pt-12 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <div>
            <h3 className="text-2xl">What is here</h3>
            <div className="mt-8 grid gap-10 sm:grid-cols-3">
              {AMENITIES.map((g) => (
                <div key={g.group}>
                  <p className="label border-b border-(--color-line) pb-3 text-(--color-bronze)">
                    {g.group}
                  </p>
                  <ul className="mt-4 flex flex-col gap-2">
                    {g.items.map((item) => (
                      <li key={item} className="text-[15px] text-(--color-text-soft)">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl">Good to know</h3>
            <dl className="mt-8 flex flex-col">
              <div className="flex items-baseline justify-between gap-4 border-b border-(--color-line) py-3">
                <dt className="text-[15px] text-(--color-text-soft)">Check in</dt>
                <dd className="text-[15px] tabular-nums">
                  {STAY_TIMES.checkInFrom}–{STAY_TIMES.checkInTo}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-(--color-line) py-3">
                <dt className="text-[15px] text-(--color-text-soft)">Check out</dt>
                <dd className="text-[15px] tabular-nums">
                  {STAY_TIMES.checkOutFrom}–{STAY_TIMES.checkOutTo}
                </dd>
              </div>
            </dl>

            <ul className="mt-6 flex flex-col gap-2.5">
              {HOUSE_RULES.map((r) => (
                <li key={r.rule} className="flex items-baseline gap-3 text-[15px]">
                  <span
                    aria-hidden="true"
                    className={
                      r.tone === 'no'
                        ? 'text-(--color-alert)'
                        : r.tone === 'yes'
                          ? 'text-(--color-reef)'
                          : 'text-(--color-text-mute)'
                    }
                  >
                    {r.tone === 'no' ? '—' : r.tone === 'yes' ? '·' : '·'}
                  </span>
                  <span className="text-(--color-text-soft)">{r.rule}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-[14px] text-(--color-text-mute)">
              {STAY_TIMES.note}
            </p>
          </div>
        </div>

        {PRICING.introductory && (
          <p className="label mt-12 text-(--color-text-mute)">
            Introductory rates — opening 2026
          </p>
        )}
      </div>
    </section>
  );
}
