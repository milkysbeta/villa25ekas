import SurfForecast from '../components/SurfForecast.jsx';
import { CONTACT, whatsappLink } from '../data/villa.js';
import { IMAGES, LOGO } from '../data/images.js';

const HERO = IMAGES.hero.src;

/* Instagram's glyph, drawn at the same 1.4 stroke as everything else on the
   page rather than dropped in as a filled brand asset — a solid full-colour
   badge would be the only thing on the page shouting. */
const InstagramMark = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

/* Same 1.4 stroke as the Instagram mark and the weather icons, so the three
   button rows read as one set rather than three borrowed icon packs. */
const PhoneMark = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"
       strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M6.2 3.6h3l1.5 3.8-2 1.3a11.5 11.5 0 0 0 5.6 5.6l1.3-2 3.8 1.5v3a1.8 1.8 0 0 1-2 1.8A15.8 15.8 0 0 1 4.4 5.6a1.8 1.8 0 0 1 1.8-2Z" />
  </svg>
);

const MessageMark = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"
       strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M20.5 12.4c0 3.9-3.8 7-8.5 7a9.8 9.8 0 0 1-2.6-.35L4.5 20.5l1.2-3.4A6.6 6.6 0 0 1 3.5 12.4c0-3.9 3.8-7 8.5-7s8.5 3.1 8.5 7Z" />
  </svg>
);

export default function ComingSoon() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-(--color-ink)">
      {/* photograph */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO})` }}
        aria-hidden="true"
      />
      {/* Two overlays rather than one: a flat wash to knock the whole image
          back, and a bottom-weighted gradient so the contact block stays
          readable regardless of what is in the lower third of the photo. */}
      <div className="absolute inset-0 bg-(--color-ink)/62" aria-hidden="true" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(18,16,12,.55) 0%, rgba(18,16,12,.15) 35%, rgba(18,16,12,.85) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="horizon absolute inset-x-0 top-0 z-20" />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
        {/* Decorative: the H1 below now carries the name, so announcing it here
            too would just make a screen reader say it twice. */}
        <img
          src={LOGO}
          alt=""
          width="220"
          height="220"
          className="h-44 w-auto object-contain sm:h-56"
        />

        <p className="label mt-5 text-(--color-bronze-lit)">Opening 2026</p>

        {/* Everything from the headline down sits on a sand-coloured scrim that
            starts at nothing and deepens as it falls, so the text further down
            has something to sit on without the photograph disappearing behind
            a flat panel. It reads as light catching the page, not as a box. */}
        <div className="relative w-full">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-8 -bottom-10 top-0 rounded-3xl"
            style={{
              background:
                'linear-gradient(to bottom, color-mix(in srgb, var(--color-sand) 0%, transparent) 0%, color-mix(in srgb, var(--color-sand) 3%, transparent) 45%, color-mix(in srgb, var(--color-sand) 5%, transparent) 100%)',
            }}
          />

          <div className="relative">
            <h1 className="mt-5 text-[2.75rem] leading-[1.06] text-(--color-text) sm:text-7xl">
              Villa 25 Ekas
            </h1>

            <h2 className="mt-5 text-[1.6rem] leading-tight text-(--color-bronze-lit) sm:text-4xl">
              Your perfect Island getaway
            </h2>

            <p className="mx-auto mt-8 max-w-xl text-xl leading-relaxed text-(--color-text-soft) sm:text-[1.4rem]">
              Five rooms above Ekas Bay, Lombok. Run on sunlight, built from
              local timber, four minutes from the sand.
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xs bg-(--color-bronze) px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.2em] text-[#14110C] transition-colors hover:bg-(--color-bronze-lit)"
              >
                Enquire on WhatsApp
              </a>
              {/* Two targets on one line: tel: opens the dialler, sms: opens a
                  message. Split so nobody has to copy the number out by hand —
                  and on a desktop, where neither does anything useful, the
                  number is still right there to read. */}
              <a
                href={`tel:${CONTACT.phone}`}
                className="inline-flex items-center gap-2.5 rounded-xs border border-(--color-line-lit) px-8 py-4 text-[13px] uppercase tracking-[0.2em] text-(--color-text) transition-colors hover:border-(--color-bronze-lit) hover:text-(--color-bronze-lit)"
              >
                <PhoneMark className="h-[17px] w-[17px]" />
                {CONTACT.phoneShow}
              </a>
              <a
                href={`sms:${CONTACT.phone}`}
                className="inline-flex items-center gap-2.5 rounded-xs border border-(--color-line-lit) px-8 py-4 text-[13px] uppercase tracking-[0.2em] text-(--color-text) transition-colors hover:border-(--color-bronze-lit) hover:text-(--color-bronze-lit)"
              >
                <MessageMark className="h-[17px] w-[17px]" />
                Text us
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="rounded-xs border border-(--color-line-lit) px-8 py-4 text-[13px] uppercase tracking-[0.2em] text-(--color-text) transition-colors hover:border-(--color-bronze-lit) hover:text-(--color-bronze-lit)"
              >
                {CONTACT.email}
              </a>
              <a
                href={`https://instagram.com/${CONTACT.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xs border border-(--color-line-lit) px-8 py-4 text-[13px] uppercase tracking-[0.2em] text-(--color-text) transition-colors hover:border-(--color-bronze-lit) hover:text-(--color-bronze-lit)"
              >
                <InstagramMark className="h-[17px] w-[17px]" />
                @{CONTACT.instagram}
              </a>
            </div>

            <p className="mt-7 text-[13px] uppercase tracking-[0.24em] text-(--color-text-soft)">
              {CONTACT.location}
            </p>

            {/* Below the contact details on purpose — it proves the site is
                alive without competing with the reason people came. */}
            <div className="mt-8 w-full border-t border-(--color-line) pt-7">
              <p className="mb-6 text-[15px] uppercase tracking-[0.24em] text-(--color-bronze-lit)">
                The swell this week
              </p>
              <SurfForecast days={5} />
            </div>

            {/* A reprise of the mark to close the page off, tight against the
                notes beneath it so the three read as one sign-off rather than
                three separate things at the bottom of the page. */}
            <img
              src={LOGO}
              alt=""
              width="72"
              height="72"
              className="mx-auto mt-6 mb-0 h-16 w-auto object-contain"
            />

            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-(--color-text-mute)">
              Full booking website coming soon
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-(--color-text-mute)/70">
              Web design by Milky
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
