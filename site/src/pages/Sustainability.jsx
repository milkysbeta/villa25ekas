import { POWER } from '../data/villa.js';

/* The strongest differentiator on the site, and the one section written from
   real numbers rather than adjectives. Every claim here traces to John's spec
   — anything still unconfirmed is marked in the data file, not softened here.

   TODO once the follow-up form comes back: water treatment detail, timber
   species and mill, electric bike fleet and rate, and confirmation of whether
   the system is genuinely fully off-grid or grid-tied with battery backup. */
export default function Sustainability() {
  return (
    <>
      <section className="bg-(--color-ink) px-5 py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <p className="label text-(--color-bronze-lit)">Off the grid</p>
          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.08] text-(--color-text-inv) sm:text-6xl">
            No grid, no generator,<br />no compromise
          </h1>
          <p className="mt-8 max-w-xl text-lg text-(--color-text-inv-s)">
            Plenty of places call themselves eco. It usually means a panel on the
            roof and a card asking you to reuse your towel. This is the whole
            property, running on sunlight, with enough battery to keep the air
            conditioning on all night.
          </p>

          <dl className="mt-16 grid gap-px bg-(--color-ink-line) sm:grid-cols-2 lg:grid-cols-4">
            {[
              [`${POWER.panelKwTotal} kW`, 'of panels', `${POWER.arrays} arrays at ${POWER.arrayVoltage} V`],
              [`${POWER.batteryKwh} kWh`, 'of storage', 'Enough to run through the night'],
              [`${POWER.inverterKw} kW`, 'inverter', 'Handles the whole property at once'],
              ['0', 'grid connection', 'Nothing to cut out'],
            ].map(([value, label, note]) => (
              <div key={label} className="bg-(--color-ink) p-8">
                <dd className="font-(family-name:--font-display) text-5xl text-(--color-bronze-lit) tabular-nums">
                  {value}
                </dd>
                <dt className="label mt-3 text-(--color-text-inv)">{label}</dt>
                <p className="mt-2 text-sm text-(--color-text-inv-s)">{note}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-(--color-sand) px-5 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-3">
          {[
            {
              title: 'The water goes back',
              body:
                'What the villa uses is treated and returned to the gardens, so the ' +
                'planting is kept alive by the place itself rather than by a tanker ' +
                'coming down the road.',
              todo: 'Detail pending — greywater only, or blackwater too? Rainwater capture?',
            },
            {
              title: 'The timber came from here',
              body:
                'Sourced locally and milled nearby, rather than shipped in. It is the ' +
                'reason the building feels like it belongs on this hillside instead of ' +
                'being dropped onto it.',
              todo: 'Species and mill still to confirm.',
            },
            {
              title: 'Electric bikes',
              body:
                'Charged from the same panels that run the villa. Enough range to get ' +
                'you along the coast and back without a drop of fuel.',
              todo: 'Fleet size, model and daily rate still to confirm.',
            },
          ].map((card) => (
            <article key={card.title} className="border-t border-(--color-sand-line) pt-6">
              <h2 className="text-2xl">{card.title}</h2>
              <p className="mt-4 text-(--color-text-soft)">{card.body}</p>
              {import.meta.env.DEV && (
                <p className="label mt-4 text-(--color-alert)">TODO — {card.todo}</p>
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
