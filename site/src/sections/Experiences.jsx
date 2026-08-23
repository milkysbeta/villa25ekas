import { EXPERIENCES } from '../data/content.js';
import { whatsappLink } from '../data/villa.js';
import { formatIdr } from '../lib/currency.js';

/* Two columns of hairline-divided rows rather than cards. Cards would give
   eight equal-weight boxes, and these are not equal — one has a price and the
   rest are conversations. A list lets the priced one stand out honestly. */
export default function Experiences() {
  return (
    <section id="experiences" className="bg-(--color-ink) px-5 py-28 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label text-(--color-bronze-lit)">Experiences</p>
            <h2 className="mt-6 max-w-2xl text-[clamp(2.1rem,4.4vw,3.6rem)]">
              Everything else,
              <br />
              arranged for you
            </h2>
          </div>
          <p className="max-w-sm text-(--color-text-soft)">
            Tell us what you want from the week and we will line it up before you
            arrive. Most of it is a phone call to someone we know.
          </p>
        </div>

        <ul className="mt-16 grid gap-x-16 md:grid-cols-2">
          {EXPERIENCES.map((x) => (
            <li
              key={x.id}
              className="flex items-start justify-between gap-6 border-t border-(--color-line) py-6"
            >
              <div className="min-w-0">
                <h3 className="text-2xl">{x.name}</h3>
                <p className="mt-2.5 max-w-md text-[15.5px] text-(--color-text-soft)">
                  {x.blurb}
                </p>
              </div>

              <div className="shrink-0 pt-1.5 text-right">
                {x.priceIdr ? (
                  <>
                    <p className="font-(family-name:--font-display) text-xl tabular-nums">
                      {formatIdr(x.priceIdr)}
                    </p>
                    {x.priceNote && (
                      <p className="label-sm mt-1 text-(--color-text-mute)">{x.priceNote}</p>
                    )}
                  </>
                ) : (
                  <p className="label-sm text-(--color-text-mute)">On request</p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-14 border-t border-(--color-line) pt-10">
          <a
            href={whatsappLink('Villa 25 Ekas — I would like to ask about experiences')}
            target="_blank"
            rel="noopener noreferrer"
            className="label btn btn-line"
          >
            Ask us about any of it
          </a>
        </div>
      </div>
    </section>
  );
}
