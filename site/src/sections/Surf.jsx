import { useState } from 'react';
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

  /* Which break the forecast is titled for. Opens on the first one — Inside
     Ekas, the one you can see from the villa — and the cards below the forecast
     switch it.

     WHAT THIS DOES AND DOES NOT DO. It changes the title. The numbers are the
     same numbers, because there is one set: the forecast is fetched for the
     villa's own coordinates, and Open-Meteo's marine model is a coarse grid
     that would return the same cell for all four of these anyway — they sit
     within about five kilometres of each other. Inside really does behave
     differently from Outside, but that is local sheltering, and no global model
     resolves it. Wiring four separate fetches would quadruple the requests to
     produce four identical tables and imply a precision that is not there. */
  const [breakId, setBreakId] = useState(BREAKS[0].id);
  const picked = BREAKS.find((b) => b.id === breakId) ?? BREAKS[0];

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

          {/* The same wash the forecast puts behind today, scaled up to the
              whole five days: 10 per cent bronze fading out by 70 per cent of
              the height, and the same rounded corner. Warm rather than dark, so
              it lifts the block off the photograph without boxing it in.

              The horizontal padding is small and it has to stay small. The five
              columns are the tightest thing on the page: at 375 px they are
              67 px each, and the star rating inside them is 63 px wide. Every
              pixel of side padding comes straight off the columns, so anything
              past about 4 px each side and the ratings spill their cells. */}
          <div
            className="mt-16 rounded-lg px-1 py-5 backdrop-blur-xs sm:px-4 lg:px-6"
            style={{
              background:
                'linear-gradient(180deg, color-mix(in srgb, var(--color-bronze) 10%, transparent), transparent 70%)',
            }}
          >
            <p className="mb-6 text-[15px] uppercase tracking-[0.2em] text-(--color-text-soft)">
              Five day surf forecast
              <span className="text-(--color-bronze-lit)"> · {picked.name}</span>
            </p>
            {/* The footer already credits Open-Meteo site-wide, so it is not
                repeated here. The holding page keeps its own copy — it has no
                footer, and the attribution is required. */}
            <SurfForecast days={5} credit={false} />
          </div>

          {/* The cards double as the forecast's break selector. They were
              already a row of four things named exactly what the title needs,
              so making them the control is less to learn than a separate row of
              tabs would be — and they still read as cards if nobody clicks. */}
          <ul className="mt-16 grid gap-px border border-(--color-line) bg-(--color-line) sm:grid-cols-2 lg:grid-cols-4">
            {BREAKS.map((b, i) => {
              const on = b.id === breakId;
              return (
                <li key={b.id} className="bg-(--color-ink)/70 backdrop-blur-xs">
                  <button
                    type="button"
                    onClick={() => setBreakId(b.id)}
                    aria-pressed={on}
                    className={`flex h-full w-full flex-col p-7 text-left transition-colors ${
                      on ? 'bg-(--color-bronze)/12' : 'hover:bg-(--color-bronze)/6'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                      {/* the marker only appears on the selected one, so the
                          row does not carry four identical dots doing nothing */}
                      {on && (
                        <span
                          aria-hidden="true"
                          className="block h-1.5 w-1.5 rounded-full bg-(--color-bronze-lit)"
                        />
                      )}
                    </span>
                    <h3 className={`mt-3 text-2xl ${on ? 'text-(--color-bronze-lit)' : ''}`}>
                      {b.name}
                    </h3>
                    {b.note && (
                      <p className="mt-3 text-[15px] text-(--color-text-soft)">{b.note}</p>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="mt-5 text-[14px] text-(--color-text-mute)">
            Pick a break to title the forecast. The readings are for the bay as a
            whole &mdash; one set of numbers, not four.
          </p>

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
