import { POWER } from '../data/villa.js';
import { IMAGES } from '../data/images.js';

/* The numbered materials list from the reference sites, used here because the
   order genuinely means something — it runs from what generates the power to
   what the building is made of.

   TODO once the follow-up form returns: water treatment detail, timber species
   and mill, and the electric bike fleet. Nothing here is invented; anything
   unknown is written as unknown. */
const SYSTEM = [
  { n: '01', title: 'Solar', note: `${POWER.panelKwTotal} kW across ${POWER.arrays} arrays` },
  { n: '02', title: 'Storage', note: `${POWER.batteryKwh} kWh — enough for the night` },
  { n: '03', title: 'Inverter', note: `${POWER.inverterKw} kW, the whole property at once` },
  { n: '04', title: 'Water', note: 'Reticulated from waste, back to the gardens' },
  { n: '05', title: 'Hardwood', note: 'Locally sourced, much of it recycled' },
];

export default function OffGrid() {
  return (
    <section id="off-grid" className="bg-(--color-shell)">
      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-2">
        {/* photograph */}
        <div
          className="min-h-[340px] bg-(--color-plate) bg-cover bg-center lg:min-h-[640px]"
          style={{ backgroundImage: `url(${IMAGES.offgrid.src})` }}
          role="img"
          aria-label={IMAGES.offgrid.alt}
        />

        <div className="flex flex-col justify-center px-5 py-24 lg:px-16 lg:py-32">
          <p className="label text-(--color-bronze-lit)">Off the grid</p>
          <h2 className="mt-6 text-[clamp(2rem,4vw,3.3rem)]">
            No grid. No generator.
            <br />
            No compromise.
          </h2>
          <p className="mt-7 max-w-md text-(--color-text-soft)">
            Plenty of places call themselves eco. Usually it means a panel on the
            roof and a card asking you to reuse your towel. This is the whole
            property running on sunlight, with enough battery to keep the air
            conditioning on until morning.
          </p>

          <ul className="mt-12 flex flex-col">
            {SYSTEM.map((row) => (
              <li
                key={row.n}
                className="flex items-baseline gap-5 border-t border-(--color-line) py-4 last:border-b"
              >
                <span className="idx">{row.n}</span>
                <span className="label flex-1 text-(--color-text)">{row.title}</span>
                <span className="text-right text-[15px] text-(--color-text-mute)">
                  {row.note}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* the numbers, stated plainly — this is the proof, so it gets its own band */}
      <div className="border-t border-(--color-line)">
        <dl className="mx-auto grid max-w-[1500px] gap-px bg-(--color-line) sm:grid-cols-2 lg:grid-cols-4">
          {[
            [`${POWER.panelKwTotal}`, 'kW of solar'],
            [`${POWER.batteryKwh}`, 'kWh of battery'],
            [`${POWER.inverterKw}`, 'kW inverter'],
            ['0', 'grid connection'],
          ].map(([value, label]) => (
            <div key={label} className="bg-(--color-shell) px-7 py-12 text-center lg:py-16">
              <dd className="font-(family-name:--font-display) text-5xl text-(--color-bronze-lit) tabular-nums lg:text-6xl">
                {value}
              </dd>
              <dt className="label mt-4 text-(--color-text-mute)">{label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
