import Parallax from '../components/Parallax.jsx';
import { POWER } from '../data/villa.js';
import { IMAGES } from '../data/images.js';

/* The numbered materials list from the reference sites, used here because the
   order genuinely means something: it runs from what generates the power to
   what the building is made of.

   TODO once the follow-up form returns: water treatment detail, timber species
   and mill, and the electric bike fleet. Nothing here is invented; anything
   unknown is written as unknown. */
const SYSTEM = [
  { n: '01', title: 'Solar', note: `${POWER.panelKwTotal} kW across ${POWER.arrays} arrays` },
  { n: '02', title: 'Storage', note: `${POWER.batteryKwh} kWh, enough for the night` },
  { n: '03', title: 'Inverter', note: `${POWER.inverterKw} kW, the whole property at once` },
  { n: '04', title: 'Water', note: 'Reticulated from waste, back to the gardens' },
  { n: '05', title: 'Hardwood', note: 'Locally sourced, much of it recycled' },
];

/* THREE THINGS TO CHECK ABOUT THIS PHOTOGRAPH, none of which stop it working.

   It is not the villa. It is a split gate, guardian statues and a lotus pond,
   which is Balinese Hindu temple architecture. Lombok has such temples in the
   west (Lingsar, Batu Bolong), but the island is predominantly Sasak Muslim
   and this composition reads as Bali.

   It is not obviously off-grid. This page is about 12.6 kW of solar, 46 kWh of
   battery and water going back to the gardens. A temple does not illustrate
   any of that, so it reads as mood rather than evidence.

   And it may be generated. It is 1672x941, the exact size of the other two
   supplied images, which is an odd shape for three unrelated photographs to
   share. Worth knowing on a site that has just had its copy combed for the
   same tell.

   Used as asked, and the alt text describes the picture rather than claiming
   it is the property.

   ---------------------------------------------------------------------------

   The photograph used to sit in its own column beside the text. It is now the
   section's background, with the words on a pane of frosted glass over it.

   That pane is doing the legibility work, which is why the overlay above it can
   stay as light as it does: a backdrop blur throws away exactly the
   high-frequency detail that makes text hard to read on a photograph, so a
   lightly tinted blurred pane beats a heavy flat wash and leaves far more of
   the picture visible. */
export default function OffGrid() {
  return (
    <Parallax
      src={IMAGES.offgrid.src}
      alt={IMAGES.offgrid.alt}
      fit="width"
      ratio="1672 / 941"
      /* Deliberately light. The pane below carries the contrast. */
      overlay="linear-gradient(to bottom, rgba(16,14,11,.34) 0%, rgba(16,14,11,.40) 30%, rgba(16,14,11,.72) 62%, rgba(16,14,11,.96) 100%)"
    >
      <section id="off-grid" className="px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1500px]">

          {/* the frosted pane */}
          <div className="rounded-xs border border-(--color-line-lit) bg-(--color-ink)/40 p-7 backdrop-blur-lg lg:p-14">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
              <div>
                <p className="label text-(--color-bronze-lit)">Off the grid</p>
                <h2 className="mt-6 text-[clamp(2rem,4vw,3.3rem)]">
                  No grid. No generator.
                  <br />
                  No compromise.
                </h2>
                <p className="mt-7 max-w-md text-(--color-text-soft)">
                  Plenty of places call themselves eco. Usually it means a panel on
                  the roof and a card asking you to reuse your towel. This is the
                  whole property running on sunlight, with enough battery to keep
                  the air conditioning on until morning.
                </p>
              </div>

              <ul className="flex flex-col self-center">
                {SYSTEM.map((row) => (
                  <li
                    key={row.n}
                    className="flex items-baseline gap-5 border-t border-(--color-line-lit) py-4 last:border-b"
                  >
                    {/* `.idx` is bronze, which is fine on solid ground but only
                        reaches 3.1:1 through a 40 per cent pane over this
                        photograph, and these are 13 px. Bronze-lit takes it to
                        5.1. Overridden here rather than globally, because
                        everywhere else the class sits on something opaque. */}
                    <span className="idx text-(--color-bronze-lit)">{row.n}</span>
                    <span className="label flex-1 text-(--color-text)">{row.title}</span>
                    <span className="text-right text-[15px] text-(--color-text-soft)">
                      {row.note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* The numbers are the proof, so they keep their own band. Same glass,
              a touch more tint, because these are the largest figures on the
              site and they should sit forward of everything else. */}
          <dl className="mt-6 grid gap-px overflow-hidden rounded-xs border border-(--color-line-lit) bg-(--color-line-lit) sm:grid-cols-2 lg:grid-cols-4">
            {[
              [`${POWER.panelKwTotal}`, 'kW of solar'],
              [`${POWER.batteryKwh}`, 'kWh of battery'],
              [`${POWER.inverterKw}`, 'kW inverter'],
              ['0', 'grid connection'],
            ].map(([value, label]) => (
              <div
                key={label}
                className="bg-(--color-ink)/50 px-7 py-12 text-center backdrop-blur-lg lg:py-14"
              >
                <dd className="font-(family-name:--font-display) text-5xl text-(--color-bronze-lit) tabular-nums lg:text-6xl">
                  {value}
                </dd>
                <dt className="label mt-4 text-(--color-text-soft)">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </Parallax>
  );
}
