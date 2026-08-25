import Parallax from '../components/Parallax.jsx';
import SurfForecast from '../components/SurfForecast.jsx';
import { IMAGES } from '../data/images.js';
import { BREAKS, SURF_CAM } from '../data/villa.js';
import { WATER } from '../data/content.js';

/* The forecast lives here, on the page, rather than on a tab of its own. It is
   the thing a surfer opens the site to see, and burying it a click away would
   be the wrong instinct. */
export default function Surf() {
  /* WATER[0] is the surf paragraph and it does the job of this section's
     standfirst, so it is used there rather than repeated below. The rest —
     kite, foil, dive — get the band under the breaks. */
  const surf = WATER.find((w) => w.id === 'surf');
  const rest = WATER.filter((w) => w.id !== 'surf');

  return (
    <Parallax
      src={IMAGES.surf.src}
      alt={IMAGES.surf.alt}
      speed={0.14}
      overlay="linear-gradient(to bottom, rgba(16,14,11,.92) 0%, rgba(16,14,11,.86) 50%, rgba(16,14,11,.95) 100%)"
    >
      <section id="surf" className="px-5 py-28 lg:px-10 lg:py-40">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="label text-(--color-bronze-lit)">The surf</p>
              <h2 className="mt-6 max-w-2xl text-[clamp(2.1rem,4.4vw,3.6rem)]">
                It breaks in front
                <br />
                of the villa
              </h2>
            </div>
            <p className="max-w-sm text-(--color-text-soft)">{surf.body}</p>
          </div>

          {/* Live cam, if one ever exists. See SURF_CAM in data/villa.js —
              there is no camera on this bay at present, so this stays hidden
              rather than linking somewhere with nothing to show. */}
          {SURF_CAM.url && (
            <div className="mt-16">
              <p className="mb-5 text-[15px] uppercase tracking-[0.2em] text-(--color-bronze-lit)">
                Live from the bay
              </p>
              <div className="overflow-hidden border border-(--color-line) bg-(--color-plate)">
                {SURF_CAM.kind === 'iframe' ? (
                  <iframe
                    src={SURF_CAM.url}
                    title="Live view of Ekas Bay"
                    allow="autoplay; fullscreen"
                    loading="lazy"
                    className="aspect-video w-full border-0"
                  />
                ) : (
                  <img src={SURF_CAM.url} alt="Live view of Ekas Bay" className="block w-full" />
                )}
              </div>
              {SURF_CAM.credit && (
                <p className="mt-3 text-[14px] text-(--color-text-mute)">{SURF_CAM.credit}</p>
              )}
            </div>
          )}

          <div className="mt-16">
            <p className="mb-6 text-[15px] uppercase tracking-[0.2em] text-(--color-text-soft)">
              Five-day forecast
            </p>
            <SurfForecast days={5} />
          </div>

          <ul className="mt-16 grid gap-px border border-(--color-line) bg-(--color-line) sm:grid-cols-2 lg:grid-cols-4">
            {BREAKS.map((b, i) => (
              <li key={b.id} className="bg-(--color-ink)/70 p-7 backdrop-blur-xs">
                <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 text-2xl">{b.name}</h3>
                {b.note && (
                  <p className="mt-3 text-[15px] text-(--color-text-soft)">{b.note}</p>
                )}
              </li>
            ))}
          </ul>

          <p className="label mt-8 text-(--color-text-mute)">
            Swell direction, tide and season detail to follow
          </p>

          {/* Kite, foil and dive. Given real estate rather than a footnote,
              because a bay that does all four is the actual argument for
              coming here over anywhere else on the island. */}
          <div className="mt-24 border-t border-(--color-line-lit) pt-16">
            <p className="label text-(--color-bronze-lit)">Not only surf</p>
            <h3 className="mt-5 max-w-2xl text-[clamp(1.7rem,3.2vw,2.6rem)] font-normal">
              The bay does rather more
              <br />
              than one thing
            </h3>

            <ul className="mt-12 grid gap-px bg-(--color-line) md:grid-cols-3">
              {rest.map((w) => (
                <li key={w.id} className="bg-(--color-ink)/70 p-8 backdrop-blur-xs">
                  <h4 className="text-xl text-(--color-bronze-lit)">{w.title}</h4>
                  <p className="mt-4 text-[15.5px] leading-relaxed text-(--color-text-soft)">
                    {w.body}
                  </p>
                  {w.footnote && (
                    <p className="mt-4 border-t border-(--color-line) pt-4 text-[14px] text-(--color-text-mute)">
                      {w.footnote}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </Parallax>
  );
}
