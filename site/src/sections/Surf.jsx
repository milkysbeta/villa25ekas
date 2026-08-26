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
      /* Full width, so the whole frame is there — the sea stack on the left
         and the shoulder of the wave on the right were both being cropped
         away by `cover` on a section this tall. */
      fit="width"
      ratio="1672 / 941"
      /* `fit="width"` does not translate — see the note in Parallax. */
      /* Opened up from 92/86/95 per cent, which was dark enough that the
         photograph behind it may as well not have been there.

         Not a straight copy of the hero, and the reason is measurable. The
         hero sits at about 48 per cent through its middle, but it holds one
         short block of text over mostly dark water. This photograph is a
         breaking wave: a broad band of white foam runs straight through where
         this section puts its text. Sampling the image and compositing it
         against these stops, 48 per cent leaves body text at roughly 2.4:1
         over the foam — well under the 4.5:1 needed to read.

         Retuned again once the photograph went full width. It now occupies the
         top 35 per cent of the section and fades out, rather than being
         stretched behind the whole thing, so the gradient is lightest over that
         band and closes to solid below it — the reverse of what it was.

         66 per cent over the photograph is as light as this image allows: it
         holds the 95th-percentile contrast at about 4.5:1, and every step
         lighter takes body text under the line. */
      overlay="linear-gradient(to bottom, rgba(16,14,11,.66) 0%, rgba(16,14,11,.74) 20%, rgba(16,14,11,.90) 38%, rgba(16,14,11,.97) 100%)"
    >
      {/* A soft shadow on everything that sits straight on the photograph.
          The overlay handles the general case; this covers the few places
          where a line of text lands on the brightest part of the foam, which
          no single overlay value can solve without blacking the picture out.
          Anything inside a card sets its own background and is unaffected. */}
      <section
        id="surf"
        className="px-5 py-28 lg:px-10 lg:py-40"
        style={{ textShadow: '0 1px 2px rgba(16,14,11,.85), 0 0 14px rgba(16,14,11,.55)' }}
      >
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
