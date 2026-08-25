import Price from '../components/Price.jsx';
import { UNITS, PRICING, buyoutRate, whatsappLink } from '../data/villa.js';
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
          <p className="max-w-sm text-(--color-text-soft)">
            Three rooms on the lower level sharing a kitchen and the small pool,
            a two-bedroom villa, and an apartment upstairs with the view.
          </p>
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
            {/* No standard discount — Alison's decision (05). A rate is quoted
                per enquiry rather than published, so a special price stays a
                choice rather than an expectation. */}
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

        {PRICING.introductory && (
          <p className="label mt-10 text-(--color-text-mute)">
            Introductory rates — opening 2026
          </p>
        )}
      </div>
    </section>
  );
}
